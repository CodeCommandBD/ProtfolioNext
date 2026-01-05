import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    webapp: {
      type: String,
      trim: true,
    },
    member: [
      {
        name: {
          type: String,
          trim: true,
        },
        img: {
          type: String,
          trim: true,
        },
        linkedin: {
          type: String,
          trim: true,
        },
        github: {
          type: String,
          trim: true,
        },
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
