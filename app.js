const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ─── DATA & CONSTANTS ───────────────────────────────────────────────────────

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
  // ... other workouts omitted for brevity, keep yours as they were
];

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

const INITIAL_STATS = {
  streak: 0,
  workoutsThisWeek: 0,
  totalWorkouts: 0,
  activeHoursThisWeek: 0,
  weight: 0,
  weeklyVolume: [],
};

// ─── SAFE STORAGE HELPERS ──────────────────────────────────────────────────

function loadSafeProfile() {
  try {
    const saved = localStorage.getItem('forgeProfile');
    if (!saved) return DEFAULT_PROFILE;
    const parsed = JSON.parse(saved);
    // Merge logic: ensures if 'measurements' is missing in old data, app doesn't crash
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      measurements: { ...DEFAULT_PROFILE.measurements, ...(parsed.measurements || {}) }
    };
  } catch (e) {
    console.error("Failed to load profile", e);
    return DEFAULT_PROFILE;
  }
}

function loadSafeStats() {
  try {
    const saved = localStorage.getItem('forgeStats');
    if (!saved) return INITIAL_STATS;
    return { ...INITIAL_STATS, ...JSON.parse(saved) };
  } catch (e) {
    return INITIAL_STATS;
  }
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────

function ForgeApp() {
  const [profile, setProfile] = useState(() => loadSafeProfile());
  const [stats, setStats] = useState(() => loadSafeStats());
  const [activeTab, setActiveTab] = useState('home');
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  // Sync edit form when profile updates
  useEffect(() => {
    setEditForm(profile);
  }, [profile]);

  const handleSave = () => {
    localStorage.setItem('forgeProfile', JSON.stringify(editForm));
    setProfile(editForm);
    setIsEditingProfile(false);
  };

  // ─── RENDER SAFETY ───
  // Use optional chaining (?.) everywhere we access measurements
  const chestVal = editForm.measurements?.chest || 0;
  const waistVal = editForm.measurements?.waist || 0;
  const bicepsVal = editForm.measurements?.biceps || 0;
  const thighsVal = editForm.measurements?.thighs || 0;

  return (
    <div className="app-container">
      {/* ... Your Style and UI Logic ... */}
      
      {isEditingProfile && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Profile</h3>
            <div className="form-group">
              <label>Chest (cm)</label>
              <input 
                type="number" 
                value={chestVal} 
                onChange={(e) => setEditForm({
                  ...editForm, 
                  measurements: { ...editForm.measurements, chest: parseInt(e.target.value) || 0 }
                })} 
              />
            </div>
            {/* Add other inputs similarly using the safety variables above */}
            <div className="modal-actions">
               <button onClick={() => setIsEditingProfile(false)}>Cancel</button>
               <button onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MOUNTING WITH ERROR CATCHING ──────────────────────────────────────────

const mountApp = () => {
  const container = document.getElementById('root');
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<ForgeApp />);
  }
};

// Check if DOM is ready
if (document.readyState === 'complete') {
  mountApp();
} else {
  window.addEventListener('load', mountApp);
}

// Service Worker Logic
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(err => console.error(err));
}
