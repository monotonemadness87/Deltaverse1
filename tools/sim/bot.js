// Chaos/progress bot: drives a game engine in Node and reports crashes, invalid numbers, stalls and endings.
const path = require('path');
const { load } = require('./loader');
const GAMES_DIR = path.resolve(__dirname, '../../games');
const GAMES = {
  encore: { cls: 'BattleEngine' }, rift: { cls: 'BattleEngine' }, lab: { cls: 'BattleEngine' },
  gerson: { cls: 'GersonBattle', nav1: true }, mettalot: { cls: 'ShowBattle' }, sans: { cls: 'Battle' }, 'sans-genocide': { cls: 'Battle' },
  flowey: { cls: 'MindBattle' }, 'flowey-genocide': { cls: 'MindBattle', seekPage: true }, spamtenna: { cls: 'LobbyBattle', nav1: true }, 'spamson-neo': { cls: 'NeoBattle' },
  aqua: { cls: 'AquaBattle', args: () => [{ memory: null, saveMemory: () => {}, finalOnly: false }] },
  'aqua-final': { cls: 'AquaBattle', file: 'aqua', args: () => [{ memory: null, saveMemory: () => {}, finalOnly: true }] },
};
const END = new Set(['won', 'spared', 'fled', 'victory', 'ending', 'epilogue', 'end', 'credits', 'finished', 'complete', 'mercy-end', 'killed', 'escaped']);
function prng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function numericIssues(obj, path = '', out = [], depth = 0) {
  if (depth > 5 || obj == null) return out;
  if (typeof obj === 'number') { if (!Number.isFinite(obj)) out.push(path + '=' + obj); return out; }
  if (typeof obj !== 'object') return out;
  for (const [k, v] of Object.entries(obj)) numericIssues(v, path ? path + '.' + k : k, out, depth + 1);
  return out;
}
function run(name, { seed = 1, seconds = 600, invincible = false, dir = GAMES_DIR } = {}) {
  const G = GAMES[name]; const mod = load(`${dir}/${G.file || name}.html`).require('engine.js'); const Cls = mod[G.cls];
  const rand = prng(seed), game = new Cls(...(G.args ? G.args() : []));
  const native = invincible && game.settings && 'invincible' in game.settings; if (native) game.settings.invincible = true;
  // Harness-only god mode for fights without a built-in toggle: top HP back up after every step.
  const godMode = invincible && !native;
  const dt = 1 / 120, report = { name, seed, invincible, states: {}, endings: [], deaths: 0, errors: [], invalid: [], stalls: [], maxTurn: 0, minEnemyHP: Infinity, seconds: 0 };
  let held = { up: false, down: false, left: false, right: false }, nextMove = 0, nextAction = 0, fire = false, shield = null, deadSince = null;
  let lastProgress = 0, progressKey = '', t = 0;
  const call = (fn, ...a) => { try { return fn(...a); } catch (e) { report.errors.push({ t: +t.toFixed(2), state: game.state, where: fn.name || 'call', msg: e.message, stack: (e.stack || '').split('\n').slice(0, 4).join(' | ') }); return 'ERR'; } };
  for (; t < seconds && report.errors.length < 3; t += dt) {
    if (t >= nextMove) { const d = Math.floor(rand() * 9); held = { up: [0, 1, 2].includes(d), down: [6, 7, 8].includes(d), left: [0, 3, 6].includes(d), right: [2, 5, 8].includes(d) }; shield = rand() < .5 ? ['up', 'down', 'left', 'right'][Math.floor(rand() * 4)] : null; fire = rand() < .45; nextMove = t + .12 + rand() * .7; }
    const st = game.state;
    if (st === 'dead' || st === 'dying' || st === 'gameover') { deadSince ??= t; if (t - deadSince > 2.6) { if (game.retry) call(() => game.retry()); else if (game.reset) call(() => game.reset()); else call(() => game.confirm()); deadSince = null; report.deaths++; } }
    else { deadSince = null; if (t >= nextAction) { const r = rand(); if (r < .6) call(() => game.confirm()); else if (r < .8) call(() => G.nav1 ? game.navigate(rand() < .5 ? -1 : 1) : game.navigate(rand() < .5 ? -1 : 1, 0)); else if (r < .87) call(() => game.back?.()); nextAction = t + .06 + rand() * .45; } }
    const input = { ...held, slow: false, fire, move: { x: (held.right ? 1 : 0) - (held.left ? 1 : 0), y: (held.down ? 1 : 0) - (held.up ? 1 : 0) }, shield };
    // Pages that drift and must be shot can't be reached by random input: in a page phase, steer for the page once it is free.
    if (G.seekPage && game.state === 'memory' && game.fragment && !game.fragment.sealed) { const f = game.fragment, s = game.soul; Object.assign(input, { right: f.x - s.x > 6, left: f.x - s.x < -6, down: game.mode !== 'yellow' && f.y - s.y > 6, up: game.mode !== 'yellow' && f.y - s.y < -6, fire: game.mode === 'yellow' && (t % 1.05) < .7 }); }
    if (call(() => game.update(dt, input)) === 'ERR') break;
    if (godMode && game.state !== 'dead' && Number.isFinite(game.hp) && Number.isFinite(game.maxHP) && game.hp > 0) game.hp = game.maxHP;
    game.drain?.();
    report.states[game.state] = (report.states[game.state] || 0) + dt;
    if (END.has(game.state) && !report.endings.some(e => e.t > t - 5)) report.endings.push({ t: +t.toFixed(1), state: game.state });
    if (Math.round(t * 120) % 60 === 0) {
      let snap; try { snap = game.snapshot ? game.snapshot() : { state: game.state, hp: game.hp, maxHP: game.maxHP, enemyHP: game.enemyHP }; } catch (e) { report.errors.push({ t, where: 'snapshot', msg: e.message }); break; }
      const bad = numericIssues(snap); if (bad.length && report.invalid.length < 5) report.invalid.push({ t: +t.toFixed(1), state: game.state, fields: bad.slice(0, 6) });
      const hp = snap.hp ?? game.hp, max = snap.maxHP ?? game.maxHP;
      if (Number.isFinite(hp) && Number.isFinite(max) && (hp < 0 || hp > max) && report.invalid.length < 5) report.invalid.push({ t: +t.toFixed(1), state: game.state, fields: [`hp=${hp}/${max}`] });
      const ehp = snap.enemyHP ?? game.enemyHP; if (Number.isFinite(ehp)) { report.minEnemyHP = Math.min(report.minEnemyHP, ehp); if (ehp < 0 && report.invalid.length < 5) report.invalid.push({ t, state: game.state, fields: ['enemyHP=' + ehp] }); }
      const turn = snap.turn ?? snap.round ?? snap.completed ?? game.turn ?? game.round ?? 0; if (Number.isFinite(+turn)) report.maxTurn = Math.max(report.maxTurn, +turn);
      const key = [game.state, turn, ehp, hp, snap.phase, snap.act, snap.rating].join('|');
      if (key !== progressKey) { progressKey = key; lastProgress = t; }
      else if (t - lastProgress > 150 && !report.stalls.some(s => s.key === key)) report.stalls.push({ t: +t.toFixed(1), key, state: game.state });
    }
  }
  report.seconds = +t.toFixed(1); report.finalState = game.state;
  for (const k in report.states) report.states[k] = +report.states[k].toFixed(1);
  return report;
}
module.exports = { run, GAMES };
if (require.main === module) {
  const [names, seconds = '300', seeds = '1', inv = '0'] = process.argv.slice(2);
  for (const name of (names === 'all' ? Object.keys(GAMES) : names.split(','))) for (let s = 1; s <= +seeds; s++) {
    const t0 = Date.now(); let r; try { r = run(name, { seed: s * 7919, seconds: +seconds, invincible: inv === '1' }); } catch (e) { console.log(name, 'SETUP FAIL', e.message); continue; }
    console.log(JSON.stringify({ name, seed: s, inv: inv === '1', wall: ((Date.now() - t0) / 1000).toFixed(1) + 's', sim: r.seconds, final: r.finalState, maxTurn: r.maxTurn, deaths: r.deaths, endings: r.endings.slice(0, 3), errors: r.errors, invalid: r.invalid, stalls: r.stalls, minEnemyHP: r.minEnemyHP === Infinity ? null : r.minEnemyHP, topStates: Object.entries(r.states).sort((a, b) => b[1] - a[1]).slice(0, 6) }));
  }
}
