from rest_framework import serializers

from .models import (
    MoodEntry,
    JournalEntry,
    MeditationExercise,
    Therapist,
    TherapyRequest,
    DreamEntry
)


class MoodEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodEntry

        fields = [
            'id',
            'mood',
            'mood_score',
            'entry_date',
            'created_at'
        ]


class JournalEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry

        fields = [
            'id',
            'title',
            'content',
            'entry_date',
            'created_at'
        ]


class MeditationExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeditationExercise

        fields = [
            'id',
            'title',
            'duration',
            'tag',
            'description',
            'recommended_mood'
        ]


class TherapistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Therapist

        fields = [
            'id',
            'name',
            'focus',
            'experience',
            'session_type',
            'availability',
            'bio'
        ]


class TherapyRequestSerializer(serializers.ModelSerializer):
    therapist_name = serializers.CharField(
        source='therapist.name',
        read_only=True
    )

    class Meta:
        model = TherapyRequest

        fields = [
            'id',
            'therapist',
            'therapist_name',
            'message',
            'requested_at',
            'status'
        ]


class DreamEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = DreamEntry

        fields = [
            'id',
            'dream_text',
            'emotion',
            'dominant_color',
            'intensity',
            'entry_date',
            'created_at',
            'analysis'
        ]