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
    ],
  },
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
  name: "Athlete",
  height: 180,
  weight: 75,
  measurements: { chest: 100, waist: 80, biceps: 38, thighs: 58 },
  joinDate: new Date().toISOString(),
};

const ACHIEVEMENTS_LIST = [
  { id: 1, icon: "🏆", name: "Century Club", desc: "Complete 100 workouts", earned: false },
  { id: 2, icon: "💪", name: "Strong Start", desc: "First workout completed", earned: false },
  { id: 3, icon: "💎", name: "Diamond Lifter", desc: "250 total workouts", earned: false },
  { id: 4, icon: "⚡", name: "Speed Demon", desc: "5 workouts in a week", earned: false },
  { id: 5, icon: "🦁", name: "Iron Lion", desc: "Lift 10,000kg total", earned: false },
  { id: 6, icon: "🌙", name: "Night Owl", desc: "Workout after 10pm", earned: false },
];

// ─── LOCAL STORAGE HELPERS ──────────────────────────────────────────────────

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
  const [achievements, setAchievements] = useState(() => storage.load('forgeAchievements', ACHIEVEMENTS_LIST));
  const [activeWorkout, setActiveWorkout] = useState(null);

  // Sync state to LocalStorage
  useEffect(() => storage.save('forgeProfile', profile), [profile]);
  useEffect(() => storage.save('forgeStats', stats), [stats]);
  useEffect(() => storage.save('forgeAchievements', achievements), [achievements]);

  const handleFinishWorkout = (timeInSeconds) => {
    const hoursSpent = timeInSeconds / 3600;
    const now = new Date();
    const hourOfFinish = now.getHours();

    // Volume calculation (removes "kg" from string)
    const sessionVolume = activeWorkout.exercises.reduce((acc, ex) => {
      const w = (typeof ex.weight === 'string') ? parseInt(ex.weight.replace(/\D/g, '')) || 0 : ex.weight || 0;
      return acc + (ex.sets * ex.reps * w);
    }, 0);

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

  return (
    <div className="app-shell" style={{ background: '#080808', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* ── SCREEN: HOME ── */}
      {screen === 'home' && (
        <div className="screen">
          <header style={{ padding: '24px' }}>
            <div style={{ color: '#888', fontSize: '12px' }}>Welcome back,</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '32px' }}>{profile.name}</div>
          </header>

          <div className="stats-row" style={{ display: 'flex', gap: '10px', padding: '0 24px' }}>
             <div style={{ flex: 1, background: '#111', padding: '15px', borderRadius: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontFamily: 'Bebas Neue' }}>{stats.totalWorkouts}</div>
                <div style={{ fontSize: '10px', color: '#888' }}>WORKOUTS</div>
             </div>
             <div style={{ flex: 1, background: '#111', padding: '15px', borderRadius: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontFamily: 'Bebas Neue' }}>{stats.activeHoursThisWeek.toFixed(1)}h</div>
                <div style={{ fontSize: '10px', color: '#888' }}>ACTIVE TIME</div>
             </div>
             <div style={{ flex: 1, background: '#111', padding: '15px', borderRadius: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontFamily: 'Bebas Neue' }}>{stats.streak}</div>
                <div style={{ fontSize: '10px', color: '#888' }}>STREAK</div>
             </div>
          </div>

          <div style={{ padding: '24px' }}>
            <h3 style={{ fontFamily: 'Bebas Neue', letterSpacing: '1px' }}>START WORKOUT</h3>
            {WORKOUTS.map(w => (
              <div key={w.id} onClick={() => { setActiveWorkout(w); setScreen('workout'); }}
                style={{ background: w.bg, padding: '20px', borderRadius: '20px', marginBottom: '12px', cursor: 'pointer' }}>
                <div style={{ fontSize: '24px' }}>{w.emoji}</div>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: '20px' }}>{w.name}</div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>{w.duration} MIN • {w.difficulty}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SCREEN: WORKOUT (Simplified for logic test) ── */}
      {screen === 'workout' && activeWorkout && (
        <div className="screen" style={{ padding: '24px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '40px' }}>{activeWorkout.name}</h2>
          <div style={{ margin: '40px 0', fontSize: '18px', color: '#C6F135' }}>Workout in Progress...</div>
          <button 
            onClick={() => handleFinishWorkout(3000)} // Simulates 50 min workout
            style={{ background: '#C6F135', color: '#000', border: 'none', padding: '20px', borderRadius: '15px', fontFamily: 'Bebas Neue', width: '100%' }}>
            FINISH WORKOUT
          </button>
        </div>
      )}

      {/* ── SCREEN: PROFILE ── */}
      {screen === 'profile' && (
        <div className="screen" style={{ padding: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#C6F135', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '30px', fontFamily: 'Bebas Neue' }}>
              {profile.name[0]}
            </div>
            <h2 style={{ fontFamily: 'Bebas Neue', marginTop: '10px' }}>{profile.name}</h2>
          </div>
          
          <h3 style={{ fontFamily: 'Bebas Neue' }}>ACHIEVEMENTS</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {achievements.map(a => (
              <div key={a.id} style={{ background: '#111', padding: '15px', borderRadius: '15px', opacity: a.earned ? 1 : 0.3, border: a.earned ? '1px solid #C6F135' : '1px solid #222' }}>
                <div style={{ fontSize: '24px' }}>{a.icon}</div>
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{a.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── NAVIGATION ── */}
      <nav style={{ marginTop: 'auto', display: 'flex', background: '#111', padding: '15px 0', borderTop: '1px solid #222' }}>
        <div onClick={() => setScreen('home')} style={{ flex: 1, textAlign: 'center', opacity: screen === 'home' ? 1 : 0.5 }}>🏠</div>
        <div onClick={() => setScreen('profile')} style={{ flex: 1, textAlign: 'center', opacity: screen === 'profile' ? 1 : 0.5 }}>👤</div>
      </nav>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ForgeApp />);
