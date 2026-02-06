"use client";

import { useEffect, useMemo, useState } from "react";

type Stage = "welcome" | "game" | "reasons" | "question" | "yes" | "final";

type Heart = {
  id: number;
  x: number;
  y: number;
  size: number;
  ttl: number;
};

const reasons = [
  ["You make me feel calm.", "Not stressed.", "Not confused.", "Just okay being myself."],
  ["You laugh freely.", "Like you’re not pretending.", "It’s real.", "And it pulls me in every time."],
  ["You’re patient with me.", "Even when I mess up.", "Even when I’m slow.", "You still choose me."],
  ["You’re kind in small ways.", "The kind most people miss.", "The quiet kind.", "That’s rare."],
  ["You listen to me.", "Not just to reply.", "But to understand.", "That means a lot to me."],
  ["Your smile changes my mood.", "Even on bad days.", "Even when I don’t say it.", "I feel it."],
  ["You believe in me.", "Sometimes more than I do.", "You push me gently.", "I grow because of you."],
  ["You show up.", "In simple moments.", "In serious ones too.", "I don’t feel alone."],
  ["You make small moments special.", "Random talks.", "Silly laughs.", "They matter with you."],
  ["You make happiness feel easy.", "No pressure.", "No pretending.", "Just us."],
  ["You’re honest with me.", "Even when it’s uncomfortable.", "Even when it’s hard.", "I respect that."],
  ["You feel like home.", "Comfortable.", "Safe.", "Somewhere I want to stay."],
  ["You’re confident in your own way.", "Not loud.", "Not forced.", "Just real."],
  ["Your presence distracts me.", "Your energy pulls my attention.", "I lose focus around you.", "And honestly, I like it 😄"],
];

const noLabels = ["No", "Are you sure? 🥺", "Mwiza please 😭", "Think again 😂"];

