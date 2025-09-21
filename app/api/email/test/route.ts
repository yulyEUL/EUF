import { type NextRequest, NextResponse } from "next/server"

const SAMPLE_EMAILS = {
  turo_booking: {
    from: "noreply@turo.com",
    to: "your-email@example.com",
    subject: "Trip confirmed - BMW 3 Series with John",
    text: `
Hi there,

Your trip has been confirmed!

Trip ID: TR-2024-001
Guest: John Smith
Vehicle: BMW 3 Series
Start: January 20, 2024 at 10:00 AM
End: January 25, 2024 at 10:00 AM
Pickup: Downtown Location
Total: $450.00

Have a great trip!
Turo Team
    `,
    html: "",
    receivedAt: new Date().toISOString(),
    headers: {},
  },

  payment_stripe: {
    from: "payments@stripe.com",
    to: "your-email@example.com",
    subject: "Payment received for $450.00",
    text: `
Payment Confirmation

Amount: $450.00
Customer: John Smith
Payment ID: pi_1234567890abcdef
Date: January 15, 2024

This payment has been successfully processed.
    `,
    html: "",
    receivedAt: new Date().toISOString(),
    headers: {},
  },

  maintenance_service: {
    from: "service@jiffylube.com",
    to: "your-email@example.com",
    subject: "Service completed - Oil Change",
    text: `
Service Completion Notice

Vehicle: BMW 3 Series (License: ABC123)
Service: Oil Change & Filter
Cost: $89.99
Mileage: 45,230
Date: January 15, 2024
Next Service: April 15, 2024 or 48,230 miles

Thank you for choosing Jiffy Lube!
    `,
    html: "",
    receivedAt: new Date().toISOString(),
    headers: {},
  },
}

export async function POST(request: NextRequest) {
  try {
    const { emailType } = await request.json()

    if (!emailType || !SAMPLE_EMAILS[emailType]) {
      return NextResponse.json({ error: "Invalid email type" }, { status: 400 })
    }

    const sampleEmail = SAMPLE_EMAILS[emailType]

    // Send the sample email to our webhook endpoint
    const webhookUrl = `${request.nextUrl.origin}/api/email/webhook`

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sampleEmail),
    })

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: "Test email sent to webhook",
      emailType,
      webhookResponse: result,
    })
  } catch (error) {
    console.error("Test email error:", error)
    return NextResponse.json({ error: "Failed to send test email" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    availableTests: Object.keys(SAMPLE_EMAILS),
    message: "Use POST with emailType to test parsing",
  })
}
