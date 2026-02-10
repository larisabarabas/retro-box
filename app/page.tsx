import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">RetroBox</h1>

      <div className="grid gap-6 max-w-md">
        <Card>
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

        <Card>
          <CardHeader>
            <CardTitle>AI Synthesis</CardTitle>
            <CardDescription>
              Generate a summary of sprint notes using Claude
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/synthesis">
              <Button className="w-full" size="lg" variant="outline">
                Generate Synthesis
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
