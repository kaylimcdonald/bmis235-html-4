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

<!-- Write this part in your own words. These are the three things you said help you learn.
     Explain how each page uses them, and give a real example from your own studying. -->
- **Seeing it work live:** _…the playground and inspector on the Learn page…_
- **Quizzing myself:** _…instant feedback that explains why, and puzzles that accept any correct path…_
- **Short timed sessions:** _…the Focus timer, the streak, and the progress cards on Home…_

## By hand vs by AI

**Made by AI (Claude, Anthropic):** the first version of every file: `index.html`, `learn.html`,
`practice.html`, `focus.html`, `styles.css`, `js/progress.js`, `js/learn.js`, `js/practice.js`,
`js/focus.js`, and the three SVG images in `img/`. Claude also wrote the lesson text, the quiz questions and
this README outline.

**By hand:** _list everything you wrote or changed yourself, e.g. the "Built for how I learn" section,
changes made after classmate testing, wording or colour edits._

**I can explain every piece:** _add a sentence or two showing this, e.g. how `new URL()` checks a puzzle answer,
or why the timer saves an end time instead of counting down._

## How I checked my work

- [ ] Clicked every menu link on all 4 pages on the live site
- [ ] Every image loads on the live site (the logo, `site-map.svg`, `sample-photo.svg`)
- [ ] Checked every quiz answer and explanation against MDN
      ([`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a),
      [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img))
- [ ] Solved all 6 path puzzles, and tried wrong answers to see the feedback
- [ ] Ran a full focus session and checked that it was logged
- [ ] Tested on my phone
- _add anything else you checked_

## Classmate testing (Path 1 classmate)

- **Tester:** _name_
- **What they tried:** _…_
- **Their feedback:** _…_
- **What I changed because of it:** _… (link the commit)_

## Deploying

Plain HTML, CSS and JS with no build step.
On Cloudflare, go to **Workers & Pages → Create → Pages → Connect to Git**, then pick this repo.
Set the framework preset to **None**, leave the build command empty, and set the output directory to `/`.
