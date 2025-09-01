import { redirect } from "next/navigation";
import { industries } from "@/data/industries";
import OnboardingForm from "../../onboarding/_components/onboarding-form";
import { getUserProfile } from "@/actions/user";

export default async function EditProfilePage() {
  const userProfile = await getUserProfile();

  // If the user profile can't be found, redirect them.
  if (!userProfile) {
    redirect("/dashboard");
  }

  // We pass the user's data and an "isEditing" flag to the form component.
  return (
    <main>
      <OnboardingForm industries={industries} initialData={userProfile} isEditing={true} />
    </main>
  );
}