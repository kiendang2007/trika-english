# SPEC

What the product is. No dates, no people, no justification. Those live in `LICH-TRINH.md`
and `DECISIONS.md`. Rewritten 16 September after the scope change. Stage count changed from
fifteen to eleven on 28 September (see D26).

This file goes in the repository root. Claude Code reads it from there and re-reads it whenever it
changes. The content lives in `content/materials/`, one JSON file per material.

---

## 1. The product

**Trika English** teaches one path through English grammar, in eleven stages and sixteen
materials, and will not let a learner skip a stage.

The claim the whole product rests on: **the auxiliary verb is the root**. Negation, yes/no
questions, wh- questions, all twelve tense and aspect combinations, and the passive voice all
fall out of one rule about where the auxiliary goes and what form it selects. A learner who has
not got the auxiliary cannot be taught any of them, and most courses teach them as twelve
unrelated topics.

A learner arrives, is placed at a stage, and works forward. Stages ahead of them are visible and
locked. Each material is an explanation with questions placed inside it, and a wrong answer opens
the correction loop.

Target learner: Vietnamese beginners, roughly A1 to A2, school age through university.
Interface language: Vietnamese, everywhere, including error messages and button labels.

**First audience is internal.** Six named students taught by the project owner. Not strangers,
not a public launch. Individual learners come after that works, English teachers after that.

## 2. Scope

**In:** the placement screen, the sixteen material pages grouped into eleven stages, gating,
questions with the correction loop, progress that survives a refresh, logging to a Google Sheet.

**Out, and the code should contain no trace of these:** a diagnostic test, scoring, a CEFR
estimate, a node map with red and amber, confidence buttons, user accounts, login, any runtime
API call, any AI or speech processing, free-text grading, audio recording, vocabulary tools,
listening, speaking, a teacher dashboard, payment, marketing pages.

The diagnostic was cut on 16 September. The **route** survives; the **test** does not.

## 3. The eleven stages

Sequence set by the teacher on 16 September, revised 18 September. Stages 12 to 15 of the
earlier fifteen-stage sequence were merged into stage 11 on 28 September. Generated from
`nodes.json` and validated by `build_nodes.py`, which checks that no node is taught before
something it requires.

**Stages 1 to 4 build a clause** out of word classes a learner can hold on their own.
**Stage 5 adds the pronouns**, which need the clause first. **Stage 6 introduces the auxiliary**
and **stage 7 completes the auxiliary inventory** with the modals. **Everything from stage 8 on
is one move from the auxiliary.**

| Stage | Material | Nodes | Vietnamese | What it establishes |
|---:|---:|---|---|---|
| 1 | 1, 2 | `W1` less `W1.4` `W1.5`, and `M1.1` | Danh từ | Things you can talk about |
| 2 | 3 | `W3` `W3.1` | Tính từ | How to describe them |
| 3 | 4 | `W2.1` `W2.6` | Động từ chính, nội / ngoại động từ | Action and state, and whether a verb takes an object |
| 4 | 5 | `C5` + subtree | Thành phần và mẫu câu | The clause assembled from stages 1 to 3 |
| 5 | 6 | `W1.5` + subtree | Đại từ | Pronouns, once subject and object exist |
| 6 | 7 | **`W2.2`** | **Trợ động từ** | **The root. do, be, have, will.** |
| 7 | 8 | `W2.3` | Động từ khuyết thiếu | The inventory completed: can, may, shall, should, must |
| 8 | 9 | `Y7` | Phủ định | `not` sits immediately after the auxiliary |
| 9 | 10 | `C4.2` | Câu hỏi Yes/No | Move the auxiliary to the front, and answer with it |
| 10 | 11 | `C4.3` | Câu hỏi Wh- | The same move, with a question word in front |
| 11 | 12 to 16 | `Y1` `M1.4` `M1.3` `Y2` `M1.5` `M1.6` `Y3` `Y13` `W2.5` | Thì, thể, dạng bị động, tổng hợp các thì, động từ bất quy tắc | Tense and aspect with the forms they need (12, 13), the passive (14), the 12 active and 12 passive forms and the five in the letter T (15), then irregulars as the exception to `-ed` (16). The last stage. |

34 nodes in 11 stages, 16 materials.
purpose would make no sense, which is why tense arrives with `-ed` and aspect with `V-3` and
`-ing`.

**Three edges were corrected on 16 September**, all of them mine and all of them caught by the
teacher proposing this sequence:

- `M1.4` and `M1.5` no longer require `W2.5`. **`W2.5` now requires them.** `-ed` is the rule;
  irregulars are the exception to a rule the learner already has. Stating the exception first
  was incoherent.
- `W3.1` no longer requires `W2.8`. *Bored* against *boring* is learnable as a vocabulary pair
  before participles exist. The teacher's call.
- `W2.6` joins stage 3, because `C5.2` cannot state which pattern a verb takes without it.

