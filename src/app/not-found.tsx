import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-gradient px-6 text-center text-white">
      <Logo variant="light" href={null} />
      <p className="mt-12 font-display text-7xl font-bold text-gold">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">Page not found</h1>
      <p className="mt-3 max-w-md text-white/65">
        The page you're looking for doesn't exist or may have moved. Let's get you back on track.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="gold" size="lg"><Link href="/">Back to Home</Link></Button>
        <Button asChild size="lg" variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white">
          <Link href="/equipment">Browse Equipment</Link>
        </Button>
      </div>
    </div>
  );
}
