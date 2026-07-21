import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabaseServerClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-4xl font-bold">RetroBox</h1>

      <div className="flex flex-row max-w-[42rem] gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Sprint Notes</CardTitle>
            <CardDescription>
              View and add notes for the current sprint
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/notes">
              <Button className="w-full" size="lg">
                View Notes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>AI Synthesis</CardTitle>
            <CardDescription>
              Generate a summary of sprint notes using Claude
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/synthesis">
              <Button className="w-full" size="lg" variant="outline">
                See AI Synthesis
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
