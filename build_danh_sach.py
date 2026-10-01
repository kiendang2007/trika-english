#!/usr/bin/env python3
"""Generate content/materials/00-danh-sach.md from the material files and content/nodes.json.

Every number in the list is counted here, nothing is written down twice. Run this after any
change to a material, and after build_nodes.py when stages move.
"""
import glob, json, os
from datetime import date

ROOT = os.path.dirname(os.path.abspath(__file__))
CONTENT = os.path.join(ROOT, "content")
OUT = os.path.join(CONTENT, "materials", "00-danh-sach.md")

WORDS = {1: "một", 2: "hai", 3: "ba", 4: "bốn", 5: "năm", 6: "sáu", 7: "bảy", 8: "tám",
         9: "chín", 10: "mười", 11: "mười một", 12: "mười hai", 13: "mười ba",
         14: "mười bốn", 15: "mười lăm", 16: "mười sáu", 17: "mười bảy", 18: "mười tám",
         19: "mười chín", 20: "hai mươi"}

def word(n):
    return WORDS.get(n, str(n))

def cap(text):
    return text[0].upper() + text[1:] if text else text

rows, total_items, total_open = [], 0, 0
for path in sorted(glob.glob(os.path.join(CONTENT, "materials", "*.json"))):
    with open(path, encoding="utf-8") as f:
        mat = json.load(f)
    items = [b["item"] for b in mat["blocks"] if b["type"] == "item"]
    tags = sorted({i["l1_tag"] for i in items if i.get("l1_tag")})
    opens = len(mat.get("_internal", {}).get("open_questions") or [])
    total_items += len(items)
    total_open += opens
    rows.append((mat["material_id"], mat["title_vi"], mat["stage"], len(items),
                 ", ".join(tags) or "không", opens))

with open(os.path.join(CONTENT, "nodes.json"), encoding="utf-8") as f:
    nodes = json.load(f)
v1_nodes = [n for n in nodes if n["in_v1"]]
stages = sorted({n["stage"] for n in v1_nodes})

lines = [
    f"# {cap(word(len(rows)))} material và {word(len(stages))} stage",
    "",
    f"Cập nhật {date.today():%d/%m}. Sinh ra từ `content/materials/*.json` và"
    " `content/nodes.json`\nbằng `build_danh_sach.py`, không sửa tay file này.",
    "",
    "| # | Material | Stage | Số câu | Tag L1 | Câu hỏi còn mở |",
    "|---:|---|---:|---:|---|---:|",
]
for mid, title, stage, n_items, tags, opens in rows:
    lines.append(f"| {mid} | {title} | {stage} | {n_items} | {tags} | {opens} |")
lines += [
    "",
    f"Tổng: {total_items} câu hỏi, {total_open} câu hỏi còn mở."
    f" V1 có {len(v1_nodes)} node trong {len(stages)} stage.",
    "",
]

with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
print(f"wrote {OUT}: {len(rows)} materials, {len(stages)} stages, {total_items} items")
