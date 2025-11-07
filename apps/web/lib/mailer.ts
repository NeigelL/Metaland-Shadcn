

import Email from "@/models/emails";
import {Resend} from "resend"
import { emailWelcomePacketTemplate } from "./server_functions";
import User from "@/models/users";

export const resendInstance = new Resend(process.env.RESEND_API_KEY || "")
type EmailParams = {
    from?: string,
    to: string[] | string,
    subject: string,
    html: string,
    text?: string, // Optional text version of the email
}

const defaultEmailFrom = "info@metaland.properties"

export async function sendOTPLogin({
    email,
    code,
    }: { email: string, code: string}
) {

    const subject = "Your One-Time Login Code for Metaland";
    const html = `
        <p>Hello,</p>
        <p>Your one-time login code is: <strong>${code}</strong></p>
        <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        <p>Thank you,<br/>Metaland Team</p>
    `;
    const text = `Hello,

    Your one-time login code is: ${code}

    This code will expire in 10 minutes. If you did not request this, please ignore this email.

    Thank you,
    Metaland Team
    `;
    const from = "PHILUS <info@metaland.properties>";
    const to = email;

    const email_action = "otp_login"
    const response = await sendEmail({
        from,
        to,
        subject,
        html,
        text
    });
    const user = await User.findOne({email: to}).select("_id")
    if(response?.data?.id) {
        await Email.create({
            email_action,
            resend_id: response.data.id,
            user_id: user ? user._id : null,
            to: Array.isArray(to) ? to : [to],
            from,
            subject,
            html,
            plain_text: text,
            description: subject,
            events: [{ event: "sent", timestamp: new Date() }]
        })
        return response
    }
}

export async function welcomeEmailBuyer({
    user_id,
    to,
    name,
    login_link
    }: { user_id: string, to: string, name: string, login_link: string}
) {
    const subject = "Welcome to Buyer Portal System";
    const html = emailWelcomePacketTemplate(name, login_link);
    const text = html
    const from = "PHILUS <info@metaland.properties>"
    const email_action = "welcome_packet"
    const response = await sendEmail({
        from,
        to,
        subject,
        html,
        text
    });
    if(response?.data?.id) {
        await Email.create({
            email_action,
            resend_id: response.data.id,
            user_id: [user_id],
            to: Array.isArray(to) ? to : [to],
            from,
            subject,
            html,
            plain_text: text,
            description: "Welcome Email to Buyer Portal System",
            events: [{ event: "sent", timestamp: new Date() }]
        })
        return response
    }
}

export async function welcomeEmailAgent({
    user_id,
    to,
    name,
    login_link
    }: { user_id: string, to: string, name: string, login_link: string}
) {
    const subject = "Welcome to Agent Portal System";
    const html = emailWelcomePacketTemplate(name, login_link);
    const text = html
    const from = "PHILUS <info@metaland.properties>"
    const email_action = "welcome_packet"
    const response = await sendEmail({
        from,
        to,
        subject,
        html,
        text
    });
    if(response?.data?.id) {
        await Email.create({
            email_action,
            resend_id: response.data.id,
            user_id: [user_id],
            to: Array.isArray(to) ? to : [to],
            from,
            subject,
            html,
            plain_text: text,
            description: "Welcome Email to Agent Portal System",
            events: [{ event: "sent", timestamp: new Date() }]
        })
        return response
    }
}
export async function welcomeEmailRealty({
    user_id,
    to,
    name,
    login_link
    }: { user_id: string, to: string, name: string, login_link: string}
) {
    const subject = "Welcome to Realty Portal System";
    const html = emailWelcomePacketTemplate(name, login_link);
    const text = html
    const from = "PHILUS <info@metaland.properties>"
    const email_action = "welcome_packet"
    const response = await sendEmail({
        from,
        to,
        subject,
        html,
        text
    });
    if(response?.data?.id) {
        await Email.create({
            email_action,
            resend_id: response.data.id,
            user_id: [user_id],
            to: Array.isArray(to) ? to : [to],
            from,
            subject,
            html,
            plain_text: text,
            description: "Welcome Email to Realty Portal System",
            events: [{ event: "sent", timestamp: new Date() }]
        })
        return response
    }
}

export async function sendEmail({
    from = defaultEmailFrom,
    to,
    subject,
    html = '<p>Hi,</p><p>This is a test email from Metaland.</p>',
}: EmailParams) {

    try {
        return await resendInstance.emails.send({
            from,
            to,
            subject,
            html,
        })
    } catch (error) {
        console.error("Error sending email:", error)
        throw error
    }
}

export async function sendEmailAttachments({
    from = defaultEmailFrom,
    to,
    subject,
    html = '<p>Hi,</p><p>This is a test email from Metaland.</p>',
    attachments = [], // Optional attachments
}: EmailParams & { attachments?: { filename: string, content: string }[] }) {

    try {
        const response = await resendInstance.emails.send({
            from,
            to,
            subject,
            html,
        })
        return response
    } catch (error) {
        console.error("Error sending email:", error)
        throw error
    }
}

export async function sendBatchEmail(emails: EmailParams[] = []) {
    const batchEmails = emails.map(email => ({
        from: email.from || defaultEmailFrom,
        to: email.to,
        subject: email.subject,
        html: email.html || '<p>Hi,</p><p>This is a test email from Metaland.</p>',
        text: "Hi,\n\nThis is a test email from Metaland.", // Add required 'text' property
    }));
    return await resendInstance.batch.send(batchEmails);
}