from datetime import date

from django.db.models import Avg

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    MoodEntry,
    JournalEntry,
    MeditationExercise,
    Therapist,
    TherapyRequest,
    DreamEntry
)

from .serializers import (
    MoodEntrySerializer,
    JournalEntrySerializer,
    MeditationExerciseSerializer,
    TherapistSerializer,
    TherapyRequestSerializer,
    DreamEntrySerializer
)

from .dream_nlp import analyze_dream_text


# =========================================================
# MOOD HELPERS
# =========================================================

MOOD_ANALYSIS = {

    "happy": {
        "title": "A positive moment",
        "analysis": (
            "You are feeling happy today. This can be a good time "
            "to slow down and enjoy the positive state you are in "
            "rather than rushing through it."
        ),
        "suggestion": (
            "Try a short gratitude or mindful-breathing exercise "
            "to stay connected with this feeling."
        ),
        "meditation_mood": "happy",
    },

    "good": {
        "title": "Feeling balanced",
        "analysis": (
            "Your mood feels generally positive today. You seem to "
            "have a reasonable sense of emotional balance at this moment."
        ),
        "suggestion": (
            "A gentle mindfulness exercise can help you maintain "
            "this steady state."
        ),
        "meditation_mood": "happy",
    },

    "neutral": {
        "title": "A neutral moment",
        "analysis": (
            "Your mood is feeling fairly neutral today. There is no "
            "need to force yourself to feel differently. A neutral "
            "state can be a useful moment to pause and check in with yourself."
        ),
        "suggestion": (
            "Try a grounding meditation that brings your attention "
            "back to your breathing and surroundings."
        ),
        "meditation_mood": "neutral",
    },

    "sad": {
        "title": "Giving yourself some space",
        "analysis": (
            "You are feeling sad today. Rather than judging the feeling, "
            "it may help to give yourself some space to acknowledge it "
            "without needing to immediately fix it."
        ),
        "suggestion": (
            "A gentle breathing or self-compassion meditation may help "
            "you sit with the feeling more comfortably."
        ),
        "meditation_mood": "sad",
    },

    "anxious": {
        "title": "Settling an anxious mind",
        "analysis": (
            "You are feeling anxious today. Your mind may benefit from "
            "slowing down and bringing your attention back to the present "
            "moment instead of staying focused on what might happen next."
        ),
        "suggestion": (
            "Try a slow breathing exercise with a longer exhale "
            "to help create a calmer moment."
        ),
        "meditation_mood": "anxious",
    },

    "angry": {
        "title": "Making room for the feeling",
        "analysis": (
            "You are feeling angry today. Anger can be a signal that "
            "something feels unfair, overwhelming, frustrating, or "
            "important to you."
        ),
        "suggestion": (
            "Try a grounding meditation before deciding what you want "
            "to do with the feeling."
        ),
        "meditation_mood": "neutral",
    },
}


def get_mood_analysis(mood, score):

    """
    Creates a daily reflection from the user's current mood.

    This is intentionally rule-based.
    It does NOT diagnose the user.
    """

    result = MOOD_ANALYSIS.get(
        mood,
        MOOD_ANALYSIS["neutral"]
    ).copy()

    result["mood"] = mood
    result["score"] = score

    return result


def get_recommended_meditation(mood):

    """
    Find the meditation exercise matching today's mood.
    """

    recommended_mood = MOOD_ANALYSIS.get(
        mood,
        MOOD_ANALYSIS["neutral"]
    )["meditation_mood"]

    exercise = MeditationExercise.objects.filter(
        recommended_mood=recommended_mood
    ).first()

    return exercise


# =========================================================
# MOOD ENTRIES
# =========================================================

@api_view(["GET", "POST"])
def mood_entries(request):

    # -----------------------------------------------------
    # GET ALL MOODS
    # -----------------------------------------------------

    if request.method == "GET":

        entries = MoodEntry.objects.order_by(
            "-entry_date",
            "-created_at"
        )

        serializer = MoodEntrySerializer(
            entries,
            many=True
        )

        return Response(serializer.data)

    # -----------------------------------------------------
    # POST TODAY'S MOOD
    # -----------------------------------------------------

    entry_date = request.data.get("entry_date")

    if not entry_date:

        return Response(
            {
                "error": "entry_date is required."
            },
            status=400
        )

    # One mood per day.
    if MoodEntry.objects.filter(
        entry_date=entry_date
    ).exists():

        return Response(
            {
                "error": (
                    "You have already logged your mood "
                    "for this day."
                )
            },
            status=400
        )

    serializer = MoodEntrySerializer(
        data=request.data
    )

    if not serializer.is_valid():

        return Response(
            serializer.errors,
            status=400
        )

    mood_entry = serializer.save()

    return Response(
        MoodEntrySerializer(
            mood_entry
        ).data,
        status=201
    )


# =========================================================
# DAILY MOOD ANALYSIS
# =========================================================

@api_view(["GET"])
def daily_analysis(request):

    today = date.today()

    today_mood = MoodEntry.objects.filter(
        entry_date=today
    ).order_by(
        "-created_at"
    ).first()

    if not today_mood:

        return Response(
            {
                "ready": False,
                "message": (
                    "Log your mood today to receive "
                    "your daily analysis."
                ),
                "mood": None,
                "analysis": None,
                "meditation": None
            }
        )

    analysis = get_mood_analysis(
        today_mood.mood,
        today_mood.mood_score
    )

    recommended = get_recommended_meditation(
        today_mood.mood
    )

    return Response(
        {
            "ready": True,

            "date": str(
                today_mood.entry_date
            ),

            "mood": today_mood.mood,

            "score": today_mood.mood_score,

            "analysis": analysis,

            "meditation": (
                MeditationExerciseSerializer(
                    recommended
                ).data
                if recommended
                else None
            )
        }
    )


