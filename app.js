const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ─── DATA ───────────────────────────────────────────────────────────────────

const WORKOUTS = [
  {
    id: 1,
    name: "UPPER BODY POWER",
    category: "Push Day",
    emoji: "🏋️",
    duration: 52,
    calories: 480,
    difficulty: "Advanced",
    color: "#C6F135",
    bg: "linear-gradient(160deg, #1a2a0a, #2d4a10)",
    exercises: [
      { id: 1, name: "Warm-up Push-ups", sets: 2, reps: 15, rest: 30, weight: "BW" },
      { id: 2, name: "Incline Dumbbell Press", sets: 3, reps: 10, rest: 60, weight: "30kg" },
      { id: 3, name: "Bench Press", sets: 4, reps: 8, rest: 90, weight: "80kg" },
      { id: 4, name: "Cable Fly", sets: 3, reps: 12, rest: 60, weight: "35kg" },
      { id: 5, name: "Tricep Pushdown", sets: 3, reps: 15, rest: 45, weight: "25kg" },
      { id: 6, name: "Overhead Press", sets: 4, reps: 6, rest: 90, weight: "60kg" },
      { id: 7, name: "Lateral Raises", sets: 3, reps: 15, rest: 45, weight: "12kg" },
      { id: 8, name: "Cooldown Stretch", sets: 1, reps: 1, rest: 0, weight: "—" },
    ],
  },
  {
    id: 2,
    name: "LEG DESTROYER",
    category: "Leg Day",
    emoji: "🦵",
    duration: 55,
    calories: 620,
    difficulty: "Advanced",
    color: "#C6F135",
    bg: "linear-gradient(160deg, #1a2a0a, #0a1a0a)",
    exercises: [
      { id: 1, name: "Squat Warm-up", sets: 2, reps: 20, rest: 30, weight: "BW" },
      { id: 2, name: "Back Squat", sets: 5, reps: 5, rest: 120, weight: "100kg" },
      { id: 3, name: "Romanian Deadlift", sets: 4, reps: 8, rest: 90, weight: "80kg" },
      { id: 4, name: "Leg Press", sets: 3, reps: 12, rest: 60, weight: "140kg" },
      { id: 5, name: "Walking Lunges", sets: 3, reps: 16, rest: 60, weight: "20kg" },
      { id: 6, name: "Leg Curl", sets: 3, reps: 12, rest: 45, weight: "40kg" },
    ],
  },
  {
    id: 3,
    name: "DEEP STRETCH",
    category: "Recovery",
    emoji: "🧘",
    duration: 20,
    calories: 120,
    difficulty: "All Levels",
    color: "#7B9FFF",
    bg: "linear-gradient(160deg, #1a1a2a, #101030)",
    exercises: [
      { id: 1, name: "Hip Flexor Stretch", sets: 1, reps: 1, rest: 60, weight: "—" },
      { id: 2, name: "Hamstring Stretch", sets: 1, reps: 1, rest: 60, weight: "—" },
      { id: 3, name: "Pigeon Pose", sets: 1, reps: 1, rest: 90, weight: "—" },
      { id: 4, name: "Child's Pose", sets: 1, reps: 1, rest: 60, weight: "—" },
      { id: 5, name: "Spinal Twist", sets: 1, reps: 1, rest: 60, weight: "—" },
    ],
  },
  {
    id: 4,
    name: "BURN & BUILD",
    category: "HIIT",
    emoji: "⚡",
    duration: 30,
    calories: 390,
    difficulty: "Intermediate",
    color: "#FF8C42",
    bg: "linear-gradient(160deg, #2a1a0a, #3d1000)",
    exercises: [
      { id: 1, name: "Burpees", sets: 4, reps: 10, rest: 30, weight: "BW" },
      { id: 2, name: "Box Jumps", sets: 4, reps: 8, rest: 45, weight: "BW" },
      { id: 3, name: "Mountain Climbers", sets: 3, reps: 20, rest: 30, weight: "BW" },
      { id: 4, name: "Kettlebell Swings", sets: 3, reps: 15, rest: 45, weight: "24kg" },
      { id: 5, name: "Jump Rope", sets: 3, reps: 1, rest: 30, weight: "—" },
    ],
  },
];

const INITIAL_STATS = {
  streak: 14,
  workoutsThisWeek: 5,
  totalWorkouts: 142,
  caloriesThisWeek: 2400,
  activeHoursThisWeek: 4.2,
  weight: 89,
  weeklyVolume: [40, 65, 30, 72, 50, 20, 58],
};

