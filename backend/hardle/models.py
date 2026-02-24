import uuid
from django.db import models
from django.contrib.auth.models import User


# =============================================================================
# USER PROFILE
# =============================================================================
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

    # --- Phase 1.1 Additive Fields ---
    tier = models.CharField(
        max_length=20,
        choices=[('guestuse', 'Guest'), ('loguse', 'Registered'), ('paiduse', 'Paid')],
        null=True, blank=True
    )
    total_points = models.IntegerField(null=True, blank=True, default=0)
    rank = models.CharField(max_length=32, null=True, blank=True, default='Initiate')
    last_active_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.user.username


# =============================================================================
# WORD BANK
# =============================================================================
class Word(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    value = models.CharField(max_length=5)
    active_date = models.DateField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['active_date'], name='idx_words_active_date'),
        ]

    def __str__(self):
        return f"{self.value} ({self.active_date})"


# =============================================================================
# CONFIG MODE (Game Mode Parameters)
# =============================================================================
class ConfigMode(models.Model):
    mode = models.CharField(
        max_length=20,
        primary_key=True,
        choices=[('normal', 'Normal'), ('hard', 'Hard'), ('extreme', 'Extreme')]
    )
    reward_points = models.IntegerField()
    penalty_points = models.IntegerField()
    time_limit_seconds = models.IntegerField(null=True, blank=True)  # null = infinity (Constitution mandate)
    signal_intel_level = models.IntegerField()

    def __str__(self):
        return self.mode


# =============================================================================
# GAME SESSION
# =============================================================================
class GameStatus(models.TextChoices):
    IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
    WIN = 'WIN', 'Win'
    LOSE = 'LOSE', 'Lose'


class GameSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Optional link to user if authenticated
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    target_word = models.CharField(max_length=5)  # SECRET
    guesses = models.JSONField(default=list)  # List of {word: str, colors: list[int]}
    status = models.CharField(
        max_length=20,
        choices=GameStatus.choices,
        default=GameStatus.IN_PROGRESS
    )
    mode = models.CharField(max_length=20, default='hard')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # --- Phase 1.1 Additive Fields (Parallel Field Strategy) ---
    word_ref = models.ForeignKey(
        'Word', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='sessions'
    )
    mode_ref = models.ForeignKey(
        'ConfigMode', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='sessions'
    )
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    elapsed_time = models.IntegerField(null=True, blank=True, default=0)
    daily_cycle = models.DateField(null=True, blank=True)
    session_key = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.id} - {self.status}"
