from django.db import models
from django.contrib.auth.models import User


class MoodEntry(models.Model):
    MOOD_CHOICES = [
        ('happy', 'Happy'),
        ('good', 'Good'),
        ('neutral', 'Neutral'),
        ('sad', 'Sad'),
        ('anxious', 'Anxious'),
        ('angry', 'Angry'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    mood = models.CharField(
        max_length=20,
        choices=MOOD_CHOICES
    )

    mood_score = models.IntegerField()

    entry_date = models.DateField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.mood} - {self.entry_date}"


class JournalEntry(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    title = models.CharField(
        max_length=200,
        blank=True
    )

    content = models.TextField()

    entry_date = models.DateField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title or f"Journal - {self.entry_date}"


class MeditationExercise(models.Model):
    title = models.CharField(
        max_length=200
    )

    duration = models.IntegerField()

    tag = models.CharField(
        max_length=100
    )

    description = models.TextField()

    recommended_mood = models.CharField(
        max_length=50,
        blank=True
    )

    def __str__(self):
        return self.title


class Therapist(models.Model):
    name = models.CharField(
        max_length=200
    )

    focus = models.CharField(
        max_length=200
    )

    experience = models.CharField(
        max_length=50
    )

    session_type = models.CharField(
        max_length=100,
        default="Video session"
    )

    availability = models.CharField(
        max_length=100,
        default="Available"
    )

    bio = models.TextField(
        blank=True
    )

    def __str__(self):
        return self.name


class TherapyRequest(models.Model):
    therapist = models.ForeignKey(
        Therapist,
        on_delete=models.CASCADE,
        related_name="requests"
    )

    message = models.TextField(
        blank=True
    )

    requested_at = models.DateTimeField(
        auto_now_add=True
    )

    status = models.CharField(
        max_length=30,
        default="Pending"
    )

    def __str__(self):
        return f"{self.therapist.name} - {self.status}"


class DreamEntry(models.Model):
    dream_text = models.TextField()

    emotion = models.CharField(
        max_length=50,
        blank=True
    )

    dominant_color = models.CharField(
        max_length=50,
        blank=True
    )

    intensity = models.IntegerField(
        default=50
    )

    entry_date = models.DateField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    # This will store the AI dream analysis later.
    # Example:
    # {
    #     "summary": "...",
    #     "themes": ["...", "..."],
    #     "interpretation": "...",
    #     "reflection": "..."
    # }
    analysis = models.JSONField(
        null=True,
        blank=True
    )

    def __str__(self):
        return f"Dream - {self.entry_date}"