"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { HomeNewsArticle } from "@/features/home/data/home-news";

type ArticleModalProps = {
  article: HomeNewsArticle | null;
  onClose: () => void;
};

export default function ArticleModal({ article, onClose }: ArticleModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!article) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [article, onClose]);

  if (!article || !isMounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md edusync-enter-fast"
      onClick={onClose}
    >
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-modal-title"
        className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-violet-400/20 bg-slate-950 shadow-2xl shadow-violet-950/50 edusync-scale-in"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close article"
          className="edusync-button-motion absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-950/80 text-slate-200 backdrop-blur transition hover:border-violet-300/60 hover:text-white"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="max-h-[90vh] overflow-y-auto">
          <div className="relative h-56 w-full sm:h-72">
            <Image
              src={article.image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          </div>

          <div className="space-y-4 p-6 sm:p-8">
            <h2 id="article-modal-title" className="text-2xl font-bold leading-tight text-white sm:text-3xl">
              {article.title}
            </h2>
            <p className="text-base leading-7 text-slate-300">
              {article.body}
            </p>
          </div>
        </div>
      </article>
    </div>,
    document.body,
  );
}
