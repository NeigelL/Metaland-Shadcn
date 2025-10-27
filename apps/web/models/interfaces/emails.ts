
export enum EnumEmailAction {
    WELCOME_PACKET = "welcome_packet",
}

export interface IEmailEvent {
    event: string,
    description?: string | null,
    timestamp: Date
}

export interface IEmail {
    company_id: string | null,
    audience_id?: string | null,
    email_template_id?: string | null,
    amortization_id?: string[] | null,
    user_id?: string[] | null,
    resend_id?: string | null,
    email_action?: string | null,
    description?: string | null,
    cc?: string[] | null,
    bcc?: string[] | null,
    reply_to?: string[] | null,
    to?: string[] | null,
    from?: string | null,
    subject?: string | null,
    plain_text?: string | null,
    html?: string | null,
    events?: IEmailEvent[] | null,
}
