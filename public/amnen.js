/* Sortera i labbet – ämnesbanken.
   Varje föremål har: id, namn (obestämd form, används i meningar), test, svar, fakta.
   Egenskaperna är kontrollerade mot skolans försök i kemi åk 4–6:
   löslighet i vatten, ledningsförmåga i en sluten krets med batteri och lampa,
   och pH-papper (rödkål/pH-papper blir rött i surt, blått i basiskt).
   Källor: Skolverket Lgr22, KE.4-6.1.2 och KE.4-6.1.3 (kunskapskraven),
   försöken är de som beskrivs i läromedel i kemi för mellanstadiet. */
(function (root) {
  'use strict';

  var TESTER = {
    loslig: {
      id: 'loslig',
      fraga: 'Löser det sig i vatten?',
      kort: 'Löser sig',
      ikon: 'vatten',
      lador: [
        { svar: 'ja', text: 'Löser sig' },
        { svar: 'nej', text: 'Löser sig inte' }
      ]
    },
    leder: {
      id: 'leder',
      fraga: 'Leder det ström?',
      kort: 'Leder ström',
      ikon: 'batteri',
      lador: [
        { svar: 'ja', text: 'Leder ström' },
        { svar: 'nej', text: 'Leder inte' }
      ]
    },
    ph: {
      id: 'ph',
      fraga: 'Är det surt eller basiskt?',
      kort: 'Surt eller basiskt',
      ikon: 'phpapper',
      lador: [
        { svar: 'surt', text: 'Surt' },
        { svar: 'basiskt', text: 'Basiskt' }
      ]
    }
  };

  /* form: burk | flaska | kartong | pase | hog | kub | trad | spik | folie | mynt |
           penna | snodd | glas | pinne | sked | frukt | tval | tub | flaska2 | pase_liten */
  var AMNEN = [
    /* --- löslighet --- */
    { id: 'salt', namn: 'salt', form: 'burk', farg: '#f4f1e8', test: 'loslig', svar: 'ja',
      fakta: 'Saltkornen försvinner i vattnet. Salt är lösligt i vatten.' },
    { id: 'socker', namn: 'socker', form: 'kub', farg: '#fbf7ee', test: 'loslig', svar: 'ja',
      fakta: 'Sockerbiten försvinner när du rör om. Socker är lösligt i vatten.' },
    { id: 'sand', namn: 'sand', form: 'hog', farg: '#d9c07a', test: 'loslig', svar: 'nej',
      fakta: 'Sandkornen sjunker till botten och blir kvar. Sand är olöslig i vatten.' },
    { id: 'grus', namn: 'grus', form: 'hog', farg: '#a8a29a', test: 'loslig', svar: 'nej',
      fakta: 'Gruskornen är för stora för att lösas upp. Grus är olösligt i vatten.' },
    { id: 'mjol', namn: 'mjöl', form: 'pase', farg: '#f2ece0', test: 'loslig', svar: 'nej',
      fakta: 'Mjölet grumlar vattnet men löser sig inte. Mjöl är olösligt i vatten.' },
    { id: 'olja', namn: 'olja', form: 'flaska', farg: '#e8c25a', test: 'loslig', svar: 'nej',
      fakta: 'Oljan lägger sig som ett lager ovanpå vattnet. Olja löser sig inte i vatten.' },
    { id: 'citronsyra', namn: 'citronsyra', form: 'burk', farg: '#f7f4ea', test: 'loslig', svar: 'ja',
      fakta: 'Citronsyran försvinner i vattnet. Citronsyra är löslig i vatten.' },
    { id: 'honung', namn: 'honung', form: 'burk', farg: '#d99b2b', test: 'loslig', svar: 'ja',
      fakta: 'Honungen löser sig när du rör om länge. Honung är löslig i vatten.' },
    { id: 'krita', namn: 'krita', form: 'pinne', farg: '#f7f3ea', test: 'loslig', svar: 'nej',
      fakta: 'Krita är kalciumkarbonat och löser sig inte i vatten. Vattnet blir grumligt.' },
    { id: 'bakpulver', namn: 'bakpulver', form: 'pase_liten', farg: '#efe6d2', test: 'loslig', svar: 'ja',
      fakta: 'Bakpulvret löser sig i vattnet och bubblar. Bakpulver är lösligt i vatten.' },

    /* --- ledningsförmåga --- */
    { id: 'koppartrad', namn: 'koppartråd', form: 'trad', farg: '#c8763f', test: 'leder', svar: 'ja',
      fakta: 'Koppar leder ström bra. Därför är elledningar gjorda av koppar.' },
    { id: 'jarspik', namn: 'järnspik', form: 'spik', farg: '#8d949c', test: 'leder', svar: 'ja',
      fakta: 'Järn är en metall och leder ström. Lampan lyser i kretsen.' },
    { id: 'aluminiumfolie', namn: 'aluminiumfolie', form: 'folie', farg: '#c9ced6', test: 'leder', svar: 'ja',
      fakta: 'Aluminiumfolie är metall och leder ström.' },
    { id: 'mynt', namn: 'mynt', form: 'mynt', farg: '#d8b34a', test: 'leder', svar: 'ja',
      fakta: 'Myntet är av metall och leder ström.' },
    { id: 'blyertspenna', namn: 'blyertspenna', form: 'penna', farg: '#4a4a4f', test: 'leder', svar: 'ja',
      fakta: 'Blyertspetsen är av grafit, som är kol. Grafit leder ström.' },
    { id: 'saltvatten', namn: 'saltvatten', form: 'glas', farg: '#bcd7e8', test: 'leder', svar: 'ja',
      fakta: 'Saltvatten leder ström. Rent vatten leder nästan inte alls.' },
    { id: 'gummisnodd', namn: 'gummisnodd', form: 'snodd', farg: '#c9584f', test: 'leder', svar: 'nej',
      fakta: 'Gummi leder inte ström. Lampan förblir släckt.' },
    { id: 'glas', namn: 'glas', form: 'glas', farg: '#d8e8ee', test: 'leder', svar: 'nej',
      fakta: 'Glas leder inte ström. Det är därför glaset kan hålla en lampa.' },
    { id: 'trapinne', namn: 'träpinne', form: 'pinne', farg: '#b98a55', test: 'leder', svar: 'nej',
      fakta: 'Torrt trä leder inte ström. Lampan lyser inte.' },
    { id: 'plastsked', namn: 'plastsked', form: 'sked', farg: '#dfe6ea', test: 'leder', svar: 'nej',
      fakta: 'Plast leder inte ström. Plast används därför runt elkablar.' },

    /* --- surt eller basiskt --- */
    { id: 'citron', namn: 'citron', form: 'frukt', farg: '#efd94e', test: 'ph', svar: 'surt',
      fakta: 'Citron innehåller citronsyra. pH-papperet blir rött: citron är sur.' },
    { id: 'attika', namn: 'ättika', form: 'flaska2', farg: '#cfe3d8', test: 'ph', svar: 'surt',
      fakta: 'Ättika är ättiksyra utspädd i vatten. pH-papperet blir rött: ättika är sur.' },
    { id: 'apelsin', namn: 'apelsin', form: 'frukt', farg: '#f0a13c', test: 'ph', svar: 'surt',
      fakta: 'Apelsin innehåller askorbinsyra. pH-papperet blir rött: apelsin är sur.' },
    { id: 'filmjolk', namn: 'filmjölk', form: 'kartong', farg: '#f4f1e6', test: 'ph', svar: 'surt',
      fakta: 'Filmjölk är svagt sur, för att mjölksyrebakterier har bildat syra.' },
    { id: 'bakpulver_ph', namn: 'bakpulver', form: 'pase_liten', farg: '#efe6d2', test: 'ph', svar: 'basiskt',
      fakta: 'Bakpulver i vatten blir basiskt. pH-papperet blir blått.' },
    { id: 'tval', namn: 'tvål', form: 'tval', farg: '#f0d9e2', test: 'ph', svar: 'basiskt',
      fakta: 'Tvål är basisk. Därför känns den hal och halkig mellan fingrarna.' },
    { id: 'diskmedel', namn: 'diskmedel', form: 'flaska2', farg: '#7fbfae', test: 'ph', svar: 'basiskt',
      fakta: 'Diskmedel är basiskt. pH-papperet blir blått.' },
    { id: 'tandkram', namn: 'tandkräm', form: 'tub', farg: '#eef2f4', test: 'ph', svar: 'basiskt',
      fakta: 'Tandkräm är svagt basisk. Basen hjälper till att skydda tänderna.' }
  ];

  var NIVAAER = [
    { namn: 'Löser det sig i vatten?', test: 'loslig', antal: 6,
      urval: ['salt', 'socker', 'sand', 'grus', 'mjol', 'olja', 'citronsyra', 'honung', 'krita', 'bakpulver'] },
    { namn: 'Leder det ström?', test: 'leder', antal: 6,
      urval: ['koppartrad', 'jarspik', 'aluminiumfolie', 'mynt', 'blyertspenna', 'saltvatten',
              'gummisnodd', 'glas', 'trapinne', 'plastsked'] },
    { namn: 'Surt eller basiskt?', test: 'ph', antal: 6,
      urval: ['citron', 'attika', 'apelsin', 'filmjolk', 'bakpulver_ph', 'tval', 'diskmedel', 'tandkram'] },
    { namn: 'Blandat – läs provet!', test: 'blandat', antal: 8,
      urval: ['salt', 'sand', 'koppartrad', 'gummisnodd', 'citron', 'tval', 'saltvatten', 'glas',
              'olja', 'tandkram', 'mynt', 'filmjolk'] }
  ];

  var byId = {};
  AMNEN.forEach(function (a) { byId[a.id] = a; });

  root.AMNEN = { TESTER: TESTER, AMNEN: AMNEN, NIVAAER: NIVAAER, byId: byId };
})(typeof window !== 'undefined' ? window : globalThis);