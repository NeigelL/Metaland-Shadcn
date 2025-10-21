import { NextResponse } from "next/server";
import { signEmail } from "@/lib/impersonate";
import { can } from "@/services/permissionService";

export async function POST(req: Request) {

    if(!await can('role:super-admin') || !await can('users:impersonate')) {
        return NextResponse.json({ error: "Impersonation disabled" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { email } = body || {};

    if (!email || typeof email !== "string") {
        return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const sig = signEmail(email);
    const res = NextResponse.json({ ok: true });

    // Set cookies (HttpOnly)
    const secure = true
    res.cookies.set({
        name: "impersonate_email",
        value: email,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
        secure,
    });
    res.cookies.set({
        name: "impersonate_sig",
        value: sig,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
        secure,
    });

  return res;
}
