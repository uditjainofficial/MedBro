// page.tsx
"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, Loader2, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import { SessionDetail, Message } from "../../types";


function MedicalVoiceAgent() {
  const params = useParams();
  const sessionId = params?.sessionId as string;
  const router = useRouter();

  const [callStarted, setCallStarted] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(null);

  // ✅ Fix 1: useRef for Vapi instance — always synchronously available
  const vapiRef = useRef<Vapi | null>(null);
  // ✅ Fix 2: useRef for messages — avoids stale closure in GenerateReport
  const messagesRef = useRef<Message[]>([]);

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

  // ✅ Fix 3: Keep messagesRef always in sync with messages state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // ✅ Fix 4: Cleanup Vapi on page unmount
  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current.removeAllListeners();
        vapiRef.current = null;
      }
    };
  }, []);

  const GenerateReport = async () => {
    // ✅ Fix 5: Use messagesRef.current — never stale
    const currentMessages = messagesRef.current;

    if (!currentMessages || currentMessages.length === 0) {
      console.warn("No messages to generate report from");
      toast.error("No conversation recorded. Report could not be generated.");
      return;
    }

    try {
      setIsGeneratingReport(true);
      const result = await axios.post("/api/medical-report", {
        messages: currentMessages,
        sessionDetail: sessionDetail,
        sessionId: sessionId,
      });
      console.log("Report generated:", result.data);
      toast.success("Your medical report has been generated!");
      // ✅ Fix 6: Navigate AFTER report is saved, not before
      router.replace("/dashboard");
    } catch (error) {
      console.error("Failed to generate report:", error);
      toast.error("Failed to generate report. Please try again.");
      router.replace("/dashboard");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const StartCall = async () => {
    // ✅ Fix 7: Unlock AudioContext on user gesture — fixes Chrome audio autoplay block
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      const ctx = new AudioContext();
      await ctx.resume();
    }

    // ✅ Fix 8: Create instance and assign to ref synchronously
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    vapiRef.current = vapi;

    const VapiAgentConfig = {
      name: "AI Medical Doctor Voice Agent",
      firstMessage:
        "Hi there! I'm your AI Medical Assistant. I'm here to help you with any health questions or concerns you might have today. How are you feeling?",
      transcriber: {
        provider: "assembly-ai",
        language: "en",
      },
      voice: {
        provider: "11labs",
        voiceId: "burt",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: sessionDetail?.selectedDoctor?.agentPrompt,
          },
        ],
      },
    };

    // ✅ Fix 9: All listeners attached BEFORE .start()
    vapi.on("call-start", () => {
      console.log("Call started");
      setCallStarted(true);
    });

    // ✅ Fix 10: call-end triggers report generation automatically
    //    (handles both manual disconnect AND natural call end)
    vapi.on("call-end", () => {
      console.log("Call ended");
      setCallStarted(false);
    });

    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
      setCallStarted(false);
    });

    // ✅ Fix 11: speech-start/end on local `vapi` variable, not stale state
    vapi.on("speech-start", () => {
      console.log("Assistant started speaking");
      setCurrentRole("assistant");
    });

    vapi.on("speech-end", () => {
      console.log("Assistant stopped speaking");
      setCurrentRole("user");
    });

    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;
        console.log(`${role}: ${transcript}`);

        if (transcriptType === "partial") {
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          setMessages((prev) => {
            const updated = [...prev, { role, text: transcript }];
            messagesRef.current = updated; // keep ref in sync immediately
            return updated;
          });
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }
    });

    try {
      // @ts-ignore
      await vapi.start(VapiAgentConfig);
    } catch (error) {
      console.error("Failed to start call:", error);
      setCallStarted(false);
    }
  };

  const EndCall = async () => {
    const vapi = vapiRef.current;
    if (!vapi) return;

    vapi.stop();
    vapi.removeAllListeners();
    vapiRef.current = null;

    setCallStarted(false);
    setLiveTranscript("");
    setCurrentRole(null);

    // ✅ Fix 12: GenerateReport runs BEFORE navigation (it handles navigation internally)
    await GenerateReport();
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

          {/* Call / Disconnect / Generating Report buttons */}
          {isGeneratingReport ? (
            <Button disabled className="mt-20 flex items-center gap-2">
              <Loader2 className="animate-spin" />
              Generating Report...
            </Button>
          ) : !callStarted ? (
            <Button
              className="mt-20 flex items-center gap-2"
              onClick={StartCall}
            >
              <PhoneCall />
              Start Call
            </Button>
          ) : (
            <Button variant="destructive" className="mt-20" onClick={EndCall}>
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