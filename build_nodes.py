#!/usr/bin/env python3
"""Build nodes.json for the diagnostic tree. Single source of truth: this file."""
import json, sys
from collections import OrderedDict

N = []

def n(id, parent, axis, level, vi, en, cefr=None, teach="teach", v1=False,
      req=None, l1=None, src=None, old=None, cgel=None, note=None):
    N.append(OrderedDict([
        ("id", id), ("parent", parent), ("axis", axis), ("level", level),
        ("label_vi", vi), ("label_cgel_vi", cgel), ("label_en", en),
        ("component", "grammar" if axis in ("form","function","system","packaging","construction")
                      else ("vocabulary" if axis == "lexis" else axis)),
        ("cefr", cefr), ("teach", teach), ("tested_in_v1", v1),
        ("requires", req or []), ("l1_tags", l1 or []),
        ("item_source", src), ("old_id", old), ("note", note),
    ]))

# ----------------------------------------------------------------- AXIS 1 FORM
# --- text -------------------------------------------------------------------
n("T", None, "form", "text", "Văn bản", "Text", "B1", "teach", False,
  note="New level. Component 4 (discourse) lives here. Not tested in v1.")
n("T1", "T", "form", "text", "Liên kết", "Cohesion", "B1", "teach", False, ["S"])
n("T1.1", "T1", "form", "text", "Từ nối", "Discourse markers", "B1", "teach", False, ["T1"])
n("T1.2", "T1", "form", "text", "Từ quy chiếu", "Reference words", "B1", "teach", False, ["W1.5a"],
  src="Cách để học tiếng Anh, mục Discourses")
n("T1.3", "T1", "form", "text", "Phép thế", "Substitution (do, so, not, one/ones)", "B1", "teach", False, ["T1.2"],
  src="Cách để học tiếng Anh, mục Discourses")
n("T1.4", "T1", "form", "text", "Phép lược", "Ellipsis", "B2", "teach", False, ["T1.3"])
n("T2", "T", "form", "text", "Mạch lạc", "Coherence", "B1", "teach", False, ["T1"])
n("T2.1", "T2", "form", "text", "Trật tự thông tin", "Information ordering, given and new", "B2", "teach", False, ["T2"])
n("T2.2", "T2", "form", "text", "Cấu trúc đoạn", "Paragraph and topic structure", "B1", "teach", False, ["T2"])

# --- sentence ---------------------------------------------------------------
n("S", None, "form", "sentence", "Câu", "Sentence", "A1", "teach", False, ["C"])
n("S1", "S", "form", "sentence", "Phân loại theo cấu tạo", "By clause composition", "A2", "teach", False, ["S"])
n("S1.1", "S1", "form", "sentence", "Câu đơn", "Simple sentence", "A1", "teach", False, ["C1.1"], src="Bài 6")
n("S1.2", "S1", "form", "sentence", "Câu ghép", "Compound sentence", "A2", "teach", False, ["S1.1","W7"], src="Bài 6")
n("S1.3", "S1", "form", "sentence", "Câu phức", "Complex sentence", "B1", "teach", False, ["S1.1","C1.2"], src="Bài 6")
n("S1.4", "S1", "form", "sentence", "Câu phức ghép", "Compound-complex sentence", "B1", "teach", False,
  ["S1.2","S1.3"], note="Missing from the original list. The fourth structural type.")
n("S2", "S", "form", "sentence", "Phân loại theo tính hoàn chỉnh", "By completeness", "B1", "system-only", False, ["S"])
n("S2.1", "S2", "form", "sentence", "Câu đầy đủ", "Major (regular) sentence", "A1", "system-only", False, ["S2"])
n("S2.2", "S2", "form", "sentence", "Câu đặc biệt", "Minor (irregular) sentence", "B1", "system-only", False, ["S2"],
  note="Yes. Ouch! The more the merrier. Needed so the four structural types are exhaustive.")

# --- clause -----------------------------------------------------------------
n("C", None, "form", "clause", "Mệnh đề", "Clause", "A1", "teach", False, ["P"])
n("C1", "C", "form", "clause", "Theo tính độc lập", "By dependency", "A2", "teach", False, ["C"])
n("C1.1", "C1", "form", "clause", "Mệnh đề độc lập", "Independent clause", "A1", "teach", False, ["C5.1"], src="Bài 6")
n("C1.2", "C1", "form", "clause", "Mệnh đề phụ thuộc", "Subordinate clause", "B1", "teach", False, ["C1.1","W8"], src="Bài 6")
n("C2", "C", "form", "clause", "Theo tính hữu hạn", "By finiteness", "B1", "teach", False, ["C"])
n("C2.1", "C2", "form", "clause", "Mệnh đề hữu hạn", "Finite clause", "B1", "teach", False, ["W2.2"])
n("C2.2", "C2", "form", "clause", "Mệnh đề phi hữu hạn", "Non-finite clause", "B1", "teach", False, ["C2.1"])
n("C2.2a", "C2.2", "form", "clause", "Mệnh đề to-V", "To-infinitival clause", "B1", "teach", False, ["C2.2"])
n("C2.2b", "C2.2", "form", "clause", "Mệnh đề V nguyên thể", "Bare infinitival clause", "B1", "teach", False, ["C2.2"])
n("C2.2c", "C2.2", "form", "clause", "Mệnh đề V-ing", "Gerund-participial clause", "B1", "teach", False, ["C2.2","W2.8"],
  cgel="Mệnh đề phân từ V-ing")
n("C2.2d", "C2.2", "form", "clause", "Mệnh đề V-3", "Past-participial clause", "B1", "teach", False, ["C2.2","W2.8"])
n("C2.3", "C2", "form", "clause", "Mệnh đề không động từ", "Verbless clause", "B2", "system-only", False, ["C2.2"])
n("C3", "C", "form", "clause", "Theo chức năng của mệnh đề phụ thuộc", "By function of the subordinate clause",
  "B1", "teach", False, ["C1.2"])
n("C3.1", "C3", "form", "clause", "Mệnh đề quan hệ", "Relative clause", "B1", "teach", False, ["C3","W1.5f"],
  l1=["RCO"], src="Bài 6")
