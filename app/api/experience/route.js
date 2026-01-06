export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Experience from "@/lib/db/models/Experience";
import { requireAuth } from "@/lib/apiAuth";
import { validateRequest } from "@/lib/validation";
import { experienceSchema } from "@/lib/validation/experience";
import { handleError } from "@/lib/errorHandler";

// GET all experiences
export async function GET() {
  try {
    await dbConnect();
    const experiences = await Experience.find().sort({ order: 1 });
    return NextResponse.json(experiences);
  } catch (error) {
    return handleError(error, "GET /api/experience");
  }
}

// POST create new experience (protected route)
const createExperienceHandler = requireAuth(
  validateRequest(experienceSchema)(
    async (request, context, session, validatedData) => {
      try {
        await dbConnect();
        const experience = await Experience.create(validatedData);
        return NextResponse.json(experience, { status: 201 });
      } catch (error) {
        return handleError(error, "POST /api/experience");
      }
    }
  )
);

export async function POST(request, context) {
  return createExperienceHandler(request, context);
}
