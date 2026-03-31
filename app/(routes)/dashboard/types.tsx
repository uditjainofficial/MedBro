// /app/(routes)/dashboard/types.ts
// ✅ Shared types used across dashboard components
 
import { doctorAgent } from "./_components/DoctorAgentCard";
 
export type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: Record<string, any>;
  selectedDoctor: doctorAgent;
  createdOn: string;
};
 
export type Message = {
  role: string;
  text: string;
};