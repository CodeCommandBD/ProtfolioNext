export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Skill from "@/lib/db/models/Skill";
import { requireAuth } from "@/lib/apiAuth";
import { validateRequest } from "@/lib/validation";
import { skillSchema } from "@/lib/validation/skills";
import { handleError } from "@/lib/errorHandler";

// GET all skills
export async function GET() {
  try {
    await dbConnect();
    const skills = await Skill.find().sort({ order: 1 });
    return NextResponse.json(skills);
  } catch (error) {
    return handleError(error, "GET /api/skills");
  }
}

// POST create new skill category (protected route)
const createSkillHandler = requireAuth(
  validateRequest(skillSchema)(
    async (request, context, session, validatedData) => {
      try {
        await dbConnect();
        const skill = await Skill.create(validatedData);
        return NextResponse.json(skill, { status: 201 });
      } catch (error) {
        return handleError(error, "POST /api/skills");
      }
    }
  )
);

export async function POST(request, context) {
  return createSkillHandler(request, context);
}
