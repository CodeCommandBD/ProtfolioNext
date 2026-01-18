import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db/mongoose";
import Message from "@/lib/db/models/Message";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, replyMessage, subject, userEmail } = await request.json();

    if (!id || !replyMessage || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Configure Transporter (Reuse from nodemailer.js if possible, or create new)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send Reply Email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: `Re: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
          <h3 style="color: #854CE6;">Reply from Portfolio Admin</h3>
          <p>${replyMessage}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">You received this message because you contacted us via our portfolio website.</p>
        </div>
      `,
    });

    // Update Message status in DB
    await dbConnect();
    await Message.findByIdAndUpdate(id, { replied: true });

    return NextResponse.json({ message: "Reply sent successfully" });
  } catch (error) {
    console.error("Error sending reply:", error);
    return NextResponse.json(
      { error: "Failed to send reply" },
      { status: 500 },
    );
  }
}
