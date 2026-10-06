import re
from collections import Counter


# =========================================================
# STOPWORDS
# =========================================================

STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "if", "then",
    "was", "were", "is", "are", "am", "be", "been",
    "being", "to", "of", "in", "on", "at", "for",
    "from", "with", "into", "onto", "by", "as",
    "that", "this", "these", "those",
    "i", "me", "my", "myself", "we", "our", "ours",
    "you", "your", "he", "him", "his", "she", "her",
    "they", "them", "their",
    "it", "its",
    "who", "which", "what", "when", "where", "how",
    "then", "after", "before", "while", "during",
    "very", "really", "just", "also",
    "up", "down", "out", "away",
    "first", "eventually",
    "able", "got", "get",
    "not", "no", "never",
}


# =========================================================
# GENERIC WORDS
# =========================================================

GENERIC_WORDS = {
    "dream",
    "dreaming",
    "woke",
    "wake",
    "waking",
    "night",
    "time",
    "thing",
    "things",
    "someone",
    "something",
    "felt",
    "feel",
    "feeling",
    "looked",
    "look",
    "went",
    "going",
    "came",
    "come",
    "found",
    "said",
    "saw",
    "made",
    "like",
    "there",
}


# =========================================================
# THEME VOCABULARY
# =========================================================

THEME_RULES = {

    "Fear & Threat": [
        "afraid",
        "scared",
        "fear",
        "terrified",
        "terrifying",
        "danger",
        "dangerous",
        "threat",
        "threatened",
        "attacked",
        "attack",
        "chased",
        "chasing",
        "stalked",
        "stalking",
        "followed",
        "following",
        "trapped",
        "trapped inside",
        "could not escape",
        "not able to escape",
        "coming after me",
    ],

    "Escape & Avoidance": [
        "running away",
        "ran away",
        "run away",
        "running from",
        "ran from",
        "run from",
        "trying to escape",
        "escape",
        "escaped",
        "escaping",
        "getting away",
        "get away",
        "hide",
        "hiding",
        "hid",
        "hide myself",
        "hiding myself",
        "avoiding",
        "avoid",
    ],

    "Safety & Shelter": [
        "found shelter",
        "safe place",
        "safe",
        "safety",
        "shelter",
        "hut",
        "house",
        "home",
        "room",
        "hiding place",
        "hid in",
        "hide in",
        "locked door",
        "reached safety",
    ],

    "Transition & Change": [
        "door",
        "doorway",
        "opened",
        "closed",
        "enter",
        "entered",
        "leaving",
        "left",
        "moving",
        "journey",
        "road",
        "bridge",
        "new place",
    ],

    "Uncertainty & Confusion": [
        "lost",
        "confused",
        "confusion",
        "unknown",
        "strange",
        "dark",
        "couldn't find",
        "didn't know",
        "not sure",
        "nowhere",
    ],

    "Calm & Safety": [
        "calm",
        "peaceful",
        "peace",
        "relaxed",
        "safe",
        "comfort",
        "comfortable",
        "happy",
        "joy",
        "beautiful",
    ],

    "Freedom & Exploration": [
        "travel",
        "travelling",
        "traveling",
        "explore",
        "exploring",
        "flying",
        "fly",
        "freedom",
        "open space",
        "adventure",
        "journey",
    ],

    "Loss & Separation": [
        "lost someone",
        "missing",
        "missed",
        "goodbye",
        "leaving me",
        "left me",
        "alone",
        "separated",
        "separation",
    ],

    "Connection & Relationships": [
        "friend",
        "friends",
        "family",
        "mother",
        "father",
        "sister",
        "brother",
        "partner",
        "love",
        "hug",
        "together",
        "conversation",
    ],
}


# =========================================================
# SYMBOL VOCABULARY
# =========================================================

