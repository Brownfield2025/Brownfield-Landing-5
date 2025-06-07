import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY environment variable is not set")
      return NextResponse.json({ success: false, error: "Email service not configured" }, { status: 500 })
    }

    // Dynamically import and initialize Resend only when needed
    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { to, subject, text, html } = await request.json()

    // Validate required fields
    if (!to || !subject || (!text && !html)) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Brownfield <no-reply@brownfield.ae>",
      to: [to],
      subject: subject,
      text: text,
      html: html || undefined,
    })

    if (error) {
      console.error("Resend API error:", error)
      return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
    }

    console.log("Email sent successfully:", data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
