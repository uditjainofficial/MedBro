"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, PhoneCall } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: Record<string, any>; // ✅ fixed instead of any
  selectedDoctor: doctorAgent;
  createdOn: string;
};

function MedicalVoiceAgent() {
  const params = useParams();
  const sessionId = params?.sessionId as string;

  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(null);

  // ✅ stable function using useCallback
  const GetSessionDetails = useCallback(async () => {
    try {
      const result = await axios.get(
        "/api/session-chat?sessionId=" + sessionId
      );
      console.log(result.data);
      setSessionDetail(result.data);
    } catch (error) {
      console.error("Error fetching session:", error);
    }
  }, [sessionId]);

  // ✅ correct dependency handling
  useEffect(() => {
    if (sessionId) {
      GetSessionDetails();
    }
  }, [sessionId, GetSessionDetails]);

  return (
    <div className="p-5 border rounded-3xl bg-secondary">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle className="h-4 w-4" />
          Not Connected
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

          <p className="text-sm text-gray-400">
            AI Medical Voice Agent
          </p>

          {/* Chat placeholder */}
          <div className="mt-32 text-center">
            <h2 className="text-gray-400">Assistant Msg</h2>
            <h2 className="text-lg">User Msg</h2>
          </div>

          {/* Call button */}
          <Button className="mt-20 flex items-center gap-2">
            <PhoneCall />
            Start Call
          </Button>
        </div>
      )}
    </div>
  );
}

export default MedicalVoiceAgent;