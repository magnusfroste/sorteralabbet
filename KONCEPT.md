# Sortera i labbet — koncept

**Mål (en sak per app):** barnet övar på att dela in ämnen och material efter en egenskap —
löslighet i vatten, ledningsförmåga och surt/basiskt — och får höra varför.

**Målgrupp:** åk 4–6 (10–12 år). Kemi 4–6 har **noll** appar i katalogen (mätt på admin-ytan
2026-11-25: 82 rader, KE.4-6.* i 0 av dem; all kemi i katalogen ligger på 7–9).

**Kärnmekanik (touch först):** ett föremål ligger på labbänken, ett "prov" visas högst upp
(vattenglas = löslighet, batteri = ledningsförmåga, pH-papper = surt/basiskt), och två stora
lådor står längst ned. Ett tryck på en låda sorterar föremålet. Rätt: föremålet far ned i lådan,
stjärna, faktaraden skrivs och läses upp ("Salt löser sig i vatten — salt är lösligt"). Fel:
lådan skakar, föremålet stannar kvar, förklaringen talar om vad som händer i försöket; efter två
fel pulserar rätt låda. Aldrig förlust, aldrig tidsgräns.

**Nivåer (svårigheten stiger genom att provet varierar, inte genom klockan):**
1. Löser det sig i vatten? (6 föremål, två lådor)
2. Leder det ström? (6 av 9, bland annat saltvatten och grafit som man inte tror leder)
3. Surt eller basiskt? (6 av 8, pH-papper som bild)
4. Blandat: provet byts för varje föremål och barnet måste läsa provet, inte lådorna (8 frågor)

**5-minuterssession:** 4 nivåer × 5–8 frågor = 26 frågor, "Nästa nivå" mellan nivåerna.

**Belöning barnet kan berätta om:** stjärnor per nivå och en slutskärm ("Alla nivåer klara!
24 stjärnor") — och faktarader som går att säga hemma: "saltvatten leder ström, rent vatten
nästan inte alls".

**Vad barnet lär:** att en egenskap (löslighet, ledningsförmåga, surt/basiskt) är något man
*testar*, inte något man ser på föremålet; att metaller leder ström och gummi/glas/plast inte;
att sura och basiska ämnen finns i köket och att man aldrig smakar för att ta reda på det.

**Lgr22 (ordagrant ur Skolverkets API, hämtat 2026-11-23):**
- KE.4-6.1.2 — "Indelning av ämnen och material utifrån egenskaperna löslighet, ledningsförmåga, surt eller basiskt."
- KE.4-6.1.3 — "Vattnets egenskaper och kretslopp."

**Varför det funkar på iPad:** ett tryck per fråga, två lådor på 96+ px, föremålet stort i mitten,
provet som bild + ord + uppläst mening (fungerar även med ljudet av), allt ryms på en skärm.

## Testplan (mätbara krav)
1. Allt ryms: `scrollHeight-innerHeight == 0` och `scrollWidth-innerWidth == 0` i 1024×768,
   768×1024, 390×844, 1440×900 — både startskärm och spel.
2. Spelbart med bara fingrar: hela rundan spelas med `Input.dispatchTouchEvent` (touchStart/
   touchEnd), inte klick.
3. Varje fråga har exakt två lådor, och rätt låda finns alltid bland dem.
4. Faktaraden namnger föremålet och egenskapen; rätt svar står inte i frågan.
5. Fel svar flyttar inte frågan vidare; efter två fel pulserar rätt låda.
6. Ingen inloggning, ingen reklam, inga länkar ut, ingen tredjepartsförfrågan utom
   `kotten.js`; ljudknapp 44 px som också stänger av talet.
7. Text i spelbilden ≥ 18 px, `lang="sv"`, `prefers-reduced-motion` stänger av pulseringen.
8. Faktan får inte vara påhittad: varje post i `AMNEN` kontrolleras av `verify.cjs` mot en
   handskriven egenskapstabell, och appen anger Skolverkets kunskapskrav som källa.

## Validering (go/no-go)
`delegate_task` finns inte i denna körnings verktygslåda, så valideringen gjordes som en skriven
motfråga mot de tre kraven:
(a) *Spelar ett barn frivilligt 5 minuter?* Ja om tempot är ett tryck per fråga och faktan är
överraskande (saltvatten leder, blyertspenna leder, tvål är basiskt). Risk: nivå 1 kan bli för lätt
för en 11-åring — därför är nivå 4 obligatorisk och blandar proven.
(b) *Träffar det ett verkligt kunskapskrav?* Ja, KE.4-6.1.2 är ordagrant "indelning av ämnen och
material utifrån egenskaperna löslighet, ledningsförmåga, surt eller basiskt" — appens tre prov är
exakt de tre egenskaperna.
(c) *Teknisk risk?* Låg: ingen fysikmotor, ingen canvas, bara DOM + inline SVG. Största risken är
att faktan blir fel, vilket hanteras av tabellen i `verify.cjs`.

**Beslut: GO.**