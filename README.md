# Hamilton Consulting Group website

Two versions of the HCG site live in this repository so they can be compared:

| Version | Where it is | What it is |
|---|---|---|
| **A** | the main folder (`index.html`, `about/`, `quill/`, …) | The current site with the Group Managing Partner's review fixes, photos, and usability improvements. |
| **B** | `redesign/` | A leaner redesign: 6 pages instead of 15, a "Where are you starting from?" chooser, and a 3D alumni globe. |

Once GitHub Pages is on, A is at the site's main address and B is at `/redesign/`.

## How the site works (no build step)

Every page is a plain HTML file. There is nothing to install or compile: edit a file, commit, and GitHub Pages republishes it within a few minutes.

**Version A**
- `styles.css` controls the look of every page.
- `script.js` builds the top menu and footer on every page, the presentation cards, and the request form on the contact page. The settings HCG may want to change (email, Partnership form link, LinkedIn, optional form service) are at the top of this file.
- `resources.js` lists the presentations. Add an entry to add a deck to Resources, Events, and the matching topic page.
- `assets/photos/` holds page photos. `assets/board/` holds Executive Board headshots. `files/` holds the PDFs.

**Version B**
- `redesign/b.css` and `redesign/b.js` do the same jobs for Version B.
- `redesign/alumni-map.js` lists the cities on the alumni globe.

## Common tasks

**Swap a photo.** Replace the file in `assets/photos/` with a new JPG of the same name. See `assets/photos/PHOTO-CREDITS.md` for which file is used where.

**Add a board headshot.** Save a square photo as `assets/board/firstname-lastname.jpg` (for example `dan-king.jpg`). The initials circle is replaced automatically. Both versions use the same folder.

**Add a presentation.** Put the PDF in `files/`, then copy one of the entries in `resources.js` and change the details. For Version B, also add a card to the Presentations section of `redesign/prepare.html`.

**Change the board, wording, or numbers.** Open the page's `index.html` (Version A) or the `.html` file in `redesign/` (Version B) and edit the text between the tags.

**Add alumni to the globe.** In `redesign/alumni-map.js`, add one line per city:
`{ city: 'Boston', lat: 42.36, lng: -71.06, count: 5, unit: 'alum' },`
(Find a city's latitude and longitude by searching "Boston coordinates".) Then remove the Executive Board stand-in lines and the note on `redesign/alumni.html` that mentions them.

**Make the request form send directly to the HCG inbox.** By default the form prepares the message and opens it in Gmail, Outlook, or the visitor's email app. To have it send on its own, create a free form at formspree.io with the HCG email account, then paste its address (it looks like `https://formspree.io/f/abcdwxyz`) into `HCG_FORM_ENDPOINT` at the top of `script.js` (A) and `redesign/b.js` (B).

**After changing `styles.css` or `script.js`,** change the `?v=` number where the pages link to them (search and replace `?v=20261014b` across the HTML files) so visitors' browsers load the new version.

## Confidentiality

Preserve the anonymity and disclosure restrictions applied to Quill client work. Do not publish client identities, protected financial information, unapproved figures, or confidential recommendations. The membership and Quill selection wording reflects the mandate; change it only with Executive Board approval.
