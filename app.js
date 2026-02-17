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
        { id: 1, name: "Hip Flexor", muscle: "Other", sets: 1, reps: 1, rest: 60, weight: "—" },
        { id: 2, name: "Hamstring",  muscle: "Legs",  sets: 1, reps: 1, rest: 60, weight: "—" },
        { id: 3, name: "Pigeon Pose", muscle: "Other", sets: 1, reps: 1, rest: 90, weight: "—" },
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
        { id: 1, name: "Burpees",   muscle: "Cardio", sets: 4, reps: 10, rest: 30, weight: "BW"  },
        { id: 2, name: "Box Jumps", muscle: "Cardio", sets: 4, reps: 8,  rest: 45, weight: "BW"  },
      ],
    }
];

const INITIAL_STATS = {
  streak: 0,
  workoutsThisWeek: 0,
  totalWorkouts: 0,
  activeHoursThisWeek: 0,
  weight: 75,
  weeklyVolume: [],
};

const DEFAULT_PROFILE = {
  name: "User",
  height: 180,
  weight: 75,
  measurements: { chest: 100, waist: 80, biceps: 38, thighs: 58 },
  joinDate: new Date().toISOString(),
};

const ACHIEVEMENTS_DATA = [
  { id: 1, icon: "🏆", name: "Century Club", desc: "Complete 100 workouts", earned: false },
  { id: 2, icon: "💪", name: "Strong Start", desc: "First workout completed", earned: false },
  { id: 3, icon: "💎", name: "Diamond Lifter", desc: "250 total workouts", earned: false },
  { id: 4, icon: "⚡", name: "Speed Demon", desc: "5 workouts in a week", earned: false },
  { id: 5, icon: "🦁", name: "Iron Lion", desc: "Lift 10,000kg total", earned: false },
  { id: 6, icon: "🌙", name: "Night Owl", desc: "Workout after 10pm", earned: false },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────

const storage = {
  save: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
  load: (key, fallback) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  }
};

// ─── MAIN APP ───────────────────────────────────────────────────────────────

function ForgeApp() {
  const [screen, setScreen] = useState('home');
  const [profile, setProfile] = useState(() => storage.load('forgeProfile', DEFAULT_PROFILE));
  const [stats, setStats] = useState(() => storage.load('forgeStats', INITIAL_STATS));
  const [achievements, setAchievements] = useState(() => storage.load('forgeAchievements', ACHIEVEMENTS_DATA));
  const [activeWorkout, setActiveWorkout] = useState(null);

  // Auto-save whenever data changes
  useEffect(() => storage.save('forgeProfile', profile), [profile]);
  useEffect(() => storage.save('forgeStats', stats), [stats]);
  useEffect(() => storage.save('forgeAchievements', achievements), [achievements]);

  const handleFinishWorkout = (timeInSeconds) => {
    const hoursSpent = timeInSeconds / 3600;
    const hourOfFinish = new Date().getHours();

    // Calculate Volume (kg)
    const sessionVolume = activeWorkout.exercises.reduce((acc, ex) => {
      const weight = (typeof ex.weight === 'string') 
        ? parseInt(ex.weight.replace(/[^0-9]/g, '')) || 0 
        : ex.weight || 0;
      return acc + (ex.sets * ex.reps * weight);
    }, 0);

    // Update Stats
    const newStats = {
      ...stats,
      totalWorkouts: stats.totalWorkouts + 1,
      workoutsThisWeek: stats.workoutsThisWeek + 1,
      activeHoursThisWeek: stats.activeHoursThisWeek + hoursSpent,
      weeklyVolume: [...(stats.weeklyVolume || []), sessionVolume],
      streak: stats.streak + 1
    };
    setStats(newStats);

    // Update Achievements
    setAchievements(prev => prev.map(ach => {
      if (ach.earned) return ach;
      let earned = false;
      const totalVol = newStats.weeklyVolume.reduce((a, b) => a + b, 0);

      if (ach.id === 1) earned = newStats.totalWorkouts >= 100;
      if (ach.id === 2) earned = newStats.totalWorkouts >= 1;
      if (ach.id === 3) earned = newStats.totalWorkouts >= 250;
      if (ach.id === 4) earned = newStats.workoutsThisWeek >= 5;
      if (ach.id === 5) earned = totalVol >= 10000;
      if (ach.id === 6) earned = (hourOfFinish >= 22 || hourOfFinish < 4);

      return earned ? { ...ach, earned: true } : ach;
    }));

    setActiveWorkout(null);
    setScreen('home');
  };

  // Screen Logic simplified for readability
  return (
    <div className="app-container">
      {/* Your UI Components here, passing stats and profile as props */}
      {screen === 'home' && <div>Welcome {profile.name}! Workouts: {stats.totalWorkouts}</div>}
      {/* Add your existing Nav and Screen components here */}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ForgeApp />);
