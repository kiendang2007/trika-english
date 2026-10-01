# DECISIONS

Why each choice was made. Open this file when someone challenges a decision, or after
5 October when reopening them is the right thing to do. Nobody needs to read it to do their
job today.

Each entry says what was decided, why, and **what would change it**, so that a decision made
under a 21-day deadline is not mistaken for a permanent belief.

**Updated 1 October.** D27 removes learner names, placement, the teacher link, stage gating,
progress and logging, and cuts the five components to three. Entries it supersedes in part carry
a one-line note under their heading.

---

## D1. The item bank is 300 items, not 458

**Corrected 14 September.** Both handoff briefs state 458. Counting the two homework files
directly, the exercise block and the answer key block carry identical numbering, and the
earlier count added them together. The real figure is **300 items, of which 200 have answer
keys**.

| Exercise | Items | Key | Node |
|---|---:|---|---|
| Bài 1 Danh từ | 20 | yes | W1.1, W1.2, W1.4 |
| Bài 2 Tính từ và trạng từ | 30 | yes | W3.1, W4.1 |
| Bài 3 Đại từ nhân xưng | 35 | yes | W5.1 |
| Bài 4 Đại từ bất định | 28 | yes | W5.2 |
| Bài 5 Mạo từ | 20 | yes | W6 |
| Bài 6 Mệnh đề và câu | 42 | yes | C1, C2, C3 |
| Bài 7 Dấu câu | 25 | yes | C2 |
| Dịch câu theo thì | 73 | **no** | W2.2 |
| Chuyển sang bị động | 27 | **no** | W2.3 |
| **Total** | **300** | 200 keyed | |

Consequences that are easy to miss: **W2 is the largest block and the only one with no answer
key**, so writing those keys is unbudgeted work that only the teacher can do. **W7 and W8 have
no practice items at all**, so every W7 diagnostic item is new writing.

---

## D2. v1 covers the word level, not the complex-sentence family

The website brief narrowed the flagship content to subordinate clauses, conditionals and
relative clauses. Reversed.

The original argument was "only 42 of 458 items are clause-level", and D1 shows that argument
used a wrong number. The argument that survives the correction: word-level nodes hold **133
answer-keyed items**, verb nodes hold **100 unkeyed items**, and clause-level nodes hold **67
answer-keyed items**. The word level has the most usable material, and the sealed baseline
says it is where these six learners are actually weak. Content authoring is the one task that
cannot be parallelised or handed to AI without checking every line, so it sets the scope.

**What would change it:** a semester instead of three weeks, or an existing keyed item bank at
the clause level.

---

## D3. Calibrate to the six current learners, roughly A1 to A2

Not IELTS Foundation. These six are reachable this week, a baseline exists for them, and the
items sit at their level. The B2B pitch to centres stays as the business model on a slide; it
does not change what gets built.

The baseline widened the range beyond what either brief assumed: grade 6 through university
freshman, not grades 6 to 8.

**What would change it:** access to a real IELTS Foundation cohort and time to write items for
them.

---

## D4. Everything auto-graded. No free writing, no audio

The original instinct was a written description or a translation, then reading it aloud. That
is the better diagnostic and the wrong one for 21 days:

- Free writing needs an LLM API or a human. An API means keys, budget, prompt work, a failure
  path on timeout, and a defence against a learner pasting in a long paragraph. A week of
  work that does not exist.
- Reading aloud needs browser audio capture, storage, then speech recognition or a human
  listener. Same problem, worse.
- An A1 learner asked to describe a common object writes four sentences. Four sentences
  cannot distinguish "does not know articles" from "avoided articles".

**What replaces the pronunciation evidence:** items that test the *rules* by asking the learner
to predict. The teaching method already says do not teach sounds one at a time, teach
phonemes, syllables and stress as rules, then have the student predict and check. A test that
asks for the prediction is that method, and every prediction question is multiple choice.

This loses production evidence and keeps the diagnostic shippable.

**What would change it:** version 2, after the course, which is the stated plan anyway.

---

## D5. Confidence marking on every item

Two submit buttons, **Tôi chắc chắn** and **Tôi đoán**, instead of one.

