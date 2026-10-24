// Muffet's engine lives in one classic script, so it is driven inside the page with the animation loop stopped.
const { chromium } = require('playwright');
const fs = require('fs'), os = require('os'), path = require('path');
const [,, seconds = '600', seeds = '2', god = '0'] = process.argv;
// Test-only copy of the shipped file with the game object exposed; the shipped file is never modified.
const source = fs.readFileSync(path.resolve(__dirname, '../../games/muffet.html'), 'utf8'), hook = 'const game=new MuffetGame({memory:saved.memory,onEvent:(type,data)=>audio.event(type,data),save});';
if (!source.includes(hook)) throw Error('Muffet construction line changed; update the hook in muffet-bot.js');
const testFile = path.join(os.tmpdir(), 'muffet-bot-test.html'); fs.writeFileSync(testFile, source.replace(hook, hook + 'window.__game=game;'));
(async () => {
  const b = await chromium.launch();
  for (let s = 1; s <= +seeds; s++) {
    const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.addInitScript(() => { window.requestAnimationFrame = () => 0; });
    await p.goto('file://' + testFile, { timeout: 120000 }); await p.waitForTimeout(1500);
    await p.evaluate(({ seed, god }) => {
      let x = seed * 7919 >>> 0; const rand = () => ((x = (x * 1664525 + 1013904223) >>> 0) / 4294967296);
      const g = window.__game, r = { states: {}, endings: [], deaths: 0, errors: [], invalid: [], stalls: [], maxTurn: 0, minBoss: Infinity };
      window.__bot = { g, r, rand, t: 0, held: {}, nextMove: 0, nextAction: 0, deadSince: null, key: '', lastProgress: 0, god };
    }, { seed: s, god: god === '1' });
    const total = +seconds;
    for (let done = 0; done < total; done += 60) {
      await p.evaluate((chunk) => {
        const B = window.__bot, g = B.g, r = B.r, dt = 1 / 120, call = (where, fn) => { try { fn(); } catch (e) { if (r.errors.length < 3) r.errors.push({ t: +B.t.toFixed(1), state: g.state, where, msg: e.message, stack: (e.stack || '').split('\n').slice(0, 3).join(' | ') }); } };
        const end = B.t + chunk;
        for (; B.t < end && r.errors.length < 3; B.t += dt) {
          const t = B.t;
          if (t >= B.nextMove) { const d = Math.floor(B.rand() * 9); B.held = { up: [0, 1, 2].includes(d), down: [6, 7, 8].includes(d), left: [0, 3, 6].includes(d), right: [2, 5, 8].includes(d) }; B.nextMove = t + .12 + B.rand() * .7; }
          const st = g.state;
          if (['dead', 'dying', 'fatalGrin'].includes(st)) { B.deadSince ??= t; if (t - B.deadSince > 3) { call('retry', () => g.retry()); B.deadSince = null; r.deaths++; } }
          else if (st === 'title') call('start', () => g.start());
          else if (st === 'won') { r.endings.push({ t: +t.toFixed(1), state: st, turn: g.turn }); call('reset', () => { g.reset(); g.start(); }); }
          else { B.deadSince = null; if (t >= B.nextAction) { const q = B.rand();
            if (st === 'menu' && g.menuTab) { const ch = g.choices().filter(c => !c.disabled); if (q < .7 && ch.length) call('chooseChoice', () => g.chooseChoice(ch[Math.floor(B.rand() * ch.length)].id)); else call('back', () => g.back()); }
            else if (st === 'menu') { if (q < .45) call('openMenu', () => g.openMenu(['FIGHT', 'ACT', 'ITEM', 'MERCY'][Math.floor(B.rand() * 4)])); else if (q < .7) call('moveMenu', () => g.moveMenu(B.rand() < .5 ? -1 : 1)); else call('confirm', () => g.confirm()); }
            else if (q < .7) call('confirm', () => g.confirm()); else if (q < .8) call('back', () => g.back());
            B.nextAction = t + .06 + B.rand() * .45; } }
          call('update', () => g.update(dt, { ...B.held }));
          if (B.god && g.seth && g.seth.hp > 0 && g.state !== 'dead') g.seth.hp = g.seth.maxHP;
          r.states[g.state] = (r.states[g.state] || 0) + dt;
          if (Math.round(t * 120) % 60 === 0) {
            let snap; try { snap = g.snapshot(); } catch (e) { r.errors.push({ where: 'snapshot', msg: e.message }); break; }
            const bad = []; (function walk(o, path, d) { if (d > 5 || o == null) return; if (typeof o === 'number') { if (!Number.isFinite(o)) bad.push(path + '=' + o); return; } if (typeof o === 'object') for (const [k, v] of Object.entries(o)) walk(v, path ? path + '.' + k : k, d + 1); })(snap, '', 0);
            if (bad.length && r.invalid.length < 5) r.invalid.push({ t: +t.toFixed(1), state: g.state, fields: bad.slice(0, 6) });
            if (g.seth && (g.seth.hp < 0 || g.seth.hp > g.seth.maxHP) && r.invalid.length < 5) r.invalid.push({ t, fields: ['seth.hp=' + g.seth.hp + '/' + g.seth.maxHP] });
            if (Number.isFinite(g.bossHP)) { r.minBoss = Math.min(r.minBoss, g.bossHP); if (g.bossHP < 0 && r.invalid.length < 5) r.invalid.push({ t, fields: ['bossHP=' + g.bossHP] }); }
            r.maxTurn = Math.max(r.maxTurn, g.turn || 0);
            const key = [g.state, g.turn, g.bossHP, g.seth?.hp, g.menuTab].join('|');
            if (key !== B.key) { B.key = key; B.lastProgress = t; } else if (t - B.lastProgress > 150 && !r.stalls.some(x => x.key === key)) r.stalls.push({ t: +t.toFixed(1), key, state: g.state });
          }
        }
      }, 60);
    }
    const r = await p.evaluate(() => { const r = window.__bot.r; for (const k in r.states) r.states[k] = +r.states[k].toFixed(1); return { ...r, final: window.__bot.g.state, sim: +window.__bot.t.toFixed(0), topStates: Object.entries(r.states).sort((a, b) => b[1] - a[1]).slice(0, 6) }; });
    delete r.states;
    console.log(JSON.stringify({ name: 'muffet', seed: s, god: god === '1', ...r, minBoss: r.minBoss === Infinity ? null : r.minBoss, pageErrors: errs.slice(0, 3) }));
    await p.close();
  }
  await b.close();
})();
