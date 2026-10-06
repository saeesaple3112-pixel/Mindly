import { useEffect, useState } from "react";

import {
  Brain,
  ChevronDown,
  Heart,
  MessageCircle,
  Moon,
  Palette,
  Route,
  ShieldCheck,
  Sparkles,
  Sprout,
} from "lucide-react";


// =========================================================
// OPTIONS
// =========================================================

const emotions = [
  "Fear",
  "Confusion",
  "Calm",
  "Sadness",
  "Joy",
  "Anger",
  "Curiosity",
];


const colors = [
  { name: "Red", hex: "#C4573A" },
  { name: "Black", hex: "#241F3D" },
  { name: "Blue", hex: "#9AC4E0" },
  { name: "Green", hex: "#7CA37A" },
  { name: "White", hex: "#F7F4FB" },
  { name: "Gold", hex: "#DE8A54" },
];


const API_URL = "/api/moods/dreams/";


// =========================================================
// HELPERS
// =========================================================

function getToday() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(
    `${dateString}T00:00:00`
  );

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}


// =========================================================
// AI RESPONSE PARSER
// =========================================================

function parseAIReflection(text) {
  if (!text) {
    return {
      summary: "",
      themes: "",
      symbols: "",
      emotions: "",
      interpretation: "",
      question: "",
      nextStep: "",
      raw: "",
    };
  }

  const sections = {
    summary: "",
    themes: "",
    symbols: "",
    emotions: "",
    interpretation: "",
    question: "",
    nextStep: "",
    raw: text,
  };

  const patterns = [
    {
      key: "summary",
      regex:
        /1\.\s*SUMMARY\s*([\s\S]*?)(?=2\.\s*DOMINANT THEMES|$)/i,
    },
    {
      key: "themes",
      regex:
        /2\.\s*DOMINANT THEMES\s*([\s\S]*?)(?=3\.\s*IMPORTANT SYMBOLS|$)/i,
    },
    {
      key: "symbols",
      regex:
        /3\.\s*IMPORTANT SYMBOLS\s*([\s\S]*?)(?=4\.\s*EMOTIONAL PATTERN|$)/i,
    },
    {
      key: "emotions",
      regex:
        /4\.\s*EMOTIONAL PATTERN\s*([\s\S]*?)(?=5\.\s*POSSIBLE REFLECTIVE INTERPRETATION|$)/i,
    },
    {
      key: "interpretation",
      regex:
        /5\.\s*POSSIBLE REFLECTIVE INTERPRETATION\s*([\s\S]*?)(?=6\.\s*REFLECTION QUESTION|$)/i,
    },
    {
      key: "question",
      regex:
        /6\.\s*REFLECTION QUESTION\s*([\s\S]*?)(?=7\.\s*GENTLE NEXT STEP|$)/i,
    },
    {
      key: "nextStep",
      regex:
        /7\.\s*GENTLE NEXT STEP\s*([\s\S]*?)$/i,
    },
  ];

  patterns.forEach(({ key, regex }) => {
    const match = text.match(regex);

    if (match && match[1]) {
      sections[key] = match[1].trim();
    }
  });

  return sections;
}


// =========================================================
// NLP HELPERS
// =========================================================

function getNlpAnalysis(dream) {
  return dream?.analysis?.nlp || null;
}


function getAIText(dream) {
  if (!dream?.analysis) {
    return "";
  }

  return (
    dream.analysis.ai ||
    dream.analysis.ai_reflection ||
    dream.analysis.reflection ||
    dream.analysis.dream_reflection ||
    ""
  );
}


function getThemeNames(nlp) {
  if (!nlp?.themes) {
    return [];
  }

  if (!Array.isArray(nlp.themes)) {
    return [];
  }

  return nlp.themes
    .slice(0, 4)
    .map((theme) => {
      if (typeof theme === "string") {
        return theme;
      }

      return theme.name || theme.theme || "";
    })
    .filter(Boolean);
}