# =========================================================
# JOURNAL
# =========================================================

@api_view(["GET", "POST"])
def journal_entries(request):

    if request.method == "POST":

        serializer = JournalEntrySerializer(
            data=request.data
        )

        if serializer.is_valid():

            journal_entry = serializer.save()

            return Response(
                JournalEntrySerializer(
                    journal_entry
                ).data,
                status=201
            )

        return Response(
            serializer.errors,
            status=400
        )

    entries = JournalEntry.objects.order_by(
        "-entry_date",
        "-created_at"
    )

    serializer = JournalEntrySerializer(
        entries,
        many=True
    )

    return Response(
        serializer.data
    )


# =========================================================
# MEDITATION
# =========================================================

@api_view(["GET"])
def meditation_exercises(request):

    exercises = MeditationExercise.objects.all()

    today = date.today()

    today_mood = MoodEntry.objects.filter(
        entry_date=today
    ).order_by(
        "-created_at"
    ).first()

    recommended = None

    if today_mood:

        recommended = get_recommended_meditation(
            today_mood.mood
        )

    serializer = MeditationExerciseSerializer(
        exercises,
        many=True
    )

    return Response(
        {
            "exercises": serializer.data,

            "recommended": (
                MeditationExerciseSerializer(
                    recommended
                ).data
                if recommended
                else None
            ),

            "todayMood": (
                today_mood.mood
                if today_mood
                else None
            )
        }
    )


# =========================================================
# THERAPISTS
# =========================================================

@api_view(["GET"])
def therapists(request):

    therapist_list = Therapist.objects.filter(
        availability="Available"
    )

    serializer = TherapistSerializer(
        therapist_list,
        many=True
    )

    return Response(
        serializer.data
    )


# =========================================================
# THERAPY REQUESTS
# =========================================================

@api_view(["GET", "POST"])
def therapy_requests(request):

    if request.method == "POST":

        serializer = TherapyRequestSerializer(
            data=request.data
        )

        if serializer.is_valid():

            therapy_request = serializer.save()

            return Response(
                TherapyRequestSerializer(
                    therapy_request
                ).data,
                status=201
            )

        return Response(
            serializer.errors,
            status=400
        )

    requests = TherapyRequest.objects.order_by(
        "-requested_at"
    )

    serializer = TherapyRequestSerializer(
        requests,
        many=True
    )

    return Response(
        serializer.data
    )


# =========================================================
# DREAM ENTRIES + NLP + LOCAL QWEN AI
# =========================================================

@api_view(["GET", "POST"])
def dream_entries(request):

    # =====================================================
    # GET
    # =====================================================

    if request.method == "GET":

        dreams = DreamEntry.objects.order_by(
            "-entry_date",
            "-created_at"
        )

        serializer = DreamEntrySerializer(
            dreams,
            many=True
        )

        return Response(
            serializer.data
        )

    # =====================================================
    # POST
    # =====================================================

    serializer = DreamEntrySerializer(
        data=request.data
    )

    if not serializer.is_valid():

        return Response(
            serializer.errors,
            status=400
        )

    dream_entry = serializer.save()

    # -----------------------------------------------------
    # STEP 1 — NLP
    # -----------------------------------------------------

    try:

        nlp_result = analyze_dream_text(
            dream_entry.dream_text,
            selected_emotion=dream_entry.emotion,
            selected_color=dream_entry.dominant_color,
            intensity=dream_entry.intensity
        )

    except Exception as error:

        print(
            "NLP ERROR:",
            repr(error)
        )

        nlp_result = {
            "error": (
                "NLP analysis could not be completed."
            )
        }

    # Save NLP first.
    dream_entry.analysis = {
        "nlp": nlp_result
    }

    dream_entry.save(
        update_fields=["analysis"]
    )

    # -----------------------------------------------------
    # STEP 2 — LOCAL QWEN
    # -----------------------------------------------------

    try:

        from .dream_ai import (
            generate_dream_reflection
        )

        ai_result = generate_dream_reflection(
            dream_entry.dream_text,
            nlp_result,
            selected_emotion=dream_entry.emotion,
            selected_color=dream_entry.dominant_color,
            intensity=dream_entry.intensity
        )

        dream_entry.analysis = {
            "nlp": nlp_result,
            "ai": ai_result,
            "ai_provider": "local_qwen"
        }

        dream_entry.save(
            update_fields=["analysis"]
        )

        print(
            "\n========================================"
        )
        print(
            "LOCAL QWEN AI SUCCESS"
        )
        print(
            "========================================\n"
        )

    except Exception as error:

        print(
            "\n========================================"
        )
        print(
            "LOCAL QWEN AI ERROR"
        )
        print(
            "========================================\n"
        )

        # IMPORTANT:
        # We DO NOT pretend the AI worked.
        dream_entry.analysis = {
            "nlp": nlp_result,
            "ai": None,
            "ai_provider": "local_qwen",
            "ai_error": str(error)
        }

        dream_entry.save(
            update_fields=["analysis"]
        )

    # STEP 3 — RETURN COMPLETE DREAM
    # -----------------------------------------------------

    return Response(
        DreamEntrySerializer(
            dream_entry
        ).data,
        status=201
    )


# =========================================================
# DELETE DREAM
# =========================================================

@api_view(["DELETE"])
def delete_dream(request, dream_id):

    try:

        dream = DreamEntry.objects.get(
            id=dream_id
        )

    except DreamEntry.DoesNotExist:

        return Response(
            {
                "error": "Dream not found"
            },
            status=404
        )

    dream.delete()

    return Response(
        {
            "message": "Dream deleted successfully"
        },
        status=204
    )