This is the cheapest available answer to the real problem, which is that a wrong answer has
several possible causes. Confident-and-wrong is a misconception and needs the full five-step
loop. Guessed-and-wrong was never taught and needs teaching from zero. Guessed-and-right is
fragile and needs drilling, not reteaching. Those are the same score and three different
curricula, and one extra button separates them.

Confidence-weighted marking is a known technique in assessment rather than an invention here.
No effect size is quoted because no source has been checked for one.

---

## D6. Item weighting follows the sealed baseline

Items go where the test has to discriminate, not where the grammar is most interesting.

The baseline predicts W5.2 weak in 4 of 6 learners and W6 weak in 3 of 6, so those get four
items each. It predicts W1 strong in 3 of 6 and confidently weak in none, so W1 gets two.
Pronunciation is predicted for one learner only, so its five items are exploratory rather
than confirmatory.

**This is the reason the baseline had to be sealed before any item was written.** Written
afterwards, it would have been a description of the test rather than a check on it.

---

## D7. Three ceiling items above A2

The baseline says the strongest learner may have no weak nodes at all. A test built for A1 to
A2 gives him 30 out of 30 and then has to say something, and a diagnostic with no way to say
"you are above this test" will invent a weakness instead.

Three harder items fix it cheaply. Clearing all three produces the message and no route. An
honest null result is a better demo than a fabricated weakness, and it is the kind of thing a
lecturer notices.

---

## D8. The item bank has errors, and they sit on the most important node

Found 14 September by reading the two homework files. Not a criticism of the materials, which
are dense and work. It is that **an item bank written for a human to mark is not the same
artefact as one a machine marks**, and the gap is exactly where a wrong diagnosis comes from.

**Bài 4, đại từ bất định.** Items 1 to 15 are pre-filled with one answer while the key gives a
different one. Five of fifteen disagree:

| # | Filled into the exercise | Answer key |
|---|---|---|
| 1 | `All of the cake was eaten` | `Most` |
| 3 | `One of the two restaurants was open` | `Neither` |
| 6 | `Some of my friends studies in Japan` | `One` |
| 8 | `Each student in this class has a laptop` | `Every` |
| 14 | `Can I have one cup?` | `another` |

Most of these are not mistakes. The instruction allows a word to be used more than once, and
`All of the cake` and `Most of the cake` are both grammatical. **That is the problem.** These
items have several defensible answers, which is fine for homework a teacher marks and fatal
for a machine. W5.2 is the node the baseline says is weak in four of six learners, so it is
the node the diagnostic most needs to get right, and the node whose items are least
deterministic. Every W5.2 diagnostic item needs rewriting to have exactly one defensible
answer, or converting to multiple choice with controlled options.

Item 6 is a genuine error either way: `Some of my friends studies` should be `study`. The key
is right and the pre-filled exercise is wrong.

**Bài 2, item 7.** The exercise says `The old man walked boredly (bore)`, the key says
`boringly`. They contradict and neither word is natural English. Cut the item rather than
pick a side.

**Bài 2, items 5 and 25** spell `embarrass` with one `r` in the exercise and two in the key.

Trang's audit covers the remaining 185 keyed items. Expect more.

---

## D9. What transfers from `correction-voice.md`

Two parts do not transfer, because the file is written for the IELTS Writing class: the
register table (Mai Chi and Cường are not these learners, Minh Anh has left) and the
chart-checking rules for Task 1.

What transfers, and what `SPEC.md` section 9 implements literally:

1. `"exact quoted span": giải thích tiếng Việt`. Verbatim quote first, then a colon. The
   diagnostic already stores the learner's exact answer, so this costs nothing.
2. State the rule, not the fix. This is the difference between the product and a quiz score,
   and it is the instruction most likely to get lost when an AI writes the copy.
3. Offer the safe fallback.
4. Contrast Vietnamese and English when the error comes from translation. This is where the
   L1 tags get used, and it is why the learner remembers.
5. The `Pattern | Count | Taught before?` table. This is the node map arrived at from the
   other direction, and the source file says it is the part a flat list of corrections cannot
   give. Kept, with survey question 6 filling the last column.
6. `"đúng trước, hay sau"`, verbatim, as the framing for the route.
7. Never soften, never explain in English.

