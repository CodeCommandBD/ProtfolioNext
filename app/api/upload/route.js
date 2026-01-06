export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { requireAuth } from "@/lib/apiAuth";
import { handleError } from "@/lib/errorHandler";

// POST upload image to Cloudinary (protected route)
const uploadHandler = requireAuth(async (request) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "portfolio";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await uploadToCloudinary(base64, folder);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    return handleError(error, "POST /api/upload");
  }
});

export async function POST(request, context) {
  return uploadHandler(request, context);
}
