"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";

export type usersDetail = {
  name: string;
  email: string;
  credits: number;
};

function Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const [usersDetail, setUserDetail] = useState<usersDetail | null>(null);

  useEffect(() => {
    if (!user || usersDetail) return;

    const createUser = async () => {
      try {
        const result = await axios.post("/api/users");
        console.log(result.data);
        setUserDetail(result.data);
      } catch (error) {
        console.error("Error creating user:", error);
      }
    };

    createUser();
  }, [user, usersDetail]);

  return (
    <UserDetailContext.Provider value={{ usersDetail, setUserDetail }}>
      {children}
    </UserDetailContext.Provider>
  );
}

export default Provider;