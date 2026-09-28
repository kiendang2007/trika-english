import json, glob, re, sys
N = {n['id']: n for n in json.load(open('nodes.json'))}
TAGS = {'AUX','PLS','BSH','FCC','SZ','ART','RCO','AJO','OBJ','DVB','NQA'}
OK = {'text','section','funfact','item'}
errs, warn = [], []
mats = {}
for p in sorted(glob.glob('materials/*.json')):
    d = json.load(open(p, encoding='utf-8'))
    mats[d['material_id']] = (p, d)
    raw = open(p, encoding='utf-8').read()
    for ch, nm in (('—','em dash'), ('–','en dash')):
        if ch in raw: errs.append(f'{p}: {nm}')
    ids, per_node, ntables = set(), {}, 0
    for b in d['blocks']:
        if b['type'] not in OK: errs.append(f'{p}: bad block type {b["type"]}')
        if b.get('node') and b['node'] not in N: errs.append(f'{p}: unknown node {b["node"]}')
        if b.get('node') and N[b['node']]['stage'] != d['stage']:
            errs.append(f'{p}: node {b["node"]} is stage {N[b["node"]]["stage"]} but material is stage {d["stage"]}')
        if b['type'] == 'section' and b.get('table'):
            ntables += 1
            w = len(b['table']['columns_vi'])
            for r in b['table']['rows']:
                if len(r) != w: errs.append(f'{p}: table "{b["heading_vi"]}" row width {len(r)} != {w}')
        if b['type'] != 'item': continue
        it = b['item']
        if it['id'] in ids: errs.append(f'{p}: duplicate id {it["id"]}')
        ids.add(it['id'])
        m = re.fullmatch(re.escape(it['node']) + r'-(\d{2})', it['id'])
        if not m: errs.append(f'{p}: id {it["id"]} does not match node {it["node"]}')
        else: per_node.setdefault(it['node'], []).append(int(m.group(1)))
        if it.get('l1_tag') not in (None,) and it['l1_tag'] not in TAGS:
            errs.append(f'{p}: unknown l1_tag {it["l1_tag"]}')
        if not it.get('rule_vi'): errs.append(f'{p}: {it["id"]} has no rule_vi')
        if it.get('fallback_vi') and it['fallback_vi'].startswith('Nếu không chắc'):
            errs.append(f'{p}: {it["id"]} fallback repeats the label')
        nulls = [o['key'] for o in it['options'] if o['diagnosis_vi'] is None]
        if nulls != [it['answer']]:
            errs.append(f'{p}: {it["id"]} null diagnoses {nulls} vs answer {it["answer"]}')
        texts = [o['text'] for o in it['options']]
        if len(set(texts)) != len(texts): errs.append(f'{p}: {it["id"]} duplicate option text')
        dg = [o['diagnosis_vi'] for o in it['options'] if o['diagnosis_vi']]
        if len(set(dg)) != len(dg): errs.append(f'{p}: {it["id"]} duplicate diagnosis')
        for x in dg:
            if len(x) < 40: errs.append(f'{p}: {it["id"]} diagnosis too short')
        if len(it['options']) != 4: warn.append(f'{p}: {it["id"]} has {len(it["options"])} options')
    for n, seq in per_node.items():
        if seq != list(range(1, len(seq)+1)): errs.append(f'{p}: {n} item numbers {seq}')
    for k in ('taught_before','not_yet_taught_so_not_used','sources','decisions'):
        if k not in d['_internal']: errs.append(f'{p}: _internal missing {k}')
    print(f"{d['material_id']:>2} st{d['stage']:>3}  {len(ids)} items, {ntables} tables  {d['title_vi']}")

# every v1 node must appear in exactly one material
covered = {}
for mid,(p,d) in mats.items():
    for b in d['blocks']:
        if b.get('node'): covered.setdefault(b['node'], set()).add(mid)
v1 = {i for i,n in N.items() if n['in_v1']}
missing = sorted(v1 - set(covered))
if missing: warn.append('v1 nodes with no material: ' + ', '.join(missing))
for n, ms in covered.items():
    if len(ms) > 1: warn.append(f'node {n} appears in materials {sorted(ms)}')

# no material may use a term first taught in a later material
FORBID = {3:["động từ","chủ ngữ","tân ngữ","trợ động từ","các thì","thì hiện tại","đại từ"],
          4:['chủ ngữ','tân ngữ','trợ động từ'],
          5:['trợ động từ','thì hiện tại','thì quá khứ','các thì'],
          6:['trợ động từ','thì hiện tại đơn'],
          7:[], 8:[], 9:[], 10:[], 11:[],
          12:[], 13:[], 14:[], 15:[]}
for mid,(p,d) in mats.items():
    site = json.dumps({k:v for k,v in d.items() if not k.startswith('_')}, ensure_ascii=False).lower()
    for term in FORBID.get(mid, []):
        if term.strip() in site: warn.append(f'#{mid} uses "{term.strip()}" which is taught later')
print()
if errs:
    print('ERRORS'); [print(' ', e) for e in errs]
else:
    print('no errors')
if warn:
    print('WARNINGS'); [print(' ', w) for w in warn]
sys.exit(1 if errs else 0)
