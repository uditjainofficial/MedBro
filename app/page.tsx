"use client";

import { motion } from "motion/react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function HeroSectionOne() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      <Navbar />

      {/* HERO */}
      <div className="px-4 py-20 md:py-28 text-center">

        {/* Heading */}
        <h1 className="mx-auto max-w-4xl text-3xl font-bold text-slate-800 md:text-5xl lg:text-6xl dark:text-slate-200">
          {"Your AI Medical Assistant, Anytime"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mx-auto mt-6 max-w-xl text-lg text-gray-600 dark:text-gray-400"
        >
          Talk to MedBro using voice AI and get instant medical guidance.
          No waiting. No confusion.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link href="/dashboard">
            <Button className="px-6 py-3 text-lg rounded-xl">
              Start Consultation
            </Button>
          </Link>

          <Link href="/dashboard/history">
            <Button variant="outline" className="px-6 py-3 text-lg rounded-xl">
              View History
            </Button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className="flex w-full items-center justify-between border-b px-6 py-4">

      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.svg"
          alt="MedBro Logo"
          width={120}
          height={40}
          className="h-10 w-auto"
          priority
        />
      </Link>

      {/* Right Side */}
      {!user ? (
        <Link href="/sign-in">
          <Button>Login</Button>
        </Link>
      ) : (
        <div className="flex gap-4 items-center">
          <UserButton />

          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};