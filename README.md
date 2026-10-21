# Paskle

Exam prep in Kreyòl, English, French and Spanish: Certified Nursing Assistant (CNA, Massachusetts), Home Health Aide (HHA), and the Massachusetts learner's permit. CDL is planned.

Live site: [paskleapp.com](https://paskleapp.com)

## What's inside

- **One-page app:** `index.html` holds the app's code, screens and styles. It works offline (`sw.js`) and can be installed on a phone (`manifest.webmanifest`).
- **Study guides and questions:** in `data/`.
  - HHA: 14 federal subjects, `data/hha-*.js`.
  - CNA: Massachusetts written exam outline, `data/cna-a.js` and `data/ma-cna.js`.
  - Permit: 8 chapters, 181 questions and a 62-question FAQ from the RMV Driver's Manual (April 2026), `data/permit-a.js`.
- **French and Spanish:** `data/i18n-fr.js` and `data/i18n-es.js`, keyed by the English text. They load only when someone picks that language.
- **Content sources (edit these, not the data files):**
  - `content/cna/cna_src.py`: CNA chapters, in four languages side by side.
  - `content/permit/permit_src.py`: permit chapters, in four languages side by side.
  - `content/permit/permit_faq.py`: permit FAQ, in four languages side by side.
  - `content/hha/HHA-AUDIT.md`: HHA content audit.

## Rebuilding the data

Run from the repo root:

```
python3 content/cna/build_cna.py          # writes data/cna-a.js, data/ma-cna.js, merges FR/ES
python3 content/permit/build_permit.py    # writes data/permit-a.js, merges FR/ES
node tools/check-dupes.js                 # flags questions that test the same fact
node tools/i18n-check.js                  # lists missing or stale French/Spanish strings
```

After any change, bump `VERSION` in `sw.js` so installed copies update.

## Content rules

- Facts come from free, public or openly licensed sources only, and every source is cited. The full list is in the app under Account → Sources.
- Every question's answer is stated in the guide section it links to, and the source and page appear under each answer.
- No competitor content and no state logos. Paskle never claims to be official and is not affiliated with the Massachusetts RMV, DPH or FMCSA.
- Before content is promoted, a fluent Kreyòl reader should check it against the official Kreyòl manuals.

## Hosting

The site is hosted on Hostinger, and this repo only holds the files. Hostinger's Git deployment (hPanel → Advanced → Git) publishes `main` to `public_html` whenever new commits are pushed.

© Lexcellent Solutions LLC