**One conflict.** The source says order feedback by damage. The route orders by dependency.
They disagree when a badly broken node sits late in the tree. **Dependency order wins**,
because a learner cannot fix W2.2 before W2.1, and the result screen says so in one line.

**Unresolved: the beginner register.** `anh/em` for a high schooler against `mình/bạn` for a
university student, and these learners span both. Either one neutral register, or a register
chosen from the learner's stated age on the intro screen.

---

## D10. The build is driven by the person who owns the spec

The brief said Kiên owns the English content and the progress and does not write the code.
With nobody on the team able to code, that split does not survive contact with AI codegen:
generated code is only as good as the person who can tell whether the output is correct, and
for this product that is the person who understands the node tree.

This is not one person doing everything. It is one person doing the two things nobody else
can do, and genuinely handing off the rest. See the role table in `LICH-TRINH.md`.

**What would change it:** a teammate who can read React.

---

## D11. Antigravity, and how it divides with Claude

The lecturer asked the class to use Google Antigravity. It is an agent-first IDE, a VS Code
fork with an Editor view and a Manager view that runs several agents at once. Free for
individuals in public preview, with rate limits that refresh every few hours.

It has a model picker and Claude is in it. Google's launch post names Gemini 3, Claude
Sonnet 4.5 and GPT-OSS; community reports since then describe Opus-tier Claude entries too.
The list changes, so read the picker rather than this paragraph.

**The division.** Claude in this project conversation does the thinking that is expensive to
get wrong: the node tree, the 33 items and their distractor diagnoses, the scoring rule, the
Vietnamese correction copy. None of that is code. Antigravity owns the repository:
scaffolding, screens, wiring the JSON, fixing what breaks, deploying.

**The handoff is a file, not a copy-paste.** `SPEC.md`, `nodes.json` and `items.json` live in
the repo and the agent is pointed at them. An agent reading the spec off disk produces
something much closer to right than one given a description in a chat box. When the spec
changes, update the file and tell the agent to re-read it.

**Two cautions.** An agentic IDE generates a lot of code quickly and nobody on this team can
review it, so ask for small pieces and click the result after each one. And rate limits
refresh on a timer, so do not leave the build until the last two days.

**Which Claude model:** Opus for the node tree, the scoring engine and the correction copy,
because those need judgement and are expensive to get wrong. Sonnet for bulk item tagging and
repetitive screen building, because those are high volume and low judgement.

---

## D12. What is cut from v1, and said out loud in the demo

A scope you can name is a scope you chose.

Vocabulary tools. Discourse as its own strand, since the beginner method for it does not
exist yet. Speaking and listening. Any AI, speech processing, or runtime API call. Accounts
and login. A teacher dashboard, replaced by rows in a Google Sheet. Payment. A mobile app, as
opposed to a website that works on a phone.

Video is cut from the teaching side: recording, editing and hosting even eight short videos
is several days spent on the part the lecturer is not grading. The lesson page keeps a
visibly reserved video slot and one node gets a real video, so the demo can show the pattern
is proven.

---

## D13. What v1 refuses to claim

*Updated 1 October, see D27: there is no diagnostic any more and the components are three, so the "chưa đo được" lines no longer apply.*

Two components, từ vựng and liên kết, are genuinely not measured. They render as "chưa đo
được trong phiên bản này" rather than as a zero or a grey bar. The level estimate is labelled
an estimate from 33 questions and explicitly not a CEFR test, in a line that does not move
below the fold.

This is a product decision, not modesty. A beginner told by a website that they are A2 will
repeat it to people. And a lecturer asking "why should I believe this" is better answered by
a tool that names its own limits than by one that fills every bar.

For the same reason, the 27 September baseline comparison reports four counts and the
disagreements by name. It does not compute an accuracy percentage from six learners, because
six learners cannot support one.

---

---

# Scope change, 16 September

The three entries below supersede parts of D2, D4 and D12. Where they conflict, these win.

## D14. The deliverable is three things, and code review is light

Confirmed with the lecturer: a deployed website, a pitch, and the source code. Vibecoding is
accepted and the code is reviewed loosely, mainly so there is something technical to look at.

