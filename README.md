# Hamilton Consulting Group website

The HCG website: six pages, plain HTML, no build step. Edit a file, commit, push, and GitHub Pages republishes the site within a few minutes.

- **Live site (once GitHub Pages is on):** https://jahoward-ai.github.io/ubiquitous-dollop/
- **Earlier version ("Version A"):** saved on the `version-a` branch, unchanged.

## What each file does

| File | What it is |
|---|---|
| `index.html` | Home |
| `about.html` | Executive Board, membership, governance, Why Hamilton |
| `quill.html` | Quill: the year, students, organizations, skills, past engagements |
| `alumni.html` | Alumni globe and employers |
| `prepare.html` | The profession, recruiting timeline, case interviews, office hours |
| `resources.html` | Presentation archive, case materials, outside resources |
| `join.html` | Ways to join, the request form, common questions |
| `b.css` | The look of every page |
| `b.js` | The top menu, footer, and request form (settings at the top) |
| `assets/alumni-data.js` | Alumni numbers (anonymous counts only) and the live Google Sheet links |
| `assets/alumni.js` | Draws the alumni numbers, employer chart, "Other" list, and globe |
| `assets/photos/`, `assets/board/` | Page photos and Executive Board headshots |
| `files/` | Presentation PDFs |
| `about/`, `quill/`, `events/`, … folders | Redirects so old links from the previous site still work |

## Common tasks

**Swap a photo.** Replace the file in `assets/photos/` with a JPG of the same name. `assets/photos/PHOTO-CREDITS.md` says which is used where.

**Add a board headshot.** Save a square photo as `assets/board/firstname-lastname.jpg` (for example `dan-king.jpg`). It replaces the initials circle automatically.

**Change wording, the board, or a membership detail.** Open the page's `.html` file and edit the text between the tags. Membership and Quill selection wording reflects the mandate; change it only with Executive Board approval.

**Add a presentation.** Put the PDF in `files/` and copy one of the cards in the Presentations section of `resources.html`.

**After changing `b.css` or `b.js`,** raise the `?v=` number where the pages link to them (for example `b.js?v=5` to `b.js?v=6`) so browsers load the new version.

## Live alumni numbers (Google Sheets)

The alumni page can read its numbers straight from Google Sheets each time someone opens it. Names never leave the private sheet: the website only reads a second sheet that holds counts.

1. **Make a new, separate Google Sheet** called "HCG alumni – public counts". Do not publish the private alumni sheet itself.
2. **Add a tab named `Employers`.**
   - In A1 type `Total alumni`. In B1:
     `=COUNTA(IMPORTRANGE("PRIVATE_SHEET_URL","HCG Alumni!A2:A"))`
   - In A2 type `Class years`. In B2:
     `=MIN(IMPORTRANGE("PRIVATE_SHEET_URL","HCG Alumni!C2:C"))&"–"&MAX(IMPORTRANGE("PRIVATE_SHEET_URL","HCG Alumni!C2:C"))`
   - In A3:
     `=QUERY(IMPORTRANGE("PRIVATE_SHEET_URL","HCG Alumni!E2:E"),"select Col1, count(Col1) where Col1 is not null group by Col1 order by count(Col1) desc label count(Col1) ''",0)`
3. **Add a tab named `Cities`.** In A1:
   `=QUERY(IMPORTRANGE("PRIVATE_SHEET_URL","HCG Alumni!F2:F"),"select Col1, count(Col1) where Col1 is not null group by Col1 label count(Col1) ''",0)`
4. Replace `PRIVATE_SHEET_URL` with the private sheet's address, and change `HCG Alumni` to the tab name and the column letters if yours differ (A = first name, C = class year, E = company, F = location). The first time, click **Allow access** on the `#REF!` cell.
5. **Publish only these two tabs:** File → Share → Publish to web → pick `Employers` → Comma-separated values (.csv) → Publish → copy the link. Repeat for `Cities`.
6. Paste the two links into `employersCsv` and `citiesCsv` in `assets/alumni-data.js`, then commit and push.

After that, editing the private sheet updates the website automatically (Google refreshes published sheets within about five minutes). A new city needs its map position added once to `CITY_COORDS` in `assets/alumni.js`; until then it appears in the city list without a globe marker.

## Request form → HCG inbox (Formspree)

By default the request form prepares the message and opens it in Gmail, Outlook, or the visitor's email app. To have it send directly:

1. Go to formspree.io and sign up with **hconsult@hamilton.edu** (submissions go to the account's email; confirm it from the verification email).
2. Click **+ New Form**, name it "HCG requests", and create it.
3. Copy the form endpoint, which looks like `https://formspree.io/f/abcdwxyz`.
4. Paste it into `HCG_FORM_ENDPOINT` at the top of `b.js`, raise the `b.js?v=` number, commit, and push.

The free plan allows 50 submissions a month. If a submission fails, the form falls back to the email options.

## Confidentiality

Preserve the anonymity and disclosure restrictions applied to Quill client work. Do not publish client identities, protected financial information, unapproved figures, or confidential recommendations. Never put alumni names, emails, titles, or LinkedIn links in this repository.
