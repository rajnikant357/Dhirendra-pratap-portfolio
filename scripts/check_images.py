import os
import re
from pathlib import Path

photos_dir = Path('public/photos')
broken = []

for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.astro', '.ts', '.tsx', '.json', '.md')):
            p = Path(root) / f
            try:
                content = p.read_text(encoding='utf-8')
            except Exception:
                continue
            for m in re.findall(r'/photos/[^"\'`\s\)\>]+', content):
                clean = m.split('?')[0].split('#')[0].rstrip('"\'`,;')
                target = Path('public' + clean)
                if not target.exists():
                    broken.append((str(p), clean))

print(f'Total broken references: {len(broken)}')
for f_path, ref in broken:
    filename = Path(ref).name
    # Search where this file actually is now
    actual = list(photos_dir.rglob(filename))
    actual_str = str(actual[0]).replace('\\', '/').replace('public', '') if actual else 'NOT FOUND'
    print(f'{f_path}:')
    print(f'   Old: {ref}')
    print(f'   Now: {actual_str}')
