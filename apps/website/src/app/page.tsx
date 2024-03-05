"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Hero } from "@/components/Hero";
import Subtitle from "@/components/Subtitle";
import { FeaturesBento } from "@/components/bento/FeaturesBento";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-10">
      <Header />
      <Hero />
      <div className="w-full bg-grid-small-black/[0.2]">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          <Subtitle>Getting Started</Subtitle>
          <div className="bg-black text-white font-mono px-5 py-3 rounded-md mx-auto inline-block shadow-[0_10px_20px_rgba(230,253,238,1)]">
            yarn add @premieroctet/next-admin prisma-json-schema-generator
          </div>
        </div>
        <Subtitle>Features</Subtitle>
        <FeaturesBento />
      </div>
      <Footer />
    </main>
  );
}