Consequence: the largest risk in the original plan is gone. Nobody on the team could have
reviewed what Antigravity produced, and now nobody has to. The pitch costs about two days in
week three.

Second consequence, and the one that bites: **a pitch needs a claim.** That is what makes D15
a real trade rather than a free cut.

## D15. The diagnostic test is cut. The route is kept.

*Updated 1 October, see D27: the placement screen and gating are removed. The route stays only as a suggested order.*

**Cut:** the 33 authored items with per-option diagnoses, the scoring engine, the confidence
buttons, the level estimate, the node map with red and amber.

**Kept:** the `requires` graph, a placement screen, and gating. Sequencing was always the
differentiator; measurement was one way to drive it and not the only one.

Why the cut is right: the diagnostic was the largest single item in the build and its authoring
was the one thing that could not be delegated. It freed roughly a week out of nineteen days.
The `W1.5d` items were not deterministic yet, so part of that week was rework before it was work.

Why the full cut was wrong: the original brief says plainly that DOL Grammar already owns static
grammar content in Vietnam, and the unanswered question is what a specific student should learn
next. Cutting the diagnostic entirely would have shipped a content library into the crowded
space the brief itself identified.

What replaces it: **in v1 the teacher is the placement.** The owner already knows where his six
students are. Writing items to tell him what he can say from memory is work that only pays when
strangers arrive, which is phase two.

The sealed baseline keeps a job under this. It stops being diagnostic validation and becomes the
starting-step assignment plus the before-measurement.

**What would change it:** strangers using the product, at which point self-placement stops being
reliable and a short placement quiz earns its cost.

## D16. Internal first, and what success means

*Updated 1 October, see D27: the Google Sheet logging is removed, so the success test below can no longer be measured.*

Rollout order: **the owner's six students, then individual learners, then teachers and centres.**

This inverts the B2B2C story in the original brief, which had teachers and centres as the paying
customer from the start. The new order is defensible and probably better, but the pitch narrative
has to carry the new one, not the old.

Why it is better than it sounds: it matches the standing build rule about putting things in front
of real learners. It drops the bar from "a stranger can use this" to "six people I can sit next
to can use this". It removes accounts, onboarding, marketing copy and empty states for strangers.
And it gives the pitch its strongest available shape: not "we believe learners want this" but
"six real learners used it for a week, here is what they did".

**Success is defined before the test, not after: at least three of the six open the site a second
time, unprompted, within a week.**

Two consequences that are easy to miss:

1. **Google Sheet logging moves from optional to required.** It was item 5 on the old cut list.
   It is now the only way to know whether anyone came back, and it cannot be cut.
2. **Nobody may remind the students.** One reminder destroys the measurement. This includes the
   owner, and it is written into the schedule for that reason.

A result of one or two returning is a real finding, not a project failure. It goes into the pitch
as it is. A lecturer will believe an ugly number with a method behind it over a pretty number
with none.

## D17. v1 is one dependency chain: the auxiliary

*Updated 1 October, see D27: with gating removed, the demo moment in the table below no longer exists. The order of the stages stays.*

Three options were weighed: the eight areas where exercises already exist, one chain taught
deeply, or pronunciation only.

**Chosen: one chain.** The chain is the auxiliary verb and everything one move away from it.

| Wins | Loses |
|---|---|
| The pitch, decisively. With the test cut, the route is the only differentiator left, and this is the only option where the route visibly does something. | Reach. One chain may be too easy for the two university students and too hard for the grade 6. |
| A demo moment: a learner clicks step 10, the site refuses and names step 6. | Depends on 100 verb answer keys that do not exist yet. |
| Fewer screens, so more polish per screen, which matters with no coder. | Built on `requires` edges that have not all been confirmed. |

The chain is not narrow in practice: verbs are the largest block in the item bank and the largest
topic in the Vietnamese curriculum from grade 6 to grade 9.

**Rejected, pronunciation only.** It is the most differentiated idea and the owner's most original
work, but it is the option with the *most* authoring, not the least: all 300 written exercises are
grammar and there is no pronunciation item bank at all. It also fails the success bar by design,
since pronunciation is not on the students' school exams, so a grade 8 with a test on Friday will
not open it on Thursday. Testing the best idea against the bar it is least likely to clear would
have taught nothing.

