import { useEffect, useState } from "react";
import { PenLine } from "lucide-react";

const API_URL = "/api/moods/journal/";

function getToday() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Journal() {
  const [draft, setDraft] = useState("");
  const [entries, setEntries] = useState([]);
  const [saving, setSaving] = useState(false);

  // Load saved journal entries from PostgreSQL through Django
  const fetchEntries = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load journal entries");
      }

      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error("Error loading journal entries:", error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Save a new journal entry
  const saveEntry = async () => {
    if (!draft.trim()) {
      alert("Write something before saving your entry.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "",
          content: draft,
          entry_date: getToday(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to save journal entry"
        );
      }

      // Add the newly saved entry to the top
      setEntries((previousEntries) => [
        data,
        ...previousEntries,
      ]);

      // Clear the writing area for a fresh entry
      setDraft("");

      alert("Journal entry saved 💜");
    } catch (error) {
      console.error("Error saving journal entry:", error);
      alert("Could not save your journal entry. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl text-dusk-900">
          Journal
        </h1>

        <p className="text-dusk-600 text-sm mt-1">
          A private space for whatever's on your mind.
        </p>
      </header>

      {/* New journal entry */}
      <section className="bg-white rounded-3xl border border-dusk-100 p-6">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="What's on your mind today?"
          rows={5}
          className="w-full resize-none bg-transparent outline-none text-dusk-900 placeholder:text-dusk-400 text-sm leading-relaxed"
        />

        <div className="flex justify-end mt-3">
          <button
            onClick={saveEntry}
            disabled={saving}
            className="flex items-center gap-2 bg-dusk-900 text-white text-sm px-5 py-2.5 rounded-full hover:bg-dusk-800 transition-colors disabled:opacity-50"
          >
            <PenLine size={15} />

            {saving ? "Saving..." : "Save entry"}
          </button>
        </div>
      </section>

      {/* Saved journal entries */}
      <div className="flex flex-col gap-3">
        {entries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dusk-100 p-5 text-sm text-dusk-400 text-center">
            Your saved journal entries will appear here.
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl border border-dusk-100 p-5 flex gap-4"
            >
              <span className="text-2xl">📖</span>

              <div>
                <p className="text-xs text-dusk-400 mb-1">
                  {formatDate(entry.entry_date)}
                </p>

                <p className="text-sm text-dusk-800 leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}