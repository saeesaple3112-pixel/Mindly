from moods.dream_ai import generate_dream_reflection


dream_text = """
I was walking through a quiet forest when I suddenly heard a wolf behind me.
I became scared and started running away because it was chasing me.
I found a small wooden cabin and hid inside.
After a while I felt calm and safe, and then I woke up.
"""


nlp_result = {
    "themes": [
        {
            "theme": "Escape & Avoidance",
            "score": 3,
            "matched_words": [
                "running away",
                "hid"
            ]
        },
        {
            "theme": "Safety & Shelter",
            "score": 3,
            "matched_words": [
                "safe",
                "hid in"
            ]
        },
        {
            "theme": "Fear & Threat",
            "score": 2,
            "matched_words": [
                "scared",
                "chasing"
            ]
        },
        {
            "theme": "Calm & Safety",
            "score": 2,
            "matched_words": [
                "calm",
                "safe"
            ]
        }
    ],

    "symbols": [
        {
            "symbol": "Wolf",
            "category": "Animal",
            "matched_words": [
                "wolf"
            ]
        },
        {
            "symbol": "Forest",
            "category": "Nature",
            "matched_words": [
                "forest"
            ]
        },
        {
            "symbol": "Hut",
            "category": "Shelter",
            "matched_words": [
                "cabin"
            ]
        }
    ],

    "emotions": [
        {
            "emotion": "Fear",
            "source": "user_selected"
        },
        {
            "emotion": "Calm",
            "source": "text",
            "matched_words": [
                "calm",
                "safe"
            ]
        },
        {
            "emotion": "Fear",
            "source": "text",
            "matched_words": [
                "scared"
            ]
        }
    ],

    "actions": [
        {
            "action": "escape",
            "matched_words": [
                "running away"
            ]
        },
        {
            "action": "hiding",
            "matched_words": [
                "hid"
            ]
        },
        {
            "action": "traveling",
            "matched_words": [
                "walking"
            ]
        }
    ],

    "narrative_pattern": {
        "action": "escape",
        "ending": "waking",
        "sequence": [
            "threat",
            "escape",
            "shelter",
            "waking"
        ],
        "resolution": "shelter",
        "initial_state": "threat"
    },

    "intensity": {
        "user_selected": 63,
        "language_signal": {
            "label": "Moderate",
            "score": 5
        }
    }
}


result = generate_dream_reflection(
    dream_text=dream_text,
    nlp_result=nlp_result,
    selected_emotion="Fear",
    selected_color="Blue",
    intensity=63
)


print("\n================ AI DREAM REFLECTION ================\n")

print(result)

print("\n======================================================\n")