**Rejected, the eight existing areas.** It wins the success bar most directly, because it helps
with tonight's homework. But it is the most DOL-like thing available, and its tree is shallow:
eight areas that sit beside each other rather than behind each other, so the route runs and the
learner never feels it.

The twelve steps, validated against every `requires` edge by `build_nodes.py`:

`W2.1` → `W2.5` → `M1.4` → `M1.5` → `M1.6` → **`W2.2`** → `Y7` → `C4.2` → `C4.3` → `Y1` → `Y2` → `Y3`

Step 6 is the root. Steps 7 to 12 are each one move from it. That is the teaching claim, it comes
straight from the owner's own grammar document, and it is what the pitch argues.

**What would change it:** after 5 October, the other seven areas become browsable practice, which
is the hybrid that was not chosen now only because it costs an extra day and a half.

## Still open

1. **The `requires` edges inside the chain.** Confirmed as an order by `build_nodes.py`, but the
   pedagogy behind each edge is still the owner's to verify. A wrong edge now ships a wrong
   teaching order, which is worse than shipping none.
2. **The beginner correction register.** See D9.
3. **Answer keys for the 100 verb items.** Now the critical path: three of the twelve steps draw
   their practice from them, and only the owner can write them.
4. **Whether Giang and Mạnh actually agreed to build this idea.** The group vote has not
   happened and is not recorded anywhere.
5. **Lecturer questions:** must every member have written code, and is the presentation live
   or recorded.

## After 5 October

Written down so the cuts above stay cuts rather than losses. Roughly in order: audio
recording and the read-aloud task, the free-write with AI grading, the Cụm từ and Mệnh đề
levels, the discourse component, a teacher dashboard, and only then anything commercial.

The thing worth protecting is the node tree. Everything else here is replaceable.


## D18. Claude Code builds the website, and Kiên builds it alone

Decided 18 and 21 September. Claude Code replaces Antigravity for the build; D11 is superseded.
Kiên owns the website end to end. Mạnh, Giang and Trang own testing, the slides, the report and
the presentation. One builder removes every handoff inside the code, which is the fastest shape
for a fourteen-day build. The cost is a bus factor of one on the website.

## D19. The correction loop runs four steps, not five

Decided 21 September. The teacher removed every `fallback_vi`, finding them repetitive, so step
5 of the five-step loop, phòng tránh, is skipped for every item. The loop on the site is sai,
nhận thức, biết, hiểu, and then the learner answers the item again. The field stays in the schema
as `null`, so step 5 can come back without a migration.

## D20. Four more L1 tags, and one synthesis node

Decided 21 September. `AJO` adjective order, `OBJ` dropped object, `DVB` dropped verb and `NQA`
answering a negative question by agreement join the original seven. `Y13` is a synthesis node for
the tense summary material, added as stage 14; irregular verbs move to stage 15. `W1.4` and
`W3.2` leave v1. Stages 14 and 15 were later merged into stage 11, see D26.

## D21. The product is named Trika English

*Updated 1 October, see D27: the `localStorage` key prefix no longer exists, because nothing is stored.*

Decided 22 September, replacing CommBat English. Reasons: easier for Vietnamese speakers to say
and spell (two syllables that already exist in Vietnamese, no doubled consonant), sounds light and
quick, which fits a friendly beginner product, and avoids the fighting meaning of "combat", which
clashes with the calm design and the error-friendly correction loop. A Vietnamese tagline carries
the benefit the name itself does not.

Only the visible name changes. The GitHub repo `commbat-english`, the Vercel address and the
`localStorage` key prefix `commbat:` stay as they are: they are invisible to learners, and
changing the key or the address after learners start would wipe their saved progress.

## D22. Không có khẩu hiệu trên màn hình nhập tên

*Cập nhật 01/10, xem D27: màn hình nhập tên không còn. Quy tắc không dùng khẩu hiệu rỗng nghĩa vẫn áp dụng cho mọi màn hình.*

