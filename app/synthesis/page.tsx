"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface Synthesis {
  id: string;
  raw_output: string;
  created_at: string;
  sprint_number: number;
}

export default function SynthesisPage() {
  const [syntheses, setSyntheses] = useState<Synthesis[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSyntheses();
  }, []);

  async function fetchSyntheses() {
    try {
      const res = await fetch("/api/synthesize?sprint_number=1");
      const data = await res.json();
      if (Array.isArray(data)) {
        setSyntheses(data);
      }
    } catch (err: any) {
      console.error("Failed to fetch syntheses:", err);
    } finally {
      setFetching(false);
    }
  }

  async function generateSynthesis() {
    setLoading(true);
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

      setSyntheses((prev) => [data, ...prev]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            &larr; Back
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Sprint 1 Synthesis</h1>

      <Button
        onClick={generateSynthesis}
        disabled={loading}
        size="lg"
        className="mb-8"
      >
        {loading ? (
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

      {fetching ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : syntheses.length === 0 ? (
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
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold mt-6 mb-4">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-semibold mt-6 mb-3">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold mt-4 mb-2">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="my-4 leading-relaxed">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="my-4 space-y-2 list-disc pl-6">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="my-4 space-y-2 list-decimal pl-6">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => <li className="my-1">{children}</li>,
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                  }}
                >
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
