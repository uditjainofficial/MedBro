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
import DoctorAgentCard, { doctorAgent } from "./DoctorAgentCard";

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>();
  const [loading, setLoading] = useState(false);

  // ✅ Always array (safe)
  const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>([]);

  const onClickNext = async () => {
    try {
      setLoading(true);

      const result = await axios.post("/api/suggest-doctors", {
        notes: note,
      });

      console.log("API Response:", result.data);

      // ✅ BULLETPROOF handling
      if (Array.isArray(result.data)) {
        setSuggestedDoctors(result.data);
      } else if (Array.isArray(result.data?.doctors)) {
        setSuggestedDoctors(result.data.doctors);
      } else {
        console.error("Invalid API response:", result.data);
        setSuggestedDoctors([]);
      }

    } catch (error) {
      console.error("Error fetching doctors:", error);
      setSuggestedDoctors([]);
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
            {Array.isArray(suggestedDoctors) && suggestedDoctors.length > 0 ? (
              <div className="grid grid-cols-2 gap-5">
                {suggestedDoctors.map((doctor, index) => (
                  <DoctorAgentCard
                    doctorAgent={doctor}
                    key={index}
                  />
                ))}
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
            <Button
              disabled={!note || loading}
              onClick={onClickNext}
            >
              Next{" "}
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ArrowRight />
              )}
            </Button>
          ) : (
            <Button>Start Consultation</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;