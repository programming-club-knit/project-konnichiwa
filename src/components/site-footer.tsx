import Image from "next/image";
import Link from "next/link";
import { FiGithub, FiGlobe } from "react-icons/fi";

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-white/5 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 py-10 md:flex-row">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <Image src="/logo.png" alt="PTSC logo" width={32} height={32} className="size-8 object-contain" />
          <div className="text-sm">
            <div className="font-heading font-semibold">PTSC · KNIT Sultanpur</div>
            <div className="text-muted-foreground">Programming &amp; Tech Skills Club</div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {[FiGithub, FiGlobe, FiGithub].map((Icon, index) => (
            <a
              key={index}
              href="#"
              className="grid size-9 place-items-center rounded-lg border border-white/10 text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} PTSC. Built by students, for students.
        </p>
      </div>
    </footer>
  );
}
