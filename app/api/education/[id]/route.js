export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Education from "@/lib/db/models/Education";
import { requireAuth } from "@/lib/apiAuth";
import { validateRequest } from "@/lib/validation";
import { educationSchema } from "@/lib/validation/education";
import { handleError } from "@/lib/errorHandler";

// GET single education
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const education = await Education.findById(id);

    if (!education) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(education);
  } catch (error) {
    return handleError(error, "GET /api/education/[id]");
  }
}

// PUT update education (protected route)
const updateEducationHandler = requireAuth(
  validateRequest(educationSchema)(
    async (request, context, session, validatedData) => {
      try {
        await dbConnect();
        const { id } = context.params;

        const education = await Education.findByIdAndUpdate(id, validatedData, {
          new: true,
          runValidators: true,
        });

        if (!education) {
          return NextResponse.json(
            { error: "Education not found" },
            { status: 404 }
          );
        }

        return NextResponse.json(education);
      } catch (error) {
        return handleError(error, "PUT /api/education/[id]");
      }
    }
  )
);

export async function PUT(request, context) {
  return updateEducationHandler(request, context);
}

// DELETE education (protected route)
const deleteEducationHandler = requireAuth(async (request, context) => {
  try {
    await dbConnect();
    const { id } = context.params;

    const education = await Education.findByIdAndDelete(id);

    if (!education) {
      return NextResponse.json(
        { error: "Education not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Education deleted successfully" });
  } catch (error) {
    return handleError(error, "DELETE /api/education/[id]");
  }
});

export async function DELETE(request, context) {
  return deleteEducationHandler(request, context);
}