SYMBOL_RULES = {

    "Tiger": {
        "category": "Animal",
        "words": ["tiger"],
    },

    "Snake": {
        "category": "Animal",
        "words": ["snake", "snakes"],
    },

    "Dog": {
        "category": "Animal",
        "words": ["dog", "dogs", "puppy"],
    },

    "Cat": {
        "category": "Animal",
        "words": ["cat", "cats", "kitten"],
    },

    "Bird": {
        "category": "Animal",
        "words": ["bird", "birds"],
    },

    "Horse": {
        "category": "Animal",
        "words": ["horse", "horses"],
    },

    "Lion": {
        "category": "Animal",
        "words": ["lion", "lions"],
    },

    "Wolf": {
        "category": "Animal",
        "words": ["wolf", "wolves"],
    },

    "Forest": {
        "category": "Nature",
        "words": ["forest", "woods", "woodland"],
    },

    "Ocean": {
        "category": "Nature",
        "words": ["ocean", "sea", "seaside"],
    },

    "Water": {
        "category": "Nature",
        "words": ["water", "river", "lake", "pool"],
    },

    "Mountain": {
        "category": "Nature",
        "words": ["mountain", "mountains", "hill", "hills"],
    },

    "Rain": {
        "category": "Nature",
        "words": ["rain", "raining", "storm"],
    },

    "House": {
        "category": "Place",
        "words": ["house", "home"],
    },

    "Hut": {
        "category": "Shelter",
        "words": ["hut", "cabin"],
    },

    "Doorway": {
        "category": "Transition",
        "words": ["door", "doorway", "entrance"],
    },

    "Room": {
        "category": "Place",
        "words": ["room", "rooms"],
    },

    "School": {
        "category": "Place",
        "words": ["school", "classroom", "college"],
    },

    "Vehicle": {
        "category": "Travel",
        "words": [
            "car",
            "bus",
            "train",
            "vehicle",
            "truck",
            "bike",
            "bicycle",
            "airplane",
            "plane",
        ],
    },

    "Bridge": {
        "category": "Transition",
        "words": ["bridge"],
    },

    "Phone": {
        "category": "Object",
        "words": ["phone", "mobile", "telephone"],
    },

    "Mirror": {
        "category": "Object",
        "words": ["mirror"],
    },

    "Book": {
        "category": "Object",
        "words": ["book", "books"],
    },
}


# =========================================================
# EMOTION VOCABULARY
# =========================================================

EMOTION_RULES = {

    "Fear": [
        "afraid",
        "scared",
        "fear",
        "terrified",
        "terrifying",
        "frightened",
        "panic",
        "panicked",
        "horror",
        "horrified",
    ],

    "Calm": [
        "calm",
        "peaceful",
        "peace",
        "relaxed",
        "relax",
        "comfortable",
        "safe",
        "comfort",
    ],

    "Sadness": [
        "sad",
        "sadness",
        "cry",
        "crying",
        "cried",
        "tears",
        "lonely",
        "loneliness",
        "heartbroken",
        "grief",
    ],

    "Joy": [
        "happy",
        "happiness",
        "joy",
        "excited",
        "exciting",
        "laughed",
        "laughing",
        "smiled",
        "smiling",
        "fun",
    ],

    "Anger": [
        "angry",
        "anger",
        "mad",
        "furious",
        "rage",
        "fighting",
        "fight",
        "shouting",
        "yelling",
    ],

    "Confusion": [
        "confused",
        "confusion",
        "lost",
        "uncertain",
        "strange",
        "didn't know",
        "not sure",
    ],

    "Curiosity": [
        "curious",
        "curiosity",
        "wonder",
        "wondering",
        "interesting",
        "explore",
        "exploring",
    ],
}


# =========================================================
# COLOR VOCABULARY
# =========================================================

COLOR_RULES = {

    "Red": [
        "red",
        "crimson",
        "scarlet",
        "maroon",
    ],

    "Black": [
        "black",
        "dark",
    ],

    "Blue": [
        "blue",
        "navy",
        "cyan",
    ],

    "Green": [
        "green",
        "emerald",
        "lime",
    ],

    "White": [
        "white",
        "ivory",
    ],

    "Yellow": [
        "yellow",
        "golden",
        "gold",
    ],

    "Orange": [
        "orange",
    ],

    "Purple": [
        "purple",
        "violet",
        "lavender",
    ],

    "Pink": [
        "pink",
        "rose",
    ],

    "Brown": [
        "brown",
        "beige",
    ],
}


# =========================================================
# TEXT CLEANING
# =========================================================

def clean_text(text):

    if not text:
        return ""

    text = text.lower()

    # Remove URLs
    text = re.sub(
        r"https?://\S+|www\.\S+",
        " ",
        text
    )

    # Normalize apostrophes
    text = text.replace(
        "’",
        "'"
    )

    # Expand common contractions
    text = text.replace(
        "couldn't",
        "could not"
    )

    text = text.replace(
        "didn't",
        "did not"
    )

    text = text.replace(
        "wasn't",
        "was not"
    )

    text = text.replace(
        "weren't",
        "were not"
    )

    text = text.replace(
        "can't",
        "can not"
    )

    # Keep letters and spaces
    text = re.sub(
        r"[^a-z\s]",
        " ",
        text
    )

    # Remove repeated whitespace
    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# =========================================================
# TOKENIZATION
# =========================================================

def tokenize_text(text):

    return re.findall(
        r"\b[a-z]+\b",
        text
    )


