import os
import re
import urllib.parse
from pathlib import Path

photos_dir = Path('public/photos')

# Find string literals in files
files_to_check = []
for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.astro', '.ts', '.tsx', '.json')):
            files_to_check.append(Path(root) / f)

broken_refs = []

for p in files_to_check:
    if 'media-manifest' in p.name:
        continue # generated
    try:
        content = p.read_text(encoding='utf-8')
    except Exception:
        continue
    # match quotes containing /photos/
    for quote in re.findall(r'["\'](/photos/[^"\']+)["\']', content):
        # unquote url encoding
        unquoted = urllib.parse.unquote(quote)
        disk_path = Path('public' + unquoted)
        if not disk_path.exists():
            fname = Path(unquoted).name
            actual = list(photos_dir.rglob(fname))
            actual_str = str(actual[0]).replace('\\', '/').replace('public', '') if actual else 'NOT FOUND'
            broken_refs.append((str(p), quote, unquoted, actual_str))

print(f'Total actual broken refs in source code: {len(broken_refs)}')
for p_str, q, unq, act in broken_refs:
    print(f'File: {p_str}')
    print(f'  Referenced: {unq}')
    print(f'  Found at:   {act}')
