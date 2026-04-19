import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════
   PIPELINE  —  Career Trading Terminal  v4.0
   IB · PE · PC · MBB  ·  DACH · Zürich · London
   Freemium-ready · Live data · Bloomberg aesthetic
═══════════════════════════════════════════════════════════════════ */

const C = {
  bg:"#070709", panel:"#0d0d10", border:"#1a1a20", borderBright:"#2a2a35",
  orange:"#FF6B00", orangeDim:"rgba(255,107,0,0.12)", orangeGlow:"rgba(255,107,0,0.06)",
  green:"#00D084", greenDim:"rgba(0,208,132,0.12)", red:"#FF3B5C", redDim:"rgba(255,59,92,0.1)",
  amber:"#FFB800", amberDim:"rgba(255,184,0,0.1)", blue:"#2D9EFF", blueDim:"rgba(45,158,255,0.12)",
  cyan:"#00D4FF", purple:"#9B6DFF",
  text:"#E8E8EE", muted:"#A8A8B8", dim:"#666676", faint:"#2C2C3A",
};
const mono = "'JetBrains Mono','Courier New',monospace";
const sans = "'IBM Plex Sans',system-ui,sans-serif";

/* ─────────────────────────────────────────────
   SEED DATA — 40+ firms across DACH / CH / LDN
───────────────────────────────────────────── */
const SEED = [
/* ══ IB – DACH ══ */
{id:"gs_ffm",  firm:"Goldman Sachs",    short:"GS", role:"Off-Cycle Intern – Investment Banking",         type:"IB",  tier:"BB",  loc:"Frankfurt",  region:"DACH", year:2026, deadline:"2026-08-31", start:"Okt 2026",   duration:"10 Wochen",                  apps:850, avgScore:83, spots:4,  acceptRate:0.5,  url:"https://higher.gs.com/roles",                       department:"Investment Banking Division (IBD)",       abteilung:"M&A · ECM · DCM",                    firmDesc:"Weltweit führende Investmentbank. Das Frankfurter IBD-Team deckt DACH-M&A und Kapitalmarkttransaktionen in TMT, Industrials und Consumer ab.", aufgaben:["Pitchbooks & Informationsmemoranden","DCF-, LBO- & Comps-Modelle","Live-Deal-Unterstützung & Due Diligence","Sektor- und Unternehmensrecherchen"], anforderungen:["Top-Uni","Note ≤1,5","1+ BB/MBB/TAS-Praktikum","Englisch C2"], required:{uni:22,gpa:22,praktika:20,lang:12,skills:9}, medianGpa:1.3, medianPrak:"BB + MBB", medianLang:"C2"},
{id:"jpm_ffm", firm:"JPMorgan Chase",   short:"JPM",role:"Investment Banking Analyst – Off-Cycle",        type:"IB",  tier:"BB",  loc:"Frankfurt",  region:"DACH", year:2026, deadline:"2026-07-31", start:"Okt 2026",   duration:"6 Monate",                   apps:720, avgScore:81, spots:6,  acceptRate:0.8,  url:"https://careers.jpmorgan.com",                      department:"Corporate & Investment Bank (CIB)",       abteilung:"M&A · LevFin · ECM",                 firmDesc:"Größte US-Bank. Starkes Frankfurter IB-Team mit Fokus auf DACH-M&A, Leveraged Finance und ECM.", aufgaben:["Finanzmodelle & Transaktionspräsentationen","Deal-Execution von Pitch bis Close","Marktanalysen & Sektor-Coverage"], anforderungen:["Sehr gutes Studium","Finance-Praktikum","Englisch C1/C2"], required:{uni:21,gpa:20,praktika:18,lang:12,skills:8}, medianGpa:1.4, medianPrak:"BB / Big 4 TAS", medianLang:"C2"},
{id:"db_ffm",  firm:"Deutsche Bank",    short:"DB", role:"Graduate Analyst – Corporate Finance & Advisory",type:"IB",  tier:"BB",  loc:"Frankfurt",  region:"DACH", year:2027, deadline:"2026-09-30", start:"Jan 2027",   duration:"2-Jahres-Rotationsprogramm",  apps:620, avgScore:65, spots:12, acceptRate:1.9,  url:"https://careers.db.com",                            department:"Corporate Finance & Advisory (CFA)",      abteilung:"Leveraged Finance · M&A · DCM",      firmDesc:"Deutschlands größte Bank. Das CFA-Team ist einer der aktivsten Akteure in DACH-LevFin und M&A.", aufgaben:["Rotation durch M&A, LevFin und DCM","Pitches & Transaktionsunterstützung","Finanzmodelle"], anforderungen:["Abschluss ≥ 2,0","Finance-Hintergrund","Deutsch + Englisch"], required:{uni:18,gpa:14,praktika:10,lang:10,skills:6}, medianGpa:1.7, medianPrak:"Big 4 / Industrie", medianLang:"C1"},
{id:"roth_ffm",firm:"Rothschild & Co",  short:"RO", role:"Analyst – Global Advisory",                     type:"IB",  tier:"EB",  loc:"Frankfurt",  region:"DACH", year:2026, deadline:"2026-06-30", start:"Okt 2026",   duration:"6 Monate",                   apps:280, avgScore:78, spots:3,  acceptRate:1.1,  url:"https://www.rothschildandco.com/en/careers",        department:"Global Advisory",                         abteilung:"M&A · Restructuring · Debt Advisory",firmDesc:"Renommierteste unabhängige Investmentbank weltweit. Frankfurter Team deckt DACH-M&A, Restrukturierungen und Debt Advisory ab.", aufgaben:["M&A-Prozess von Pitch bis Close","LBO- und DCF-Modelle","CIMs und Pitchbooks"], anforderungen:["Top-Uni ≤1,6","1 relevantes Praktikum","Englisch C2"], required:{uni:21,gpa:20,praktika:17,lang:12,skills:8}, medianGpa:1.4, medianPrak:"BB / Big 4 TAS", medianLang:"C2"},
{id:"ev_ffm",  firm:"Evercore",         short:"EV", role:"Off-Cycle Intern – Investment Banking",         type:"IB",  tier:"EB",  loc:"Frankfurt",  region:"DACH", year:2026, deadline:"2026-05-31", start:"Jul 2026",   duration:"4–6 Monate",                 apps:190, avgScore:80, spots:2,  acceptRate:0.3,  url:"https://www.evercore.com/careers",                  department:"Investment Banking Advisory",             abteilung:"M&A · Restructuring",                firmDesc:"US-Elite-Boutique mit hochkarätigem Frankfurter Team. Bekannt für komplexe M&A und Restructuring-Mandate.", aufgaben:["Intensive Modellarbeit","Pitchbook-Erstellung","Deal-Prozess-Support"], anforderungen:["WHU/HBS/LBS","Note ≤1,3","BB oder EB zwingend","Englisch C2"], required:{uni:24,gpa:22,praktika:20,lang:12,skills:10}, medianGpa:1.2, medianPrak:"BB + EB", medianLang:"C2"},
{id:"hl_ffm",  firm:"Houlihan Lokey",   short:"HL", role:"Analyst Intern – Financial Restructuring",     type:"IB",  tier:"EB",  loc:"Frankfurt",  region:"DACH", year:2026, deadline:"2026-07-15", start:"Okt 2026",   duration:"6 Monate",                   apps:210, avgScore:74, spots:3,  acceptRate:1.1,  url:"https://www.hl.com/about/careers",                  department:"Financial Restructuring (FR)",            abteilung:"Restrukturierung · Sondersituationen",firmDesc:"Weltweit führende Restrukturierungsbank. Das Frankfurter FR-Team berät Schuldner, Gläubiger und Investoren in Sondersituationen.", aufgaben:["Restrukturierungsmodelle","Gläubiger- und Schuldner-Beratung","Liquiditäts- & Covenant-Analysen"], anforderungen:["Sehr gutes Finance-Studium","Interesse an Restrukturierung","Englisch C1/C2"], required:{uni:20,gpa:19,praktika:15,lang:11,skills:8}, medianGpa:1.5, medianPrak:"Big 4 / IB Boutique", medianLang:"C1"},
{id:"li_ffm",  firm:"Lincoln International",short:"LI",role:"Analyst – Debt Advisory DACH",              type:"IB",  tier:"EB",  loc:"Frankfurt",  region:"DACH", year:2026, deadline:"2026-08-31", start:"Okt 2026",   duration:"6 Monate (Übernahme möglich)", apps:180, avgScore:62, spots:3, acceptRate:1.7,  url:"https://www.lincolninternational.com/careers",      department:"Debt Advisory – DACH",                   abteilung:"Acquisition Finance · Unitranche",   firmDesc:"Führende unabhängige Elite-Boutique für M&A und Debt Advisory. Frankfurter Team berät PE-Sponsoren bei Fremdkapitalstrukturierung im DACH-Raum.", aufgaben:["Kreditanalysen & Finanzmodelle","Lender Presentations & Term Sheet-Vergleiche","Marktrecherche Private-Credit-Markt"], anforderungen:["Studium BWL/VWL/Finance","Private Debt Interesse","Englisch + Deutsch fließend"], required:{uni:18,gpa:16,praktika:12,lang:10,skills:6}, medianGpa:1.6, medianPrak:"Big 4 / Boutique", medianLang:"C1"},
{id:"bnp_ffm", firm:"BNP Paribas",      short:"BNP",role:"Intern – CIB Investment Banking",             type:"IB",  tier:"BB",  loc:"Frankfurt",  region:"DACH", year:2026, deadline:"2026-07-15", start:"Okt 2026",   duration:"6 Monate",                   apps:390, avgScore:63, spots:8,  acceptRate:1.6,  url:"https://group.bnpparibas/en/careers",               department:"Corporate & Institutional Banking",       abteilung:"M&A · DCM · Structured Finance",     firmDesc:"Europas größte Bank. Das Frankfurter CIB-Team fokussiert auf DACH-Corporate-Kunden, DCM und strukturierte Finanzierungen.", aufgaben:["Kreditanalysen & Bewertungen","Pitch-Vorbereitung","Marktrecherchen"], anforderungen:["Finance/BWL-Studium","Englisch + Deutsch fließend"], required:{uni:17,gpa:14,praktika:9,lang:10,skills:5}, medianGpa:1.8, medianPrak:"Big 4 / Boutique", medianLang:"C1"},

/* ══ IB – Zürich ══ */
{id:"ubs_zh",  firm:"UBS Investment Bank",short:"UBS",role:"Intern – Investment Banking (EMEA)",          type:"IB",  tier:"BB",  loc:"Zürich",     region:"CH",   year:2026, deadline:"2026-06-30", start:"Sep 2026",   duration:"6 Monate",                   apps:640, avgScore:76, spots:8,  acceptRate:1.3,  url:"https://www.ubs.com/careers",                       department:"Investment Bank – EMEA Coverage",         abteilung:"M&A · ECM · LevFin",                 firmDesc:"UBS ist die größte Schweizer Bank und betreibt nach der CS-Übernahme eines der größten europäischen Investment-Banking-Franchises. Das Zürcher IB ist stark in EMEA-M&A, ECM und Finanzierungen.", aufgaben:["M&A-Pitchbooks & Transaktionsmodelle","ECM- und DCM-Analysen","Klientenpräsentationen & Due Diligence","Sektor-Research"], anforderungen:["Top-Uni Schweiz/Europa","Note ≤1,6","Analytische Stärke","Englisch C1/C2"], required:{uni:20,gpa:19,praktika:15,lang:11,skills:7}, medianGpa:1.5, medianPrak:"IB / Consulting", medianLang:"C1"},
{id:"roth_zh", firm:"Rothschild Zürich",  short:"RZH",role:"Analyst – M&A & Financing Advisory",         type:"IB",  tier:"EB",  loc:"Zürich",     region:"CH",   year:2026, deadline:"2026-07-01", start:"Okt 2026",   duration:"6 Monate",                   apps:180, avgScore:75, spots:2,  acceptRate:1.1,  url:"https://www.rothschildandco.com/en/careers",        department:"Global Advisory Zürich",                 abteilung:"M&A · Debt Advisory · Restructuring", firmDesc:"Das Zürcher Rothschild-Team berät Schweizer und europäische Blue-Chip-Kunden bei komplexen M&A- und Finanzierungstransaktionen.", aufgaben:["Eigenständige Modellarbeit","Pitch- und CIM-Erstellung","Cross-border M&A Support"], anforderungen:["Top-Uni","Note ≤1,5","BB oder EB Vorerfahrung wünschenswert"], required:{uni:21,gpa:20,praktika:15,lang:11,skills:8}, medianGpa:1.4, medianPrak:"IB Boutique / Big 4", medianLang:"C2"},
{id:"zkb_zh",  firm:"Zürcher Kantonalbank",short:"ZKB",role:"Praktikant – Corporate Finance & Advisory",  type:"IB",  tier:"EB",  loc:"Zürich",     region:"CH",   year:2026, deadline:"2026-08-15", start:"Nov 2026",   duration:"3–6 Monate",                 apps:130, avgScore:61, spots:4,  acceptRate:3.1,  url:"https://www.zkb.ch/karriere",                       department:"Corporate Finance",                       abteilung:"M&A · ECM · Advisory",               firmDesc:"Die ZKB ist die größte Kantonalbank der Schweiz mit einer aktiven Corporate-Finance-Boutique. Sehr guter Einstieg für den Schweizer IB-Markt.", aufgaben:["M&A-Transaktionsunterstützung","Bewertungsmodelle","Pitch-Materialien"], anforderungen:["Studium Uni Zürich / ETH / HSG","Note ≤2,0 (CH-Skala)","Deutsch + Englisch"], required:{uni:17,gpa:15,praktika:9,lang:9,skills:5}, medianGpa:1.7, medianPrak:"Big 4 / Industrie", medianLang:"C1"},

/* ══ IB – London ══ */
{id:"gs_lon",  firm:"Goldman Sachs London",short:"GS•LDN",role:"Summer Analyst – Investment Banking (EMEA)",type:"IB", tier:"BB", loc:"London",      region:"LDN",  year:2026, deadline:"2026-10-31", start:"Jun 2027",   duration:"10 Wochen",                  apps:3200,avgScore:87, spots:40, acceptRate:1.3,  url:"https://higher.gs.com/roles",                       department:"Investment Banking Division – EMEA",      abteilung:"M&A · ECM · DCM · Sponsor Coverage",firmDesc:"Londoner IBD ist das globale Zentrum von Goldman Sachs für EMEA-Transaktionen. Größte Deal-Pipeline, intensivste Ausbildung, höchstes Prestige.", aufgaben:["Vollumfängliche Transaktionsunterstützung","LBO-, DCF-, Comps-Modelle","Pitchbooks für globale Mandate","Direkte MD/VP-Exposition"], anforderungen:["Absolutes Top-Profil europaweit","Note ≤1,3","2+ relevante Praktika","Englisch C2 zwingend"], required:{uni:24,gpa:23,praktika:22,lang:12,skills:10}, medianGpa:1.2, medianPrak:"BB + MBB", medianLang:"C2"},
{id:"ms_lon",  firm:"Morgan Stanley London",short:"MS•LDN",role:"Summer Analyst – M&A & Capital Markets",type:"IB",  tier:"BB",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-10-15", start:"Jun 2027",   duration:"10 Wochen",                  apps:2800,avgScore:86, spots:35, acceptRate:1.3,  url:"https://www.morganstanley.com/people/campus-recruitment",department:"Investment Banking Division",      abteilung:"M&A · ECM · Debt",                   firmDesc:"Morgan Stanley London ist das Europazentrum für globale IBD-Transaktionen. Starke Coverage in Healthcare, TMT und EMEA-Sponsor Finance.", aufgaben:["Bewertungsmodelle & Szenarioanalysen","Pitchbooks & CIMs","Transaktionsunterstützung"], anforderungen:["Top-Uni europaweit","Note ≤1,4","BB/TAS-Praktikum","Englisch C2"], required:{uni:23,gpa:22,praktika:20,lang:12,skills:9}, medianGpa:1.3, medianPrak:"BB / TAS", medianLang:"C2"},
{id:"jpm_lon", firm:"JPMorgan London",    short:"JPM•LDN",role:"Investment Banking Analyst – Summer Program",type:"IB",tier:"BB", loc:"London",     region:"LDN",  year:2026, deadline:"2026-10-01", start:"Jun 2027",   duration:"10 Wochen",                  apps:2600,avgScore:84, spots:45, acceptRate:1.7,  url:"https://careers.jpmorgan.com",                      department:"Corporate & Investment Bank",             abteilung:"M&A · LevFin · ECM · DCM",           firmDesc:"JPMorgan London ist Europas größtes IB-Büro. Unübertroffene Produktbreite und Transaktionsvolumen in EMEA.", aufgaben:["Deal-Execution von Pitch bis Close","Finanzmodelle","Marktanalysen","Klienten-Management"], anforderungen:["Top-Uni","2+ Praktika","Englisch C2"], required:{uni:22,gpa:21,praktika:20,lang:12,skills:9}, medianGpa:1.3, medianPrak:"BB / Big 4", medianLang:"C2"},

/* ══ PE – DACH ══ */
{id:"bx_ffm",  firm:"Blackstone",        short:"BX", role:"Summer Analyst – Private Equity Europe",       type:"PE",  tier:"MF",  loc:"Frankfurt",  region:"DACH", year:2026, deadline:"2026-05-15", start:"Jun 2026",   duration:"10 Wochen",                  apps:1240,avgScore:89, spots:2,  acceptRate:0.2,  url:"https://www.blackstone.com/careers",                department:"Private Equity – Europe Buyout",          abteilung:"Corporate PE · DACH/Europe Large Cap",firmDesc:"Weltweit größte Alternative-Asset-Gesellschaft ($1 Bio. AUM). Frankfurter Team fokussiert auf DACH- und paneuropäische Buyouts im Large-Cap-Segment.", aufgaben:["Deal-Sourcing & Screening","LBO-Modelle & Returns-Analyse","Branchenanalysen & Due Diligence","IC-Memoranda"], anforderungen:["WHU/HBS Niveau","Note ≤1,3","BB+PE Vorerfahrung","LBO-Modeling zwingend"], required:{uni:24,gpa:22,praktika:22,lang:12,skills:10}, medianGpa:1.2, medianPrak:"BB + Top-PE", medianLang:"C2"},
{id:"cg_ffm",  firm:"The Carlyle Group", short:"CG", role:"Analyst – Buyout DACH",                       type:"PE",  tier:"MF",  loc:"Frankfurt",  region:"DACH", year:2026, deadline:"2026-04-30", start:"Sep 2026",   duration:"6 Monate (Festanstellung)",   apps:980, avgScore:85, spots:2,  acceptRate:0.2,  url:"https://www.carlyle.com/careers",                   department:"Europe Buyout – DACH",                   abteilung:"Mid-to-Large Cap · Industrials",     firmDesc:"Carlyle ($440 Mrd. AUM). Frankfurter Team fokussiert auf DACH-Buyouts €100–€1000 Mio. EV in Industrials, Business Services und Healthcare.", aufgaben:["LBO-Modelle & Renditeanalysen","Deal-Sourcing","IC-Memoranda","Portfoliomonitoring"], anforderungen:["Top-Uni","Note ≤1,4","BB-Praktikum","LBO-Modeling","Deutsch + Englisch C2"], required:{uni:22,gpa:20,praktika:20,lang:12,skills:9}, medianGpa:1.3, medianPrak:"BB + PE", medianLang:"C2"},
{id:"eqt_muc", firm:"EQT",               short:"EQT",role:"Intern – Private Equity (Equity Team)",        type:"PE",  tier:"MF",  loc:"München",    region:"DACH", year:2026, deadline:"2026-06-15", start:"Okt 2026",   duration:"6 Monate",                   apps:760, avgScore:82, spots:3,  acceptRate:0.4,  url:"https://eqtgroup.com/careers",                      department:"EQT Private Equity – DACH",              abteilung:"Mid-to-Large Cap Buyout · Tech",      firmDesc:"EQT ($230 Mrd. AUM) – schwedische PE-Gesellschaft mit starker DACH-Präsenz. Führend in Tech-Buyouts und industriellen Wachstumsstrategien.", aufgaben:["Deal-Analyse & LBO-Modellierung","Sektor-Screenings","DD-Prozessunterstützung","Portfoliounternehmen-Monitoring"], anforderungen:["Sehr gutes Studium","Note ≤1,5","BB oder MBB Vorerfahrung","Englisch C2"], required:{uni:22,gpa:20,praktika:19,lang:12,skills:9}, medianGpa:1.3, medianPrak:"BB / MBB", medianLang:"C2"},
{id:"ard_ffm", firm:"Ardian – Buyout",   short:"ARD",role:"Praktikum – Private Equity (Buyout Team)",     type:"PE",  tier:"LG",  loc:"Frankfurt",  region:"DACH", year:2026, deadline:"2026-07-31", start:"Okt 2026",   duration:"3–6 Monate",                 apps:420, avgScore:76, spots:3,  acceptRate:0.7,  url:"https://www.ardian.com/join-us",                    department:"Buyout / Expansion",                     abteilung:"Mid-Cap Buyout DACH",                firmDesc:"Ardian ($170 Mrd. AUM) – eine der größten europäischen unabhängigen PE-Gesellschaften. Frankfurter Buyout-Team investiert in mittelständische DACH-Unternehmen.", aufgaben:["Deal-Sourcing & Unternehmensbewertung","LBO-Modellierung","IC-Memos & Investment Presentations"], anforderungen:["Sehr gutes Studium","Note ≤1,6","Finance-Vorerfahrung (IB/TAS)","Englisch C1/C2"], required:{uni:20,gpa:18,praktika:17,lang:11,skills:8}, medianGpa:1.5, medianPrak:"BB / Big 4 TAS", medianLang:"C1"},
{id:"afin_muc",firm:"Afinum",            short:"AFN",role:"Praktikant – PE Investment Team",              type:"PE",  tier:"MM",  loc:"München",    region:"DACH", year:2026, deadline:"2026-08-01", start:"Okt 2026",   duration:"3–6 Monate",                 apps:180, avgScore:68, spots:2,  acceptRate:1.5,  url:"https://www.afinum.de/karriere",                    department:"Investment Team",                        abteilung:"DACH Mid-Market Buyout · Mittelstand", firmDesc:"Afinum – führende deutsche Mid-Market-PE mit Fokus auf profitable DACH-Mittelständler. Bekannt für operative Wertschöpfung.", aufgaben:["Deal-Sourcing & Erstbewertungen","LBO-Modelle","Due-Diligence-Support"], anforderungen:["Gutes Studium","Finance-Grundkenntnisse","Deutsch Muttersprache"], required:{uni:17,gpa:15,praktika:11,lang:10,skills:6}, medianGpa:1.7, medianPrak:"Big 4 / Boutique IB", medianLang:"C1"},

/* ══ PE – Zürich ══ */
{id:"pg_zh",   firm:"Partners Group",    short:"PG", role:"Intern – Private Equity (Direct Investments)",  type:"PE",  tier:"MF",  loc:"Zürich",     region:"CH",   year:2026, deadline:"2026-07-01", start:"Okt 2026",   duration:"6 Monate",                   apps:520, avgScore:79, spots:4,  acceptRate:0.8,  url:"https://www.partnersgroup.com/en/careers",          department:"Private Equity – Direkt",                abteilung:"DACH / Europa Buyout & Growth",       firmDesc:"Partners Group (CHF 150 Mrd. AUM) ist ein führender Schweizer Alternative-Asset-Manager. Das HQ in Zug/Zürich bietet direkte Exposition zu PE-Transaktionen weltweit.", aufgaben:["Deal-Analyse & LBO-Modellierung","IC-Unterlagen & Sektoranalysen","Portfoliounternehmen-Monitoring"], anforderungen:["Top-Uni Schweiz/Europa","Note ≤1,5","Finance-Vorerfahrung","Englisch C2"], required:{uni:21,gpa:19,praktika:17,lang:12,skills:8}, medianGpa:1.4, medianPrak:"IB / Big 4", medianLang:"C2"},
{id:"cap_zh",  firm:"Capvis",            short:"CPV",role:"Analyst Intern – Private Equity",              type:"PE",  tier:"MM",  loc:"Zürich",     region:"CH",   year:2026, deadline:"2026-08-31", start:"Nov 2026",   duration:"4–6 Monate",                 apps:160, avgScore:71, spots:2,  acceptRate:1.3,  url:"https://www.capvis.com/careers",                    department:"Investment Team",                        abteilung:"DACH Mid-Market Buyout",             firmDesc:"Capvis ist eine führende Schweizer Mid-Market-PE. Das Team investiert in profitable DACH-Mittelständler und bietet intensive Transaktionsexposition.", aufgaben:["Deal-Sourcing & Bewertungen","Finanzmodellierung","IC-Vorbereitung"], anforderungen:["Gutes Finance-Studium (HSG/ETH/Uni ZH)","Analytische Stärke","Deutsch + Englisch"], required:{uni:19,gpa:16,praktika:12,lang:10,skills:6}, medianGpa:1.6, medianPrak:"Big 4 / IB", medianLang:"C1"},

/* ══ PE – London ══ */
{id:"kkr_lon", firm:"KKR",               short:"KKR",role:"Summer Analyst – Private Equity Europe",       type:"PE",  tier:"MF",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-10-31", start:"Jun 2027",   duration:"10 Wochen",                  apps:1800,avgScore:90, spots:5,  acceptRate:0.3,  url:"https://kkr.com/careers",                           department:"Private Equity – Europe",                abteilung:"Buyout · Growth · Infrastructure",   firmDesc:"KKR ist eine der weltgrößten PE-Gesellschaften ($550 Mrd. AUM). Londoner Team verwaltet europäische Buyouts und Growth-Equity-Strategien.", aufgaben:["LBO-Modelle & Deal-Sourcing","IC-Memoranda","Branchenanalysen","Portfolio-Wertschöpfung"], anforderungen:["Absolutes Top-Profil","BB + PE Vorerfahrung zwingend","Englisch C2","LBO-Modeling"], required:{uni:25,gpa:23,praktika:23,lang:12,skills:11}, medianGpa:1.2, medianPrak:"BB + Top-PE", medianLang:"C2"},
{id:"apax_lon",firm:"Apax Partners",     short:"APX",role:"Analyst – Private Equity Summer Intern",       type:"PE",  tier:"MF",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-09-30", start:"Jun 2027",   duration:"10 Wochen",                  apps:1200,avgScore:87, spots:4,  acceptRate:0.3,  url:"https://www.apax.com/careers",                      department:"Private Equity",                         abteilung:"Tech · Services · Healthcare · Consumer",firmDesc:"Apax Partners ist ein global führender Large-Cap-PE-Investor mit Fokus auf Tech und Healthcare. Londoner Büro ist das globale Hauptquartier.", aufgaben:["Deal-Analyse & LBO-Modellierung","Sektor-Deepdives","IC-Unterlagen","Portfolio-Support"], anforderungen:["Top-Europäische Uni","BB-Praktikum","LBO-Modeling","Englisch C2"], required:{uni:23,gpa:22,praktika:21,lang:12,skills:10}, medianGpa:1.2, medianPrak:"BB + PE", medianLang:"C2"},
{id:"bc_lon",  firm:"BC Partners",       short:"BCP",role:"Analyst – European Private Equity",            type:"PE",  tier:"LG",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-08-31", start:"Sep 2026",   duration:"6 Monate",                   apps:680, avgScore:82, spots:3,  acceptRate:0.4,  url:"https://www.bcpartners.com/careers",                department:"Private Equity – Europe",                abteilung:"Large Cap Buyout · Services · Tech",  firmDesc:"BC Partners ist ein europäischer Large-Cap-PE mit $40 Mrd. AUM. Das Londoner Team ist führend in europäischen Large-Cap-Buyouts.", aufgaben:["LBO-Modelle & Renditeanalysen","Deal-Sourcing & IC-Memos","Due-Diligence-Koordination"], anforderungen:["Top-Uni europaweit","BB-Praktikum","Englisch C2"], required:{uni:22,gpa:21,praktika:19,lang:12,skills:9}, medianGpa:1.3, medianPrak:"BB / EB", medianLang:"C2"},
{id:"bx_lon",  firm:"Blackstone London", short:"BX•LDN",role:"Summer Analyst – European Private Equity", type:"PE",  tier:"MF",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-10-01", start:"Jun 2027",   duration:"10 Wochen",                  apps:2100,avgScore:91, spots:6,  acceptRate:0.3,  url:"https://www.blackstone.com/careers",                department:"PE – EMEA Buyout",                        abteilung:"Large Cap Buyout · Real Estate · Credit",firmDesc:"Blackstone London ist das EMEA-Hauptquartier für PE, Real Estate und Credit-Strategien. Intensivste Ausbildungsumgebung im Private-Equity-Sektor weltweit.", aufgaben:["Full deal lifecycle exposure","LBO-Modellierung & Returns","IC-Presentation Prep"], anforderungen:["Absolutes Top-Profil","Multiple BB/PE Praktika","LBO-Modeling meisterhaft","Englisch C2"], required:{uni:25,gpa:23,praktika:23,lang:12,skills:11}, medianGpa:1.1, medianPrak:"BB + Top-PE", medianLang:"C2"},

/* ══ MBB – DACH ══ */
{id:"mck_ffm", firm:"McKinsey & Company",short:"MK", role:"Junior Associate / Werkstudent Strategy",      type:"MBB", tier:"MBB", loc:"Frankfurt",  region:"DACH", year:2026, deadline:"2026-07-31", start:"Laufend",    duration:"3–6 Monate",                 apps:2100,avgScore:78, spots:8,  acceptRate:0.4,  url:"https://www.mckinsey.com/careers",                  department:"Strategy & Corporate Finance",            abteilung:"Corporate Finance · M&A · Strategie",firmDesc:"McKinsey & Company – bekannteste Strategieberatung weltweit. Frankfurter Büro bedient DAX-Konzerne, Mittelstand und PE-Kunden.", aufgaben:["Workstream-Verantwortung in Projektteams","Datenanalysen & Marktmodellierungen","Strategieentwicklung & Klienten-Präsentation"], anforderungen:["Sehr gutes Studium (1,x)","Case-Interviews bestanden","1+ Beratungs-/Finance-Praktikum"], required:{uni:20,gpa:18,praktika:14,lang:10,skills:6}, medianGpa:1.4, medianPrak:"Beratung / Finance", medianLang:"C1"},
{id:"bcg_muc", firm:"BCG",               short:"BCG",role:"Associate Intern / Werkstudent",               type:"MBB", tier:"MBB", loc:"München",    region:"DACH", year:2026, deadline:"2026-07-15", start:"Laufend",    duration:"3–6 Monate",                 apps:1950,avgScore:77, spots:10, acceptRate:0.5,  url:"https://www.bcg.com/careers",                       department:"Strategy & Finance",                     abteilung:"Corporate Finance · M&A DD · Operations",firmDesc:"BCG München – eines der zwei führenden BCG-Büros in Deutschland. Starke Praxis in Corporate Finance, Automotive und Industrials.", aufgaben:["Eigenständige Analysen & Modellierungen","Strategiepapiere & Präsentationen","Klienten-Interviews"], anforderungen:["Sehr gutes Studium","Case-Vorbereitung zwingend","1+ Praktikum"], required:{uni:20,gpa:18,praktika:13,lang:10,skills:6}, medianGpa:1.4, medianPrak:"Beratung / Industrie", medianLang:"C1"},
{id:"bain_muc",firm:"Bain & Company",    short:"BA", role:"Associate Consultant Praktikum",               type:"MBB", tier:"MBB", loc:"München",    region:"DACH", year:2026, deadline:"2026-07-15", start:"Laufend",    duration:"3–6 Monate",                 apps:1800,avgScore:76, spots:10, acceptRate:0.6,  url:"https://www.bain.com/careers",                      department:"Strategy & Corporate Finance",            abteilung:"PE DD · Retail · Industrials",        firmDesc:"Bain München – größtes deutschsprachiges MBB-Büro. Starke PE-DD-Praxis und hohe Bindungsrate für Praktikanten.", aufgaben:["Strategieprojekte für DAX und PE","Markt- & Wettbewerbsanalysen","Präsentationserstellung"], anforderungen:["Sehr gute Leistungen","Case-Interview bestanden","Englisch + Deutsch fließend"], required:{uni:20,gpa:18,praktika:12,lang:10,skills:5}, medianGpa:1.4, medianPrak:"Beratung / Industrie", medianLang:"C1"},
{id:"rb_muc",  firm:"Roland Berger",     short:"RB", role:"Junior Consultant / Praktikant",               type:"MBB", tier:"MBB", loc:"München",    region:"DACH", year:2026, deadline:"2026-08-31", start:"Laufend",    duration:"3–6 Monate",                 apps:1100,avgScore:70, spots:15, acceptRate:1.4,  url:"https://www.rolandberger.com/de/karriere",          department:"Corporate Finance & Strategy",            abteilung:"CF · M&A · Restructuring · Operations",firmDesc:"Roland Berger – einzige europäische Strategieberatung in der Weltspitze. HQ München. Stark in Automotive, Industrials und Restrukturierung.", aufgaben:["Strategieprojekte & Marktanalysen","Restrukturierungsszenarien","Klientenpräsentationen"], anforderungen:["Gutes Studium","Analytische Stärke","Deutsch + Englisch"], required:{uni:18,gpa:16,praktika:11,lang:10,skills:5}, medianGpa:1.6, medianPrak:"Industrie / Big 4", medianLang:"C1"},
{id:"ow_ffm",  firm:"Oliver Wyman",      short:"OW", role:"Analyst Intern – Financial Services",          type:"MBB", tier:"MBB", loc:"Frankfurt",  region:"DACH", year:2026, deadline:"2026-07-31", start:"Okt 2026",   duration:"3–4 Monate",                 apps:820, avgScore:73, spots:6,  acceptRate:0.7,  url:"https://www.oliverwyman.com/careers",                department:"Financial Services Practice",             abteilung:"Banking · Versicherungen · Risk",     firmDesc:"Oliver Wyman Frankfurt – führende Beratung für Financial Services. Berät Banken, Versicherer und Asset Manager.", aufgaben:["Projekte für Banken & Versicherer","Risiko- & Regulierungsanalysen","Quantitative Modellierungen"], anforderungen:["Quantitatives Studium bevorzugt","Englisch C1/C2"], required:{uni:19,gpa:17,praktika:12,lang:11,skills:7}, medianGpa:1.5, medianPrak:"Consulting / Industrie", medianLang:"C1"},

/* ══ MBB – London ══ */
{id:"mck_lon", firm:"McKinsey London",   short:"MK•LDN",role:"Business Analyst – Summer Associate",       type:"MBB", tier:"MBB", loc:"London",     region:"LDN",  year:2026, deadline:"2026-10-31", start:"Jun 2027",   duration:"10 Wochen",                  apps:4800,avgScore:82, spots:30, acceptRate:0.6,  url:"https://www.mckinsey.com/careers",                  department:"Strategy Practice – EMEA",               abteilung:"Corporate Finance · Strategy · Ops",  firmDesc:"McKinsey London ist das größte europäische McKinsey-Büro. Fokus auf EMEA-Strategie, Private Equity und Transformation.", aufgaben:["EMEA-Strategieprojekte","Datenanalysen & Klienten-Präsentation","Case-Work"], anforderungen:["Absolutes Top-Profil europaweit","Cases perfektioniert","Englisch C2"], required:{uni:22,gpa:20,praktika:15,lang:12,skills:7}, medianGpa:1.3, medianPrak:"Beratung + Finance", medianLang:"C2"},

/* ══ PC – DACH ══ */
{id:"pem_ffm", firm:"Pemberton Asset Management",short:"PEM",role:"Analyst – Direct Lending DACH",       type:"PC",  tier:"MM",  loc:"Frankfurt",  region:"DACH", year:2026, deadline:"2026-06-15", start:"Sep 2026",   duration:"6 Monate",                   apps:210, avgScore:68, spots:2,  acceptRate:1.0,  url:"https://www.pembertonam.com/careers",               department:"European Direct Lending",                 abteilung:"Senior Secured · Unitranche · Sponsor Finance",firmDesc:"Pemberton (€20+ Mrd. AUM) – einer der führenden europäischen Direct-Lender. Frankfurter Team gehört zu den aktivsten Unitranche-Anbietern im DACH-Raum.", aufgaben:["Kreditanalyse & Underwriting","Credit Approval Memoranda","Covenant-Testing","Portfolioüberwachung"], anforderungen:["BWL/VWL/Finance","IB oder TAS-Erfahrung vorteilhaft","Englisch C1"], required:{uni:18,gpa:16,praktika:14,lang:10,skills:7}, medianGpa:1.5, medianPrak:"Big 4 TAS / IB Boutique", medianLang:"C1"},
{id:"tik_ffm", firm:"Tikehau Capital",   short:"TIK",role:"Analyst – Private Debt Deutschland",          type:"PC",  tier:"MM",  loc:"Frankfurt",  region:"DACH", year:2026, deadline:"2026-07-01", start:"Okt 2026",   duration:"6 Monate",                   apps:260, avgScore:70, spots:2,  acceptRate:0.8,  url:"https://www.tikehaucapital.com/en/careers",          department:"Private Debt – DACH / Nordeuropa",        abteilung:"Direct Lending · Sub Debt · Special Situations",firmDesc:"Tikehau Capital (€45 Mrd. AUM) – französische Alternative-Asset-Gesellschaft mit starkem Wachstum im europäischen Private-Debt-Segment.", aufgaben:["Transaktionsanalyse & Strukturierung","Credit Committee Papers","Kreditszenarien & Sensitivitätsanalysen"], anforderungen:["Sehr gutes Finance-Studium","Englisch + Deutsch professionell","Analytische Präzision"], required:{uni:19,gpa:16,praktika:14,lang:10,skills:7}, medianGpa:1.5, medianPrak:"IB / Big 4 TAS", medianLang:"C1"},
{id:"ard_pc",  firm:"Ardian – Private Credit",short:"APC",role:"Praktikum – Private Credit Frankfurt",    type:"PC",  tier:"MM",  loc:"Frankfurt",  region:"DACH", year:2026, deadline:"2026-06-30", start:"Sep 2026",   duration:"3–6 Monate",                 apps:230, avgScore:69, spots:2,  acceptRate:0.9,  url:"https://www.ardian.com/join-us",                    department:"Private Debt – DACH",                    abteilung:"Senior Debt · Unitranche · Mezzanine",firmDesc:"Ardian Private Credit ($8 Mrd. AUM) – einer der europaweit führenden Anbieter von Private Credit Solutions. Frankfurter Team investiert in mittelständische DACH-Transaktionen.", aufgaben:["Kreditwürdigkeitsanalyse","Financial Models & Covenant Testing","Credit Papers für IC","Portfoliomonitoring"], anforderungen:["BWL/VWL/Finance, gute Noten","CF/IB/Credit-Erfahrung","Englisch + Deutsch"], required:{uni:19,gpa:16,praktika:14,lang:10,skills:7}, medianGpa:1.5, medianPrak:"IB / TAS / PC", medianLang:"C1"},
{id:"ares_ffm",firm:"Ares Management",   short:"ARE",role:"Analyst – European Direct Lending",           type:"PC",  tier:"MM",  loc:"Frankfurt",  region:"DACH", year:2026, deadline:"2026-06-01", start:"Sep 2026",   duration:"6 Monate",                   apps:290, avgScore:71, spots:2,  acceptRate:0.7,  url:"https://www.aresmgmt.com/careers",                  department:"European Credit – Direct Lending",        abteilung:"Senior Secured · Unitranche · Sponsor Finance",firmDesc:"Ares Management ($420+ Mrd. AUM) – einer der größten alternativen Kreditgeber weltweit. Frankfurter Direct-Lending-Team sehr aktiv im DACH-Unitranche-Markt.", aufgaben:["Underwriting neuer DL-Transaktionen","Cash-Flow-Modelling","Portfolio-Monitoring"], anforderungen:["Gute Noten Finance/BWL","LevFin-Kenntnisse","Englisch C1"], required:{uni:20,gpa:16,praktika:16,lang:10,skills:8}, medianGpa:1.5, medianPrak:"Big 4 + IB/PC", medianLang:"C1"},
{id:"eura_ffm",firm:"Eurazeo",           short:"EZ", role:"Analyst – Private Debt Europa",               type:"PC",  tier:"MM",  loc:"Frankfurt",  region:"DACH", year:2026, deadline:"2026-05-31", start:"Sep 2026",   duration:"6 Monate",                   apps:190, avgScore:67, spots:1,  acceptRate:0.5,  url:"https://www.eurazeo.com/en/join-us",                 department:"Private Debt – Europa",                  abteilung:"Direct Lending · Growth Lending · Unitranche",firmDesc:"Eurazeo (€35 Mrd. AUM) – eine der führenden europäischen Private-Asset-Gesellschaften. Private-Debt-Plattform fokussiert auf Mid-Market in DACH, Frankreich und Benelux.", aufgaben:["Origination-Support","Due-Diligence-Unterstützung","Financial Models & IC-Memoranda"], anforderungen:["Gutes bis sehr gutes Finance-Studium","Englisch + Deutsch fließend"], required:{uni:18,gpa:15,praktika:13,lang:10,skills:6}, medianGpa:1.6, medianPrak:"IB Boutique / Big 4", medianLang:"C1"},

/* ══ PC – Zürich ══ */
{id:"lgt_zh",  firm:"LGT Capital Partners",short:"LGT",role:"Analyst Intern – Private Debt",              type:"PC",  tier:"MM",  loc:"Zürich",     region:"CH",   year:2026, deadline:"2026-08-01", start:"Nov 2026",   duration:"6 Monate",                   apps:195, avgScore:67, spots:2,  acceptRate:1.3,  url:"https://www.lgtcp.com/en/careers",                  department:"Private Debt",                           abteilung:"Direct Lending · Senior / Junior · DACH",firmDesc:"LGT Capital Partners – Schweizer Family-Office-naher Alternativ-Asset-Manager mit starker Private-Debt-Plattform. HQ in Pfäffikon/Zürich. DACH Direct Lending Fokus.", aufgaben:["Kreditanalyse & Underwriting","Modellierung & Szenarioanalysen","Portfolio-Tracking"], anforderungen:["Finance-Studium Schweiz/Europa","Kredit-Vorerfahrung hilfreich","Englisch + Deutsch"], required:{uni:18,gpa:15,praktika:12,lang:10,skills:6}, medianGpa:1.6, medianPrak:"Big 4 / Boutique IB", medianLang:"C1"},
{id:"pg_pc_zh",firm:"Partners Group Credit",short:"PGC",role:"Analyst Intern – Private Debt Zürich",      type:"PC",  tier:"MM",  loc:"Zürich",     region:"CH",   year:2026, deadline:"2026-07-15", start:"Okt 2026",   duration:"6 Monate",                   apps:250, avgScore:73, spots:3,  acceptRate:1.2,  url:"https://www.partnersgroup.com/en/careers",          department:"Private Debt – DACH",                    abteilung:"Direct Lending · Mezzanine · Structured",firmDesc:"Partners Group Credit (CHF 150 Mrd. gesamt) – Zürich-HQ. Private-Debt-Strategien für institutionelle Kunden weltweit.", aufgaben:["Credit Underwriting & Kreditanalysen","Financial Modelling","IC-Unterlagen"], anforderungen:["Gutes Finance-Studium (HSG/ETH/Uni ZH)","Englisch C1","Eigenverantwortung"], required:{uni:19,gpa:17,praktika:14,lang:10,skills:7}, medianGpa:1.5, medianPrak:"IB / Big 4 / PC", medianLang:"C1"},

/* ══ PC – London ══ */
{id:"icg_lon", firm:"ICG – Intermediate Capital Group",short:"ICG",role:"Analyst – European Private Credit",type:"PC",tier:"MM", loc:"London",     region:"LDN",  year:2026, deadline:"2026-09-01", start:"Okt 2026",   duration:"6 Monate",                   apps:380, avgScore:74, spots:3,  acceptRate:0.8,  url:"https://www.icgam.com/careers",                     department:"European Private Credit",                abteilung:"Direct Lending · Sub Debt · Structured",  firmDesc:"ICG ($100+ Mrd. AUM) ist eine der führenden europäischen Private-Credit-Gesellschaften. Das Londoner Team verwaltet Senior, Subordinated und Structured Credit.", aufgaben:["Kreditanalyse & Underwriting","IC-Memoranda","Financial Modelling","Portfolio-Monitoring"], anforderungen:["Top-Finance-Studium","IB oder PC-Erfahrung","Englisch C2"], required:{uni:20,gpa:17,praktika:16,lang:12,skills:8}, medianGpa:1.4, medianPrak:"BB / IB / PC", medianLang:"C2"},
{id:"bri_lon", firm:"Bridgepoint Credit", short:"BRI",role:"Analyst Intern – Private Credit Europe",      type:"PC",  tier:"MM",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-08-15", start:"Sep 2026",   duration:"6 Monate",                   apps:290, avgScore:72, spots:2,  acceptRate:0.7,  url:"https://www.bridgepoint.eu/careers",                department:"Credit – Europe",                        abteilung:"Direct Lending · Senior Secured · Sub",   firmDesc:"Bridgepoint Credit – Direct-Lending-Arm einer führenden europäischen PE-Gesellschaft. Londoner Team mit starker DACH- und UK-Deal-Pipeline.", aufgaben:["Underwriting & Credit Analysis","Financial Models","IC-Memos"], anforderungen:["Finance-Studium","IB/TAS-Vorerfahrung","Englisch C2"], required:{uni:20,gpa:17,praktika:15,lang:12,skills:7}, medianGpa:1.5, medianPrak:"IB / Big 4", medianLang:"C2"},
];

/* ── helpers ── */
const UNI_MAP=[{label:"WHU / HBS / LBS / INSEAD",v:25},{label:"LMU / TU München / Goethe FFM",v:22},{label:"Mannheim / St. Gallen / HSG / Zürich",v:20},{label:"Andere Target Uni",v:16},{label:"Non-Target",v:10}];
const GPA_MAP=[{label:"1,0–1,3  (sehr gut)",v:25},{label:"1,4–1,7  (gut+)",v:21},{label:"1,8–2,0  (gut)",v:17},{label:"2,1–2,4  (befriedigend+)",v:12},{label:"2,5+",v:6}];
const PRAK_MAP=[{label:"BB / Top-EB",v:14},{label:"MBB",v:13},{label:"Top-PE / MF",v:14},{label:"Mid-Market PE / PC",v:10},{label:"Big 4 TAS / CF",v:9},{label:"Boutique IB",v:8},{label:"Konzern / Industrie",v:5},{label:"Kein Praktikum",v:0}];
const LANG_MAP=[{label:"Englisch C2",v:12},{label:"Englisch C1",v:10},{label:"Englisch B2",v:6}];
const LANG2_MAP=[{label:"+ Weitere Sprache B2+",v:5},{label:"Keine",v:0}];
const SKILL_MAP=[{id:"model",label:"Financial Modeling LBO/DCF",v:5},{id:"bloomberg",label:"Bloomberg Terminal",v:3},{id:"python",label:"Python / VBA Finanzanalyse",v:3},{id:"cfa",label:"CFA Level I",v:4},{id:"club",label:"Investment Club Vorstand",v:4},{id:"thesis",label:"Thesis bei IB/PE/Beratung",v:3}];
const TIER_LABEL={BB:"Bulge Bracket",EB:"Elite Boutique",MBB:"Top-Beratung",MF:"Mega Fund",LG:"Large PE",MM:"Mid-Market"};

function calcScore(p){
  const uni=Math.min((p.uni||0)+(p.deg||0),25),gpa=Math.min(p.gpa||0,25),prak=Math.min(p.prak||0,25);
  const lang=Math.min((p.lang||0)+(p.lang2||0),15);
  const skills=Math.min((p.skills||[]).reduce((s,id)=>s+(SKILL_MAP.find(x=>x.id===id)?.v||0),0),20);
  return{uni,gpa,prak,lang,skills,total:Math.min(uni+gpa+prak+lang+skills,100)};
}
function matchPct(req,sc){
  let got=0,mx=0;
  [["uni","uni"],["gpa","gpa"],["prak","praktika"],["lang","lang"],["skills","skills"]].forEach(([sk,rk])=>{mx+=req[rk];got+=Math.min(sc[sk],req[rk]);});
  return Math.round(got/mx*100);
}
function rankChance(job,mp){
  const base=mp/100,comp=Math.min(job.apps/((job.spots||1)*100),5);
  return Math.min(Math.max(Math.round(base*base/(comp*0.4+0.3)*100),1),95);
}
function percentile(s,a){const d=s-a;if(d>=15)return 95;if(d>=10)return 88;if(d>=5)return 78;if(d>=0)return 65;if(d>=-5)return 45;if(d>=-10)return 28;return 12;}
const daysLeft=d=>{if(!d)return 999;return Math.max(0,Math.round((new Date(d)-new Date())/86400000));};

/* ── Live fetch ── */
async function fetchLiveJobs(){
  try{
    const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,tools:[{"type":"web_search_20250305","name":"web_search"}],messages:[{role:"user",content:`Search for current open internship and analyst positions (Praktikum/Intern/Summer Analyst) at major investment banks, private equity firms, private credit/direct lending funds, and top consulting firms in Germany (Frankfurt/Munich), Switzerland (Zurich), and London in 2026 and 2027. Return ONLY a valid JSON array (no markdown, no text outside the array) with up to 12 entries: [{"firm":"name","role":"exact title","type":"IB or PE or PC or MBB","loc":"city","region":"DACH or CH or LDN","year":2026,"deadline":"YYYY-MM-DD or null","url":"careers url","note":"1 sentence what's open now"}]. Only include roles with clear current evidence.`}]})});
    const data=await res.json();
    const text=data.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"";
    const s=text.indexOf("["),e=text.lastIndexOf("]");
    if(s===-1||e===-1)return[];
    const parsed=JSON.parse(text.slice(s,e+1));
    return Array.isArray(parsed)?parsed:[];
  }catch{return[];}
}

/* ── Mini components ── */
const MBar=({pct,c=C.orange})=><div style={{height:3,background:C.faint,borderRadius:1,overflow:"hidden",flex:1}}><div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:c,transition:"width 0.6s"}}/></div>;
const Pill=({c,bg,children})=><span style={{fontFamily:mono,fontSize:10,padding:"2px 6px",borderRadius:2,background:bg||C.orangeDim,color:c||C.orange,letterSpacing:"0.05em"}}>{children}</span>;