def normalize_tokens(tokens):

    normalized = []

    for token in tokens:

        if token in STOPWORDS:
            continue

        if token in GENERIC_WORDS:
            continue

        if len(token) < 3:
            continue

        normalized.append(token)

    return normalized


# =========================================================
# KEYWORD EXTRACTION
# =========================================================

def extract_keywords(tokens, limit=12):

    meaningful = normalize_tokens(
        tokens
    )

    counts = Counter(
        meaningful
    )

    keywords = []

    for word, count in counts.most_common():

        if word in GENERIC_WORDS:
            continue

        keywords.append(
            word
        )

        if len(keywords) >= limit:
            break

    return keywords


# =========================================================
# PHRASE DETECTION
# =========================================================

PHRASE_RULES = {

    "Escape & Avoidance": [
        "running away",
        "ran away",
        "run away",
        "running from",
        "ran from",
        "run from",
        "trying to escape",
        "getting away",
        "get away",
        "hide myself",
        "hiding myself",
        "hide in",
        "hid in",
        "hiding in",
    ],

    "Threat & Pursuit": [
        "being chased",
        "chased by",
        "followed me",
        "following me",
        "coming after me",
        "attacked by",
        "trying to catch me",
        "not able to catch",
        "could not catch",
    ],

    "Safety & Shelter": [
        "found a hut",
        "found shelter",
        "found a safe place",
        "reached safety",
        "safe place",
        "hid inside",
        "hid myself",
        "hide inside",
        "locked the door",
    ],

    "Fear Response": [
        "felt scared",
        "felt afraid",
        "was scared",
        "was afraid",
        "felt terrified",
        "felt frightened",
    ],

    "Calm Response": [
        "felt calm",
        "felt peaceful",
        "felt safe",
        "felt relaxed",
        "became calm",
    ],

    "Exploration": [
        "looked around",
        "searched for",
        "looking for",
        "explored the",
        "went inside",
        "entered the",
    ],

    "Waking": [
        "woke up",
        "woke suddenly",
        "woke from",
        "awoke",
    ],
}


def detect_phrases(text):

    detected = []

    for category, phrases in PHRASE_RULES.items():

        matched = []

        for phrase in sorted(
            phrases,
            key=len,
            reverse=True
        ):

            if phrase in text:

                matched.append(
                    phrase
                )

        matched = list(
            dict.fromkeys(matched)
        )

        if matched:

            detected.append(
                {
                    "category": category,
                    "phrases": matched,
                }
            )

    return detected


# =========================================================
# THEME DETECTION
# =========================================================

def detect_themes(text):

    theme_scores = {}

    theme_matches = {}

    for theme, words in THEME_RULES.items():

        score = 0
        matches = []

        for word in words:

            if " " in word:

                if word in text:

                    score += 2

                    matches.append(
                        word
                    )

            else:

                pattern = rf"\b{re.escape(word)}\b"

                if re.search(
                    pattern,
                    text
                ):

                    # Special handling for "safe"
                    # because it can belong to both
                    # shelter and calm.
                    score += 1

                    matches.append(
                        word
                    )

        if score > 0:

            theme_scores[theme] = score

            theme_matches[theme] = list(
                dict.fromkeys(matches)
            )

    # -----------------------------------------------------
    # CONTEXT FIX:
    #
    # "running" by itself should NOT automatically
    # mean Freedom & Exploration.
    #
    # If running is clearly associated with escape,
    # chasing, threat, or hiding, remove the
    # Freedom & Exploration theme.
    # -----------------------------------------------------

    escape_context = any(
        phrase in text
        for phrase in [
            "running away",
            "running from",
            "ran away",
            "ran from",
            "run away",
            "run from",
            "trying to escape",
            "getting away",
            "get away",
        ]
    )

    threat_context = any(
        phrase in text
        for phrase in [
            "chased",
            "chasing",
            "followed",
            "following",
            "attacked",
            "danger",
            "threat",
            "scared",
            "afraid",
            "terrified",
        ]
    )

    if escape_context or threat_context:

        theme_scores.pop(
            "Freedom & Exploration",
            None
        )

        theme_matches.pop(
            "Freedom & Exploration",
            None
        )

    sorted_themes = sorted(
        theme_scores.items(),
        key=lambda item: item[1],
        reverse=True
    )

    results = []

    for theme, score in sorted_themes[:5]:

        results.append(
            {
                "theme": theme,
                "score": score,
                "matched_words": theme_matches[theme],
            }
        )

    return results


# =========================================================
# SYMBOL DETECTION
# =========================================================

