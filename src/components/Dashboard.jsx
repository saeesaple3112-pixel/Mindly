import { useEffect, useState } from "react";
import {
  Wind,
  NotebookPen,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import MoodOrb from "./MoodOrb";


const API_URL = "/api/moods/";

const DAILY_API = "/api/moods/daily/";


const moods = [
  {
    emoji: "😞",
    name: "sad",
    score: 1,
  },
  {
    emoji: "😕",
    name: "anxious",
    score: 2,
  },
  {
    emoji: "😐",
    name: "neutral",
    score: 3,
  },
  {
    emoji: "🙂",
    name: "good",
    score: 4,
  },
  {
    emoji: "😄",
    name: "happy",
    score: 5,
  },
];


function getToday() {

  const today = new Date();

  return `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;
}


function formatToday() {

  return new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    }
  );
}


export default function Dashboard({ onChange }) {

  const [todayMood, setTodayMood] =
    useState(null);

  const [dailyAnalysis, setDailyAnalysis] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [savingMood, setSavingMood] =
    useState(false);


  // =====================================================
  // LOAD TODAY'S MOOD
  // =====================================================

  async function fetchTodayMood() {

    try {

      const response =
        await fetch(API_URL);

      if (!response.ok) {

        throw new Error(
          "Failed to fetch moods"
        );

      }

      const data =
        await response.json();

      const today =
        getToday();

      const entry =
        Array.isArray(data)
          ? data.find(
              (item) =>
                item.entry_date === today
            )
          : null;

      setTodayMood(
        entry || null
      );

    } catch (error) {

      console.error(
        "Error loading today's mood:",
        error
      );

    }

  }


  // =====================================================
  // LOAD DAILY ANALYSIS
  // =====================================================

  async function fetchDailyAnalysis() {

    try {

      const response =
        await fetch(DAILY_API);

      if (!response.ok) {

        throw new Error(
          "Failed to fetch daily analysis"
        );

      }

      const data =
        await response.json();

      if (data.ready) {

        setDailyAnalysis(data);

      } else {

        setDailyAnalysis(null);

      }

    } catch (error) {

      console.error(
        "Error loading daily analysis:",
        error
      );

    }

  }


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    async function loadDashboard() {

      setLoading(true);

      await fetchTodayMood();

      await fetchDailyAnalysis();

      setLoading(false);

    }

    loadDashboard();

  }, []);


  // =====================================================
  // SAVE TODAY'S MOOD
  // =====================================================

  async function saveMood(selectedMood) {

    if (
      todayMood ||
      savingMood
    ) {
      return;
    }

    setSavingMood(true);

    try {

      const response =
        await fetch(
          API_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              mood:
                selectedMood.name,

              mood_score:
                selectedMood.score,

              entry_date:
                getToday(),

            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        alert(
          data.error ||
          data.message ||
          "You have already logged your mood today."
        );

        await fetchTodayMood();

        await fetchDailyAnalysis();

        return;
      }


      setTodayMood(data);


      // Immediately get today's analysis.
      await fetchDailyAnalysis();


    } catch (error) {

      console.error(
        "Error saving mood:",
        error
      );

      alert(
        "Could not save your mood. Please try again."
      );

    } finally {

      setSavingMood(false);

    }

  }


  // =====================================================
  // MOOD SCORE FOR ORB
  // =====================================================

  const selectedMood =
    todayMood
      ? moods.find(
          (mood) =>
            mood.name ===
            todayMood.mood
        )
      : null;


  const orbScore =
    selectedMood
      ? selectedMood.score * 20
      : 0;


  return (

    <div className="flex flex-col gap-6">


      {/* =================================================
          HEADER
      ================================================= */}

      <header>

        <p className="text-dusk-400 text-sm">

          {formatToday()}

        </p>


        <h1 className="font-display text-3xl md:text-4xl text-dusk-900 mt-1">

          Good evening, Saee

        </h1>

      </header>


      {/* =================================================
          TODAY'S MOOD
      ================================================= */}

      <section className="bg-white rounded-3xl border border-dusk-100 p-6 md:p-8 grid md:grid-cols-[auto_1fr] gap-8 items-center">

        <MoodOrb
          score={orbScore}
          label="Today"
        />


        <div>

          <h2 className="font-display text-xl text-dusk-900 mb-2">

            Today's mood

          </h2>


          <p className="text-sm text-dusk-600 max-w-md">

            {loading

              ? "Checking today's mood..."

              : todayMood

              ? `You checked in today and selected ${todayMood.mood}.`

              : "Choose your mood below. Mindly will analyze today's mood and recommend a meditation."}

          </p>


          {todayMood && (

            <p className="text-xs text-dusk-400 mt-3">

              Your daily analysis is ready below.

            </p>

          )}

        </div>

      </section>


      {/* =================================================
          DAILY MOOD CHECK-IN
      ================================================= */}

      <section className="bg-white rounded-3xl border border-dusk-100 p-6 md:p-8">

        <h2 className="font-display text-xl text-dusk-900 mb-2">

          How are you feeling today?

        </h2>


        <p className="text-sm text-dusk-500 mb-5">

          {todayMood

            ? "You've already logged your mood for today."

            : "Choose the mood that feels closest to how you feel right now."}

        </p>


        <div className="flex flex-wrap gap-3">

          {moods.map(
            (mood) => (

              <button

                key={mood.name}

                type="button"

                onClick={() =>
                  saveMood(mood)
                }

                disabled={
                  Boolean(todayMood) ||
                  savingMood ||
                  loading
                }

                className={`text-2xl w-12 h-12 rounded-full transition-all flex items-center justify-center ${
                  todayMood?.mood ===
                  mood.name

                    ? "bg-dawn-200 ring-2 ring-dawn-400 scale-105"

                    : "bg-dusk-50 hover:bg-dusk-100 hover:scale-105"
                } disabled:cursor-not-allowed disabled:opacity-60`}

                aria-label={
                  `Feeling ${mood.name}`
                }

              >

                {mood.emoji}

              </button>

            )
          )}

        </div>


        {savingMood && (

          <p className="text-sm text-dusk-400 mt-3">

            Analyzing today's mood...

          </p>

        )}

      </section>


      {/* =================================================
          DAILY ANALYSIS
      ================================================= */}

      {dailyAnalysis && (

        <section className="bg-dusk-900 rounded-3xl p-6 md:p-8 text-white">

          <div className="flex items-center gap-2 text-dawn-300 text-xs uppercase tracking-wide mb-4">

            <Sparkles size={14} />

            Daily Mood Analysis

          </div>


          <h2 className="font-display text-2xl mb-3">

            {dailyAnalysis.analysis.title}

          </h2>


          <p className="text-dusk-200 text-sm leading-relaxed max-w-2xl">

            {dailyAnalysis.analysis.analysis}

          </p>


          <div className="mt-5 bg-white/5 rounded-2xl p-4">

            <p className="text-xs uppercase tracking-wide text-dawn-300 mb-2">

              Suggested for you

            </p>


            <p className="text-sm text-dusk-100 leading-relaxed">

              {dailyAnalysis.analysis.suggestion}

            </p>

          </div>

        </section>

      )}


      {/* =================================================
          RECOMMENDED MEDITATION
      ================================================= */}

      {dailyAnalysis?.meditation && (

        <section className="bg-white rounded-3xl border border-dusk-100 p-6 md:p-8">

          <div className="flex items-center gap-2 text-dusk-600 text-xs uppercase tracking-wide mb-4">

            <Wind size={15} />

            Meditation for today

          </div>


          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <h2 className="font-display text-xl text-dusk-900">

                {dailyAnalysis.meditation.title}

              </h2>


              <p className="text-sm text-dusk-600 mt-2 max-w-xl leading-relaxed">

                {dailyAnalysis.meditation.description}

              </p>


              <p className="text-xs text-dusk-400 mt-3">

                {dailyAnalysis.meditation.duration} minutes
                {" · "}
                {dailyAnalysis.meditation.tag}

              </p>

            </div>


            <button

              type="button"

              onClick={() =>
                onChange("meditate")
              }

              className="bg-dusk-900 text-white rounded-full px-5 py-2.5 text-sm hover:bg-dusk-800 transition-colors flex items-center gap-2 w-fit"

            >

              Open meditation

              <ArrowRight
                size={14}
              />

            </button>

          </div>

        </section>

      )}


      {/* =================================================
          OTHER FEATURES
      ================================================= */}

      <div className="grid md:grid-cols-2 gap-5">


        <button

          type="button"

          onClick={() =>
            onChange("journal")
          }

          className="text-left bg-white rounded-3xl border border-dusk-100 p-6 flex flex-col gap-3 hover:border-dusk-200 transition-colors"

        >

          <NotebookPen
            size={22}
            className="text-dusk-600"
          />


          <div>

            <h3 className="font-display text-lg text-dusk-900 mb-1">

              Journal

            </h3>


            <p className="text-sm text-dusk-600">

              Write down what's on your mind today.

            </p>

          </div>


          <span className="text-sm text-dusk-600 flex items-center gap-1 mt-auto">

            Write today's entry

            <ArrowRight
              size={14}
            />

          </span>

        </button>


        <button

          type="button"

          onClick={() =>
            onChange("dreams")
          }

          className="text-left bg-gradient-to-br from-dusk-800 to-night-900 rounded-3xl p-6 text-dusk-50 flex flex-col gap-3 hover:opacity-95 transition-opacity"

        >

          <Sparkles
            size={22}
            className="text-mist-300"
          />


          <div>

            <h3 className="font-display text-lg text-white mb-1">

              Dream Log

            </h3>


            <p className="text-sm text-dusk-200/80">

              Log fragments of your dreams and explore their patterns.

            </p>

          </div>


          <span className="text-sm text-mist-300 flex items-center gap-1 mt-auto">

            Log a dream

            <ArrowRight
              size={14}
            />

          </span>

        </button>

      </div>

    </div>

  );

}