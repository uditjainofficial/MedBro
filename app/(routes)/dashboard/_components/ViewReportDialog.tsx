"use client";
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
      <DialogTrigger asChild>
        <Button variant={"link"} size={"sm"}>
          View Report
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold tracking-tight">
            🩺 Medical Report
          </DialogTitle>

          <DialogDescription asChild>
            <div className="mt-6 flex flex-col gap-6 text-sm text-gray-700">

              {/* VISIT INFO CARD */}
              <div className="rounded-xl border p-4 shadow-sm bg-white">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Visit Info
                </h2>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Doctor</p>
                    <p className="font-medium text-gray-900">
                      {record.selectedDoctor?.specialist}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Last Consultation</p>
                    <p className="font-medium text-gray-900">
                      {moment(new Date(record?.createdOn)).fromNow()}
                    </p>
                  </div>
                </div>
              </div>

              {/* REPORT DETAILS */}
              {record.report && Object.keys(record.report).length > 0 && (
                <div className="rounded-xl border p-4 shadow-sm bg-white flex flex-col gap-4">

                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Report Details
                  </h2>

                  {/* Chief Complaint */}
                  {record.report.chiefComplaint && (
                    <div>
                      <p className="text-gray-500 text-xs">Chief Complaint</p>
                      <p className="font-medium text-gray-900">
                        {record.report.chiefComplaint}
                      </p>
                    </div>
                  )}

                  {/* Summary */}
                  {record.report.summary && (
                    <div>
                      <p className="text-gray-500 text-xs">Summary</p>
                      <p className="font-medium text-gray-900 leading-relaxed">
                        {record.report.summary}
                      </p>
                    </div>
                  )}

                  {/* Symptoms */}
                  {record.report.symptoms?.length > 0 && (
                    <div>
                      <p className="text-gray-500 text-xs">Symptoms</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {record.report.symptoms.map((sym: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs bg-gray-100 rounded-md"
                          >
                            {sym}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Duration + Severity */}
                  <div className="grid grid-cols-2 gap-4">
                    {record.report.duration && (
                      <div>
                        <p className="text-gray-500 text-xs">Duration</p>
                        <p className="font-medium text-gray-900">
                          {record.report.duration}
                        </p>
                      </div>
                    )}

                    {record.report.severity && (
                      <div>
                        <p className="text-gray-500 text-xs">Severity</p>
                        <p className="font-medium text-gray-900">
                          {record.report.severity}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Medications */}
                  {record.report.medicationsMentioned?.length > 0 && (
                    <div>
                      <p className="text-gray-500 text-xs">
                        Medications Mentioned
                      </p>
                      <p className="font-medium text-gray-900">
                        {record.report.medicationsMentioned.join(", ")}
                      </p>
                    </div>
                  )}

                  {/* Recommendations */}
                  {record.report.recommendations?.length > 0 && (
                    <div>
                      <p className="text-gray-500 text-xs mb-1">
                        Recommendations
                      </p>
                      <ul className="flex flex-col gap-2">
                        {record.report.recommendations.map(
                          (rec: string, i: number) => (
                            <li
                              key={i}
                              className="bg-gray-50 border rounded-lg px-3 py-2 text-sm"
                            >
                              {rec}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* EMPTY STATE */}
              {(!record.report ||
                Object.keys(record.report).length === 0) && (
                <div className="text-center text-gray-400 text-sm py-10">
                  No report generated yet for this session.
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ViewReportDialog;