const ACHIEVEMENTS = [
  { id: 1, icon: "🏆", name: "Century Club", desc: "Complete 100 workouts", earned: true },
  { id: 2, icon: "🔥", name: "On Fire", desc: "14-day streak", earned: true },
  { id: 3, icon: "💎", name: "Diamond Lifter", desc: "250 total workouts", earned: false },
  { id: 4, icon: "⚡", name: "Speed Demon", desc: "5 workouts in a week", earned: false },
  { id: 5, icon: "🦁", name: "Iron Lion", desc: "Lift 10,000kg total", earned: false },
  { id: 6, icon: "🌙", name: "Night Owl", desc: "Workout after 10pm", earned: false },
];

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

  /* ── PROFILE SCREEN ── */
  .profile-hero {
    padding: 10px 24px 20px;
    background: linear-gradient(180deg, #161616 0%, var(--black) 100%);
    display: flex; flex-direction: column; align-items: center; text-align: center;
    flex-shrink: 0;
  }

  .profile-settings-btn {
    align-self: flex-end;
    width: 38px; height: 38px; border-radius: 12px;
    background: var(--card);
    display: flex; align-items: center; justify-content: center;
    border: 1px solid var(--border);
    cursor: pointer; transition: border-color 0.15s, transform 0.15s;
  }

  .profile-settings-btn:active { transform: scale(0.88); border-color: var(--lime); }

  .profile-avatar-ring {
    width: 84px; height: 84px; border-radius: 50%;
    padding: 3px;
    margin: 10px 0 8px;
    position: relative;
  }

  .profile-avatar-inner {
    width: 100%; height: 100%; border-radius: 50%;
    background: linear-gradient(135deg, #333, #222);
    display: flex; align-items: center; justify-content: center;
    border: 3px solid var(--black);
    font-family: 'Bebas Neue', sans-serif;
    font-size: 30px; color: var(--white);
  }

  .profile-name { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: var(--white); letter-spacing: 1px; }
  .profile-handle { font-size: 13px; color: var(--gray); margin: 2px 0 8px; }

  .profile-level {
    background: rgba(198,241,53,0.1); border: 1px solid rgba(198,241,53,0.25);
    border-radius: 20px; padding: 5px 14px;
    font-size: 11px; font-weight: 700; color: var(--lime);
    letter-spacing: 1px; text-transform: uppercase;
  }

  .stats-grid {
    display: grid; grid-template-columns: 1fr 1fr 1fr;
    gap: 1px; background: var(--border);
    margin: 14px 24px 0; border-radius: 16px;
    overflow: hidden; border: 1px solid var(--border);
    flex-shrink: 0;
  }

  .stats-cell { background: var(--card); padding: 14px 8px; text-align: center; }
  .stats-cell .val { font-family: 'Bebas Neue', sans-serif; font-size: 26px; color: var(--white); line-height: 1; }
  .stats-cell .unit { font-size: 10px; color: var(--lime); font-weight: 600; }
  .stats-cell .lbl { font-size: 10px; color: var(--gray); margin-top: 3px; }

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
  .ach-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 24px 8px; }
  .ach-badge {
    background: var(--card); border-radius: 14px;
    padding: 14px 10px; text-align: center;
    border: 1px solid var(--border);
    display: flex; flex-direction: column; align-items: center; gap: 5px;
    cursor: pointer; transition: border-color 0.2s, transform 0.15s;
  }
  .ach-badge:active { transform: scale(0.95); }
  .ach-badge.earned { border-color: rgba(198,241,53,0.25); background: rgba(198,241,53,0.05); }
  .ach-badge:hover.earned { border-color: rgba(198,241,53,0.5); }
  .ach-icon { font-size: 28px; }
  .ach-name { font-size: 12px; font-weight: 700; color: var(--white); line-height: 1.2; }
  .ach-desc { font-size: 10px; color: var(--gray); line-height: 1.3; text-align: center; }
  .ach-earned-tag { font-size: 9px; color: var(--lime); font-weight: 700; letter-spacing: 0.5px; }
  .ach-locked-tag { font-size: 9px; color: #555; font-weight: 600; }

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
  const [stats, setStats] = useState(INITIAL_STATS);
  const [chartPeriod, setChartPeriod] = useState("W");
  const [filterCategory, setFilterCategory] = useState("All");

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
      setStats(s => ({
        ...s,
        streak: s.streak + 1,
        workoutsThisWeek: Math.min(s.workoutsThisWeek + 1, 7),
        totalWorkouts: s.totalWorkouts + 1,
        caloriesThisWeek: s.caloriesThisWeek + activeWorkout.calories,
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
  }, [activeWorkout, setDone]);

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
    setStats(s => ({
      ...s,
      totalWorkouts: s.totalWorkouts + 1,
      weeklyVolume: s.weeklyVolume.map((v, i) => i === 6 ? v + 10 : v),
    }));
  }, []);

  const formatTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const formatDuration = s => `${Math.floor(s / 60)}m ${s % 60}s`;

  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const maxBar = Math.max(...stats.weeklyVolume);
  const categories = ["All", "Strength", "HIIT", "Recovery"];
  const categoryMap = { "Strength": ["Push Day", "Leg Day"], "HIIT": ["HIIT"], "Recovery": ["Recovery"] };
  const filteredWorkouts = filterCategory === "All" ? WORKOUTS : WORKOUTS.filter(w => (categoryMap[filterCategory] || []).includes(w.category));

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
          <div className="status-bar">
            <span>{clock.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false })}</span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="#F0F0F0">
                <rect x="0" y="4" width="3" height="8" rx="0.5"/>
                <rect x="4" y="2.5" width="3" height="9.5" rx="0.5"/>
                <rect x="8" y="1" width="3" height="11" rx="0.5"/>
                <rect x="12" y="0" width="3" height="12" rx="0.5"/>
              </svg>
              <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                <rect x="0.5" y="0.5" width="19" height="11" rx="2" stroke="#F0F0F0" strokeOpacity="0.4"/>
                <rect x="20" y="3.5" width="3" height="5" rx="1" fill="#F0F0F0" fillOpacity="0.4"/>
                <rect x="1.5" y="1.5" width="15" height="9" rx="1.5" fill="#F0F0F0"/>
              </svg>
            </div>
          </div>

          {tab === "home" && <HomeScreen stats={stats} onStartWorkout={startWorkout} onNavigate={setTab} />}
          {tab === "explore" && <ExploreScreen workouts={filteredWorkouts} categories={categories} filterCategory={filterCategory} setFilterCategory={setFilterCategory} onStartWorkout={startWorkout} />}
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
          {tab === "progress" && <ProgressScreen stats={stats} chartPeriod={chartPeriod} setChartPeriod={setChartPeriod} days={days} maxBar={maxBar} />}
          {tab === "profile" && <ProfileScreen stats={stats} />}

          {tab !== "workout" && (
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

function HomeScreen({ stats, onStartWorkout, onNavigate }) {
  const todayWorkout = WORKOUTS[0];
  return (
    <div className="screen">
      <div className="scroll-area">
        <div className="home-header">
          <div className="home-greeting">
            <div className="hey">Good morning 👋</div>
            <div className="name">MARCUS</div>
          </div>
          <div className="avatar-btn pressable" onClick={() => onNavigate("profile")}>M</div>
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
              <span>🔥 {todayWorkout.calories} kcal</span>
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
            <div className="stat-val">{stats.workoutsThisWeek}<span className="stat-unit"> /6</span></div>
            <div className="stat-lbl">Workouts</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-val">{(stats.caloriesThisWeek / 1000).toFixed(1)}<span className="stat-unit">k</span></div>
            <div className="stat-lbl">Calories</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱</div>
            <div className="stat-val">{stats.activeHoursThisWeek}<span className="stat-unit">h</span></div>
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

function ExploreScreen({ workouts, categories, filterCategory, setFilterCategory, onStartWorkout }) {
  const tagColors = { "Push Day": "#C6F135", "Leg Day": "#C6F135", "Recovery": "#7B9FFF", "HIIT": "#FF8C42" };
  return (
    <div className="screen">
      <div className="explore-header">
        <div className="explore-title">WORKOUTS</div>
        <div className="explore-sub">{workouts.length} programs available</div>
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
                <span>🔥 {w.calories} kcal</span>
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
            <div className="complete-stat">
              <div className="val">{workoutPartial ? Math.round(workout.calories * totalSetsDone / totalSets) : workout.calories}</div>
              <div className="lbl">Calories</div>
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

function ProgressScreen({ stats, chartPeriod, setChartPeriod, days, maxBar }) {
  return (
    <div className="screen">
      <div className="scroll-area">
        <div className="section-header" style={{ paddingTop: 14 }}>
          <div className="section-title">PROGRESS</div>
        </div>

        <div className="stats-grid" style={{ margin: "0 24px" }}>
          <div className="stats-cell">
            <div className="val">{stats.totalWorkouts}</div>
            <div className="lbl">Total Workouts</div>
          </div>
          <div className="stats-cell">
            <div className="val">{stats.streak}<span className="unit">🔥</span></div>
            <div className="lbl">Day Streak</div>
          </div>
          <div className="stats-cell">
            <div className="val">{stats.weight}<span className="unit">kg</span></div>
            <div className="lbl">Body Weight</div>
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-header">
            <div className="chart-title">WEEKLY VOLUME</div>
            <div className="chart-tabs">
              {["W", "M", "Y"].map(p => (
                <button key={p} className={`chart-tab pressable ${chartPeriod === p ? "active" : ""}`} onClick={() => setChartPeriod(p)}>{p}</button>
              ))}
            </div>
          </div>
          <div className="bar-chart">
            {stats.weeklyVolume.map((v, i) => {
              const h = Math.round((v / maxBar) * 68);
              const isToday = i === 6;
              return (
                <div key={i} className="bar-col">
                  <div className={`bar ${isToday ? "today" : "regular"}`} style={{ height: h }} />
                  <div className={`bar-day ${isToday ? "today" : ""}`}>{days[i]}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="section-header" style={{ paddingTop: 16 }}>
          <div className="section-title">THIS WEEK</div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">💪</div>
            <div className="stat-val">{stats.workoutsThisWeek}<span className="stat-unit">/6</span></div>
            <div className="stat-lbl">Workouts</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-val">{(stats.caloriesThisWeek / 1000).toFixed(1)}<span className="stat-unit">k</span></div>
            <div className="stat-lbl">Calories</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱</div>
            <div className="stat-val">{stats.activeHoursThisWeek}<span className="stat-unit">h</span></div>
            <div className="stat-lbl">Active</div>
          </div>
        </div>

        <div className="section-header" style={{ paddingTop: 16 }}>
          <div className="section-title">ACHIEVEMENTS</div>
        </div>

        <div className="ach-grid">
          {ACHIEVEMENTS.map(a => (
            <div key={a.id} className={`ach-badge pressable ${a.earned ? "earned" : ""}`}>
              <div className="ach-icon" style={!a.earned ? { filter: "grayscale(1)", opacity: 0.35 } : {}}>{a.icon}</div>
              <div className="ach-name" style={!a.earned ? { color: "#555" } : {}}>{a.name}</div>
              <div className="ach-desc">{a.desc}</div>
              {a.earned
                ? <div className="ach-earned-tag">✓ EARNED</div>
                : <div className="ach-locked-tag">🔒 LOCKED</div>
              }
            </div>
          ))}
        </div>
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}

// ─── PROFILE SCREEN ──────────────────────────────────────────────────────────

function ProfileScreen({ stats }) {
  const ringAngle = (stats.streak / 30) * 360;
  return (
    <div className="screen">
      <div className="scroll-area">
        <div className="profile-hero">
          <div className="profile-settings-btn pressable">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          </div>
          <div className="profile-avatar-ring" style={{ background: `conic-gradient(#C6F135 0deg ${ringAngle}deg, #2A2A2A ${ringAngle}deg 360deg)` }}>
            <div className="profile-avatar-inner">M</div>
          </div>
          <div className="profile-name">MARCUS COLE</div>
          <div className="profile-handle">@iron_marcus · Member since 2023</div>
          <div className="profile-level">⚡ Level 12 · Warrior</div>
        </div>

        <div className="stats-grid">
          <div className="stats-cell">
            <div className="val">{stats.totalWorkouts}</div>
            <div className="lbl">Workouts</div>
          </div>
          <div className="stats-cell">
            <div className="val">{stats.streak}<span className="unit">🔥</span></div>
            <div className="lbl">Day Streak</div>
          </div>
          <div className="stats-cell">
            <div className="val">{stats.weight}<span className="unit">kg</span></div>
            <div className="lbl">Body Weight</div>
          </div>
        </div>

        <div className="section-header" style={{ paddingTop: 18 }}>
          <div className="section-title">RECENT ACHIEVEMENTS</div>
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

        <div style={{ margin: "14px 24px 0" }}>
          <div style={{ background: "var(--card)", borderRadius: 16, padding: "16px 18px", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 1 }}>LEVEL PROGRESS</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#C6F135" }}>12 → 13</div>
            </div>
            <div style={{ background: "#222", borderRadius: 6, height: 8, overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(to right, #C6F135, #9DC420)", width: "72%", height: "100%", borderRadius: 6 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <div style={{ fontSize: 11, color: "#888" }}>3,600 XP earned</div>
              <div style={{ fontSize: 11, color: "#888" }}>5,000 XP needed</div>
            </div>
          </div>
        </div>

        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}

// Mount the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ForgeApp />);