function getSymbolNames(nlp) {
  if (!nlp?.symbols) {
    return [];
  }

  if (!Array.isArray(nlp.symbols)) {
    return [];
  }

  return nlp.symbols
    .slice(0, 4)
    .map((symbol) => {
      if (typeof symbol === "string") {
        return symbol;
      }

      return symbol.symbol || symbol.name || "";
    })
    .filter(Boolean);
}


function getEmotionNames(nlp) {
  if (!nlp?.emotions) {
    return [];
  }

  if (!Array.isArray(nlp.emotions)) {
    return [];
  }

  return nlp.emotions
    .slice(0, 4)
    .map((emotion) => {
      if (typeof emotion === "string") {
        return emotion;
      }

      return emotion.emotion || emotion.name || "";
    })
    .filter(Boolean);
}


function getActionNames(nlp) {
  if (!nlp?.actions) {
    return [];
  }

  if (!Array.isArray(nlp.actions)) {
    return [];
  }

  return nlp.actions
    .map((action) => {
      if (typeof action === "string") {
        return action;
      }

      return action.action || action.name || "";
    })
    .filter(Boolean)
    .slice(0, 4);
}


function getNarrativeText(nlp) {
  if (!nlp?.narrative_pattern) {
    return "";
  }

  const narrative = nlp.narrative_pattern;

  const sequence =
    typeof narrative.sequence === "string"
      ? narrative.sequence.split(",").join(" → ")
      : "";

  const resolution = narrative.resolution
    ? `Resolution: ${narrative.resolution}`
    : "";

  if (sequence && resolution) {
    return `${sequence} · ${resolution}`;
  }

  return sequence || resolution || "";
}


// =========================================================
// ANALYSIS CARD
// =========================================================

