"use client";
import React, { useEffect } from "react";
import HistoryList from "./_components/HistoryList";
import DoctorsAgentList from "./_components/DoctorsAgentList";
import AddNewSessionDialog from "./_components/AddNewSessionDialog";
import axios from "axios";

function Dashboard() {

  useEffect(() => {
    const createUser = async () => {
      try {
        await axios.post("/api/users");
      } catch (error) {
        console.error("User creation failed:", error);
      }
    };

    createUser();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">My Dashboard</h2>
        <AddNewSessionDialog />
      </div>
      <HistoryList />
      <DoctorsAgentList />
    </div>
  );
}

export default Dashboard;