export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Skill from "@/lib/db/models/Skill";
import { requireAuth } from "@/lib/apiAuth";
import { validateRequest } from "@/lib/validation";
import { skillSchema } from "@/lib/validation/skills";
import { handleError } from "@/lib/errorHandler";

// GET single skill
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const skill = await Skill.findById(id);

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json(skill);
  } catch (error) {
    return handleError(error, "GET /api/skills/[id]");
  }
}

// PUT update skill (protected route)
const updateSkillHandler = requireAuth(
  validateRequest(skillSchema)(
    async (request, context, session, validatedData) => {
      try {
        await dbConnect();
        const { id } = context.params;

        const skill = await Skill.findByIdAndUpdate(id, validatedData, {
          new: true,
          runValidators: true,
        });

        if (!skill) {
          return NextResponse.json(
            { error: "Skill not found" },
            { status: 404 }
          );
        }

        return NextResponse.json(skill);
      } catch (error) {
        return handleError(error, "PUT /api/skills/[id]");
      }
    }
  )
);

export async function PUT(request, context) {
  return updateSkillHandler(request, context);
}

// DELETE skill (protected route)
const deleteSkillHandler = requireAuth(async (request, context) => {
  try {
    await dbConnect();
    const { id } = context.params;

    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Skill deleted successfully" });
  } catch (error) {
    return handleError(error, "DELETE /api/skills/[id]");
  }
});

export async function DELETE(request, context) {
  return deleteSkillHandler(request, context);
}
