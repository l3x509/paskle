# HHA question bank: coverage audit and duplicate check

Run on 2026-10-17 against the live prototype (Version 7): 14 chapters, 119 questions.

## Progress

**2026-10-17, second pass (bank now 185 questions, 0 duplicates flagged):**
- All remaining high and medium gaps written: 57 new questions across chapters 1–3 and 5–14 (IDs h107–h111, h209–h210, h310–h314, h509–h511, h607–h612, h708–h712, h810–h813, h909–h914, h1009–h1013, h1109–h1112, h1208–h1212, h1309–h1310, h1409–h1413).
- **Held:** the ch7 S1 question on back blows and abdominal thrusts, until the RN reviewer confirms which choking method the skills evaluation expects. Writing it brings the bank to 186.
- Change from plan: the ch12 "record % eaten" gap overlapped hha9 (ch2, best note "ate half of lunch"), so h1212 tests encouraging self-feeding instead (same section).
- Ch8: h812 tests the physical abuse definition, because h804 already covers verbal and mental abuse.
- Sections still without a question (all background or overview): 3.S0, 9.S0, 9.S1, 10.S0, 13.S0.
- Low-priority gaps (11) are left as reading, as planned.

**2026-10-17 (bank now 128 questions, 0 duplicates flagged):**
- Duplicates fixed: hha6 now tests the neglect definition (ch8 S3); h907 now tests dizziness in the shower (ch9 S3); h1304 now tests smooth sheets (ch13 S3).
- Guide fixes done: ch12 S3 2-hour rule (new source S19, USDA FSIS; add it to `content/SOURCES.md`); ch6 S1 how to test bath water; ch5 S1 dehydration note, "do not move them" after a fall, "then call your agency"; ch12 S1 thirst comfort under fluid restriction (ice chips count as fluid; h1205's explanation updated to match).
- Chapter 4 done: 9 new questions h403–h411 (all H and M gaps; contact time left as reading).
- Note: moving h907 left ch9 S1 (rules for every care task) without a question. Bath privacy is still covered by h805.
- Next: chapter 7 (5 H gaps), then 9, 14, 8.
Re-run the duplicate check after every content change: `node tools/check-dupes.js .`

## Summary

- **Duplicates:** 3 pairs test the same fact. Rewrite one question in each pair (below).
- **Rule breaks:** 5 questions test a fact their linked guide section doesn't state. Fix the guide or the link.
- **Gaps:** 81 testable facts in the guides have no question. 28 high, 42 medium, 11 low priority.
- **Sections with no question at all:** 12 (marked ∅ in the tables).

**Recommendation:** write questions for the high and medium gaps only (70). Skip the low ones; they stay in the guides as reading. With the 3 duplicates rewritten into new facts, the bank lands at about **189 unique questions**, with no padding.

## 1. Duplicates (fix first)

| Keep | Rewrite | Same fact | Suggested rewrite |
|---|---|---|---|
| h805 (ch8 S2) | h907 (ch9 S1) | Privacy during a bath: cover what you're not washing | Use h907 for a ch9 gap instead, e.g. **bath order** (ch9 S2) or **dizziness in the shower** (ch9 S3). Remap it. |
| h803 (ch8 S3) | hha6 (ch8 S4) | An unexplained bruise is an injury of unknown source | hha6 already has the term "neglect" but tests a bruise. Rewrite it to test the **neglect definition** (failing to provide goods or services the client needs). |
| h1108 (ch11 S3) | h1304 (ch13 S3) | Move the client up in bed with a draw/lift sheet, not by dragging | Rewrite h1304 to test **why** dragging harms skin (friction) or **smooth, wrinkle-free sheets**. |

The checker caught the first pair automatically. The other two use different words, so it can't see them; they're noted in the script.

## 2. Questions that break the source rule

The fact being tested must be stated in the linked section.

| Question | Problem | Fix |
|---|---|---|
| hha4 (ch12 S3) | "Refrigerate within 2 hours" isn't in the guide; it only says "do not leave it out for hours." | Add a bullet: refrigerate leftovers within 2 hours (1 hour above 90°F). Source: [USDA FSIS, Leftovers and Food Safety](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety). |
| hha10 (ch6 S1) | Guide says "test bath water" but not how (bath thermometer or inside of wrist). | Add how to test it to the bullet. |
| h508 (ch5 S1) | "Do not move them" after a fall isn't in ch5. | Add "do not move them; call 911" to the muscles-and-bones bullet. |
| h504 (ch5 S1) | Answer says "may be dehydrated"; ch5 doesn't mention dehydration. | Add "can be a sign of dehydration (chapter 12)" to the urine bullet. |
| h1205 (ch12 S1) | "Offer other comfort for thirst" isn't in the guide. | Add a line on comfort for thirst within the restriction (for example, mouth care), checked with the RN reviewer. |

Minor: h505's answer adds "then your agency," which ch5 doesn't say (ch7 S0 does). Add "then call your agency" to the ch5 heart bullet.

## 3. Coverage gaps by chapter

Priority: **H** = practical or safety fact likely on the exam, **M** = useful, **L** = background (skip as a question).

### Ch 1 · Role, scope, communication (8 questions, 5 gaps)
| Sec | Untested fact | P |
|---|---|---|
| S2 | Never give injections | H |
| S3 | Knock, introduce yourself, use the client's preferred name | M |
| S3 | Face a person with hearing loss and speak clearly | M |
| S3 | Tell a person with low vision where things are | M |
| S4 ∅ | Read care instructions before each visit; ask before starting if unclear | H |

### Ch 2 · Observing, reporting, documenting (9 questions, 3 gaps)
| Sec | Untested fact | P |
|---|---|---|
| S1 | Smaller changes (appetite, small red area, poor sleep) are reported at end of visit or by policy, not as emergencies | H |
| S2 | Write only what you yourself did or saw | M |
| S2 | The record is a legal document | L |

### Ch 3 · Temperature, pulse, respiration (9 questions, 5 gaps)
| Sec | Untested fact | P |
|---|---|---|
| S1 | Normal adult temperature about 98.6°F (37°C) | H |
| S1 | Armpit reads lower; record which site you used | M |
| S2 | Radial pulse is on the thumb side of the wrist | M |
| S4 ∅ | Never guess a number; measure again, report if still abnormal | H |
| S5 | Systolic is the top number | M |

S0 has no question and needs none (overview).

### Ch 4 · Infection control (8 questions, 10 gaps): biggest gap
| Sec | Untested fact | P |
|---|---|---|
| S1 ∅ | Breaking any one link stops the infection | M |
| S1 ∅ | The link you control most is how germs travel (hands, equipment, linens) | H |
| S2 | Soap and water when hands are visibly soiled or the client has diarrhea (C. diff) | H |
| S2 | Sanitizer needs at least 60% alcohol | M |
| S2 | Scrub for 20 seconds | H |
| S3 | Change gloves between dirty and clean tasks; clean hands after removing | H |
| S3 | PPE removal order starts with gloves | M |
| S4 | Never recap a needle | H |
| S5 | Leave disinfectant wet for the label's time | L |
| S6 | Wound infection signs: redness, warmth, swelling, yellow/green drainage | H |

### Ch 5 · Body functions and changes (8 questions, 3 gaps)
| Sec | Untested fact | P |
|---|---|---|
| S1 | Cold, pale or blue fingers or toes | M |
| S1 | New incontinence or a change in urine | M |
| S2 ∅ | Slow changes with age can be normal; changes over hours or days are always reported | M |

### Ch 6 · Clean, safe home (9 questions, 6 gaps)
| Sec | Untested fact | P |
|---|---|---|
| S0 | Keep the phone and often-used items within reach | M |
| S0 | Non-skid footwear; wipe spills right away | M |
| S1 | Report a smoke detector that doesn't work | M |
| S1 | Space heaters away from bedding, curtains, paper | M |
| S2 | Cleaning products in original containers, away from food | M |
| S3 | Know the exact address so you can give it to 911 | M |

### Ch 7 · Emergencies (8 questions, 6 gaps)
| Sec | Untested fact | P |
|---|---|---|
| S0 | On a 911 call: address, what happened, condition, stay on the line; don't leave the client | H |
| S1 | Can't speak or breathe: back blows and abdominal thrusts if trained | H |
| S1 | Becomes unconscious: 911, flat surface, CPR if trained | H |
| S3 | Seizure longer than 5 minutes: call 911 | H |
| S3 | After a seizure, turn them on their side | M |
| S3 | Low blood sugar signs: shaky, sweaty, confused, fast heartbeat | H |

**For the RN reviewer:** the guide teaches 5 back blows then 5 abdominal thrusts (Red Cross method). Confirm which method the HHA skills evaluation expects before writing the choking question.

### Ch 8 · Rights and abuse (10 questions, 7 gaps)
| Sec | Untested fact | P |
|---|---|---|
| S0 ∅ | Don't damage, misplace or take client property | M |
| S0 ∅ | Respect culture, religion and how the client likes things done | M |
| S0 ∅ | Tell the agency if you'll be late | L |
| S1 | Physical vs. emotional needs | L |
| S3 | Neglect definition (use rewritten hha6) | H |
| S3 | Physical and mental abuse definitions | M |
| S4 | You don't investigate; write down what you saw and heard, and when | H |

### Ch 9 · Hygiene and grooming (8 questions, 8 gaps)
| Sec | Untested fact | P |
|---|---|---|
| S0 ∅ | Which hygiene skills the nurse must watch | L |
| S2 | Bed bath order: cleanest to dirtiest, perineal area last | H |
| S2 | Dry well between toes and under skin folds | M |
| S3 ∅ | Don't leave the client alone in the tub or shower if unsafe | H |
| S3 ∅ | Dizziness or weakness while bathing: sit them down, report | H |
| S4 ∅ | Shampoo: cover eyes, dry hair promptly | M |
| S5 | Don't cut toenails unless the care plan says so and you're trained | M |
| S6 | Store dentures in a labeled container in water or solution | M |

### Ch 10 · Transfer and ambulation (9 questions, 6 gaps)
| Sec | Untested fact | P |
|---|---|---|
| S0 ∅ | Transfer and walking skills the nurse must watch | L |
| S1 | Turn with your feet; don't twist your back | H |
| S1 | Ask for help when the client is too heavy or the plan calls for two people | M |
| S2 | Gait belt over clothing, not over a wound, tube or recent surgery | M |
| S3 | The cane moves forward with the weak leg | M |
| S4 | Sit on the edge of the bed a few minutes before standing | H |

### Ch 11 · Range of motion and positioning (8 questions, 4 gaps)
| Sec | Untested fact | P |
|---|---|---|
| S0 ∅ | Do only the exercises in the care plan | M |
| S1 | Active-assisted ROM | M |
| S2 | Move slowly; never force a joint | H |
| S2 | No ROM on the neck or a recently operated joint unless the plan says | M |

### Ch 12 · Nutrition and fluids (9 questions, 6 gaps)
| Sec | Untested fact | P |
|---|---|---|
| S0 | Diabetic diet controls sugar and carbohydrates | M |
| S0 | Soft or pureed food for chewing or swallowing problems | M |
| S2 | Upright to eat and for a while after | H |
| S2 | Report coughing or choking during meals | H |
| S2 | Record how much was eaten (for example, 50%) | M |
| S3 | Freezer at 0°F or below | L |

### Ch 13 · Skin changes (8 questions, 4 gaps)
| Sec | Untested fact | P |
|---|---|---|
| S0 ∅ | Aging skin is thinner and tears easily | L |
| S1 | Check skin folds, under the breasts, between the toes | M |
| S2 | An area that's warm, hard or soft compared with skin around it | M |
| S3 | ~~Smooth sheets, no wrinkles or crumbs~~ done: h1304 | M |

### Ch 14 · Other tasks, medications, staying qualified (8 questions, 8 gaps)
| Sec | Untested fact | P |
|---|---|---|
| S1 | You may not fill the weekly pill organizer | H |
| S1 | Report missed doses, refusals or reactions | H |
| S1 | What "self-administration" means | M |
| S2 | Unsatisfactory in more than one required area means you don't pass | M |
| S2 | A registered nurse runs the evaluation | L |
| S3 | A problem found in your care means retraining and re-evaluation | M |
| S3 | RN in-person visit every 60 days when there's no skilled service | L |
| S3 | Observed giving care at least once a year | L |

## 4. Totals

| | H | M | L | Total |
|---|---|---|---|---|
| Gaps | 28 | 42 | 11 | 81 |

Plan: rewrite 3 duplicates + fix 5 guide sections, then write the 70 H and M questions (fewer if some get combined into a single situation question). Run `node tools/check-dupes.js .` after each chapter.
