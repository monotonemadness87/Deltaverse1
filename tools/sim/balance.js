// Balance probe: plays each fight with a fixed policy, always picking FIGHT, and measures damage per attack pattern.
// HP is topped up after every step (harness only) so the bot sees every pattern; damage is measured before the top-up.
const { load } = require('./loader');
const path = require('path');
const { GAMES } = require('./bot');
const GAMES_DIR = path.resolve(__dirname, '../../games');
function prng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const ACTIVE = new Set(['attack', 'defend', 'warning', 'duel', 'final', 'dance', 'rhythm', 'enemy', 'assault', 'timing', 'injection', 'transform', 'charge', 'finale', 'clash', 'landing', 'cheat', 'special']);
function probe(name, policy, { seed = 1, seconds = 900 } = {}) {
  const G = GAMES[name]; const Cls = load(`${GAMES_DIR}/${G.file || name}.html`).require('engine.js')[G.cls];
  const rand = prng(seed), game = new Cls(...(G.args ? G.args() : []));
  if (game.settings && 'invincible' in game.settings) game.settings.invincible = false;
  const dt = 1 / 120, byKey = {}; let held = {}, nextMove = 0, nextAction = 0, fire = false;
  for (let t = 0; t < seconds; t += dt) {
    if (policy === 'random' && t >= nextMove) { const d = Math.floor(rand() * 9); held = { up: [0, 1, 2].includes(d), down: [6, 7, 8].includes(d), left: [0, 3, 6].includes(d), right: [2, 5, 8].includes(d) }; fire = rand() < .5; nextMove = t + .12 + rand() * .7; }
    const st = game.state;
    if (!ACTIVE.has(st) && t >= nextAction) { try { if (st === 'dead') game.retry ? game.retry() : game.confirm(); else game.confirm(); } catch {} nextAction = t + .15; }
    let snap = {}; try { snap = game.snapshot ? game.snapshot() : {}; } catch {}
    const key = String(snap.attack ?? snap.pattern ?? snap.wave ?? ('turn ' + (snap.turn ?? snap.round ?? game.turn ?? game.round ?? '?')));
    const before = game.hp;
    try { game.update(dt, { ...held, fire, move: { x: (held.right ? 1 : 0) - (held.left ? 1 : 0), y: (held.down ? 1 : 0) - (held.up ? 1 : 0) }, shield: null }); } catch (e) { return { error: e.message }; }
    game.drain?.();
    const lost = Number.isFinite(before) && Number.isFinite(game.hp) ? Math.max(0, before - game.hp) : 0;
    if (ACTIVE.has(st)) { const k = (byKey[key] ??= { time: 0, damage: 0, hits: 0 }); k.time += dt; k.damage += lost; if (lost > 0) k.hits++; }
    if (game.state !== 'dead' && Number.isFinite(game.maxHP) && game.hp > 0) game.hp = game.maxHP;
  }
  return byKey;
}
if (require.main === module) {
  const [names = 'all', seconds = '900'] = process.argv.slice(2), out = {};
  for (const name of (names === 'all' ? Object.keys(GAMES) : names.split(','))) {
    const still = probe(name, 'still', { seconds: +seconds }), rnd = probe(name, 'random', { seconds: +seconds, seed: 3 });
    if (still.error || rnd.error) { console.log(name, 'ERROR', still.error || rnd.error); continue; }
    const keys = [...new Set([...Object.keys(still), ...Object.keys(rnd)])].filter(k => (still[k]?.time || 0) + (rnd[k]?.time || 0) > 3);
    out[name] = keys.map(k => ({ pattern: k, stillTime: +(still[k]?.time || 0).toFixed(1), stillDmgPerMin: still[k] ? +(60 * still[k].damage / still[k].time).toFixed(1) : null, randomTime: +(rnd[k]?.time || 0).toFixed(1), randomDmgPerMin: rnd[k] ? +(60 * rnd[k].damage / rnd[k].time).toFixed(1) : null, randomHits: rnd[k]?.hits ?? null }));
    console.log(JSON.stringify({ name, patterns: out[name] }));
  }
}
