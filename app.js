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
  name: "Forge User",
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
  try {
    const saved = localStorage.getItem('forgeProfile');
    if (!saved) return DEFAULT_PROFILE;
    const parsed = JSON.parse(saved);
    // Deep merge to ensure measurements object exists
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      measurements: { ...DEFAULT_PROFILE.measurements, ...(parsed.measurements || {}) }
    };
  } catch (e) {
    return DEFAULT_PROFILE;
  }
}

function saveProfile(profile) {
  localStorage.setItem('forgeProfile', JSON.stringify(profile));
}

function loadWorkoutStats() {
  try {
    const saved = localStorage.getItem('forgeStats');
    return saved ? { ...INITIAL_STATS, ...JSON.parse(saved) } : INITIAL_STATS;
  } catch (e) {
    return INITIAL_STATS;
  }
}

function saveWorkoutStats(stats) {
  localStorage.setItem('forgeStats', JSON.stringify(stats));
}

// ... ACHIEVEMENTS, EXERCISE_LIBRARY, MUSCLE_META, css constants ...

function ForgeApp() {
  // Use safe loading to prevent crashes on startup
  const [profile, setProfile] = useState(() => loadProfile());
  const [stats, setStats] = useState(() => loadWorkoutStats());
  const [activeTab, setActiveTab] = useState('home');
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  // Sync editForm if profile changes
  useEffect(() => {
    setEditForm(profile);
  }, [profile]);

  const handleSave = () => {
    saveProfile(editForm);
    setProfile(editForm);
    setIsEditingProfile(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditingProfile(false);
  };

  // ... rest of your existing component logic ...

  return (
    <div className="app-container">
      <style>{css}</style>
      
      {/* ... your rendering logic ... */}

      {/* FIXED: Measurement Inputs with safety checks */}
      {isEditingProfile && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header"><h2 className="modal-title">Edit Profile</h2></div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Chest (cm)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={editForm.measurements?.chest || 0} 
                  onChange={(e) => setEditForm({...editForm, measurements: {...editForm.measurements, chest: parseInt(e.target.value) || 0}})}
                />
              </div>
              {/* Repeat for other fields with the ?. optional chaining */}
            </div>
            <div className="modal-actions">
               <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
               <button className="btn btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Ensure DOM is ready and React is defined
window.onload = () => {
    if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
        const rootElement = document.getElementById('root');
        if (rootElement) {
            const root = ReactDOM.createRoot(rootElement);
            root.render(<ForgeApp />);
        }
    } else {
        console.error("React not found. Ensure CDN scripts are loaded correctly.");
    }
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
          // Force update if new worker is found
          reg.onupdatefound = () => {
              const installingWorker = reg.installing;
              installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                      window.location.reload(); 
                  }
              };
          };
      })
      .catch(err => console.log('SW Failed', err));
  });
}
