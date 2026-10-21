// Loads a game's module bundle in Node so its engine can be simulated without a browser.
const fs = require('fs'), vm = require('vm');
function extractModules(html) {
  const marker = /modules\["([^"]+)"\]=\(exports,require\)=>\{/g; const starts = []; let m;
  while ((m = marker.exec(html))) starts.push({ name: m[1], at: m.index, body: m.index + m[0].length });
  const mods = {};
  for (let i = 0; i < starts.length; i++) {
    const s = starts[i], limit = i + 1 < starts.length ? starts[i + 1].at : html.length; let pos = s.body, found = null;
    while (true) {
      const j = html.indexOf('\n};', pos); if (j < 0 || j > limit) break;
      const src = html.slice(s.at, j + 3);
      try { new vm.Script(src); found = src; break; } catch { pos = j + 1; }
    }
    if (!found) throw Error('could not delimit module ' + s.name);
    mods[s.name] = found;
  }
  return mods;
}
function stubs() {
  const noop = () => {}, ctx2d = new Proxy({}, { get: (t, k) => k === 'canvas' ? { width: 768, height: 576 } : k === 'measureText' ? () => ({ width: 10 }) : noop, set: () => true });
  const el = () => ({ getContext: () => ctx2d, style: {}, addEventListener: noop, appendChild: noop, setAttribute: noop, classList: { add: noop, remove: noop, toggle: noop } });
  return { window: { addEventListener: noop, matchMedia: () => ({ matches: false }) }, document: { createElement: el, getElementById: el, querySelector: el, querySelectorAll: () => [], addEventListener: noop, body: el() },
    Image: class { constructor() { this.width = 0; } decode() { return Promise.resolve(); } }, Audio: class { play() { return Promise.resolve(); } pause() {} }, matchMedia: () => ({ matches: false }),
    localStorage: { getItem: () => null, setItem: noop, removeItem: noop }, requestAnimationFrame: noop, AudioContext: class {} };
}
function load(file, entry = 'engine.js') {
  const html = fs.readFileSync(file, 'utf8'); const mods = extractModules(html);
  const sandbox = Object.assign({ console, performance, Math, JSON, Promise, setTimeout, clearTimeout, structuredClone, queueMicrotask }, stubs()); sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  const src = 'const modules=Object.create(null),cache=Object.create(null);function require(id){if(cache[id])return cache[id];if(!modules[id])throw Error("missing module "+id);const exports=cache[id]={};modules[id](exports,require);return exports;}\n' + Object.values(mods).join('\n') + '\nrequire;';
  const req = vm.runInContext(src, sandbox, { filename: file });
  return { require: req, modules: Object.keys(mods), sandbox };
}
module.exports = { load, extractModules };
if (require.main === module) { for (const f of process.argv.slice(2)) { try { const r = load(f); const e = r.require('engine.js'); console.log(f.split('/').pop(), 'OK modules:', r.modules.length, 'engine exports:', Object.keys(e).join(',')); } catch (err) { console.log(f.split('/').pop(), 'FAIL', err.message); } } }
