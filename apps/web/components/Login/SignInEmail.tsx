"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@workspace/ui/components/input";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@workspace/ui/components/input-otp";
import { Button } from "@workspace/ui/components/button";
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useSocketBroadcast } from "@/hooks/useSocketListener";
import { EnumSOCKET } from "@/serverConstant";



const OTP_LENGTH = 6;
const OTP_EXPIRATION = 5 * 60; // 5 minutes in seconds

export default function SignInEmail({
    setLoginType
}: any) {
    const [step, setStep] = useState<"email" | "otp">("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(OTP_EXPIRATION);
    const [expired, setExpired] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [msg, setMsg] = useState<string | null>(null);

    useEffect(() => {
        if (step === "otp" && !expired) {
            timerRef.current = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        setExpired(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [step, expired]);

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStep("otp");
        setTimer(OTP_EXPIRATION);
        setExpired(false);
        setOtp("");
        // Here you would trigger sending the OTP to the email
    };

    const handleOtpChange = (value: string) => {
        setOtp(value);
        // Optionally, auto-submit when OTP is complete
        // if (value.length === OTP_LENGTH) handleOtpSubmit();
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== OTP_LENGTH || expired) return;
        signIn("credentials", {
            email,
            code: otp,
            // redirect: false,
        }).then((res) => {
            if (res?.ok) {
                // Optionally, redirect or show success
                window.location.reload();
            } else {
                // alert("Invalid OTP or login failed.");
                setMsg("Invalid OTP or login failed.");
            }
        });

    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const sendOtp = async () => {
        const res = await fetch('/api/auth-otp/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': window.location.origin // Add Origin header for CORS
            },
            body: JSON.stringify({ email })
        });
        // Optionally, check CORS response header
        if (!res.headers.get('access-control-allow-origin')) {
            throw new Error('CORS validation failed');
        }
        const data = await res.json();
        if (!data.ok && data.error) {
            setMsg(data.error);
            setStep("email");
            useSocketBroadcast(EnumSOCKET.USER_PROOFS, { message: [email, " has requested an OTP but is unregistered, please reach out to this email to register"].join(" "), link: `#${email}` });
            return;
        }

        if (data.ok && !data.throttled) {
            // alert('OTP sent to your email');
            setMsg('OTP sent to your email');
        } else if (data.throttled) {
            // alert('Please wait before requesting another OTP');
            setMsg('Please wait before requesting another OTP');
        }
    }

    return (
        <div className="p-6">
            {step === "email" && (
                <Button
                    variant="outline"
                    type="button"
                    className="mb-4 cursor-pointer"
                    onClick={() => setLoginType("google")}
                >
                    &larr; Back
                </Button>
            )}
            {step === "email" && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                    {/* <h2 className="text-xl font-semibold">Or with Email</h2> */}
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                        autoComplete="off"
                    />
                    <Button type="submit" className="w-full" onClick={
                        (e: any) => sendOtp()
                    }>
                        Send OTP
                    </Button>
                    {msg && (
                        <span className="text-xs text-red-500 ml-2">{msg}</span>
                    )}
                </form>
            )}

            {step === "otp" && (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <h2 className="text-xl font-semibold">Enter OTP</h2>
                    <p className="text-sm text-muted-foreground">
                        We sent a 6-digit code to <span className="font-medium">{email}</span>
                    </p>
                    <InputOTP
                        value={otp}
                        onChange={handleOtpChange}
                        disabled={expired}
                        maxLength={OTP_LENGTH}
                        autoFocus
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                            {expired ? (
                                <span className="text-destructive">Code expired</span>
                            ) : (
                                <>Expires in: <span className="font-mono">{formatTime(timer)}</span></>
                            )}
                        </span>
                        {msg && (
                            <span className="text-xs text-info ml-2">{msg}</span>
                        )}
                        <Button type="submit" disabled={otp.length !== OTP_LENGTH || expired}>
                            Verify
                        </Button>
                    </div>
                    {expired && (
                        <Alert variant="destructive">
                            <AlertTitle>Time expired</AlertTitle>
                            <AlertDescription>
                                The OTP code has expired. Please request a new code.
                            </AlertDescription>
                        </Alert>
                    )}
                </form>
            )}
        </div>
    );
}