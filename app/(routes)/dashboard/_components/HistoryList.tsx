"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import AddNewSessionDialog from "./AddNewSessionDialog";
import axios from "axios";
import HistoryTable from "./HistoryTable";

type Props = {
  limit?: number; // 👈 add this
};

function HistoryList({ limit }: Props) {
  const [historyList, setHistoryList] = useState([]);

  const GetHistoryList = async () => {
    try {
      const result = await axios.get("/api/session-chat?sessionId=all");
      setHistoryList(result.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    GetHistoryList();
  }, []);

  // 👇 apply limit here
  const displayedHistory = limit
    ? historyList.slice(0, limit)
    : historyList;

  return (
    <div>
      {historyList.length === 0 ? (
        <div className="flex items-center flex-col justify-center p-7 border border-dashed rounded-2xl border-2">
          <Image
            src={"/medical-assistance.png"}
            alt="empty"
            width={150}
            height={150}
          />
          <h2 className="font-bold text-xl mt-2">
            No Recent Consultations
          </h2>
          <p>
            It looks like you haven't consulted with any doctors yet.
          </p>
          <AddNewSessionDialog />
        </div>
      ) : (
        <div>
          <HistoryTable historyList={displayedHistory} />
        </div>
      )}
    </div>
  );
}

export default HistoryList;