**Why pronouns moved to stage 5.** Teacher's call, 18 September. `W1.5` sat inside stage 1 as
part of the `W1` subtree, which forced a pronoun lesson to teach only `I, you, he, she, it, we,
they` and leave `me, him, her, us, them` out, because telling the two sets apart needs subject
and object, and those arrive with `C5` at stage 4. Behind the clause, the whole set can be
taught at once. `build_nodes.py` declares this in `REASSIGNED` and fails the build on any stage
reassignment that is not declared there.

**Why modals sit at stage 7 rather than late.** Modals do not inflect for tense. Taught after
tense, which arrives in stage 11, they contradict the rule "the auxiliary carries the tense" and
the learner has to unlearn something. Taught at stage 7 the order reverses: stage 11 can say
"except the modals you already met, which never change." A forward reference instead of a
retraction. It also means `will` is already known when the future column of the 3x4 grid
arrives, so the grid needs no special pleading.

**On tense count.** English has two inflectional tenses, past and present. The future column of
the grid is formed with the modal `will`. Both are true and stage 7 is what makes them
compatible: the learner meets `will` as an auxiliary, then uses it to express future.

Every other node in `nodes.json` has `in_v1: false` and renders locked with a line saying this
version does not cover it. They are not hidden: seeing the size of the tree is part of the point.

## 4. Node tree

`nodes.json` is unchanged in structure. 227 nodes across six axes plus two separate trees, built
and validated by `build_nodes.py`, which is the single source of truth. Never hand-edit
`nodes.json`. Full reasoning in `grammar-taxonomy.md` and `pronunciation-taxonomy.md`.

Two fields drive v1:

- `in_v1` is true for the 34 nodes in the eleven stages.
- `stage` is 1 to 11 for those nodes and null everywhere else. Several nodes may share a stage.
- `chain_order` mirrors `stage` and is kept only for compatibility.

Three nodes are deliberately excluded from v1 even though their parent is in it: `W1.5f` relative
pronouns, which need relative clauses; `W1.4` collective nouns; and `W3.2` plain adjectives. The
last two were cut by the teacher.

`requires` is what makes gating work and is not derivable from any grammar reference. It was
stated by the teacher.

## 5. Vietnamese L1 interference tags

Carried on items, used in correction cards to name the Vietnamese-specific cause.

| Tag | Meaning | In this chain |
|---|---|---|
| `AUX` | dropped auxiliaries | the central one, stages 6 to 11 |
| `PLS` | plural and third-person -s | stages 1 and 10 |
| `BSH` | tense backshift | not in v1 |
| `FCC` | final consonant clusters | not in v1 |
| `SZ` | /s/ and /z/ endings | not in v1 |
| `ART` | articles | not in v1 |
| `RCO` | relative clause word order | not in v1 |
| `AJO` | adjective after the noun, as in Vietnamese | material 3 |
| `OBJ` | dropped object after a transitive verb | material 4 |
| `DVB` | dropped verb, usually `be` before an adjective | material 5 |
| `NQA` | answering a negative question by agreement, not by fact | material 10 |

## 6. Placement

One screen, shown once, before any lesson.

**Teacher mode.** The owner picks a starting stage for a named student from a dropdown of the
eleven. This is the path used for the six internal students, and it is honest: in v1 the teacher
is the placement.

**Self mode.** The learner is shown the eleven stages as plain statements and ticks the ones
they are sure they already know. The starting stage is the first unticked one. No scoring, no
diagnosis text, no result screen.

Whichever mode, the outcome is a single integer: the learner's current stage. Store it, and
everything else follows from it.

## 7. Gating

```
gating runs on STAGES, not on single nodes

for each stage 1..11:
    if stage  <  learner.current_stage   -> done, openable, marked complete
    if stage ==  learner.current_stage   -> current, openable
    if stage  >  learner.current_stage   -> locked

a stage is complete when every material in it is complete
a material is complete when every item in it has been answered correctly at least once
advancing: completing the current stage increments current_stage by one
```

A locked stage is clickable and shows why it is locked, naming the stage that comes first.
**Do not hide locked steps and do not silently ignore the click.** The refusal is the product.

## 8. Material page

A stage holds one or more materials. Stage 1 holds two, stage 11 holds five, every other stage
holds one. A material is one page, rendered top to bottom from the `blocks` array in its JSON
file, in exactly that order:

- `text`: `body_vi` as a paragraph, then `list` as bullets if present.
- `section`: `heading_vi` as a heading, then `body_vi` if present, then `table` if present.
  A table has a header row `columns_vi` and data `rows`. On a phone a wide table scrolls sideways
  inside its own box. The page itself never scrolls sideways.
- `funfact`: a visually distinct callout with `heading_vi` and `body_vi`.
- `item`: a multiple-choice question, shown at the point it appears in the page, not collected at
  the end. The learner can keep reading past an unanswered question.

Nothing under a key that starts with `_` is ever rendered. `video_url` is null for every material
in v1; when it is null, render nothing for it.

At the bottom of the page, **Bước tiếp theo** names what comes next: the next material in the same
stage, or the first material of the next stage.

## 9. Practice and the five-step loop

An item is `mcq` or `short`, both auto-graded.

