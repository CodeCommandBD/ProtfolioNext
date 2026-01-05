import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import dbConnect from "@/lib/db/mongodb";
import Bio from "@/lib/db/models/Bio";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST - Upload resume
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const formData = await request.formData();
    const file = formData.get("resume");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64File, {
      folder: "portfolio/resume",
      resource_type: "raw",
      format: "pdf",
    });

    // Update Bio with resume URL
    const bio = await Bio.findOneAndUpdate(
      {},
      { resume: uploadResponse.secure_url },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      resumeUrl: uploadResponse.secure_url,
      bio,
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload resume" },
      { status: 500 }
    );
  }
}

// DELETE - Remove resume
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const bio = await Bio.findOne({});

    if (bio?.resume) {
      // Extract public_id from Cloudinary URL
      const urlParts = bio.resume.split("/");
      const publicIdWithExt = urlParts.slice(-2).join("/");
      const publicId = publicIdWithExt.replace(".pdf", "");

      // Delete from Cloudinary
      await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    }

    // Remove resume URL from Bio
    await Bio.findOneAndUpdate({}, { resume: null });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resume delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 }
    );
  }
}
