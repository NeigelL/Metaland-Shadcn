import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDecimal(val:any, sign:boolean = true) {
  return (sign ? "₱ " : "") + new Intl.NumberFormat('en-US',{
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(val)
}