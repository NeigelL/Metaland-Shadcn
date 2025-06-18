"use client"

import { loginUser } from "@/types/loginUser";
import { create } from "zustand";

type LoginUser = typeof loginUser

export const useUserStore = create<
 LoginUser &
 {
    setUser: (user:any) => void;
    clearUser: () => void;
}>( (set) => (
    {
        ...loginUser,
        setUser: (user) => set(() => ({ ...user })),
        clearUser: () => set(() => ({...loginUser})),
    }
))