import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href?: string;
}

export function BackButton({ href = "/" }: BackButtonProps) {
  return (
    <div className="mb-6">
      <Link href={href}>
        <Button variant="ghost" size="sm">
          &larr; Back
        </Button>
      </Link>
    </div>
  );
}