def detect_symbols(text):

    results = []

    for symbol, data in SYMBOL_RULES.items():

        matched = []

        for word in data["words"]:

            pattern = rf"\b{re.escape(word)}\b"

            if re.search(
                pattern,
                text
            ):

                matched.append(
                    word
                )

        if matched:

            results.append(
                {
                    "symbol": symbol,
                    "category": data["category"],
                    "matched_words": list(
                        dict.fromkeys(matched)
                    ),
                }
            )

    return results


# =========================================================
# EMOTION DETECTION
# =========================================================

def detect_emotions(text):

    results = []

    for emotion, words in EMOTION_RULES.items():

        matched = []

        for word in words:

            if " " in word:

                if word in text:

                    matched.append(
                        word
                    )

            else:

                pattern = rf"\b{re.escape(word)}\b"

                if re.search(
                    pattern,
                    text
                ):

                    matched.append(
                        word
                    )

        if matched:

            results.append(
                {
                    "emotion": emotion,
                    "score": len(matched),
                    "matched_words": list(
                        dict.fromkeys(matched)
                    ),
                    "source": "text",
                }
            )

    results.sort(
        key=lambda item: item["score"],
        reverse=True
    )

    return results


# =========================================================
# COLOR DETECTION
# =========================================================

def detect_colors(text):

    results = []

    for color, words in COLOR_RULES.items():

        matched = []

        for word in words:

            pattern = rf"\b{re.escape(word)}\b"

            if re.search(
                pattern,
                text
            ):

                matched.append(
                    word
                )

        if matched:

            results.append(
                {
                    "color": color,
                    "matched_words": list(
                        dict.fromkeys(matched)
                    ),
                    "source": "text",
                }
            )

    return results


# =========================================================
# ACTION DETECTION
# =========================================================

ACTION_RULES = {

    "escape": [
        "running away",
        "ran away",
        "run away",
        "running from",
        "ran from",
        "run from",
        "escape",
        "escaped",
        "escaping",
        "getting away",
        "get away",
    ],

    "hiding": [
        "hide",
        "hiding",
        "hid",
        "hide myself",
        "hid myself",
        "hiding myself",
    ],

    "being_chased": [
        "being chased",
        "chased",
        "followed",
        "following",
        "stalked",
    ],

    "searching": [
        "search",
        "searched",
        "searching",
        "looking for",
        "looked for",
        "find",
        "finding",
    ],

    "falling": [
        "fall",
        "falling",
        "fell",
        "dropped",
        "dropping",
    ],

    "flying": [
        "fly",
        "flying",
        "flew",
        "floating",
    ],

    "fighting": [
        "fight",
        "fighting",
        "fought",
        "attacked",
        "attack",
    ],

    "traveling": [
        "travel",
        "travelling",
        "traveling",
        "journey",
        "driving",
        "walking",
        "riding",
    ],

    "entering": [
        "enter",
        "entered",
        "going inside",
        "went inside",
    ],
}


def detect_actions(text):

    actions = []

    for action, words in ACTION_RULES.items():

        matched = []

        for word in words:

            if " " in word:

                if word in text:

                    matched.append(
                        word
                    )

            else:

                pattern = rf"\b{re.escape(word)}\b"

                if re.search(
                    pattern,
                    text
                ):

                    matched.append(
                        word
                    )

        if matched:

            actions.append(
                {
                    "action": action,
                    "matched_words": list(
                        dict.fromkeys(matched)
                    ),
                }
            )

    return actions


# =========================================================
# NARRATIVE PATTERN
# =========================================================

