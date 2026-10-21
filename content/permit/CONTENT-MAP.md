# Massachusetts learner's permit: content map

## Source of truth

The source is the **Massachusetts Driver's Manual, Class D, revised April 2026**. It is the English PDF on [mass.gov/lists/drivers-manuals](https://www.mass.gov/lists/drivers-manuals) and is cited in the app as S7. Every fact in a guide or question must be stated in this edition, and each guide section cites the manual page.

Page numbers are the printed page numbers. The PDF page is the printed page plus 8.

Other manuals:

- **Spanish manual (July 2023):** older than the English edition. Use it only to check Spanish terminology, never for facts.
- **Official Haitian Creole and French manuals:** they exist on the same mass.gov page. They are needed so the Kreyòl and French wording matches what students will see on the RMV test.

Images:

- Do not copy any image from the manual.
- Draw road signs as SVG from the federal MUTCD sign designs, which are public domain.

## The exam (manual p. 16)

- 25 multiple-choice questions.
- 18 correct to pass (72%).
- 25 minutes.
- Topics named in the manual: alcohol misuse, suspensions, JOL violations, rules of the road, and road signs.
- Class D and M exams are offered in many languages, including Haitian Creole, French and Spanish, with audio in every one of them.

## Guide chapters and question targets

The RMV does not publish questions per topic. The "exam draw" column is Paskle's own split, built around the five topics the manual names. The app must not present it as the RMV's split.

| Paskle chapter | Manual sections (pages) | Target questions | Exam draw (of 25) |
|---|---|---|---|
| P1 Getting your permit and the JOL law | Permit, driving with a permit, JOL requirements and restrictions (9–11, 15–20) | 20 | 3 |
| P2 Safety first | Seat belts, child seats, air bags, hands-free law, defensive driving, distances, braking, lights, night, rain, fog, winter (34–48) | 25 | 3 |
| P3 Sharing the road | Vulnerable road users, pedestrians, bicycles, motorcycles, school buses, trucks (49–54, 104–108, 112–117) | 20 | 3 |
| P4 Violations and suspensions | Civil and criminal violations, surcharges, suspension charts (56–70) | 18 | 3 |
| P5 Alcohol and drugs | BAC limits, implied consent, penalties, drugs and medicine (68–75) | 15 | 3 |
| P6 Signals, signs and markings | Traffic and pedestrian signals, signs by shape and color, work zones, pavement markings (80–92) | 25 | 4 |
| P7 Speed, lanes and right-of-way | Speed limits, lanes, highway driving, intersections, turns, rotaries, passing, parking (78–79, 93–111) | 25 | 4 |
| P8 Special situations | Emergency vehicles, police stops, driving emergencies, crashes (120–131) | 12 | 2 |
| **Total** | | **about 160** | **25** |

## Existing questions (p1–p13), checked against the April 2026 manual

| ID | Topic | Manual pages | Chapter | Status |
|---|---|---|---|---|
| p1 | JOL night hours | 10–11 | P1 | Correct |
| p6 | JOL passengers | 10 | P1 | Correct |
| p12 | Exam format | 16 | P1 | Correct |
| p2 | Under 18, no devices | 11, 40 | P2 | Correct |
| p10 | Hands-free rule | 39 | P2 | **Fixed 2026-10-21:** "single tap or swipe" became "touched only to turn on hands-free mode" |
| p8 | Booster seat until age 8 or 57 inches | 36 | P2 | Correct |
| p5 | Wipers mean headlights on | 45 | P2 | Correct |
| p11 | BAC 0.02 for drivers under 21 | 69, 71 | P5 | Correct |
| p9 | Flashing red means stop | 81 | P6 | Correct |
| p4 | 20 mph school zone | 79 | P7 | Correct |
| p7 | 30 mph thickly settled, 25 in some towns | 79 | P7 | Correct |
| p3 | Rotary: yield to cars already in it | 101 | P7 | Correct |
| p13 | Emergency vehicle: pull right and stop | 120 | P8 | Correct |

## Build status (2026-10-21)

The track is live. Source: content/permit/permit_src.py (four languages). Build: `python3 content/permit/build_permit.py` writes data/permit-a.js (chapters, `PERMIT_SEC`, `PERMIT_FAQ`) and merges French and Spanish into the i18n files.

| Chapter | Sections | Questions | Exam draw |
|---|---|---|---|
| P1 Permit, exam and JOL law | 6 | 19 | 3 |
| P2 Safety first | 6 | 27 | 3 |
| P3 Sharing the road | 6 | 22 | 3 |
| P4 Violations and suspensions | 5 | 17 | 3 |
| P5 Alcohol, drugs and driving | 6 | 15 | 3 |
| P6 Signals, signs and markings | 6 | 29 | 4 |
| P7 Speed, lanes, turns and right-of-way | 7 | 35 | 4 |
| P8 Emergencies, police stops and crashes | 5 | 17 | 2 |
| **Total** | **47** | **181** | **25** |

- Every section carries source S7 and its manual page numbers. The quiz feedback shows them under each answer, with a link to the section.
- FAQ: 62 questions in 8 sections (before you apply, the permit exam, driving with a permit, drivers under 18, the road test, your license, moving here or licensed elsewhere, fees and contact), covering every permit and license topic in manual chapter 1 (pages 1–32) plus renewal limits (75–76) and showing your license to police (122). Source: content/permit/permit_faq.py. Two topics the manual does not cover use Mass.gov: address changes (S30) and the Work and Family Mobility Act (S31).
- Signs: stop, yield, rr (railroad advance), school, curve, nouturn, work, smv, drawn as SVG to MUTCD shapes and colors.
- Free tier: chapter 1 in full, plus the first question of every chapter (26 questions).
- Duplicate check: 0 open pairs; reviewed pairs are in tools/check-dupes.js ALLOW.
- Official terms used from the RMV's Kreyòl and French manuals (April 2026): pèmi apranti, Lisans pou Jèn Chofè, Egzamen Pratik, sipèvizè, kafou won, dwa de pasaj; permis d'apprenti conducteur, permis de conducteur junior, examen routier, accompagnateur, carrefour giratoire.

## Still to do

1. Have a fluent Kreyòl reader check the guide and question wording against the official Kreyòl manual.
2. Re-check fees and rules against Mass.Gov/RMV when the RMV publishes a new manual.
