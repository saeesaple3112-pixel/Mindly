import { useEffect, useState } from "react";

import {
  HeartHandshake,
  Calendar,
  ShieldCheck,
  X,
} from "lucide-react";


const THERAPIST_API =
  "/api/moods/therapists/";

const REQUEST_API =
  "/api/moods/therapy-requests/";


export default function Therapist() {

  // =====================================================
  // STATE
  // =====================================================

  const [therapists, setTherapists] = useState([]);

  const [selectedTherapist, setSelectedTherapist] =
    useState(null);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);

  const [booking, setBooking] = useState(false);


  // =====================================================
  // LOAD THERAPISTS
  // =====================================================

  useEffect(() => {

    fetchTherapists();

  }, []);


  const fetchTherapists = async () => {

    try {

      const response = await fetch(
        THERAPIST_API
      );

      if (!response.ok) {

        throw new Error(
          "Failed to load therapists"
        );

      }

      const data = await response.json();

      setTherapists(data);

    } catch (error) {

      console.error(
        "Error loading therapists:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // OPEN REQUEST MODAL
  // =====================================================

  const openRequest = (therapist) => {

    setSelectedTherapist(therapist);

    setMessage("");

  };


  // =====================================================
  // CLOSE REQUEST MODAL
  // =====================================================

  const closeRequest = () => {

    setSelectedTherapist(null);

    setMessage("");

  };


  // =====================================================
  // SEND SESSION REQUEST
  // =====================================================

  const submitRequest = async () => {

    if (!selectedTherapist) {
      return;
    }

    setBooking(true);

    try {

      const response = await fetch(
        REQUEST_API,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            therapist:
              selectedTherapist.id,

            message:
              message.trim(),

          }),
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Failed to send request"
        );

      }


      alert(
        `Session request sent to ${selectedTherapist.name} 💜`
      );


      closeRequest();


    } catch (error) {

      console.error(
        "Error sending request:",
        error
      );

      alert(
        "Could not send your request. Please try again."
      );


    } finally {

      setBooking(false);

    }

  };


  // =====================================================
  // SCROLL TO THERAPISTS
  // =====================================================

  const findTherapist = () => {

    document
      .getElementById("therapist-list")
      ?.scrollIntoView({
        behavior: "smooth",
      });

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="flex flex-col gap-6">


      {/* =================================================
          HEADER
      ================================================= */}

      <header>

        <h1 className="font-display text-3xl text-dusk-900">
          Talk to someone
        </h1>

        <p className="text-dusk-600 text-sm mt-1">
          Your mood and dream patterns can optionally
          be shared with a therapist you choose.
        </p>

      </header>


      {/* =================================================
          MATCH BANNER
      ================================================= */}

      <section
        className="
          bg-dusk-900
          rounded-3xl
          p-6
          md:p-8
          text-dusk-50
          flex
          flex-col
          md:flex-row
          items-start
          md:items-center
          gap-6
          justify-between
        "
      >

        <div className="flex items-center gap-4">

          <HeartHandshake
            size={28}
            className="text-dawn-300"
          />

          <div>

            <h2 className="font-display text-xl text-white">
              Not sure where to start?
            </h2>

            <p className="text-sm text-dusk-200/80 mt-1">
              Choose someone based on what you'd
              like support with.
            </p>

          </div>

        </div>


        <button
          onClick={findTherapist}
          className="
            bg-dawn-400
            text-night-900
            text-sm
            font-medium
            px-5
            py-2.5
            rounded-full
            hover:bg-dawn-300
            transition-colors
            whitespace-nowrap
          "
        >
          Find a therapist
        </button>

      </section>


      {/* =================================================
          THERAPIST LIST
      ================================================= */}

      <div
        id="therapist-list"
        className="grid sm:grid-cols-3 gap-5"
      >


        {/* LOADING */}

        {loading && (

          <div
            className="
              col-span-full
              text-center
              text-sm
              text-dusk-400
              py-8
            "
          >
            Loading therapists...
          </div>

        )}


        {/* EMPTY */}

        {!loading &&
          therapists.length === 0 && (

            <div
              className="
                col-span-full
                bg-white
                rounded-3xl
                border
                border-dusk-100
                p-8
                text-center
                text-sm
                text-dusk-500
              "
            >
              No therapists are currently available.
            </div>

          )}


        {/* THERAPIST CARDS */}

        {!loading &&
          therapists.map((therapist) => (

            <div
              key={therapist.id}
              className="
                bg-white
                rounded-3xl
                border
                border-dusk-100
                p-6
                flex
                flex-col
                gap-4
              "
            >


              {/* AVATAR */}

              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-dusk-100
                  flex
                  items-center
                  justify-center
                  text-dusk-700
                  font-display
                  text-lg
                "
              >
                {therapist.name.charAt(0)}
              </div>


              {/* DETAILS */}

              <div>

                <h3
                  className="
                    font-display
                    text-lg
                    text-dusk-900
                  "
                >
                  {therapist.name}
                </h3>


                <p className="text-sm text-dusk-600">
                  {therapist.focus}
                </p>


                <p className="text-xs text-dusk-400 mt-1">
                  {therapist.experience} experience
                </p>


                <p className="text-xs text-dusk-400 mt-1">
                  {therapist.session_type}
                </p>


                <p className="text-xs text-green-600 mt-2">
                  ● {therapist.availability}
                </p>

              </div>


              {/* BIO */}

              {therapist.bio && (

                <p
                  className="
                    text-xs
                    text-dusk-500
                    leading-relaxed
                  "
                >
                  {therapist.bio}
                </p>

              )}


              {/* REQUEST BUTTON */}

              <button
                onClick={() =>
                  openRequest(therapist)
                }
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-white
                  bg-dusk-900
                  rounded-full
                  px-4
                  py-2
                  w-fit
                  hover:bg-dusk-800
                  transition-colors
                "
              >

                <Calendar size={14} />

                Request session

              </button>

            </div>

          ))}

      </div>


      {/* =================================================
          PRIVACY NOTE
      ================================================= */}

      <div
        className="
          flex
          items-center
          gap-2
          text-xs
          text-dusk-500
        "
      >

        <ShieldCheck size={14} />

        Sharing your app data with a therapist is
        always optional and off by default.

      </div>


      {/* =================================================
          REQUEST MODAL
      ================================================= */}

      {selectedTherapist && (

        <div
          className="
            fixed
            inset-0
            bg-black/40
            flex
            items-center
            justify-center
            p-4
            z-50
          "
        >

          <div
            className="
              bg-white
              rounded-3xl
              p-6
              w-full
              max-w-md
              shadow-xl
            "
          >


            {/* MODAL HEADER */}

            <div
              className="
                flex
                items-start
                justify-between
                gap-4
              "
            >

              <div>

                <p className="text-xs text-dusk-400">
                  Request a session
                </p>

                <h2
                  className="
                    font-display
                    text-2xl
                    text-dusk-900
                    mt-1
                  "
                >
                  {selectedTherapist.name}
                </h2>

                <p className="text-sm text-dusk-600 mt-1">
                  {selectedTherapist.focus}
                </p>

              </div>


              <button
                onClick={closeRequest}
                className="
                  text-dusk-400
                  hover:text-dusk-900
                "
              >

                <X size={20} />

              </button>

            </div>


            {/* MESSAGE */}

            <div className="mt-6">

              <label
                className="
                  text-xs
                  text-dusk-500
                "
              >
                Optional message
              </label>


              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                placeholder="Anything you'd like the therapist to know?"
                rows={4}
                className="
                  w-full
                  mt-2
                  border
                  border-dusk-100
                  rounded-2xl
                  p-3
                  text-sm
                  text-dusk-800
                  outline-none
                  focus:border-dusk-300
                  resize-none
                "
              />

            </div>


            {/* SUBMIT */}

            <button
              onClick={submitRequest}
              disabled={booking}
              className="
                w-full
                mt-4
                bg-dusk-900
                text-white
                rounded-full
                py-3
                text-sm
                hover:bg-dusk-800
                transition-colors
                disabled:opacity-50
              "
            >

              {booking
                ? "Sending request..."
                : "Send session request"}

            </button>

          </div>

        </div>

      )}

    </div>

  );

}