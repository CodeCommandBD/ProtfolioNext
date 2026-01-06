export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Education from "@/lib/db/models/Education";
import { requireAuth } from "@/lib/apiAuth";
import { validateRequest } from "@/lib/validation";
import { educationSchema } from "@/lib/validation/education";
import { handleError } from "@/lib/errorHandler";

// GET all education records
export async function GET() {
  try {
    await dbConnect();
    const education = await Education.find().sort({ order: 1 });
    return NextResponse.json(education);
  } catch (error) {
    return handleError(error, "GET /api/education");
  }
}

// POST create new education (protected route)
const createEducationHandler = requireAuth(
  validateRequest(educationSchema)(
    async (request, context, session, validatedData) => {
      try {
        await dbConnect();
        const education = await Education.create(validatedData);
        return NextResponse.json(education, { status: 201 });
      } catch (error) {
        return handleError(error, "POST /api/education");
      }
    }
  )
);

export async function POST(request, context) {
  return createEducationHandler(request, context);
}
