"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

export type doctorAgent = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
  voiceId?:string
};

type props = {
  doctorAgent: doctorAgent;
};

function DoctorAgentCard({ doctorAgent }: props) {

    const [loading, setLoading] = useState(false);
    const router=useRouter();
  

  const onStartConsultation = async () => {
      try {
        setLoading(true);
  
        const result = await axios.post("/api/session-chat", {
          notes: '',
          selectedDoctor: doctorAgent,
        });
  
        if (result.data?.sessionId) {
          console.log("Session Created:", result.data.sessionId);
          //route new conversation screen
          router.push('/dashboard/medical-agent/'+result.data.sessionId);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div>
      <div className="relative w-full h-[250px]">
        <Image
  src={doctorAgent.image || "/doctor1.png"}
  alt={doctorAgent.specialist || "Doctor Image"} // ✅ FIX
  fill
  className="object-cover rounded-xl"
  sizes="(max-width: 768px) 100vw, 33vw"
  priority
/>
      </div>

      <h2 className="font-bold mt-1">
        {doctorAgent.specialist}
      </h2>

      <p className="line-clamp-2 text-sm text-gray-500"> {/* ✅ FIX */}
        {doctorAgent.description}
      </p>

      <Button className="w-full mt-2" onClick={onStartConsultation}>
        Start Consultation {loading?<Loader2Icon className="animate-spin" />: <IconArrowRight />}
      </Button>
    </div>
  );
}

export default DoctorAgentCard;