n("C3.1a", "C3.1", "form", "clause", "Mệnh đề quan hệ xác định", "Integrated (defining) relative", "B1", "teach", False,
  ["C3.1"], l1=["RCO"], src="Bài 6")
n("C3.1b", "C3.1", "form", "clause", "Mệnh đề quan hệ không xác định", "Supplementary (non-defining) relative",
  "B1", "teach", False, ["C3.1a"], l1=["RCO"], src="Bài 7")
n("C3.1c", "C3.1", "form", "clause", "Mệnh đề quan hệ gộp", "Fused relative", "B2", "system-only", False, ["C3.1a"],
  note="What he said was true.")
n("C3.2", "C3", "form", "clause", "Mệnh đề danh ngữ", "Content clause", "B1", "teach", False, ["C3"],
  cgel="Mệnh đề nội dung", note="Where reported speech and the mandative subjunctive both live.")
n("C3.2a", "C3.2", "form", "clause", "Mệnh đề that", "Declarative content clause", "B1", "teach", False, ["C3.2"])
n("C3.2b", "C3.2", "form", "clause", "Mệnh đề whether/if", "Interrogative content clause", "B1", "teach", False, ["C3.2"])
n("C3.2c", "C3.2", "form", "clause", "Mệnh đề cảm thán", "Exclamative content clause", "B2", "system-only", False, ["C3.2"])
n("C3.3", "C3", "form", "clause", "Mệnh đề trạng ngữ", "Adjunct (adverbial) clause", "B1", "teach", False, ["C3"], src="Bài 6")
n("C3.3a", "C3.3", "form", "clause", "Thời gian, nơi chốn, cách thức", "Time, place, manner", "A2", "teach", False,
  ["C3.3"], src="Bài 6")
n("C3.3b", "C3.3", "form", "clause", "Điều kiện, nhượng bộ", "Condition, concession", "B1", "teach", False,
  ["C3.3"], src="Bài 6")
n("C3.3c", "C3.3", "form", "clause", "Nguyên nhân, mục đích, kết quả", "Reason, purpose, result", "B1", "teach", False,
  ["C3.3"], src="Bài 6")
n("C3.4", "C3", "form", "clause", "Mệnh đề so sánh", "Comparative clause", "B1", "teach", False, ["C3"])
n("C4", "C", "form", "clause", "Theo mục đích nói", "By clause type", "A1", "teach", False, ["C"],
  cgel="Kiểu mệnh đề", note="This is the half of 'mood' that survives. See also Y6.")
n("C4.1", "C4", "form", "clause", "Câu trần thuật", "Declarative", "A1", "teach", False, ["C4"])
n("C4.2", "C4", "form", "clause", "Câu hỏi Yes/No", "Closed interrogative", "A1", "teach", False, ["C4","W2.2"], l1=["AUX"])
n("C4.3", "C4", "form", "clause", "Câu hỏi Wh-", "Open interrogative", "A1", "teach", False, ["C4.2"], l1=["AUX"])
n("C4.4", "C4", "form", "clause", "Câu mệnh lệnh", "Imperative", "A1", "teach", False, ["C4"],
  note="Plain verb form, no ending of its own. This is why English has no inflectional mood.")
n("C4.5", "C4", "form", "clause", "Câu cảm thán", "Exclamative", "A2", "teach", False, ["C4"])
n("C5", "C", "form", "clause", "Thành phần và mẫu câu", "Clause elements and patterns", "A1", "teach", False, ["C"])
n("C5.1", "C5", "form", "clause", "Thành phần mệnh đề", "Clause elements (S, V, O, C, A)", "A1", "teach", True,
  ["C5"], note="Maps to the function axis F1 to F8.")
n("C5.2", "C5", "form", "clause", "Các mẫu câu cơ bản", "Canonical patterns SV to SVOA", "A2", "teach", True,
  ["C5.1","W2.6"])

# --- phrase -----------------------------------------------------------------
n("P", None, "form", "phrase", "Cụm từ", "Phrase", "A1", "teach", False, ["W"],
  note="One phrase type per head word class. This generator makes the level MECE by construction.")
n("P1", "P", "form", "phrase", "Cụm danh từ", "Noun phrase", "A1", "teach", True, ["W1"], old="P1")
n("P1.1", "P1", "form", "phrase", "Bổ nghĩa trước", "Premodifiers", "A2", "teach", True, ["P1","W6","W3"])
n("P1.2", "P1", "form", "phrase", "Bổ nghĩa sau", "Postmodifiers", "B1", "teach", False, ["P1","P5","C3.1"])
n("P1.3", "P1", "form", "phrase", "Cụm chỉ đơn vị", "Partitive phrase", "A2", "teach", False, ["P1","W1.2"],
  src="Ngữ pháp Tiếng Anh, mục vật chứa đựng", note="a bottle of water, a pair of trousers, a grain of rice.")
n("P2", "P", "form", "phrase", "Cụm động từ", "Verb phrase", "A2", "teach", False, ["W2"], old="P2",
  note="Split from the old P2. The phrasal-verb sense moved to L3.")
n("P3", "P", "form", "phrase", "Cụm tính từ", "Adjective phrase", "A2", "teach", False, ["W3"], old="P3")
n("P3.1", "P3", "form", "phrase", "Trật tự tính từ", "Adjective order (OSASCOMP)", "B1", "teach", False, ["P3"],
  src="Ngữ pháp Tiếng Anh, mục OSASCOMP")
n("P4", "P", "form", "phrase", "Cụm trạng từ", "Adverb phrase", "A2", "teach", False, ["W4"],
  note="Missing from the original list.")
n("P5", "P", "form", "phrase", "Cụm giới từ", "Preposition phrase", "A2", "teach", False, ["W5"],
  note="Missing from the original list.")
n("P6", "P", "form", "phrase", "Cụm hạn định từ", "Determinative phrase", "B2", "system-only", False, ["W6"],
  cgel="Cụm từ hạn định", note="far too many people. Cambridge only.")

# --- word -------------------------------------------------------------------
n("W", None, "form", "word", "Từ", "Word", "A1", "teach", False, ["M"],
  note="Nine classes that partition without remainder.")