/* ── Cockpit KPI card ── */
function KpiCard({label,value,delta,color=C.text,sub,onClick,active}){
  return(
    <div onClick={onClick} style={{background:active?C.orangeDim:C.panel,border:`0.5px solid ${active?C.orange:C.border}`,padding:"10px 12px",cursor:onClick?"pointer":"default",transition:"all 0.15s",flex:1,minWidth:0}}>
      <div style={{fontFamily:mono,fontSize:9,color:C.muted,letterSpacing:"0.1em",marginBottom:5}}>{label}</div>
      <div style={{fontFamily:mono,fontSize:22,color:color,fontWeight:700,lineHeight:1,marginBottom:3}}>{value}</div>
      {delta!=null&&<div style={{fontFamily:mono,fontSize:9,color:delta>0?C.green:delta<0?C.red:C.dim}}>{delta>0?"▲":delta<0?"▼":"–"} {Math.abs(delta)} NEU</div>}
      {sub&&<div style={{fontFamily:mono,fontSize:10,color:C.dim,marginTop:2}}>{sub}</div>}
    </div>
  );
}

/* ── Competitor panel ── */
function CompPanel({job,sc,done}){
  if(!done)return(
    <div style={{background:C.panel,border:`0.5px solid ${C.border}`,padding:14,height:"100%"}}>
      <div style={{fontFamily:mono,fontSize:9,color:C.orange,letterSpacing:"0.12em",marginBottom:14}}>COMPETITOR ANALYSIS</div>
      <div style={{background:"#0a0a0c",border:`0.5px solid ${C.faint}`,padding:20,textAlign:"center"}}>
        <div style={{fontFamily:mono,fontSize:10,color:C.dim,marginBottom:8}}>PROFILE REQUIRED</div>
        <div style={{fontFamily:sans,fontSize:9,color:C.muted}}>Erstelle dein Profil für personalisierte Competitor-Analyse und Match-Scores.</div>
      </div>
    </div>
  );
  const mp=matchPct(job.required,sc),pct=percentile(mp,job.avgScore),ch=rankChance(job,mp);
  const W={uni:job.required.uni>=23?"WHU, HBS, LBS":job.required.uni>=20?"WHU, LMU, HSG":"LMU, HSG, Goethe",gpa:`Ø ${job.medianGpa}`,prak:job.medianPrak,lang:`Englisch ${job.medianLang}`,skills:job.type==="PE"||job.type==="PC"?"LBO-Modeling, Bloomberg":"Cases, Excel, PPT"};
  const ML={uni:sc.uni>=22?"WHU/LMU/Top-Uni":sc.uni>=18?"Target-Uni":"Non-Target",gpa:sc.gpa>=21?"1,0–1,7 sehr gut":sc.gpa>=17?"1,8–2,0 gut":sc.gpa>=12?"2,1–2,4":"2,5+",prak:sc.prak>=22?"BB+PE/TAS":sc.prak>=14?"BB/MBB/Top-PE":sc.prak>=9?"Big 4/Boutique":sc.prak>=5?"Konzern":"Kein Praktikum",lang:sc.lang>=12?"Englisch C2":sc.lang>=10?"Englisch C1":"Englisch B2",skills:sc.skills>=12?"LBO+CFA+Bloomberg":sc.skills>=7?"Fin. Modeling+Club":sc.skills>=3?"Grundkenntnisse":"Keine"};
  const dims=[{k:"uni",l:"HOCHSCHULE",m:sc.uni,w:job.required.uni,mx:25,wl:W.uni,ml:ML.uni},{k:"gpa",l:"NOTE",m:sc.gpa,w:job.required.gpa,mx:25,wl:W.gpa,ml:ML.gpa},{k:"prak",l:"PRAKTIKA",m:sc.prak,w:job.required.praktika,mx:25,wl:W.prak,ml:ML.prak},{k:"lang",l:"SPRACHEN",m:sc.lang,w:job.required.lang,mx:15,wl:W.lang,ml:ML.lang},{k:"skills",l:"SKILLS",m:sc.skills,w:job.required.skills,mx:20,wl:W.skills,ml:ML.skills}];
  return(
    <div style={{background:C.panel,border:`0.5px solid ${C.border}`,padding:14,overflowY:"auto",maxHeight:580}}>
      <div style={{fontFamily:mono,fontSize:9,color:C.orange,letterSpacing:"0.12em",marginBottom:10,paddingBottom:6,borderBottom:`0.5px solid ${C.faint}`}}>COMPETITOR ANALYSIS</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5,marginBottom:10}}>
        {[{l:"MATCH",v:`${mp}%`,c:mp>=75?C.green:mp>=50?C.amber:C.red},{l:"PERCENTIL",v:`TOP ${100-pct}%`,c:pct>=70?C.green:pct>=45?C.amber:C.red},{l:"CHANCE",v:`${ch}%`,c:ch>=20?C.green:ch>=8?C.amber:C.red}].map(s=>(
          <div key={s.l} style={{background:"#090910",border:`0.5px solid ${C.faint}`,padding:"7px 8px",textAlign:"center"}}>
            <div style={{fontFamily:mono,fontSize:9,color:C.dim,marginBottom:3,letterSpacing:"0.08em"}}>{s.l}</div>
            <div style={{fontFamily:mono,fontSize:9,color:s.c,fontWeight:700}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{background:"#090910",border:`0.5px solid ${C.faint}`,padding:"10px 11px",marginBottom:8}}>
        <div style={{display:"grid",gridTemplateColumns:"68px 1fr 1fr",gap:5,marginBottom:7,paddingBottom:6,borderBottom:`0.5px solid ${C.faint}`}}>
          <div/>
          <div style={{fontFamily:mono,fontSize:9,color:C.amber,letterSpacing:"0.08em",textAlign:"center"}}>TYPISCHER GEWINNER</div>
          <div style={{fontFamily:mono,fontSize:9,color:C.cyan,letterSpacing:"0.08em",textAlign:"center"}}>DEIN PROFIL</div>
        </div>
        {dims.map(d=>{
          const ahead=d.m>=d.w;
          return(
            <div key={d.k} style={{marginBottom:9,paddingBottom:7,borderBottom:`0.5px solid ${C.faint}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontFamily:mono,fontSize:9,color:C.muted,letterSpacing:"0.06em"}}>{d.l}</span>
                <span style={{fontFamily:mono,fontSize:9,padding:"1px 5px",background:ahead?"rgba(0,208,132,0.12)":"rgba(255,59,92,0.1)",color:ahead?C.green:C.red}}>{ahead?"✓ MATCH":`▼ −${d.w-d.m} Pkt.`}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"68px 1fr",gap:4,alignItems:"center",marginBottom:2}}>
                <span style={{fontFamily:mono,fontSize:9,color:C.amber}}>GEWINNER</span>
                <div style={{height:3,background:C.faint,borderRadius:1,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.round(d.w/d.mx*100)}%`,background:C.amber}}/></div>
              </div>
              <div style={{fontFamily:sans,fontSize:9,color:C.muted,paddingLeft:72,marginBottom:4,lineHeight:1.3}}>{d.wl}</div>
              <div style={{display:"grid",gridTemplateColumns:"68px 1fr",gap:4,alignItems:"center",marginBottom:2}}>
                <span style={{fontFamily:mono,fontSize:9,color:ahead?C.green:C.red}}>DU</span>
                <div style={{height:3,background:C.faint,borderRadius:1,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.round(d.m/d.mx*100)}%`,background:ahead?C.green:C.red,transition:"width 0.6s"}}/></div>
              </div>
              <div style={{fontFamily:sans,fontSize:9,color:ahead?C.green:C.red,paddingLeft:72,lineHeight:1.3}}>{d.ml}</div>
            </div>
          );
        })}
      </div>
      <div style={{background:"#090910",border:`0.5px solid ${C.faint}`,padding:"9px 11px",marginBottom:8}}>
        <div style={{fontFamily:mono,fontSize:9,color:C.muted,letterSpacing:"0.1em",marginBottom:6}}>BEWERBUNGS-FUNNEL</div>
        {[{l:"GESAMT",v:job.apps,p:100,c:C.dim},{l:"SCREEN",v:Math.round(job.apps*.25),p:25,c:C.muted},{l:"1. ROUND",v:Math.round(job.apps*.08),p:8,c:C.amber},{l:"FINAL",v:Math.round(job.apps*.02),p:2,c:C.orange},{l:"OFFER",v:job.spots||1,p:Math.max((job.spots||1)/job.apps*100,0.1),c:C.green}].map(r=>(
          <div key={r.l} style={{display:"grid",gridTemplateColumns:"60px 40px 1fr",gap:5,alignItems:"center",marginBottom:4}}>
            <span style={{fontFamily:mono,fontSize:9,color:r.c,letterSpacing:"0.04em"}}>{r.l}</span>
            <span style={{fontFamily:mono,fontSize:10,color:r.c,textAlign:"right"}}>{r.v.toLocaleString("de-DE")}</span>
            <MBar pct={r.p} c={r.c}/>
          </div>
        ))}
      </div>
      {dims.filter(d=>d.m<d.w).length>0?(
        <div style={{background:"rgba(255,59,92,0.07)",border:"0.5px solid rgba(255,59,92,0.22)",padding:"9px 11px"}}>
          <div style={{fontFamily:mono,fontSize:9,color:C.red,letterSpacing:"0.1em",marginBottom:6}}>HANDLUNGSBEDARF</div>
          {dims.filter(d=>d.m<d.w).map(d=>(
            <div key={d.k} style={{display:"flex",gap:5,marginBottom:4}}>
              <span style={{fontFamily:mono,fontSize:10,color:C.red,flexShrink:0}}>▸</span>
              <span style={{fontFamily:sans,fontSize:9,color:C.muted,lineHeight:1.4}}>
                <span style={{color:C.red}}>{d.l}: </span>
                {d.k==="prak"&&`${d.w-d.m} Pkt. — weiteres Praktikum bei ${d.w>=20?"BB/Top-PE":"Big 4 TAS / Boutique IB"} schließt die Lücke.`}
                {d.k==="uni"&&`Uni-Tier unter Benchmark — kompensierbar durch sehr gute Note und Top-Praktika.`}
                {d.k==="gpa"&&`Note ${d.w-d.m} Pkt. unter Benchmark — kaum kompensierbar, andere Dimensionen priorisieren.`}
                {d.k==="lang"&&`Englisch auf ${d.w>=12?"C2":"C1"} verbessern — bei BB/MF und London zwingend.`}
                {d.k==="skills"&&`${d.w-d.m} Pkt. — ${d.w>=9?"LBO-Modeling-Kurs + Bloomberg-Zertifizierung":"Financial Modeling Kurs"} würde die Lücke schließen.`}
              </span>
            </div>
          ))}
        </div>
      ):(
        <div style={{background:"rgba(0,208,132,0.07)",border:"0.5px solid rgba(0,208,132,0.22)",padding:"9px 11px",fontFamily:sans,fontSize:10,color:C.green}}>✓ Alle Benchmark-Kriterien erfüllt — Fokus auf Interview-Prep.</div>
      )}
    </div>
  );
}

/* ── Questionnaire ── */
function QOpt({label,pts,selected,onClick}){
  return<div onClick={onClick} style={{padding:"8px 11px",marginBottom:4,border:`0.5px solid ${selected?C.orange:C.border}`,background:selected?C.orangeDim:"transparent",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
    <span style={{fontFamily:sans,fontSize:10,color:selected?C.text:C.muted}}>{label}</span>
    {pts!=null&&<span style={{fontFamily:mono,fontSize:10,color:selected?C.orange:C.dim}}>{pts>0?"+":""}{pts}</span>}
  </div>;
}

/* ══════════ MAIN ══════════ */
export default function Pipeline(){
  const [profile,setProfile]=useState({uni:null,deg:3,gpa:null,prak:0,prakList:[],lang:null,lang2:0,skills:[]});
  const [profileDone,setPD]=useState(false);
  const [qStep,setQStep]=useState(0);
  const [view,setView]=useState("terminal");
  const [selJob,setSelJob]=useState(SEED[0]);
  const [filterType,setFT]=useState("ALL");
  const [filterRegion,setFR]=useState("ALL");
  const [sortBy,setSort]=useState("deadline");
  const [liveJobs,setLive]=useState([]);
  const [prevCount,setPrev]=useState(0);
  const [loading,setLoading]=useState(false);
  const [lastRefresh,setLR]=useState(null);
  const [time,setTime]=useState(new Date());
  const STEPS=["HOCHSCHULE","ABSCHLUSS & NOTE","PRAKTIKA","SPRACHEN","SKILLS & EXTRAS"];

  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t);},[]);

  const doRefresh=useCallback(async()=>{
    setLoading(true);setPrev(liveJobs.length);
    const fresh=await fetchLiveJobs();setLive(fresh);setLR(new Date());setLoading(false);
  },[liveJobs.length]);

  useEffect(()=>{doRefresh();const t=setInterval(doRefresh,30*60*1000);return()=>clearInterval(t);},[]);

  const sc=calcScore(profile);
  const setP=u=>setProfile(p=>({...p,...u}));

  /* Merge seed + live */
  const liveEnriched=liveJobs.map((lj,i)=>({
    id:`live_${i}`,firm:lj.firm,short:lj.firm.slice(0,4).toUpperCase(),role:lj.role,type:lj.type||"IB",tier:"–",
    loc:lj.loc||"Frankfurt",region:lj.region||"DACH",year:lj.year||2026,deadline:lj.deadline||null,
    start:lj.start||"2026",duration:"k.A.",apps:300,avgScore:70,spots:null,acceptRate:null,url:lj.url||"#",
    department:lj.role,abteilung:"Details via Karriereseite",firmDesc:lj.note||"Aktuelle Stellenanzeige – Details auf der Karriereseite.",
    aufgaben:["Details auf der Karriereseite der Firma"],anforderungen:["Details auf der Karriereseite der Firma"],
    required:{uni:18,gpa:16,praktika:12,lang:10,skills:6},medianGpa:1.6,medianPrak:"Big 4 / IB",medianLang:"C1",isLive:true,
  }));

  const seen=new Set();
  const allJobs=[...SEED,...liveEnriched.filter(lj=>{const k=lj.firm+lj.type;if(seen.has(k))return false;seen.add(k);return true;})];

  const filtered=allJobs
    .filter(j=>(filterType==="ALL"||j.type===filterType)&&(filterRegion==="ALL"||j.region===filterRegion))
    .map(j=>({...j,matchScore:profileDone?matchPct(j.required,sc):null}))
    .sort((a,b)=>{
      if(sortBy==="deadline"){const da=daysLeft(a.deadline),db=daysLeft(b.deadline);return da-db;}
      if(sortBy==="name")return a.firm.localeCompare(b.firm,"de");
      if(sortBy==="match")return(b.matchScore||0)-(a.matchScore||0);
      if(sortBy==="year")return(a.year||2026)-(b.year||2026);
      return 0;
    });

  const job=filtered.find(j=>j.id===selJob?.id)||filtered[0]||SEED[0];

  /* Cockpit stats */
  const n26=allJobs.filter(j=>j.year===2026).length;
  const n27=allJobs.filter(j=>j.year===2027).length;
  const nDACH=allJobs.filter(j=>j.region==="DACH").length;
  const nCH=allJobs.filter(j=>j.region==="CH").length;
  const nLDN=allJobs.filter(j=>j.region==="LDN").length;
  const nIB=allJobs.filter(j=>j.type==="IB").length;
  const nPE=allJobs.filter(j=>j.type==="PE").length;
  const nPC=allJobs.filter(j=>j.type==="PC").length;
  const nMBB=allJobs.filter(j=>j.type==="MBB").length;
  const liveDelta=liveJobs.length-prevCount;

  /* ── Questionnaire ── */
  if(view==="questionnaire")return(
    <div style={{fontFamily:sans,background:"transparent"}}>
      <div style={{background:C.bg,borderBottom:`0.5px solid ${C.border}`,padding:"8px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontFamily:mono,fontSize:10,color:C.orange,letterSpacing:"0.12em"}}>PIPELINE <span style={{color:C.dim}}>// PROFIL-SETUP</span></span>
        <div style={{display:"flex",gap:4}}>{STEPS.map((_,i)=><div key={i} style={{height:3,width:24,background:i<=qStep?C.orange:C.faint,borderRadius:1}}/>)}</div>
      </div>
      <div style={{padding:"18px 14px",background:C.panel,border:`0.5px solid ${C.border}`,marginTop:1}}>
        <div style={{fontFamily:mono,fontSize:10,color:C.dim,marginBottom:12}}>SCHRITT {qStep+1}/{STEPS.length} — {STEPS[qStep]}</div>
        {qStep===0&&UNI_MAP.map(o=><QOpt key={o.v} label={o.label} pts={o.v} selected={profile.uni===o.v} onClick={()=>setP({uni:o.v})}/>)}
        {qStep===1&&<>
          <div style={{fontFamily:mono,fontSize:9,color:C.dim,marginBottom:7}}>ABSCHLUSS</div>
          {[{label:"M.Sc. Finance / BWL / VWL",v:5},{label:"B.Sc. Finance / BWL / VWL",v:3},{label:"MBA (Top-Programm)",v:5},{label:"Anderer",v:1}].map(o=><QOpt key={o.v} label={o.label} pts={o.v} selected={profile.deg===o.v} onClick={()=>setP({deg:o.v})}/>)}
          <div style={{fontFamily:mono,fontSize:9,color:C.dim,margin:"12px 0 7px"}}>NOTENDURCHSCHNITT</div>
          {GPA_MAP.map(o=><QOpt key={o.v} label={o.label} pts={o.v} selected={profile.gpa===o.v} onClick={()=>setP({gpa:o.v})}/>)}
        </>}
        {qStep===2&&<>
          <div style={{fontFamily:sans,fontSize:10,color:C.muted,marginBottom:10}}>Bis zu 3 Praktika auswählen — beste werden gewertet</div>
          {PRAK_MAP.map(o=>{const on=(profile.prakList||[]).includes(o.label);return<QOpt key={o.label} label={o.label} pts={o.v} selected={on} onClick={()=>{const l=profile.prakList||[];const n=on?l.filter(x=>x!==o.label):l.length<3?[...l,o.label]:l;setP({prakList:n,prak:n.reduce((s,lb)=>s+(PRAK_MAP.find(x=>x.label===lb)?.v||0),0)});}}/>;})}
          <div style={{fontFamily:mono,fontSize:10,color:C.dim,marginTop:6}}>{(profile.prakList||[]).length}/3 · {sc.prak} Punkte</div>
        </>}
        {qStep===3&&<>
          <div style={{fontFamily:mono,fontSize:9,color:C.dim,marginBottom:7}}>ENGLISCH</div>
          {LANG_MAP.map(o=><QOpt key={o.v} label={o.label} pts={o.v} selected={profile.lang===o.v} onClick={()=>setP({lang:o.v})}/>)}
          <div style={{fontFamily:mono,fontSize:9,color:C.dim,margin:"12px 0 7px"}}>WEITERE SPRACHE</div>
          {LANG2_MAP.map(o=><QOpt key={o.v} label={o.label} pts={o.v} selected={profile.lang2===o.v} onClick={()=>setP({lang2:o.v})}/>)}
        </>}
        {qStep===4&&SKILL_MAP.map(o=>{const on=(profile.skills||[]).includes(o.id);return<QOpt key={o.id} label={o.label} pts={o.v} selected={on} onClick={()=>setP({skills:on?profile.skills.filter(x=>x!==o.id):[...(profile.skills||[]),o.id]})}/>;})}
        <div style={{display:"flex",gap:8,marginTop:14}}>
          {qStep>0&&<button onClick={()=>setQStep(s=>s-1)} style={{padding:"8px 14px",background:"transparent",border:`0.5px solid ${C.border}`,color:C.muted,fontFamily:mono,fontSize:9,cursor:"pointer"}}>← ZURÜCK</button>}
          {qStep<STEPS.length-1
            ?<button onClick={()=>setQStep(s=>s+1)} style={{flex:1,padding:"8px",background:C.orangeDim,border:`0.5px solid ${C.orange}`,color:C.orange,fontFamily:mono,fontSize:9,cursor:"pointer",letterSpacing:"0.06em"}}>WEITER →</button>
            :<button onClick={()=>{setPD(true);setView("terminal");}} style={{flex:1,padding:"8px",background:C.orangeDim,border:`0.5px solid ${C.orange}`,color:C.orange,fontFamily:mono,fontSize:9,cursor:"pointer",letterSpacing:"0.08em"}}>PROFIL SPEICHERN ▶</button>
          }
        </div>
      </div>
    </div>
  );

  /* ── Terminal / Cockpit ── */
  return(
    <div style={{fontFamily:sans,background:"transparent"}}>

      {/* ① TOP BAR */}
      <div style={{background:C.bg,borderBottom:`0.5px solid ${C.border}`,padding:"5px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontFamily:mono,fontSize:10,color:C.orange,letterSpacing:"0.16em",fontWeight:700}}>PIPELINE</span>
          <div style={{width:1,height:14,background:C.border}}/>
          <span style={{fontFamily:mono,fontSize:9,color:C.dim,letterSpacing:"0.06em"}}>CAREER INTELLIGENCE TERMINAL  ·  IB · PE · PC · MBB  ·  DACH · ZRH · LDN</span>
          {liveJobs.length>0&&<span style={{fontFamily:mono,fontSize:9,padding:"2px 6px",background:"rgba(0,208,132,0.1)",color:C.green,border:"0.5px solid rgba(0,208,132,0.3)",letterSpacing:"0.06em"}}>● {liveJobs.length} LIVE</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {profileDone&&<span style={{fontFamily:mono,fontSize:9,color:C.green,letterSpacing:"0.06em"}}>SCORE: {sc.total}/100</span>}
          <span style={{fontFamily:mono,fontSize:10,color:C.dim}}>{time.toLocaleTimeString("de-DE")}</span>
          {lastRefresh&&<span style={{fontFamily:mono,fontSize:9,color:C.dim}}>↺ {lastRefresh.toLocaleTimeString("de-DE")}</span>}
          <button onClick={doRefresh} disabled={loading} style={{padding:"3px 8px",background:"transparent",border:`0.5px solid ${C.border}`,color:loading?C.dim:C.muted,fontFamily:mono,fontSize:9,cursor:loading?"not-allowed":"pointer",letterSpacing:"0.06em"}}>{loading?"LÄDT...":"REFRESH"}</button>
          <button onClick={()=>setView("questionnaire")} style={{padding:"4px 10px",background:C.orangeDim,border:`0.5px solid ${C.orange}`,color:C.orange,fontFamily:mono,fontSize:10,cursor:"pointer",letterSpacing:"0.08em"}}>{profileDone?"PROFIL BEARB.":"PROFIL ERSTELLEN ▶"}</button>
        </div>
      </div>

      {/* ② COCKPIT DASHBOARD */}
      <div style={{background:"#0a0a0d",borderBottom:`0.5px solid ${C.border}`,padding:"8px 12px"}}>
        {/* Row 1: Total + by type */}
        <div style={{display:"flex",gap:6,marginBottom:6}}>
          <KpiCard label="ALLE STELLEN" value={allJobs.length} delta={liveDelta>0?liveDelta:null} color={C.orange}/>
          <KpiCard label="INV. BANKING" value={nIB} color={C.blue} onClick={()=>{setFT(filterType==="IB"?"ALL":"IB");}} active={filterType==="IB"}/>
          <KpiCard label="PRIVATE EQUITY" value={nPE} color={C.green} onClick={()=>{setFT(filterType==="PE"?"ALL":"PE");}} active={filterType==="PE"}/>
          <KpiCard label="PRIVATE CREDIT" value={nPC} color={C.purple} onClick={()=>{setFT(filterType==="PC"?"ALL":"PC");}} active={filterType==="PC"}/>
          <KpiCard label="CONSULTING" value={nMBB} color={C.amber} onClick={()=>{setFT(filterType==="MBB"?"ALL":"MBB");}} active={filterType==="MBB"}/>
        </div>
        {/* Row 2: by year + by region */}
        <div style={{display:"flex",gap:6}}>
          <KpiCard label="START 2026" value={n26} sub="Bewerbung jetzt offen" color={C.green}/>
          <KpiCard label="START 2027" value={n27} sub="Früh bewerben" color={C.amber}/>
          <div style={{width:1,background:C.border,margin:"0 2px"}}/>
          <KpiCard label="DACH" value={nDACH} sub="FFM · MUC · BER" color={C.text} onClick={()=>setFR(filterRegion==="DACH"?"ALL":"DACH")} active={filterRegion==="DACH"}/>
          <KpiCard label="ZÜRICH" value={nCH} sub="CH · HSG" color={C.text} onClick={()=>setFR(filterRegion==="CH"?"ALL":"CH")} active={filterRegion==="CH"}/>
          <KpiCard label="LONDON" value={nLDN} sub="EMEA Hub" color={C.text} onClick={()=>setFR(filterRegion==="LDN"?"ALL":"LDN")} active={filterRegion==="LDN"}/>
          {profileDone&&<><div style={{width:1,background:C.border,margin:"0 2px"}}/>
          <KpiCard label="MEIN SCORE" value={`${sc.total}/100`} sub={sc.total>=70?"Konkurrenzfähig":sc.total>=50?"Solides Profil":"Aufbaupotenzial"} color={sc.total>=70?C.green:sc.total>=50?C.amber:C.red}/></>}
        </div>
      </div>

      {/* ③ FILTER + SORT BAR */}
      <div style={{background:C.bg,borderBottom:`0.5px solid ${C.border}`,padding:"0 12px",display:"flex",justifyContent:"space-between",alignItems:"stretch",flexWrap:"wrap"}}>
        <div style={{display:"flex"}}>
          {[["ALL","ALLE"],["IB","IB"],["PE","PE"],["PC","CREDIT"],["MBB","BERATUNG"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFT(v)} style={{padding:"6px 11px",background:"transparent",border:"none",borderBottom:`2px solid ${filterType===v?C.orange:"transparent"}`,color:filterType===v?C.orange:C.dim,fontFamily:mono,fontSize:10,cursor:"pointer",letterSpacing:"0.08em"}}>
              {l}
            </button>
          ))}
          <div style={{width:1,background:C.border,margin:"6px 4px"}}/>
          {[["ALL","ALLE REGIONEN"],["DACH","DACH"],["CH","ZÜRICH"],["LDN","LONDON"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFR(v)} style={{padding:"6px 10px",background:"transparent",border:"none",borderBottom:`2px solid ${filterRegion===v?C.cyan:"transparent"}`,color:filterRegion===v?C.cyan:C.dim,fontFamily:mono,fontSize:10,cursor:"pointer",letterSpacing:"0.07em"}}>
              {l}
            </button>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:3,padding:"5px 0"}}>
          <span style={{fontFamily:mono,fontSize:9,color:C.dim,marginRight:5}}>SORT:</span>
          {[["deadline","DEADLINE"],["year","JAHR"],["name","A–Z"],["match","MATCH"]].map(([v,l])=>(
            <button key={v} onClick={()=>setSort(v)} style={{padding:"4px 8px",fontFamily:mono,fontSize:9,letterSpacing:"0.06em",background:sortBy===v?C.orangeDim:"transparent",border:`0.5px solid ${sortBy===v?C.orange:C.faint}`,color:sortBy===v?C.orange:C.dim,cursor:"pointer"}}>
              {l}
            </button>
          ))}
          <span style={{fontFamily:mono,fontSize:10,color:C.dim,marginLeft:8}}>{filtered.length} STELLEN</span>
        </div>
      </div>

      {/* ④ MAIN 3-COL GRID */}
      <div style={{display:"grid",gridTemplateColumns:"240px 1fr 290px",gap:1,background:C.border,minHeight:520}}>

        {/* LEFT – job list */}
        <div style={{background:C.bg,overflowY:"auto",maxHeight:560}}>
          {filtered.map(j=>{
            const sel=j.id===job?.id,dl=daysLeft(j.deadline),urgent=dl<14&&dl<999;
            const regionColor={DACH:C.blue,CH:C.amber,LDN:C.green}[j.region]||C.muted;
            return(
              <div key={j.id} onClick={()=>setSelJob(j)} style={{padding:"8px 10px",borderBottom:`0.5px solid ${C.faint}`,background:sel?C.orangeDim:"transparent",cursor:"pointer",borderLeft:`2px solid ${sel?C.orange:"transparent"}`,transition:"all 0.1s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                  <span style={{fontFamily:sans,fontSize:10,color:sel?C.orange:C.text,fontWeight:sel?500:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,marginRight:4}}>{j.firm}</span>
                  <div style={{display:"flex",gap:3,alignItems:"center",flexShrink:0}}>
                    {j.isLive&&<span style={{fontFamily:mono,fontSize:6,color:C.green,border:"0.5px solid rgba(0,208,132,0.4)",padding:"1px 3px"}}>LIVE</span>}
                    <span style={{fontFamily:mono,fontSize:9,padding:"1px 4px",background:"transparent",border:`0.5px solid ${regionColor}`,color:regionColor}}>{j.region}</span>
                    {j.matchScore!=null&&<span style={{fontFamily:mono,fontSize:9,color:j.matchScore>=75?C.green:j.matchScore>=50?C.amber:C.red}}>{j.matchScore}%</span>}
                  </div>
                </div>
                <div style={{fontFamily:sans,fontSize:11,color:C.muted,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.role}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontFamily:mono,fontSize:9,color:C.dim}}>{j.type}{j.tier&&j.tier!=="–"?` · ${j.tier}`:""}</span>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <span style={{fontFamily:mono,fontSize:9,color:C.dim}}>{j.year||2026}</span>
                    <span style={{fontFamily:mono,fontSize:9,color:urgent?C.red:dl===999?C.dim:C.amber}}>{dl===999?"–":dl===0?"HEUTE":dl+"d"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CENTER – detail */}
        <div style={{background:C.bg,overflowY:"auto",maxHeight:560}}>
          {job&&(
            <div style={{padding:13}}>
              {/* Header */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                    <span style={{fontFamily:mono,fontSize:9,color:C.orange,letterSpacing:"0.06em",fontWeight:700}}>{job.firm.toUpperCase()}</span>
                    <span style={{fontFamily:mono,fontSize:10,padding:"2px 6px",background:{DACH:C.blueDim,CH:C.amberDim,LDN:C.greenDim}[job.region]||C.orangeDim,color:{DACH:C.blue,CH:C.amber,LDN:C.green}[job.region]||C.orange}}>{job.region==="DACH"?"DACH (FFM/MUC)":job.region==="CH"?"ZÜRICH":"LONDON"}</span>
                    {job.isLive&&<span style={{fontFamily:mono,fontSize:9,padding:"2px 5px",background:"rgba(0,208,132,0.1)",color:C.green,border:"0.5px solid rgba(0,208,132,0.3)"}}>LIVE</span>}
                  </div>
                  <div style={{fontFamily:sans,fontSize:9,color:C.text,marginBottom:5}}>{job.role}</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {job.tier&&job.tier!=="–"&&<Pill>{TIER_LABEL[job.tier]||job.tier}</Pill>}
                    <Pill c={C.cyan} bg={C.blueDim}>{job.type}</Pill>
                    <Pill c={C.muted} bg={C.faint}>{job.loc}</Pill>
                    <Pill c={job.year===2026?C.green:C.amber} bg={job.year===2026?C.greenDim:C.amberDim}>Start {job.year}</Pill>
                  </div>
                </div>
                {job.matchScore!=null&&(
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontFamily:mono,fontSize:22,color:job.matchScore>=75?C.green:job.matchScore>=50?C.amber:C.red,fontWeight:700,lineHeight:1}}>{job.matchScore}%</div>
                    <div style={{fontFamily:mono,fontSize:9,color:C.dim}}>MATCH</div>
                  </div>
                )}
              </div>

              {/* Dept + Location */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:7}}>
                <div style={{background:"#090910",border:`0.5px solid ${C.faint}`,padding:"8px 11px"}}>
                  <div style={{fontFamily:mono,fontSize:9,color:C.dim,letterSpacing:"0.1em",marginBottom:3}}>BEREICH / ABTEILUNG</div>
                  <div style={{fontFamily:sans,fontSize:9,color:C.text,fontWeight:500,marginBottom:2}}>{job.department}</div>
                  <div style={{fontFamily:sans,fontSize:10,color:C.muted}}>{job.abteilung}</div>
                </div>
                <div style={{background:"#090910",border:`0.5px solid ${C.faint}`,padding:"8px 11px"}}>
                  <div style={{fontFamily:mono,fontSize:9,color:C.dim,letterSpacing:"0.1em",marginBottom:3}}>ORT · START · DAUER</div>
                  <div style={{fontFamily:sans,fontSize:9,color:C.text,marginBottom:2}}>{job.loc}</div>
                  <div style={{fontFamily:sans,fontSize:10,color:C.muted}}>{job.start} · {job.duration}</div>
                </div>
              </div>

              {/* KPIs */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:7}}>
                {[
                  {l:"SPOTS",v:job.spots||"k.A.",c:C.text},
                  {l:"BEWERBER",v:job.apps?.toLocaleString?.("de-DE")||"–",c:C.text},
                  {l:"ACCEPT RATE",v:job.acceptRate?`${job.acceptRate.toFixed(1)}%`:"k.A.",c:!job.acceptRate?C.muted:job.acceptRate<0.5?C.red:job.acceptRate<1.5?C.amber:C.green},
                  {l:"DEADLINE",v:job.deadline?(daysLeft(job.deadline)===0?"HEUTE":daysLeft(job.deadline)+"d"):"offen",c:!job.deadline?C.dim:daysLeft(job.deadline)<14?C.red:C.amber},
                ].map(k=>(
                  <div key={k.l} style={{background:C.panel,border:`0.5px solid ${C.border}`,padding:"7px 9px"}}>
                    <div style={{fontFamily:mono,fontSize:9,color:C.dim,marginBottom:3,letterSpacing:"0.1em"}}>{k.l}</div>
                    <div style={{fontFamily:mono,fontSize:9,color:k.c,fontWeight:600}}>{k.v}</div>
                  </div>
                ))}
              </div>

              {/* Firm desc */}
              <div style={{background:"#090910",border:`0.5px solid ${C.faint}`,padding:"9px 11px",marginBottom:7}}>
                <div style={{fontFamily:mono,fontSize:9,color:C.muted,letterSpacing:"0.1em",marginBottom:5}}>ÜBER DAS UNTERNEHMEN</div>
                <div style={{fontFamily:sans,fontSize:9,color:C.muted,lineHeight:1.6}}>{job.firmDesc}</div>
              </div>

              {/* Tasks */}
              <div style={{background:"#090910",border:`0.5px solid ${C.faint}`,padding:"9px 11px",marginBottom:7}}>
                <div style={{fontFamily:mono,fontSize:9,color:C.muted,letterSpacing:"0.1em",marginBottom:6}}>AUFGABEN</div>
                {job.aufgaben.map((a,i)=>(
                  <div key={i} style={{display:"flex",gap:6,marginBottom:3,alignItems:"flex-start"}}>
                    <span style={{fontFamily:mono,fontSize:10,color:C.orange,flexShrink:0,marginTop:1}}>▸</span>
                    <span style={{fontFamily:sans,fontSize:9,color:C.muted,lineHeight:1.5}}>{a}</span>
                  </div>
                ))}
              </div>

              {/* Requirements */}
              <div style={{background:"#090910",border:`0.5px solid ${C.faint}`,padding:"9px 11px",marginBottom:7}}>
                <div style={{fontFamily:mono,fontSize:9,color:C.muted,letterSpacing:"0.1em",marginBottom:6}}>ANFORDERUNGEN</div>
                {job.anforderungen.map((a,i)=>(
                  <div key={i} style={{display:"flex",gap:6,marginBottom:3,alignItems:"flex-start"}}>
                    <span style={{fontFamily:mono,fontSize:10,color:C.green,flexShrink:0,marginTop:1}}>✓</span>
                    <span style={{fontFamily:sans,fontSize:9,color:C.muted,lineHeight:1.5}}>{a}</span>
                  </div>
                ))}
              </div>

              {/* Profile vs requirements */}
              {profileDone&&(
                <div style={{background:"#090910",border:`0.5px solid ${C.faint}`,padding:"9px 11px",marginBottom:7}}>
                  <div style={{fontFamily:mono,fontSize:9,color:C.muted,letterSpacing:"0.1em",marginBottom:7}}>DEIN PROFIL VS. ANFORDERUNGEN</div>
                  {[["UNI",sc.uni,job.required.uni,25],["GPA",sc.gpa,job.required.gpa,25],["PRAKTIKA",sc.prak,job.required.praktika,25],["SPRACHEN",sc.lang,job.required.lang,15],["SKILLS",sc.skills,job.required.skills,20]].map(([l,mine,req,mx])=>{
                    const ok=mine>=req;
                    return(
                      <div key={l} style={{display:"grid",gridTemplateColumns:"72px 52px 1fr",gap:6,alignItems:"center",marginBottom:5}}>
                        <span style={{fontFamily:mono,fontSize:9,color:C.dim,letterSpacing:"0.05em"}}>{l}</span>
                        <span style={{fontFamily:mono,fontSize:10,color:ok?C.green:C.red,textAlign:"right"}}>{mine}/{req} {ok?"✓":"✗"}</span>
                        <div style={{height:4,background:C.faint,borderRadius:1,position:"relative"}}>
                          <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${mine/mx*100}%`,background:ok?C.green:C.red,borderRadius:1,transition:"width 0.5s"}}/>
                          <div style={{position:"absolute",top:-1,bottom:-1,width:1.5,background:C.orange,left:`${req/mx*100}%`}}/>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{fontFamily:mono,fontSize:9,color:C.dim,marginTop:3}}><span style={{color:C.orange}}>│</span> = Mindestanforderung</div>
                </div>
              )}

              {/* Apply */}
              <a href={job.url} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"10px",background:C.orangeDim,border:`0.5px solid ${C.orange}`,color:C.orange,fontFamily:mono,fontSize:9,cursor:"pointer",letterSpacing:"0.1em",textDecoration:"none"}}>
                ↗  JETZT BEWERBEN  —  {job.firm}
              </a>
            </div>
          )}
        </div>

        {/* RIGHT – competitor */}
        <div style={{background:C.bg,overflowY:"auto",maxHeight:560}}>
          {job&&<CompPanel job={job} sc={sc} done={profileDone}/>}
        </div>
      </div>

      {/* ⑤ STATUS BAR */}
      <div style={{background:"#080809",borderTop:`0.5px solid ${C.border}`,padding:"4px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:4}}>
        <div style={{display:"flex",gap:12}}>
          {[["IB",nIB,C.blue],["PE",nPE,C.green],["PC",nPC,C.purple],["MBB",nMBB,C.amber]].map(([t,n,c])=>(
            <span key={t} style={{fontFamily:mono,fontSize:9,color:C.dim}}>{t}: <span style={{color:c}}>{n}</span></span>
          ))}
          <span style={{fontFamily:mono,fontSize:9,color:C.dim}}>2026: <span style={{color:C.green}}>{n26}</span></span>
          <span style={{fontFamily:mono,fontSize:9,color:C.dim}}>2027: <span style={{color:C.amber}}>{n27}</span></span>
        </div>
        <div style={{display:"flex",gap:10}}>
          <span style={{fontFamily:mono,fontSize:9,color:C.dim}}>DACH: {nDACH}  ·  ZRH: {nCH}  ·  LDN: {nLDN}</span>
          <span style={{fontFamily:mono,fontSize:9,color:C.dim}}>·  PIPELINE v4.0  ·  Auto-Refresh 30 Min</span>
        </div>
      </div>
    </div>
  );
}
