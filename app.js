const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ─── DATA ───────────────────────────────────────────────────────────────────
// (Keeping your WORKOUTS and INITIAL_STATS as defined in the source)
const INITIAL_STATS = {
  streak: 0,
  workoutsThisWeek: 0,
  totalWorkouts: 0,
  activeHoursThisWeek: 0,
  weight: 0,
  weeklyVolume: [], // Stores volume per session
};

const ACHIEVEMENTS = [
  { id: 1, icon: "🏆", name: "Century Club", desc: "Complete 100 workouts", earned: false },
  { id: 2, icon: "💪", name: "Strong Start", desc: "First workout completed", earned: false },
  { id: 3, icon: "💎", name: "Diamond Lifter", desc: "250 total workouts", earned: false },
  { id: 4, icon: "⚡", name: "Speed Demon", desc: "5 workouts in a week", earned: false },
  { id: 5, icon: "🦁", name: "Iron Lion", desc: "Lift 10,000kg total", earned: false },
  { id: 6, icon: "🌙", name: "Night Owl", desc: "Workout after 10pm", earned: false },
];

// ─── LOCAL STORAGE HELPERS ──────────────────────────────────────────────────

function loadProfile() {
  const saved = localStorage.getItem('forgeProfile');
  return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
}

function saveProfile(profile) {
  localStorage.setItem('forgeProfile', JSON.stringify(profile));
}

function loadWorkoutStats() {
  const saved = localStorage.getItem('forgeStats');
  return saved ? JSON.parse(saved) : INITIAL_STATS;
}

function saveWorkoutStats(stats) {
  localStorage.setItem('forgeStats', JSON.stringify(stats));
}

function loadAchievements() {
  const saved = localStorage.getItem('forgeAchievements');
  return saved ? JSON.parse(saved) : ACHIEVEMENTS;
}

function saveAchievements(ach) {
  localStorage.setItem('forgeAchievements', JSON.stringify(ach));
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────

function ForgeApp() {
  const [screen, setScreen] = useState('home');
  const [profile, setProfile] = useState(() => loadProfile());
  const [stats, setStats] = useState(() => loadWorkoutStats());
  const [achievements, setAchievements] = useState(() => loadAchievements());
  const [activeWorkout, setActiveWorkout] = useState(null);

  // Persistence Effects: Saves data automatically when state changes
  useEffect(() => saveProfile(profile), [profile]);
  useEffect(() => saveWorkoutStats(stats), [stats]);
  useEffect(() => saveAchievements(achievements), [achievements]);

  const handleFinishWorkout = (timeInSeconds) => {
    const hoursSpent = timeInSeconds / 3600;
    const now = new Date();
    const hourOfFinish = now.getHours();

    // Fix: Calculate volume by removing "kg" from weight strings
    const sessionVolume = activeWorkout.exercises.reduce((total, ex) => {
      const weightNum = (typeof ex.weight === 'string') 
        ? parseInt(ex.weight.replace(/[^0-9]/g, '')) || 0 
        : ex.weight || 0;
      return total + (ex.sets * ex.reps * weightNum);
    }, 0);

    // Update Stats
    const updatedStats = {
      ...stats,
      totalWorkouts: stats.totalWorkouts + 1,
      workoutsThisWeek: stats.workoutsThisWeek + 1,
      activeHoursThisWeek: stats.activeHoursThisWeek + hoursSpent,
      weeklyVolume: [...(stats.weeklyVolume || []), sessionVolume],
      streak: stats.streak + 1
    };
    setStats(updatedStats);

    // Fix: Update all 6 achievements
    setAchievements(prev => prev.map(ach => {
      if (ach.earned) return ach;
      
      let isEarned = false;
      const totalVolumeToDate = updatedStats.weeklyVolume.reduce((a, b) => a + b, 0);

      switch(ach.id) {
        case 1: isEarned = updatedStats.totalWorkouts >= 100; break; 
        case 2: isEarned = updatedStats.totalWorkouts >= 1; break;   
        case 3: isEarned = updatedStats.totalWorkouts >= 250; break; 
        case 4: isEarned = updatedStats.workoutsThisWeek >= 5; break; 
        case 5: isEarned = totalVolumeToDate >= 10000; break;        
        case 6: isEarned = (hourOfFinish >= 22 || hourOfFinish < 4); break; 
      }
      return isEarned ? { ...ach, earned: true } : ach;
    }));

    setScreen('home');
    setActiveWorkout(null);
  };

  // Rendering logic for Profile Screen
  const ProfileScreen = () => {
    const totalVolume = stats.weeklyVolume.reduce((a, b) => a + b, 0);
    
    return (
      <div className="screen">
        {/* ... Profile Hero ... */}
        <div className="stats-grid">
          <div className="stats-cell">
            <div className="val">{updatedStats.totalWorkouts}</div>
            <div className="lbl">Workouts</div>
          </div>
          <div className="stats-cell">
            <div className="val">
              {Math.round(totalVolume).toLocaleString()}
              <span className="unit">kg</span>
            </div>
            <div className="lbl">Weekly Volume</div>
          </div>
          <div className="stats-cell">
             <div className="val">{stats.streak}</div>
             <div className="lbl">Day Streak</div>
          </div>
        </div>
        {/* ... Rest of Screen ... */}
      </div>
    );
  };

  // ... rest of your UI code ...
}