export default function Page() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [reasonIndex, setReasonIndex] = useState(0);
  const [noIndex, setNoIndex] = useState(0);

  const goal = 5;

  // Spawn and decay hearts only during the game stage
  useEffect(() => {
    if (stage !== "game") return;

    const spawn = setInterval(() => {
      setHearts((prev) => {
        if (prev.length > 8) return prev;
        const id = Date.now() + Math.floor(Math.random() * 10000);
        return [
          ...prev,
          {
            id,
            x: Math.random() * 84 + 8,
            y: Math.random() * 72 + 10,
            size: Math.random() * 20 + 26,
            ttl: 1700 + Math.random() * 1200,
          },
        ];
      });
    }, 520);

    const decay = setInterval(() => {
      setHearts((prev) =>
        prev
          .map((heart) => ({ ...heart, ttl: heart.ttl - 120 }))
          .filter((heart) => heart.ttl > 0)
      );
    }, 120);

    return () => {
      clearInterval(spawn);
      clearInterval(decay);
    };
  }, [stage]);

  // Only auto-advance when in the game stage
  useEffect(() => {
    if (stage !== "game") return;
    if (score >= goal) {
      const timer = setTimeout(() => {
        setHearts([]);
        setReasonIndex(0);
        setStage("reasons");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [score, stage]);

  const cardClasses =
    "w-full max-w-2xl rounded-3xl bg-white/90 p-8 shadow-xl border border-rose-200 text-center";

  const noLabel = useMemo(() => noLabels[noIndex % noLabels.length], [noIndex]);

  return (
    <main className="min-h-screen w-full bg-rose-100 text-rose-900">
      {stage === "welcome" && (
        <section className="mx-auto flex min-h-screen max-w-4xl items-center justify-center p-6">
          <div className={cardClasses}>
            <h1 className="text-3xl font-bold sm:text-4xl">
              Hey Karyn Amiya Peter (mwiza) 💖
            </h1>
            <p className="mt-4 text-lg text-rose-700">
              Play the game to unlock why I love you.
            </p>
            <button
              onClick={() => {
                setScore(0);
                setHearts([]);
                setReasonIndex(0);
                setNoIndex(0);
                setStage("game");
              }}
              className="mt-8 rounded-full bg-rose-500 px-7 py-3 font-semibold text-white transition hover:bg-rose-600"
            >
              Start Game
            </button>
          </div>
        </section>
      )}

      {stage === "game" && (
        <section className="relative mx-auto min-h-screen max-w-5xl overflow-hidden p-6">
          <div className="relative z-20 mx-auto mt-4 w-fit rounded-full bg-white/90 px-5 py-2 text-lg font-semibold shadow">
            Hearts Collected: {score}/{goal}
          </div>

          {score >= goal && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-rose-100/70 text-3xl font-bold">
              Sweet! 💞
            </div>
          )}

          {hearts.map((heart) => (
            <button
              key={heart.id}
              style={{
                left: `${heart.x}%`,
                top: `${heart.y}%`,
                fontSize: `${heart.size}px`,
              }}
              className="heart-pop absolute z-10 -translate-x-1/2 -translate-y-1/2"
              onClick={() => {
                if (score >= goal) return;
                setHearts((prev) => prev.filter((h) => h.id !== heart.id));
                setScore((prev) => Math.min(goal, prev + 1));
              }}
              aria-label="Catch heart"
            >
              💖
            </button>
          ))}
        </section>
      )}

      {stage === "reasons" && (
        <section className="mx-auto flex min-h-screen max-w-4xl items-center justify-center p-6">
          <div className="w-full text-center">
            <h2 className="mb-5 text-3xl font-bold">14 Reasons Why I Love You 💕</h2>

            <div key={reasonIndex} className={`${cardClasses} reason-in mx-auto text-left`}>
              <p className="text-xl font-semibold text-rose-800">
                {reasonIndex + 1}. I love you because…
              </p>
              <div className="mt-4 space-y-2 text-lg text-rose-700">
                {reasons[reasonIndex].map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>

            {reasonIndex < reasons.length - 1 ? (
              <button
                onClick={() => setReasonIndex((prev) => prev + 1)}
                className="mt-6 rounded-full bg-rose-500 px-7 py-3 font-semibold text-white transition hover:bg-rose-600"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => setStage("question")}
                className="mt-6 rounded-full bg-rose-500 px-7 py-3 font-semibold text-white transition hover:bg-rose-600"
              >
                Continue
              </button>
            )}
          </div>
        </section>
      )}

      {stage === "question" && (
        <section className="mx-auto flex min-h-screen max-w-4xl items-center justify-center p-6">
          <div className={cardClasses}>
            <h2 className="text-4xl font-bold leading-tight">
              Karyn… will you be my Valentine? 💘
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setStage("yes")}
                className="rounded-full bg-rose-500 px-8 py-3 text-lg font-semibold text-white transition hover:bg-rose-600"
              >
                Yes 💗
              </button>
              <button
                onClick={() => setNoIndex((prev) => prev + 1)}
                className="rounded-full bg-rose-200 px-8 py-3 text-lg font-semibold text-rose-800 transition hover:bg-rose-300"
              >
                {noLabel}
              </button>
            </div>
          </div>
        </section>
      )}

      {stage === "yes" && (
        <section className="relative mx-auto flex min-h-screen max-w-4xl items-center justify-center overflow-hidden p-6">
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className="celebrate absolute text-xl"
                style={{
                  left: `${(i * 13) % 100}%`,
                  animationDelay: `${(i % 6) * 0.4}s`,
                  animationDuration: `${3 + (i % 4)}s`,
                }}
              >
                {i % 2 === 0 ? "💖" : "✨"}
              </span>
            ))}
          </div>

          <div className={`${cardClasses} relative z-10`}>
            <h2 className="text-3xl font-bold">Yessss! 💞 See you soon mwiza 😍</h2>

            <div className="mx-auto mt-6 max-w-md rounded-2xl bg-white p-6 text-left shadow-inner">
              <p className="text-lg">
                <span className="font-semibold">Venue:</span> Silverback Hotel, Mbarara
              </p>
              <p className="mt-2 text-lg">
                <span className="font-semibold">Time:</span> 8:00 PM
              </p>
            </div>

            <button
              onClick={() => setStage("final")}
              className="mt-7 rounded-full bg-rose-500 px-7 py-3 font-semibold text-white transition hover:bg-rose-600"
            >
              Continue
            </button>
          </div>
        </section>
      )}

      {stage === "final" && (
        <section className="relative mx-auto flex min-h-screen max-w-4xl items-center justify-center overflow-hidden p-6">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="final-heart absolute text-2xl"
                style={{ left: `${i * 10 + 5}%`, animationDelay: `${i * 0.5}s` }}
              >
                💗
              </span>
            ))}
          </div>

          <div className={cardClasses}>
            <h2 className="text-4xl font-bold">Nakupenda sana mpenzi wangu</h2>

            <button
              onClick={() => {
                setStage("welcome");
                setScore(0);
                setHearts([]);
                setReasonIndex(0);
                setNoIndex(0);
              }}
              className="mt-8 rounded-full bg-rose-500 px-7 py-3 font-semibold text-white transition hover:bg-rose-600"
            >
              Restart
            </button>
          </div>
        </section>
      )}

      <style jsx global>{`
        .heart-pop {
          animation: heartEnter 1.2s ease-out forwards, heartFloat 2.2s ease-in-out infinite;
        }
        .reason-in {
          animation: reasonIn 0.45s ease-out;
        }
        .celebrate {
          top: 100%;
          animation-name: rise;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .final-heart {
          top: 105%;
          animation: subtleRise 6s linear infinite;
        }
        @keyframes heartEnter {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.4);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes heartFloat {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-9px);
          }
        }
        @keyframes reasonIn {
          0% {
            opacity: 0;
            transform: translateY(16px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes rise {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            transform: translateY(-120vh) scale(1.2);
            opacity: 0;
          }
        }
        @keyframes subtleRise {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-120vh);
            opacity: 0;
          }
        }
      `}</style>
    </main>
  );
}
