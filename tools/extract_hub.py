#!/usr/bin/env python3
"""Extract exact offline payloads from PURPLE's HUB_PACK; never executes JS."""
import argparse
import base64
import gzip
import hashlib
import json
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('hub', type=Path)
parser.add_argument('destination', type=Path)
args = parser.parse_args()
text = args.hub.read_text(encoding='utf-8')
marker = 'window.HUB_PACK='
start = text.index(marker) + len(marker)
pack, _ = json.JSONDecoder().raw_decode(text[start:])
args.destination.mkdir(parents=True, exist_ok=True)
records = []
for name, encoded in pack.items():
    if Path(name).name != name or not name.endswith('.html'):
        raise ValueError('Unexpected payload name')
    payload = gzip.decompress(base64.b64decode(encoded, validate=True))
    if not payload.lstrip().lower().startswith(b'<!doctype html'):
        raise ValueError('Payload is not expected HTML: ' + name)
    output = args.destination / name
    if output.exists() and output.read_bytes() != payload:
        raise FileExistsError('Refusing to overwrite modified file: ' + str(output))
    output.write_bytes(payload)
    records.append({'file': name, 'bytes': len(payload), 'sha256': hashlib.sha256(payload).hexdigest()})
(args.destination / 'HUB-PAYLOADS.json').write_text(json.dumps(records, indent=2) + '\n', encoding='utf-8')
print('Extracted', len(records), 'exact payloads to', args.destination)
