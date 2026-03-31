import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
import ViewReportDialog from "./ViewReportDialog";
// ✅ Fix 1: Import SessionDetail from shared types file
import { SessionDetail } from "../types";

type Props = {
  historyList: SessionDetail[];
};

function HistoryTable({ historyList }: Props) {
  return (
    <div>
      <Table>
        <TableCaption>Previous Consultation Reports</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>AI Medical Specialist</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyList.map((record: SessionDetail, index: number) => (
            // ✅ Fix 2: Added return via arrow function parens — was missing, so nothing rendered
            <TableRow key={index}>
              <TableCell className="font-medium">
                {record.selectedDoctor.specialist}
              </TableCell>
              <TableCell>{record.notes}</TableCell>
              <TableCell>
                {moment(new Date(record.createdOn)).fromNow()}
              </TableCell>
              <TableCell className="text-right">
                <ViewReportDialog record={record} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default HistoryTable;
