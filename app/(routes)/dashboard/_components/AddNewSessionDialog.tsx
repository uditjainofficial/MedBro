"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import SuggestedDoctorCard from "./SuggestedDoctorCard";
import { doctorAgent } from "./DoctorAgentCard";
import { useRouter } from "next/navigation";

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>();
  const [loading, setLoading] = useState(false);

  const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent | null>(null);

  const router=useRouter();

  const onClickNext = async () => {
    try {
      setLoading(true);

      const result = await axios.post("/api/suggest-doctors", {
        notes: note,
      });

      console.log("API Response:", result.data);

      if (Array.isArray(result.data)) {
        setSuggestedDoctors(result.data);
      } else if (Array.isArray(result.data?.doctors)) {
        setSuggestedDoctors(result.data.doctors);
      } else {
        setSuggestedDoctors([]);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setSuggestedDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const onStartConsultation = async () => {
    try {
      setLoading(true);

      const result = await axios.post("/api/session-chat", {
        notes: note,
        selectedDoctor: selectedDoctor,
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
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3">Start a Consultation</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Detail</DialogTitle>

          <DialogDescription asChild>
            {suggestedDoctors.length > 0 ? (
              <div>
                <h2>Select the doctor</h2>
                <div className="grid grid-cols-3 gap-5">
                  {suggestedDoctors.map((doctor, index) =>
                    doctor ? (
                      <SuggestedDoctorCard
                        doctorAgent={doctor}
                        key={index}
                        setSelectedDoctor={setSelectedDoctor}
                        selectedDoctor={selectedDoctor}
                      />
                    ) : null
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h2>Add Symptoms Or Any Other Details</h2>

                <Textarea
                  placeholder="Add Detail Here..."
                  className="h-[200px] mt-1"
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          {suggestedDoctors.length === 0 ? (
            <Button disabled={!note || loading} onClick={onClickNext}>
              Next{" "}
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ArrowRight />
              )}
            </Button>
          ) : (
            <Button
              disabled={loading || !selectedDoctor}
              onClick={onStartConsultation}
            >
              Start Consultation
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ArrowRight />
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;