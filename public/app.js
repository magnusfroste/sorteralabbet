/* Sortera i labbet – löslighet, ledningsförmåga, surt/basiskt. Åk 4–6, KE.4-6.1.2.
   Allt ritas i kod (SVG). Inga bildfiler, inga tredjepartsförfrågningar utom kotten.js. */
(function () {
  'use strict';

  var A = window.AMNEN, T = A.TESTER, $ = function (id) { return document.getElementById(id); };

  var S = {
    niva: 0, fraga: 0, aktuell: null, test: null, ratt: 0, stjarnor: 0, fel: 0,
    ljud: true, last: false, klar: false, koning: [], svar: null
  };

  var el = {
    spel: $('spel'), start: $('startskarm'), niva: $('niva'), stjarnor: $('stjarnor'),
    prov: $('prov'), provtext: $('provtext'), provikon: $('provikon'),
    foremal: $('foremal'), foremalnamn: $('foremalnamn'), faktaruta: $('faktaruta'), lador: $('lador'),
    overlay: $('overlay'), ovTitel: $('ov-titel'), ovStjarnor: $('ov-stjarnor'),
    ovNasta: $('ov-nasta'), ovOm: $('ov-om'), ovBild: $('ov-bild'),
    ljud: $('ljud'), ljudikon: $('ljudikon')
  };

  /* ---------------- ljud och tal ---------------- */
  var ac = null;
  function slappLjud() {
    try {
      if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
    } catch (e) {}
  }
  function blipp(frekvens, langd, typ, volym) {
    if (!S.ljud) return;
    slappLjud();
    if (!ac) return;
    try {
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = typ || 'sine';
      o.frequency.value = frekvens;
      g.gain.setValueAtTime(0.0001, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(volym || 0.12, ac.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + (langd || 0.18));
      o.connect(g); g.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + (langd || 0.18) + 0.02);
    } catch (e) {}
  }
  var senasteTal = 0;
  function sag(text) {
          try { if (window.__rost && window.__rost(text, true)) return; } catch (e) { }
    if (!S.ljud) return;
        console.warn('saknar mp3:', text);
  }
  function ritaLjudikon() {
    el.ljudikon.innerHTML = S.ljud
      ? '<path d="M4 9h3l5-4v14l-5-4H4z" fill="currentColor" stroke="none"/><path d="M16 8.5a5 5 0 0 1 0 7"/><path d="M18.5 6a8.5 8.5 0 0 1 0 12"/>'
      : '<path d="M4 9h3l5-4v14l-5-4H4z" fill="currentColor" stroke="none"/><path d="M16 9l5 6M21 9l-5 6"/>';
    el.ljud.setAttribute('aria-label', S.ljud ? 'Stäng av ljudet' : 'Sätt på ljudet');
  }

  /* ---------------- föremål som SVG ---------------- */
  var RIT = {
    burk: function (c) {
      return '<rect x="30" y="14" width="40" height="10" rx="4" fill="#c9c2b4"/>' +
             '<rect x="26" y="22" width="48" height="66" rx="10" fill="#eef1f0" stroke="#c2c9c7" stroke-width="2"/>' +
             '<rect x="30" y="52" width="40" height="32" rx="7" fill="' + c + '"/>' +
             '<path d="M34 30h8" stroke="#9fb0ad" stroke-width="3" stroke-linecap="round"/>';
    },
    flaska: function (c) {
      return '<rect x="44" y="10" width="12" height="12" rx="3" fill="#b9c4c2"/>' +
             '<path d="M42 22h16v10l10 18v30a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8V50l10-18z" fill="#e9eeec" stroke="#c2c9c7" stroke-width="2"/>' +
             '<path d="M33 58h34v20a8 8 0 0 1-8 8H41a8 8 0 0 1-8-8z" fill="' + c + '"/>';
    },
    flaska2: function (c) {
      return '<rect x="45" y="8" width="10" height="12" rx="3" fill="#8fa6a2"/>' +
             '<path d="M42 20h16v12l8 14v34a8 8 0 0 1-8 8H42a8 8 0 0 1-8-8V46l8-14z" fill="#eef2f1" stroke="#c2c9c7" stroke-width="2"/>' +
             '<rect x="36" y="52" width="28" height="26" rx="4" fill="' + c + '"/>' +
             '<path d="M40 60h20M40 68h14" stroke="rgba(255,255,255,.65)" stroke-width="3" stroke-linecap="round"/>';
    },
    kartong: function (c) {
      return '<path d="M34 26h32v58a4 4 0 0 1-4 4H38a4 4 0 0 1-4-4z" fill="' + c + '" stroke="#d3cdbd" stroke-width="2"/>' +
             '<path d="M34 26l16-14 16 14z" fill="#f7f4ea" stroke="#d3cdbd" stroke-width="2"/>' +
             '<rect x="40" y="46" width="20" height="18" rx="3" fill="#3f8f84" opacity=".75"/>';
    },
    pase: function (c) {
      return '<path d="M28 24h44l-4 64a4 4 0 0 1-4 4H36a4 4 0 0 1-4-4z" fill="' + c + '" stroke="#d3cdbd" stroke-width="2"/>' +
             '<path d="M28 24l8-12h28l8 12z" fill="#fbf8f0" stroke="#d3cdbd" stroke-width="2"/>' +
             '<circle cx="50" cy="62" r="9" fill="none" stroke="#c9bfa6" stroke-width="3"/>';
    },
    pase_liten: function (c) {
      return '<path d="M32 32h36l-3 50a6 6 0 0 1-6 5H41a6 6 0 0 1-6-5z" fill="' + c + '" stroke="#d3cdbd" stroke-width="2"/>' +
             '<path d="M32 32l6-10h24l6 10z" fill="#fbf8f0" stroke="#d3cdbd" stroke-width="2"/>' +
             '<path d="M44 60h12" stroke="#b7ab8e" stroke-width="3" stroke-linecap="round"/>';
    },
    hog: function (c) {
      var s = '<path d="M12 84c0-22 17-40 38-40s38 18 38 40z" fill="' + c + '"/>';
      [[34, 68], [50, 56], [64, 70], [44, 76], [58, 78], [26, 78], [70, 78]].forEach(function (p, i) {
        s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i % 2 ? 3.4 : 4.6) + '" fill="rgba(255,255,255,.45)"/>';
      });
      return s + '<path d="M12 84h76" stroke="#cbbf9e" stroke-width="3" stroke-linecap="round"/>';
    },
    kub: function (c) {
      return '<path d="M30 44l20-12 20 12v26L50 82 30 70z" fill="' + c + '" stroke="#d9d2bd" stroke-width="2"/>' +
             '<path d="M30 44l20 12 20-12M50 56v26" stroke="#d9d2bd" stroke-width="2" fill="none"/>';
    },
    trad: function (c) {
      return '<circle cx="50" cy="54" r="26" fill="none" stroke="' + c + '" stroke-width="9"/>' +
             '<circle cx="50" cy="54" r="14" fill="none" stroke="' + c + '" stroke-width="8"/>' +
             '<path d="M50 28c10 0 18 6 22 14" stroke="rgba(255,255,255,.45)" stroke-width="3" fill="none"/>' +
             '<path d="M76 50l10-8" stroke="' + c + '" stroke-width="8" stroke-linecap="round"/>';
    },
    spik: function (c) {
      return '<rect x="24" y="34" width="30" height="10" rx="5" fill="' + c + '"/>' +
             '<path d="M52 34h16l10 5-10 5H52z" fill="' + c + '"/>' +
             '<path d="M78 39l14 3-14 3z" fill="#6d747c"/>' +
             '<path d="M30 37h18" stroke="rgba(255,255,255,.45)" stroke-width="3" stroke-linecap="round"/>';
    },
    folie: function (c) {
      return '<path d="M18 40l18-12 46 10-6 40-40 8-18-16z" fill="' + c + '" stroke="#aab2ba" stroke-width="2"/>' +
             '<path d="M30 44l24 6M34 62l28 4M50 34l10 40" stroke="rgba(255,255,255,.6)" stroke-width="3" stroke-linecap="round"/>';
    },
    mynt: function (c) {
      return '<ellipse cx="50" cy="54" rx="30" ry="30" fill="' + c + '" stroke="#b0922f" stroke-width="2"/>' +
             '<ellipse cx="50" cy="54" rx="22" ry="22" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="3"/>' +
             '<path d="M42 54h16" stroke="rgba(90,70,20,.5)" stroke-width="4" stroke-linecap="round"/>';
    },
    penna: function (c) {
      return '<rect x="44" y="8" width="12" height="10" rx="2" fill="#e6a3a3"/>' +
             '<rect x="44" y="18" width="12" height="52" fill="#f2d98f"/>' +
             '<path d="M44 70h12l-6 20z" fill="' + c + '"/>' +
             '<path d="M47 86h6l-3 6z" fill="#2f2f33"/>';
    },
    snodd: function (c) {
      return '<ellipse cx="50" cy="54" rx="30" ry="22" fill="none" stroke="' + c + '" stroke-width="10"/>' +
             '<ellipse cx="50" cy="54" rx="14" ry="9" fill="none" stroke="' + c + '" stroke-width="8"/>' +
             '<path d="M24 44c6-8 14-12 24-12" stroke="rgba(255,255,255,.4)" stroke-width="3" fill="none"/>';
    },
    glas: function (c) {
      return '<path d="M32 18h36l-5 62a6 6 0 0 1-6 5H43a6 6 0 0 1-6-5z" fill="#f2f7f8" stroke="#c2c9c7" stroke-width="2"/>' +
             '<path d="M35 48h30l-3 32a6 6 0 0 1-6 5H44a6 6 0 0 1-6-5z" fill="' + c + '" opacity=".8"/>' +
             '<path d="M40 24v16" stroke="rgba(255,255,255,.85)" stroke-width="3" stroke-linecap="round"/>';
    },
    pinne: function (c) {
      return '<g transform="rotate(-18 50 54)"><rect x="22" y="46" width="56" height="16" rx="8" fill="' + c + '"/>' +
             '<path d="M28 50h34" stroke="rgba(255,255,255,.35)" stroke-width="3" stroke-linecap="round"/></g>';
    },
    sked: function (c) {
      return '<ellipse cx="50" cy="34" rx="18" ry="14" fill="' + c + '" stroke="#c2c9c7" stroke-width="2"/>' +
             '<path d="M50 46c0 14-6 22-6 34a6 6 0 0 0 12 0c0-12-6-20-6-34z" fill="' + c + '" stroke="#c2c9c7" stroke-width="2"/>';
    },
    frukt: function (c) {
      return '<circle cx="50" cy="56" r="30" fill="' + c + '"/>' +
             '<path d="M50 28c0-8 6-14 14-14" stroke="#5f7f3f" stroke-width="4" fill="none" stroke-linecap="round"/>' +
             '<path d="M62 22c8-4 16 0 16 0s-6 8-14 6z" fill="#6f9a5a"/>' +
             '<circle cx="40" cy="46" r="6" fill="rgba(255,255,255,.45)"/>';
    },
    tval: function (c) {
      return '<rect x="20" y="38" width="60" height="34" rx="14" fill="' + c + '" stroke="#d9c6cd" stroke-width="2"/>' +
             '<ellipse cx="50" cy="55" rx="16" ry="9" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="3"/>' +
             '<path d="M28 44c6-4 12-6 18-6" stroke="rgba(255,255,255,.6)" stroke-width="3" stroke-linecap="round" fill="none"/>';
    },
    tub: function (c) {
      return '<rect x="36" y="14" width="16" height="10" rx="3" fill="#8fa6a2"/>' +
             '<path d="M34 24h36v52a6 6 0 0 1-6 6H40a6 6 0 0 1-6-6z" fill="' + c + '" stroke="#c2c9c7" stroke-width="2"/>' +
             '<path d="M34 76h36" stroke="#c2c9c7" stroke-width="4"/>' +
             '<rect x="42" y="40" width="20" height="6" rx="3" fill="#3f8f84" opacity=".7"/>';
    }
  };
  function foremalSVG(a) {
    var r = (RIT[a.form] || RIT.kub)(a.farg);
    return '<svg viewBox="0 0 100 100" role="img" aria-label="' + a.namn + '">' + r + '</svg>';
  }
  /* beskära viewBox till det som faktiskt ritas, så föremålet fyller rutan */
  function passaIn(svg) {
    try {
      var b = svg.getBBox();
      if (!b.width || !b.height) return;
      var p = 5;
      svg.setAttribute('viewBox', (b.x - p) + ' ' + (b.y - p) + ' ' + (b.width + 2 * p) + ' ' + (b.height + 2 * p));
    } catch (e) {}
  }

  /* prov- och lådikoner */
  function provIkon(typ) {
    if (typ === 'vatten') {
      return '<path d="M14 10h20l-3 26a7 7 0 0 1-7 6h-0.0a7 7 0 0 1-7-6z" fill="#dff0ec" stroke="#3f8f84" stroke-width="2.5"/>' +
             '<path d="M16 26h16l-2 10a7 7 0 0 1-6 5 7 7 0 0 1-6-5z" fill="#8fc9c1"/>' +
             '<path d="M36 30c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z" fill="#3f8f84"/>';
    }
    if (typ === 'batteri') {
      return '<rect x="8" y="16" width="24" height="14" rx="3" fill="#3f8f84"/><rect x="32" y="20" width="4" height="6" rx="1" fill="#3f8f84"/>' +
             '<path d="M24 6l-8 14h6l-2 10 8-14h-6z" fill="#e0a13a" stroke="#b87c1f" stroke-width="1.5" stroke-linejoin="round"/>';
    }
    return '<rect x="16" y="6" width="16" height="36" rx="3" fill="#f7f4ea" stroke="#c2c9c7" stroke-width="2"/>' +
           '<rect x="18" y="8" width="12" height="9" fill="#d9534f"/>' +
           '<rect x="18" y="19" width="12" height="8" fill="#e0a13a"/>' +
           '<rect x="18" y="29" width="12" height="10" fill="#4a7fbf"/>';
  }
  function ladaIkon(test, svar) {
    if (test === 'loslig') {
      return svar === 'ja'
        ? '<svg viewBox="0 0 48 48"><path d="M16 8h16l-2 26a6 6 0 0 1-6 5 6 6 0 0 1-6-5z" fill="#dff0ec" stroke="#3f8f84" stroke-width="2.5"/>' +
          '<path d="M18 20h12l-2 16a6 6 0 0 1-4 3 6 6 0 0 1-4-3z" fill="#8fc9c1"/>' +
          '<path d="M20 28l3 4 6-7" stroke="#2b6a61" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : '<svg viewBox="0 0 48 48"><path d="M16 8h16l-2 26a6 6 0 0 1-6 5 6 6 0 0 1-6-5z" fill="#f2f7f8" stroke="#3f8f84" stroke-width="2.5"/>' +
          '<path d="M18 34h12l-2 2a6 6 0 0 1-8 0z" fill="#d9c07a"/>' +
          '<circle cx="22" cy="37" r="2" fill="#c0a765"/><circle cx="27" cy="35" r="1.8" fill="#c0a765"/></svg>';
    }
    if (test === 'leder') {
      return svar === 'ja'
        ? '<svg viewBox="0 0 48 48"><circle cx="24" cy="22" r="11" fill="#ffe9a8" stroke="#e0a13a" stroke-width="2.5"/>' +
          '<path d="M24 5v5M24 34v5M7 22h5M36 22h5M12 10l3.5 3.5M32.5 30.5L36 34M36 10l-3.5 3.5M15.5 30.5L12 34" stroke="#e0a13a" stroke-width="2.5" stroke-linecap="round"/>' +
          '<path d="M24 17a5 5 0 1 0 5 5" stroke="#b87c1f" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>'
        : '<svg viewBox="0 0 48 48"><circle cx="24" cy="22" r="11" fill="#e8ecea" stroke="#a9b4b1" stroke-width="2.5"/>' +
          '<path d="M16 30l16-16" stroke="#b8564a" stroke-width="3.5" stroke-linecap="round"/></svg>';
    }
    return svar === 'surt'
      ? '<svg viewBox="0 0 48 48"><rect x="17" y="5" width="14" height="38" rx="3" fill="#f7f4ea" stroke="#c2c9c7" stroke-width="2"/>' +
        '<rect x="19" y="7" width="10" height="14" fill="#d9534f"/><path d="M19 22h10v18H19z" fill="#f7d2cf"/></svg>'
      : '<svg viewBox="0 0 48 48"><rect x="17" y="5" width="14" height="38" rx="3" fill="#f7f4ea" stroke="#c2c9c7" stroke-width="2"/>' +
        '<rect x="19" y="7" width="10" height="14" fill="#4a7fbf"/><path d="M19 22h10v18H19z" fill="#d3e0f2"/></svg>';
  }

  /* ---------------- HUD ---------------- */
  function ritaNiva() {
    var s = '';
    for (var i = 0; i < A.NIVAAER.length; i++) s += '<i class="' + (i < S.niva ? 'klar' : '') + '"></i>';
    el.niva.innerHTML = s;
    el.niva.setAttribute('aria-label', 'Nivå ' + (S.niva + 1) + ' av ' + A.NIVAAER.length);
  }
  function ritaStjarnor() {
    el.stjarnor.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l3 6.5 7 .9-5.2 4.8 1.4 6.9L12 17.7 5.8 21l1.4-6.9L2 9.4l7-.9z"/></svg><span>' +
      S.stjarnor + '</span>';
    el.stjarnor.setAttribute('aria-label', S.stjarnor + ' stjärnor');
  }

  /* ---------------- spelplan ---------------- */
  function blanda(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function valjFragor() {
    S.koning = A.NIVAAER.map(function (niva) {
      return blanda(niva.urval).slice(0, niva.antal);
    });
  }

  function nyFraga() {
    var niva = A.NIVAAER[S.niva];
    if (S.fraga >= niva.antal) { nivaKlar(); return; }
    var id = S.koning[S.niva][S.fraga];
    var a = A.byId[id];
    S.aktuell = a;
    S.test = niva.test === 'blandat' ? a.test : niva.test;
    S.svar = a.svar;
    S.fel = 0;
    S.last = false;

    var t = T[S.test];
    el.provtext.textContent = t.fraga;
    el.provikon.innerHTML = provIkon(t.ikon);
    el.foremal.className = 'foremal';
    el.foremal.innerHTML = foremalSVG(a);
    passaIn(el.foremal.querySelector('svg'));
    var namn = a.namn.charAt(0).toUpperCase() + a.namn.slice(1);
    el.foremalnamn.textContent = namn;
    el.foremal.setAttribute('aria-label', namn + ' på labbänken');
    el.faktaruta.textContent = '';
    ritaLador(t);
    sag(namn + '. ' + t.fraga);
  }

  function ritaLador(t) {
    el.lador.innerHTML = '';
    t.lador.forEach(function (l) {
      var b = document.createElement('button');
      b.className = 'lada';
      b.type = 'button';
      b.setAttribute('data-svar', l.svar);
      b.setAttribute('aria-label', l.text);
      b.innerHTML = ladaIkon(t.id, l.svar) + '<span>' + l.text + '</span>';
      b.addEventListener('click', function () { svara(l.svar); });
      el.lador.appendChild(b);
    });
  }

  function svara(svar) {
    if (S.last || S.klar || !S.aktuell) return;
    var ratt = S.svar;
    var knappar = el.lador.querySelectorAll('.lada');
    var vald = el.lador.querySelector('[data-svar="' + svar + '"]');

    if (svar === ratt) {
      S.last = true;
      S.ratt++;
      S.stjarnor++;
      ritaStjarnor();
      if (vald) vald.classList.add('ratt');
      el.foremal.classList.add('flyger');
      el.faktaruta.textContent = S.aktuell.fakta;
      blipp(660, 0.09); setTimeout(function () { blipp(990, 0.16); }, 90);
      sag(S.aktuell.fakta);
      setTimeout(nasta, 1500);
      return;
    }

    S.fel++;
    if (vald) {
      vald.classList.add('fel');
      setTimeout(function () { vald.classList.remove('fel'); }, 500);
    }
    blipp(200, 0.16, 'triangle');
    if (S.fel === 1) {
      var hint = S.test === 'loslig'
        ? 'Prova igen. Tänk på vad som händer med kornen i vattnet.'
        : S.test === 'leder' ? 'Prova igen. Tänk på om materialet är metall.'
        : 'Prova igen. Tänk på vad pH-papperet visar.';
      el.faktaruta.textContent = hint;
      sag(hint);
    } else {
      var rattKnapp = el.lador.querySelector('[data-svar="' + ratt + '"]');
      if (rattKnapp) rattKnapp.classList.add('andar');
      var hjalp = 'Rätt låda pulserar. ' + S.aktuell.fakta;
      el.faktaruta.textContent = hjalp;
      sag(hjalp);
    }
  }

  function nasta() {
    if (S.klar) return;
    var niva = A.NIVAAER[S.niva];
    if (S.fraga + 1 >= niva.antal) { nivaKlar(); return; }
    S.fraga++;
    el.faktaruta.textContent = '';
    nyFraga();
  }

  function visaOverlay(titel, knappText, omSynlig) {
    el.ovBild.src = ikonDataURL();
    el.ovStjarnor.innerHTML = '';
    for (var i = 0; i < A.NIVAAER.length; i++) {
      el.ovStjarnor.innerHTML += '<i class="' + (i < S.niva ? '' : 'tom') + '"></i>';
    }
    el.ovTitel.textContent = titel;
    el.ovNasta.textContent = knappText;
    el.ovNasta.hidden = false;
    el.ovOm.hidden = !omSynlig;
    el.overlay.hidden = false;
  }

  function nivaKlar() {
    S.klar = true;
    S.niva++;
    if (S.niva >= A.NIVAAER.length) { slut(); return; }
    visaOverlay('Nivå ' + S.niva + ' klar!', 'Nästa nivå', false);
    blipp(660, 0.1); setTimeout(function () { blipp(880, 0.1); }, 110);
    setTimeout(function () { blipp(1100, 0.22); }, 230);
    sag('Nivå ' + S.niva + ' klar!');
  }

  function slut() {
    S.klar = true;
    S.niva = A.NIVAAER.length;
    visaOverlay('Alla nivåer klara! ' + S.stjarnor + ' stjärnor', 'Spela igen', true);
    blipp(660, 0.1); setTimeout(function () { blipp(880, 0.1); }, 110);
    setTimeout(function () { blipp(1100, 0.22); }, 230);
    sag('Alla nivåer klara! Du fick ' + S.stjarnor + ' stjärnor.');
    if (window.skolappar && window.skolappar.event) {
      try {
        var antal = A.NIVAAER.reduce(function (a, n) { return a + n.antal; }, 0);
        window.skolappar.event('round_done', Math.round(100 * S.stjarnor / antal));
      } catch (e) {}
    }
  }

  function ikonDataURL() {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">' +
      '<rect width="200" height="200" rx="40" fill="#dff0ec"/>' +
      '<path d="M70 40h60l-8 96a22 22 0 0 1-44 0z" fill="#f7fbfa" stroke="#3f8f84" stroke-width="6"/>' +
      '<path d="M76 96h48l-6 40a20 20 0 0 1-36 0z" fill="#8fc9c1"/>' +
      '<path d="M84 118l12 14 22-24" stroke="#2b6a61" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function startaOm() {
    S.niva = 0; S.fraga = 0; S.stjarnor = 0; S.ratt = 0; S.klar = false; S.last = false;
    el.overlay.hidden = true;
    valjFragor();
    ritaNiva(); ritaStjarnor();
    nyFraga();
  }

  function starta() {
    el.start.hidden = true;
    el.spel.hidden = false;
    ritaLjudikon();
    startaOm();
    if (window.skolappar && window.skolappar.event) {
      try { window.skolappar.event('round_start'); } catch (e) {}
    }
  }

  $('spela').addEventListener('click', function () { slappLjud(); starta(); });
  el.ovNasta.addEventListener('click', function () {
    el.overlay.hidden = true;
    if (S.niva >= A.NIVAAER.length) { startaOm(); return; }
    S.klar = false; S.fraga = 0; S.last = false;
    ritaNiva(); ritaStjarnor();
    nyFraga();
    if (window.skolappar && window.skolappar.event) {
      try { window.skolappar.event('level', S.niva + 1); } catch (e) {}
    }
  });
  el.ovOm.addEventListener('click', function () { el.overlay.hidden = true; startaOm(); });
  el.ljud.addEventListener('click', function () {
    S.ljud = !S.ljud;
    if (!S.ljud) {
      window.__rostStopp();
      if (window.skolappar && window.skolappar.event) {
        try { window.skolappar.event('sound_off'); } catch (e) {}
      }
    }
    ritaLjudikon();
  });

  /* dev-hake för verifiering */
  window.__spel = {
    S: S, A: A, svara: svara, nasta: nasta, nyFraga: nyFraga, starta: starta,
    valjFragor: valjFragor,
    lage: function () {
      return { niva: S.niva, fraga: S.fraga, test: S.test, svar: S.svar, id: S.aktuell && S.aktuell.id,
               stjarnor: S.stjarnor, klar: S.klar, last: S.last };
    }
  };
})();
