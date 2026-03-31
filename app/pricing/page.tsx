"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">

      <h1 className="text-3xl md:text-4xl font-bold">
        Pricing (Coming Soon)
      </h1>

      <p className="mt-6 max-w-xl text-gray-600">
        We are currently testing all our AI doctor agents to ensure the best
        experience for you.
      </p>

      <p className="mt-3 max-w-xl text-gray-600">
        In the future, advanced specialist doctors will be available under
        premium plans, while the General Physician will remain free for everyone.
      </p>

      <div className="mt-8">
        <Link href="/dashboard">
          <Button className="px-6 py-3 rounded-xl">
            Try Free Consultation
          </Button>
        </Link>
      </div>

    </div>
  );
}