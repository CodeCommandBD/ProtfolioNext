export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Bio from "@/lib/db/models/Bio";
import { requireAuth } from "@/lib/apiAuth";
import { validateRequest } from "@/lib/validation";
import { bioSchema } from "@/lib/validation/bio";
import { handleError } from "@/lib/errorHandler";

// GET bio data
export async function GET() {
  try {
    await dbConnect();

    let bio = await Bio.findOne();

    // If no bio exists, return default structure
    if (!bio) {
      return NextResponse.json({
        name: "",
        roles: [],
        description: "",
        github: "",
        resume: "",
        linkedin: "",
        twitter: "",
        insta: "",
        facebook: "",
        profileImage: "",
      });
    }

    return NextResponse.json(bio);
  } catch (error) {
    return handleError(error, "GET /api/bio");
  }
}

// PUT update bio data (protected route)
const updateBioHandler = requireAuth(
  validateRequest(bioSchema)(
    async (request, context, session, validatedData) => {
      try {
        await dbConnect();

        // Find existing bio or create new one
        let bio = await Bio.findOne();

        if (bio) {
          // Update existing
          bio = await Bio.findByIdAndUpdate(bio._id, validatedData, {
            new: true,
            runValidators: true,
          });
        } else {
          // Create new
          bio = await Bio.create(validatedData);
        }

        return NextResponse.json(bio);
      } catch (error) {
        return handleError(error, "PUT /api/bio");
      }
    }
  )
);

export async function PUT(request, context) {
  return updateBioHandler(request, context);
}