**`short`** normalisation before comparing, in this order: trim, lowercase, collapse runs of
whitespace to one space, strip a trailing full stop. Nothing else. No fuzzy matching.

On a wrong answer, show the steps in order, one screen at a time:

1. **Sai**. The answer was wrong.
2. **Nhận thức cái sai**. The text of the option the learner chose, quoted verbatim.
3. **Biết cái sai**. That option's `diagnosis_vi`: what exactly is wrong with it.
4. **Hiểu cái sai**. The item's `rule_vi`: the general rule behind it.
5. **Phòng tránh cái sai**. The item's `fallback_vi`. The teacher removed every fallback on
   21 September, so this step is skipped for every item in v1 and the loop ends at step 4.

After the loop, the learner answers the same item again. A correct answer shows a short
confirmation and nothing else.

## 10. Correction cards

```
"exact span quoted from the learner, verbatim": giải thích bằng tiếng Việt.
```

Binding rules:

1. Quote what the learner actually wrote, verbatim, before anything else. Never paraphrase.
2. Name the rule that was broken. A card that gives only the fix is rejected.
3. Offer the safe fallback: "Đơn giản hơn, em có thể…"
4. When the item has an `l1_tag`, contrast Vietnamese and English explicitly.
5. Never soften. Never write the explanation in English.
6. Several problems in one span are enumerated: thứ nhất, thứ hai, thứ ba.

Register is unresolved. Learners range from grade 6 to university, so write cards in a neutral
register with no pronoun pair until it is decided.

## 11. Item schema

```json
{
  "id": "W2.2-03",
  "node": "W2.2",
  "l1_tag": "AUX",
  "type": "mcq",
  "prompt_vi": "Chọn câu đúng: \"Tôi không làm bài tập về nhà.\"",
  "options": [
    { "key": "A", "text": "I not do my homework.",
      "diagnosis_vi": "Đặt 'not' trực tiếp sau chủ ngữ. 'not' luôn đứng ngay sau trợ động từ, mà câu này chưa có trợ động từ." },
    { "key": "B", "text": "I do not do my homework.", "diagnosis_vi": null },
    { "key": "C", "text": "I do not did my homework.",
      "diagnosis_vi": "Chia động từ hai lần. Đã chia ở trợ động từ thì động từ chính giữ nguyên thể." },
    { "key": "D", "text": "I don't my homework.",
      "diagnosis_vi": "Bỏ mất động từ chính. 'do' ở đây là trợ động từ, không phải động từ chính." }
  ],
  "answer": "B",
  "rule_vi": "Ở thể đơn giản, câu phủ định cần trợ động từ do/does/did, và 'not' đứng ngay sau nó. Động từ chính trở về nguyên thể.",
  "fallback_vi": null
}
```

```json
{
  "id": "Y1-01",
  "node": "Y1",
  "l1_tag": "PLS",
  "type": "short",
  "prompt_vi": "Dịch sang tiếng Anh, thì hiện tại đơn: \"Tôi dậy lúc sáu giờ mỗi sáng.\"",
  "accept": ["i get up at six every morning", "i get up at 6 every morning",
             "i wake up at six every morning", "i wake up at 6 every morning"],
  "rule_vi": "...",
  "fallback_vi": null
}
```

Invariants: exactly one defensible answer per item; every `mcq` wrong option has a non-null
`diagnosis_vi` and the correct option has `diagnosis_vi: null`; every item has `rule_vi`;
`fallback_vi` is `null` for every item in v1; no item is scored on spelling.

## 12. Data files

All content is JSON in the repository. Nobody needs a database to change a question.

- **`content/nodes.json`**: generated by `build_nodes.py`. Never hand-edit.
- **`content/materials/NN-slug.json`**: one file per material, sixteen in all. The site imports every
  file and orders them by `material_id`. Each file carries `material_id`, `title_vi`, `stage`,
  `nodes`, `video_url` and the ordered `blocks`. The block and item formats are in
  `material-format.md`. Items live inside the blocks; there is no separate items file.
- `render_material.py` turns a material JSON into readable markdown for humans. It is not part of
  the site.

## 13. Stack

- React with Vite, **plain JavaScript, no TypeScript**.
- **No router.** One page, a `step` value in state, screens rendered by switch.
- No backend, no database, no login, no runtime API call.
- Progress in `localStorage`, keyed by a learner name typed at placement. Wrap every read and
  write in try/catch and render correctly when it comes back empty.
- Logging: one `POST` to a Google Apps Script web app appending a row to a Google Sheet. No keys
  in the client. A failed log never breaks the lesson.
- GitHub `kiendang2007/commbat-english`, Vercel deploying from `main` on every push.

Must work on a 5 inch phone over mobile data. The build timestamp stays printed on screen until
submission.

## 14. What the build must never do

- Hide a locked stage, or ignore a click on one. The refusal, with its reason, is the product.
- Score the learner, estimate a level, or produce anything resembling a CEFR band.
- Advance a learner past a stage whose `requires` are not all done.
- Ship an `mcq` option whose only meaning is "wrong".
- Show an English explanation to a learner.