Chốt ngày 23/09. Khẩu hiệu dưới logo là dấu hiệu rõ nhất khiến giao diện bị đọc thành "do AI
sinh ra": một câu rỗng nghĩa, căn giữa, không nói thêm điều gì mà màn hình sau chưa nói. Màn
hình đầu chỉ còn logo, ô nhập tên và nút bắt đầu. Câu "Ngữ pháp, từng bước một" giữ lại cho
tiêu đề trình duyệt, slide và báo cáo. Danh sách mười dấu hiệu và nguồn nằm ở `KHONG-GIONG-AI.md`.

## D23. Bỏ phần "Theo danh từ chỉ người hoặc danh từ chỉ vật"

Chốt ngày 24/09. Kiên thấy cách chia người / vật mâu thuẫn với bốn nhóm ở phần định nghĩa
material #1: người và con vật đều nằm trong nhóm sinh vật, nên hỏi lại "chỉ người hay chỉ vật"
buộc người học xếp cùng một danh từ vào hai hệ thống khác nhau. Cắt cả tiêu đề, bảng và câu hỏi
W1.6-01. Node `W1.6` ra khỏi v1, thêm vào EXCLUDE trong `build_nodes.py`. Cũng bỏ đoạn ba câu
hỏi xếp nhóm, vì bốn nhóm đã tự nói ra thứ tự đó. V1 còn 33 node và 68 câu hỏi.

## D24. Đổi tiền tố lưu tiến độ thành `trika:`

*Cập nhật 01/10, xem D27: không còn lưu tiến độ, nên tiền tố này không còn dùng.*

Chốt ngày 24/09, thay phần nói về `localStorage` trong D21. Tên sản phẩm là Trika English, nên
khoá lưu trong máy người học cũng mang tên đó. Repo và địa chỉ Vercel vẫn giữ `commbat-english`.

Không cần chuyển dữ liệu. Sáu học viên chưa được giới thiệu trang web, chưa ai dùng thật, nên
không có tiến độ nào để mất. Đổi tên sớm hơn một ngày tránh được đúng việc đó. Sau khi học viên
bắt đầu dùng ngày 25/09 thì tiền tố này là cố định: đổi nữa sẽ xoá sạch tiến độ của họ.

## D25. Luyện tập: 23 phần, 230 câu, sáu loại câu hỏi

*Cập nhật 01/10, xem D27: không còn trạng thái "xong" nên luyện tập không còn chờ giai đoạn xong mới mở. Luyện tập vẫn nằm trong trang và không lưu gì.*

Chốt ngày 25/09. Mỗi giai đoạn có một đến ba phần luyện tập, mở sau khi giai đoạn đó xong và
không bao giờ chặn giai đoạn sau. Giai đoạn 11 có hai phần luyện tập hai bước (11.1 thì và thể,
11.2 chủ động và bị động), phủ các material của giai đoạn 11 sau khi các giai đoạn cuối gộp vào
đó (D26). Định dạng dữ liệu nằm ở `PRACTICE-SPEC.md`, nội dung ở `content/practice/`.

Sáu loại: `select_words` (chọn từ trong câu), `sort_two` (kéo vào hai cột), `mcq`, `blank`,
`reorder` (sắp xếp), `two_step` (chọn thì thể dạng rồi sắp xếp). Bốn loại đầu tiên trong số
`select_words`, `sort_two`, `reorder`, `two_step` chưa có trong code.

Thứ tự dựng, theo rủi ro giảm dần: `select_words` và `sort_two` trước vì phủ giai đoạn 1, 2, 3,
5, 6; rồi `reorder` cho giai đoạn 4, 8, 9, 10; cuối cùng `two_step` cho giai đoạn 11. Nếu đến
02/10 không kịp thì bỏ `two_step`, vì nó tốn nhiều code nhất mà phủ ít nhất.

Không chấm điểm ở bất cứ đâu trong luyện tập. Sai thì chạy vòng bốn bước như material.

## D26. Gộp giai đoạn 12 đến 15 vào giai đoạn 11

Chốt ngày 28/09, thay phần D20 nói `Y13` là giai đoạn 14 và động từ bất quy tắc là giai đoạn 15.
Kiên gộp các giai đoạn cuối lại, nên lộ trình còn **mười một giai đoạn** và vẫn mười sáu
material. Giai đoạn 11 là giai đoạn cuối và có năm material: 12 thì, 13 thể, 14 dạng bị động,
15 tổng hợp các thì, 16 động từ bất quy tắc. Sau giai đoạn 11 không còn giai đoạn nào.

