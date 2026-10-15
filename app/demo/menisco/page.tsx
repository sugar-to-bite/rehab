import type { Metadata } from "next";
import { MeniscusMvpDemo } from "@/components/meniscus-mvp-demo";

export const metadata: Metadata = {
  title: "Demo MVP menisco · RE.HAB",
  description: "Flusso mock dichiarato per il primo blocco dell'MVP menisco"
};

export default function MeniscusDemoPage() {
  return <MeniscusMvpDemo />;
}
