import React from "react";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";

// This component now accepts isOnboarded as a prop
const SignedInActions = ({ isOnboarded }) => {
  return (
    <>
      <Link href="/dashboard">
        <Button
          variant="outline"
          className="hidden md:inline-flex items-center gap-2"
        >
          <LayoutDashboard className="h-4 w-4" />
          Industry Insights
        </Button>
        <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
          <LayoutDashboard className="h-4 w-4" />
        </Button>
      </Link>

      {/* Growth Tools Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center gap-2">
            <StarsIcon className="h-4 w-4" />
            <span className="hidden md:block">Growth Tools</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href="/resume" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Build Resume
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/ai-cover-letter"
              className="flex items-center gap-2"
            >
              <PenBox className="h-4 w-4" />
              Cover Letter
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/interview" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Interview Prep
            </Link>
          </DropdownMenuItem>
          
          {/* Conditionally render the Edit Profile button */}
          {isOnboarded && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile/edit" className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Edit Profile
                </Link>
              </DropdownMenuItem>
            </>
          )}

        </DropdownMenuContent>
      </DropdownMenu>

      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-10 h-10",
            userButtonPopoverCard: "shadow-xl",
            userPreviewMainIdentifier: "font-semibold",
          },
        }}
        afterSignOutUrl="/"
      />
    </>
  );
};

export default async function Header() {
  // Now we get the user data and determine the status here
  const user = await checkUser();
  const isOnboarded = !!user?.industry;

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <Image
            src={"/logo.png"}
            alt="Sensai Logo"
            width={200}
            height={60}
            className="h-12 py-1 w-auto object-contain"
          />
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <SignedIn>
            {/* We pass the status down as a prop */}
            <SignedInActions isOnboarded={isOnboarded} />
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}