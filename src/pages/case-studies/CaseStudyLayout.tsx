import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, ExternalLinkIcon } from "@heroicons/react/solid";

interface CaseStudyLayoutProps {
  title: string;
  subtitle: string;
  tech: string[];
  repoLink?: { href: string; label: string };
  children: React.ReactNode;
}

export const CaseStudyLayout: React.FC<CaseStudyLayoutProps> = ({
  title,
  subtitle,
  tech,
  repoLink,
  children,
}) => {
  useEffect(() => {
    document.title = `${title} | Andrew Alagna`;
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <section className="relative min-h-screen bg-slate-950 pt-24 pb-20">
      <div className="container px-6 mx-auto max-w-3xl relative z-10">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest text-[11px] mb-8"
        >
          <ArrowLeftIcon className="w-4 h-4" /> All Projects
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-6">{subtitle}</p>
          <div className="flex flex-wrap gap-1.5">
            {tech.map((t) => (
              <span
                key={t}
                className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25"
              >
                {t}
              </span>
            ))}
          </div>
          {repoLink && (
            <a
              href={repoLink.href}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {repoLink.label} <ExternalLinkIcon className="w-4 h-4" />
            </a>
          )}
        </header>

        <div className="space-y-12">{children}</div>
      </div>
    </section>
  );
};

export const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section>
    <h2 className="text-2xl font-bold text-white tracking-tight mb-4 pb-2 border-b border-slate-800">
      {title}
    </h2>
    <div className="space-y-4 text-slate-300 leading-relaxed [&_strong]:text-white [&_code]:text-cyan-300 [&_code]:bg-slate-900 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
      {children}
    </div>
  </section>
);

export const StatRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{children}</div>
);

export const Stat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-4">
    <div className="text-2xl font-black text-cyan-400">{value}</div>
    <div className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mt-1">
      {label}
    </div>
  </div>
);

export const Figure: React.FC<{ src: string; alt: string; caption: string }> = ({
  src,
  alt,
  caption,
}) => (
  <figure>
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="w-full rounded-xl border border-slate-700/50"
    />
    <figcaption className="mt-2 text-[13px] text-slate-500 leading-relaxed">
      {caption}
    </figcaption>
  </figure>
);

export const Callout: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="bg-slate-900 border-l-4 border-cyan-500 rounded-r-xl p-5">
    <div className="text-sm font-bold text-white uppercase tracking-widest text-[11px] mb-2">
      {title}
    </div>
    <div className="text-slate-300 leading-relaxed space-y-3 text-[15px]">{children}</div>
  </div>
);
