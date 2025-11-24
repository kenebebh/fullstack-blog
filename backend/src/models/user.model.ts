import mongoose from "mongoose";
import type { HydratedDocument } from "mongoose";

import type { IUser } from "../types/user.js";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // Not required because OAuth users won't have passwords
      select: false, // Don't return password by default in queries
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    profilePicture: {
      type: String,
    },

    // OAuth IDs
    googleId: {
      type: String,
      sparse: true, // Allows multiple null values but unique non-null values
    },
    githubId: {
      type: String,
      sparse: true,
    },
    linkedinId: {
      type: String,
      sparse: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Hash password before saving
userSchema.pre("save", async function (this: HydratedDocument<IUser>) {
  if (!this.isModified("password") || !this.password) return;

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error: any) {
    throw error;
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
