import { LinguaLensApp } from "@/components/LinguaLensApp";
import { LinguaLensIcon } from "@/components/icons";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 flex">
            <a href="/" className="mr-6 flex items-center space-x-2">
              <LinguaLensIcon className="h-6 w-6 text-primary" />
              <span className="font-bold sm:inline-block">
                LinguaLens
              </span>
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <LinguaLensApp />
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with Next.js and Genkit. The source code is available on
            GitHub.
          </p>
        </div>
      </footer>
    </div>
  );
}