n("W1", "W", "form", "word", "Danh từ", "Noun", "A1", "teach", True, ["W"], old="W1", src="Bài 1")
n("W1.1", "W1", "form", "word", "Số ít / số nhiều", "Singular and plural", "A1", "teach", True, ["W1"],
  l1=["PLS"], src="Bài 1", old="W1.1")
n("W1.2", "W1", "form", "word", "Đếm được / không đếm được", "Count and non-count", "A1", "teach", True,
  ["W1.1"], src="Bài 1", old="W1.2")
n("W1.3", "W1", "form", "word", "Danh từ chung / riêng", "Common and proper", "A1", "teach", False, ["W1"], old="W1.3")
n("W1.4", "W1", "form", "word", "Danh từ tập hợp", "Collective noun", "A2", "teach", True, ["W1.1"],
  src="Bài 1", old="W1.4")
n("W1.5", "W1", "form", "word", "Đại từ", "Pronoun", "A1", "teach", True, ["W1.1"],
  cgel="Đại từ (tiểu loại của danh từ)",
  note="School grammar makes this a sibling of noun. Cambridge makes it a subclass. School labels are primary here, but the structure follows Cambridge.")
n("W1.5a", "W1.5", "form", "word", "Đại từ nhân xưng", "Personal pronoun", "A1", "teach", True, ["W1.5"],
  src="Bài 3", old="W5.1")
n("W1.5b", "W1.5", "form", "word", "Đại từ phản thân", "Reflexive pronoun", "A2", "teach", True, ["W1.5a"], src="Bài 3")
n("W1.5c", "W1.5", "form", "word", "Đại từ sở hữu", "Possessive pronoun", "A1", "teach", True, ["W1.5a"], src="Bài 3")
n("W1.5d", "W1.5", "form", "word", "Đại từ bất định", "Indefinite pronoun", "A2", "teach", True, ["W1.5a","W1.2"],
  src="Bài 4", old="W5.2",
  note="Highest-priority node. Baseline predicts weak in 4 of 6 learners, and Bài 4 items are the least deterministic in the bank. Rewrite every item here before use.")
n("W1.5e", "W1.5", "form", "word", "Đại từ chỉ định", "Demonstrative pronoun", "A1", "teach", False, ["W1.5"])
n("W1.5f", "W1.5", "form", "word", "Đại từ quan hệ", "Relative pronoun", "B1", "teach", False, ["W1.5"], l1=["RCO"])
n("W1.6", "W1", "form", "word", "Danh từ chỉ người / chỉ vật", "Personal and non-personal nouns", "A1", "teach",
  False, ["W1"],
  note="Semantic in Cambridge, not a grammatical subclass. Kept because it has grammatical reflexes: he/she against it, who against which, and the preference for the 's genitive with people. Material 1.")
n("W1.7", "W1", "form", "word", "Danh từ cụ thể / trừu tượng", "Concrete and abstract nouns", "A2", "teach",
  False, ["W1"],
  note="Semantic, like W1.6. Tends to correlate with W1.2 but does not determine it: rain is concrete and non-count, an idea is abstract and count. Teach the tendency, never as a rule. Material 1.")

n("W2", "W", "form", "word", "Động từ", "Verb", "A1", "teach", True, ["W"], old="W2", src="Dịch câu theo thì")
n("W2.1", "W2", "form", "word", "Động từ chính", "Lexical verb", "A1", "teach", True, ["W2"], old="W2.1")
n("W2.2", "W2", "form", "word", "Trợ động từ", "Auxiliary verb", "A1", "teach", True, ["W2.1"],
  l1=["AUX"], old="W2.1",
  note="be, have, do. The root of the whole verb system: nothing above it is teachable first.")
n("W2.3", "W2", "form", "word", "Động từ khuyết thiếu", "Modal auxiliary", "A2", "teach", False, ["W2.2"], old="W2.4")
n("W2.4", "W2", "form", "word", "Động từ chỉ trạng thái / hành động", "Stative and dynamic verbs", "A2", "teach", False,
  ["W2.1"], note="New. This is what blocks *I am knowing. Gates the progressive.")
n("W2.5", "W2", "form", "word", "Động từ có quy tắc / bất quy tắc", "Regular and irregular verbs", "A1", "teach", True,
  ["W2.1","M1.4","M1.5"], src="Ngữ pháp Tiếng Anh, bảng động từ bất quy tắc",
  note="Taught last, as the systematisation of exceptions to a rule the learner already has.")
n("W2.6", "W2", "form", "word", "Nội động từ / ngoại động từ", "Intransitive, transitive, ditransitive", "A2", "teach",
  False, ["W2.1"], note="New. Determines which clause patterns in C5.2 are available.")
n("W2.7", "W2", "form", "word", "Động từ nối", "Copular verb", "A2", "teach", False, ["W2.1"],
  note="New. be, seem, become, look, feel. Takes a predicative complement, not an object.")
n("W2.8", "W2", "form", "word", "Danh động từ và phân từ", "Gerund and participle", "B1", "teach", False,
  ["W2.1","M1.5","M1.6"], cgel="Dạng V-ing và phân từ", old="W2.5")

n("W3", "W", "form", "word", "Tính từ", "Adjective", "A1", "teach", True, ["W"], old="W3", src="Bài 2")
n("W3.1", "W3", "form", "word", "Tính từ -ed / -ing", "-ed and -ing adjectives", "A2", "teach", True,
  ["W3"], src="Bài 2", old="W3.1",
  note="Edge to W2.8 dropped 16 Sep by the teacher: bored against boring is learnable as a vocabulary pair before participles exist.")
n("W3.2", "W3", "form", "word", "Tính từ gốc", "Plain adjective", "A1", "teach", True, ["W3"], old="W3.2")

n("W4", "W", "form", "word", "Trạng từ", "Adverb", "A1", "teach", True, ["W"], old="W4", src="Bài 2")
n("W4.1", "W4", "form", "word", "Hình thức -ly", "Adverb formation with -ly", "A1", "teach", True, ["W4","W3"],
  src="Bài 2", old="W4.1")
