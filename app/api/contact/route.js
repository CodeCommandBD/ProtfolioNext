import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/nodemailer";
import { z } from "zod";
import { rateLimit } from "@/lib/limiter";

// Validation schema
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// POST send contact email
export async function POST(request) {
  try {
    // 1. Check Rate Limit (10 requests per minute per IP)
    const isAllowed = rateLimit(request, 10, 60 * 1000);
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = contactSchema.parse(body);

    // Send email
    const result = await sendContactEmail(validatedData);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      message: "Email sent successfully",
      messageId: result.messageId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
