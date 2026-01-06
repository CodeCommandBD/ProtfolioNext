import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import dbConnect from "@/lib/db/mongoose";
import Bio from "@/lib/db/models/Bio";
import { v2 as cloudinary } from "cloudinary";

// Build-safe session check
async function checkAuth() {
  // During build, Next.js tries to analyze routes statically
  // Skip auth check during build to prevent crashes
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return null;
  }

  try {
    const { getServerSession } = await import("next-auth/next");
    const { authOptions } = await import("@/lib/authOptions");
    return await getServerSession(authOptions);
  } catch (error) {
    console.error("Auth check failed:", error);
    return null;
  }
}

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export async function POST(request) {
  try {
    configureCloudinary();

    const session = await checkAuth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const formData = await request.formData();
    const file = formData.get("resume");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);

    return new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            folder: "portfolio/docs",
            use_filename: true,
            unique_filename: true,
          },
          async (err, result) => {
            if (err) {
              resolve(
                NextResponse.json({ error: "Upload failed" }, { status: 500 })
              );
            } else {
              const bio = await Bio.findOne({});
              if (bio) {
                bio.resume = result.secure_url;
                await bio.save();
              } else {
                await Bio.create({ resume: result.secure_url });
              }
              resolve(NextResponse.json(result));
            }
          }
        )
        .end(bytes);
    });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    configureCloudinary();

    const session = await checkAuth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const bio = await Bio.findOne({});

    if (bio?.resume) {
      bio.resume = "";
      await bio.save();
    }

    return NextResponse.json({ message: "Resume deleted" });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
