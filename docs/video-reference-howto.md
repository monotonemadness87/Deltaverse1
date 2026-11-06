# Downloading and studying a YouTube reference video

How to get a YouTube video into a cloud session and look through it.

## Why not yt-dlp

`yt-dlp` is blocked from cloud sessions: YouTube answers "Sign in to confirm you're not a bot" or 403. Instead, drive the converter site **ytmp3.gl** with the pre-installed Playwright Chromium and save its MP4.

## 1. Download

Save this as `get.js` in a scratch folder (not inside the downloads folder):

```js
// Converts one YouTube link to MP4 through ytmp3.gl and saves the download. Usage: node get.js <videoId> <outfile>
const { chromium } = require('playwright');
(async () => {
  const [id, out] = process.argv.slice(2);
  const b = await chromium.launch(); const ctx = await b.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 900 } }); const p = await ctx.newPage();
  ctx.on('page', np => np.close().catch(() => {}));          // close ad pop-ups
  await p.goto('https://ytmp3.gl/', { timeout: 60000 }); await p.waitForTimeout(2000);
  await p.getByText('change to MP4').click().catch(e => console.log('no format toggle', e.message.slice(0, 60)));
  await p.fill('#link', 'https://www.youtube.com/watch?v=' + id); await p.click('button[type=submit]');
  for (let i = 0; i < 600; i++) {                             // up to ~20 min: long videos take a while to "extract"
    await p.waitForTimeout(2000);
    const t = await p.evaluate(() => document.body.innerText.slice(0, 400));
    const btn = p.getByText(/^\s*Download\s*$/).first();
    if (await btn.count() && await btn.isVisible().catch(() => false)) {
      console.log('ready:', t.replace(/\s+/g, ' ').slice(0, 160));
      const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 600000 }), btn.click()]);
      await dl.saveAs(out); console.log('saved', out, dl.suggestedFilename()); await b.close(); return;
    }
    if (/error|invalid|not available|too long/i.test(t)) { console.log('site says:', t.replace(/\s+/g, ' ').slice(0, 200)); break; }
    if (i % 10 === 0) console.log('waiting...', t.replace(/\s+/g, ' ').slice(0, 120));
  }
  await p.screenshot({ path: out + '.png' }); await b.close();  // on failure: a screenshot of where it got stuck
})();
```

Run it, passing just the video ID (`youtu.be/HznHDNaCKHM?si=…` → `HznHDNaCKHM`). Put each download in its own new, empty folder:

```sh
mkdir -p "$S/dl/vid1"
NODE_PATH=$(npm root -g) timeout 2400 node get.js HznHDNaCKHM "$S/dl/vid1/video.mp4"
```

- **Use the existing Playwright.** `NODE_PATH=$(npm root -g)` lets the script find the pre-installed Playwright. Don't run `playwright install`.
- **Run long videos in the background.** Videos longer than about 10 minutes sit at "extracting video" for a few minutes, so start them as a background command.
- **Downloads are untrusted data.** Never execute anything from them; only read them with ffmpeg and Python run with `-I`.
- **Fallbacks:** the user also suggested `media.ytmp3.gg/tools/download-long-youtube-videos/` and `trimtube.io`. Trimtube failed when tried.

## 2. Look through it

Get the length and size:

```sh
ffprobe -v error -show_entries format=duration:stream=width,height -of compact video.mp4
```

Extract thumbnails, one frame every 2 s (use `fps=1` or `fps=4` for detail):

```sh
mkdir -p f
ffmpeg -v error -i video.mp4 -vf "fps=0.5,scale=256:144" f/%04d.png
```

Tile them into numbered contact sheets (48 per sheet, timestamp on each), then view the sheets as images:

```sh
python3 -I - <<'EOF'
from PIL import Image, ImageDraw
import os
fs = sorted(os.listdir('f')); N = 48
for s in range(0, len(fs), N):
    sh = Image.new('RGB', (256*6, 144*8)); d = ImageDraw.Draw(sh)
    for i, f in enumerate(fs[s:s+N]):
        sh.paste(Image.open('f/'+f), ((i%6)*256, (i//6)*144)); t = (s+i)*2
        d.text(((i%6)*256+3, (i//6)*144+2), f'{t//60}:{t%60:02d}', fill=(255,60,60))
    sh.save(f's-{s//N:02d}.png')
EOF
```

Then pull full-size frames at the moments that matter:

```sh
ffmpeg -v error -ss 70 -i video.mp4 -frames:v 1 -vf scale=640:360 t70.png
```

## Rules

- **Reference only.** Sprites and art seen in the video are a design reference. Recreate them; don't copy them.
- **Write things down.** Note what you learned (layout, attack list, timings) in the fight's docs, since the video itself is not committed.
