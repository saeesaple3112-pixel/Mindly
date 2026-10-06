from django.urls import path

from .views import (
    mood_entries,
    daily_analysis,
    journal_entries,
    meditation_exercises,
    therapists,
    therapy_requests,
    dream_entries,
    delete_dream
)


urlpatterns = [

    # =====================================================
    # MOOD
    # =====================================================

    path(
        "",
        mood_entries
    ),
    path(
    "daily/",
    daily_analysis
),

    # Daily mood analysis
    path(
        "daily/",
        daily_analysis
    ),

    # =====================================================
    # JOURNAL
    # =====================================================

    path(
        "journal/",
        journal_entries
    ),

    # =====================================================
    # MEDITATION
    # =====================================================

    path(
        "meditation/",
        meditation_exercises
    ),

    # =====================================================
    # THERAPISTS
    # =====================================================

    path(
        "therapists/",
        therapists
    ),

    # =====================================================
    # THERAPY REQUESTS
    # =====================================================

    path(
        "therapy-requests/",
        therapy_requests
    ),

    # =====================================================
    # DREAMS
    # =====================================================

    path(
        "dreams/",
        dream_entries
    ),

    path(
        "dreams/<int:dream_id>/",
        delete_dream
    ),
]