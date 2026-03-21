import { usersDetail } from "@/app/provider";
import { createContext } from "react";

type UserContextType = {
  usersDetail: usersDetail | null;
  setUserDetail: React.Dispatch<
    React.SetStateAction<usersDetail | null>
  >;
};

export const UserDetailContext =
  createContext<UserContextType | null>(null);