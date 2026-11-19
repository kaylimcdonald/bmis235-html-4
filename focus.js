/* =========================================================
   focus.js: Focus timer page
   The timer saves the time it should END, not a countdown
   number, so it stays accurate even if the tab sleeps.
   Finished (or stopped) sessions are saved with progress.js.
   ========================================================= */
{
  const clock = document.getElementById("clock");
  const ring = document.getElementById("ring");
  const lengthSel = document.getElementById("length");
  const labelIn = document.getElementById("label");
  const startBtn = document.getElementById("start");
  const stopBtn = document.getElementById("stop");
  const msg = document.getElementById("timer-msg");

  let endsAt = null;      // timestamp (ms) when the session ends
  let pausedLeft = null;  // ms left while paused
  let startedWith = 0;    // full session length in ms
  let tick = null;
  let audio = null;

  function fmt(ms) {
    const s = Math.max(0, Math.round(ms / 1000));
    return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  }

  function show(msLeft) {
    clock.textContent = fmt(msLeft);
    ring.style.width = startedWith ? ((1 - msLeft / startedWith) * 100) + "%" : "0";
    document.title = (endsAt ? fmt(msLeft) + " · " : "") + "Path Finder · Focus";
  }

  function update() {
    const left = endsAt - Date.now();
    if (left <= 0) return finish(true);
    show(left);
  }

  // A short beep made in the browser, so no sound file is needed.
  function chime() {
    if (!audio) return;
    [0, 0.25, 0.5].forEach(function (delay) {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.2, audio.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + delay + 0.2);
      osc.connect(gain).connect(audio.destination);
      osc.start(audio.currentTime + delay);
      osc.stop(audio.currentTime + delay + 0.22);
    });
  }

  startBtn.addEventListener("click", function () {
    // Browsers only allow sound after a click, so set it up here.
    try { audio = audio || new AudioContext(); } catch (e) { audio = null; }

    if (endsAt) {                       // running → pause
      pausedLeft = endsAt - Date.now();
      endsAt = null;
      clearInterval(tick);
      startBtn.textContent = "Resume";
      msg.textContent = "Paused.";
      return;
    }
    if (pausedLeft === null) {          // fresh start
      startedWith = Number(lengthSel.value) * 60000;
      pausedLeft = startedWith;
    }
    endsAt = Date.now() + pausedLeft;   // start or resume
    pausedLeft = null;
    tick = setInterval(update, 250);
    update();
    startBtn.textContent = "Pause";
    stopBtn.disabled = false;
    lengthSel.disabled = true;
    msg.textContent = "Focus time. You've got this.";
  });

  stopBtn.addEventListener("click", function () { finish(false); });

  // completed = true when the timer ran out, false when Stop was pressed
  function finish(completed) {
    clearInterval(tick);
    const left = endsAt ? endsAt - Date.now() : (pausedLeft || 0);
    const minutes = completed ? startedWith / 60000 : Math.floor((startedWith - Math.max(0, left)) / 60000);
    endsAt = null;
    pausedLeft = null;
    startBtn.textContent = "Start";
    stopBtn.disabled = true;
    lengthSel.disabled = false;

    if (minutes >= 1) {
      Progress.change(function (d) {
        const day = Progress.dayKey();
        d.minutes[day] = (d.minutes[day] || 0) + minutes;
        d.sessions.unshift({ id: Date.now(), date: day, minutes: minutes, label: labelIn.value.trim() || "Study session" });
        d.sessions = d.sessions.slice(0, 200); // keep the log a sensible size
      });
      msg.textContent = (completed ? "Session done! " : "Stopped. ") + minutes + " min logged. Take a short break.";
    } else {
      msg.textContent = "Stopped before a full minute, so nothing was logged.";
    }
    if (completed) chime();
    startedWith = Number(lengthSel.value) * 60000;
    show(startedWith);
    startedWith = 0;
    ring.style.width = "0";
    renderLog();
  }

  lengthSel.addEventListener("change", function () {
    clock.textContent = fmt(Number(lengthSel.value) * 60000);
  });

  /* ---------- Study log ---------- */
  function renderLog() {
    const data = Progress.load();
    document.getElementById("today").textContent = data.minutes[Progress.dayKey()] || 0;
    document.getElementById("streak").textContent = Progress.streak();

    // Last 7 days as horizontal bars (oldest at top).
    const days = [];
    const d = new Date();
    d.setDate(d.getDate() - 6);
    for (let i = 0; i < 7; i++) {
      days.push({ name: d.toLocaleDateString(undefined, { weekday: "short" }), mins: data.minutes[Progress.dayKey(d)] || 0 });
      d.setDate(d.getDate() + 1);
    }
    const most = Math.max(30, ...days.map(function (x) { return x.mins; }));
    document.getElementById("bars").innerHTML = days.map(function (x) {
      return "<div class=\"day-bar\"><span>" + x.name + "</span><div class=\"track\"><div class=\"fill\" style=\"width:" + (x.mins / most * 100) + "%\"></div></div><span class=\"mins\">" + x.mins + " min</span></div>";
    }).join("");

    // Recent sessions, newest first, each with a delete button.
    const log = document.getElementById("log");
    log.innerHTML = "";
    if (!data.sessions.length) {
      log.innerHTML = "<li>No sessions yet. Start your first one!</li>";
      return;
    }
    data.sessions.slice(0, 10).forEach(function (s) {
      const li = document.createElement("li");
      const text = document.createElement("span");
      text.textContent = s.date + " · " + s.label + " · " + s.minutes + " min";
      const del = document.createElement("button");
      del.type = "button";
      del.textContent = "Delete";
      del.setAttribute("aria-label", "Delete session " + s.label + " on " + s.date);
      del.addEventListener("click", function () {
        Progress.change(function (d2) {
          d2.sessions = d2.sessions.filter(function (x) { return x.id !== s.id; });
          d2.minutes[s.date] = Math.max(0, (d2.minutes[s.date] || 0) - s.minutes);
        });
        renderLog();
      });
      li.append(text, del);
      log.appendChild(li);
    });
  }

  clock.textContent = fmt(Number(lengthSel.value) * 60000);
  renderLog();
}
