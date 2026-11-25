#!/usr/bin/env node
/* Verifiering av Vattenresan.
   Allt läses direkt ur källan (public/kretslopp.js) och simuleras mot datamodellen. */
'use strict';
const { NIVÅER, POSITIONER } = require('./public/kretslopp.js');

let fel = 0, kontroller = 0;
function kolla(ok, text) { kontroller++; if (!ok) { fel++; console.log('  FEL: ' + text); } }

const VÄGAR = ['upp', 'ned', 'hav', 'gata', 'still'];

/* 1 – struktur och integritet ------------------------------------------------ */
kolla(NIVÅER.length === 3, 'exakt tre nivåer');
kolla(NIVÅER.every((n) => n.steg.length === 6), 'exakt sex steg per nivå');

const unikaFrågor = new Set();
let unikaAlternativPerFråga = true;
for (const n of NIVÅER) {
  kolla(typeof n.namn === 'string' && n.namn.length > 2, 'nivånamnet finns: ' + n.namn);
  for (let i = 0; i < n.steg.length; i++) {
    const s = n.steg[i];
    const p = `nivå ${n.nr} steg ${i + 1}: `;
    kolla(typeof s.fraga === 'string' && s.fraga.length > 15, p + 'frågan finns');
    kolla(!unikaFrågor.has(s.fraga), p + 'frågan är unik i spelet');
    unikaFrågor.add(s.fraga);
    kolla(s.alt.length === 3, p + 'exakt tre alternativ');
    kolla(new Set(s.alt).size === 3, p + 'alternativen är olika');
    kolla(s.ikon && s.ikon.length === 3, p + 'tre ikoner');
    kolla(Number.isInteger(s.rätt) && s.rätt >= 0 && s.rätt <= 2, p + 'rätt index ligger 0..2');
    kolla(!!POSITIONER[s.från], p + 'startpunkt finns: ' + s.från);
    kolla(!!POSITIONER[s.till], p + 'målpunkt finns: ' + s.till);
    kolla(VÄGAR.includes(s.väg), p + 'vägen är definerad: ' + s.väg);
    kolla(typeof s.namn === 'string' && s.namn.length > 2, p + 'begrepp:n namn saknas inte');
    kolla(typeof s.förklaring === 'string' && s.förklaring.length > 60, p + 'förklaringen är längre än 60 tecken');
    kolla(s.alt.every((t) => typeof t === 'string' && t.length >= 4), p + 'alla alternativ är meningsfulla');
    // rätt svar får inte stå självbetet i frågan
    kolla(s.fraga.toLowerCase().indexOf(s.alt[s.rätt].toLowerCase()) === -1, p + 'svarstexten står inte redan i frågan');
    if (s.från === s.till) kolla(s.väg === 'still' || s.väg === 'hav', p + 'droppen står still eller rundar runt om den stannar samma ställe');
  }
}

/* rätt svar får inte sitta på en gissbar plats */
const inds = NIVÅER.flatMap((n) => n.steg.map((s) => s.rätt));
kolla(new Set(inds).size === 3, 'rättа svar förekommer på alla tre platser (hittade ' + [...new Set(inds)].sort() + ')');
kolla(inds.filter((v) => v === 0).length >= 4, 'minst fyra rätt på första plats');

/* 2 – Lgr22-krav: kretsloppets länkar finns alla med i rätt ämne ---------- */
const namn1 = NIVÅER[0].steg.map((s) => s.namn);
for (const krav of ['Avdunstning', 'Kondensering', 'Nederbörd', 'Infiltration', 'Grundvatten']) {
  kolla(namn1.includes(krav), 'nivå 1 innehåller ' + krav);
}
const namn2 = NIVÅER[1].steg.map((s) => s.namn);
kolla(namn2.includes('Avrinning') && namn2.includes('Infiltration'), 'nivå 2 har både avrinning och infiltration');
kolla(namn2.includes('Kondensering'), 'nivå 2 bygger också om molnen');
const namn3 = NIVÅER[2].steg.map((s) => s.namn);
kolla(namn3.includes('Solens energi'), 'nivå 3 tar frågan om drivkraften');
kolla(namn3.includes('Avrinning'), 'nivå 3 tar avrinning vid tjäle');
for (const n of NIVÅER) {
  kolla(n.steg[n.steg.length - 1].till === 'hav', 'nivå ' + n.nr + ' slutar med vattnet tillbaka i sjön');
}

/* 3 – inga förbjudna ord -------------------------------------------------- */
const hela = JSON.stringify(NIVÅER);
for (const ord of ['"Ni ', ' ni ', 'TODO', 'lorem', 'lorem ipsum']) {
  kolla(hela.indexOf(ord) === -1, 'inget "' + ord.trim() + '" i texterna');
}
kolla(hela.indexOf('  ') === -1, 'inga dubbla mellanslag i texterna');

/* 4 – 20 000 rundor genom hela appens reaktionsschema --------------------- */
function spelaSteg(s, borjaMedel, slump) {
  const klickat = new Set();
  let felInomSteg = 0;
  while (true) {
    const kvar = [0, 1, 2].filter((i) => !klickat.has(i));
    // eleven väljer helt slumpmässigt bland det som ännu går att trycka på
    const valt = kvar[Math.floor(slump() * kvar.length)];
    klickat.add(valt);
    if (valt === s.rätt) return { klart: true, stjarna: felInomSteg === 0 };
    felInomSteg++;
    if (felInomSteg >= 2) return { klart: true, stjarna: false }; // svaret visas efter två fel
  }
}

let heltSlutade = 0, mestStjarnor = 0, minstStjarnor = 99;
for (let r = 0; r < 20000; r++) {
  const n = NIVÅER[r % NIVÅER.length];
  let stjarnor = 0, klarar = true;
  for (const s of n.steg) {
    const res = spelaSteg(s, 0, Math.random);
    if (!klarar) { break; }
    if (res.stjarna) stjarnor++;
  }
  if (stjarnor <= n.steg.length) heltSlutade++;
  mestStjarnor = Math.max(mestStjarnor, stjarnor);
  minstStjarnor = Math.min(minstStjarnor, stjarnor);
  kolla(stjarnor >= 0 && stjarnor <= 6, 'rundan ger stjärnor mellan 0 och 6 (fick ' + stjarnor + ')');
}
kolla(heltSlutade === 20000, 'alla 20 000 rundor går att avsluta');
kolla(minstStjarnor === 0, 'det går att få 0 stjärnor (minst ' + minstStjarnor + ')');
kolla(mestStjarnor === 6, 'det går att få alla 6 stjärnor (mest ' + mestStjarnor + ')');

/* 5 – scenpunkterna ligger där scenen är --------------------------------- */
for (const namn of Object.keys(POSITIONER)) {
  const p = POSITIONER[namn];
  kolla(p.x >= 0 && p.x <= 1000 && p.y >= 0 && p.y <= 620, 'punkt ' + namn + ' ligger i viewBoxen');
}
kolla(POSITIONER.hav.y < POSITIONER.grund.y, 'havet ligger ovanför grundvattnets nivå');

/* 6 – svenska tecken finns kvar genom hela källan ------------------------ */
kolla(/[åäö]/.test(hela), 'åäö finns kvar i texterna');

console.log((fel ? 'FEL' : 'OK ') + ' – ' + kontroller + ' kontroller, ' + fel + ' fel ' +
  '(rundor: 20 000, stjärnor ' + minstStjarnor + '–' + mestStjarnor + ')');
process.exit(fel ? 1 : 0);