function InsightCard({
  icon,
  title,
  description,
  children,
  className = "",
}) {
  return (
    <div
      className={`bg-white rounded-3xl border border-dusk-100 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-dusk-50 flex items-center justify-center shrink-0">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.14em] text-dusk-400 font-semibold">
            {title}
          </p>

          {description && (
            <p className="text-xs text-dusk-400 mt-1">
              {description}
            </p>
          )}

          <div className="mt-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}


// =========================================================
// TAG
// =========================================================

function InsightTag({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-dusk-50 border border-dusk-100 px-2.5 py-1 text-[11px] text-dusk-700">
      {children}
    </span>
  );
}


// =========================================================
// AI SECTION
// =========================================================

function AIReflection({ dream }) {
  const aiText = getAIText(dream);

  if (!aiText) {
    return null;
  }

  const reflection = parseAIReflection(aiText);

  return (
    <section className="space-y-4">

      {/* AI HEADER */}

      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-dawn-300/40 flex items-center justify-center">
              <Sparkles
                size={17}
                className="text-dawn-500"
              />
            </div>

            <h2 className="font-display text-2xl text-dusk-900">
              AI reflection
            </h2>
          </div>

          <p className="text-xs text-dusk-500 mt-2 ml-11">
            A gentle interpretation based on your dream and detected patterns.
          </p>
        </div>
      </div>


      {/* SUMMARY */}

      {reflection.summary && (
        <div className="bg-gradient-to-br from-dusk-800 to-night-900 rounded-3xl p-6 md:p-7 text-white shadow-sm">

          <div className="flex items-center gap-2 mb-4">
            <Sparkles
              size={17}
              className="text-mist-300"
            />

            <p className="text-xs uppercase tracking-[0.15em] text-dusk-200/70 font-semibold">
              Your dream
            </p>
          </div>

          <p className="font-display text-xl md:text-2xl leading-relaxed text-dusk-50">
            {reflection.summary}
          </p>

        </div>
      )}


      {/* INTERPRETATION */}

      {reflection.interpretation && (
        <div className="bg-white rounded-3xl border border-dusk-100 p-6 md:p-7 shadow-sm">

          <div className="flex items-center gap-2 mb-4">
            <Brain
              size={18}
              className="text-dusk-600"
            />

            <h3 className="font-display text-xl text-dusk-900">
              Possible interpretation
            </h3>
          </div>

          <p className="text-sm md:text-[15px] leading-7 text-dusk-700">
            {reflection.interpretation}
          </p>

        </div>
      )}


      {/* QUESTION + NEXT STEP */}

      <div className="grid md:grid-cols-2 gap-4">

        {reflection.question && (
          <div className="rounded-3xl bg-mist-300/30 border border-mist-300/60 p-6">

            <div className="flex items-center gap-2 mb-4">
              <MessageCircle
                size={18}
                className="text-dusk-600"
              />

              <p className="text-xs uppercase tracking-[0.14em] font-semibold text-dusk-600">
                Reflection question
              </p>
            </div>

            <p className="font-display text-lg leading-relaxed text-dusk-900">
              {reflection.question}
            </p>

          </div>
        )}


        {reflection.nextStep && (
          <div className="rounded-3xl bg-dawn-300/25 border border-dawn-300/50 p-6">

            <div className="flex items-center gap-2 mb-4">
              <Sprout
                size={18}
                className="text-dawn-500"
              />

              <p className="text-xs uppercase tracking-[0.14em] font-semibold text-dusk-600">
                Gentle next step
              </p>
            </div>

            <p className="text-sm leading-7 text-dusk-700">
              {reflection.nextStep}
            </p>

          </div>
        )}

      </div>


      {/* SAFETY */}

      <div className="flex items-start gap-3 rounded-2xl bg-dusk-50 border border-dusk-100 px-4 py-4">

        <ShieldCheck
          size={17}
          className="text-dusk-500 shrink-0 mt-0.5"
        />

        <p className="text-xs leading-5 text-dusk-500">
          <span className="font-semibold text-dusk-700">
            Exploratory reflection:
          </span>{" "}
          dream interpretations are subjective. This AI feature is designed
          for personal reflection and is not a psychological diagnosis.
        </p>

      </div>

    </section>
  );
}


// =========================================================
// NLP INSIGHTS
// =========================================================

function NLPInsights({ dream }) {
  const nlp = getNlpAnalysis(dream);

  if (!nlp) {
    return null;
  }

  const themes = getThemeNames(nlp);
  const symbols = getSymbolNames(nlp);
  const emotionsFound = getEmotionNames(nlp);
  const actions = getActionNames(nlp);
  const narrative = getNarrativeText(nlp);

  const intensity =
    nlp.intensity?.user_selected ??
    dream.intensity ??
    null;

  return (
    <section className="space-y-4">

      {/* HEADER */}

      <div>
        <div className="flex items-center gap-2">
          <Brain
            size={18}
            className="text-dusk-600"
          />

          <h2 className="font-display text-2xl text-dusk-900">
            Your dream insights
          </h2>
        </div>

        <p className="text-xs text-dusk-500 mt-1 ml-7">
          Patterns identified from the language and details in your dream.
        </p>
      </div>


      {/* INSIGHT GRID */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">

        <InsightCard
          icon={
            <Brain
              size={18}
              className="text-dusk-600"
            />
          }
          title="Themes"
          description="Recurring ideas detected"
        >

          {themes.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {themes.map((theme, index) => (
                <InsightTag key={`${theme}-${index}`}>
                  {theme}
                </InsightTag>
              ))}
            </div>
          ) : (
            <p className="text-xs text-dusk-400">
              No strong themes detected yet.
            </p>
          )}

        </InsightCard>


        <InsightCard
          icon={
            <Sparkles
              size={18}
              className="text-dawn-500"
            />
          }
          title="Symbols"
          description="Notable dream elements"
        >

          {symbols.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {symbols.map((symbol, index) => (
                <InsightTag key={`${symbol}-${index}`}>
                  {symbol}
                </InsightTag>
              ))}
            </div>
          ) : (
            <p className="text-xs text-dusk-400">
              No prominent symbols detected.
            </p>
          )}

        </InsightCard>


        <InsightCard
          icon={
            <Heart
              size={18}
              className="text-dawn-500"
            />
          }
          title="Emotional pattern"
          description="Feelings present in the dream"
        >

          <div className="flex flex-wrap gap-1.5">

            {dream.emotion && (
              <InsightTag>
                {dream.emotion} · selected
              </InsightTag>
            )}

            {emotionsFound.map(
              (item, index) => (
                <InsightTag
                  key={`${item}-${index}`}
                >
                  {item}
                </InsightTag>
              )
            )}

          </div>

        </InsightCard>


        <InsightCard
          icon={
            <Route
              size={18}
              className="text-dusk-600"
            />
          }
          title="Dream pattern"
          description="How the dream unfolds"
        >

          {narrative ? (
            <p className="text-xs leading-5 text-dusk-600">
              {narrative}
            </p>
          ) : actions.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {actions.map(
                (action, index) => (
                  <InsightTag
                    key={`${action}-${index}`}
                  >
                    {action}
                  </InsightTag>
                )
              )}
            </div>
          ) : (
            <p className="text-xs text-dusk-400">
              Narrative pattern will appear here.
            </p>
          )}

        </InsightCard>

      </div>


      {/* SECONDARY DATA */}

      <div className="grid sm:grid-cols-3 gap-3">

        {dream.dominant_color && (
          <div className="bg-white rounded-2xl border border-dusk-100 px-4 py-3 flex items-center gap-3">

            <Palette
              size={17}
              className="text-mist-400"
            />

            <div>
              <p className="text-[10px] uppercase tracking-wide text-dusk-400">
                Dominant colour
              </p>

              <p className="text-sm font-medium text-dusk-800">
                {dream.dominant_color}
              </p>
            </div>

          </div>
        )}


        {intensity !== null && (
          <div className="bg-white rounded-2xl border border-dusk-100 px-4 py-3">

            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-wide text-dusk-400">
                Intensity
              </p>

              <p className="text-xs font-semibold text-dusk-700">
                {intensity}%
              </p>
            </div>

            <div className="h-1.5 bg-dusk-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-dawn-400 rounded-full transition-all duration-500"
                style={{
                  width: `${intensity}%`,
                }}
              />
            </div>

          </div>
        )}


       {nlp.intensity?.language_signal && (
  <div className="bg-white rounded-2xl border border-dusk-100 px-4 py-3">

    <p className="text-[10px] uppercase tracking-wide text-dusk-400">
      Language signal
    </p>

    <p className="text-sm font-medium text-dusk-800 mt-1">
      {nlp.intensity.language_signal.label}
    </p>

  </div>
)}

      </div>

    </section>
  );
}


// =========================================================
// DREAM ANALYSIS DISPLAY
// =========================================================

function DreamAnalysis({ dream }) {
  if (!dream?.analysis) {
    return null;
  }

  const hasNlp = Boolean(
    dream.analysis.nlp
  );

  const hasAI = Boolean(
    getAIText(dream)
  );

  if (!hasNlp && !hasAI) {
    return null;
  }

  return (
    <div className="mt-8 space-y-8">

      <div className="h-px bg-dusk-100" />

      {hasNlp && (
        <NLPInsights dream={dream} />
      )}

      {hasAI && (
        <AIReflection dream={dream} />
      )}

    </div>
  );
}


// =========================================================
// DREAM LOG
// =========================================================

export default function DreamLog() {

  const [dreamText, setDreamText] =
    useState("");

  const [emotion, setEmotion] =
    useState(null);

  const [color, setColor] =
    useState(null);

  const [intensity, setIntensity] =
    useState(50);

  const [pastDreams, setPastDreams] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [expandedDream, setExpandedDream] =
    useState(null);


  // =====================================================
  // LOAD DREAMS
  // =====================================================

  useEffect(() => {
    fetchDreams();
  }, []);


  async function fetchDreams() {

    try {

      setLoading(true);

      const response =
        await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          "Failed to load dreams"
        );
      }

      const data =
        await response.json();

      setPastDreams(data);

    } catch (error) {

      console.error(
        "Error loading dreams:",
        error
      );

    } finally {

      setLoading(false);

    }
  }


  // =====================================================
  // SAVE + ANALYZE DREAM
  // =====================================================

  async function saveDream() {

    if (!dreamText.trim()) {

      setMessage(
        "Write a little about your dream first 🌙"
      );

      return;
    }


    try {

      setSaving(true);

      setMessage("");


      const dreamData = {

        dream_text:
          dreamText.trim(),

        emotion:
          emotion || "",

        dominant_color:
          color || "",

        intensity:
          Number(intensity),

        entry_date:
          getToday(),

      };


      const response =
        await fetch(
          API_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                dreamData
              ),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        console.error(
          "Dream save error:",
          data
        );

        throw new Error(
          data?.error ||
          "Could not save dream"
        );
      }


      // Add newly analyzed dream
      // to the beginning of history

      setPastDreams(
        (previous) => [
          data,
          ...previous,
        ]
      );


      // Automatically show the
      // newly generated analysis

      setExpandedDream(
        data.id
      );


      // Clear form

      setDreamText("");

      setEmotion(null);

      setColor(null);

      setIntensity(50);


      setMessage(
        "Your dream has been analyzed ✨"
      );


      // Scroll slightly toward results

      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);


    } catch (error) {

      console.error(
        "Error saving dream:",
        error
      );

      setMessage(
        error.message ||
        "Something went wrong while analyzing your dream."
      );

    } finally {

      setSaving(false);

    }
  }
  // =========================================================
// DELETE DREAM
// =========================================================

async function deleteDream(id) {
  try {
    const response = await fetch(
      `/api/moods/dreams/${id}/`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      throw new Error(
        data?.error || "Could not delete dream"
      );
    }

    setPastDreams((previous) =>
      previous.filter(
        (dream) => dream.id !== id
      )
    );

    if (expandedDream === id) {
      setExpandedDream(null);
    }

    setMessage(
      "Dream deleted successfully."
    );

  } catch (error) {

    console.error(
      "Error deleting dream:",
      error
    );

    setMessage(
      error.message ||
      "Could not delete dream."
    );
  }
}


  // =====================================================
  // TOGGLE DREAM
  // =====================================================

  function toggleDream(dreamId) {

    setExpandedDream(
      (current) =>
        current === dreamId
          ? null
          : dreamId
    );
  }


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="flex flex-col gap-8">


      {/* =================================================
          HERO HEADER
      ================================================= */}

      <header className="relative overflow-hidden">

        <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-mist-300/20 blur-3xl pointer-events-none" />

        <div className="relative">

          <div className="inline-flex items-center gap-2 rounded-full bg-dusk-100 px-3 py-1.5 mb-3">

            <Moon
              size={13}
              className="text-dusk-600"
            />

            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-dusk-600">
              Dream Lab
            </span>

          </div>


          <h1 className="font-display text-4xl md:text-5xl text-dusk-900 tracking-tight">
            Understand your dreams
          </h1>


          <p className="text-dusk-600 text-sm md:text-[15px] mt-2 max-w-2xl leading-6">
            Explore the emotions, patterns, and symbols hidden in what
            you remember — with gentle AI-assisted reflection.
          </p>

        </div>

      </header>


      {/* =================================================
          DREAM INPUT
      ================================================= */}

      <section className="relative overflow-hidden bg-gradient-to-br from-dusk-800 via-dusk-800 to-night-900 rounded-[2rem] p-6 md:p-8 text-dusk-50 shadow-lg">

        {/* Decorative glow */}

        <div className="absolute -right-16 -top-20 w-56 h-56 rounded-full bg-mist-400/10 blur-3xl pointer-events-none" />

        <div className="absolute -left-20 -bottom-24 w-52 h-52 rounded-full bg-dawn-400/10 blur-3xl pointer-events-none" />


        <div className="relative">

          {/* HEADER */}

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">

            <div>

              <div className="flex items-center gap-2 mb-2">

                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">

                  <Sparkles
                    size={17}
                    className="text-mist-300"
                  />

                </div>

                <p className="text-[10px] uppercase tracking-[0.16em] text-dusk-200/60 font-semibold">
                  New dream
                </p>

              </div>

              <h2 className="font-display text-2xl md:text-3xl text-white">
                What do you remember?
              </h2>

              <p className="text-xs text-dusk-200/60 mt-1">
                Even fragments, feelings, colours, or small details can help.
              </p>

            </div>


            <div className="hidden md:flex items-center gap-2 text-[11px] text-dusk-200/50">
              <Moon size={13} />
              <span>Private reflection space</span>
            </div>

          </div>


          {/* DREAM TEXT */}

          <textarea

            value={dreamText}

            onChange={(e) =>
              setDreamText(
                e.target.value
              )
            }

            placeholder="Tell us everything you remember... for example, where you were, who was there, what happened, and how you felt."

            rows={6}

            className="w-full bg-white/[0.06] border border-white/10 rounded-2xl p-5 text-sm leading-6 placeholder:text-dusk-200/35 outline-none focus:border-mist-400/60 focus:bg-white/[0.08] resize-none transition-all"

          />


          {/* CONTROLS */}

          <div className="grid lg:grid-cols-2 gap-6 mt-6">


            {/* EMOTION */}

            <div>

              <p className="text-[10px] uppercase tracking-[0.14em] text-dusk-200/60 mb-3 font-semibold">
                What did it feel like?
              </p>


              <div className="flex flex-wrap gap-2">

                {emotions.map(
                  (item) => (

                    <button

                      key={item}

                      type="button"

                      onClick={() =>
                        setEmotion(item)
                      }

                      className={`text-xs px-3.5 py-2 rounded-full border transition-all duration-200 ${
                        emotion === item
                          ? "bg-mist-400 text-night-900 border-mist-400 shadow-sm"
                          : "border-white/15 text-dusk-200/80 hover:border-white/30 hover:bg-white/5"
                      }`}

                    >

                      {item}

                    </button>

                  )
                )}

              </div>

            </div>


            {/* COLOUR */}

            <div>

              <p className="text-[10px] uppercase tracking-[0.14em] text-dusk-200/60 mb-3 font-semibold">
                Dominant colour, if any
              </p>


              <div className="flex items-center gap-3">

                {colors.map(
                  (item) => (

                    <button

                      key={item.name}

                      type="button"

                      onClick={() =>
                        setColor(item.name)
                      }

                      aria-label={item.name}

                      title={item.name}

                      style={{
                        backgroundColor:
                          item.hex,
                      }}

                      className={`w-9 h-9 rounded-full border-2 transition-all duration-200 ${
                        color === item.name
                          ? "border-white scale-110 shadow-lg"
                          : "border-white/20 hover:border-white/60 hover:scale-105"
                      }`}

                    />

                  )
                )}

                {color && (
                  <span className="text-xs text-dusk-200/70 ml-1">
                    {color}
                  </span>
                )}

              </div>

            </div>

          </div>


          {/* INTENSITY */}

          <div className="mt-7">

            <div className="flex items-center justify-between mb-2">

              <p className="text-[10px] uppercase tracking-[0.14em] text-dusk-200/60 font-semibold">
                How intense did it feel?
              </p>

              <span className="text-sm font-semibold text-dusk-50">
                {intensity}%
              </span>

            </div>


            <input

              type="range"

              min="0"

              max="100"

              value={intensity}

              onChange={(e) =>
                setIntensity(
                  Number(e.target.value)
                )
              }

              className="w-full accent-dawn-400 cursor-pointer"

            />

            <div className="flex justify-between text-[10px] text-dusk-200/40 mt-1">
              <span>Subtle</span>
              <span>Very vivid</span>
            </div>

          </div>


          {/* ANALYZE BUTTON */}

          <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3">

            <button

              type="button"

              onClick={saveDream}

              disabled={saving}

              className={`inline-flex items-center justify-center gap-2 text-night-900 text-sm font-semibold px-6 py-3 rounded-full transition-all duration-200 ${
                saving
                  ? "bg-dawn-300 cursor-not-allowed"
                  : "bg-dawn-400 hover:bg-dawn-300 hover:-translate-y-0.5 shadow-md"
              }`}

            >

              <Sparkles
                size={16}
              />

              {saving
                ? "Analyzing..."
                : "Analyze my dream"}

            </button>


            <p className="text-[11px] text-dusk-200/45">
              Your dream will be analyzed using Mindly's NLP + local AI engine.
            </p>

          </div>


          {/* MESSAGE */}

          {message && (

            <div className="mt-4 text-xs text-dusk-200 flex items-center gap-2">

              <div className="w-1.5 h-1.5 rounded-full bg-mist-300" />

              {message}

            </div>

          )}

        </div>

      </section>


      {/* =================================================
          MOST RECENT RESULT
      ================================================= */}

      {pastDreams.length > 0 &&
        pastDreams[0]?.analysis && (
          <DreamAnalysis
            dream={pastDreams[0]}
          />
        )
      }


      {/* =================================================
          RECENT DREAMS
      ================================================= */}

      <section>

        <div className="flex items-end justify-between gap-4 mb-4">

          <div>

            <p className="text-[10px] uppercase tracking-[0.16em] text-dusk-400 font-semibold mb-1">
              Your collection
            </p>

            <h2 className="font-display text-2xl text-dusk-900">
              Recent dreams
            </h2>

          </div>


          {pastDreams.length > 0 && (
            <span className="text-xs text-dusk-400">
              {pastDreams.length}{" "}
              {pastDreams.length === 1
                ? "dream"
                : "dreams"}
            </span>
          )}

        </div>


        {/* LOADING */}

        {loading ? (

          <div className="bg-white rounded-3xl border border-dusk-100 p-6">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-xl bg-dusk-50 animate-pulse" />

              <div className="space-y-2">

                <div className="w-32 h-3 bg-dusk-100 rounded animate-pulse" />

                <div className="w-52 h-2 bg-dusk-50 rounded animate-pulse" />

              </div>

            </div>

          </div>

        ) : pastDreams.length === 0 ? (

          <div className="bg-white rounded-3xl border border-dusk-100 p-8 text-center">

            <div className="w-12 h-12 rounded-2xl bg-dusk-50 flex items-center justify-center mx-auto mb-3">

              <Moon
                size={22}
                className="text-dusk-400"
              />

            </div>

            <p className="font-display text-lg text-dusk-800">
              No dreams logged yet.
            </p>

            <p className="text-xs text-dusk-400 mt-1">
              Your dream memories will appear here.
            </p>

          </div>

        ) : (

          <div className="flex flex-col gap-3">

            {pastDreams.map(
              (dream) => {

                const isExpanded =
                  expandedDream === dream.id;

                const nlp =
                  getNlpAnalysis(dream);

                const themes =
                  getThemeNames(nlp);

                const hasAnalysis =
                  Boolean(
                    dream.analysis
                  );

                return (

                  <div
                    key={dream.id}
                    className={`bg-white rounded-3xl border transition-all duration-300 ${
                      isExpanded
                        ? "border-dusk-200 shadow-md"
                        : "border-dusk-100 hover:border-dusk-200 hover:shadow-sm"
                    }`}
                  >

                    {/* DREAM HEADER */}

                    <button

                      type="button"

                      onClick={() =>
                        toggleDream(
                          dream.id
                        )
                      }

                      className="w-full text-left p-5 md:p-6"

                    >

                      <div className="flex gap-4">

                        {/* ICON */}

                        <div className="w-11 h-11 rounded-2xl bg-dusk-50 flex items-center justify-center shrink-0">

                          <Moon
                            size={17}
                            className="text-dusk-600"
                          />

                        </div>


                        {/* CONTENT */}

                        <div className="flex-1 min-w-0">

                          <div className="flex items-center justify-between gap-3 mb-2">

                            <p className="text-xs text-dusk-400">
                              {formatDate(
                                dream.entry_date
                              )}
                            </p>


                     <div className="flex items-center gap-2">

  {dream.emotion && (
    <span className="text-[11px] text-dawn-500 font-medium">
      {dream.emotion}
    </span>
  )}

  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      deleteDream(dream.id);
    }}
    className="text-[11px] text-red-500 hover:text-red-700 font-medium"
  >
    Delete
  </button>

  <ChevronDown
    size={16}
    className={`text-dusk-400 transition-transform duration-300 ${
      isExpanded ? "rotate-180" : ""
    }`}
  />

</div>

                          </div>


                          <p className="text-sm leading-6 text-dusk-800 line-clamp-2">

                            {dream.dream_text}

                          </p>


                          {/* TAGS */}

                          <div className="flex flex-wrap gap-1.5 mt-3">

                            {dream.dominant_color && (

                              <span className="text-[10px] bg-dusk-50 text-dusk-600 px-2.5 py-1 rounded-full">

                                {dream.dominant_color}

                              </span>

                            )}


                            <span className="text-[10px] bg-dusk-50 text-dusk-600 px-2.5 py-1 rounded-full">

                              Intensity {dream.intensity}%

                            </span>


                            {themes
                              .slice(0, 2)
                              .map(
                                (
                                  theme,
                                  index
                                ) => (

                                  <span
                                    key={`${theme}-${index}`}
                                    className="text-[10px] bg-mist-300/30 text-dusk-600 px-2.5 py-1 rounded-full"
                                  >
                                    {theme}
                                  </span>

                                )
                              )}

                          </div>

                        </div>

                      </div>

                    </button>


                    {/* EXPANDED ANALYSIS */}

                    {isExpanded && hasAnalysis && (

                      <div className="px-5 md:px-6 pb-6">

                        <DreamAnalysis
                          dream={dream}
                        />

                      </div>

                    )}

                  </div>

                );

              }
            )}

          </div>

        )}

      </section>


      {/* =================================================
          PATTERN INSIGHT
      ================================================= */}

      <section className="relative overflow-hidden bg-dusk-100 rounded-3xl p-6 md:p-7">

        <div className="absolute -right-10 -bottom-16 w-40 h-40 rounded-full bg-mist-300/30 blur-3xl pointer-events-none" />

        <div className="relative flex items-start gap-4">

          <div className="w-10 h-10 rounded-2xl bg-white/70 flex items-center justify-center shrink-0">

            <Route
              size={18}
              className="text-dusk-600"
            />

          </div>


          <div>

            <p className="text-xs uppercase tracking-[0.14em] text-dusk-500 font-semibold">
              Pattern insights
            </p>

            <p className="text-sm text-dusk-700 leading-6 mt-2 max-w-2xl">
              As you log more dreams, Mindly can help you notice
              recurring themes, emotions, colours, symbols, and
              narrative patterns across your dream history.
            </p>

            <div className="flex items-center gap-2 mt-3">

              <ShieldCheck
                size={14}
                className="text-dusk-400"
              />

              <p className="text-[11px] text-dusk-500">
                Exploratory reflection only — not a psychological diagnosis.
              </p>

            </div>

          </div>

        </div>

      </section>


    </div>
  );
}