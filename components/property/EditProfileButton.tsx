"use client";

import { Button } from "@/components/ui/button";

export function EditProfileButton() {
  return (
    <Button
      variant="outline"
      className="sm:self-start"
      onClick={() => console.log("Edit profile clicked (demo only)")}
    >
      Edit Profile
    </Button>
  );
}
