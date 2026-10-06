import { useEffect, useState } from "react";

import {
  Wind,
  Play,
  Clock,
  Sparkles,
} from "lucide-react";


const API_URL = "/api/moods/meditation/";

export default function Meditate() {

  const [sessions, setSessions] =
    useState([]);

  const [recommended, setRecommended] =
    useState(null);

  const [todayMood, setTodayMood] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    async function fetchSessions() {

      try {

        const response =
          await fetch(API_URL);

        if (!response.ok) {

          throw new Error(
            "Failed to load meditation exercises"
          );

        }

        const data =
          await response.json();

        setSessions(
          data.exercises || []
        );

        setRecommended(
          data.recommended || null
        );

        setTodayMood(
          data.todayMood || null
        );

      } catch (error) {

        console.error(
          "Error loading meditation exercises:",
          error
        );

      } finally {

        setLoading(false);

      }

    }

    fetchSessions();

  }, []);


  if (loading) {

    return (

      <div className="flex flex-col gap-6">

        <header>

          <h1 className="font-display text-3xl text-dusk-900">

            Meditate

          </h1>


          <p className="text-dusk-600 text-sm mt-1">

            Personalized from today's mood.

          </p>

        </header>


        <div className="bg-white rounded-3xl border border-dusk-100 p-8 text-center text-sm text-dusk-400">

          Loading meditation exercises...

        </div>

      </div>

    );

  }


  return (

    <div className="flex flex-col gap-6">


      {/* =================================================
          HEADER
      ================================================= */}

      <header>

        <h1 className="font-display text-3xl text-dusk-900">

          Meditate

        </h1>


        <p className="text-dusk-600 text-sm mt-1">

          Personalized from today's mood.

        </p>

      </header>


      {/* =================================================
          TODAY'S RECOMMENDATION
      ================================================= */}

      {recommended ? (

        <section className="bg-dusk-900 rounded-3xl p-6 md:p-7 text-white">

          <div className="flex items-center gap-2 text-dawn-300 text-xs uppercase tracking-wide mb-5">

            <Sparkles size={14} />

            Recommended for today

          </div>


          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">


            <div>

              <p className="text-xs text-dusk-300 mb-2">

                Based on today's mood:

                {" "}

                <span className="text-dawn-300">

                  {todayMood}

                </span>

              </p>


              <h2 className="font-display text-2xl mb-2">

                {recommended.title}

              </h2>


              <p className="text-dusk-200 text-sm max-w-lg leading-relaxed">

                {recommended.description}

              </p>


              <div className="flex items-center gap-1 text-dusk-300 text-xs mt-4">

                <Clock size={12} />

                {recommended.duration} min

              </div>

            </div>


            <button

              onClick={() =>
                alert(
                  `Starting ${recommended.title} 🌿`
                )
              }

              className="flex items-center justify-center gap-2 bg-white text-dusk-900 rounded-full px-5 py-2.5 text-sm hover:bg-dusk-50 transition-colors w-fit"

            >

              <Play size={14} />

              Begin

            </button>

          </div>

        </section>

      ) : (

        <section className="bg-white rounded-3xl border border-dusk-100 p-6">

          <div className="flex items-center gap-2 text-dusk-600 text-sm">

            <Sparkles size={16} />

            <span>

              {todayMood

                ? "No meditation exercise is assigned to today's mood yet."

                : "Log your mood today to receive a personalized meditation."}

            </span>

          </div>

        </section>

      )}


      {/* =================================================
          ALL OTHER MEDITATIONS
      ================================================= */}

      <div className="grid sm:grid-cols-2 gap-5">

        {sessions
          .filter(
            (session) =>
              !recommended ||
              session.id !==
                recommended.id
          )
          .map(
            (session) => (

              <div

                key={session.id}

                className="bg-white rounded-3xl border border-dusk-100 p-6 flex flex-col gap-4"

              >

                <div className="flex items-center justify-between">

                  <span className="text-xs uppercase tracking-wide text-dawn-500 font-medium">

                    {session.tag}

                  </span>


                  <span className="flex items-center gap-1 text-xs text-dusk-400">

                    <Clock size={12} />

                    {session.duration} min

                  </span>

                </div>


                <div className="w-12 h-12 rounded-full bg-dusk-50 flex items-center justify-center">

                  <Wind
                    size={20}
                    className="text-dusk-600"
                  />

                </div>


                <div>

                  <h3 className="font-display text-lg text-dusk-900 mb-1">

                    {session.title}

                  </h3>


                  <p className="text-sm text-dusk-600 leading-relaxed">

                    {session.description}

                  </p>

                </div>


                <button

                  onClick={() =>
                    alert(
                      `Starting ${session.title} 🌿`
                    )
                  }

                  className="flex items-center gap-2 text-sm text-white bg-dusk-900 rounded-full px-4 py-2 w-fit hover:bg-dusk-800 transition-colors"

                >

                  <Play size={14} />

                  Begin

                </button>

              </div>

            )
          )}

      </div>

    </div>

  );

}