Thứ tự dạy không đổi, chỉ đổi ranh giới khoá: năm material của giai đoạn 11 mở cùng lúc khi
học viên tới giai đoạn này.

Hệ quả cần làm trong code: gán lại `stage` trong `build_nodes.py` và sinh lại `nodes.json`;
kiểm tra bộ kiểm `requires` vẫn chấp nhận hai node cùng giai đoạn khi thứ tự material đúng;
kẹp `current_stage` đã lưu về tối đa 11 khi tải; bỏ mọi chỗ cứng số 15.

## D27. Bỏ tên người học, xếp lớp, giáo viên, khoá giai đoạn, tiến độ và nhật ký. Còn ba thành phần

Chốt ngày 01/10, sau khi Kiên thêm trang chủ, thanh trên cùng và menu toàn màn hình. Bốn việc bỏ, và một việc đổi.

**Bỏ:**
1. **Nhật ký Google Sheet.** Trang không gửi gì về người học. Không còn lệnh POST, không còn URL Apps Script.
2. **Màn hình nhập tên, màn hình xếp lớp, chế độ giáo viên chọn giai đoạn và trang liên kết giáo viên.** Trang không có tài khoản và không thu thập thông tin cá nhân.
3. **Khoá giai đoạn.** Mọi giai đoạn của Ngữ pháp mở sẵn. Thứ tự từ giai đoạn 1 đến 11 chỉ còn là gợi ý.
4. **Theo dõi tiến độ.** Không đọc và không ghi `localStorage`. Không lưu gì trong máy người học.

**Đổi:** ba thành phần thay cho năm: Ngữ pháp, Phát âm, Từ vựng. Liên kết (discourse) nằm trong Ngữ pháp. Thành phần "tiếp xúc" (exposure) bỏ.

**Vì sao:** Kiên chọn một trang chỉ để học, không thu thập dữ liệu, trước khi có hạ tầng tài khoản. Tài khoản học viên và giáo viên, nối với nhau qua lớp học, để sau.

**Hệ quả với các quyết định cũ. Mỗi mục dưới đây bị thay thế một phần:**
- **D13:** "hai thành phần chưa đo được" không còn nghĩa, vì không còn bài kiểm tra chẩn đoán. Còn ba thành phần, chỉ Ngữ pháp có nội dung. Các tab Phát âm, Từ vựng, IELTS là trang "Chưa có".
- **D15:** màn hình xếp lớp và khoá giai đoạn bị bỏ. Đường đi 11 giai đoạn còn lại như thứ tự gợi ý, không chặn ai.
- **D16:** bài kiểm tra "ba trong sáu học viên quay lại trong một tuần" không đo được nữa vì không còn nhật ký. Nhật ký Google Sheet từ "bắt buộc" thành "bỏ". Sheet cũ vẫn chứa tên và câu trả lời của các học viên đã dùng trang. Việc tắt Apps Script hay xoá sheet là quyết định riêng của Kiên, chưa làm. Nếu cần số liệu cho bài thuyết trình, ghi lại kết quả của các tuần đã chạy trước khi gộp vào `main`.
- **D17:** khoảnh khắc demo "bấm giai đoạn 10, trang từ chối và chỉ ra giai đoạn 6" không còn. Luận điểm "trợ động từ là gốc" vẫn nằm trong thứ tự các giai đoạn và trong nội dung.
- **D21 và D24:** tiền tố `trika:` của `localStorage` không còn dùng.
- **D25:** các phần luyện tập không còn "mở sau khi giai đoạn đó xong", vì không còn trạng thái xong.
- **D19:** giữ nguyên. Vòng sửa lỗi bốn bước vẫn chạy trong trang và không cần lưu gì.

**Cái gì sẽ đảo ngược quyết định này:** tài khoản học viên và giáo viên nối qua lớp học. Khi đó phải quyết định lại: có đăng nhập Google không, có học sinh lớp 6 dùng tài khoản Google không, và thu thập dữ liệu gì.
