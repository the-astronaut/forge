const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ─── DATA ───────────────────────────────────────────────────────────────────

const WORKOUTS = [
  {
    id: 1,
    name: "UPPER BODY POWER",
    category: "Push Day",
    emoji: "🏋️",
    duration: 52,
    difficulty: "Advanced",
    color: "#C6F135",
    bg: "linear-gradient(160deg, #1a2a0a, #2d4a10)",
    exercises: [
      { id: 1, name: "Warm-up Push-ups",      muscle: "Chest",     sets: 2, reps: 15, rest: 30,  weight: "BW"  },
      { id: 2, name: "Incline Dumbbell Press", muscle: "Chest",     sets: 3, reps: 10, rest: 60,  weight: "30kg"},
      { id: 3, name: "Bench Press",            muscle: "Chest",     sets: 4, reps: 8,  rest: 90,  weight: "80kg"},
      { id: 4, name: "Cable Fly",              muscle: "Chest",     sets: 3, reps: 12, rest: 60,  weight: "35kg"},
      { id: 5, name: "Tricep Pushdown",        muscle: "Triceps",   sets: 3, reps: 15, rest: 45,  weight: "25kg"},
      { id: 6, name: "Overhead Press",         muscle: "Shoulders", sets: 4, reps: 6,  rest: 90,  weight: "60kg"},
      { id: 7, name: "Lateral Raises",         muscle: "Shoulders", sets: 3, reps: 15, rest: 45,  weight: "12kg"},
      { id: 8, name: "Cooldown Stretch",       muscle: "Other",     sets: 1, reps: 1,  rest: 0,   weight: "—"  },
    ],
  },
  {
    id: 2,
    name: "LEG DESTROYER",
    category: "Leg Day",
    emoji: "🦵",
    duration: 55,
    difficulty: "Advanced",
    color: "#C6F135",
    bg: "linear-gradient(160deg, #1a2a0a, #0a1a0a)",
    exercises: [
      { id: 1, name: "Squat Warm-up",      muscle: "Legs", sets: 2, reps: 20, rest: 30,  weight: "BW"   },
      { id: 2, name: "Back Squat",         muscle: "Legs", sets: 5, reps: 5,  rest: 120, weight: "100kg"},
      { id: 3, name: "Romanian Deadlift",  muscle: "Legs", sets: 4, reps: 8,  rest: 90,  weight: "80kg" },
      { id: 4, name: "Leg Press",          muscle: "Legs", sets: 3, reps: 12, rest: 60,  weight: "140kg"},
      { id: 5, name: "Walking Lunges",     muscle: "Legs", sets: 3, reps: 16, rest: 60,  weight: "20kg" },
      { id: 6, name: "Leg Curl",           muscle: "Legs", sets: 3, reps: 12, rest: 45,  weight: "40kg" },
    ],
  },
  {
    id: 3,
    name: "DEEP STRETCH",
    category: "Recovery",
    emoji: "🧘",
    duration: 20,
    difficulty: "All Levels",
    color: "#7B9FFF",
    bg: "linear-gradient(160deg, #1a1a2a, #101030)",
    exercises: [
      { id: 1, name: "Hip Flexor Stretch", muscle: "Other", sets: 1, reps: 1, rest: 60, weight: "—" },
      { id: 2, name: "Hamstring Stretch",  muscle: "Legs",  sets: 1, reps: 1, rest: 60, weight: "—" },
      { id: 3, name: "Pigeon Pose",        muscle: "Other", sets: 1, reps: 1, rest: 90, weight: "—" },
      { id: 4, name: "Child's Pose",       muscle: "Other", sets: 1, reps: 1, rest: 60, weight: "—" },
      { id: 5, name: "Spinal Twist",       muscle: "Core",  sets: 1, reps: 1, rest: 60, weight: "—" },
    ],
  },
  {
    id: 4,
    name: "BURN & BUILD",
    category: "HIIT",
    emoji: "⚡",
    duration: 30,
    difficulty: "Intermediate",
    color: "#FF8C42",
    bg: "linear-gradient(160deg, #2a1a0a, #3d1000)",
    exercises: [
      { id: 1, name: "Burpees",            muscle: "Cardio", sets: 4, reps: 10, rest: 30, weight: "BW"  },
      { id: 2, name: "Box Jumps",          muscle: "Cardio", sets: 4, reps: 8,  rest: 45, weight: "BW"  },
      { id: 3, name: "Mountain Climbers",  muscle: "Core",   sets: 3, reps: 20, rest: 30, weight: "BW"  },
      { id: 4, name: "Kettlebell Swings",  muscle: "Cardio", sets: 3, reps: 15, rest: 45, weight: "24kg"},
      { id: 5, name: "Jump Rope",          muscle: "Cardio", sets: 3, reps: 1,  rest: 30, weight: "—"   },
    ],
  },
];

const INITIAL_STATS = {
  streak: 0,
  workoutsThisWeek: 0,
  totalWorkouts: 0,
  activeHoursThisWeek: 0,
  weight: 0,
  weeklyVolume: [],
};

const DEFAULT_PROFILE = {
  name: "",
  height: 180,
  weight: 75,
  measurements: {
    chest: 100,
    waist: 80,
    biceps: 38,
    thighs: 58,
  },
  joinDate: new Date().toISOString(),
};

const AFFIRMATIONS = [
  "You're building something incredible, one rep at a time",
  "Every workout is a step toward your strongest self",
  "Progress isn't always visible, but it's always happening",
  "Your dedication today shapes your strength tomorrow",
  "The hardest step is showing up—you're already winning",
  "Small improvements compound into extraordinary results",
  "You're not just training muscles, you're training discipline",
  "Consistency beats perfection every single time",
  "Your future self will thank you for not giving up",
  "Strength isn't given, it's earned—and you're earning it",
];

// ─── LOCAL STORAGE HELPERS ──────────────────────────────────────────────────

function loadProfile() {
  const saved = localStorage.getItem('forgeProfile');
  return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
}

function saveProfile(profile) {
  localStorage.setItem('forgeProfile', JSON.stringify(profile));
}
// Add these next to your loadProfile / saveProfile functions
function loadWorkoutStats() {
  const saved = localStorage.getItem('forgeStats');
  return saved ? JSON.parse(saved) : INITIAL_STATS;
}

function saveWorkoutStats(stats) {
  localStorage.setItem('forgeStats', JSON.stringify(stats));
}
const ACHIEVEMENTS = [
  { id: 1, icon: "🏆", name: "Century Club", desc: "Complete 100 workouts", earned: false },
  { id: 2, icon: "💪", name: "Strong Start", desc: "First workout completed", earned: false },
  { id: 3, icon: "💎", name: "Diamond Lifter", desc: "250 total workouts", earned: false },
  { id: 4, icon: "⚡", name: "Speed Demon", desc: "5 workouts in a week", earned: false },
  { id: 5, icon: "🦁", name: "Iron Lion", desc: "Lift 10,000kg total", earned: false },
  { id: 6, icon: "🌙", name: "Night Owl", desc: "Workout after 10pm", earned: false },
];

// ─── EXERCISE LIBRARY ────────────────────────────────────────────────────────

const EXERCISE_LIBRARY = [
  // Chest
  { id: "e1",  name: "Bench Press",           muscle: "Chest",      defaultWeight: 60,  defaultReps: 8  },
  { id: "e2",  name: "Incline Dumbbell Press", muscle: "Chest",      defaultWeight: 28,  defaultReps: 10 },
  { id: "e3",  name: "Cable Fly",              muscle: "Chest",      defaultWeight: 30,  defaultReps: 12 },
  { id: "e4",  name: "Push-ups",               muscle: "Chest",      defaultWeight: "BW",defaultReps: 15 },
  { id: "e5",  name: "Chest Dip",              muscle: "Chest",      defaultWeight: "BW",defaultReps: 10 },
  // Back
  { id: "e6",  name: "Deadlift",               muscle: "Back",       defaultWeight: 100, defaultReps: 5  },
  { id: "e7",  name: "Pull-ups",               muscle: "Back",       defaultWeight: "BW",defaultReps: 8  },
  { id: "e8",  name: "Barbell Row",            muscle: "Back",       defaultWeight: 70,  defaultReps: 8  },
  { id: "e9",  name: "Lat Pulldown",           muscle: "Back",       defaultWeight: 60,  defaultReps: 10 },
  { id: "e10", name: "Cable Row",              muscle: "Back",       defaultWeight: 55,  defaultReps: 12 },
  // Legs
  { id: "e11", name: "Back Squat",             muscle: "Legs",       defaultWeight: 80,  defaultReps: 5  },
  { id: "e12", name: "Romanian Deadlift",      muscle: "Legs",       defaultWeight: 70,  defaultReps: 8  },
  { id: "e13", name: "Leg Press",              muscle: "Legs",       defaultWeight: 120, defaultReps: 12 },
  { id: "e14", name: "Walking Lunges",         muscle: "Legs",       defaultWeight: 20,  defaultReps: 16 },
  { id: "e15", name: "Leg Curl",               muscle: "Legs",       defaultWeight: 40,  defaultReps: 12 },
  { id: "e16", name: "Calf Raises",            muscle: "Legs",       defaultWeight: 60,  defaultReps: 20 },
  // Shoulders
  { id: "e17", name: "Overhead Press",         muscle: "Shoulders",  defaultWeight: 50,  defaultReps: 6  },
  { id: "e18", name: "Lateral Raises",         muscle: "Shoulders",  defaultWeight: 12,  defaultReps: 15 },
  { id: "e19", name: "Front Raises",           muscle: "Shoulders",  defaultWeight: 10,  defaultReps: 15 },
  { id: "e20", name: "Face Pulls",             muscle: "Shoulders",  defaultWeight: 25,  defaultReps: 15 },
  // Arms
  { id: "e21", name: "Barbell Curl",           muscle: "Biceps",     defaultWeight: 30,  defaultReps: 10 },
  { id: "e22", name: "Hammer Curl",            muscle: "Biceps",     defaultWeight: 16,  defaultReps: 12 },
  { id: "e23", name: "Tricep Pushdown",        muscle: "Triceps",    defaultWeight: 25,  defaultReps: 15 },
  { id: "e24", name: "Skull Crushers",         muscle: "Triceps",    defaultWeight: 30,  defaultReps: 10 },
  { id: "e25", name: "Dips",                   muscle: "Triceps",    defaultWeight: "BW",defaultReps: 12 },
  // Core / Cardio
  { id: "e26", name: "Plank",                  muscle: "Core",       defaultWeight: "—", defaultReps: 1  },
  { id: "e27", name: "Crunches",               muscle: "Core",       defaultWeight: "BW",defaultReps: 20 },
  { id: "e28", name: "Burpees",                muscle: "Cardio",     defaultWeight: "BW",defaultReps: 10 },
  { id: "e29", name: "Box Jumps",              muscle: "Cardio",     defaultWeight: "BW",defaultReps: 8  },
  { id: "e30", name: "Kettlebell Swings",      muscle: "Cardio",     defaultWeight: 24,  defaultReps: 15 },
];

const WORKOUT_CATEGORIES = ["Custom", "Push Day", "Pull Day", "Leg Day", "Full Body", "HIIT", "Recovery"];
const EMOJIS = ["💪", "🔥", "⚡", "🏋️", "🦵", "🧘", "🏃", "⚔️"];

const MUSCLE_META = {
  Chest:     { upper: true  },
  Back:      { upper: true  },
  Shoulders: { upper: true  },
  Biceps:    { upper: true  },
  Triceps:   { upper: true  },
  Legs:      { upper: false },
  Core:      { upper: false },
  Cardio:    { upper: false },
  Other:     { upper: true  },
};

const ALL_MUSCLE_GROUPS = Object.keys(MUSCLE_META);

// ─── STYLES ──────────────────────────────────────────────────────────────────

