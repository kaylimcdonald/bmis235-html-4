/* =========================================================
   practice.js: Practice page
   1. Quiz: 10 random questions from the bank below, one at a
      time, with an explanation after every answer.
   2. Path puzzles: the browser's own URL rules (new URL)
      check your typed path, so any correct path is accepted.
   ========================================================= */
{
  /* ---------- 1. Quiz ---------- */
  // answer = the index of the correct choice (counting from 0)
  const bank = [
    { q: "Which attribute tells an <a> tag where to go?",
      choices: ["src", "href", "link", "alt"], answer: 1,
      why: "href (hypertext reference) holds the link's destination. src is for images and other embedded files." },
    { q: "Which <img> tag is written correctly?",
      choices: ["<img href=\"img/dog.jpg\" alt=\"Brown dog\">", "<img src=\"img/dog.jpg\">Brown dog</img>", "<img src=\"img/dog.jpg\" alt=\"Brown dog catching a frisbee\">", "<image src=\"img/dog.jpg\" alt=\"Brown dog\">"], answer: 2,
      why: "<img> uses src for the file and alt for the description. It's a void element, so there's no </img>." },
    { q: "What is the alt attribute for?",
      choices: ["It makes the image load faster", "It describes the image for screen readers and shows if the image can't load", "It sets the image's size", "It shows a tooltip when you hover"], answer: 1,
      why: "Screen readers read alt out loud, and browsers show it when the image is missing. Hover tooltips come from the title attribute." },
    { q: "about.html and index.html are in the same folder. From about.html, which href links to the home page?",
      choices: ["index.html", "../index.html", "/about/index.html", "C:/site/index.html"], answer: 0,
      why: "For a file in the same folder, the path is just the file name." },
    { q: "You're editing pages/contact.html. The image is in img/photo.jpg, at the top of the site. Which src works?",
      choices: ["img/photo.jpg", "../img/photo.jpg", "pages/img/photo.jpg", "./photo.jpg"], answer: 1,
      why: "First ../ goes up out of the pages folder to the site's top level. Then img/photo.jpg goes down into img." },
    { q: "In a file path, what does ../ mean?",
      choices: ["The current folder", "Go up one folder", "The root of the hard drive", "Go to the previous page in history"], answer: 1,
      why: ".. is the parent folder, one level up from the file you're in. A single . means the current folder." },
    { q: "Your image works on your laptop but is broken on the live site. The file is Photo.JPG and your code says photo.jpg. Why?",
      choices: ["GitHub doesn't support JPG files", "Web servers are case-sensitive, so Photo.JPG and photo.jpg are different files", "You need an absolute URL", "The alt text is missing"], answer: 1,
      why: "Windows and macOS usually ignore capitalization, but web servers don't. Use lowercase file names to avoid this." },
    { q: "How do you make a link open in a new tab?",
      choices: ["new=\"tab\"", "target=\"_blank\"", "href=\"_blank\"", "open=\"new\""], answer: 1,
      why: "target=\"_blank\" opens the link in a new tab or window." },
    { q: "Which one is an absolute URL?",
      choices: ["img/logo.png", "../about.html", "https://developer.mozilla.org", "contact.html"], answer: 2,
      why: "An absolute URL includes the scheme (https://) and the domain. The others are relative paths." },
    { q: "Which link jumps to <section id=\"contact\"> on the same page?",
      choices: ["<a href=\"contact\">", "<a href=\"#contact\">", "<a href=\".contact\">", "<a id=\"#contact\">"], answer: 1,
      why: "A # followed by an id jumps to the element with that id. (.contact is CSS syntax for a class.)" },
    { q: "An image is pure decoration, like a squiggly divider. What alt should it have?",
      choices: ["alt=\"image\"", "Leave alt out completely", "alt=\"\" (empty)", "alt=\"decoration.png\""], answer: 2,
      why: "An empty alt tells screen readers to skip the image. Without any alt, some screen readers read the file name instead." },
    { q: "What happens with <a href=\"www.github.com\">?",
      choices: ["It opens GitHub", "The browser treats it as a relative path to a file on your own site", "It opens GitHub in a new tab", "The browser adds https:// for you"], answer: 1,
      why: "Without https://, \"www.github.com\" looks like a file name, so the browser looks for it in your own site's folder." }
  ];

  const qEl = document.getElementById("quiz-question");
  const optEl = document.getElementById("quiz-options");
  const fbEl = document.getElementById("quiz-feedback");
  const nextBtn = document.getElementById("quiz-next");
  const countEl = document.getElementById("quiz-count");
  const barEl = document.getElementById("quiz-bar");
  const box = document.getElementById("quiz-box");

  let round = [], index = 0, score = 0;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startQuiz() {
    round = shuffle(bank).slice(0, 10);
    index = 0;
    score = 0;
    box.querySelectorAll(".quiz-end").forEach(function (n) { n.remove(); });
    [qEl, optEl, countEl].forEach(function (n) { n.hidden = false; });
    showQuestion();
  }

  function showQuestion() {
    const item = round[index];
    countEl.textContent = "Question " + (index + 1) + " of " + round.length + " · Score " + score;
    barEl.style.width = (index / round.length * 100) + "%";
    qEl.textContent = item.q;  // textContent shows the < > characters as plain text
    optEl.innerHTML = "";
    fbEl.hidden = true;
    nextBtn.hidden = true;
    item.choices.forEach(function (choice, i) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = choice;
      b.addEventListener("click", function () { answer(i); });
      optEl.appendChild(b);
    });
  }

  function answer(i) {
    const item = round[index];
    const buttons = optEl.querySelectorAll("button");
    buttons.forEach(function (b) { b.disabled = true; });
    buttons[item.answer].classList.add("right");
    const correct = i === item.answer;
    if (correct) score++;
    else buttons[i].classList.add("wrong");
    fbEl.hidden = false;
    fbEl.innerHTML = "";
    const head = document.createElement("strong");
    head.className = correct ? "ok" : "warn";
    head.textContent = correct ? "Correct! " : "Not quite. ";
    fbEl.append(head, document.createTextNode(item.why));
    nextBtn.textContent = index === round.length - 1 ? "See my score" : "Next question";
    nextBtn.hidden = false;
    nextBtn.focus();
  }

  nextBtn.addEventListener("click", function () {
    index++;
    if (index < round.length) return showQuestion();

    // End of the quiz: save the best score.
    const data = Progress.change(function (d) {
      d.quizRuns++;
      if (d.quizBest === null || score > d.quizBest) d.quizBest = score;
    });
    barEl.style.width = "100%";
    [qEl, optEl, fbEl, nextBtn, countEl].forEach(function (n) { n.hidden = true; });
    const end = document.createElement("div");
    end.className = "quiz-end";
    end.innerHTML = "<p class=\"stat\">" + score + "/10</p><p>" +
      (score >= 9 ? "Excellent. You know your paths." : score >= 6 ? "Good work. Reread the sections you missed, then try again." : "Keep going. Try the Learn page playground, then take the quiz again.") +
      " Best score: " + data.quizBest + "/10.</p>";
    const again = document.createElement("button");
    again.className = "btn";
    again.type = "button";
    again.textContent = "Take a new quiz";
    again.addEventListener("click", startQuiz);
    end.appendChild(again);
    box.appendChild(end);
  });

  startQuiz();

  /* ---------- 2. Path puzzles ---------- */
  const puzzles = [
    { id: "p1", from: "index.html", to: "about.html", hint: "Both files are in the same folder." },
    { id: "p2", from: "index.html", to: "img/logo.png", hint: "Go down into the img folder." },
    { id: "p3", from: "pages/contact.html", to: "index.html", hint: "Go up one folder with ../" },
    { id: "p4", from: "pages/contact.html", to: "img/logo.png", hint: "Go up one folder, then down into img." },
    { id: "p5", from: "pages/projects/garden.html", to: "styles.css", hint: "You're two folders deep, so go up twice: ../../" },
    { id: "p6", from: "pages/projects/garden.html", to: "img/team/maya.jpg", hint: "Up two folders, then down through img and team." }
  ];

  // A pretend website address, used only to check answers.
  const SITE = "https://my-site.test/";
  const solved = Progress.load().puzzlesSolved;
  const holder = document.getElementById("puzzle-list");

  puzzles.forEach(function (p, n) {
    const card = document.createElement("div");
    card.className = "card puzzle" + (solved.includes(p.id) ? " solved" : "");
    card.innerHTML =
      "<strong>" + (n + 1) + ".</strong> You're editing <code>" + p.from + "</code>. Write the path to <code>" + p.to + "</code>." +
      "<form><label class=\"visually-hidden\" for=\"in-" + p.id + "\">Path</label>" +
      "<input id=\"in-" + p.id + "\" autocomplete=\"off\" autocapitalize=\"off\" spellcheck=\"false\" placeholder=\"type a path\">" +
      "<button class=\"btn\" type=\"submit\">Check</button>" +
      "<button class=\"btn ghost\" type=\"button\" data-hint>Hint</button></form>" +
      "<p class=\"click-note\" aria-live=\"polite\">" + (solved.includes(p.id) ? "<span class=\"ok\">✓ Solved</span>" : "") + "</p>";
    holder.appendChild(card);

    const input = card.querySelector("input");
    const msg = card.querySelector(".click-note");
    card.querySelector("[data-hint]").addEventListener("click", function () { msg.textContent = "Hint: " + p.hint; });

    card.querySelector("form").addEventListener("submit", function (e) {
      e.preventDefault(); // the form has nowhere to send, so stay on the page
      const typed = input.value.trim();
      const goal = new URL(p.to, SITE).href;
      let reply, ok = false;

      if (!typed) reply = "Type a path first.";
      else if (typed.includes("\\")) reply = "Use forward slashes (/), not backslashes (\\).";
      else if (/^[a-z]+:/i.test(typed)) reply = "That's an absolute URL or a computer path. Use a relative path instead.";
      else if (typed.startsWith("/")) reply = "Starting with / goes to the domain root, which breaks on GitHub Pages project sites. Write it without the leading slash.";
      else if (typed.split("/").filter(function (s) { return s === ".."; }).length > p.from.split("/").length - 1) {
        // More ../ than folders to climb out of: it would leave the site folder.
        reply = "Too many ../ steps. That climbs above your site folder.";
      }
      else {
        // Let the browser work out where the path really goes.
        const landed = new URL(typed, new URL(p.from, SITE)).href;
        if (landed === goal) { ok = true; reply = "✓ Correct!"; }
        else if (landed.toLowerCase() === goal.toLowerCase()) reply = "Almost. Check the capitalization: servers are case-sensitive.";
        else if (landed.startsWith(SITE)) reply = "That path lands on " + landed.slice(SITE.length) + ". Try again.";
        else reply = "That path goes outside the site. Try again.";
      }

      msg.innerHTML = "";
      const span = document.createElement("span");
      span.className = ok ? "ok" : "warn";
      span.textContent = reply;
      msg.appendChild(span);

      if (ok) {
        card.classList.add("solved");
        Progress.change(function (d) { if (!d.puzzlesSolved.includes(p.id)) d.puzzlesSolved.push(p.id); });
      }
    });
  });
}
