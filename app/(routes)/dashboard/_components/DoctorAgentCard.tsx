"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";

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

      <Button className="w-full mt-2">
        Start Consultation <IconArrowRight />
      </Button>
    </div>
  );
}

export default DoctorAgentCard;