const css = `
  /* STATUS BAR */
  .status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 24px 0;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    flex-shrink: 0;
  }

  /* SCREEN CONTAINER */
  .screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: screenIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes screenIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .scroll-area {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .scroll-area::-webkit-scrollbar { display: none; }

  /* BOTTOM NAV */
  .bottom-nav {
    background: var(--surface);
    border-top: 1px solid var(--border);
    padding: 10px 0 calc(16px + var(--safe-bottom));
    display: flex;
    justify-content: space-around;
    flex-shrink: 0;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 6px 18px;
    cursor: pointer;
    transition: transform 0.15s;
    -webkit-tap-highlight-color: transparent;
  }

  .nav-item:active { transform: scale(0.88); }
  .nav-item span { font-size: 9px; letter-spacing: 1px; text-transform: uppercase; font-weight: 600; }
  .nav-item.active span { color: var(--lime); }
  .nav-item:not(.active) span { color: var(--gray); }

  /* SECTION HEADER */
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 18px 24px 10px;
  }

  .section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    letter-spacing: 1px;
    color: var(--white);
  }

  .section-link {
    font-size: 12px;
    color: var(--lime);
    font-weight: 500;
    cursor: pointer;
  }

  /* PRESS EFFECT */
  .pressable {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: transform 0.12s, opacity 0.12s;
    user-select: none;
  }

  .pressable:active {
    transform: scale(0.96);
    opacity: 0.85;
  }

  /* ── HOME SCREEN ── */
  .home-header {
    padding: 8px 24px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .home-greeting .hey { font-size: 12px; color: var(--gray); }
  .home-greeting .name { font-family: 'Bebas Neue', sans-serif; font-size: 30px; color: var(--white); line-height: 1; letter-spacing: 1px; }

  .avatar-btn {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #C6F135, #7DB800);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px; color: var(--black);
    cursor: pointer;
    transition: transform 0.15s;
  }

  .avatar-btn:active { transform: scale(0.9); }

  .streak-banner {
    margin: 14px 24px 0;
    background: linear-gradient(135deg, #C6F135 0%, #9DC420 100%);
    border-radius: 18px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.15s;
  }

  .streak-banner:active { transform: scale(0.98); }

  .streak-banner::after {
    content: '🔥';
    position: absolute; right: -10px; top: -10px;
    font-size: 70px; opacity: 0.12;
    transform: rotate(-10deg);
    pointer-events: none;
  }

  .streak-num { font-family: 'Bebas Neue', sans-serif; font-size: 52px; color: var(--black); line-height: 1; }
  .streak-text .top { font-size: 11px; font-weight: 700; color: rgba(0,0,0,0.55); text-transform: uppercase; letter-spacing: 1px; }
  .streak-text .bottom { font-size: 16px; font-weight: 700; color: var(--black); margin-top: 1px; }
  .streak-badge {
    margin-left: auto;
    background: rgba(0,0,0,0.15);
    border-radius: 20px;
    padding: 6px 12px;
    font-size: 11px; font-weight: 700; color: var(--black);
  }

  .plan-card {
    margin: 0 24px;
    background: var(--card);
    border-radius: 20px;
    padding: 16px;
    border: 1px solid var(--border);
    display: flex; gap: 14px; align-items: center;
    position: relative; overflow: hidden;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.15s;
  }

  .plan-card:active { transform: scale(0.98); }
  .plan-card:hover { border-color: #444; }

  .plan-card::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 4px; background: var(--lime);
    border-radius: 0 2px 2px 0;
  }

  .plan-icon-wrap {
    width: 50px; height: 50px; border-radius: 14px;
    background: rgba(198,241,53,0.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; flex-shrink: 0;
  }

  .plan-type { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: var(--lime); font-weight: 600; }
  .plan-name { font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: var(--white); letter-spacing: 0.5px; line-height: 1.1; margin: 2px 0; }
  .plan-meta { display: flex; gap: 10px; margin-top: 4px; }
  .plan-meta span { font-size: 11px; color: var(--gray); }

  .plan-start-btn {
    width: 44px; height: 44px; border-radius: 50%;
    background: var(--lime);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: transform 0.15s, background 0.15s;
  }

  .plan-start-btn:hover { background: #d4f847; transform: scale(1.08); }

  .stats-row {
    display: flex; gap: 10px;
    padding: 0 24px; margin-top: 4px;
  }

  .stat-card {
    flex: 1; background: var(--card);
    border-radius: 16px; padding: 14px 10px;
    border: 1px solid var(--border); text-align: center;
  }

  .stat-icon { font-size: 18px; margin-bottom: 4px; }
  .stat-val { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: var(--white); line-height: 1; }
  .stat-unit { font-size: 10px; color: var(--lime); font-weight: 600; }
  .stat-lbl { font-size: 9px; color: var(--gray); margin-top: 2px; letter-spacing: 0.5px; }

  .workouts-scroll {
    display: flex; gap: 12px;
    padding: 0 24px 4px;
    overflow-x: auto; scrollbar-width: none;
  }

  .workouts-scroll::-webkit-scrollbar { display: none; }

  .workout-card {
    flex-shrink: 0; width: 130px; border-radius: 18px;
    overflow: hidden; position: relative; height: 155px;
    cursor: pointer; transition: transform 0.15s;
  }

  .workout-card:active { transform: scale(0.94); }

  .workout-card .bg {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 55px;
  }

  .workout-card .overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.88) 45%, transparent);
    padding: 10px;
    display: flex; flex-direction: column; justify-content: flex-end;
  }

  .wc-tag { font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; margin-bottom: 3px; }
  .wc-name { font-family: 'Bebas Neue', sans-serif; font-size: 16px; color: var(--white); line-height: 1.1; letter-spacing: 0.5px; }
  .wc-dur { font-size: 10px; color: rgba(255,255,255,0.45); margin-top: 4px; }

  /* ── WORKOUT SCREEN ── */
  .workout-topbar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 20px 0; flex-shrink: 0;
  }

  .back-btn {
    width: 36px; height: 36px; border-radius: 12px;
    background: rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.15s, transform 0.15s;
    border: none; outline: none;
  }

  .back-btn:active { transform: scale(0.88); }

  .live-badge {
    display: flex; align-items: center; gap: 6px;
    background: rgba(198,241,53,0.12);
    border: 1px solid rgba(198,241,53,0.3);
    border-radius: 20px; padding: 5px 12px;
    font-size: 10px; font-weight: 700; color: var(--lime);
    letter-spacing: 1px; text-transform: uppercase;
  }

  .live-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--lime); animation: pulse 1.2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }

  .elapsed-badge {
    font-family: 'Space Mono', monospace;
    font-size: 12px; color: var(--gray);
  }

  /* REST TIMER OVERLAY */
  .rest-overlay {
    position: absolute; inset: 0; z-index: 40;
    background: rgba(8, 18, 0, 0.97);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 0;
    animation: fadeIn 0.2s ease;
    backdrop-filter: blur(12px);
  }

  .rest-label {
    font-size: 11px; text-transform: uppercase; letter-spacing: 3px;
    color: var(--gray); margin-bottom: 20px; font-weight: 600;
  }

  .rest-ring-wrap {
    position: relative; width: 180px; height: 180px;
  }

  .rest-ring-wrap svg { width: 100%; height: 100%; transform: rotate(-90deg); }
  .rest-ring-bg { stroke: #1a2a0a; stroke-width: 8; fill: none; }
  .rest-ring-fill {
    stroke: var(--lime); stroke-width: 8; fill: none;
    stroke-linecap: round; stroke-dasharray: 502;
    transition: stroke-dashoffset 1s linear;
  }

  .rest-ring-inner {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }

  .rest-big-time {
    font-family: 'Space Mono', monospace;
    font-size: 46px; font-weight: 700; color: var(--white); line-height: 1;
  }

  .rest-sub { font-size: 12px; color: var(--gray); margin-top: 4px; letter-spacing: 1px; }

  .rest-next-up {
    margin-top: 28px; text-align: center;
  }

  .rest-next-label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: var(--gray); margin-bottom: 4px; }
  .rest-next-name { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: var(--white); letter-spacing: 1px; }
  .rest-next-detail { font-size: 13px; color: var(--lime); font-weight: 600; margin-top: 2px; }

  .rest-btn-row { display: flex; gap: 12px; margin-top: 32px; width: 280px; }

  .rest-skip-btn {
    flex: 1; height: 52px; border-radius: 16px;
    background: var(--lime);
    display: flex; align-items: center; justify-content: center; gap: 8px;
    font-family: 'Bebas Neue', sans-serif; font-size: 18px;
    color: var(--black); letter-spacing: 1.5px;
    cursor: pointer; border: none; outline: none;
    transition: transform 0.12s; user-select: none;
  }

  .rest-skip-btn:active { transform: scale(0.95); }

  .rest-add-btn {
    width: 52px; height: 52px; border-radius: 16px;
    background: var(--card); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; outline: none; transition: transform 0.12s;
  }

  .rest-add-btn:active { transform: scale(0.9); }

  /* BOTTOM CTA */
  .cta-area {
    padding: 12px 20px calc(20px + var(--safe-bottom));
    background: var(--black);
    flex-shrink: 0;
  }

  .cta-row { display: flex; gap: 10px; }

  .cta-btn {
    flex: 1; height: 56px; border-radius: 18px;
    background: var(--lime);
    display: flex; align-items: center; justify-content: center; gap: 8px;
    font-family: 'Bebas Neue', sans-serif; font-size: 19px;
    color: var(--black); letter-spacing: 2px;
    cursor: pointer; transition: transform 0.15s, background 0.15s;
    border: none; outline: none; user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .cta-btn:active { transform: scale(0.97); }
  .cta-btn.secondary { background: var(--card); border: 1px solid var(--border); color: var(--white); flex: 0 0 56px; }
  .cta-btn.end-btn { background: rgba(255,69,69,0.1); border: 1px solid rgba(255,69,69,0.25); color: var(--red); font-size: 14px; letter-spacing: 1px; flex: 0 0 auto; padding: 0 18px; }

  /* COMPLETE MODAL */
  .complete-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.95);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    z-index: 50; padding: 32px;
    animation: fadeIn 0.3s ease;
    backdrop-filter: blur(8px);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .complete-icon { font-size: 72px; margin-bottom: 16px; animation: popIn 0.4s 0.1s both cubic-bezier(0.34, 1.56, 0.64, 1); }

  @keyframes popIn {
    from { transform: scale(0); }
    to { transform: scale(1); }
  }

  .complete-title { font-family: 'Bebas Neue', sans-serif; font-size: 48px; color: var(--lime); letter-spacing: 2px; text-align: center; line-height: 1; }
  .complete-sub { font-size: 15px; color: var(--gray); margin: 8px 0 28px; text-align: center; }

  .complete-stats { display: flex; gap: 20px; margin-bottom: 32px; }

  .complete-stat { text-align: center; }
  .complete-stat .val { font-family: 'Bebas Neue', sans-serif; font-size: 36px; color: var(--white); }
  .complete-stat .lbl { font-size: 10px; color: var(--gray); text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }

  /* ─── PROFILE STYLES ─── */
        .profile-hero {
          padding: 40px 24px 24px;
          text-align: center;
          position: relative;
        }

        .profile-avatar-ring {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          margin: 0 auto 16px;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-avatar-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: var(--surface);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 48px;
          color: var(--lime);
          letter-spacing: 2px;
        }

        .profile-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 2px;
          margin-bottom: 4px;
        }

        .profile-handle {
          font-size: 11px;
          color: var(--gray);
          margin-bottom: 8px;
        }

        .profile-affirmation {
          font-size: 13px;
          color: var(--lime);
          font-style: italic;
          max-width: 320px;
          margin: 16px auto 0;
          line-height: 1.5;
        }

  .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding: 0 24px;
          margin-top: 24px;
        }

        .stats-cell {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px 12px;
          text-align: center;
        }

        .stats-cell .val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
          color: var(--white);
          letter-spacing: 1px;
          line-height: 1;
          margin-bottom: 6px;
        }

        .stats-cell .unit {
          font-size: 18px;
          margin-left: 2px;
        }

        .stats-cell .lbl {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--gray);
          font-weight: 700;
        }
.section-header {
          padding: 24px 24px 12px;
        }

        .section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 2px;
          color: var(--white);
        }

        .info-card {
          margin: 0 24px 12px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
          font-size: 12px;
          color: var(--gray);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .info-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          color: var(--white);
          letter-spacing: 0.5px;
        }

        .edit-btn {
          background: rgba(198, 241, 53, 0.08);
          border: 1px solid rgba(198, 241, 53, 0.2);
          border-radius: 12px;
          padding: 12px 24px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          letter-spacing: 1.5px;
          color: var(--lime);
          margin: 16px 24px;
          width: calc(100% - 48px);
        }
 /* ─── MODAL STYLES ─── */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 24px;
        }

        .modal {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          width: 100%;
          max-width: 400px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          padding: 24px 24px 16px;
          border-bottom: 1px solid var(--border);
        }

        .modal-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px;
          letter-spacing: 2px;
          color: var(--white);
        }

        .modal-body {
          padding: 24px;
        }
.form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--gray);
          margin-bottom: 8px;
          font-weight: 700;
        }

        .form-input {
          width: 100%;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 14px 16px;
          color: var(--white);
          font-family: 'Space Mono', monospace;
          font-size: 14px;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--lime);
        }

        .measurements-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          padding: 16px 24px 24px;
        }

  /* BAR CHART */
  .chart-section { padding: 0 24px; margin-top: 14px; flex-shrink: 0; }
  .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .chart-title { font-family: 'Bebas Neue', sans-serif; font-size: 20px; color: var(--white); letter-spacing: 1px; }
  .chart-tabs { display: flex; gap: 4px; }
  .chart-tab {
    padding: 4px 10px; border-radius: 8px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.5px;
    cursor: pointer; transition: all 0.2s; border: none; outline: none;
  }
  .chart-tab.active { background: var(--lime); color: var(--black); }
  .chart-tab:not(.active) { background: var(--card); color: var(--gray); border: 1px solid var(--border); }

  .bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 75px; }
  .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .bar { width: 100%; border-radius: 5px 5px 0 0; position: relative; overflow: hidden; transition: height 0.4s cubic-bezier(0.34, 1.2, 0.64, 1); }
  .bar.regular { background: var(--card); border: 1px solid var(--border); }
  .bar.today { background: var(--lime); }
  .bar.today::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(255,255,255,0.2), transparent); }
  .bar-day { font-size: 9px; color: var(--gray); letter-spacing: 0.5px; }
  .bar-day.today { color: var(--lime); font-weight: 700; }

  /* ACHIEVEMENTS */
 .ach-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          padding: 0 24px;
        }

        .ach-badge {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px;
          text-align: center;
          position: relative;
        }

        .ach-badge.earned {
          border-color: rgba(198, 241, 53, 0.3);
          background: linear-gradient(160deg, rgba(198, 241, 53, 0.04), var(--card));
        }

        .ach-icon {
          font-size: 36px;
          margin-bottom: 8px;
        }

        .ach-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 14px;
          letter-spacing: 0.5px;
          color: var(--white);
          margin-bottom: 4px;
        }

        .ach-desc {
          font-size: 10px;
          color: var(--gray);
          line-height: 1.3;
        }

        .ach-earned-tag {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(198, 241, 53, 0.15);
          color: var(--lime);
          font-size: 8px;
          padding: 3px 6px;
          border-radius: 4px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .ach-locked-tag {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: #555;
          font-size: 8px;
          padding: 3px 6px;
          border-radius: 4px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

  .btn {
          flex: 1;
          padding: 14px;
          border-radius: 12px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          letter-spacing: 1.5px;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .btn:active {
          opacity: 0.7;
        }

        .btn-secondary {
          background: var(--card);
          color: var(--gray);
          border: 1px solid var(--border);
        }

        .btn-primary {
          background: var(--lime);
          color: #0D0D0D;
        }
  /* ── EXPLORE SCREEN ── */
  .explore-header {
    padding: 10px 24px 14px; flex-shrink: 0;
  }

  .explore-title { font-family: 'Bebas Neue', sans-serif; font-size: 32px; color: var(--white); letter-spacing: 1px; }
  .explore-sub { font-size: 13px; color: var(--gray); margin-top: 2px; }

  .filter-row {
    display: flex; gap: 8px; padding: 0 24px 16px;
    overflow-x: auto; scrollbar-width: none; flex-shrink: 0;
  }
  .filter-row::-webkit-scrollbar { display: none; }

  .filter-chip {
    flex-shrink: 0; padding: 7px 14px; border-radius: 20px;
    font-size: 12px; font-weight: 600; cursor: pointer;
    transition: all 0.2s; border: none; outline: none;
  }
  .filter-chip.active { background: var(--lime); color: var(--black); }
  .filter-chip:not(.active) { background: var(--card); color: var(--gray); border: 1px solid var(--border); }

  .explore-card {
    margin: 0 24px 12px;
    border-radius: 20px; overflow: hidden;
    position: relative; height: 120px;
    cursor: pointer; transition: transform 0.15s;
  }

  .explore-card:active { transform: scale(0.97); }

  .explore-card .bg {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 60px;
  }

  .explore-card .overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to right, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0.3));
    padding: 16px 18px;
    display: flex; flex-direction: column; justify-content: center;
  }

  .ec-tag { font-size: 9px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; margin-bottom: 3px; }
  .ec-name { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: var(--white); letter-spacing: 1px; line-height: 1; }
  .ec-meta { display: flex; gap: 10px; margin-top: 5px; }
  .ec-meta span { font-size: 11px; color: rgba(255,255,255,0.5); }

  .empty-state { text-align: center; padding: 40px 24px; color: var(--gray); }
  .empty-state .icon { font-size: 40px; margin-bottom: 10px; }
  .empty-state p { font-size: 14px; }

  /* ── CREATE WORKOUT SCREEN ── */
  .create-topbar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 20px 0; flex-shrink: 0;
  }

  .create-title-input {
    background: transparent; border: none; outline: none;
    font-family: 'Bebas Neue', sans-serif; font-size: 30px;
    color: var(--white); letter-spacing: 1px; width: 100%;
    caret-color: var(--lime);
  }

  .create-title-input::placeholder { color: #444; }

  .field-label {
    font-size: 9px; text-transform: uppercase; letter-spacing: 2px;
    color: var(--gray); font-weight: 600; margin-bottom: 6px;
  }

  .category-chips { display: flex; gap: 7px; flex-wrap: wrap; }

  .category-chip {
    padding: 6px 12px; border-radius: 10px;
    font-size: 11px; font-weight: 600;
    cursor: pointer; transition: all 0.15s;
    border: 1px solid var(--border); background: var(--card);
    color: var(--gray); user-select: none;
  }

  .category-chip.selected {
    background: rgba(198,241,53,0.12);
    border-color: rgba(198,241,53,0.4);
    color: var(--lime);
  }

  /* Exercise search */
  .search-wrap {
    position: relative; margin: 0 20px;
  }

  .search-input {
    width: 100%; background: var(--card);
    border: 1px solid var(--border); border-radius: 14px;
    padding: 11px 14px 11px 38px;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    color: var(--white); outline: none;
    caret-color: var(--lime);
    transition: border-color 0.2s;
  }

  .search-input:focus { border-color: rgba(198,241,53,0.35); }
  .search-input::placeholder { color: #555; }

  .search-icon {
    position: absolute; left: 12px; top: 50%;
    transform: translateY(-50%); pointer-events: none;
  }

  .search-results {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 14px; margin: 6px 20px 0;
    overflow: hidden; max-height: 200px; overflow-y: auto;
  }

  .search-result-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 11px 14px; border-bottom: 1px solid rgba(255,255,255,0.04);
    cursor: pointer; transition: background 0.1s;
    user-select: none;
  }

  .search-result-item:last-child { border-bottom: none; }
  .search-result-item:active { background: rgba(255,255,255,0.05); }

  .sri-name { font-size: 14px; font-weight: 500; color: var(--white); }
  .sri-muscle { font-size: 11px; color: var(--gray); margin-top: 1px; }

  .sri-add {
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(198,241,53,0.12); border: 1px solid rgba(198,241,53,0.3);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* Builder exercise list */
  .builder-ex-card {
    margin: 0 20px 10px;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden;
  }

  .builder-ex-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 11px 14px;
    background: rgba(198,241,53,0.04);
    border-bottom: 1px solid var(--border);
  }

  .builder-ex-name {
    font-family: 'Bebas Neue', sans-serif; font-size: 18px;
    color: var(--white); letter-spacing: 0.5px;
  }

  .builder-ex-muscle { font-size: 10px; color: var(--gray); margin-top: 1px; }

  .remove-btn {
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(255,69,69,0.08); border: 1px solid rgba(255,69,69,0.2);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s; flex-shrink: 0;
  }

  .remove-btn:active { background: rgba(255,69,69,0.2); transform: scale(0.88); }

  .builder-config-row {
    display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 0; padding: 10px 14px; align-items: center;
  }

  .config-cell { text-align: center; }

  .config-label {
    font-size: 8px; text-transform: uppercase; letter-spacing: 1.5px;
    color: var(--gray); font-weight: 600; margin-bottom: 5px;
  }

  .config-stepper-row {
    display: flex; align-items: center; justify-content: center; gap: 3px;
  }

  .cfg-btn {
    width: 22px; height: 22px; border-radius: 6px;
    background: rgba(255,255,255,0.06); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 12px; color: var(--gray-light);
    user-select: none; transition: background 0.1s;
  }

  .cfg-btn:active { background: rgba(255,255,255,0.14); }

  .cfg-val {
    font-family: 'Space Mono', monospace; font-size: 13px;
    font-weight: 700; color: var(--white);
    min-width: 22px; text-align: center;
  }

  .empty-builder {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 28px 24px; text-align: center;
    border: 1.5px dashed var(--border); border-radius: 16px;
    margin: 0 20px;
  }

  .empty-builder-icon { font-size: 32px; margin-bottom: 8px; opacity: 0.4; }
  .empty-builder-text { font-size: 13px; color: var(--gray); }

  /* Custom exercise row in dropdown */
  .custom-ex-trigger {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 14px;
    border-bottom: 1px solid var(--border);
    cursor: pointer; transition: background 0.12s;
    background: rgba(198,241,53,0.03);
  }
  .custom-ex-trigger:active { background: rgba(198,241,53,0.08); }

  .custom-ex-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(198,241,53,0.12); border: 1px solid rgba(198,241,53,0.3);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  .custom-ex-label { font-size: 13px; font-weight: 600; color: var(--lime); }
  .custom-ex-sub { font-size: 10px; color: var(--gray); margin-top: 1px; }

  .custom-ex-form {
    padding: 12px 14px 14px;
    border-bottom: 1px solid var(--border);
    background: rgba(198,241,53,0.03);
  }

  .custom-ex-input {
    width: 100%; background: var(--surface);
    border: 1px solid var(--border); border-radius: 10px;
    padding: 9px 12px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
    color: var(--white); outline: none; caret-color: var(--lime);
    transition: border-color 0.2s; margin-bottom: 8px;
  }
  .custom-ex-input:focus { border-color: rgba(198,241,53,0.35); }
  .custom-ex-input::placeholder { color: #444; }

  .muscle-chips { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px; }

  .muscle-chip {
    padding: 4px 10px; border-radius: 8px;
    font-size: 11px; font-weight: 600; cursor: pointer;
    background: var(--surface); border: 1px solid var(--border);
    color: var(--gray); user-select: none; transition: all 0.12s;
  }
  .muscle-chip.selected { background: rgba(198,241,53,0.12); border-color: rgba(198,241,53,0.35); color: var(--lime); }

  .custom-add-btn {
    width: 100%; height: 36px; border-radius: 10px;
    border: none; font-family: 'Bebas Neue', sans-serif;
    font-size: 16px; letter-spacing: 1.5px;
    cursor: pointer; transition: opacity 0.15s;
  }
  .custom-add-btn:not(:disabled) { background: var(--lime); color: var(--black); }
  .custom-add-btn:disabled { background: var(--card); color: #444; border: 1px solid var(--border); cursor: default; opacity: 0.4; }

  /* ─── PROFILE STYLES ─── */
  .profile-hero {
    padding: 40px 24px 24px;
    text-align: center;
    position: relative;
  }

  .profile-avatar-ring {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    margin: 0 auto 16px;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profile-avatar-inner {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--surface);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 48px;
    color: var(--lime);
    letter-spacing: 2px;
  }

  .profile-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    letter-spacing: 2px;
    margin-bottom: 4px;
  }

  .profile-handle {
    font-size: 11px;
    color: var(--gray);
    margin-bottom: 8px;
  }

  .profile-affirmation {
    font-size: 13px;
    color: var(--lime);
    font-style: italic;
    max-width: 320px;
    margin: 16px auto 0;
    line-height: 1.5;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    padding: 0 24px;
    margin-top: 24px;
  }

  .stats-cell {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 16px 12px;
    text-align: center;
  }

  .stats-cell .val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 32px;
    color: var(--white);
    letter-spacing: 1px;
    line-height: 1;
    margin-bottom: 6px;
  }

  .stats-cell .unit {
    font-size: 18px;
    margin-left: 2px;
  }

  .stats-cell .lbl {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--gray);
    font-weight: 700;
  }

  .info-card {
    margin: 0 24px 12px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 16px;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
  }

  .info-row:last-child {
    border-bottom: none;
  }

  .info-label {
    font-size: 12px;
    color: var(--gray);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .info-value {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px;
    color: var(--white);
    letter-spacing: 0.5px;
  }

  .edit-btn {
    background: rgba(198, 241, 53, 0.08);
    border: 1px solid rgba(198, 241, 53, 0.2);
    border-radius: 12px;
    padding: 12px 24px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 16px;
    letter-spacing: 1.5px;
    color: var(--lime);
    margin: 16px 24px;
    width: calc(100% - 48px);
    cursor: pointer;
  }

  .ach-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 0 24px;
  }

  .ach-badge {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 16px;
    text-align: center;
    position: relative;
  }

  .ach-badge.earned {
    border-color: rgba(198, 241, 53, 0.3);
    background: linear-gradient(160deg, rgba(198, 241, 53, 0.04), var(--card));
  }

  .ach-icon {
    font-size: 36px;
    margin-bottom: 8px;
  }

  .ach-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 14px;
    letter-spacing: 0.5px;
    color: var(--white);
    margin-bottom: 4px;
  }

  .ach-desc {
    font-size: 10px;
    color: var(--gray);
    line-height: 1.3;
  }

  .ach-earned-tag {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(198, 241, 53, 0.15);
    color: var(--lime);
    font-size: 8px;
    padding: 3px 6px;
    border-radius: 4px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .ach-locked-tag {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 255, 255, 0.05);
    color: #555;
    font-size: 8px;
    padding: 3px 6px;
    border-radius: 4px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  /* ─── MODAL STYLES ─── */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 24px;
  }

  .modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    width: 100%;
    max-width: 400px;
    max-height: 80vh;
    overflow-y: auto;
  }

  .modal-header {
    padding: 24px 24px 16px;
    border-bottom: 1px solid var(--border);
  }

  .modal-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px;
    letter-spacing: 2px;
    color: var(--white);
  }

  .modal-body {
    padding: 24px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--gray);
    margin-bottom: 8px;
    font-weight: 700;
  }

  .form-input {
    width: 100%;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 16px;
    color: var(--white);
    font-family: 'Space Mono', monospace;
    font-size: 14px;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--lime);
  }

  .measurements-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .modal-actions {
    display: flex;
    gap: 12px;
    padding: 16px 24px 24px;
  }

  .btn {
    flex: 1;
    padding: 14px;
    border-radius: 12px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 16px;
    letter-spacing: 1.5px;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn:active {
    opacity: 0.7;
  }

  .btn-secondary {
    background: var(--card);
    color: var(--gray);
    border: 1px solid var(--border);
  }

  .btn-primary {
    background: var(--lime);
    color: #0D0D0D;
  }
`;

