/* =========================================================
   learn.js: Learn page
   1. "I get it" checkboxes save which sections you've read.
   2. Live playground: the textarea's HTML is shown in an iframe.
   3. Inspector: lists each <a> and <img>, shows where its path
      really points, and warns about common mistakes.
   ========================================================= */
{
  /* ---------- 1. Lesson checkboxes ---------- */
  const read = Progress.load().lessonsRead;
  document.querySelectorAll("[data-lesson]").forEach(function (box) {
    box.checked = read.includes(box.dataset.lesson);
    box.addEventListener("change", function () {
      Progress.change(function (data) {
        const id = box.dataset.lesson;
        data.lessonsRead = data.lessonsRead.filter(function (x) { return x !== id; });
        if (box.checked) data.lessonsRead.push(id);
      });
    });
  });

  /* ---------- 2. Playground ---------- */
  const presets = {
    "Links": [
      "<h1>My site</h1>",
      "<nav>",
      "  <a href=\"index.html\">Home</a> |",
      "  <a href=\"practice.html\">Practice</a> |",
      "  <a href=\"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a\" target=\"_blank\">MDN: the a tag</a> |",
      "  <a href=\"#contact\">Jump to contact</a>",
      "</nav>",
      "<p style=\"margin-top:420px\" id=\"contact\">Contact section is down here.</p>"
    ].join("\n"),
    "Images": [
      "<h1>Images</h1>",
      "<img src=\"img/sample-photo.svg\" alt=\"Mountains under an orange sun\" width=\"300\">",
      "",
      "<p>A clickable logo:</p>",
      "<a href=\"index.html\"><img src=\"img/logo.svg\" alt=\"Path Finder home\" width=\"60\"></a>"
    ].join("\n"),
    "Find the bugs": [
      "<h1>Something is broken...</h1>",
      "<img src=\"Img/Sample-Photo.svg\" alt=\"Mountains\" width=\"300\">",
      "<img src=\"img\\logo.svg\" width=\"60\">",
      "<p><a href=\"www.github.com\">My GitHub</a></p>",
      "<p><a href=\"pages/about.html\">About me</a></p>"
    ].join("\n"),
    "Blank": ""
  };

  const code = document.getElementById("code");
  const frame = document.getElementById("preview");
  const note = document.getElementById("click-note");
  const list = document.getElementById("inspector");
  const presetBox = document.getElementById("presets");

  Object.keys(presets).forEach(function (name) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = name;
    b.addEventListener("click", function () { code.value = presets[name]; render(); });
    presetBox.appendChild(b);
  });

  // The folder this page lives in, e.g. https://site.pages.dev/
  const siteFolder = new URL(".", location.href).href;

  // Turn a full URL back into something readable for the inspector.
  function describe(url) {
    if (url.protocol === "mailto:") return "an email to " + url.pathname;
    if (url.href.startsWith(siteFolder)) return "your site folder → " + (decodeURI(url.href.slice(siteFolder.length)) || "(the folder itself)");
    if (url.origin === location.origin) return "outside your site folder: " + url.pathname;
    return "another website: " + url.href;
  }

  // Safe text for the inspector list
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c];
    });
  }

  // Warnings that apply to any path (href or src)
  function pathWarnings(value) {
    const w = [];
    if (value.includes("\\")) w.push("Uses a backslash \\. URLs need forward slashes /. Some browsers quietly fix it, but don't rely on that.");
    if (value.includes(" ")) w.push("Has a space. Rename the file with a hyphen instead.");
    if (/^[a-z]:[\\/]/i.test(value) || value.startsWith("file:")) w.push("This is a path on your own computer. Nobody else can open it.");
    if (/^www\./i.test(value)) w.push("Starts with www. but has no https://, so the browser treats it as a file on your own site.");
    if (value.startsWith("/") && !value.startsWith("//")) w.push("Starts with /, so it begins at the domain root. That breaks on GitHub Pages project sites.");
    if (!/^(https?:|mailto:|#)/i.test(value) && /[A-Z]/.test(value)) w.push("Has capital letters. Servers are case-sensitive, so it must match the file name exactly.");
    return w;
  }

  let renderId = 0;
  function render() {
    const html = code.value;
    frame.srcdoc = html;
    note.textContent = "";

    // Parse the code separately so the inspector works even if the iframe can't be read.
    const doc = new DOMParser().parseFromString(html, "text/html");
    const items = [];
    const thisRender = ++renderId;

    doc.querySelectorAll("a").forEach(function (a) {
      const href = a.getAttribute("href");
      const text = a.textContent.trim() || "(no text, maybe an image)";
      const warnings = [];
      let where = "";
      let url = null;
      if (href === null) {
        warnings.push("Missing href, so it goes nowhere.");
      } else if (href.startsWith("#")) {
        const id = decodeURIComponent(href.slice(1));
        where = "a section on this page with id=\"" + id + "\"";
        if (!doc.getElementById(id)) warnings.push("No element has id=\"" + id + "\".");
      } else {
        url = new URL(href, location.href);
        where = describe(url);
        warnings.push.apply(warnings, pathWarnings(href));
      }
      if (a.getAttribute("target") === "_blank") where += " (opens in a new tab)";
      items.push({ kind: "a", label: text, attr: "href=\"" + (href ?? "") + "\"", where: where, warnings: warnings, url: url });
    });

    doc.querySelectorAll("img").forEach(function (img) {
      const src = img.getAttribute("src");
      const warnings = [];
      let where = "";
      if (src === null || src === "") warnings.push("Missing src, so there's no image to show.");
      else {
        where = describe(new URL(src, location.href));
        warnings.push.apply(warnings, pathWarnings(src));
      }
      const alt = img.getAttribute("alt");
      let altNote = "";
      if (alt === null) warnings.push("Missing alt. Add a short description, or alt=\"\" if it's only decoration.");
      else if (alt === "") altNote = "alt=\"\": decorative, so screen readers skip it.";
      else altNote = "alt: “" + alt + "”";
      items.push({ kind: "img", label: altNote, attr: "src=\"" + (src ?? "") + "\"", where: where, warnings: warnings, src: src });
    });

    if (/<\/img>/i.test(html)) {
      items.push({ kind: "note", label: "", attr: "</img>", where: "", warnings: ["<img> is a void element: delete the </img> closing tag."] });
    }

    list.innerHTML = items.length ? "" : "<li>No links or images yet. Try adding one.</li>";
    items.forEach(function (it) {
      const li = document.createElement("li");
      const tag = it.kind === "a" ? "&lt;a&gt;" : it.kind === "img" ? "&lt;img&gt;" : "Note";
      li.innerHTML =
        "<span class=\"tag\">" + tag + "</span> <code>" + esc(it.attr) + "</code>" +
        (it.label ? "<br>" + esc(it.label) : "") +
        (it.where ? "<br>Points to: " + esc(it.where) : "") +
        "<br><span class=\"status\">" +
        (it.warnings.length ? it.warnings.map(function (w) { return "<span class=\"warn\">⚠ " + esc(w) + "</span>"; }).join("<br>") : "<span class=\"ok\">✓ Looks good</span>") +
        "</span>";
      list.appendChild(li);

      // For links to pages on this site, ask the server whether the page exists.
      if (it.kind === "a" && it.url && it.url.origin === location.origin && it.url.href.startsWith(siteFolder) && location.protocol.startsWith("http")) {
        fetch(it.url.href, { method: "HEAD" }).then(function (res) {
          if (thisRender !== renderId) return;
          if (!res.ok) { const good = li.querySelector(".status .ok"); if (good) good.remove(); }
          li.insertAdjacentHTML("beforeend", res.ok
            ? "<br><span class=\"ok\">✓ That page exists</span>"
            : "<br><span class=\"warn\">✗ No page exists at this path (" + res.status + ")</span>");
        }).catch(function () { /* offline: say nothing */ });
      }

      // For images, actually try to load the file and report the result.
      if (it.kind === "img" && it.src) {
        const test = new Image();
        test.onload = function () {
          if (thisRender !== renderId) return;
          li.insertAdjacentHTML("beforeend", "<br><span class=\"ok\">✓ The image file loaded</span>");
        };
        test.onerror = function () {
          if (thisRender !== renderId) return;
          const good = li.querySelector(".status .ok"); if (good) good.remove();
          li.insertAdjacentHTML("beforeend", "<br><span class=\"warn\">✗ The image file was not found at this path</span>");
        };
        test.src = new URL(it.src, location.href).href;
      }
    });
  }

  // Clicking a link inside the preview: explain instead of leaving the page.
  frame.addEventListener("load", function () {
    try {
      const inner = frame.contentDocument;
      inner.addEventListener("click", function (e) {
        const a = e.target.closest("a");
        if (!a) return;
        e.preventDefault();
        const href = a.getAttribute("href");
        if (href && href.startsWith("#")) {
          const target = inner.getElementById(decodeURIComponent(href.slice(1)));
          if (target) target.scrollIntoView({ behavior: "smooth" });
          note.textContent = target ? "Jumped to id=\"" + href.slice(1) + "\" on the same page." : "No element with id=\"" + href.slice(1) + "\" to jump to.";
          return;
        }
        note.textContent = href === null ? "This link has no href." : "This link would go to " + describe(new URL(href, location.href)) + ".";
      });
    } catch (err) {
      note.textContent = "Tip: open this site through a web server (like the live link) so link clicks can be explained.";
    }
  });

  // Update the preview shortly after you stop typing.
  let timer;
  code.addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(render, 250);
  });

  code.value = presets["Links"];
  render();
}
