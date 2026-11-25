/* verify.cjs – kontrollerar ämnesbanken och nivåerna utan webbläsare.
   node verify.cjs */
const fs = require('fs');
const vm = require('vm');

const kod = fs.readFileSync(__dirname + '/public/amnen.js', 'utf8');
const sand = { globalThis: null };
sand.globalThis = sand;
vm.createContext(sand);
vm.runInContext(kod, sand);
const { TESTER, AMNEN, NIVAAER, byId } = sand.AMNEN;

let fel = 0;
const koll = (ok, text) => { if (!ok) { fel++; console.log('FEL: ' + text); } };

/* Oberoende tabell: egenskapen prövas mot skolans försök, inte mot appens egen data. */
const FACIT = {
  salt: 'ja', socker: 'ja', sand: 'nej', grus: 'nej', mjol: 'nej', olja: 'nej',
  citronsyra: 'ja', honung: 'ja', krita: 'nej', bakpulver: 'ja',
  koppartrad: 'ja', jarspik: 'ja', aluminiumfolie: 'ja', mynt: 'ja', blyertspenna: 'ja',
  saltvatten: 'ja', gummisnodd: 'nej', glas: 'nej', trapinne: 'nej', plastsked: 'nej',
  citron: 'surt', attika: 'surt', apelsin: 'surt', filmjolk: 'surt',
  bakpulver_ph: 'basiskt', tval: 'basiskt', diskmedel: 'basiskt', tandkram: 'basiskt'
};
const FACIT_TEST = {
  salt: 'loslig', socker: 'loslig', sand: 'loslig', grus: 'loslig', mjol: 'loslig', olja: 'loslig',
  citronsyra: 'loslig', honung: 'loslig', krita: 'loslig', bakpulver: 'loslig',
  koppartrad: 'leder', jarspik: 'leder', aluminiumfolie: 'leder', mynt: 'leder',
  blyertspenna: 'leder', saltvatten: 'leder', gummisnodd: 'leder', glas: 'leder',
  trapinne: 'leder', plastsked: 'leder',
  citron: 'ph', attika: 'ph', apelsin: 'ph', filmjolk: 'ph', bakpulver_ph: 'ph',
  tval: 'ph', diskmedel: 'ph', tandkram: 'ph'
};

const sedda = new Set(), namn = new Set();
for (const a of AMNEN) {
  koll(!sedda.has(a.id), 'dubbelt id ' + a.id);
  sedda.add(a.id);
  koll(!namn.has(a.namn + '|' + a.test), 'dubbelt namn i samma prov ' + a.namn);
  namn.add(a.namn + '|' + a.test);
  koll(!!TESTER[a.test], a.id + ' har okänt prov ' + a.test);
  const t = TESTER[a.test];
  if (t) koll(t.lador.some(l => l.svar === a.svar), a.id + ': svaret ' + a.svar + ' finns inte bland lådorna');
  koll(!!FACIT[a.id], a.id + ' saknas i den oberoende faktatabellen');
  koll(FACIT[a.id] === a.svar, a.id + ': appen säger ' + a.svar + ', försöket ger ' + FACIT[a.id]);
  koll(FACIT_TEST[a.id] === a.test, a.id + ': fel prov ' + a.test);
  koll(typeof a.fakta === 'string' && a.fakta.length >= 25, a.id + ': faktaraden är för kort');
  koll(a.fakta.indexOf('?') === -1, a.id + ': faktaraden är en fråga');
  koll(!!a.form, a.id + ': saknar form');
  koll(/^#[0-9a-f]{6}$/i.test(a.farg || ''), a.id + ': ogiltig färg');
}
koll(Object.keys(FACIT).length === AMNEN.length, 'faktatabellen och banken har olika många poster');

/* nivåerna */
koll(NIVAAER.length === 4, 'fyra nivåer förväntades');
NIVAAER.forEach((n, i) => {
  koll(n.antal > 0 && n.antal <= n.urval.length, 'nivå ' + (i + 1) + ': antal utanför urvalet');
  n.urval.forEach(id => koll(!!byId[id], 'nivå ' + (i + 1) + ': okänt id ' + id));
  if (n.test !== 'blandat') {
    const svaren = new Set(n.urval.map(id => byId[id].svar));
    koll(svaren.size === 2, 'nivå ' + (i + 1) + ': bara ett möjligt svar i urvalet');
  }
  if (n.test === 'blandat') {
    const perProv = {};
    n.urval.forEach(id => { (perProv[byId[id].test] = perProv[byId[id].test] || new Set()).add(byId[id].svar); });
    Object.keys(perProv).forEach(p => koll(perProv[p].size === 2,
      'blandad nivå: provet ' + p + ' har bara ett möjligt svar i urvalet'));
    const prov = new Set(n.urval.map(id => byId[id].test));
    koll(prov.size >= 2, 'blandad nivå måste blanda minst två prov');
    n.urval.forEach(id => koll(!!TESTER[byId[id].test], 'blandad nivå: ' + id + ' har okänt prov'));
  } else {
    koll(!!TESTER[n.test], 'nivå ' + (i + 1) + ': okänt prov ' + n.test);
    n.urval.forEach(id => koll(byId[id].test === n.test,
      'nivå ' + (i + 1) + ' är ' + n.test + ' men ' + id + ' är ' + byId[id].test));
  }
});

/* 20 000 dragningar ur urvalet: rätt antal, unika frågor, rätt låda finns alltid */
let dragningar = 0;
for (let runda = 0; runda < 20000; runda++) {
  const i = runda % NIVAAER.length;
  const n = NIVAAER[i];
  const ur = n.urval.slice();
  for (let k = ur.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [ur[k], ur[j]] = [ur[j], ur[k]]; }
  const val = ur.slice(0, n.antal);
  koll(val.length === n.antal, 'fel antal frågor');
  koll(new Set(val).size === val.length, 'samma fråga två gånger i en runda');
  for (const id of val) {
    const a = byId[id];
    const test = n.test === 'blandat' ? a.test : n.test;
    const lador = TESTER[test].lador.map(l => l.svar);
    koll(lador.length === 2, 'varje fråga ska ha exakt två lådor');
    koll(lador.indexOf(a.svar) >= 0, 'rätt låda saknas för ' + id);
    dragningar++;
  }
}

/* talen som används i slutskärmen */
const totalt = NIVAAER.reduce((a, n) => a + n.antal, 0);
console.log('ämnen: ' + AMNEN.length + ', nivåer: ' + NIVAAER.length + ', frågor per runda: ' + totalt);
console.log('provade frågor: ' + dragningar + ', fel: ' + fel);
process.exit(fel ? 1 : 0);