// ─── NAV ICONS ───────────────────────────────────────────────────────────────

const NavIcon = ({ type, active }) => {
  const c = active ? "#C6F135" : "#888";
  if (type === "home") return <svg width="22" height="22" viewBox="0 0 24 24" fill={c}><path d="M3 12L12 3l9 9v9H15v-6H9v6H3v-9z"/></svg>;
  if (type === "explore") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
  if (type === "progress") return <svg width="22" height="22" viewBox="0 0 24 24" fill={c}><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99l1.5 1.5z"/></svg>;
  if (type === "profile") return <svg width="22" height="22" viewBox="0 0 24 24" fill={c}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>;
  return null;
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function parseWeight(w) {
  if (w === "BW" || w === "—") return w;
  return parseInt(w) || 0;
}

function buildSetLog(workout) {
  const log = {};
  workout.exercises.forEach(ex => {
    log[ex.id] = Array.from({ length: ex.sets }, () => ({
      reps: ex.reps,
      weight: parseWeight(ex.weight),
    }));
  });
  return log;
}

function buildSetDone(workout) {
  const done = {};
  workout.exercises.forEach(ex => {
    done[ex.id] = Array(ex.sets).fill(false);
  });
  return done;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

function ForgeApp() {
  const [tab, setTab] = useState("home");
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [setLog, setSetLog] = useState({});
  const [setDone, setSetDone] = useState({});
  const [restActive, setRestActive] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const [restMax, setRestMax] = useState(60);
  const [restNextEx, setRestNextEx] = useState(null);
  const [restNextSetIdx, setRestNextSetIdx] = useState(null);
  const [showComplete, setShowComplete] = useState(false);
  const [workoutPartial, setWorkoutPartial] = useState(false);
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [stats, setStats] = useState(() => loadWorkoutStats());
  const [workoutLog, setWorkoutLog] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [customWorkouts, setCustomWorkouts] = useState([]);
  const [customExercises, setCustomExercises] = useState([]);
  const [profile, setProfile] = useState(loadProfile);

  const updateProfile = (newProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  };
// Add this inside your ForgeApp component
useEffect(() => {
  saveWorkoutStats(stats);
}, [stats]);
  const timerRef = useRef(null);
  const durationRef = useRef(null);

  const [clock, setClock] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 10000);
    return () => clearInterval(t);
  }, []);

  const startWorkout = useCallback((workout) => {
    setActiveWorkout(workout);
    setSetLog(buildSetLog(workout));
    setSetDone(buildSetDone(workout));
    setRestActive(false);
    setShowComplete(false);
    setWorkoutDuration(0);
    setTab("workout");
  }, []);

  useEffect(() => {
    if (tab === "workout" && activeWorkout && !showComplete) {
      durationRef.current = setInterval(() => setWorkoutDuration(d => d + 1), 1000);
    } else {
      clearInterval(durationRef.current);
    }
    return () => clearInterval(durationRef.current);
  }, [tab, activeWorkout, showComplete]);

  useEffect(() => {
    if (restActive && restSeconds > 0) {
      timerRef.current = setTimeout(() => setRestSeconds(s => s - 1), 1000);
    } else if (restActive && restSeconds === 0) {
      setRestActive(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [restActive, restSeconds]);

  const buildLogEntry = useCallback((workout, doneMap, logMap) => {
    const exercises = workout.exercises
      .map(ex => {
        const doneSets = (doneMap[ex.id] || []).filter(Boolean).length;
        if (doneSets === 0) return null;
        const weights = (logMap[ex.id] || [])
          .filter((_, i) => doneMap[ex.id]?.[i])
          .map(s => typeof s.weight === "number" ? s.weight : null)
          .filter(w => w !== null);
        const avgWeight = weights.length ? weights.reduce((a, b) => a + b, 0) / weights.length : null;
        const maxWeight = weights.length ? Math.max(...weights) : null;
        return { name: ex.name, muscle: ex.muscle || "Other", setsLogged: doneSets, avgWeight, maxWeight };
      })
      .filter(Boolean);
    return { date: new Date().toISOString(), workoutName: workout.name, exercises };
  }, []);

  const logSet = useCallback((exId, setIdx) => {
    if (!activeWorkout) return;
    const newDone = { ...setDone, [exId]: [...setDone[exId]] };
    newDone[exId][setIdx] = true;
    setSetDone(newDone);

    const exList = activeWorkout.exercises;
    const thisEx = exList.find(e => e.id === exId);
    let nextEx = null, nextSetIdx = null;
    outer: for (let ei = 0; ei < exList.length; ei++) {
      const ex = exList[ei];
      for (let si = 0; si < ex.sets; si++) {
        if (!newDone[ex.id][si]) { nextEx = ex; nextSetIdx = si; break outer; }
      }
    }

    const allDone = exList.every(ex => newDone[ex.id].every(Boolean));
    if (allDone) {
      setRestActive(false);
      setShowComplete(true);
      setWorkoutLog(prev => [...prev, buildLogEntry(activeWorkout, newDone, setLog)]);
      setStats(s => ({
        ...s,
        streak: s.streak + 1,
        workoutsThisWeek: Math.min(s.workoutsThisWeek + 1, 7),
        totalWorkouts: s.totalWorkouts + 1,
        weeklyVolume: s.weeklyVolume.map((v, i) => i === 6 ? v + 20 : v),
      }));
      return;
    }

    const restTime = thisEx?.rest || 60;
    setRestMax(restTime);
    setRestSeconds(restTime);
    setRestNextEx(nextEx);
    setRestNextSetIdx(nextSetIdx);
    setRestActive(true);
  }, [activeWorkout, setDone, setLog, buildLogEntry]);

  const adjustSet = useCallback((exId, setIdx, field, delta) => {
    setSetLog(prev => {
      const updated = prev[exId].map((s, i) => {
        if (i !== setIdx) return s;
        if (field === "reps") return { ...s, reps: Math.max(1, s.reps + delta) };
        if (field === "weight") {
          const cur = s.weight;
          if (cur === "BW" || cur === "—") return s;
          return { ...s, weight: Math.max(0, cur + delta) };
        }
        return s;
      });
      return { ...prev, [exId]: updated };
    });
  }, []);

  const skipRest = () => { setRestActive(false); setRestSeconds(0); };
  const addRest = () => { setRestSeconds(s => s + 15); setRestMax(m => m + 15); };

  const finishEarly = useCallback(() => {
    setRestActive(false);
    setShowComplete(true);
    setWorkoutPartial(true);
    if (activeWorkout) {
      setWorkoutLog(prev => [...prev, buildLogEntry(activeWorkout, setDone, setLog)]);
    }
    setStats(s => ({
      ...s,
      totalWorkouts: s.totalWorkouts + 1,
      weeklyVolume: s.weeklyVolume.map((v, i) => i === 6 ? v + 10 : v),
    }));
  }, [activeWorkout, setDone, setLog, buildLogEntry]);

  const formatTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const formatDuration = s => `${Math.floor(s / 60)}m ${s % 60}s`;

  const categories = ["All", "Strength", "HIIT", "Recovery", "Custom"];
  const categoryMap = { "Strength": ["Push Day", "Leg Day"], "HIIT": ["HIIT"], "Recovery": ["Recovery"], "Custom": ["Custom"] };
  const allWorkouts = [...WORKOUTS, ...customWorkouts];
  const filteredWorkouts = filterCategory === "All" ? allWorkouts : allWorkouts.filter(w => (categoryMap[filterCategory] || []).includes(w.category));

  const totalSetsDone = activeWorkout
    ? activeWorkout.exercises.reduce((acc, ex) => acc + (setDone[ex.id] || []).filter(Boolean).length, 0)
    : 0;
  const totalSets = activeWorkout
    ? activeWorkout.exercises.reduce((acc, ex) => acc + ex.sets, 0)
    : 0;

  const currentExIdx = activeWorkout
    ? activeWorkout.exercises.findIndex(ex => setDone[ex.id] && !setDone[ex.id].every(Boolean))
    : -1;
  const currentEx = activeWorkout && currentExIdx >= 0 ? activeWorkout.exercises[currentExIdx] : null;

  return (
    <>
      <style>{css}</style>
      <div className="app-shell">
        <div className="phone">
          {tab === "home" && <HomeScreen stats={stats} profile={profile} onStartWorkout={startWorkout} onNavigate={setTab} />}
          {tab === "explore" && <ExploreScreen workouts={filteredWorkouts} categories={categories} filterCategory={filterCategory} setFilterCategory={setFilterCategory} onStartWorkout={startWorkout} onCreateWorkout={() => setTab("create")} />}
          {tab === "create" && (
            <CreateWorkoutScreen
              customExercises={customExercises}
              onAddCustomExercise={(ex) => setCustomExercises(prev => [...prev, ex])}
              onBack={() => setTab("explore")}
              onSave={(w) => {
                setCustomWorkouts(prev => [...prev, w]);
                setTab("explore");
              }}
            />
          )}
          {tab === "workout" && activeWorkout && (
            <WorkoutScreen
              workout={activeWorkout}
              setLog={setLog}
              setDone={setDone}
              currentEx={currentEx}
              totalSetsDone={totalSetsDone}
              totalSets={totalSets}
              restActive={restActive}
              restSeconds={restSeconds}
              restMax={restMax}
              restNextEx={restNextEx}
              restNextSetIdx={restNextSetIdx}
              showComplete={showComplete}
              workoutPartial={workoutPartial}
              workoutDuration={workoutDuration}
              formatTime={formatTime}
              formatDuration={formatDuration}
              onLogSet={logSet}
              onAdjust={adjustSet}
              onSkipRest={skipRest}
              onAddRest={addRest}
              onFinishEarly={finishEarly}
              onCancel={() => { setRestActive(false); setActiveWorkout(null); setWorkoutPartial(false); setTab("home"); }}
              onDone={() => { setRestActive(false); setActiveWorkout(null); setWorkoutPartial(false); setTab("home"); }}
            />
          )}
          {tab === "progress" && <ProgressScreen workoutLog={workoutLog} />}
          {tab === "profile" && <ProfileScreen stats={stats} profile={profile} updateProfile={updateProfile} />}

          {tab !== "workout" && tab !== "create" && (
            <div className="bottom-nav">
              {["home", "explore", "progress", "profile"].map(t => (
                <div key={t} className={`nav-item pressable ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                  <NavIcon type={t} active={tab === t} />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── HOME SCREEN ─────────────────────────────────────────────────────────────

function HomeScreen({ stats, profile, onStartWorkout, onNavigate }) {
  const todayWorkout = WORKOUTS[0];
  const initials = profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'M';
  const displayName = profile.name ? profile.name.split(' ')[0].toUpperCase() : 'CHAMPION';
  
  // Format active hours as "Xh Ym" or just "Xh" or just "Ym"
  const formatActiveTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };
  
  return (
    <div className="screen">
      <div className="scroll-area">
        <div className="home-header">
          <div className="home-greeting">
            <div className="hey">Good morning 👋</div>
            <div className="name">{displayName}</div>
          </div>
          <div className="avatar-btn pressable" onClick={() => onNavigate("profile")} style={{ background: 'none', overflow: 'visible' }}>
            <div style={{ position:'relative', width:44, height:44 }}>
              {/* spinning arc segments */}
              <div style={{
                position:'absolute', inset:0, borderRadius:'50%',
                background:'conic-gradient(#ffd700 0deg, #ff6b00 55deg, transparent 55deg, transparent 90deg, #ffd700 90deg, #ff6b00 145deg, transparent 145deg, transparent 180deg, #ffd700 180deg, #ff6b00 235deg, transparent 235deg, transparent 270deg, #ffd700 270deg, #ff6b00 325deg, transparent 325deg, transparent 360deg)',
                animation:'cyber-spin 8s linear infinite',
              }}/>
              {/* dark mask */}
              <div style={{ position:'absolute', inset:3, borderRadius:'50%', background:'var(--black, #080510)' }}/>
              {/* corner brackets */}
              {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
                <div key={v+h} style={{
                  position:'absolute', width:6, height:6,
                  [v]:6, [h]:6,
                  borderColor:'#ffd700', borderStyle:'solid',
                  borderWidth: `${v==='top'?'2px':'0'} ${h==='right'?'2px':'0'} ${v==='bottom'?'2px':'0'} ${h==='left'?'2px':'0'}`,
                }}/>
              ))}
              {/* initials */}
              <div style={{
                position:'absolute', inset:4, borderRadius:'50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:"'Bebas Neue', sans-serif", fontSize:15, fontWeight:900,
                color:'#ffd700',
                textShadow:'0 0 8px #ffd700, 0 0 16px #ff6b00',
              }}>{initials}</div>
            </div>
          </div>
        </div>

        <div className="streak-banner pressable">
          <div className="streak-num">{stats.streak}</div>
          <div className="streak-text">
            <div className="top">Day Streak</div>
            <div className="bottom">Keep it up!</div>
          </div>
          <div className="streak-badge">🔥 ON FIRE</div>
        </div>

        <div className="section-header">
          <div className="section-title">TODAY'S PLAN</div>
        </div>

        <div className="plan-card pressable" onClick={() => onStartWorkout(todayWorkout)}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#C6F135", borderRadius: "0 2px 2px 0" }} />
          <div className="plan-icon-wrap">{todayWorkout.emoji}</div>
          <div className="plan-info">
            <div className="plan-type">{todayWorkout.category}</div>
            <div className="plan-name">{todayWorkout.name}</div>
            <div className="plan-meta">
              <span>⏱ {todayWorkout.duration} min</span>
              <span>💪 {todayWorkout.exercises.length} exercises</span>
            </div>
          </div>
          <div className="plan-start-btn pressable">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A0A0A"><path d="M5 3l14 9-14 9V3z"/></svg>
          </div>
        </div>

        <div className="section-header" style={{ paddingTop: 14 }}>
          <div className="section-title">THIS WEEK</div>
          <div className="section-link" onClick={() => onNavigate("progress")}>Details →</div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">💪</div>
            <div className="stat-val">{stats.workoutsThisWeek}</div>
            <div className="stat-lbl">Workouts</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱</div>
            <div className="stat-val">{formatActiveTime(stats.activeHoursThisWeek)}</div>
            <div className="stat-lbl">Active</div>
          </div>
        </div>

        <div className="section-header" style={{ paddingTop: 14 }}>
          <div className="section-title">EXPLORE</div>
          <div className="section-link" onClick={() => onNavigate("explore")}>All →</div>
        </div>

        <div className="workouts-scroll">
          {WORKOUTS.map((w, i) => {
            const tagColors = ["#C6F135", "#7B9FFF", "#C6F135", "#FF8C42"];
            return (
              <div key={w.id} className="workout-card pressable" onClick={() => onStartWorkout(w)}>
                <div className="bg" style={{ background: w.bg }}>{w.emoji}</div>
                <div className="overlay">
                  <div className="wc-tag" style={{ color: tagColors[i] }}>{w.category}</div>
                  <div className="wc-name">{w.name}</div>
                  <div className="wc-dur">{w.duration} min · {w.difficulty}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}

// ─── EXPLORE SCREEN ──────────────────────────────────────────────────────────

function ExploreScreen({ workouts, categories, filterCategory, setFilterCategory, onStartWorkout, onCreateWorkout }) {
  const tagColors = { "Push Day": "#C6F135", "Leg Day": "#C6F135", "Recovery": "#7B9FFF", "HIIT": "#FF8C42", "Custom": "#FF8C42" };
  return (
    <div className="screen">
      <div className="explore-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="explore-title">WORKOUTS</div>
            <div className="explore-sub">{workouts.length} programs available</div>
          </div>
          <button
            className="pressable"
            onClick={onCreateWorkout}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "var(--lime)", border: "none", borderRadius: 14,
              padding: "10px 16px", cursor: "pointer",
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 16,
              color: "var(--black)", letterSpacing: 1.5,
              marginTop: 4, flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            CREATE
          </button>
        </div>
      </div>
      <div className="filter-row">
        {categories.map(c => (
          <button key={c} className={`filter-chip pressable ${filterCategory === c ? "active" : ""}`} onClick={() => setFilterCategory(c)}>{c}</button>
        ))}
      </div>
      <div className="scroll-area" style={{ paddingTop: 4 }}>
        {workouts.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <p>No workouts found</p>
          </div>
        ) : workouts.map(w => (
          <div key={w.id} className="explore-card pressable" onClick={() => onStartWorkout(w)}>
            <div className="bg" style={{ background: w.bg }}>{w.emoji}</div>
            <div className="overlay">
              <div className="ec-tag" style={{ color: tagColors[w.category] || "#C6F135" }}>{w.category}</div>
              <div className="ec-name">{w.name}</div>
              <div className="ec-meta">
                <span>⏱ {w.duration} min</span>
                <span>⚡ {w.difficulty}</span>
              </div>
            </div>
          </div>
        ))}
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}

// ─── CREATE WORKOUT SCREEN ───────────────────────────────────────────────────

function CreateWorkoutScreen({ customExercises, onAddCustomExercise, onBack, onSave }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Custom");
  const [emoji, setEmoji] = useState("💪");
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customExName, setCustomExName] = useState("");
  const [customExMuscle, setCustomExMuscle] = useState("");
  const [customExWeightType, setCustomExWeightType] = useState("kg");
  const searchRef = useRef(null);
  const customNameRef = useRef(null);

  const fullLibrary = useMemo(() => {
    const customAsLibrary = customExercises.map(e => ({
      ...e,
      isCustom: true,
    }));
    return [...customAsLibrary, ...EXERCISE_LIBRARY];
  }, [customExercises]);

  const filteredLibrary = search.trim().length > 0
    ? fullLibrary.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.muscle.toLowerCase().includes(search.toLowerCase())
      )
    : fullLibrary.slice(0, 12);

  const addExercise = (libEx) => {
    setExercises(prev => [...prev, {
      id: Date.now() + Math.random(),
      name: libEx.name,
      muscle: libEx.muscle,
      sets: 3,
      reps: libEx.defaultReps,
      rest: 60,
      weight: libEx.defaultWeight,
    }]);
    setSearch("");
    setShowSearch(false);
  };

  const addCustomExercise = () => {
    const trimmedName = customExName.trim();
    const trimmedMuscle = customExMuscle.trim() || "Other";
    if (!trimmedName) return;

    const defaultWeight = customExWeightType === "BW" ? "BW" : 0;

    const libraryEntry = {
      id: `custom_${Date.now()}`,
      name: trimmedName,
      muscle: trimmedMuscle,
      defaultWeight,
      defaultReps: 10,
      isCustom: true,
    };
    onAddCustomExercise(libraryEntry);

    setExercises(prev => [...prev, {
      id: Date.now() + Math.random(),
      name: trimmedName,
      muscle: trimmedMuscle,
      sets: 3,
      reps: 10,
      rest: 60,
      weight: defaultWeight,
    }]);
    setCustomExName("");
    setCustomExMuscle("");
    setCustomExWeightType("kg");
    setShowCustomForm(false);
    setShowSearch(false);
  };

  const removeExercise = (id) => setExercises(prev => prev.filter(e => e.id !== id));

  const adjustEx = (id, field, delta) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id !== id) return ex;
      if (field === "sets") return { ...ex, sets: Math.max(1, ex.sets + delta) };
      if (field === "reps") return { ...ex, reps: Math.max(1, ex.reps + delta) };
      if (field === "rest") return { ...ex, rest: Math.max(0, ex.rest + delta) };
      if (field === "weight") {
        if (ex.weight === "BW" || ex.weight === "—") return ex;
        return { ...ex, weight: Math.max(0, ex.weight + delta) };
      }
      return ex;
    }));
  };

  const estimatedDuration = exercises.reduce((acc, ex) => {
    const setTime = 45;
    const restTime = ex.rest;
    return acc + ex.sets * (setTime + restTime);
  }, 0);

  const canSave = name.trim().length > 0 && exercises.length > 0;

  const handleSave = () => {
    const workout = {
      id: Date.now(),
      name: name.trim().toUpperCase(),
      category,
      emoji,
      duration: Math.round(estimatedDuration / 60),
      difficulty: exercises.length > 5 ? "Advanced" : exercises.length > 3 ? "Intermediate" : "Beginner",
      color: "#FF8C42",
      bg: "linear-gradient(160deg, #2a1a0a, #1a0a00)",
      exercises: exercises.map((ex, i) => ({
        id: i + 1,
        name: ex.name,
        muscle: ex.muscle,
        sets: ex.sets,
        reps: ex.reps,
        rest: ex.rest,
        weight: typeof ex.weight === "number" ? `${ex.weight}kg` : ex.weight,
      })),
    };
    onSave(workout);
  };

  return (
    <div className="screen" style={{ position: "relative" }}>
      <div className="create-topbar">
        <button className="back-btn" onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F0F0F0" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: "var(--white)", letterSpacing: 2 }}>BUILD WORKOUT</div>
        <button
          className="pressable"
          onClick={canSave ? handleSave : undefined}
          style={{
            background: canSave ? "var(--lime)" : "var(--card)",
            border: canSave ? "none" : "1px solid var(--border)",
            borderRadius: 12, padding: "7px 14px",
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 15,
            color: canSave ? "var(--black)" : "#444",
            cursor: canSave ? "pointer" : "default",
            letterSpacing: 1, transition: "all 0.2s",
          }}
        >
          SAVE
        </button>
      </div>

      <div className="scroll-area" style={{ paddingTop: 2 }}>
        <div style={{ padding: "14px 20px 0" }}>
          <div className="field-label">Workout Name</div>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative" }}>
              <div
                className="pressable"
                style={{ fontSize: 22, cursor: "pointer", lineHeight: 1 }}
                onClick={() => {
                  const next = EMOJIS[(EMOJIS.indexOf(emoji) + 1) % EMOJIS.length];
                  setEmoji(next);
                }}
                title="Tap to change"
              >{emoji}</div>
            </div>
            <input
              className="create-title-input"
              placeholder="e.g. MONDAY GRIND"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={30}
            />
          </div>
        </div>

        <div style={{ padding: "12px 20px 0" }}>
          <div className="field-label">Category</div>
          <div className="category-chips">
            {WORKOUT_CATEGORIES.map(c => (
              <div
                key={c}
                className={`category-chip pressable ${category === c ? "selected" : ""}`}
                onClick={() => setCategory(c)}
              >{c}</div>
            ))}
          </div>
        </div>

        <div style={{ padding: "14px 0 0" }}>
          <div className="field-label" style={{ padding: "0 20px" }}>Exercises</div>
          <div className="search-wrap">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              ref={searchRef}
              className="search-input"
              placeholder="Search exercises to add..."
              value={search}
              onChange={e => { setSearch(e.target.value); setShowSearch(true); }}
              onFocus={() => setShowSearch(true)}
            />
          </div>

          {showSearch && (
            <div className="search-results">
              {!showCustomForm ? (
                <div
                  className="custom-ex-trigger"
                  onClick={() => {
                    setShowCustomForm(true);
                    setTimeout(() => customNameRef.current?.focus(), 50);
                  }}
                >
                  <div className="custom-ex-icon">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--lime)" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                  <div>
                    <div className="custom-ex-label">Create custom exercise</div>
                    <div className="custom-ex-sub">Name it yourself & pick a muscle group</div>
                  </div>
                </div>
              ) : (
                <div className="custom-ex-form">
                  <input
                    ref={customNameRef}
                    className="custom-ex-input"
                    placeholder="Exercise name, e.g. Zercher Squat"
                    value={customExName}
                    onChange={e => setCustomExName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && customExName.trim() && addCustomExercise()}
                    maxLength={40}
                  />
                  <div className="muscle-chips">
                    {["Chest","Back","Shoulders","Biceps","Triceps","Legs","Core","Cardio","Other"].map(m => (
                      <div
                        key={m}
                        className={`muscle-chip pressable ${customExMuscle === m ? "selected" : ""}`}
                        onClick={() => setCustomExMuscle(prev => prev === m ? "" : m)}
                      >{m}</div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div className="field-label" style={{ marginBottom: 6 }}>Weight Type</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {[
                        { val: "kg",  label: "🏋️ Weighted (kg)" },
                        { val: "BW",  label: "🤸 Bodyweight" },
                      ].map(opt => (
                        <div
                          key={opt.val}
                          className={`muscle-chip pressable ${customExWeightType === opt.val ? "selected" : ""}`}
                          style={{ flex: 1, textAlign: "center", padding: "7px 0" }}
                          onClick={() => setCustomExWeightType(opt.val)}
                        >{opt.label}</div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="pressable"
                      style={{ height: 36, borderRadius: 10, background: "var(--card)", border: "1px solid var(--border)", color: "var(--gray)", cursor: "pointer", padding: "0 14px", fontSize: 13, fontWeight: 600 }}
                      onClick={() => { setShowCustomForm(false); setCustomExName(""); setCustomExMuscle(""); setCustomExWeightType("kg"); }}
                    >Cancel</button>
                    <button
                      className="custom-add-btn pressable"
                      disabled={!customExName.trim()}
                      onClick={addCustomExercise}
                    >ADD EXERCISE</button>
                  </div>
                </div>
              )}

              {filteredLibrary.length === 0 && search.trim() ? (
                <div style={{ padding: "12px 14px", color: "var(--gray)", fontSize: 13 }}>No matches — use "Create custom" above</div>
              ) : filteredLibrary.map(ex => {
                const alreadyAdded = exercises.some(e => e.name === ex.name);
                return (
                  <div
                    key={ex.id}
                    className="search-result-item"
                    onClick={() => !alreadyAdded && addExercise(ex)}
                    style={{ opacity: alreadyAdded ? 0.4 : 1 }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div className="sri-name">{ex.name}</div>
                        {ex.isCustom && (
                          <div style={{ fontSize: 9, fontWeight: 700, color: "var(--lime)", background: "rgba(198,241,53,0.1)", border: "1px solid rgba(198,241,53,0.25)", borderRadius: 5, padding: "1px 5px", letterSpacing: 0.5 }}>MY</div>
                        )}
                      </div>
                      <div className="sri-muscle">{ex.muscle}</div>
                    </div>
                    {alreadyAdded ? (
                      <div style={{ fontSize: 11, color: "var(--lime)", fontWeight: 700 }}>ADDED</div>
                    ) : (
                      <div className="sri-add">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--lime)" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {showSearch && (
            <div
              style={{ padding: "6px 20px 0", fontSize: 11, color: "var(--gray)", cursor: "pointer", textAlign: "right" }}
              onClick={() => { setShowSearch(false); setShowCustomForm(false); setCustomExName(""); setCustomExMuscle(""); setCustomExWeightType("kg"); }}
            >
              Close ✕
            </div>
          )}
        </div>

        <div style={{ marginTop: 14 }}>
          {exercises.length === 0 ? (
            <div className="empty-builder">
              <div className="empty-builder-icon">🏋️</div>
              <div className="empty-builder-text">Search above to add exercises to your workout</div>
            </div>
          ) : exercises.map((ex, idx) => (
            <div key={ex.id} className="builder-ex-card">
              <div className="builder-ex-header">
                <div>
                  <div className="builder-ex-name">{ex.name}</div>
                  <div className="builder-ex-muscle">{ex.muscle}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "var(--gray)" }}>#{idx + 1}</div>
                  <div className="remove-btn" onClick={() => removeExercise(ex.id)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </div>
                </div>
              </div>

              <div className="builder-config-row">
                {[
                  { label: "SETS", field: "sets", val: ex.sets, delta: 1, suffix: "" },
                  { label: "REPS", field: "reps", val: ex.reps, delta: 1, suffix: "" },
                  { label: "WEIGHT", field: "weight", val: typeof ex.weight === "number" ? ex.weight : null, display: typeof ex.weight === "number" ? `${ex.weight}kg` : ex.weight, delta: 2.5 },
                  { label: "REST", field: "rest", val: ex.rest, delta: 15, suffix: "s" },
                ].map(({ label, field, val, display, delta, suffix }) => (
                  <div key={field} className="config-cell">
                    <div className="config-label">{label}</div>
                    <div className="config-stepper-row">
                      <div className={`cfg-btn pressable ${val === null ? "disabled" : ""}`} style={{ opacity: val === null ? 0.25 : 1, cursor: val === null ? "default" : "pointer" }} onClick={() => val !== null && adjustEx(ex.id, field, -delta)}>−</div>
                      <div className="cfg-val">{display !== undefined ? display : `${val}${suffix}`}</div>
                      <div className={`cfg-btn pressable ${val === null ? "disabled" : ""}`} style={{ opacity: val === null ? 0.25 : 1, cursor: val === null ? "default" : "pointer" }} onClick={() => val !== null && adjustEx(ex.id, field, delta)}>+</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {exercises.length > 0 && (
          <div style={{ margin: "10px 20px 0", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 16px", display: "flex", justifyContent: "space-around" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "var(--white)" }}>{exercises.length}</div>
              <div style={{ fontSize: 9, color: "var(--gray)", textTransform: "uppercase", letterSpacing: 1 }}>Exercises</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "var(--white)" }}>{exercises.reduce((a, e) => a + e.sets, 0)}</div>
              <div style={{ fontSize: 9, color: "var(--gray)", textTransform: "uppercase", letterSpacing: 1 }}>Total Sets</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "var(--lime)" }}>~{Math.round(estimatedDuration / 60)}</div>
              <div style={{ fontSize: 9, color: "var(--gray)", textTransform: "uppercase", letterSpacing: 1 }}>Est. Mins</div>
            </div>
          </div>
        )}

        <div style={{ height: 24 }} />
      </div>

      <div style={{ padding: "12px 20px 20px", background: "var(--black)", flexShrink: 0 }}>
        <button
          className="cta-btn pressable"
          style={{
            width: "100%",
            background: canSave ? "var(--lime)" : "var(--card)",
            border: canSave ? "none" : "1px solid var(--border)",
            color: canSave ? "var(--black)" : "#444",
            cursor: canSave ? "pointer" : "default",
            opacity: canSave ? 1 : 0.6,
          }}
          onClick={canSave ? handleSave : undefined}
        >
          {canSave ? `SAVE "${name.trim().toUpperCase()}"` : exercises.length === 0 ? "ADD EXERCISES TO SAVE" : "NAME YOUR WORKOUT"}
        </button>
      </div>
    </div>
  );
}

// ─── WORKOUT SCREEN ──────────────────────────────────────────────────────────

function WorkoutScreen({
  workout, setLog, setDone, currentEx,
  totalSetsDone, totalSets,
  restActive, restSeconds, restMax, restNextEx, restNextSetIdx,
  showComplete, workoutPartial, workoutDuration,
  formatTime, formatDuration,
  onLogSet, onAdjust, onSkipRest, onAddRest, onFinishEarly, onCancel, onDone
}) {
  const restRingCirc = 502;
  const restOffset = restRingCirc - (restRingCirc * (restMax > 0 ? restSeconds / restMax : 0));

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const exSetsDone = (ex) => (setDone[ex.id] || []).filter(Boolean).length;
  const exAllDone = (ex) => (setDone[ex.id] || []).every(Boolean);

  return (
    <div className="screen" style={{ position: "relative" }}>
      <div className="workout-topbar">
        <button className="back-btn" onClick={() => setShowCancelConfirm(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F0F0F0" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="live-badge"><div className="live-dot" />IN PROGRESS</div>
        <div className="elapsed-badge">{formatDuration(workoutDuration)}</div>
      </div>

      <div style={{ padding: "6px 20px 10px" }}>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--lime)", fontWeight: 700, marginBottom: 2 }}>{workout.category}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "var(--white)", letterSpacing: 1, lineHeight: 1 }}>{workout.name}</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--gray)" }}>{totalSetsDone}/{totalSets} sets</div>
        </div>
        <div style={{ background: "#1a1a1a", borderRadius: 4, height: 4, marginTop: 8, overflow: "hidden" }}>
          <div style={{ background: "var(--lime)", width: `${totalSets > 0 ? (totalSetsDone / totalSets) * 100 : 0}%`, height: "100%", borderRadius: 4, transition: "width 0.4s ease" }} />
        </div>
      </div>

      <div className="scroll-area">
        {workout.exercises.map((ex, exIdx) => {
          const setsLog = setLog[ex.id] || [];
          const setsDoneArr = setDone[ex.id] || [];
          const isDone = exAllDone(ex);
          const isCurrent = currentEx?.id === ex.id;
          const isUpcoming = !isDone && !isCurrent;

          return (
            <div key={ex.id} style={{ margin: "0 16px 12px", opacity: isUpcoming ? 0.55 : 1, transition: "opacity 0.3s" }}>
              <div style={{
                background: "var(--card)",
                border: `1px solid ${isCurrent ? "rgba(198,241,53,0.25)" : isDone ? "rgba(198,241,53,0.1)" : "var(--border)"}`,
                borderRadius: 18,
                overflow: "hidden",
                transition: "border-color 0.3s",
              }}>
                <div style={{
                  padding: "12px 14px 10px",
                  background: isCurrent ? "linear-gradient(135deg, rgba(198,241,53,0.07), transparent)" : isDone ? "rgba(198,241,53,0.03)" : "transparent",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 2, color: isCurrent ? "var(--lime)" : "var(--gray)", fontWeight: 700, marginBottom: 2 }}>
                      Exercise {exIdx + 1}
                    </div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: isDone ? "var(--gray)" : "var(--white)", letterSpacing: 0.5, lineHeight: 1 }}>
                      {ex.name}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{
                      background: isDone ? "var(--lime)" : isCurrent ? "rgba(198,241,53,0.12)" : "var(--surface)",
                      border: `1px solid ${isDone ? "var(--lime)" : isCurrent ? "rgba(198,241,53,0.3)" : "var(--border)"}`,
                      borderRadius: 20, padding: "4px 10px",
                      fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
                      color: isDone ? "var(--black)" : isCurrent ? "var(--lime)" : "var(--gray)",
                    }}>
                      {isDone ? "✓ DONE" : `${exSetsDone(ex)}/${ex.sets}`}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--gray)", marginTop: 4 }}>{ex.rest > 0 ? `${ex.rest}s rest` : "No rest"}</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 1fr 42px", gap: 0, padding: "6px 14px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
                  {["SET", "REPS", "WEIGHT", ""].map((h, i) => (
                    <div key={i} style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--gray)", fontWeight: 600, textAlign: i > 0 ? "center" : "left" }}>{h}</div>
                  ))}
                </div>

                {setsLog.map((set, sIdx) => {
                  const done = setsDoneArr[sIdx];
                  const isNextSet = !done && (sIdx === 0 || setsDoneArr[sIdx - 1]);
                  const isActiveSet = isCurrent && isNextSet;

                  return (
                    <div key={sIdx} style={{
                      display: "grid", gridTemplateColumns: "28px 1fr 1fr 42px",
                      gap: 0, padding: "8px 14px", alignItems: "center",
                      background: isActiveSet ? "rgba(198,241,53,0.04)" : "transparent",
                      borderBottom: sIdx < setsLog.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      opacity: done ? 0.5 : 1, transition: "opacity 0.3s, background 0.3s",
                    }}>
                      <div style={{
                        fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700,
                        color: done ? "var(--lime)" : isActiveSet ? "var(--white)" : "var(--gray)",
                      }}>
                        {done ? "✓" : sIdx + 1}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                        <div
                          style={{ width: 24, height: 24, borderRadius: 7, background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: done ? "default" : "pointer", fontSize: 13, color: "var(--gray-light)", opacity: done ? 0.3 : 1, userSelect: "none" }}
                          onClick={() => !done && onAdjust(ex.id, sIdx, "reps", -1)}
                        >−</div>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, color: done ? "var(--gray)" : isActiveSet ? "var(--white)" : "var(--gray-light)", minWidth: 26, textAlign: "center" }}>
                          {set.reps}
                        </div>
                        <div
                          style={{ width: 24, height: 24, borderRadius: 7, background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: done ? "default" : "pointer", fontSize: 13, color: "var(--gray-light)", opacity: done ? 0.3 : 1, userSelect: "none" }}
                          onClick={() => !done && onAdjust(ex.id, sIdx, "reps", 1)}
                        >+</div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                        {typeof set.weight === "number" ? (
                          <>
                            <div
                              style={{ width: 24, height: 24, borderRadius: 7, background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: done ? "default" : "pointer", fontSize: 13, color: "var(--gray-light)", opacity: done ? 0.3 : 1, userSelect: "none" }}
                              onClick={() => !done && onAdjust(ex.id, sIdx, "weight", -2.5)}
                            >−</div>
                            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, color: done ? "var(--gray)" : isActiveSet ? "var(--white)" : "var(--gray-light)", minWidth: 34, textAlign: "center" }}>
                              {set.weight}kg
                            </div>
                            <div
                              style={{ width: 24, height: 24, borderRadius: 7, background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: done ? "default" : "pointer", fontSize: 13, color: "var(--gray-light)", opacity: done ? 0.3 : 1, userSelect: "none" }}
                              onClick={() => !done && onAdjust(ex.id, sIdx, "weight", 2.5)}
                            >+</div>
                          </>
                        ) : (
                          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, color: "var(--gray)", textAlign: "center" }}>{set.weight}</div>
                        )}
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        {done ? (
                          <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--lime)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                        ) : (
                          <div
                            className="pressable"
                            style={{
                              width: 34, height: 34, borderRadius: 10,
                              background: isActiveSet ? "var(--lime)" : "rgba(255,255,255,0.04)",
                              border: `1.5px solid ${isActiveSet ? "var(--lime)" : "var(--border)"}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: isActiveSet ? "pointer" : "default",
                              opacity: isActiveSet ? 1 : 0.25,
                              transition: "all 0.2s",
                            }}
                            onClick={() => isActiveSet && onLogSet(ex.id, sIdx)}
                          >
                            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, color: isActiveSet ? "var(--black)" : "var(--gray)", letterSpacing: 0.5 }}>LOG</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div style={{ height: 8 }} />
      </div>

      <div className="cta-area">
        <div className="cta-row">
          {totalSetsDone >= totalSets ? (
            <button className="cta-btn pressable" onClick={onDone}>
              🏆 FINISH WORKOUT
            </button>
          ) : totalSetsDone > 0 ? (
            <button className="cta-btn pressable" style={{ background: "rgba(198,241,53,0.12)", border: "1.5px solid rgba(198,241,53,0.35)", color: "var(--lime)" }} onClick={onFinishEarly}>
              ✓ FINISH EARLY
            </button>
          ) : (
            <button className="cta-btn pressable" style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--gray)", cursor: "default", opacity: 0.5, fontSize: 14, letterSpacing: 1 }}>
              LOG FIRST SET TO START
            </button>
          )}
        </div>
      </div>

      {restActive && (
        <div className="rest-overlay">
          <div className="rest-label">Rest</div>
          <div className="rest-ring-wrap">
            <svg viewBox="0 0 180 180">
              <circle className="rest-ring-bg" cx="90" cy="90" r="80"/>
              <circle className="rest-ring-fill" cx="90" cy="90" r="80" style={{ strokeDashoffset: restOffset }}/>
            </svg>
            <div className="rest-ring-inner">
              <div className="rest-big-time">{formatTime(restSeconds)}</div>
              <div className="rest-sub">seconds</div>
            </div>
          </div>

          {restNextEx && (
            <div className="rest-next-up">
              <div className="rest-next-label">Up Next</div>
              <div className="rest-next-name">{restNextEx.name}</div>
              <div className="rest-next-detail">
                Set {(restNextSetIdx || 0) + 1} · {setLog[restNextEx.id]?.[restNextSetIdx]?.reps} reps
                {typeof setLog[restNextEx.id]?.[restNextSetIdx]?.weight === "number"
                  ? ` · ${setLog[restNextEx.id]?.[restNextSetIdx]?.weight}kg`
                  : setLog[restNextEx.id]?.[restNextSetIdx]?.weight !== "—" ? ` · ${setLog[restNextEx.id]?.[restNextSetIdx]?.weight}` : ""}
              </div>
            </div>
          )}

          <div className="rest-btn-row">
            <button className="rest-add-btn pressable" onClick={onAddRest} title="+15s">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gray-light)" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/><path d="M8 12h-1M17 8l-1 1"/></svg>
            </button>
            <button className="rest-skip-btn pressable" onClick={onSkipRest}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A0A0A"><path d="M5 3l14 9-14 9V3z"/></svg>
              SKIP REST
            </button>
          </div>
        </div>
      )}

      {showComplete && (
        <div className="complete-overlay">
          <div className="complete-icon">{workoutPartial ? "💪" : "🏆"}</div>
          <div className="complete-title" style={{ color: workoutPartial ? "var(--white)" : "var(--lime)" }}>
            {workoutPartial ? "GOOD\nEFFORT!" : "WORKOUT\nCOMPLETE!"}
          </div>
          <div className="complete-sub">
            {workoutPartial
              ? `${totalSetsDone} of ${totalSets} sets logged — still counts.`
              : "You crushed it today, Marcus."}
          </div>
          <div className="complete-stats">
            <div className="complete-stat">
              <div className="val">{totalSetsDone}{workoutPartial ? <span style={{ fontSize: 20, color: "var(--gray)" }}>/{totalSets}</span> : ""}</div>
              <div className="lbl">Sets Done</div>
            </div>
            <div className="complete-stat">
              <div className="val">{formatDuration(workoutDuration)}</div>
              <div className="lbl">Duration</div>
            </div>
          </div>
          <button className="cta-btn pressable" style={{ width: "100%" }} onClick={onDone}>
            BACK TO HOME
          </button>
        </div>
      )}

      {showCancelConfirm && (
        <div className="complete-overlay" style={{ gap: 0 }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>🚪</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "var(--white)", letterSpacing: 2, textAlign: "center", lineHeight: 1, marginBottom: 8 }}>
            CANCEL WORKOUT?
          </div>
          <div style={{ fontSize: 14, color: "var(--gray)", textAlign: "center", marginBottom: 8 }}>
            Progress won't be saved.
          </div>
          {totalSetsDone > 0 && (
            <div style={{ fontSize: 13, color: "var(--lime)", textAlign: "center", marginBottom: 28 }}>
              You've logged {totalSetsDone} set{totalSetsDone !== 1 ? "s" : ""} — save them instead?
            </div>
          )}
          {totalSetsDone === 0 && <div style={{ marginBottom: 28 }} />}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
            {totalSetsDone > 0 && (
              <button
                className="cta-btn pressable"
                style={{ background: "rgba(198,241,53,0.12)", border: "1.5px solid rgba(198,241,53,0.35)", color: "var(--lime)" }}
                onClick={() => { setShowCancelConfirm(false); onFinishEarly(); }}
              >
                ✓ SAVE PARTIAL WORKOUT
              </button>
            )}
            <button
              className="cta-btn pressable"
              style={{ background: "rgba(255,69,69,0.1)", border: "1px solid rgba(255,69,69,0.25)", color: "var(--red)" }}
              onClick={onCancel}
            >
              CANCEL WITHOUT SAVING
            </button>
            <button
              className="cta-btn pressable"
              style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--gray)" }}
              onClick={() => setShowCancelConfirm(false)}
            >
              KEEP GOING
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PROGRESS SCREEN ─────────────────────────────────────────────────────────

function ProgressScreen({ workoutLog }) {
  const now = new Date();
  const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(now); monthAgo.setDate(monthAgo.getDate() - 30);

  const thisWeekLog = workoutLog.filter(w => new Date(w.date) >= weekAgo);
  const thisMonthLog = workoutLog.filter(w => new Date(w.date) >= monthAgo);

  const totalSets = workoutLog.reduce((acc, w) =>
    acc + w.exercises.reduce((a, e) => a + e.setsLogged, 0), 0);

  const weeklySetsByMuscle = {};
  ALL_MUSCLE_GROUPS.forEach(m => { weeklySetsByMuscle[m] = 0; });
  thisWeekLog.forEach(w => {
    w.exercises.forEach(e => {
      const key = e.muscle in weeklySetsByMuscle ? e.muscle : "Other";
      weeklySetsByMuscle[key] += e.setsLogged;
    });
  });

  const setsByMuscle = ALL_MUSCLE_GROUPS
    .map(group => ({
      group,
      sets: weeklySetsByMuscle[group] || 0,
      upper: MUSCLE_META[group].upper,
    }))
    .filter(m => m.group !== "Other" && m.group !== "Cardio" || m.sets > 0)
    .sort((a, b) => b.sets - a.sets);

  const weeklyTotalSets = setsByMuscle.reduce((a, m) => a + m.sets, 0);
  const maxSets = Math.max(...setsByMuscle.map(m => m.sets), 1);

  const favMuscle = setsByMuscle[0] || null;
  const weakestMuscle = [...setsByMuscle].filter(m => m.sets > 0).sort((a, b) => a.sets - b.sets)[0] || null;

  const upperSets = setsByMuscle.filter(m => m.upper).reduce((a, m) => a + m.sets, 0);
  const lowerSets = setsByMuscle.filter(m => !m.upper).reduce((a, m) => a + m.sets, 0);
  const totalUL = upperSets + lowerSets;
  const upperPct = totalUL > 0 ? Math.round((upperSets / totalUL) * 100) : 50;
  const lowerPct = 100 - upperPct;

  const dayMap = {};
  thisMonthLog.forEach(w => {
    const day = w.date.slice(0, 10);
    const weights = w.exercises
      .map(e => e.maxWeight)
      .filter(w => w !== null && w > 0);
    if (weights.length) {
      if (!dayMap[day]) dayMap[day] = [];
      dayMap[day].push(...weights);
    }
  });
  const sortedDays = Object.keys(dayMap).sort();
  const loadTrend = sortedDays.map(d => {
    const vals = dayMap[d];
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  });

  const liftHistory = {};
  thisMonthLog.forEach(w => {
    w.exercises.forEach(e => {
      if (e.maxWeight === null || e.maxWeight === 0) return;
      if (!liftHistory[e.name]) liftHistory[e.name] = [];
      liftHistory[e.name].push({ date: w.date, weight: e.maxWeight });
    });
  });
  const topLifts = Object.entries(liftHistory)
    .map(([name, entries]) => {
      if (entries.length < 2) return null;
      const sorted = entries.sort((a, b) => a.date.localeCompare(b.date));
      const before = sorted[0].weight;
      const after = sorted[sorted.length - 1].weight;
      const pct = ((after - before) / before) * 100;
      return pct > 0 ? { name, before, after, pct: Math.round(pct * 10) / 10 } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 3);

  const loggedWorkoutsCount = workoutLog.length;

  const loggedDays = new Set(workoutLog.map(w => w.date.slice(0, 10)));
  let streak = 0;
  const cursor = new Date(now);
  const todayStr = cursor.toISOString().slice(0, 10);
  if (!loggedDays.has(todayStr)) cursor.setDate(cursor.getDate() - 1);
  while (true) {
    const d = cursor.toISOString().slice(0, 10);
    if (loggedDays.has(d)) { streak++; cursor.setDate(cursor.getDate() - 1); }
    else break;
  }

  const sparkW = 280, sparkH = 56;
  const hasLoadData = loadTrend.length >= 2;
  const maxLoad = hasLoadData ? Math.max(...loadTrend) : 100;
  const minLoad = hasLoadData ? Math.min(...loadTrend) : 0;
  const loadRange = maxLoad - minLoad || 1;
  const pts = loadTrend.map((v, i) => {
    const x = loadTrend.length > 1 ? (i / (loadTrend.length - 1)) * sparkW : sparkW / 2;
    const y = sparkH - ((v - minLoad) / loadRange) * (sparkH - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const sparkPath = hasLoadData ? "M " + pts.join(" L ") : "";
  const areaPath = hasLoadData ? `M 0,${sparkH} L ${sparkPath.slice(2)} L ${sparkW},${sparkH} Z` : "";
  const loadDelta = hasLoadData ? loadTrend[loadTrend.length - 1] - loadTrend[0] : 0;

  const hasAnyData = workoutLog.length > 0;

  return (
    <div className="screen">
      <div className="scroll-area">
        <div style={{ padding: "14px 24px 4px" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "var(--white)", letterSpacing: 1 }}>PROGRESS</div>
          <div style={{ fontSize: 12, color: "var(--gray)", marginTop: 1 }}>
            {hasAnyData ? `${loggedWorkoutsCount} workout${loggedWorkoutsCount !== 1 ? "s" : ""} logged` : "Complete a workout to see your stats"}
          </div>
        </div>

        <div className="stats-grid" style={{ margin: "10px 24px 0" }}>
          <div className="stats-cell">
            <div className="val">{loggedWorkoutsCount || "—"}</div>
            <div className="lbl">Workouts</div>
          </div>
          <div className="stats-cell">
            <div className="val">{totalSets || "—"}</div>
            <div className="lbl">Total Sets</div>
          </div>
          <div className="stats-cell">
            <div className="val">{streak > 0 ? <>{streak}<span className="unit">🔥</span></> : "—"}</div>
            <div className="lbl">Streak</div>
          </div>
        </div>

        {!hasAnyData ? (
          <div style={{ margin: "32px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 14 }}>📊</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: "var(--white)", letterSpacing: 1, marginBottom: 6 }}>NO DATA YET</div>
            <div style={{ fontSize: 14, color: "var(--gray)", lineHeight: 1.5 }}>Log your first workout and your progress analytics will appear here — sets by muscle, load trends, best lifts, and more.</div>
          </div>
        ) : (
          <>
            <div style={{ margin: "16px 24px 0", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, padding: "14px 16px 12px", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: "var(--white)", letterSpacing: 1 }}>LOAD TREND</div>
                  <div style={{ fontSize: 11, color: "var(--gray)", marginTop: 1 }}>Avg max weight · 30 days</div>
                </div>
                {hasLoadData ? (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "var(--lime)", lineHeight: 1 }}>{loadTrend[loadTrend.length - 1]}kg</div>
                    <div style={{ fontSize: 10, color: loadDelta >= 0 ? "var(--lime)" : "var(--red)", fontWeight: 700, marginTop: 1 }}>
                      {loadDelta >= 0 ? "↑" : "↓"} {Math.abs(loadDelta)}kg vs first session
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: "var(--gray)" }}>Need 2+ sessions</div>
                )}
              </div>
              {hasLoadData ? (
                <>
                  <svg width="100%" viewBox={`0 0 ${sparkW} ${sparkH}`} preserveAspectRatio="none" style={{ display: "block" }}>
                    <defs>
                      <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C6F135" stopOpacity="0.25"/>
                        <stop offset="100%" stopColor="#C6F135" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d={areaPath} fill="url(#sparkGrad)"/>
                    <path d={sparkPath} fill="none" stroke="#C6F135" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx={pts[pts.length - 1].split(",")[0]} cy={pts[pts.length - 1].split(",")[1]} r="4" fill="#C6F135"/>
                  </svg>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    <div style={{ fontSize: 9, color: "var(--gray)", letterSpacing: 0.5 }}>{sortedDays[0]}</div>
                    <div style={{ fontSize: 9, color: "var(--gray)", letterSpacing: 0.5 }}>TODAY</div>
                  </div>
                </>
              ) : (
                <div style={{ height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: 12, color: "var(--gray)" }}>Log weighted exercises across multiple sessions to see your trend</div>
                </div>
              )}
            </div>

            <div style={{ margin: "14px 24px 0", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: "var(--white)", letterSpacing: 1 }}>SETS BY MUSCLE</div>
                  <div style={{ fontSize: 11, color: "var(--gray)", marginTop: 1 }}>This week</div>
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "var(--lime)" }}>{weeklyTotalSets} sets</div>
              </div>
              {weeklyTotalSets === 0 ? (
                <div style={{ fontSize: 12, color: "var(--gray)", textAlign: "center", padding: "12px 0" }}>No workouts logged this week yet</div>
              ) : setsByMuscle.map((m, i) => {
                const pct = (m.sets / maxSets) * 100;
                const isFav = favMuscle && m.group === favMuscle.group && m.sets > 0;
                const isWeak = weakestMuscle && m.group === weakestMuscle.group && setsByMuscle.filter(x => x.sets > 0).length > 1;
                return (
                  <div key={m.group} style={{ marginBottom: i < setsByMuscle.length - 1 ? 10 : 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: m.sets === 0 ? "#444" : isFav ? "var(--lime)" : isWeak ? "var(--orange)" : "var(--white)" }}>{m.group}</div>
                        {isFav && m.sets > 0 && <div style={{ fontSize: 8, fontWeight: 700, color: "var(--lime)", background: "rgba(198,241,53,0.1)", border: "1px solid rgba(198,241,53,0.25)", borderRadius: 4, padding: "1px 5px" }}>FAV</div>}
                        {isWeak && <div style={{ fontSize: 8, fontWeight: 700, color: "var(--orange)", background: "rgba(255,140,66,0.1)", border: "1px solid rgba(255,140,66,0.25)", borderRadius: 4, padding: "1px 5px" }}>LOW</div>}
                      </div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: m.sets === 0 ? "#444" : "var(--gray)" }}>{m.sets}</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: m.sets === 0 ? "transparent" : isFav ? "var(--lime)" : isWeak ? "var(--orange)" : "rgba(198,241,53,0.45)", transition: "width 0.5s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {weeklyTotalSets > 0 && (
              <div style={{ margin: "14px 24px 0", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, padding: "14px 16px" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: "var(--white)", letterSpacing: 1, marginBottom: 12 }}>UPPER / LOWER RATIO</div>
                <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", height: 28 }}>
                  <div style={{ width: `${upperPct}%`, background: "var(--lime)", display: "flex", alignItems: "center", justifyContent: "center", minWidth: upperPct > 0 ? 32 : 0, transition: "width 0.4s" }}>
                    {upperPct > 10 && <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: "var(--black)" }}>{upperPct}%</span>}
                  </div>
                  <div style={{ flex: 1, background: "#7B9FFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {lowerPct > 10 && <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: "var(--black)" }}>{lowerPct}%</span>}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: "var(--lime)" }} />
                    <div style={{ fontSize: 11, color: "var(--gray)" }}>Upper · {upperSets} sets</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ fontSize: 11, color: "var(--gray)" }}>Lower · {lowerSets} sets</div>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: "#7B9FFF" }} />
                  </div>
                </div>
                {upperPct > 70 && (
                  <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(255,140,66,0.08)", border: "1px solid rgba(255,140,66,0.2)", borderRadius: 10, fontSize: 11, color: "var(--orange)" }}>
                    ⚠️ Heavy upper body focus — consider adding more leg days
                  </div>
                )}
              </div>
            )}

            {favMuscle && favMuscle.sets > 0 && (
              <div style={{ margin: "14px 24px 0", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(198,241,53,0.1)", border: "1px solid rgba(198,241,53,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>⭐</div>
                <div>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--lime)", fontWeight: 700, marginBottom: 2 }}>Favourite This Week</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: "var(--white)", letterSpacing: 0.5, lineHeight: 1 }}>{favMuscle.group}</div>
                  <div style={{ fontSize: 11, color: "var(--gray)", marginTop: 3 }}>{favMuscle.sets} sets · {weeklyTotalSets > 0 ? Math.round((favMuscle.sets / weeklyTotalSets) * 100) : 0}% of weekly volume</div>
                </div>
              </div>
            )}

            {weakestMuscle && setsByMuscle.filter(m => m.sets > 0).length > 1 && (
              <div style={{ margin: "10px 24px 0", background: "var(--card)", border: "1px solid rgba(255,140,66,0.2)", borderRadius: 18, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,140,66,0.08)", border: "1px solid rgba(255,140,66,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>⚠️</div>
                <div>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: "var(--orange)", fontWeight: 700, marginBottom: 2 }}>Needs Attention</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: "var(--white)", letterSpacing: 0.5, lineHeight: 1 }}>{weakestMuscle.group}</div>
                  <div style={{ fontSize: 11, color: "var(--gray)", marginTop: 3 }}>Only {weakestMuscle.sets} set{weakestMuscle.sets !== 1 ? "s" : ""} this week — lowest volume group</div>
                </div>
              </div>
            )}

            {topLifts.length > 0 && (
              <div style={{ margin: "14px 24px 0" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: "var(--white)", letterSpacing: 1, marginBottom: 10 }}>BEST IMPROVED LIFTS</div>
                {topLifts.map((lift, i) => (
                  <div key={lift.name} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? "rgba(198,241,53,0.12)" : "var(--surface)", border: `1px solid ${i === 0 ? "rgba(198,241,53,0.3)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: i === 0 ? "var(--lime)" : "var(--gray)", flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--white)", marginBottom: 2 }}>{lift.name}</div>
                      <div style={{ fontSize: 11, color: "var(--gray)" }}>
                        {lift.before}kg → <span style={{ color: "var(--lime)", fontWeight: 700 }}>{lift.after}kg</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "var(--lime)", lineHeight: 1 }}>+{lift.pct}%</div>
                      <div style={{ fontSize: 9, color: "var(--gray)", letterSpacing: 0.5, marginTop: 1 }}>30 DAYS</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {topLifts.length === 0 && (
              <div style={{ margin: "14px 24px 0", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, padding: "16px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: "var(--white)", letterSpacing: 1, marginBottom: 4 }}>BEST IMPROVED LIFTS</div>
                <div style={{ fontSize: 12, color: "var(--gray)" }}>Log the same weighted exercise across multiple sessions to track improvements</div>
              </div>
            )}
          </>
        )}

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

// ─── PROFILE SCREEN ──────────────────────────────────────────────────────────

function ProfileScreen({ stats, profile, updateProfile }) {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const [affirmation] = useState(() => AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);

  const handleSave = () => {
    updateProfile(editForm);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setEditing(false);
  };

  const initials = profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  const memberSince = new Date(profile.joinDate).getFullYear();
  const totalVolumeThisWeek = stats.weeklyVolume.reduce((a, b) => a + b, 0);
  const bmi = profile.weight && profile.height ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) : '—';

  return (
    <div className="screen">
      <div className="scroll-area">
        <div className="profile-hero">
          {/* ── Cyberpunk Avatar ── */}
          <style>{`
            @keyframes cyber-spin { to { transform: rotate(360deg); } }
            @keyframes cyber-spin-rev { to { transform: rotate(-360deg); } }
            @keyframes cyber-pulse {
              0%,100% { opacity:1; filter: drop-shadow(0 0 6px #ffd700) drop-shadow(0 0 12px #ff6b00); }
              50%      { opacity:0.7; filter: drop-shadow(0 0 2px #ffd700); }
            }
            @keyframes cyber-letter-glow {
              0%,100% { text-shadow: 0 0 14px #ffd700, 0 0 28px #ff6b00; }
              50%      { text-shadow: 0 0 6px #ffd700; }
            }
            .cyber-avatar-wrap { position:relative; width:110px; height:110px; }
            .cyber-outer-ring {
              position:absolute; inset:0; border-radius:50%;
              background: conic-gradient(#ffd700 0deg, #ff6b00 60deg, transparent 60deg, transparent 90deg,
                #ffd700 90deg, #ff6b00 150deg, transparent 150deg, transparent 180deg,
                #ffd700 180deg, #ff6b00 240deg, transparent 240deg, transparent 270deg,
                #ffd700 270deg, #ff6b00 330deg, transparent 330deg, transparent 360deg);
              animation: cyber-spin 8s linear infinite;
            }
            .cyber-mask {
              position:absolute; inset:7px; border-radius:50%;
              background:#080510;
            }
            .cyber-inner-ring {
              position:absolute; inset:13px; border-radius:50%;
              border: 1px solid rgba(255,215,0,0.3);
              animation: cyber-spin-rev 12s linear infinite;
            }
            .cyber-inner-ring::before, .cyber-inner-ring::after {
              content:''; position:absolute; background:#ffd700;
              border-radius:2px;
            }
            .cyber-inner-ring::before { width:6px; height:2px; top:-1px; left:50%; transform:translateX(-50%); }
            .cyber-inner-ring::after  { width:6px; height:2px; bottom:-1px; left:50%; transform:translateX(-50%); }
            .cyber-corner-tl, .cyber-corner-tr, .cyber-corner-bl, .cyber-corner-br {
              position:absolute; width:13px; height:13px; border-color:#ffd700; border-style:solid;
            }
            .cyber-corner-tl { top:17px;  left:17px;  border-width:2px 0 0 2px; }
            .cyber-corner-tr { top:17px;  right:17px; border-width:2px 2px 0 0; }
            .cyber-corner-bl { bottom:17px; left:17px;  border-width:0 0 2px 2px; }
            .cyber-corner-br { bottom:17px; right:17px; border-width:0 2px 2px 0; }
            .cyber-center-letter {
              position:absolute; inset:19px; border-radius:50%;
              display:flex; align-items:center; justify-content:center;
              font-family:'Bebas Neue', monospace;
              font-size:2.2rem; font-weight:900;
              color:#ffd700;
              animation: cyber-letter-glow 2s ease-in-out infinite;
            }
            .cyber-avatar-wrap { animation: cyber-pulse 3s ease-in-out infinite; }
          `}</style>
          <div className="cyber-avatar-wrap" style={{ margin: '0 auto 16px' }}>
            <div className="cyber-outer-ring" />
            <div className="cyber-mask" />
            <div className="cyber-inner-ring" />
            <div className="cyber-corner-tl" />
            <div className="cyber-corner-tr" />
            <div className="cyber-corner-bl" />
            <div className="cyber-corner-br" />
            <div className="cyber-center-letter">{initials}</div>
          </div>
          <div className="profile-name">{profile.name || 'SET YOUR NAME'}</div>
          <div className="profile-handle">Member since {memberSince}</div>
          <div className="profile-affirmation">"{affirmation}"</div>
        </div>

        <div className="stats-grid">
          <div className="stats-cell">
            <div className="val">{stats.totalWorkouts}</div>
            <div className="lbl">Workouts</div>
          </div>
          <div className="stats-cell">
            <div className="val">{totalVolumeThisWeek}<span className="unit">t</span></div>
            <div className="lbl">Week Volume</div>
          </div>
          <div className="stats-cell">
            <div className="val">{profile.weight}<span className="unit">kg</span></div>
            <div className="lbl">Body Weight</div>
          </div>
        </div>

        <div className="section-header">
          <div className="section-title">BODY STATS</div>
        </div>

        <div className="info-card">
          <div className="info-row">
            <div className="info-label">Height</div>
            <div className="info-value">{profile.height} cm</div>
          </div>
          <div className="info-row">
            <div className="info-label">Weight</div>
            <div className="info-value">{profile.weight} kg</div>
          </div>
          <div className="info-row">
            <div className="info-label">BMI</div>
            <div className="info-value">{bmi}</div>
          </div>
        </div>

        <div className="section-header">
          <div className="section-title">MEASUREMENTS</div>
        </div>

        <div className="info-card">
          <div className="info-row">
            <div className="info-label">Chest</div>
            <div className="info-value">{profile.measurements.chest} cm</div>
          </div>
          <div className="info-row">
            <div className="info-label">Waist</div>
            <div className="info-value">{profile.measurements.waist} cm</div>
          </div>
          <div className="info-row">
            <div className="info-label">Biceps</div>
            <div className="info-value">{profile.measurements.biceps} cm</div>
          </div>
          <div className="info-row">
            <div className="info-label">Thighs</div>
            <div className="info-value">{profile.measurements.thighs} cm</div>
          </div>
        </div>

        <button className="edit-btn pressable" onClick={() => setEditing(true)}>
          Edit Profile
        </button>

        <div className="section-header">
          <div className="section-title">ACHIEVEMENTS</div>
        </div>

        <div className="ach-grid">
          {ACHIEVEMENTS.filter(a => a.earned).map(a => (
            <div key={a.id} className="ach-badge earned pressable">
              <div className="ach-icon">{a.icon}</div>
              <div className="ach-name">{a.name}</div>
              <div className="ach-desc">{a.desc}</div>
              <div className="ach-earned-tag">✓ EARNED</div>
            </div>
          ))}
          {ACHIEVEMENTS.filter(a => !a.earned).slice(0, 2).map(a => (
            <div key={a.id} className="ach-badge pressable">
              <div className="ach-icon" style={{ filter: "grayscale(1)", opacity: 0.35 }}>{a.icon}</div>
              <div className="ach-name" style={{ color: "#555" }}>{a.name}</div>
              <div className="ach-desc">{a.desc}</div>
              <div className="ach-locked-tag">🔒 LOCKED</div>
            </div>
          ))}
        </div>

        <div style={{ height: 16 }} />
      </div>

      {editing && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Edit Profile</div>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input
                  type="number"
                  className="form-input"
                  value={editForm.height}
                  onChange={(e) => setEditForm({...editForm, height: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  className="form-input"
                  value={editForm.weight}
                  onChange={(e) => setEditForm({...editForm, weight: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Measurements (cm)</label>
                <div className="measurements-grid">
                  <div>
                    <label className="form-label" style={{fontSize: '10px', marginBottom: '4px'}}>Chest</label>
                    <input
                      type="number"
                      className="form-input"
                      value={editForm.measurements.chest}
                      onChange={(e) => setEditForm({...editForm, measurements: {...editForm.measurements, chest: parseInt(e.target.value) || 0}})}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{fontSize: '10px', marginBottom: '4px'}}>Waist</label>
                    <input
                      type="number"
                      className="form-input"
                      value={editForm.measurements.waist}
                      onChange={(e) => setEditForm({...editForm, measurements: {...editForm.measurements, waist: parseInt(e.target.value) || 0}})}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{fontSize: '10px', marginBottom: '4px'}}>Biceps</label>
                    <input
                      type="number"
                      className="form-input"
                      value={editForm.measurements.biceps}
                      onChange={(e) => setEditForm({...editForm, measurements: {...editForm.measurements, biceps: parseInt(e.target.value) || 0}})}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{fontSize: '10px', marginBottom: '4px'}}>Thighs</label>
                    <input
                      type="number"
                      className="form-input"
                      value={editForm.measurements.thighs}
                      onChange={(e) => setEditForm({...editForm, measurements: {...editForm.measurements, thighs: parseInt(e.target.value) || 0}})}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary pressable" onClick={handleCancel}>Cancel</button>
              <button className="btn btn-primary pressable" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// Mount the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ForgeApp />);
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW Registered!', reg))
      .catch(err => console.log('SW Failed', err));
  });
}
