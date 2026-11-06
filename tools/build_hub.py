#!/usr/bin/env python3
"""Rebuild PURPLE's offline hub from hub/ shell + games/*.html; never executes JS.

The hub is too large for a single Git file, so the repo stores the launcher shell
(with a __PACK__ placeholder) and the exact game HTMLs. Packing reproduces
the original gzip bytes: fixed 10-byte header, zlib level 6 raw deflate, CRC32, size.
"""
import argparse
import base64
import hashlib
import json
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HEADER = bytes.fromhex('1f8b0800000000000003')
# Original hub v60 (Purple-The-Underground.html) SHA-256, for verifying unchanged rebuilds.
ORIGINAL_SHA256 = 'b1abed43d91f140c3a8e96b83f2c3144ca4b35d12af681494a60f0dc8d9daaf9'


def pack_payload(raw):
    c = zlib.compressobj(6, zlib.DEFLATED, -15, 8)
    body = c.compress(raw) + c.flush()
    tail = zlib.crc32(raw).to_bytes(4, 'little') + (len(raw) & 0xFFFFFFFF).to_bytes(4, 'little')
    return base64.b64encode(HEADER + body + tail).decode('ascii')


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--out', type=Path, default=ROOT / 'dist' / 'Purple-The-Underground.html')
parser.add_argument('--expect-original', action='store_true',
                    help='Fail unless the output matches the original v60 hub bytes')
args = parser.parse_args()

shell = (ROOT / 'hub' / 'Purple-The-Underground.shell.html').read_text(encoding='utf-8')
if shell.count('__PACK__') != 1:
    raise ValueError('Shell must contain exactly one __PACK__ placeholder')
games = sorted((ROOT / 'games').glob('*.html'))
pack = {}
for path in games:
    raw = path.read_bytes()
    if not raw.lstrip().lower().startswith(b'<!doctype html'):
        raise ValueError('Payload is not expected HTML: ' + path.name)
    pack[path.name] = pack_payload(raw)
data = shell.replace('__PACK__', json.dumps(pack, separators=(',', ':'))).encode('utf-8')
args.out.parent.mkdir(parents=True, exist_ok=True)
args.out.write_bytes(data)
digest = hashlib.sha256(data).hexdigest()
print('Packed', len(pack), 'games into', args.out, f'({len(data)} bytes)')
print('SHA-256:', digest, '(matches original v60)' if digest == ORIGINAL_SHA256 else '(differs from original v60)')
if args.expect_original and digest != ORIGINAL_SHA256:
    raise SystemExit('Rebuilt hub differs from the original v60 bytes')
