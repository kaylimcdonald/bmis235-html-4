# Path Finder: BMIS 235 HTML-4 Final Site

**Live site:** _https://bmis235-html-4.kmcdonald4.workers.dev/_
**Path:** 3 · Full build

## Concept

Path Finder is a learning tool for one HTML-1 to HTML-3 concept: **links, images, and file paths**
(`<a href>`, `<img src alt>`, relative paths, `../`). Those three things cause most broken links and missing
images on class websites.

| Page | What it does |
|---|---|
| `index.html` | Home page with your progress: streak, minutes studied, lessons read, quiz best, puzzles solved |
| `learn.html` | Four short lessons, plus a **live playground**. You edit HTML and see the result as you type. An inspector shows where each path points, warns about common mistakes, and checks whether each image loads. |
| `practice.html` | A 10-question quiz with an explanation after every answer, plus 6 **path puzzles** where you type a path between two files |
| `focus.html` | A focus timer (10/15/25/45 min) that logs each session, shows the last 7 days, and keeps a streak |

All four pages share the same menu and `styles.css`. Images are in `img/`. JavaScript is in `js/`.
Progress is saved in the browser with `localStorage`, so nothing is sent anywhere.

## Built for how I learn

<!-- The three things that help me learn is visuals, quizzes, and just imply setting a timer that can track how long I focus for so that I can review my notes and the material that I need to learn. The learn page shows the material and adds visuals so that I can truly understand how the information is applicable. The practice page quizzes me, so that I can realize what I know, and the concepts that I need to spend more time on. The focus page just has a timer with a few different lengths of time so that I can track how much time I'm spending on certain classes or studying certain subjects. -->
- **Seeing how it works visually:** _…the playground and inspector on the Learn page…_
- **Quizzing myself:** _…instant feedback that explains why, and puzzles that accept any correct path…_
- **Timed study sessions:** _…the Focus timer, the streak, and the progress cards on Home…_

## By hand vs by AI

**Made by AI (Claude, Anthropic):** the first version of every file: `index.html`, `learn.html`,
`practice.html`, `focus.html`, `styles.css`, `js/progress.js`, `js/learn.js`, `js/practice.js`,
`js/focus.js`, and the three SVG images in `img/`. Claude also wrote the lesson text, the quiz questions and
this README outline.

**By hand:**
- Created the GitHub repo, uploaded the site, and put it on Cloudflare (also had to turn on the workers.dev address so the site changed to public)
- Chose a more aesthetic color scheme and changed the color codes in `styles.css`
- Changed link and progress-number colors to the dark brown so they're more legible on a white background
- Change the logo colors and home-page diagram to match (`img/logo.svg`, `img/site-map.svg`)
- Renamed the site to "Link Lab" in the tab title and menu on the different pages, and in the Focus timer's tab title
- Wrote my own footer and applied it to each of the 4 pages
- Rewrote the home page headline and intro
- Added new quiz questions to `js/practice.js`: Claude suggested them, and I made sure that they were questions that were necessary and relevant for the content that is taught on the page
- Replaced the Focus timer's suggestions with my current classes this semester
- Wrote the "Built for how I learn", "I can explain every piece" and "How I checked my work" sections of this README

**I can explain every piece:** One piece on my website that I can explain is why file names should be lowercase for images to be able to work and appear on the page. I learned that on Windows and Mac, capital letters are usually ignored, so lowercase and uppercase letters often are treated as the same file. However, it may show up as broken on the live side because Cloudflare usually treats them differently. You need to make sure to fix the file names to lowercase, and that the HTML matches the file exactly. This also shows up on my site's Learn page in the "Common mistakes" table, which is a quiz question to make sure that others don't make the same mistake. 

## How I checked my work

- [x] Clicked each menu link on all 4 pages on the live site to check to make sure they work
- [x] Made sure that every image loads on the live site (the logo, `site-map.svg`, `sample-photo.svg`)
- [x] Checked the quiz answers and explanations
      ([`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a),
      [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img))
- [x] Solved the 6 path puzzles, and looked at the feedback given for wrong answers
- [x] Tried a focus session and checked that it was tracked after I completed it
- [x] Tested the page on my phone

## Classmate testing (Path 1 classmate)

- **Tester:** _name_
- **What they tried:** _…_
- **Their feedback:** _…_
- **What I changed because of it:** _… (link the commit)_

## Deploying

Plain HTML, CSS and JS with no build step.
On Cloudflare, go to **Workers & Pages → Create → Pages → Connect to Git**, then pick this repo.
Set the framework preset to **None**, leave the build command empty, and set the output directory to `/`.