n("W4.2", "W4", "form", "word", "Các loại trạng từ", "Adverb types", "A2", "teach", True, ["W4.1"], old="W4.2")
n("W4.3", "W4", "form", "word", "Vị trí trạng từ", "Adverb position", "B1", "teach", False, ["W4.2","C5.2"],
  note="New. Form and type were covered; placement was not.")

n("W5", "W", "form", "word", "Giới từ", "Preposition", "A1", "teach", True, ["W"], old="W7",
  cgel="Giới từ (bao gồm nhiều liên từ phụ thuộc truyền thống)",
  note="Cambridge widens this class: since, before, after take either a noun phrase or a clause and behave the same either way.")
n("W5.1", "W5", "form", "word", "Giới từ thời gian", "Prepositions of time", "A1", "teach", True, ["W5"], old="W7.2")
n("W5.2", "W5", "form", "word", "Giới từ nơi chốn", "Prepositions of place", "A1", "teach", True, ["W5"], old="W7.3")
n("W5.3", "W5", "form", "word", "Giới từ chuyển động", "Prepositions of movement", "A2", "teach", False, ["W5.2"])

n("W6", "W", "form", "word", "Từ hạn định", "Determinative", "A1", "teach", True, ["W"],
  cgel="Từ hạn định", old="W6",
  note="The class. Determiner (F10) is the function it fills. Replaces the separate article and quantifier entries.")
n("W6.1", "W6", "form", "word", "Mạo từ", "Article", "A1", "teach", True, ["W6","W1.2"],
  l1=["ART"], src="Bài 5", old="W6")
n("W6.1a", "W6.1", "form", "word", "Mạo từ a/an", "Indefinite article", "A1", "teach", True, ["W6.1","W1.1"],
  l1=["ART"], src="Bài 5", old="W6.1")
n("W6.1b", "W6.1", "form", "word", "Mạo từ the", "Definite article", "A1", "teach", True, ["W6.1a"],
  l1=["ART"], src="Bài 5", old="W6.2")
n("W6.1c", "W6.1", "form", "word", "Mạo từ rỗng", "Zero article", "A2", "teach", True, ["W6.1b","W1.2"],
  l1=["ART"], src="Bài 5", old="W6.3",
  note="Baseline predicts weak in 3 of 6 learners. Unteachable before count and non-count (W1.2).")
n("W6.2", "W6", "form", "word", "Từ chỉ định", "Demonstrative determinative", "A1", "teach", False, ["W6"])
n("W6.3", "W6", "form", "word", "Lượng từ", "Quantifier", "A1", "teach", True, ["W6","W1.2"], src="Bài 4",
  note="Was a top-level class in the original list. It is a subtype of determinative.")
n("W6.4", "W6", "form", "word", "Tính từ sở hữu", "Possessive determinative", "A1", "teach", True, ["W6","W1.5a"],
  src="Bài 3")
n("W6.5", "W6", "form", "word", "Số từ", "Numeral", "A1", "teach", False, ["W6"])

n("W7", "W", "form", "word", "Liên từ kết hợp", "Coordinator", "A2", "teach", True, ["W"],
  cgel="Liên từ đẳng lập", src="Bài 7",
  note="FANBOYS. Joins units of equal status. Split out of the single conjunction class.")
n("W8", "W", "form", "word", "Liên từ phụ thuộc", "Subordinator", "B1", "teach", False, ["W7"],
  cgel="Liên từ phụ thuộc (phạm vi hẹp)",
  note="that, whether, if, for. Cambridge keeps this class deliberately small; most traditional members are prepositions (W5).")
n("W9", "W", "form", "word", "Thán từ", "Interjection", "A1", "teach", False, ["W"],
  note="Was called 'exclamation' in the original list.")

# --- morpheme ---------------------------------------------------------------
n("M", None, "form", "morpheme", "Hình vị", "Morpheme", "A2", "teach", False)
n("M1", "M", "form", "morpheme", "Hình vị biến tố", "Inflectional morpheme", "A1", "teach", False, ["M"],
  note="English has exactly eight, plus the irrealis remnant. These are the exponents of the system axis.")
n("M1.1", "M1", "form", "morpheme", "Đuôi -s số nhiều", "Plural -s", "A1", "teach", True, ["M1"],
  l1=["PLS","SZ"], src="Bài 1")
n("M1.2", "M1", "form", "morpheme", "Đuôi -'s sở hữu", "Genitive -'s", "A1", "teach", False, ["M1"], l1=["SZ"])
n("M1.3", "M1", "form", "morpheme", "Đuôi -s ngôi 3 số ít", "Third person singular -s", "A1", "teach", True,
  ["M1","W2.2"], l1=["PLS","SZ"])
n("M1.4", "M1", "form", "morpheme", "Đuôi -ed quá khứ", "Past tense -ed", "A1", "teach", True, ["M1"], l1=["FCC"],
  note="Edge corrected 16 Sep: -ed is the rule and irregulars are the exception, so W2.5 depends on this, not the reverse.")
n("M1.5", "M1", "form", "morpheme", "Phân từ quá khứ", "Past participle", "A2", "teach", True, ["M1.4"])
n("M1.6", "M1", "form", "morpheme", "Đuôi -ing", "Progressive -ing", "A1", "teach", True, ["M1"])
n("M1.7", "M1", "form", "morpheme", "Đuôi -er so sánh hơn", "Comparative -er", "A1", "teach", False, ["M1"])
n("M1.8", "M1", "form", "morpheme", "Đuôi -est so sánh nhất", "Superlative -est", "A1", "teach", False, ["M1"])
n("M1.9", "M1", "form", "morpheme", "Dạng irrealis của be", "Irrealis form of be", "B1", "system-only", False, ["M1"],
  note="The only surviving inflectional remnant of the subjunctive: one verb (be), first and third person singular. Surfaces inside X1.3 and X5, never taught as a topic of its own.")
n("M2", "M", "form", "morpheme", "Hình vị phái sinh", "Derivational morpheme", "B1", "teach", False, ["M"], old="W8")
n("M2.1", "M2", "form", "morpheme", "Tiền tố", "Prefix", "B1", "teach", False, ["M2"],
  src="Ngữ pháp Tiếng Anh, mục Cấu tạo từ", old="W8.1")
