# CNA: Massachusetts written exam

## The exam (D&S / Headmaster, MA Candidate Handbook 5.2026)

60 multiple-choice questions, 60 minutes, 76% to pass. Offered in English, Chinese, Haitian Creole and Spanish.

| Area (id) | Exam questions | Bank (2026-10-18) |
|---|---|---|
| Role and Responsibility (role) | 9 | 17 |
| Basic Nursing Skills (basic) | 8 | 43 |
| Disease Process (disease) | 7 | 21 |
| Resident Rights (rights) | 6 | 20 |
| Safety (safety) | 6 | 28 |
| Communication (comm) | 5 | 10 |
| Infection Control (infect) | 4 | 23 |
| Mental Health (mental) | 4 | 7 |
| Personal Care (personal) | 4 | 20 |
| Care Impaired (impaired) | 3 | 11 |
| Aging Process and Restorative Care (aging) | 2 | 13 |
| Data Collection (data) | 2 | 14 |
| **Total** | **60** | **227** |

Thinnest areas, for the next writing pass: Mental Health (7 for 4 slots) and Communication (10 for 5).

## How the CNA bank is built

- `cna_src.py`: the six CNA guide chapters (2–7) and 52 questions, written once in English, Kreyòl, French and Spanish.
- `ma_tags.py`: the Massachusetts area for each existing question. HHA questions tagged `None` are HHA-only (home setting, 911-from-home answers, HHA medication and supervision rules) and stay out of the CNA bank.
- `build_cna.py` writes `data/cna-a.js` and `data/ma-cna.js`, and merges the French and Spanish into `data/i18n-*.js`.
- In the app, tagged HHA questions are reused in the CNA bank with IDs `c-<id>`, so CNA progress is tracked separately. Their "Read this in the guide" link opens the HHA guide; CNA Premium unlocks those guides.

## Full exam simulation

Premium: 60 questions drawn per the table above, 60 minutes, 76% to pass, then results by topic with a "Practice" link for each weak topic. Free: a 5-question mini exam.

## Notes for review

- Shared HHA questions say "client" rather than "resident". The facts are the same; rewording is optional.
- New sources: S20 42 CFR 483.12 (restraints), S21 42 CFR 483.35 (4-month and 24-month rules), S22 42 CFR 483.95 (12 in-service hours). Add them to `content/SOURCES.md`.
- Restraint check and release times follow the Open RN text (check at least every 15 minutes, release every 1 to 2 hours); facility policy may differ. Flag for the RN reviewer.
