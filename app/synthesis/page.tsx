"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";
import { getErrorMessage, fetcher } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const ReactMarkdown = dynamic(() => import("react-markdown"), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-1/2" />
      <div className="h-4 bg-muted rounded w-5/6" />
    </div>
  ),
});

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="my-4 leading-relaxed">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="my-4 space-y-2 list-disc pl-6">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="my-4 space-y-2 list-decimal pl-6">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="my-1">{children}</li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold">{children}</strong>
  ),
};

interface Synthesis {
  id: string;
  raw_output: string;
  created_at: string;
  sprint_number: number;
}

export default function SynthesisPage() {
  const {
    data: syntheses,
    isLoading,
    mutate,
  } = useSWR<Synthesis[]>("/api/synthesize?sprint_number=1", fetcher);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateSynthesis() {
    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sprint_number: 1 }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate synthesis");
      }

      mutate();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <BackButton />

      <h1 className="text-3xl font-bold mb-8">Sprint 1 Synthesis</h1>

      <Button
        onClick={generateSynthesis}
        disabled={generating}
        size="lg"
        className="mb-8"
      >
        {generating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Retro Summary"
        )}
      </Button>

      {error && (
        <Card className="border-destructive mb-4">
          <CardContent className="pt-6 text-destructive">{error}</CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !syntheses || syntheses.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-muted-foreground text-center">
            No syntheses yet. Generate one to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {syntheses.map((synthesis) => (
            <Card key={synthesis.id}>
              <CardHeader>
                <CardTitle>Retro Summary</CardTitle>
                <CardDescription>
                  Generated on {new Date(synthesis.created_at).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReactMarkdown components={markdownComponents}>
                  {synthesis.raw_output}
                </ReactMarkdown>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