n("M2.2", "M2", "form", "morpheme", "Hậu tố", "Suffix", "B1", "teach", False, ["M2"],
  src="Ngữ pháp Tiếng Anh, mục Cấu tạo từ", old="W8.2")
n("M2.3", "M2", "form", "morpheme", "Từ ghép", "Compounding", "A2", "teach", False, ["M2"])
n("M2.4", "M2", "form", "morpheme", "Chuyển loại từ", "Conversion", "B1", "teach", False, ["M2"])

# ------------------------------------------------------------- AXIS 2 FUNCTION
FN = [("F1","Chủ ngữ","Subject","A1"),("F2","Vị ngữ","Predicator","A1"),
      ("F3","Tân ngữ trực tiếp","Direct object","A1"),("F4","Tân ngữ gián tiếp","Indirect object","A2"),
      ("F5","Bổ ngữ chủ ngữ","Subject predicative complement","A2"),
      ("F6","Bổ ngữ tân ngữ","Object predicative complement","B1"),
      ("F7","Bổ ngữ của giới từ, danh từ, tính từ","Complement of P, N, A","B1"),
      ("F8","Trạng ngữ","Adjunct","A2"),("F9","Từ bổ nghĩa","Modifier","A2"),
      ("F10","Từ hạn định (vị trí)","Determiner (the slot)","A1"),
      ("F11","Trung tâm","Head","A2"),("F12","Thành phần bổ sung","Supplement","B2")]
n("F", None, "function", None, "Chức năng ngữ pháp", "Grammatical function", "A1", "teach", False,
  note="Relational: always subject OF something. One form fills many functions, which is why function is never a branch of form.")
for fid, vi, en, lv in FN:
    n(fid, "F", "function", None, vi, en, lv, "teach", fid in ("F1","F2","F3"), ["F"])

# --------------------------------------------------------------- AXIS 3 SYSTEM
n("Y", None, "system", None, "Hệ thống ngữ pháp", "Grammatical systems", "A1", "teach", False,
  note="Meaning choices applied to a form.")
n("Y1", "Y", "system", None, "Thì", "Tense", "A1", "teach", True, ["Y","W2.2"],
  l1=["BSH"], src="Dịch câu theo thì", old="W2.2",
  note="English has two inflectional tenses, past and present. The future column of the 3x4 grid is formed with the modal will, which the learner already met at stage 6. Teaching modals before tense turns that from a contradiction into a forward reference.")
n("Y2", "Y", "system", None, "Thể", "Aspect (perfect, progressive)", "A2", "teach", True, ["Y1"],
  src="Dịch câu theo thì", old="W2.2",
  note="Tense and aspect are two independent systems. That is why the grid is three by four, not a list of twelve. Split from the old W2.2 so a learner weak on aspect but fine on tense does not read as one undifferentiated red.")
n("Y3", "Y", "system", None, "Dạng chủ động / bị động", "Voice", "B1", "teach", True, ["Y2","M1.5"],
  src="Chuyển sang bị động", old="W2.3")
n("Y4", "Y", "system", None, "Tình thái", "Modality", "A2", "teach", False, ["Y","W2.3"],
  note="The other half of 'mood'. Semantic, expressed lexically by modals, not by inflection.")
n("Y5", "Y", "system", None, "Tính hữu hạn", "Finiteness", "B1", "teach", False, ["Y","C2"])
n("Y6", "Y", "system", None, "Mục đích nói", "Clause type", "A1", "teach", False, ["Y","C4"],
  note="Same system as C4, seen from the meaning side. One of the two halves that replace mood.")
n("Y7", "Y", "system", None, "Phủ định", "Polarity", "A1", "teach", True, ["Y","W2.2"], l1=["AUX"])
n("Y8", "Y", "system", None, "Số", "Number", "A1", "teach", True, ["Y","W1.1"], l1=["PLS"])
n("Y9", "Y", "system", None, "Tính đếm được", "Countability", "A1", "teach", True, ["Y","W1.2"])
n("Y10", "Y", "system", None, "Tính xác định", "Definiteness", "A2", "teach", True, ["Y","W6.1"], l1=["ART"])
n("Y11", "Y", "system", None, "Cấp so sánh", "Degree", "A1", "teach", False, ["Y","W3"])
n("Y12", "Y", "system", None, "Cách", "Case", "A1", "teach", True, ["Y","W1.5a"], src="Bài 3")
n("Y13", "Y", "system", None, "Tổng hợp thì, thể và dạng", "Tense, aspect and voice paradigm", "A2", "teach", False,
  ["Y1","Y2","Y3"], note="Synthesis node, added 21 Sep at the teacher's request: the 12 active and 12 passive forms as one grid, and the five everyday forms that make a letter T.")

# ------------------------------------------------------------ AXIS 4 PACKAGING
n("K", None, "packaging", None, "Sắp xếp thông tin", "Information packaging", "B1", "system-only", False,
  note="Same propositional content, rearranged. Where inversion belongs.")
PK = [("K1","Câu bị động","Passive","B1","teach"),
      ("K2","Đảo ngữ trợ động từ","Subject-auxiliary inversion","B2","system-only"),
      ("K3","Đảo ngữ chủ ngữ động từ","Subject-verb inversion","B2","system-only"),
      ("K4","Đưa lên đầu câu","Preposing / fronting","B2","system-only"),
      ("K5","Đẩy xuống cuối câu","Postposing","B2","system-only"),
      ("K6","Câu có chủ ngữ giả","Extraposition","B1","teach"),
      ("K7","Cấu trúc there tồn tại","Existential there","A1","teach"),
      ("K8","Câu chẻ It","It-cleft","B2","system-only"),
      ("K9","Câu chẻ Wh","Pseudo-cleft","B2","system-only"),
      ("K10","Tách thành phần","Dislocation","B2","system-only")]
for kid, vi, en, lv, tc in PK:
    n(kid, "K", "packaging", None, vi, en, lv, tc, False, ["K"])

# ---------------------------------------------------------------- AXIS 5 LEXIS
n("L", None, "lexis", None, "Từ vựng", "Lexis", "A1", "teach", False,
  note="Vocabulary facts, not structure. Idioms and collocations belong here, never on the form tree.")
