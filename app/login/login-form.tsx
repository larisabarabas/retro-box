"use client";

import { CircleCheck, FileText, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "auth_callback_failed"
      ? "Authentication failed. Please try again."
      : null,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = supabaseBrowserClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }

    setLoading(false);
  }

  function handleUseDifferentEmail() {
    setSent(false);
    setEmail("");
    setError(null);
  }

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center gap-6 pt-8 pb-8">
        {sent ? (
          <>
            <div className="flex size-14 items-center justify-center rounded-full bg-[#46c391]/15">
              <CircleCheck className="size-7 text-[#46c391]" />
            </div>

            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-bold">Check your email</h1>
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent a magic link to
              </p>
              <p className="text-sm font-semibold">{email}</p>
            </div>

            <div className="w-full rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              Click the link in your email to complete the sign in process. The
              link will expire in 15 minutes.
            </div>

            <button
              type="button"
              onClick={handleUseDifferentEmail}
              className="text-sm font-semibold hover:underline"
            >
              Use a different email
            </button>

            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder.
            </p>
          </>
        ) : (
          <>
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/15">
              <FileText className="size-7 text-primary" />
            </div>

            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-bold">Welcome to RetroBox</h1>
              <p className="text-sm text-muted-foreground">
                Sign in to start your sprint retrospective
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="pl-9"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Magic Link"}
              </Button>
            </form>

            <hr className="w-full" />

            <p className="text-xs text-muted-foreground">
              We&apos;ll email you a magic link for a password-free sign in.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
