import { TIME_ZONE } from "@/serverConstant"
import { format } from "date-fns"

export function serverDateFuture(days:number = 1) {
    let now = new Date()
      return new Date(now.getTime() + (days * 24 * 60 * 60 * 1000) )
}

export function serverFormatDate(val:any = Date(), pattern :string = "yyyy-MM-dd") {
  return format(val, pattern)
}

export function serverFormatDateLong(val:any = Date(), pattern :string = "MMM dd yyyy") {
  return val ? format(val, pattern) : ""
}


export function serverFormatDateCustom(val:any = Date(), format:any = {year: "numeric", month: "2-digit", day: "2-digit", timeZone: TIME_ZONE}) {
  return new Intl.DateTimeFormat('en-US',format).format(new Date(val))
}

export function serverFormatDecimal(val:any, sign:boolean = true) {
  return (sign ? "₱ " : "") + new Intl.NumberFormat('en-US',{
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(val)
}