def detect_narrative_pattern(
    text,
    themes,
    actions
):

    theme_names = {
        item["theme"]
        for item in themes
    }

    action_names = {
        item["action"]
        for item in actions
    }


    # -----------------------------------------------------
    # INITIAL STATE
    # -----------------------------------------------------

    if (
        "Fear & Threat" in theme_names
        or "being_chased" in action_names
        or "attacked" in text
        or "chased" in text
    ):

        initial_state = "threat"

    elif "Uncertainty & Confusion" in theme_names:

        initial_state = "confusion"

    elif "Calm & Safety" in theme_names:

        initial_state = "calm"

    else:

        initial_state = "neutral"


    # -----------------------------------------------------
    # ACTION
    # -----------------------------------------------------

    if "escape" in action_names:

        action = "escape"

    elif "being_chased" in action_names:

        action = "being_chased"

    elif "hiding" in action_names:

        action = "hiding"

    elif "falling" in action_names:

        action = "falling"

    elif "flying" in action_names:

        action = "flying"

    elif "fighting" in action_names:

        action = "fighting"

    elif "searching" in action_names:

        action = "searching"

    elif "traveling" in action_names:

        action = "traveling"

    elif "entering" in action_names:

        action = "entering"

    else:

        action = "observing"


    # -----------------------------------------------------
    # RESOLUTION
    # -----------------------------------------------------

    if (
        "Safety & Shelter" in theme_names
        or "safe place" in text
        or "reached safety" in text
        or "found shelter" in text
        or "found a hut" in text
    ):

        resolution = "shelter"

    elif (
        "Calm & Safety" in theme_names
        and (
            "calm" in text
            or "peaceful" in text
            or "safe" in text
        )
    ):

        resolution = "calm"

    elif (
        "escaped" in text
        or "escape" in text
    ):

        resolution = "escape"

    elif (
        "fell" in text
        or "falling" in text
    ):

        resolution = "falling"

    else:

        resolution = "unknown"


    # -----------------------------------------------------
    # ENDING
    # -----------------------------------------------------

    if re.search(
        r"\bwoke up\b|\bwoke\b|\bawoke\b",
        text
    ):

        ending = "waking"

    else:

        ending = "unknown"


    # -----------------------------------------------------
    # SEQUENCE
    # -----------------------------------------------------

    sequence = [
        initial_state,
        action,
        resolution,
        ending,
    ]

    cleaned_sequence = []

    for item in sequence:

        if item == "unknown":
            continue

        if item not in cleaned_sequence:

            cleaned_sequence.append(
                item
            )


    return {
        "initial_state": initial_state,
        "action": action,
        "resolution": resolution,
        "ending": ending,
        "sequence": cleaned_sequence,
    }


# =========================================================
# INTENSITY SIGNAL
# =========================================================

def calculate_language_intensity(
    text,
    themes,
    emotions
):

    """
    This is only a descriptive language signal.
    It is NOT a clinical measurement.
    """

    score = 0

    strong_words = [
        "terrified",
        "terror",
        "panic",
        "horror",
        "attacked",
        "trapped",
        "danger",
        "dangerous",
        "screaming",
        "blood",
        "dying",
        "death",
        "chased",
    ]

    for word in strong_words:

        if re.search(
            rf"\b{re.escape(word)}\b",
            text
        ):

            score += 2


    score += min(
        len(emotions),
        3
    )


    if themes:

        strongest_theme_score = max(
            item["score"]
            for item in themes
        )

        score += min(
            strongest_theme_score,
            4
        )


    if score <= 2:

        label = "Low"

    elif score <= 5:

        label = "Moderate"

    else:

        label = "High"


    return {
        "score": score,
        "label": label,
        "note": "Descriptive language signal only; not a clinical measurement.",
    }


# =========================================================
# MAIN DREAM ANALYSIS FUNCTION
# =========================================================

def analyze_dream_text(
    text,
    selected_emotion=None,
    selected_color=None,
    intensity=None
):

    cleaned = clean_text(
        text
    )

    raw_tokens = tokenize_text(
        cleaned
    )

    normalized_tokens = normalize_tokens(
        raw_tokens
    )

    keywords = extract_keywords(
        raw_tokens
    )

    phrases = detect_phrases(
        cleaned
    )

    themes = detect_themes(
        cleaned
    )

    symbols = detect_symbols(
        cleaned
    )

    emotions = detect_emotions(
        cleaned
    )

    colors = detect_colors(
        cleaned
    )

    actions = detect_actions(
        cleaned
    )

    narrative = detect_narrative_pattern(
        cleaned,
        themes,
        actions
    )

    language_intensity = calculate_language_intensity(
        cleaned,
        themes,
        emotions
    )


    # =====================================================
    # USER SELECTED EMOTION
    # =====================================================

    if selected_emotion:

        emotions.insert(
            0,
            {
                "emotion": selected_emotion,
                "score": None,
                "matched_words": [],
                "source": "user_selected",
            }
        )


    # =====================================================
    # USER SELECTED COLOR
    # =====================================================

    if selected_color:

        colors.insert(
            0,
            {
                "color": selected_color,
                "matched_words": [],
                "source": "user_selected",
            }
        )


    # =====================================================
    # FINAL RESULT
    # =====================================================

    return {

        "text_statistics": {

            "token_count": len(
                raw_tokens
            ),

            "meaningful_token_count": len(
                normalized_tokens
            ),

        },

        "keywords": keywords,

        "detected_phrases": phrases,

        "themes": themes,

        "symbols": symbols,

        "emotions": emotions,

        "colors": colors,

        "actions": actions,

        "narrative_pattern": narrative,

        "intensity": {

            "user_selected": intensity,

            "language_signal": language_intensity,

        },

        "cleaned_text": cleaned,
    }