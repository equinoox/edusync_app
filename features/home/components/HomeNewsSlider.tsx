"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import ArticleModal from "./ArticleModal";
import { homeNewsArticles, type HomeNewsArticle } from "@/features/home/data/home-news";

const GAP_WIDTH = 16;

export default function HomeNewsSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [stepWidth, setStepWidth] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<HomeNewsArticle | null>(null);
  const firstCardRef = useRef<HTMLButtonElement | null>(null);

  const extendedArticles = useMemo(
    () => [...homeNewsArticles, ...homeNewsArticles.slice(0, 5)],
    [],
  );

  useEffect(() => {
    const updateStepWidth = () => {
      if (!firstCardRef.current) return;
      setStepWidth(firstCardRef.current.getBoundingClientRect().width + GAP_WIDTH);
    };

    updateStepWidth();
    window.addEventListener("resize", updateStepWidth);
    return () => window.removeEventListener("resize", updateStepWidth);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => current + 1);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setActiveIndex((current) => {
      if (current > 0) return current - 1;

      setIsTransitioning(false);
      window.requestAnimationFrame(() => {
        setActiveIndex(homeNewsArticles.length);
        window.requestAnimationFrame(() => {
          setIsTransitioning(true);
          setActiveIndex(homeNewsArticles.length - 1);
        });
      });

      return current;
    });
  };

  const goToNext = () => {
    setActiveIndex((current) => current + 1);
  };

  const handleTransitionEnd = () => {
    if (activeIndex < homeNewsArticles.length) return;

    setIsTransitioning(false);
    setActiveIndex(0);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setIsTransitioning(true));
    });
  };

  return (
    <section className="edusync-enter relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/75 p-3.5 shadow-2xl shadow-slate-950/30 sm:p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(124,58,237,0.18),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(249,115,22,0.1),transparent_24%)]" />

      <div className="relative overflow-hidden px-7 sm:px-9">
        <div
          onTransitionEnd={handleTransitionEnd}
          className={`flex gap-4 ${isTransitioning ? "transition-transform duration-700 ease-out" : ""}`}
          style={{ transform: `translateX(-${activeIndex * stepWidth}px)` }}
        >
          {extendedArticles.map((article, index) => (
            <button
              key={`${article.id}-${index}`}
              ref={index === 0 ? firstCardRef : null}
              type="button"
              onClick={() => setSelectedArticle(article)}
              className="edusync-card-motion group min-h-[16.5rem] shrink-0 basis-full overflow-hidden border border-white/10 bg-slate-950/70 text-left shadow-xl shadow-slate-950/25 transition duration-300 hover:border-violet-400/50 hover:brightness-110 sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)] xl:basis-[calc((100%-4rem)/5)]"
            >
              <div className="relative h-28 overflow-hidden">
                <Image
                  src={article.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 20vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
              </div>
              <div className="space-y-2.5 p-3.5">
                <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-white">
                  {article.title}
                </h3>
                <p className="line-clamp-3 text-sm leading-5 text-slate-300">
                  {article.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={goToPrevious}
        aria-label="Previous article"
        className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-950/80 text-slate-200 shadow-lg shadow-slate-950/40 backdrop-blur transition hover:border-violet-300/70 hover:text-white active:scale-95"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={goToNext}
        aria-label="Next article"
        className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-950/80 text-slate-200 shadow-lg shadow-slate-950/40 backdrop-blur transition hover:border-violet-300/70 hover:text-white active:scale-95"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>

      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </section>
  );
}
