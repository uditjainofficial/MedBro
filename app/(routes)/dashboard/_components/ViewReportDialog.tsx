import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { SessionDetail } from "../types";

type Props = {
  record: SessionDetail;
};

function ViewReportDialog({ record }: Props) {
  return (
    <Dialog>
      {/* ✅ Fix: asChild prevents DialogTrigger wrapping Button in its own <button> */}
      <DialogTrigger asChild>
        <Button variant={"link"} size={"sm"}>
          View Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle asChild>
            <h2 className="text-center text-2xl font-bold">
              Medical AI Voice Agent Report
            </h2>
          </DialogTitle>
          <DialogDescription asChild>
            <div className="mt-5 flex flex-col gap-4 text-left">

              {/* Visit Info */}
              <div>
                <h2 className="font-bold text-blue-500 text-lg mb-2">
                  Visit Info
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  <p>
                    <span className="font-bold">Doctor Specialization:</span>{" "}
                    {record.selectedDoctor?.specialist}
                  </p>
                  <p>
                    <span className="font-bold">Consultation Date:</span>{" "}
                    {moment(new Date(record?.createdOn)).fromNow()}
                  </p>
                </div>
              </div>

              {/* Report Details */}
              {record.report && Object.keys(record.report).length > 0 && (
                <div className="flex flex-col gap-3">
                  <h2 className="font-bold text-blue-500 text-lg">
                    Report Details
                  </h2>

                  {record.report.chiefComplaint && (
                    <p>
                      <span className="font-bold">Chief Complaint:</span>{" "}
                      {record.report.chiefComplaint}
                    </p>
                  )}

                  {record.report.summary && (
                    <p>
                      <span className="font-bold">Summary:</span>{" "}
                      {record.report.summary}
                    </p>
                  )}

                  {record.report.symptoms?.length > 0 && (
                    <p>
                      <span className="font-bold">Symptoms:</span>{" "}
                      {record.report.symptoms.join(", ")}
                    </p>
                  )}

                  {record.report.duration && (
                    <p>
                      <span className="font-bold">Duration:</span>{" "}
                      {record.report.duration}
                    </p>
                  )}

                  {record.report.severity && (
                    <p>
                      <span className="font-bold">Severity:</span>{" "}
                      {record.report.severity}
                    </p>
                  )}

                  {record.report.medicationsMentioned?.length > 0 && (
                    <p>
                      <span className="font-bold">Medications Mentioned:</span>{" "}
                      {record.report.medicationsMentioned.join(", ")}
                    </p>
                  )}

                  {record.report.recommendations?.length > 0 && (
                    <div>
                      <p className="font-bold mb-1">Recommendations:</p>
                      <ul className="list-disc list-inside flex flex-col gap-1">
                        {record.report.recommendations.map(
                          (rec: string, i: number) => (
                            <li key={i}>{rec}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* No report yet */}
              {(!record.report || Object.keys(record.report).length === 0) && (
                <p className="text-gray-400 text-sm text-center">
                  No report generated yet for this session.
                </p>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ViewReportDialog;
