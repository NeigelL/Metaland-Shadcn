"use client"

import { loginUser } from "@/types/loginUser";
import { create } from "zustand";

type LoginUser = typeof loginUser
type Parameters = {
        min_date?: Date;
        start_date?: Date;
        end_date?: Date;
}
export const useUserStore = create<
 LoginUser &
 {
    setUser: (user:any) => void;
    clearUser: () => void;
    setParameters: (parameters: Parameters) => void;
    parameters?: Parameters
}>( (set) => (
    {
        ...loginUser,
        getParameters: () => {
            return useUserStore.getState().parameters
        },
        setParameters: (p) => set(() => ({ parameters: { ...(useUserStore.getState().parameters), ...p } })),
        setUser: (user) => set(() => ({ ...user, parameters: {start_date: new Date("2025-01-01"), end_date: new Date( new Date().toISOString().slice(0, 10))  }  })),
        clearUser: () => set(() => ({...loginUser})),
    }
))