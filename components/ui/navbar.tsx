import { FileText } from "lucide-react";
import Link from "next/link";
import { SignOutButton } from "@/components/ui/sign-out-button";
import { supabaseServerClient } from "@/lib/supabase/server";

export async function Navbar() {
  const supabase = await supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <nav className="flex items-center justify-between border-b bg-white px-6 py-3">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-md bg-primary/15">
          <FileText className="size-4 text-primary" />
        </div>
        <span className="font-semibold">RetroBox</span>
      </Link>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{user.email}</span>
        <SignOutButton />
      </div>
    </nav>
  );
}
