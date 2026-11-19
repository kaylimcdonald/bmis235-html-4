/* =========================================================
   progress.js — shared by every page.
   Saves your progress in this browser with localStorage
   (a small key/value store built into every browser).
   Nothing is sent anywhere; clearing browser data resets it.
   ========================================================= */
const Progress = (function () {
  const KEY = "pathfinder-progress-v1";

  // The shape of the saved data, with empty starting values.
  function blank() {
    return {
      minutes: {},        // { "2026-11-19": 25, ... } minutes studied per day
      active: {},         // { "2026-11-19": true } any study activity that day
      sessions: [],       // [{ id, date, minutes, label }]
      quizBest: null,     // best quiz score out of 10
      quizRuns: 0,
      puzzlesSolved: [],  // ids of solved path puzzles
      lessonsRead: []     // ids of lesson sections marked as read
    };
  }

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      return Object.assign(blank(), saved || {});
    } catch (e) {
      return blank(); // storage blocked or broken: start fresh
    }
  }

  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
  }

  // "YYYY-MM-DD" in local time
  function dayKey(d) {
    d = d || new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  // Run a change on the saved data and store it again.
  function change(fn) {
    const data = load();
    fn(data);
    data.active[dayKey()] = true; // any change counts as studying today
    save(data);
    return data;
  }

  // Days in a row with activity, counting back from today
  // (or from yesterday, if you haven't studied yet today).
  function streak() {
    const data = load();
    const d = new Date();
    if (!data.active[dayKey(d)]) d.setDate(d.getDate() - 1);
    let count = 0;
    while (data.active[dayKey(d)]) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }

  // Minutes studied over the last 7 days, including today.
  function weekMinutes() {
    const data = load();
    let total = 0;
    const d = new Date();
    for (let i = 0; i < 7; i++) {
      total += data.minutes[dayKey(d)] || 0;
      d.setDate(d.getDate() - 1);
    }
    return total;
  }

  return { load, change, dayKey, streak, weekMinutes };
})();
