"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";

type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: Record<string, any>;
  selectedDoctor: doctorAgent;
  createdOn: string;
};

type Message = {
  role: string;
  text: string;
};

function MedicalVoiceAgent() {
  const params = useParams();
  const sessionId = params?.sessionId as string;

  const [callStarted, setCallStarted] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(null);

  // ✅ Fix 1: useRef so vapiInstance is always synchronously available
  const vapiRef = useRef<Vapi | null>(null);

  const GetSessionDetails = useCallback(async () => {
    try {
      const result = await axios.get("/api/session-chat?sessionId=" + sessionId);
      setSessionDetail(result.data);
    } catch (error) {
      console.error("Error fetching session:", error);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) GetSessionDetails();
  }, [sessionId, GetSessionDetails]);

  const StartCall = async () => {
    // ✅ Fix 2: Unlock audio context on user gesture — fixes Chrome autoplay block
    //    This is why you can't hear the AI voice
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      const ctx = new AudioContext();
      await ctx.resume();
    }

    // ✅ Fix 3: Create instance and assign to ref synchronously (not useState)
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    vapiRef.current = vapi;

    // ✅ Fix 4: Attach ALL listeners before calling .start()
    vapi.on("call-start", () => {
      console.log("Call started");
      setCallStarted(true);
    });

    vapi.on("call-end", () => {
      console.log("Call ended");
      setCallStarted(false);
    });

    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
      setCallStarted(false);
    });

    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;
        console.log(`${role}: ${transcript}`);

        if (transcriptType === "partial") {
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          setMessages((prev) => [...prev, { role, text: transcript }]);
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }
    });

    // ✅ Fix 5: speech-start/end now correctly on the local `vapi` variable
    vapi.on("speech-start", () => {
      console.log("Assistant started speaking");
      setCurrentRole("assistant");
    });

    vapi.on("speech-end", () => {
      console.log("Assistant stopped speaking");
      setCurrentRole("user");
    });

    try {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID!);
    } catch (error) {
      console.error("Failed to start call:", error);
      setCallStarted(false);
    }
  };

  const EndCall = () => {
    const vapi = vapiRef.current;
    if (!vapi) return;

    vapi.stop();
    // ✅ Fix 6: .off() requires the event name only (removeAllListeners pattern)
    //    Vapi extends EventEmitter — pass event name to remove all listeners for it
    vapi.removeAllListeners();

    setCallStarted(false);
    setLiveTranscript("");
    setCurrentRole(null);
    vapiRef.current = null;
  };

  return (
    <div className="p-5 border rounded-3xl bg-secondary">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={`h-4 w-4 rounded-full ${
              callStarted ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {callStarted ? "Connected..." : "Not Connected"}
        </h2>
        <h2 className="font-bold text-xl text-gray-400">00:00</h2>
      </div>

      {/* Doctor UI */}
      {sessionDetail && (
        <div className="flex items-center flex-col mt-10">
          <Image
            src={sessionDetail.selectedDoctor?.image}
            alt={sessionDetail.selectedDoctor?.specialist ?? ""}
            width={120}
            height={120}
            className="h-[100px] w-[100px] object-cover rounded-full"
          />

          <h2 className="mt-2 text-lg">
            {sessionDetail.selectedDoctor?.specialist}
          </h2>

          <p className="text-sm text-gray-400">AI Medical Voice Agent</p>

          {/* Transcript area */}
          <div className="mt-10 w-full text-center overflow-y-auto flex flex-col items-center px-10 md:px-28 lg:px-52 xl:px-72">
            {messages?.slice(-4).map((msg: Message, index) => (
              <h2 className="text-gray-400 p-2" key={index}>
                {msg.role} : {msg.text}
              </h2>
            ))}
            {liveTranscript && liveTranscript.length > 0 && (
              <h2 className="text-lg">
                {currentRole} : {liveTranscript}
              </h2>
            )}
          </div>

          {/* Call button */}
          {!callStarted ? (
            <Button className="mt-20 flex items-center gap-2" onClick={StartCall}>
              <PhoneCall />
              Start Call
            </Button>
          ) : (
            <Button variant="destructive" onClick={EndCall}>
              <PhoneOff />
              Disconnect
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default MedicalVoiceAgent;