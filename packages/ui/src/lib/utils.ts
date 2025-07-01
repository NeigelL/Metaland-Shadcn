import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {formatDate as formatDateIntl} from "date-fns"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDecimal(val:any, sign:boolean = true) {
  return (sign ? "₱ " : "") + new Intl.NumberFormat('en-US',{
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(val)
}

export function formatDateClient(date: Date | string, format: string = "MMM dd yyyy") {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return formatDateIntl(date, format)

}