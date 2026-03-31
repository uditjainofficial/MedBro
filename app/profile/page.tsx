"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const { user } = useUser();
  const [historyList, setHistoryList] = useState([]);

  const fetchHistory = async () => {
    try {
      const result = await axios.get("/api/session-chat?sessionId=all");
      setHistoryList(result.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please login to view your profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-white to-gray-100 dark:from-black dark:to-neutral-900">

      <div className="w-full max-w-md rounded-3xl p-8 backdrop-blur-xl bg-white/70 dark:bg-neutral-900/70 shadow-xl border border-gray-200 dark:border-neutral-800">

        {/* Profile Header */}
        <div className="flex flex-col items-center">

          <Image
            src={user.imageUrl}
            alt="Profile"
            width={100}
            height={100}
            className="rounded-full border-4 border-white shadow-md"
          />

          <h1 className="text-xl font-semibold mt-4">
            {user.fullName}
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            {user.primaryEmailAddress?.emailAddress}
          </p>

        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-gray-200 dark:bg-neutral-800" />

        {/* Plan Card */}
        <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md">
          <div>
            <p className="text-sm opacity-80">Current Plan</p>
            <p className="font-semibold">Free Plan</p>
          </div>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-md">
            Active
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">

          <div className="p-4 rounded-xl bg-gray-100 dark:bg-neutral-800 text-center">
            <p className="text-sm text-gray-500">Consultations</p>
            <p className="text-xl font-bold">
              {historyList.length}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-100 dark:bg-neutral-800 text-center">
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-xl font-bold text-green-500">
              Active
            </p>
          </div>

        </div>

        {/* Info */}
        <p className="mt-6 text-sm text-gray-500 text-center leading-relaxed">
          You currently have access to General Physician consultations for free.
          Premium specialists will be unlocked in upcoming plans.
        </p>

      </div>
    </div>
  );
}