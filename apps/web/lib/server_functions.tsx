import { TIME_ZONE } from "@/serverConstant"
import { format } from "date-fns"
import Numbo from "numbo"

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

export function generateShortRandomString() {
  return Math.random().toString(36)
  .substring(2, 7); // Generates a 5-character string
}

export function emailWelcomePacketTemplate(name:string, login_link:string) {
  return '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0"/> <title>Welcome Email</title> <style> body { font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; color: #333; } .container { max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); } .button { display: inline-block; background: #2c7be5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; } .footer { margin-top: 30px; font-size: 12px; color: #888; } </style> </head> <body> <div class="container"> <h2>Welcome to Metaland Properties</h2> <p>Hello '+ name +',</p> <p>You’ve been granted access to your portal. To complete your login, please click the button below:</p> <p style="text-align: center;"> <a style="color:white;" href="'+ login_link + '" class="button">Activate My Account</a> </p> <p>This link will expire in 24 hours. If you did not request this or believe this is a mistake, please ignore this email.</p> <p>Thank you,<br/>The Metaland Properties Team</p> <div class="footer"> Metaland Properties Inc. | This is an automated message, please do not reply. </div> </div> </body> </html>';
}

export function validateTin(tin: string): boolean {
      const regex = /^[0-9-]+$/;
      return regex.test(tin);
}

export function convertStringPointToAnd(word: string): string {
  return word.replace(' point ', ' and ');
}

export function convertNumberToWord(str:string) {
  const numbo = new Numbo()
  const strNumber = str + ""
  if( Number(str) > 0 && strNumber && strNumber?.split(".")?.length > 0) {
    const parts = strNumber.split(".")
    const whole = Number(parts[0])
    const fraction = Number(parts[1])
    if(fraction > 0) {
      return convertStringPointToAnd(numbo.convert(whole) + " and " + numbo.convert(fraction) + " centavo")
    }
  }
  return convertStringPointToAnd(numbo.convert(Number(strNumber)))
}

export function fromLocalWithOffset(s:string, offsetMinutes: number = 480) {
  const [date, time = ":"] = s.split(" ");
  if(date === undefined) {
    throw new Error("Invalid date string");
  }
  const [yRaw, mRaw, dRaw] = date.split("-");
  const y = Number(yRaw) || 0;
  const m = Number(mRaw) || 1;
  const d = Number(dRaw) || 1;
  const [hhRaw = "0", mmRaw = "0", ssRaw = "0"] = time.split(":");
  const hh = Number(hhRaw) || 0;
  const mm = Number(mmRaw) || 0;
  const ss = Number(ssRaw) || 0;
  // Date.UTC makes a UTC timestamp for that wall clock
  const asIfUTC = Date.UTC(y, m - 1, d, hh, mm, ss);
  // Subtract the offset to get the real UTC instant
  return new Date(asIfUTC - offsetMinutes * 60 * 1000);
}

export function removeNonAscii(str:any) {
      return str.replace(/[^\x20-\x7E]/g, ''); // Matches characters outside space (0x20) to tilde (0x7E)
}

export function formatAlphaNumericOnlyServer(val:string) {
  return val ? val.replace(/[^a-zA-Z0-9]/g, "") : ""
}

export async function debugToFile(pipeline:any[]) {
    await import('fs/promises').then(fs =>
        fs.writeFile(
            './debug.json',
            JSON.stringify(pipeline, null, 2),
            'utf-8'
        )
    )
}