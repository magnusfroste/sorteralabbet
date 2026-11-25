/* Vattenresan – frågebank och scenpunkter.
   Alla fakta är skolans vanliga beskrivning av vattnets kretslopp (Lgr22 KE.4-6.1.3).
   Körs både i webbläsaren och i verify.cjs (module.exports längst ned). */
(function (root) {

  // Var i bilden vattendroppen står. x/y i scenens viewBox (1000 x 620).
  const P = {
    hav:      { x: 150, y: 430 },
    luft:     { x: 350, y: 262 },
    moln:     { x: 520, y: 132 },
    regnSkog: { x: 560, y: 330 },
    jord:     { x: 590, y: 458 },
    grund:    { x: 470, y: 505 },
    gata:     { x: 862, y: 392 },
    brunn:    { x: 934, y: 418 },
    snö:      { x: 560, y: 372 }
  };
  const PUNKTER = Object.keys(P);

  const NIVÅER = [
    {
      nr: 1,
      namn: 'Sommarsjön',
      plats: 'skog',
      intro: 'Solen skiner över sjön och skogsbacken. Följ en droppe vatten ett helt varv.',
      steg: [
        {
          fraga: 'Solen skiner på sjön. Vad händer?',
          från: 'hav', till: 'luft', väg: 'upp',
          rätt: 0,
          alt: ['Det avdunstar – blir vattenånga', 'Det fryser till is', 'Det blir salt'],
          ikon: ['upp', 'is', 'salt'],
          namn: 'Avdunstning',
          förklaring: 'Solen värmer vattnet. Vattenmolekylerna får fart och lämnar ytan som vattenånga – vattnet avdunstar. Ångan är osynlig, men den finns i luften.'
        },
        {
          fraga: 'Vattenångan stiger och kyls av högre upp. Vad händer?',
          från: 'luft', till: 'moln', väg: 'upp',
          rätt: 1,
          alt: ['Det blir salt igen', 'Det kondenserar till små droppar', 'Det sjunker tillbaka som regn'],
          ikon: ['salt', 'moln', 'regn'],
          namn: 'Kondensering',
          förklaring: 'När ångan kyls av går den tillbaka till flytande form. Dropparna bildas kring pyttesmå stoftkorn i luften – det kallas kondensering. Många droppar tillsammans blir ett moln.'
        },
        {
          fraga: 'Dropparna i molnet stöter ihop och blir tyngre. Vad händer?',
          från: 'moln', till: 'regnSkog', väg: 'ned',
          rätt: 2,
          alt: ['Molnet stiger uppåt', 'Molnet blir varmare', 'Det faller som regn'],
          ikon: ['upp', 'sol', 'regn'],
          namn: 'Nederbörd',
          förklaring: 'Dropparna blir större och tyngre än luften kan hålla kvar. Då faller de som regn – nederbörd. Snö, hagel och regn är alla nederbörd.'
        },
        {
          fraga: 'Regnet faller över skogsmarken. Vart tar vattnet vägen?',
          från: 'regnSkog', till: 'jord', väg: 'ned',
          rätt: 0,
          alt: ['Det tränger ner i marken', 'Det stannar på ytan för alltid', 'Det blir sand'],
          ikon: ['ner', 'yta', 'sand'],
          namn: 'Infiltration',
          förklaring: 'Marken är full av porer mellan gruskorn, rötter och maskgångar. Vattnet tränger ner genom dem – infiltration. Långt under marken samlas det som grundvatten.'
        },
        {
          fraga: 'Grundvattnet ligger djupt under marken. Vart rinner det?',
          från: 'jord', till: 'grund', väg: 'ned',
          rätt: 1,
          alt: ['Upp i himlen igen', 'Långsamt tillbaka till sjön', 'In i berget för alltid'],
          ikon: ['upp', 'hav', 'berg'],
          namn: 'Grundvatten',
          förklaring: 'Grundvattnet rinner mycket långsamt genom marken och kommer tillbaka till bäckar, sjöar och hav. Det kan ta månader eller många år.'
        },
        {
          fraga: 'Vattnet är tillbaka i sjön. Solen skiner igen. Vad händer?',
          från: 'grund', till: 'hav', väg: 'hav',
          rätt: 2,
          alt: ['Kretsloppet stannar', 'Vattnet försvinner', 'Det avdunstar igen – varvet börjar om'],
          ikon: ['stopp', 'bort', 'upp'],
          namn: 'Kretslopp',
          förklaring: 'Samma vattenmolekyler rör sig runt i kretsloppet om och om igen. Inget vatten försvinner – det byter bara plats och form.'
        }
      ]
    },

    {
      nr: 2,
      namn: 'Staden',
      plats: 'stad',
      intro: 'Nu regnar det över en stad. Asfalt och gräsmattor släpper igenom vatten olika bra.',
      steg: [
        {
          fraga: 'Regnet faller på en parkeringsplats av asfalt. Vad händer med vattnet?',
          från: 'moln', till: 'gata', väg: 'ned',
          rätt: 1,
          alt: ['Det tränger ner genom asfalten', 'Det rinner ovanpå ytan', 'Det sugs upp av asfalten'],
          ikon: ['ner', 'yta', 'svamp'],
          namn: 'Avrinning',
          förklaring: 'Asfalt är tät: den har inga porer som släpper igenom vattnet. Vattnet rinner ovanpå marken – det kallas avrinning.'
        },
        {
          fraga: 'Vattnet rinner längs gatan. Vart tar det vägen?',
          från: 'gata', till: 'brunn', väg: 'gata',
          rätt: 0,
          alt: ['Ner i en dagvattenbrunn', 'Upp i molnet direkt', 'Ner i grundvattnet genom asfalten'],
          ikon: ['brunn', 'upp', 'ner'],
          namn: 'Dagvatten',
          förklaring: 'Längs kanterna finns dagvattenbrunnar. De leder regnvattnet i rör tillbaka till en bäck, älv eller sjö – utan att vattnet renas som dricksvatten.'
        },
        {
          fraga: 'Regnet faller i stället på en gräsplan i staden. Vad händer?',
          från: 'regnSkog', till: 'jord', väg: 'ned',
          rätt: 2,
          alt: ['Det rinner av på ytan', 'Det blir kvar ovanpå gräset', 'Det tränger ner i marken'],
          ikon: ['yta', 'yta', 'ner'],
          namn: 'Infiltration',
          förklaring: 'Gräs och jord har porer, så där kan vattnet tränga ner och bli grundvatten. Därför rinner det mycket mindre vatten från en park än från en parkeringsplats.'
        },
        {
          fraga: 'Solen kommer fram och asfalten blir varm. Vad händer med vattnet på den?',
          från: 'gata', till: 'luft', väg: 'upp',
          rätt: 0,
          alt: ['Det avdunstar fortare än från en sjö', 'Det fryser', 'Ingenting händer'],
          ikon: ['upp', 'is', 'stopp'],
          namn: 'Avdunstning',
          förklaring: 'En mörk asfalt blir mycket varm i solen. Värmen ger vattnet energi, så det avdunstar snabbt. Därför torkar gatan fortare än gräset.'
        },
        {
          fraga: 'Vattenångan från staden stiger. Vad krävs för att den ska bli moln?',
          från: 'luft', till: 'moln', väg: 'upp',
          rätt: 1,
          alt: ['Att den värms ännu mer', 'Att den kyls av högre upp', 'Att det slutar blåsa'],
          ikon: ['sol', 'moln', 'vind'],
          namn: 'Kondensering',
          förklaring: 'Moln bildas när luften kyls av. Kall luft kan inte hålla lika mycket vattenånga, så ångan kondenserar till droppar. Varm luft stiger och kyls av just därför.'
        },
        {
          fraga: 'Dagvattnet har runnit ut i sjön. Vad betyder det för kretsloppet?',
          från: 'brunn', till: 'hav', väg: 'hav',
          rätt: 2,
          alt: ['Vattnet är borta ur kretsloppet', 'Vattnet blir kvar i rören', 'Vattnet är tillbaka och kan avdunsta igen'],
          ikon: ['bort', 'ror', 'upp'],
          namn: 'Kretslopp',
          förklaring: 'Vattnet är tillbaka i sjön och kan avdunsta på nytt. Kretsloppet är slutet: varken mer eller mindre vatten finns, det flyttar bara runt.'
        }
      ]
    },

    {
      nr: 3,
      namn: 'Vintern',
      plats: 'skog',
      intro: 'Det är vinter. Molnen är kalla och marken är frusen – vad gör vattnet då?',
      steg: [
        {
          fraga: 'Det är 15 minusgrader i molnet. Vad faller?',
          från: 'moln', till: 'snö', väg: 'ned',
          rätt: 0,
          alt: ['Snö – iskristaller', 'Regn', 'Ingenting'],
          ikon: ['sno', 'regn', 'stopp'],
          namn: 'Nederbörd',
          förklaring: 'När det är kallt i molnet bildas iskristaller i stället för vattendroppar. De faller som snö och kan smälta på vägen ned om luften närmast marken är varm.'
        },
        {
          fraga: 'Snön ligger kvar på marken hela vintern. Vart tar den vägen?',
          från: 'snö', till: 'snö', väg: 'still',
          rätt: 1,
          alt: ['Den avdunstar direkt', 'Den ligger kvar tills det blir varmare', 'Den tränger ner i den frusna marken'],
          ikon: ['upp', 'stopp', 'ner'],
          namn: 'Snötäcke',
          förklaring: 'Så länge det är kallt ligger snön kvar. En del av vattnet avdunstar visserligen från ytan (sublimation), men merparten sparas i snötäcket till våren.'
        },
        {
          fraga: 'Det är tjäle i marken. Snön smälter i solen på våren. Vad händer med smältvattnet?',
          från: 'snö', till: 'gata', väg: 'ned',
          rätt: 2,
          alt: ['Det tränger rätt ner i marken', 'Det sugs upp av träden direkt', 'Det rinner ovanpå den frusna marken'],
          ikon: ['ner', 'trad', 'yta'],
          namn: 'Avrinning',
          förklaring: 'Frusen mark har inga öppna porer, så vattnet kan inte tränga ner. Smältvattnet rinner ovanpå marken – det är därför vårfloden kommer just när tjälen släpper.'
        },
        {
          fraga: 'Senare på våren har marken tinat. Vad kan smältvattnet göra nu?',
          från: 'gata', till: 'jord', väg: 'ned',
          rätt: 0,
          alt: ['Tränga ner och bli grundvatten', 'Bara avdunstna', 'Bli is igen'],
          ikon: ['ner', 'upp', 'is'],
          namn: 'Infiltration',
          förklaring: 'När tjälen har släppt öppnas markens porer igen. Då kan smältvattnet infiltrera och fylla på grundvattnet – det är en viktig del av årets vattenbalans.'
        },
        {
          fraga: 'Vad är det som driver hela kretsloppet runt?',
          från: 'jord', till: 'hav', väg: 'hav',
          rätt: 1,
          alt: ['Månen', 'Solens energi', 'Vinden ensam'],
          ikon: ['mane', 'sol', 'vind'],
          namn: 'Solens energi',
          förklaring: 'Solen värmer jorden och vattnet ojämnt. Värmen får vatten att avdunsta och luft att stiga, och tyngdkraften får regnet att falla. Solen är kretsloppets motor.'
        },
        {
          fraga: 'Vattnet har gått ett helt varv. Försvinner det något vatten på vägen?',
          från: 'hav', till: 'hav', väg: 'hav',
          rätt: 2,
          alt: ['Ja, lite försvinner varje varv', 'Ja, solen bränner upp det', 'Nej, samma vatten rör sig runt igen'],
          ikon: ['bort', 'sol', 'hav'],
          namn: 'Kretslopp',
          förklaring: 'Mängden vatten på jorden är i stort sett densamma hela tiden. Dinosauriernas vattendroppar kan vara samma molekyler som regnet idag – de har bara rest runt i kretsloppet.'
        }
      ]
    }
  ];

  const api = { NIVÅER, PUNKTER: P, POSITIONER: P };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.VATTEN = api;
})(typeof window !== 'undefined' ? window : globalThis);