n("L1", "L", "lexis", None, "Thành ngữ", "Idioms", "B1", "teach", False, ["L"], old="P4",
  note="Moved off the phrase level. An idiom is a meaning fact about an ordinary phrase.")
n("L2", "L", "lexis", None, "Cụm từ đi với nhau", "Collocation", "A2", "teach", False, ["L"], old="W7.1",
  note="Moved off the preposition node.")
n("L2.1", "L2", "lexis", None, "Động từ + giới từ", "Verb + preposition", "A2", "teach", False, ["L2","W5"],
  src="Ngữ pháp Tiếng Anh, mục Giới từ và collocation")
n("L2.2", "L2", "lexis", None, "Tính từ + giới từ", "Adjective + preposition", "A2", "teach", False, ["L2","W5"])
n("L2.3", "L2", "lexis", None, "Danh từ + giới từ", "Noun + preposition", "B1", "teach", False, ["L2","W5"])
n("L3", "L", "lexis", None, "Cụm động từ", "Phrasal verbs", "A2", "teach", False, ["L"], old="P2",
  note="Split from the old P2. A lexeme, not a constituent.")
n("L4", "L", "lexis", None, "Cụm từ cố định", "Fixed expressions", "B1", "teach", False, ["L"])
n("L5", "L", "lexis", None, "Họ từ", "Word families", "B1", "teach", False, ["L","M2"])
n("L6", "L", "lexis", None, "Nhãn ngữ vực", "Register labels", "B2", "teach", False, ["L"],
  note="Specialized, old-fashioned, archaic, literary. The vocabulary selection criteria.")
n("L7", "L", "lexis", None, "Danh sách động từ chi phối", "Trigger and valency lists", "B1", "teach", False, ["L"],
  note="New. Which verbs take a gerund, which take an infinitive, which trigger the mandative. Lexical, not rule-based, so it cannot live on the form tree.")

# -------------------------------------------------------- AXIS 6 CONSTRUCTIONS
n("X", None, "construction", None, "Cấu trúc câu thường gặp", "Constructions", "A2", "teach", False,
  note="New axis. Recurring pairings of form and meaning that cut across all other axes. Nearly every published syllabus is organised this way, so without this layer the system has no answer to how learners search.")
n("X1", "X", "construction", None, "Câu điều kiện", "Conditionals", "A2", "teach", False, ["X","C3.3b"])
n("X1.1", "X1", "construction", None, "Câu điều kiện loại 0", "Zero conditional", "A2", "teach", False, ["X1","Y1"])
n("X1.2", "X1", "construction", None, "Câu điều kiện loại 1", "First conditional", "A2", "teach", False, ["X1.1"])
n("X1.3", "X1", "construction", None, "Câu điều kiện loại 2", "Second conditional", "B1", "teach", False,
  ["X1.2","M1.9"], note="Contains 'If I were you'. This is the only place a beginner meets the irrealis form.")
n("X1.4", "X1", "construction", None, "Câu điều kiện loại 3", "Third conditional", "B1", "teach", False, ["X1.3","Y2"])
n("X1.5", "X1", "construction", None, "Câu điều kiện hỗn hợp", "Mixed conditionals", "B2", "system-only", False, ["X1.4"])
n("X1.6", "X1", "construction", None, "Điều kiện không dùng if", "unless, provided, as long as", "B1", "teach", False,
  ["X1.2","W5"])
n("X2", "X", "construction", None, "Câu tường thuật", "Reported speech", "B1", "teach", False, ["X","C3.2"],
  l1=["BSH"], note="Vietnamese curriculum: grade 8 and grade 9.")
n("X2.1", "X2", "construction", None, "Tường thuật câu trần thuật", "Reported statements", "B1", "teach", False,
  ["X2","C3.2a"], l1=["BSH"])
n("X2.2", "X2", "construction", None, "Tường thuật câu hỏi", "Reported questions", "B1", "teach", False,
  ["X2.1","C3.2b"], l1=["BSH"])
n("X2.3", "X2", "construction", None, "Động từ tường thuật", "Reporting verbs", "B1", "teach", False, ["X2.1","L7"])
n("X2.4", "X2", "construction", None, "Lùi thì", "Backshift", "B1", "teach", False, ["X2.1","Y1"],
  l1=["BSH"], note="The BSH interference point. Unteachable before content clauses (C3.2).")
n("X3", "X", "construction", None, "Câu bị động (ứng dụng)", "Passive constructions", "B1", "teach", False, ["X","K1","Y3"])
n("X3.1", "X3", "construction", None, "Bị động khách quan", "It is said that...", "B2", "system-only", False, ["X3"])
n("X3.2", "X3", "construction", None, "Bị động với hai tân ngữ", "Passive with two objects", "B1", "teach", False,
  ["X3","W2.6"])
n("X4", "X", "construction", None, "Cấu trúc nhờ vả", "Causative: have something done", "B1", "teach", False, ["X","Y3"])
n("X5", "X", "construction", None, "Ước muốn: wish, if only", "Wishes and regrets", "B1", "teach", False,
  ["X","M1.9","X1.3"])
n("X6", "X", "construction", None, "Câu hỏi đuôi", "Question tags", "A2", "teach", False, ["X","W2.2","Y7"], l1=["AUX"])
n("X7", "X", "construction", None, "Họ cấu trúc used to", "The used-to family", "B1", "teach", False, ["X"])
n("X7.1", "X7", "construction", None, "used to", "used to: past habits", "A2", "teach", False, ["X7","Y1"],
  note="Vietnamese curriculum: grade 9.")
n("X7.2", "X7", "construction", None, "be used to", "be used to: familiarity", "B1", "teach", False, ["X7.1","W2.8"])
n("X7.3", "X7", "construction", None, "get used to", "get used to: becoming familiar", "B1", "teach", False, ["X7.2"])
n("X8", "X", "construction", None, "so, such, too, enough", "Degree and result structures", "A2", "teach", False,
  ["X","W4","Y11"])
