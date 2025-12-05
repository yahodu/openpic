import { About3 } from "@/components/about3";
import { AnomalousMatterHero } from "@/components/ui/anomalous-matter-hero";

export default function Home() {
  return (
    <>
    <div className="overflow-hidden">
      <AnomalousMatterHero />
</div>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black flex-col">
        <About3 />
      </div>
    </>
  );
}
