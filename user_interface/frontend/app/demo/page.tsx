'use client';

import React, { useEffect, useState } from "react";

/**
 * ChatGPT-style "Agent is analyzing" loader
 * - Pure TailwindCSS utilities, no external UI lib
 * - Accessible (role="status", aria-live)
 * - Small, modern animations: pulsing bot, typing dots, skeleton shimmer
 * - Drop-in: <AgentAnalyzing visible />
 */

export default function Demo() {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(0);

  // Fake step progression to showcase skeleton activity
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setStep((s) => (s + 1) % 4), 900);
    return () => clearInterval(id);
  }, [visible]);

  return (
    <div className="min-h-dvh w-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold tracking-tight">Agent demo</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVisible((v) => !v)}
              className="rounded-xl px-3 py-1.5 text-sm bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {visible ? "Hide" : "Show"} loader
            </button>
            <a
              href="#usage"
              className="text-sm text-blue-600 dark:text-blue-400 underline underline-offset-4"
            >
              How to use
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 shadow-sm backdrop-blur">
          <div className="p-6">
            {visible ? <AgentAnalyzing /> : (
              <div className="text-sm text-slate-500">Loader hidden — click "Show loader" to preview.</div>
            )}
          </div>
        </div>

        <div id="usage" className="mt-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <h2 className="text-base font-semibold mb-2">Usage</h2>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Copy the <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">AgentAnalyzing</code> component into your project.</li>
            <li>Render it when your backend task starts, hide it when the result is ready.</li>
            <li>Optional: control visibility with a boolean like <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">isLoading</code>.</li>
          </ol>
          <p className="mt-3">Example:</p>
          <pre className="mt-2 rounded-xl p-4 bg-slate-900 text-slate-100 overflow-auto text-[12px]">
{`function Page(){
  const [isLoading, setIsLoading] = useState(true);
  useEffect(()=>{ /* call API */ },[]);
  return (
    <div>
      {isLoading && <AgentAnalyzing />}
      {!isLoading && <Result />}
    </div>
  );
}`}
          </pre>
        </div>
      </div>

      {/* Local styles for keyframes used by the dots & shimmer */}
      <style>{`
        @keyframes dots {
          0% { content: ""; }
          25% { content: "."; }
          50% { content: ".."; }
          75% { content: "..."; }
          100% { content: ""; }
        }
        @keyframes caret {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export function AgentAnalyzing({ message = "Agent is analyzing" , subtext = "We're crunching context and planning the next step." , visible = true }: { message?: string; subtext?: string; visible?: boolean; }) {
  if (!visible) return null;

  return (
    <div role="status" aria-live="polite" className="w-full">
      <div className="mx-auto max-w-2xl relative">
        {/* Glow ring */}
        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-emerald-400/20 blur-2xl" />

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 shadow-md overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="h-9 w-9 rounded-2xl grid place-items-center bg-gradient-to-br from-blue-500 to-emerald-400 text-white shadow-inner animate-pulse">
              {/* bot icon */}
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                <path d="M12 2a2 2 0 0 1 2 2v1h1a4 4 0 0 1 4 4v4a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6V9a4 4 0 0 1 4-4h1V4a2 2 0 0 1 2-2zm-3 9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium tracking-tight">
                {message}
                <span aria-hidden className="inline-block w-6 align-baseline">
                  {/* animated dots using ::after content */}
                  <span
                    className="relative after:absolute after:inset-0 after:[content:attr(data-dots)]"
                    data-dots=""
                    style={{ animation: "dots 1.2s steps(4, end) infinite" }}
                  />
                </span>
                <span className="ml-1 inline-block w-[1px] h-4 bg-current align-middle" style={{ animation: "caret 1s step-end infinite" }} aria-hidden />
              </div>
              <div className="text-xs text-slate-500 line-clamp-1">{subtext}</div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
                analyzing
              </span>
            </div>
          </div>

          {/* Body – skeleton transcript */}
          <div className="p-4 sm:p-6">
            <div className="space-y-3">
              <SkeletonLine w="w-11/12" />
              <SkeletonLine w="w-8/12" />
              <SkeletonLine w="w-10/12" />
              <div className="pt-1" />
              <SkeletonBlock lines={3} />
              <SkeletonBlock lines={2} />
            </div>

            {/* progress shimmer bar */}
            <div className="relative mt-6 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="absolute inset-y-0 left-0 h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400" style={{ width: "45%" }} />
              <div className="absolute inset-0 -translate-x-full will-change-transform" style={{ animation: "shimmer 1.5s linear infinite" }}>
                <div className="h-full w-1/3 bg-white/50 dark:bg-white/10" />
              </div>
            </div>
            <div className="mt-2 text-[11px] text-slate-500">Analyzing context, retrieving tools, and planning response.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonLine({ w = "w-full" }: { w?: string }) {
  return (
    <div className={`relative ${w} h-3 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden`}>
      <div className="absolute inset-0 -translate-x-full will-change-transform" style={{ animation: "shimmer 1.8s linear infinite" }}>
        <div className="h-full w-1/2 bg-white/60 dark:bg-white/10" />
      </div>
    </div>
  );
}

function SkeletonBlock({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} w={i === lines - 1 ? "w-5/12" : i % 2 ? "w-9/12" : "w-10/12"} />
      ))}
    </div>
  );
}