n("X9", "X", "construction", None, "Cấu trúc so sánh", "Comparison structures", "A1", "teach", False, ["X","Y11"])
n("X9.1", "X9", "construction", None, "as ... as", "as...as", "A2", "teach", False, ["X9"])
n("X9.2", "X9", "construction", None, "the ... the ...", "the...the... correlative", "B2", "system-only", False, ["X9"])
n("X9.3", "X9", "construction", None, "So sánh bội số", "Multiple comparison (twice as...)", "B1", "teach", False, ["X9.1"])
n("X10", "X", "construction", None, "would rather, had better, it's time", "Preference and advice frames",
  "B1", "teach", False, ["X","Y4"])
n("X11", "X", "construction", None, "Cấu trúc giả định", "Subjunctive constructions", "B2", "system-only", False, ["X"],
  note="Not a mood and not one node. English has a subjunctive construction, not a subjunctive inflection: the plain form is shared with the imperative and the infinitival, so it is not an inflection for any of them.")
n("X11.1", "X11", "construction", None, "Giả định mệnh lệnh", "Mandative subjunctive", "B2", "system-only", False,
  ["X11","C3.2a","L7"], note="It is essential that he be here. Plain form in a content clause, triggered lexically by insist, demand, recommend, essential, vital.")
n("X11.2", "X11", "construction", None, "Cấu trúc if I were you", "Irrealis were in use", "B1", "teach", False, ["X11","M1.9"],
  note="If I were you. The one piece a beginner actually meets, and only inside X1.3 and X5. Taught as part of the conditional, never as 'the subjunctive'.")
n("X11.3", "X11", "construction", None, "Giả định cố định", "Formulaic subjunctive", "C1", "system-only", False,
  ["X11","L4"], note="God save the King. Come what may. Fossilised and unproductive.")
n("X12", "X", "construction", None, "Bổ ngữ động từ: V-ing hay to-V", "Verb complementation", "B1", "teach", False,
  ["X","W2.8","L7"], note="New. One of the highest-frequency intermediate error sources.")
n("X12.1", "X12", "construction", None, "Chỉ dùng V-ing", "Verbs taking only -ing", "B1", "teach", False, ["X12"])
n("X12.2", "X12", "construction", None, "Chỉ dùng to-V", "Verbs taking only to-infinitive", "B1", "teach", False, ["X12"])
n("X12.3", "X12", "construction", None, "Cả hai, đổi nghĩa", "Both, with a change of meaning", "B2", "teach", False,
  ["X12.1","X12.2"], note="remember doing against remember to do.")
n("X13", "X", "construction", None, "Mệnh đề rút gọn phân từ", "Participle clauses", "B2", "system-only", False,
  ["X","C2.2c","C2.2d"])

# ------------------------------------------------------ SEPARATE TREE: PHONOLOGY
n("PH", None, "phonology", None, "Ngữ âm", "Phonology", "A1", "teach", False,
  note="Separate tree with its own root. Renamed from S1 to S5 because S now means Sentence on the grammar tree.")
n("PH1", "PH", "phonology", None, "Âm tiết mở và đóng", "Open and closed syllables", "A1", "teach", True, ["PH"],
  old="S1", src="Cách để học tiếng Anh, mục Phát âm")
n("PH2", "PH", "phonology", None, "Nguyên âm dài và ngắn", "Long and short vowels by syllable type", "A1", "teach",
  True, ["PH1"], old="S2", src="Cách để học tiếng Anh, mục Phát âm")
n("PH3", "PH", "phonology", None, "Trọng âm và schwa", "Stress and schwa", "A2", "teach", True, ["PH1"],
  old="S3", src="Cách để học tiếng Anh, mục Trọng âm")
n("PH4", "PH", "phonology", None, "Đuôi -s và -es", "The /s/, /z/, /ɪz/ endings", "A1", "teach", True, ["PH1","M1.1"],
  l1=["SZ","FCC"], old="S4")
n("PH5", "PH", "phonology", None, "Ngữ điệu", "Intonation", "B1", "teach", False, ["PH3"], old="S5",
  src="Cách để học tiếng Anh, mục Ngữ điệu")

# ---------------------------------------------------- SEPARATE TREE: ORTHOGRAPHY
n("OR", None, "orthography", None, "Chính tả và dấu câu", "Orthography and punctuation", "A1", "teach", False,
  note="New separate tree, beside phonology. Punctuation is orthography, not grammar, even though C2 coordination governs some comma rules.")
n("OR1", "OR", "orthography", None, "Dấu chấm và dấu chấm phẩy", "Full stop and semicolon", "A2", "teach", True,
  ["OR","C1.1"], src="Bài 7", old="C2")
n("OR2", "OR", "orthography", None, "Dấu phẩy", "Comma", "A2", "teach", True, ["OR1","W7"], src="Bài 7", old="C2")
n("OR3", "OR", "orthography", None, "Dấu phẩy với mệnh đề quan hệ", "Comma with relative clauses", "B1", "teach",
  False, ["OR2","C3.1b"], src="Bài 7")
n("OR4", "OR", "orthography", None, "Dấu nháy đơn sở hữu", "Apostrophe", "A2", "teach", False, ["OR","M1.2"])
n("OR5", "OR", "orthography", None, "Viết hoa", "Capitalisation", "A1", "teach", False, ["OR","W1.3"])
n("OR6", "OR", "orthography", None, "Quy tắc chính tả khi thêm đuôi", "Spelling rules for endings", "A1", "teach",
  False, ["OR","M1"], note="Doubling before -ing, y to ies, dropping silent e.")

# ------------------------------------------------------ V1 SCOPE: FIFTEEN STAGES
# Sequence set by the teacher, 16 September, revised 18 September. Stages 1 to 4 build a
# clause out of word classes a learner can hold on their own. Stage 5 adds the pronouns,
# which need the clause first. Stage 6 introduces the auxiliary, stage 7 completes the
# auxiliary inventory with the modals, and everything after that is one move from it.
# A stage may hold several nodes taught together.
STAGES = [
    ["W1", "M1.1"],            #  1  nouns, with the plural -s they need
    ["W3"],                    #  2  adjectives, all of them
    ["W2.1", "W2.6"],          #  3  lexical verbs, and whether they take an object
    ["C5"],                    #  4  the clause assembled from 1, 2 and 3
    ["W1.5"],                  #  5  pronouns, after the clause: see REASSIGNED
    ["W2.2"],                  #  6  THE ROOT: the auxiliary
    ["W2.3"],                  #  7  modals complete the auxiliary inventory
    ["Y7"],                    #  8  negation: not after the auxiliary
    ["C4.2"],                  #  9  yes/no questions: invert the auxiliary
    ["C4.3"],                  # 10  wh- questions
    ["Y1", "M1.4", "M1.3", "Y2", "M1.5", "M1.6", "Y3", "Y13", "W2.5"],
                                # 11  tense, aspect, passive, the whole grid, and irregular verbs,
                                #     taught together as one stage. Teacher's call, 28 Sep.
]

