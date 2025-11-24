import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password?: string; // Optional because OAuth users won't have passwords
  name: string;
  profilePicture?: string;

  // OAuth provider data
  googleId?: string;
  githubId?: string;
  linkedinId?: string;

  // Account metadata
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Method to compare passwords
  comparePassword(candidatePassword: string): Promise<boolean>;
}
