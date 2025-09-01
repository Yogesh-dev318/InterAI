"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    // Step 1: Check if the IndustryInsight for the selected industry already exists.
    let industryInsight = await db.industryInsight.findUnique({
      where: {
        industry: data.industry,
      },
    });

    // Step 2: If it doesn't exist, generate it with AI and create it in the database.
    // This is now done *before* updating the user profile to prevent timeouts.
    if (!industryInsight) {
      console.log(`No insights found for ${data.industry}. Generating new ones.`);
      const insights = await generateAIInsights(data.industry);

      industryInsight = await db.industryInsight.create({
        data: {
          industry: data.industry,
          ...insights,
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
      console.log(`Successfully created new insights for ${data.industry}.`);
    }

    // Step 3: Now that insights are guaranteed to exist, update the user's profile.
    // This is a much faster and more reliable operation.
    const updatedUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        industry: data.industry,
        experience: data.experience,
        bio: data.bio,
        skills: data.skills,
      },
    });

    revalidatePath("/");
    
    // Return a success object that the frontend form expects.
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });

    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}

export async function getUserProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        industry: true,
        experience: true,
        bio: true,
        skills: true,
      },
    });

    if (!user) return null;

    // Convert the skills array back to a comma-separated string for the form input
    const userProfile = {
      ...user,
      skills: user.skills ? user.skills.join(", ") : "",
    };

    return userProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}