# A stage that names a parent teaches its whole subtree, except where excluded.
EXCLUDE = {
    "W1.5f",  # relative pronouns need relative clauses, which are not in v1
    "W3.2",   # tính từ gốc: cut from v1 by the teacher, 19 Sep
    "W1.4",   # danh từ tập hợp: cut from v1 by the teacher, 21 Sep
    "W1.6",   # danh từ chỉ người / chỉ vật: cut from v1 by the teacher, 24 Sep
}

# A subtree pulled out of its parent's stage and taught later, on purpose. A later STAGES
# entry wins, and listing it here is what makes that deliberate rather than accidental.
# Teacher's call, 18 September: telling "I" from "me" needs subject and object, which only
# exist once C5 is taught, so the pronouns move behind the clause.
REASSIGNED = {
    "W1.5": (1, 5),  # was inside stage 1 via W1, now its own stage 5
}

byid_pre = {x["id"]: x for x in N}
def descendants(root):
    out, stack = [], [root]
    while stack:
        cur = stack.pop()
        if cur in EXCLUDE: continue
        out.append(cur)
        stack += [x["id"] for x in N if x["parent"] == cur]
    return out

STAGE_OF = {}
reassignments = []
for idx, ids in enumerate(STAGES, start=1):
    for i in ids:
        for d in descendants(i):
            if d in STAGE_OF and STAGE_OF[d] != idx:
                reassignments.append((d, STAGE_OF[d], idx))
            STAGE_OF[d] = idx

# Every reassignment must be declared. An undeclared one is a STAGES mistake, not a feature.
for nid, frm, to in reassignments:
    root = nid
    while root and root not in REASSIGNED:
        root = byid_pre[root]["parent"]
    if root is None or REASSIGNED[root] != (frm, to):
        print(f"FAIL undeclared stage reassignment: {nid} moved from stage {frm} to {to}",
              file=sys.stderr)
        sys.exit(1)

for x in N:
    del x["tested_in_v1"]
    x["in_v1"] = x["id"] in STAGE_OF
    x["stage"] = STAGE_OF.get(x["id"])
    x["chain_order"] = STAGE_OF.get(x["id"])

# ------------------------------------------------------------------- VALIDATE
ids = [x["id"] for x in N]
errs = []
dupes = {i for i in ids if ids.count(i) > 1}
if dupes: errs.append(f"duplicate ids: {sorted(dupes)}")
idset = set(ids)
for x in N:
    if x["parent"] is not None and x["parent"] not in idset:
        errs.append(f"{x['id']}: parent {x['parent']} missing")
    for r in x["requires"]:
        if r not in idset:
            errs.append(f"{x['id']}: requires {r} missing")
    if x["teach"] not in ("teach", "system-only"):
        errs.append(f"{x['id']}: bad teach value")
# cycle check over requires
seen, stack = {}, []
def visit(i):
    if seen.get(i) == 2: return
    if seen.get(i) == 1:
        errs.append(f"requires cycle at {i} via {' -> '.join(stack)}"); return
    seen[i] = 1; stack.append(i)
    for r in next(x for x in N if x["id"] == i)["requires"]:
        visit(r)
    stack.pop(); seen[i] = 2
for i in ids: visit(i)


byid = {x["id"]: x for x in N}

def is_ancestor(maybe, node):
    """A requires target that is simply the node's own parent chain is structural,
    not a teaching prerequisite. Axis roots (W, C, M, Y) fall in here."""
    cur = byid[node]["parent"]
    while cur is not None:
        if cur == maybe: return True
        cur = byid[cur]["parent"]
    return maybe in ("W", "C", "M", "Y", "P", "S", "T", "F", "K", "L", "X", "PH", "OR")


# a node must never be taught before something it requires
for cid, st in STAGE_OF.items():
    for r in byid[cid]["requires"]:
        if r in STAGE_OF and STAGE_OF[r] > st:
            errs.append(f"stage order: {cid} (stage {st}) comes before its prerequisite {r} (stage {STAGE_OF[r]})")
        if r not in STAGE_OF and r not in EXCLUDE and not is_ancestor(r, cid):
            errs.append(f"missing prerequisite: {cid} (stage {st}) requires {r} which is not taught in v1")

if errs:
    print("VALIDATION FAILED"); [print("  " + e) for e in errs]; sys.exit(1)

with open("/home/claude/nodes.json", "w", encoding="utf-8") as f:
    json.dump(N, f, ensure_ascii=False, indent=2)

by_axis, by_teach = {}, {}
for x in N:
    by_axis[x["axis"]] = by_axis.get(x["axis"], 0) + 1
    by_teach[x["teach"]] = by_teach.get(x["teach"], 0) + 1
print(f"OK  {len(N)} nodes")
print("  by axis:  " + ", ".join(f"{k} {v}" for k, v in sorted(by_axis.items())))
print("  by teach: " + ", ".join(f"{k} {v}" for k, v in sorted(by_teach.items())))
print(f"  in_v1: {sum(1 for x in N if x['in_v1'])} nodes across {len(STAGES)} stages")
for idx, ids in enumerate(STAGES, start=1):
    members = sorted([k for k, v in STAGE_OF.items() if v == idx])
    print(f"   {idx:>2}. {' + '.join(ids):<22} {len(members):>2} node(s)")
print(f"  with old_id:  {sum(1 for x in N if x['old_id'])}")
print(f"  roots: {[x['id'] for x in N if x['parent'] is None]}")
