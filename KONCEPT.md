# Vattenresan – koncept, testplan och testresultat

## Koncept (15 rader)

- **Mål (en sak):** eleven ska kunna följa en droppe vatten ett helt varv
  genom vattnets kretslopp och välja nästa steg rätt, med rätt begrepp.
- **Målgrupp:** åk 4–6 (9–11 år), kemi och NO-relaterad geografi, iPad först.
- **Kärnmekanik (touch först):** scenen visar sjö, skogsbacke och stad. En droppe
  står på rätt plats i bilden; under bilden står en fråga om det som händer härnäst
  och tre stora svarsplattor. Rätt val → droppen glider till nästa plats (bea, moln,
  jord, gata, brunn, sjö) med tydlig båge, förklaringen skrivs ut och läses fel.
  Fel val → inget går förlorat; efter två försök pulserar rätt platta.
- **5-minuterssession:** tre nivåer med sex steg, "Nästa nivå"- och "Spela igen"-knapp.
- **Belöning barnet kan berätta om:** antal stjärnor (steg som löstes på första
  försöket, 0–6 per nivå), "Alla nivåer klara" med tre miljöer: sjön, staden, vintern.
- **Vad barnet lär:** avdunstning → kondensering → nederbörd och att vattnet tar
  olika väg hem: infiltration och grundvatten genom porös mark, avrinning och
  dagvatten över asfalt, samt att tjäle gör vårfloden till avrinning i stället.
- **Varför det funkar på iPad:** ingen teckeninmatning, tre plattor om minst 76 px,
  hela bilden är ett enda lungtryck, inga menyer under speletpp.

## Lgr22 (citat hmtade ur get_curriculum, inte ur huvudet)

- **KE.4-6.1.3** – ”Vattnets egenskaper och kretslopp.”
  (Skolverket, Syllabus API, hämtad 2026-11-23 – samma text används i index.html och
  katalogens long_description.)

## Testplan (mätbart, sätts före koden)

1. `node verify.cjs` måste ge 0 fel: 18 steg, tre alternativ per fråga med unika
   texter, rätt index 0–2, inga svarstexter i frågorna, samtliga scenpunkter inom
   viewBoxen, alla tre nivåer återvänder till sjön. 20 000 rundor genom appens
   faktiska reaktionsschema (fel efter två klick visar svaret) ska avslutas utan häng.
2. Scrollfri i 1024×768, 768×1024, 390×844 och 1440×900, både på startskärmen och i
   spelbilden: `scrollHeight - innerHeight == 0` och `scrollWidth - innerWidth == 0`.
3. Hela rundan spelas med äkta touch (`Input.dispatchTouchEvent`) på ett spillat skärm:
   bekräfta att stjärnorna räknas, att ett fel inte flyttar frågan och att två fel
   visar svaret utan förlustsläge.
4. Tryckytorna minst 56 px i höjden (3–6-banden).
5. Inga konton, cookies för skolan, utgående länkar utöver kodsnutten;
   `window.skolappar.event` rapporterar round_start, round_done, level, hint, sound_off.
6. Frågan och förklaringen finns alltid som text i DOM (inte bara talat) –
   klassrummens plattor är tysta.

## Självkritisk genomgång före bygge (gömd i två agenterseminariet som `delegate_task` saknas den här körningen)

- **(a) 5 minuter frivilligt?** Ja om stången håller: 18 steg med konsekvent
  förklaring som varvas med rörelse. Risk: miljöerna är samma båt – testa om
  nivå 2 och 3 känns olika. **Kontrolls/justering: vintern och staden har egen
  faktatext (asnastad ning, tjäle, dagvatten), det är inte samma frågor om igen.**
- **(b) Riktigt kunskapskrav?** Ja, KE.4-6.1.3 är tom i katalogen (mätt: 0 av 82
  rader på admin-ytan 2026-11-25) och kräver just kretsloppet.
- **(c) Teknisk risk?** Lägsta: allt är en SVG-scen i SVG + vanliga knappar, ingen
  fysik, canvas eller engine. Största riskfaktorn är animationstakten och
  layout i stående läge. **Verifieras i avsnitt 6 – rasterfallet kollas på plats.**

## Testresultat (fylls i efter körningen i riktig webbläsare)