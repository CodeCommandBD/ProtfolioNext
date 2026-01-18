import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db/mongoose";
import Message from "@/lib/db/models/Message";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    // Count messages where isRead is false (or assume unread if not replied/read logic exists)
    // Based on user request "real time badge", usually implies unread or new.
    // The previously created model has `isRead` and `replied`.
    // Let's count where isRead is false.
    const count = await Message.countDocuments({ isRead: false });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json(
      { error: "Failed to fetch count" },
      { status: 500 },
    );
  }
}
