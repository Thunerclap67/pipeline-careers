import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════
   PIPELINE  —  Career Trading Terminal  v4.0
   IB · PE · PC · MBB  ·  DACH · Zürich · London
   Freemium-ready · Live data · Bloomberg aesthetic
═══════════════════════════════════════════════════════════════════ */

const C = {
  /* FT.com palette – salmon pink background, black typography, teal accents */
  bg:"#FFF1E0",           // FT salmon pink (iconic)
  panel:"#FFFAF3",         // Slightly lighter for cards
  card:"#FFFFFF",          // Pure white for highlight cards
  border:"#E8D9C4",        // Warm border
  borderBright:"#D4BFA3",  // Stronger border for emphasis
  faint:"#F2E4CE",         // Very subtle divider

  /* Text hierarchy – near-black on salmon */
  text:"#262A33",          // Primary text (FT almost-black)
  muted:"#66605C",         // Secondary text
  dim:"#948E88",           // Tertiary/meta text

  /* Action + semantic */
  orange:"#990F3D",        // FT claret (for CTAs + active state – like FT's red-pink)
  orangeDim:"rgba(153,15,61,0.08)",
  orangeGlow:"rgba(153,15,61,0.04)",

  /* Status colors – muted, serious */
  green:"#0D7680",         // FT teal (used sparingly for positive)
  greenDim:"rgba(13,118,128,0.1)",
  red:"#B00020",           // Serious red for warnings
  redDim:"rgba(176,0,32,0.08)",
  amber:"#CC7A00",         // Muted amber for BETA
  amberDim:"rgba(204,122,0,0.1)",

  /* Legacy compat – map to neutrals */
  blue:"#66605C", blueDim:"rgba(102,96,92,0.08)",
  cyan:"#66605C", purple:"#66605C",
};
const mono = "'JetBrains Mono','Courier New',monospace";
const sans = "'Financier Display','IBM Plex Sans','Helvetica Neue',Helvetica,Arial,sans-serif";
const serif = "'Financier Display','Georgia','Times New Roman',serif";

/* ─────────────────────────────────────────────
   SEED DATA — 40+ firms across DACH / CH / LDN
───────────────────────────────────────────── */
const SEED = [
/* ══ IB – DACH ══ */
{id:"gs_ffm",  firm:"Goldman Sachs",    short:"GS", role:"Off-Cycle Intern – Investment Banking Classic",         type:"IB",  tier:"BB",  loc:"Frankfurt",  region:"D", year:2026, deadline:"2026-06-30", start:"Okt 2026",   duration:"10-12 Wochen (Jul–Sep 2026)",                  apps:850, avgScore:83, spots:4,  acceptRate:0.5,  url:"https://higher.gs.com/roles/150608",                       department:"Investment Banking Division (IBD)",       abteilung:"M&A · ECM · DCM",                    firmDesc:"Weltweit führende Investmentbank. Das Frankfurter IBD-Team deckt DACH-M&A und Kapitalmarkttransaktionen in TMT, Industrials und Consumer ab. Verifizierte aktuelle Stelle: Off-Cycle Jul–Sep 2026.", aufgaben:["Pitchbooks & Informationsmemoranden","DCF-, LBO- & Comps-Modelle","Live-Deal-Unterstützung & Due Diligence","Sektor- und Unternehmensrecherchen"], anforderungen:["Penultimate year Bachelor oder final year / recent Graduate","University approval für Gap-Year zwingend nötig","Max. 4 Bewerbungen pro Recruiting-Jahr bei GS (keine Mehrfach-Emails)","Note ≤1,3 im Master / ≤1,5 Bachelor (Top 5-10%)","Target: WHU, FS, Mannheim, St. Gallen, Bocconi, Oxbridge, LSE, LBS","Min. 2 Vorpraktika: typisch Big 4 TAS → BB/EB IB","Englisch C2 zwingend + Deutsch fließend (DACH-Kunden)","LBO/DCF/Comps sicher, Pitchbook vorzeigbar","HireVue + Superday (4-6 Interviews)"], required:{uni:22,gpa:22,praktika:20,lang:12,skills:9}, medianGpa:1.2, medianPrak:"2× BB/EB + Big 4 TAS", medianLang:"C2", salaryMonth:2800, salaryY1:95000, conversion:65, hours:85, currency:"EUR"},
{id:"jpm_ffm", firm:"JPMorgan Chase",   short:"JPM",role:"IB Analyst Program – Off-Cycle Internship 2026",        type:"IB",  tier:"BB",  loc:"Frankfurt",  region:"D", year:2026, deadline:"2025-11-30", start:"Okt 2026",   duration:"6 Monate Off-Cycle",                   apps:720, avgScore:81, spots:6,  acceptRate:0.8,  url:"https://careers.jpmorgan.com/us/en/students/programs?search=210621897",                      department:"Corporate & Investment Bank (CIB)",       abteilung:"M&A · LevFin · ECM",                 firmDesc:"Größte US-Bank weltweit. Das Frankfurter CIB-Team (Taunustor 1, Innenstadt) deckt DACH-M&A, Leveraged Finance und Kapitalmärkte ab. Hoher Durchsatz und steile Lernkurve.", aufgaben:["Finanzmodelle & Transaktionspräsentationen","Deal-Execution von Pitch bis Close","Marktanalysen & Sektor-Coverage"], anforderungen:["Bachelor ab 3. Semester oder Master-Student","Graduating 2027 (für 2026 Internship) – penultimate year","Standort: Taunustor 1, Frankfurt – Innenstadt","Note ≤1,4 (Bachelor) bzw. ≤1,3 (Master)","Target: WHU, FS, Mannheim, LMU, St. Gallen","2+ Praktika: BB, EB, Big 4 TAS oder Top-PE","Englisch C2 (JPM ist Englisch-only)","HireVue-Interview + Numerical/Verbal Reasoning Tests","Spring Week-Teilnehmer werden prioritär behandelt"], required:{uni:21,gpa:20,praktika:18,lang:12,skills:8}, medianGpa:1.3, medianPrak:"BB + Big 4 TAS", medianLang:"C2", salaryMonth:2800, salaryY1:95000, conversion:70, hours:85, currency:"EUR"},
{id:"ms_ffm",  firm:"Morgan Stanley",   short:"MS", role:"2026 Investment Banking Off-Cycle Internship (Frankfurt)", type:"IB",  tier:"BB",  loc:"Frankfurt",  region:"D", year:2026, deadline:"2026-05-31", start:"Jul 2026",   duration:"3-6 Monate Off-Cycle",                  apps:580, avgScore:82, spots:4,  acceptRate:0.7,  url:"https://morganstanley.tal.net/vx/mobile-0/brand-0/candidate/so/pm/1/pl/1/opp/19439-2026-Investment-Banking-Off-Cycle-Internship-Frankfurt/en-GB",                          department:"Investment Banking Division (IBD)",      abteilung:"M&A · ECM · Capital Markets",       firmDesc:"Globaler Finanzdienstleister seit 1935 in über 40 Ländern. Frankfurter IBD deckt DACH-M&A und Capital Markets ab. Off-Cycle Interns arbeiten wie Full-Time Analysts auf Live-Transaktionen.", aufgaben:["Financial Modeling & Valuation","Pitchbooks & Präsentationen","Marktanalysen & Trends","Client Meetings (passive Teilnahme)"], anforderungen:["Penultimate Year Bachelor oder Master","Note ≤1,3 Master / ≤1,5 Bachelor","Target zwingend: WHU, FS, Mannheim, St. Gallen, HSG, LBS, Oxbridge","Min. 2 Vorpraktika: BB/EB oder Big 4 TAS + Top-Praktikum","Results-driven under tight deadlines","MS Online Assessment + HireVue-Interview","Accounting & Valuation sicher (Training on the job)","Englisch C2, Deutsch fließend","Rolling Application – früh bewerben"], required:{uni:22,gpa:21,praktika:19,lang:12,skills:8}, medianGpa:1.3, medianPrak:"BB + EB / Big 4 TAS", medianLang:"C2", salaryMonth:2800, salaryY1:95000, conversion:68, hours:85, currency:"EUR"},
{id:"db_ffm",  firm:"Deutsche Bank",    short:"DB", role:"Internship Programme 2026 – Corporate Bank / IB",type:"IB",  tier:"BB",  loc:"Frankfurt",  region:"D", year:2027, deadline:"2026-01-31", start:"Jan 2027",   duration:"10 Wochen Sommer Internship",  apps:620, avgScore:65, spots:12, acceptRate:1.9,  url:"https://careers.db.com/students-graduates/internship-programme/",                            department:"Corporate Finance & Advisory (CFA)",      abteilung:"Leveraged Finance · M&A · DCM",      firmDesc:"Deutschlands größte Bank. Das Frankfurter Corporate Bank & IB-Team ist einer der aktivsten Akteure in DACH-LevFin und M&A. Strategic Partnership mit Google Cloud.", aufgaben:["Rotation durch M&A, LevFin und DCM","Pitches & Transaktionsunterstützung","Finanzmodelle"], anforderungen:["Penultimate Year Bachelor (graduating 2027) zwingend","Für DE-Internships: min. 3. Bachelor-Semester","Max. 12 Monate Vollzeit-Berufserfahrung","Note ≤1,7 (Bachelor) / ≤1,5 (Master)","Target / Semi-Target: WHU, FS, Mannheim, Goethe, LMU","Deutsch C1 zwingend für Corporate Bank (Mittelstand)","Englisch: Desk-Sprache im IB","Excel (Index/Match, Shortcuts), LBO-Grundlagen","50-60% der Summer Class über Spring Week gefüllt – früh bewerben","Bewerbung September bis Januar (rolling)"], required:{uni:18,gpa:14,praktika:10,lang:10,skills:6}, medianGpa:1.6, medianPrak:"Big 4 TAS / MM IB", medianLang:"C1", salaryMonth:2400, salaryY1:85000, conversion:75, hours:80, currency:"EUR"},
{id:"roth_ffm",firm:"Rothschild & Co",  short:"RO", role:"Germany – Frankfurt – Global Advisory – Summer Internship 2026",                     type:"IB",  tier:"EB",  loc:"Frankfurt",  region:"D", year:2026, deadline:"2026-05-31", start:"Okt 2026",   duration:"10-12 Wochen Summer 2026",                   apps:280, avgScore:78, spots:3,  acceptRate:1.1,  url:"https://rothschildandco.tal.net/candidate/postings/438",        department:"Global Advisory",                         abteilung:"M&A · Restructuring · Debt Advisory",firmDesc:"Renommierteste unabhängige Investmentbank weltweit (200+ Jahre Historie, 3.500 Mitarbeiter in 40+ Ländern). Frankfurter Team deckt DACH-M&A, Restrukturierungen und Debt Advisory ab. Small Intern Class (ca. 15-20) – meaningful staffing auf Live-Deals.", aufgaben:["M&A-Prozess von Pitch bis Close","LBO- und DCF-Modelle","CIMs und Pitchbooks"], anforderungen:["Penultimate Year Bachelor oder Master-Student","Division: Global Advisory (M&A, Restructuring, Debt Advisory)","Note ≤1,5 Bachelor / ≤1,3 Master","Target zwingend: WHU, FS, Mannheim, St. Gallen, LBS, Oxbridge","Min. 2 Praktika: Big 4 TAS + Boutique IB oder BB","Deutsch fließend (Mittelstandskunden) + Englisch C2","LBO/DCF/Comps + Trading Comps sicher","Assessment Centre: First Round Online, dann Assessment Day mit Interviews + Group Exercise","Rothschild ist wählerisch – lehnt auch 1,3er WHUler ohne Praktika ab"], required:{uni:21,gpa:20,praktika:17,lang:12,skills:8}, medianGpa:1.3, medianPrak:"Big 4 TAS + Boutique IB", medianLang:"C2", salaryMonth:2600, salaryY1:88000, conversion:75, hours:80, currency:"EUR"},
{id:"ev_ffm",  firm:"Evercore",         short:"EV", role:"Off-Cycle Intern – Investment Banking Advisory",         type:"IB",  tier:"EB",  loc:"Frankfurt",  region:"D", year:2026, deadline:"2026-04-30", start:"Jul 2026",   duration:"3-6 Monate",                 apps:190, avgScore:80, spots:2,  acceptRate:0.3,  url:"https://www.evercore.com/careers/",                  department:"Investment Banking Advisory",             abteilung:"M&A · Restructuring",                firmDesc:"US-Elite-Boutique mit hochkarätigem Frankfurter Team. Bekannt für komplexe M&A und Restructuring-Mandate. Höchste Selektivität im DACH-EB-Markt.", aufgaben:["Intensive Modellarbeit","Pitchbook-Erstellung","Deal-Prozess-Support"], anforderungen:["Master-Student oder finales Bachelor-Jahr","Zwingend Top-Target: WHU, FS, HSG, LBS, HBS, Oxbridge, LSE","Note ≤1,3 (Top 5% des Jahrgangs)","2+ Vorpraktika: mindestens ein BB oder EB zwingend","Perfekte LBO/DCF-Modellierung (Modelling-Test im Superday)","Englisch C2, Französisch oder weitere Sprache Plus","Investment-Club-Engagement (Campus for Finance, Bocconi Finance Club)","Evercore FFM nimmt nur 2-3 Interns pro Jahr – extrem selektiv","Superday: 4-5 Interviews + Modeling-Case"], required:{uni:24,gpa:22,praktika:20,lang:12,skills:10}, medianGpa:1.2, medianPrak:"BB + EB", medianLang:"C2", salaryMonth:2800, salaryY1:92000, conversion:72, hours:85, currency:"EUR"},
{id:"hl_ffm",  firm:"Houlihan Lokey",   short:"HL", role:"Analyst Intern – Financial Restructuring",     type:"IB",  tier:"EB",  loc:"Frankfurt",  region:"D", year:2026, deadline:"2026-06-30", start:"Okt 2026",   duration:"6 Monate",                   apps:210, avgScore:74, spots:3,  acceptRate:1.1,  url:"https://www.hl.com/careers/",                  department:"Financial Restructuring (FR)",            abteilung:"Restrukturierung · Sondersituationen",firmDesc:"Weltweit führende Restrukturierungsbank mit dem größten FR-Team in Europa. Das Frankfurter Team berät Schuldner, Gläubiger und Investoren in Sondersituationen. Bonus-Structure: top-of-street.", aufgaben:["Restrukturierungsmodelle","Gläubiger- und Schuldner-Beratung","Liquiditäts- & Covenant-Analysen"], anforderungen:["Master-Student oder finale Bachelor-Phase","Note ≤1,5 im Master","Target oder Semi-Target: WHU, FS, Goethe, Mannheim, LMU","1-2 Praktika: Big 4 Restructuring, Boutique IB, TAS","Besonderer Fokus Restrukturierung – Insolvenzrecht/Corp. Finance-Kenntnisse","Englisch C1/C2 + Deutsch fließend","Interesse an Distressed Debt/Special Situations","Bonus oft >100% Base (WiWi-Treff) – lohnt sich","Superday mit Modelling-Case"], required:{uni:20,gpa:19,praktika:15,lang:11,skills:8}, medianGpa:1.4, medianPrak:"Big 4 Restr. + Boutique IB", medianLang:"C1", salaryMonth:2500, salaryY1:85000, conversion:72, hours:80, currency:"EUR"},
{id:"li_ffm",  firm:"Lincoln International",short:"LI",role:"Analyst Intern – Debt Advisory DACH",              type:"IB",  tier:"EB",  loc:"Frankfurt",  region:"D", year:2026, deadline:"2026-08-31", start:"Okt 2026",   duration:"6 Monate (Übernahme möglich)", apps:180, avgScore:62, spots:3, acceptRate:1.7,  url:"https://www.lincolninternational.com/about-us/careers/",      department:"Debt Advisory – DACH",                   abteilung:"Acquisition Finance · Unitranche",   firmDesc:"Führende unabhängige Mid-Market M&A- und Debt-Advisory-Boutique. Frankfurter Team berät PE-Sponsoren bei Fremdkapitalstrukturierung im DACH-Raum (€30m-€850m Tickets). Starke Übernahmequote.", aufgaben:["Kreditanalysen & Finanzmodelle","Lender Presentations & Term Sheet-Vergleiche","Marktrecherche Private-Credit-Markt"], anforderungen:["Master-Student Finance/BWL/VWL","Note ≤1,8 (Master)","Target oder Semi-Target ok: WHU, FS, Mannheim, Goethe, TUM, LMU","1-2 Praktika: Big 4 TAS, Boutique IB, Bank-Kreditanalyse","Deutsch C2 + Englisch C1/C2","Interesse an Debt Advisory / Acquisition Finance / Unitranche","Excel-Modelling (LBO-Grundlagen, Cashflow-Waterfall, Covenant-Check)","Team von 4-5 Leuten im Debt Advisory DACH – eng gestaltet","A1 €75k Base + Bonus, Intern €2.200/Mon"], required:{uni:18,gpa:16,praktika:12,lang:10,skills:6}, medianGpa:1.6, medianPrak:"Big 4 TAS / MM IB", medianLang:"C1", salaryMonth:2200, salaryY1:75000, conversion:75, hours:70, currency:"EUR"},
{id:"bnp_ffm", firm:"BNP Paribas",      short:"BNP",role:"Intern – CIB Investment Banking Frankfurt",             type:"IB",  tier:"BB",  loc:"Frankfurt",  region:"D", year:2026, deadline:"2026-06-30", start:"Okt 2026",   duration:"6 Monate Stage / Praktikum",                   apps:390, avgScore:63, spots:8,  acceptRate:1.6,  url:"https://group.bnpparibas/en/careers/students-and-young-professionals",               department:"Corporate & Institutional Banking",       abteilung:"M&A · DCM · Structured Finance",     firmDesc:"BNP Paribas – Europas größte Bank (€500bn+ AUM im CIB). Frankfurter CIB fokussiert auf DACH-Corporate-Kunden, DCM und strukturierte Finanzierungen. Französische Arbeitskultur, moderate WLB.", aufgaben:["Kreditanalysen & Bewertungen","Pitch-Vorbereitung","Marktrecherchen"], anforderungen:["Bachelor 5.+ Semester oder Master","Note ≤1,9","BWL/Finance-Studium an Target- oder Semi-Target","1 Praktikum: Big 4 Advisory, Bank CF, MM IB","Deutsch C2 + Englisch C1","Französisch ein Plus (BNP Hauptquartier)","Kreditanalyse-Grundlagen (BNP = starke Kreditbank)","Weniger wettbewerbsintensiv als US-BBs","Starker DCM und Structured Finance Fokus"], required:{uni:17,gpa:14,praktika:9,lang:10,skills:5}, medianGpa:1.8, medianPrak:"Big 4 / MM Bank", medianLang:"C1", salaryMonth:2200, salaryY1:80000, conversion:72, hours:75, currency:"EUR"},

/* ══ IB – Zürich ══ */
{id:"ubs_zh",  firm:"UBS Investment Bank",short:"UBS",role:"2026 Off-Cycle Internship – Investment Banking Mid Market / DCM / Large Cap – Zurich",          type:"IB",  tier:"BB",  loc:"Zürich",     region:"CH",   year:2026, deadline:"2026-05-31", start:"Sep 2026",   duration:"3-6 Monate Off-Cycle",                   apps:640, avgScore:76, spots:8,  acceptRate:1.3,  url:"https://jobs.ubs.com/TGnewUI/Search/Home/Home?partnerid=25008&siteid=5176&keyword=Investment+Banking+Zurich",                       department:"Investment Bank – EMEA Coverage",         abteilung:"M&A · ECM · LevFin",                 firmDesc:"UBS ist die größte Schweizer Bank und betreibt nach der CS-Übernahme eines der größten europäischen Investment-Banking-Franchises. Das Zürcher IB ist stark in EMEA-M&A, ECM und Finanzierungen. Aktuell mehrere offene IB-Internships (Mid Market, DCM, Large Cap).", aufgaben:["M&A-Pitchbooks & Transaktionsmodelle","ECM- und DCM-Analysen","Klientenpräsentationen & Due Diligence","Sektor-Research"], anforderungen:["Bachelor 4./5. Semester oder Master (Penultimate Year)","Note ≤5,0 (Schweizer Skala) / ≤1,8 (DE)","HSG, ETH, Uni Zürich, EPFL bevorzugt + WHU, FS, Bocconi","1-2 Praktika: Big 4 TAS, Boutique IB, Bank CF","Deutsch + Englisch verhandlungssicher, Französisch/Italienisch Plus","Schweizer Arbeitsmarkt: EU/EFTA-Staatsangehörigkeit oder Aufenthaltsbewilligung","Online Assessment + HireVue + Superday","Interesse an EMEA-M&A / DACH-Kundschaft (LBO, Carve-out, ECM)","Aktuell mehrere offene Stellen: IB Mid Market, IB DCM, IB Large Cap"], required:{uni:20,gpa:19,praktika:15,lang:11,skills:7}, medianGpa:1.5, medianPrak:"Big 4 TAS / IB Boutique", medianLang:"C1", salaryMonth:4200, salaryY1:125000, conversion:72, hours:80, currency:"CHF"},
{id:"roth_zh", firm:"Rothschild Zürich",  short:"RZH",role:"Switzerland – Zurich – Global Advisory – Summer Internship 2026",         type:"IB",  tier:"EB",  loc:"Zürich",     region:"CH",   year:2026, deadline:"2026-05-31", start:"Okt 2026",   duration:"6 Monate Off-Cycle",                   apps:180, avgScore:75, spots:2,  acceptRate:1.1,  url:"https://rothschildandco.tal.net/candidate/jobboard/vacancy/2/adv",        department:"Global Advisory Zürich",                 abteilung:"M&A · Debt Advisory · Restructuring", firmDesc:"Zürcher Rothschild-Team berät Schweizer und europäische Blue-Chip-Kunden bei komplexen M&A- und Finanzierungstransaktionen. Kleineres Team als Frankfurt, sehr exklusiver Deal-Flow (Nestlé, Roche, etc.).", aufgaben:["Eigenständige Modellarbeit","Pitch- und CIM-Erstellung","Cross-border M&A Support"], anforderungen:["Penultimate Year Bachelor oder Master","Note ≤5,3 (CH) / ≤1,5 (DE)","HSG, ETH, WHU, FS, LBS, Oxbridge bevorzugt","2 Vorpraktika: mindestens eines in IB/Boutique","Deutsch C2 + Englisch C2 zwingend (CH-Kundenbasis)","LBO-Modellierung + Pitchbook-Erfahrung","Französisch/Italienisch sehr gern gesehen","Assessment Centre: First Round Online + Assessment Day Zurich"], required:{uni:21,gpa:20,praktika:15,lang:11,skills:8}, medianGpa:1.3, medianPrak:"BB / EB / Big 4 TAS", medianLang:"C2", salaryMonth:4000, salaryY1:120000, conversion:72, hours:80, currency:"CHF"},
{id:"zkb_zh",  firm:"Zürcher Kantonalbank",short:"ZKB",role:"Praktikant Corporate Finance / M&A – Zurich",  type:"IB",  tier:"EB",  loc:"Zürich",     region:"CH",   year:2026, deadline:"2026-08-31", start:"Nov 2026",   duration:"6 Monate Praktikant",                 apps:130, avgScore:61, spots:4,  acceptRate:3.1,  url:"https://www.zkb.ch/de/karriere.html",                       department:"Corporate Finance",                       abteilung:"M&A · ECM · Advisory",               firmDesc:"ZKB – Zürcher Kantonalbank, drittgrößte Schweizer Bank. Corporate-Finance-Team berät Schweizer Mittelstand und Kanton-Projekte. Weniger Prestige als UBS, aber geregelte Arbeitszeiten und gute WLB.", aufgaben:["M&A-Transaktionsunterstützung","Bewertungsmodelle","Pitch-Materialien"], anforderungen:["Bachelor 4.+ Semester oder Master","Note ≤5,0 (CH) / ≤2,0 (DE)","Uni Zürich, ETH, HSG bevorzugt","1 Vorpraktikum (Bank, Big 4, Industrie)","Deutsch C2 zwingend (Schweizer Mittelstandsbetreuung)","Englisch C1","Aufenthalts-/Arbeitsbewilligung für Schweiz erforderlich","ZKB ist Schweizer Kantonalbank – weniger kompetitiv als UBS","Guter Einstieg für Schweizer Studenten ohne BB-Ambitionen"], required:{uni:17,gpa:15,praktika:9,lang:9,skills:5}, medianGpa:1.7, medianPrak:"Big 4 / Schweizer Bank", medianLang:"C1", salaryMonth:3500, salaryY1:100000, conversion:80, hours:60, currency:"CHF"},

/* ══ IB – London ══ */
{id:"gs_lon",  firm:"Goldman Sachs London",short:"GS•LDN",role:"2026 | EMEA | London | Investment Banking | Summer Analyst Programme",type:"IB", tier:"BB", loc:"London",      region:"LDN",  year:2026, deadline:"2025-10-31", start:"Jun 2027",   duration:"9-10 Wochen Summer Analyst 2026",                  apps:3200,avgScore:87, spots:40, acceptRate:1.3,  url:"https://higher.gs.com/search?region=EMEA&location=London&programtype=Summer%20Analyst",                       department:"Investment Banking Division – EMEA",      abteilung:"M&A · ECM · DCM · Sponsor Coverage",firmDesc:"Goldman Sachs London ist das EMEA-Hauptquartier und das wettbewerbsintensivste IB-Recruiting-Umfeld in Europa. Alle Deals werden aus London gesteuert. Rolling-Basis-Applications – früh bewerben.", aufgaben:["Vollumfängliche Transaktionsunterstützung","LBO-, DCF-, Comps-Modelle","Pitchbooks für globale Mandate","Direkte MD/VP-Exposition"], anforderungen:["Penultimate Year undergraduate oder final year student","First Class Degree / Note ≤1,3","Zwingend Oxford, Cambridge, LSE, Imperial, LBS, UCL, Warwick, WHU, HSG, Bocconi","Spring Week-Teilnahme sehr hilfreich (ca. 50% der Summer Class)","2+ Praktika, mindestens eines BB/EB oder Top-MBB","Englisch native level zwingend","Numerical/Logical-Reasoning-Tests ≥90. Perzentil","Right to Work UK erforderlich (Visum-Sponsoring kompliziert nach Brexit)","Max. 4 Bewerbungen pro Jahr (business/location Kombination)","HireVue + Superday (5-6 Interviews)"], required:{uni:24,gpa:23,praktika:22,lang:12,skills:10}, medianGpa:1.2, medianPrak:"Spring Week + BB/EB", medianLang:"C2", salaryMonth:3800, salaryY1:90000, conversion:65, hours:85, currency:"GBP"},
{id:"ms_lon",  firm:"Morgan Stanley London",short:"MS•LDN",role:"2026 Investment Banking Summer Analyst (London)",type:"IB",  tier:"BB",  loc:"London",     region:"LDN",  year:2026, deadline:"2025-11-30", start:"Jun 2027",   duration:"9-10 Wochen Summer Analyst",                  apps:2800,avgScore:86, spots:35, acceptRate:1.3,  url:"https://morganstanley.tal.net/vx/candidate/jobboard/vacancy/2/adv?vs_aplinks=sTP0TEL0",department:"Investment Banking Division",      abteilung:"M&A · ECM · Debt",                   firmDesc:"Morgan Stanley London ist das EMEA-Hub mit starker ECM-Expertise und Sektoren-Teams (TMT, FIG, Healthcare). Summer Analyst Programm mit hoher Return-Offer-Rate (~70%).", aufgaben:["Bewertungsmodelle & Szenarioanalysen","Pitchbooks & CIMs","Transaktionsunterstützung"], anforderungen:["Penultimate Bachelor oder Master","First Class Honours / ≤1,4","Top-Targets: Oxbridge, LSE, Imperial, Warwick, LBS, WHU, HSG","Online-Tests (MS Online Assessment) + HireVue-Interview","2 Vorpraktika inkl. mindestens ein BB/EB/Spring Week","LBO-Grundkenntnisse + Präsentation","Englisch C2 native, weitere Sprache Plus","Right to Work UK erforderlich","Superday: 5-6 Interviews (technisch + behavioral)"], required:{uni:23,gpa:22,praktika:20,lang:12,skills:9}, medianGpa:1.3, medianPrak:"Spring Week + BB", medianLang:"C2", salaryMonth:3800, salaryY1:90000, conversion:65, hours:85, currency:"GBP"},
{id:"jpm_lon", firm:"JPMorgan London",    short:"JPM•LDN",role:"2026 Investment Banking Summer Analyst Programme (London)",type:"IB",tier:"BB", loc:"London",     region:"LDN",  year:2026, deadline:"2025-10-31", start:"Jun 2027",   duration:"10 Wochen Summer Analyst",                  apps:2600,avgScore:84, spots:45, acceptRate:1.7,  url:"https://careers.jpmorgan.com/us/en/students/programs/summer-analyst",                      department:"Corporate & Investment Bank",             abteilung:"M&A · LevFin · ECM · DCM",           firmDesc:"JPMorgan London – eines der größten IB-Teams weltweit mit Fokus auf Cross-Border-M&A, ECM und LevFin. Very active deal pipeline in Europe.", aufgaben:["Deal-Execution von Pitch bis Close","Finanzmodelle","Marktanalysen","Klienten-Management"], anforderungen:["Penultimate Bachelor oder Master-Student","First Class Degree (≤1,4)","Top-Target: Oxbridge, LSE, Warwick, Imperial, WHU, HSG, Bocconi","2+ Praktika, Spring Week sehr gern gesehen","Numerical/Verbal Reasoning Tests ≥85. Perzentil","Englisch native, weitere Sprache ein Plus","Video-Interview + Superday in London","Right to Work UK erforderlich","Spring Week-Teilnehmer werden auf Summer Analyst fast-tracked"], required:{uni:22,gpa:21,praktika:20,lang:12,skills:9}, medianGpa:1.3, medianPrak:"BB / Big 4 TAS", medianLang:"C2", salaryMonth:3800, salaryY1:90000, conversion:65, hours:85, currency:"GBP"},

/* ══ PE – DACH ══ */
{id:"bx_ffm",  firm:"Blackstone",        short:"BX", role:"2026 Blackstone Private Equity Off-Cycle Internship (Frankfurt)",       type:"PE",  tier:"MF",  loc:"Frankfurt",  region:"D", year:2026, deadline:"2025-10-15", start:"Jun 2026",   duration:"10 Wochen Summer Analyst / 6 Monate Off-Cycle",                  apps:1240,avgScore:89, spots:2,  acceptRate:0.2,  url:"https://blackstone.wd1.myworkdayjobs.com/en-US/Blackstone_Campus_Careers",                department:"Private Equity – Europe Buyout",          abteilung:"Corporate PE · DACH/Europe Large Cap",firmDesc:"Weltgrößter Alternative Asset Manager (>$1 Trillion AUM). Frankfurter PE-Team ist klein und extrem selektiv. Dominant in DACH-Mega-Cap-Deals (>€5bn EV). Acceptance <1% der Bewerber.", aufgaben:["Deal-Sourcing & Screening","LBO-Modelle & Returns-Analyse","Branchenanalysen & Due Diligence","IC-Memoranda"], anforderungen:["Zwingend Top-Target: WHU, HBS, LBS, HSG, Bocconi","Note ≤1,3 (Top 3% des Jahrgangs)","Min. 2 Top-Praktika: 1× BB IB + 1× MF-PE oder MBB","LBO-Modellierung meisterhaft (Full Three-Statement Model im Test)","Englisch C2 zwingend (internationales Staffing)","Investment-Club oder Campus for Finance Erfahrung","Blackstone FFM nimmt 1-2 Interns – höchste Hürde DACH","Recruiting 15-18 Monate im Voraus – Sophomore Spring (DE: 3. Semester)","'Deal Auditions' – direkte IC-Teilnahme ab Woche 1"], required:{uni:24,gpa:22,praktika:22,lang:12,skills:10}, medianGpa:1.2, medianPrak:"BB IB + MBB / MF-PE", medianLang:"C2", salaryMonth:3200, salaryY1:100000, conversion:55, hours:70, currency:"EUR"},
{id:"cg_ffm",  firm:"The Carlyle Group", short:"CG", role:"Analyst – Buyout DACH",                       type:"PE",  tier:"MF",  loc:"Frankfurt",  region:"D", year:2026, deadline:"2026-04-30", start:"Sep 2026",   duration:"6 Monate (Festanstellung)",   apps:980, avgScore:85, spots:2,  acceptRate:0.2,  url:"https://www.carlyle.com/careers",                   department:"Europe Buyout – DACH",                   abteilung:"Mid-to-Large Cap · Industrials",     firmDesc:"Carlyle ($440 Mrd. AUM). Frankfurter Team fokussiert auf DACH-Buyouts €100–€1000 Mio. EV in Industrials, Business Services und Healthcare.", aufgaben:["LBO-Modelle & Renditeanalysen","Deal-Sourcing","IC-Memoranda","Portfoliomonitoring"], anforderungen:["Master oder letztes Bachelor-Semester","Note ≤1,4 Master (Top 5%)","WHU, HBS, LBS, HSG, Mannheim (Top)","2 Vorpraktika: BB IB + PE oder MBB zwingend","LBO-Modelling + IC-Memo-Erfahrung","Englisch C2, Deutsch fließend","Carlyle Frankfurt nimmt 2 Summer Analysts"], required:{uni:22,gpa:20,praktika:20,lang:12,skills:9}, medianGpa:1.3, medianPrak:"BB IB + PE / MBB", medianLang:"C2", salaryMonth:3000, salaryY1:95000, conversion:58, hours:70, currency:"EUR"},
{id:"eqt_muc", firm:"EQT",               short:"EQT",role:"Intern – Private Equity (Equity Team)",        type:"PE",  tier:"MF",  loc:"München",    region:"D", year:2026, deadline:"2026-06-15", start:"Okt 2026",   duration:"6 Monate",                   apps:760, avgScore:82, spots:3,  acceptRate:0.4,  url:"https://eqtgroup.com/careers",                      department:"EQT Private Equity – DACH",              abteilung:"Mid-to-Large Cap Buyout · Tech",      firmDesc:"EQT ($230 Mrd. AUM) – schwedische PE-Gesellschaft mit starker DACH-Präsenz. Führend in Tech-Buyouts und industriellen Wachstumsstrategien.", aufgaben:["Deal-Analyse & LBO-Modellierung","Sektor-Screenings","DD-Prozessunterstützung","Portfoliounternehmen-Monitoring"], anforderungen:["Master-Student Top-Target","Note ≤1,5 im Master","WHU, LMU, TU München, HSG, HBS","2 Praktika: mindestens ein BB IB oder MBB","LBO-Modellierung + Sektor-Research","Englisch C2 (Schwedische Arbeitskultur)","Tech-Affinität ist Plus"], required:{uni:22,gpa:20,praktika:19,lang:12,skills:9}, medianGpa:1.3, medianPrak:"BB IB / MBB", medianLang:"C2", salaryMonth:3000, salaryY1:95000, conversion:60, hours:68, currency:"EUR"},
{id:"ard_ffm", firm:"Ardian – Buyout",   short:"ARD",role:"Investment Team Intern – Frankfurt (Mid-Cap Buyout)",     type:"PE",  tier:"LG",  loc:"Frankfurt",  region:"D", year:2026, deadline:"2026-05-31", start:"Okt 2026",   duration:"6 Monate Intern",                 apps:420, avgScore:76, spots:3,  acceptRate:0.7,  url:"https://www.ardian.com/careers/current-opportunities",                    department:"Buyout / Expansion",                     abteilung:"Mid-Cap Buyout DACH",                firmDesc:"Ardian ist einer der größten Alternative Investment Manager Europas (€165bn AUM) – französisches HQ mit starkem DACH-Team in Frankfurt. Mid-Cap Buyout, Infrastruktur und Private Debt.", aufgaben:["Deal-Sourcing & Unternehmensbewertung","LBO-Modellierung","IC-Memos & Investment Presentations"], anforderungen:["Master-Student oder letztes Bachelor-Semester","Note ≤1,6 Master","Target / Semi-Target: WHU, FS, Mannheim, Goethe, LMU","2 Praktika: IB (BB oder EB) + Big 4 TAS oder PE","LBO-Modelling sicher","Deutsch C2 + Englisch C1/C2","Französisch ein Plus (französisches HQ)","Mid-Cap-DACH-Fokus (€100m-€1bn Tickets)","Ardian Frankfurt sehr deutsch-geprägt"], required:{uni:20,gpa:18,praktika:17,lang:11,skills:8}, medianGpa:1.4, medianPrak:"BB/EB IB + Big 4 TAS", medianLang:"C2", salaryMonth:2600, salaryY1:85000, conversion:70, hours:62, currency:"EUR"},
{id:"afin_muc",firm:"Afinum",            short:"AFN",role:"Praktikant Investment Team – München",              type:"PE",  tier:"MM",  loc:"München",    region:"D", year:2026, deadline:"2026-07-31", start:"Okt 2026",   duration:"3-6 Monate Praktikum",                 apps:180, avgScore:68, spots:2,  acceptRate:1.5,  url:"https://www.afinum.de/karriere/",                    department:"Investment Team",                        abteilung:"DACH Mid-Market Buyout · Mittelstand", firmDesc:"Afinum – einer der führenden deutschen Mid-Market-PE mit Fokus auf profitable DACH-Mittelständler. Bekannt für operative Wertschöpfung und Familienunternehmens-Transaktionen. Kleineres Team, hohe Deal-Exposure ab Tag 1.", aufgaben:["Deal-Sourcing & Erstbewertungen","LBO-Modelle","Due-Diligence-Support"], anforderungen:["Master-Student Finance/BWL (auch Bachelor im 6. Sem.)","Note ≤1,8","Target / Semi-Target München, WHU, Mannheim","1-2 Praktika: Big 4 TAS, MM IB, Corporate Finance","Deutsch Muttersprache zwingend (Mittelstandsdeals)","LBO-Grundlagen + Mittelstands-Verständnis","Familiär geprägte Arbeitskultur, kleines Team","Afinum Deals: DACH Mid-Cap €50m-€500m EV","60 Bewerber pro Slot – gute Chancen mit solider Big 4 TAS"], required:{uni:17,gpa:15,praktika:11,lang:10,skills:6}, medianGpa:1.6, medianPrak:"Big 4 TAS + MM IB", medianLang:"C1", salaryMonth:2400, salaryY1:78000, conversion:78, hours:58, currency:"EUR"},

/* ══ PE – Zürich ══ */
{id:"pg_zh",   firm:"Partners Group",    short:"PG", role:"Analyst Intern – Private Equity / Private Debt (Zug/Zurich)",  type:"PE",  tier:"MF",  loc:"Zürich",     region:"CH",   year:2026, deadline:"2026-05-31", start:"Okt 2026",   duration:"6 Monate Analyst Intern",                   apps:520, avgScore:79, spots:4,  acceptRate:0.8,  url:"https://jobs.partnersgroup.com/en_US/careers/",          department:"Private Equity – Direkt",                abteilung:"DACH / Europa Buyout & Growth",       firmDesc:"Partners Group – größter Schweizer Alternative Asset Manager (€150bn AUM), listed in SIX. HQ in Zug, großes Office in Zurich. Globale Teams für PE, Private Debt, Infrastructure, Real Estate.", aufgaben:["Deal-Analyse & LBO-Modellierung","IC-Unterlagen & Sektoranalysen","Portfoliounternehmen-Monitoring"], anforderungen:["Master-Student Top-Target","Note ≤5,2 (CH) / ≤1,5 (DE)","HSG, ETH, Uni ZH, WHU, LBS, Bocconi, IE Madrid","2 Praktika: IB (BB/EB) + idealerweise PE","Englisch C2 + Deutsch C2","LBO-Modellierung + Sektor-Research","Arbeitsbewilligung Schweiz erforderlich","Partners Group bietet 3 Bereiche: PE, Private Debt, Private Infra","Training in Zug (HQ) mit Kollegen aus globalen Offices"], required:{uni:21,gpa:19,praktika:17,lang:12,skills:8}, medianGpa:1.3, medianPrak:"BB IB + PE / MBB", medianLang:"C2", salaryMonth:4500, salaryY1:130000, conversion:65, hours:65, currency:"CHF"},
{id:"cap_zh",  firm:"Capvis",            short:"CPV",role:"Investment Team Praktikant – Zurich",              type:"PE",  tier:"MM",  loc:"Zürich",     region:"CH",   year:2026, deadline:"2026-06-30", start:"Nov 2026",   duration:"6 Monate Praktikant",                 apps:160, avgScore:71, spots:2,  acceptRate:1.3,  url:"https://www.capvis.com/careers/",                    department:"Investment Team",                        abteilung:"DACH Mid-Market Buyout",             firmDesc:"Capvis – führende Schweizer Mid-Market-PE (>€2.5bn AUM). Fokus auf DACH-Industrie, Healthcare und Services. Kleines Team (~30 Investment Pros), hohe Verantwortung für Praktikanten.", aufgaben:["Deal-Sourcing & Bewertungen","Finanzmodellierung","IC-Vorbereitung"], anforderungen:["Master-Student oder letztes Bachelor-Semester","Note ≤5,0 (CH) / ≤1,7 (DE)","HSG, ETH, Uni ZH, WHU, IE Madrid","1-2 Praktika: Big 4 TAS, MM IB, Consulting","Deutsch C2 + Englisch C1","DACH Mid-Market PE-Fokus (€100m-€500m EV)","LBO-Modellierung","Arbeitsbewilligung Schweiz erforderlich","Capvis Fund VI (€1.5bn) – aktive Deal-Phase"], required:{uni:19,gpa:16,praktika:12,lang:10,skills:6}, medianGpa:1.5, medianPrak:"Big 4 TAS + MM IB", medianLang:"C1", salaryMonth:4000, salaryY1:115000, conversion:75, hours:60, currency:"CHF"},

/* ══ PE – London ══ */
{id:"kkr_lon", firm:"KKR",               short:"KKR",role:"2026 KKR Private Equity Summer Analyst (London)",       type:"PE",  tier:"MF",  loc:"London",     region:"LDN",  year:2026, deadline:"2025-10-31", start:"Jun 2027",   duration:"10 Wochen Summer Analyst",                  apps:1800,avgScore:90, spots:5,  acceptRate:0.3,  url:"https://jobs.kkr.com/",                           department:"Private Equity – Europe",                abteilung:"Buyout · Growth · Infrastructure",   firmDesc:"KKR ist einer der weltgrößten Alternative Asset Manager ($600bn+ AUM). London ist EMEA-Hub für PE, Credit und Infrastructure. Acceptance Rate <1% – höchste Hürde in European PE Recruiting.", aufgaben:["LBO-Modelle & Deal-Sourcing","IC-Memoranda","Branchenanalysen","Portfolio-Wertschöpfung"], anforderungen:["Penultimate Year undergraduate (Sophomore/Junior)","First Class Honours / ≤1,2 (Top 1-3%)","Zwingend Oxbridge/LBS/LSE/Imperial/WHU/HSG/Bocconi","3+ Top-Praktika: 2× BB IB + PE-Experience oder MBB","LBO-Modellierung + Case Studies meisterhaft","Englisch native, weitere Sprache von Vorteil","KKR London nimmt ~5 Summer Analysts – <1% Annahmequote","Recruiting Sophomore Spring (15 Monate im Voraus)","Multiple Investment-Themen: PE, Credit, Infra, Real Assets","Interview: 5-7 Runden inkl. technisches Case + Fit"], required:{uni:25,gpa:23,praktika:23,lang:12,skills:11}, medianGpa:1.1, medianPrak:"BB + Top-PE / MBB", medianLang:"C2", salaryMonth:4500, salaryY1:100000, conversion:55, hours:75, currency:"GBP"},
{id:"apax_lon",firm:"Apax Partners",     short:"APX",role:"Analyst – Private Equity Summer Intern",       type:"PE",  tier:"MF",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-09-30", start:"Jun 2027",   duration:"10 Wochen",                  apps:1200,avgScore:87, spots:4,  acceptRate:0.3,  url:"https://www.apax.com/careers",                      department:"Private Equity",                         abteilung:"Tech · Services · Healthcare · Consumer",firmDesc:"Apax Partners ist ein global führender Large-Cap-PE-Investor mit Fokus auf Tech und Healthcare. Londoner Büro ist das globale Hauptquartier.", aufgaben:["Deal-Analyse & LBO-Modellierung","Sektor-Deepdives","IC-Unterlagen","Portfolio-Support"], anforderungen:["Penultimate Bachelor oder Master","First Class ≥2:1 (≤1,3)","Oxbridge, LSE, LBS, WHU, HSG, Bocconi","2-3 Top-Praktika: BB + PE oder MBB","LBO-Modellierung exzellent","Englisch native, Sektorwissen (Tech/HC/Services) Plus"], required:{uni:23,gpa:22,praktika:21,lang:12,skills:10}, medianGpa:1.2, medianPrak:"BB + PE", medianLang:"C2", salaryMonth:4400, salaryY1:98000, conversion:55, hours:75, currency:"GBP"},
{id:"bc_lon",  firm:"BC Partners",       short:"BCP",role:"Analyst – European Private Equity",            type:"PE",  tier:"LG",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-08-31", start:"Sep 2026",   duration:"6 Monate",                   apps:680, avgScore:82, spots:3,  acceptRate:0.4,  url:"https://www.bcpartners.com/careers",                department:"Private Equity – Europe",                abteilung:"Large Cap Buyout · Services · Tech",  firmDesc:"BC Partners ist ein europäischer Large-Cap-PE mit $40 Mrd. AUM. Das Londoner Team ist führend in europäischen Large-Cap-Buyouts.", aufgaben:["LBO-Modelle & Renditeanalysen","Deal-Sourcing & IC-Memos","Due-Diligence-Koordination"], anforderungen:["Top-Uni europaweit","BB-Praktikum","Englisch C2"], required:{uni:22,gpa:21,praktika:19,lang:12,skills:9}, medianGpa:1.3, medianPrak:"BB / EB", medianLang:"C2", salaryMonth:4200, salaryY1:95000, conversion:58, hours:72, currency:"GBP"},
{id:"bx_lon",  firm:"Blackstone London", short:"BX•LDN",role:"Summer Analyst – European Private Equity", type:"PE",  tier:"MF",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-10-01", start:"Jun 2027",   duration:"10 Wochen",                  apps:2100,avgScore:91, spots:6,  acceptRate:0.3,  url:"https://www.blackstone.com/careers",                department:"PE – EMEA Buyout",                        abteilung:"Large Cap Buyout · Real Estate · Credit",firmDesc:"Blackstone London ist das EMEA-Hauptquartier für PE, Real Estate und Credit-Strategien. Intensivste Ausbildungsumgebung im Private-Equity-Sektor weltweit.", aufgaben:["Full deal lifecycle exposure","LBO-Modellierung & Returns","IC-Presentation Prep"], anforderungen:["Master oder Penultimate Top-Target","Note ≤1,1 (Top 2% des Jahrgangs)","Ausschließlich Oxbridge/LBS/LSE/Imperial/WHU/HSG/Bocconi","Mindestens 3 Praktika: 2× BB (davon 1× GS/MS/JPM) + 1× PE","LBO-Modellierung perfekt + Full Case Study","Blackstone London nimmt 6 Summer Analysts – schwierigster PE-Einstieg weltweit","Englisch native zwingend"], required:{uni:25,gpa:23,praktika:23,lang:12,skills:11}, medianGpa:1.1, medianPrak:"GS/MS/JPM + Top-PE", medianLang:"C2", salaryMonth:4500, salaryY1:100000, conversion:50, hours:78, currency:"GBP"},

/* ══ MBB – DACH ══ */
{id:"mck_ffm", firm:"McKinsey & Company",short:"MK", role:"Fellow Intern / Junior Associate Strategy (Frankfurt)",      type:"MBB", tier:"MBB", loc:"Frankfurt",  region:"D", year:2026, deadline:"2026-09-30", start:"Laufend",    duration:"3-6 Monate Fellow Intern",                 apps:2100,avgScore:78, spots:8,  acceptRate:0.4,  url:"https://www.mckinsey.com/de/karriere/einstieg/dein-einstieg-als-consultant/aktuelle-bewerbungsdeadline",                  department:"Strategy & Corporate Finance",            abteilung:"Corporate Finance · M&A · Strategie",firmDesc:"McKinsey & Company – bekannteste Strategieberatung weltweit. Frankfurter Büro bedient DAX-Konzerne, Mittelstand und PE-Kunden. Generalisten-Einstieg ermöglicht Branchen- und Funktionswahl später. Verifizierter Timeline: Interviews Oktober-November 2026.", aufgaben:["Workstream-Verantwortung in Projektteams","Datenanalysen & Marktmodellierungen","Strategieentwicklung & Klienten-Präsentation"], anforderungen:["Bachelor 4.+ Semester, Master oder Promotion","Note ≤1,5 (Master) / ≤1,3 (Bachelor)","Target / Semi-Target: WHU, LMU, Mannheim, TUM, FS, Goethe","McKinsey Problem Solving Game (Solve) ≥80. Perzentil","Case-Interview Training zwingend (2-3 Runden à 2 Cases)","1+ Praktikum: Beratung, Industrie, Finance","Deutsch + Englisch C1/C2","Auslandserfahrung / starke Extracurriculars wichtig","Interviews Oktober 2026, Interviewtag November 2026","Generalist oder McKinsey Digital (Strategy + Tech Schnittstelle)"], required:{uni:20,gpa:18,praktika:14,lang:10,skills:6}, medianGpa:1.3, medianPrak:"Beratung / Industrie", medianLang:"C2", salaryMonth:3000, salaryY1:98000, conversion:80, hours:60, currency:"EUR"},
{id:"bcg_muc", firm:"BCG",               short:"BCG",role:"Associate Consultant Internship (Praktikum)",               type:"MBB", tier:"MBB", loc:"München",    region:"D", year:2026, deadline:"2026-07-31", start:"Laufend",    duration:"8-10 Wochen Associate Consultant Intern",                 apps:1950,avgScore:77, spots:10, acceptRate:0.5,  url:"https://careers.bcg.com/early-careers",                       department:"Strategy & Finance",                     abteilung:"Corporate Finance · M&A DD · Operations",firmDesc:"Globale Top-3-Strategieberatung. Münchner Büro ist das größte in Deutschland, bedient DAX-Konzerne, Mittelstand und PE-Kunden branchenübergreifend.", aufgaben:["Eigenständige Analysen & Modellierungen","Strategiepapiere & Präsentationen","Klienten-Interviews"], anforderungen:["Bachelor ab 4. Semester oder Master-Student","Note ≤1,5 (Master) / ≤1,3 (Bachelor)","Target / Semi-Target: WHU, LMU, TU München, Mannheim, FS","Case-Interview (2-3 Runden à 1-2 Cases)","BCG Online Case (Chatbot-Simulation) bestehen","1+ Praktikum (Beratung, Industrie, Finance)","Starke Extracurriculars (Enactus, Initiativen, Sport)","Deutsch + Englisch C1/C2","Auslandssemester/Praktikum hilfreich"], required:{uni:20,gpa:18,praktika:13,lang:10,skills:6}, medianGpa:1.3, medianPrak:"Beratung / Industrie", medianLang:"C1", salaryMonth:3000, salaryY1:98000, conversion:80, hours:60, currency:"EUR"},
{id:"bain_muc",firm:"Bain & Company",    short:"BA", role:"Consultant Internship (Praktikum)",               type:"MBB", tier:"MBB", loc:"München",    region:"D", year:2026, deadline:"2026-07-31", start:"Laufend",    duration:"8-10 Wochen Consultant Intern",                 apps:1800,avgScore:76, spots:10, acceptRate:0.6,  url:"https://www.bain.com/careers/students/internships-and-full-time-roles/",                      department:"Strategy & Corporate Finance",            abteilung:"PE DD · Retail · Industrials",        firmDesc:"Globale Top-3-Strategieberatung. Münchner Büro (größter DACH-Standort) berät DAX-30, Mittelstand und PE-Kunden. Bain ist bekannt für TNPS-Kultur und hohe PE-Client-Dichte.", aufgaben:["Strategieprojekte für DAX und PE","Markt- & Wettbewerbsanalysen","Präsentationserstellung"], anforderungen:["Bachelor ab 4. Semester oder Master","Note ≤1,5 (Top 10-15%)","Target / Semi-Target: WHU, LMU, TUM, Mannheim, FS","Case-Interviews (2-3 Runden) + SOVA Numerical Test","1+ Praktikum (Beratung, Finance, Industrie)","Starke Extracurriculars (Sport, Initiativen, Engagement)","Deutsch + Englisch C1","Auslandserfahrung / Auslandssemester sehr gern gesehen","TNPS & Bain-Kultur-Match wichtig im Interview"], required:{uni:20,gpa:18,praktika:12,lang:10,skills:5}, medianGpa:1.4, medianPrak:"Beratung / Industrie", medianLang:"C1", salaryMonth:3000, salaryY1:95000, conversion:80, hours:58, currency:"EUR"},
{id:"rb_muc",  firm:"Roland Berger",     short:"RB", role:"Praktikant Consulting (m/w/d)",               type:"MBB", tier:"MBB", loc:"München",    region:"D", year:2026, deadline:"2026-08-31", start:"Laufend",    duration:"3-6 Monate Praktikum",                 apps:1100,avgScore:70, spots:15, acceptRate:1.4,  url:"https://www.rolandberger.com/de/Karriere/",          department:"Corporate Finance & Strategy",            abteilung:"CF · M&A · Restructuring · Operations",firmDesc:"Größte europäische Strategieberatung mit deutschen Wurzeln. Starkes Mittelstands- und Industrie-Geschäft, weniger US-orientiert als MBB. Gute Exit Options in DAX-Konzerne.", aufgaben:["Strategieprojekte & Marktanalysen","Restrukturierungsszenarien","Klientenpräsentationen"], anforderungen:["Bachelor ab 3. Semester oder Master-Student","Note ≤1,7 (Bachelor) / ≤1,5 (Master)","Target / Semi-Target: WHU, Mannheim, LMU, TUM, Goethe","Case-Interview (2 Runden à 1-2 Cases)","Erstes Praktikum ausreichend (Industrie, Big 4, Beratung)","Deutsch C2 zwingend (DACH-Fokus)","Englisch C1","Fachliche Spezialisierung möglich (Auto, Industrie, Healthcare)"], required:{uni:18,gpa:16,praktika:11,lang:10,skills:5}, medianGpa:1.5, medianPrak:"Industrie / Big 4", medianLang:"C1", salaryMonth:2700, salaryY1:85000, conversion:75, hours:58, currency:"EUR"},
{id:"ow_ffm",  firm:"Oliver Wyman",      short:"OW", role:"Intern Consultant – Financial Services (Frankfurt)",          type:"MBB", tier:"MBB", loc:"Frankfurt",  region:"D", year:2026, deadline:"2026-06-30", start:"Okt 2026",   duration:"3-6 Monate Intern Consultant",                 apps:820, avgScore:73, spots:6,  acceptRate:0.7,  url:"https://careers.oliverwyman.com/careers/en_US/home",                department:"Financial Services Practice",             abteilung:"Banking · Versicherungen · Risk",     firmDesc:"Oliver Wyman – global führende Financial-Services-Beratung (Marsh McLennan Gruppe). Frankfurter Büro ist der FS-Hub für DACH, bedient Banken, Versicherungen und Asset Manager. Höhere FS-Dichte als MBB.", aufgaben:["Projekte für Banken & Versicherer","Risiko- & Regulierungsanalysen","Quantitative Modellierungen"], anforderungen:["Bachelor ab 4. Semester oder Master","Note ≤1,5","Target / Semi-Target: WHU, FS, Mannheim, Goethe, LMU","Case-Interview (2 Runden à 1-2 Cases)","1+ Praktikum: idealerweise FS (Bank, Versicherung, Big 4 FSO)","Englisch C2, Deutsch fließend","Numerical Reasoning + Logical Tests","Oliver Wyman Frankfurt hat starken FS-Fokus (Banking, Insurance, Asset Mgmt)","Recruiting weniger aggressiv als MBB, aber ähnliche Selektivität"], required:{uni:19,gpa:17,praktika:12,lang:11,skills:7}, medianGpa:1.5, medianPrak:"Consulting / Industrie", medianLang:"C1", salaryMonth:2800, salaryY1:92000, conversion:78, hours:60, currency:"EUR"},

/* ══ MBB – London ══ */
{id:"mck_lon", firm:"McKinsey London",   short:"MK•LDN",role:"2026 Summer Business Analyst (London)",       type:"MBB", tier:"MBB", loc:"London",     region:"LDN",  year:2026, deadline:"2026-07-15", start:"Jun 2027",   duration:"10 Wochen Summer Business Analyst",                  apps:4800,avgScore:82, spots:30, acceptRate:0.6,  url:"https://www.mckinsey.com/careers/search-jobs",                  department:"Strategy Practice – EMEA",               abteilung:"Corporate Finance · Strategy · Ops",  firmDesc:"McKinsey London ist das EMEA-Hub für Strategy & Corporate Finance. Bedient Blue-Chip-Kunden und PE-Fonds mit Due-Diligence-Mandaten. Höchste Selektivität im europäischen Consulting Recruiting.", aufgaben:["EMEA-Strategieprojekte","Datenanalysen & Klienten-Präsentation","Case-Work"], anforderungen:["Penultimate Bachelor oder Master-Student","First Class Honours / Top 10% / ≤1,2","Zwingend Oxbridge/LSE/Imperial/LBS/Warwick/WHU/HSG/Bocconi","McKinsey Problem Solving Game (Solve) ≥85. Perzentil","Case-Interviews (3 Runden à 2 Cases)","2+ Praktika inkl. Beratung oder Top-Finance","Englisch native, weitere Sprache Plus","McKinsey London nimmt ~30 Summer Associates","80-90% Return-Offer Rate","Bewerbung Juli-September (rolling)"], required:{uni:22,gpa:20,praktika:15,lang:12,skills:7}, medianGpa:1.2, medianPrak:"Beratung + Finance", medianLang:"C2", salaryMonth:4500, salaryY1:95000, conversion:80, hours:62, currency:"GBP"},

/* ══ PC – DACH ══ */
{id:"pem_ffm", firm:"Pemberton Asset Management",short:"PEM",role:"Analyst Intern – Direct Lending DACH",       type:"PC",  tier:"MM",  loc:"Frankfurt",  region:"D", year:2026, deadline:"2026-05-31", start:"Sep 2026",   duration:"6 Monate",                   apps:210, avgScore:68, spots:2,  acceptRate:1.0,  url:"https://www.pembertonam.com/careers",               department:"European Direct Lending",                 abteilung:"Senior Secured · Unitranche · Sponsor Finance",firmDesc:"Pemberton Asset Management – europäischer Private-Credit-Leader (€20bn AUM), Unitranche-Market-Leader für DACH Mid-Market (€50m-€500m). Frankfurter Team eng mit PE-Sponsoren vernetzt.", aufgaben:["Kreditanalyse & Underwriting","Credit Approval Memoranda","Covenant-Testing","Portfolioüberwachung"], anforderungen:["Master-Student Finance","Note ≤1,6","Target / Semi-Target: WHU, FS, Mannheim, Goethe","1-2 Praktika: IB LevFin, Big 4 TAS, Debt Advisory","LevFin-Kenntnisse + Credit Modelling","Deutsch C1 + Englisch C2 zwingend","Pemberton nimmt 2 Analysts – Unitranche-Market-Leader Europa","Starker LGT-Zusammenhang (Mehrheitseigner)","Direkte Arbeit an Live-Finanzierungen"], required:{uni:18,gpa:16,praktika:14,lang:10,skills:7}, medianGpa:1.4, medianPrak:"IB LevFin / Big 4 TAS", medianLang:"C2", salaryMonth:2400, salaryY1:82000, conversion:72, hours:60, currency:"EUR"},
{id:"tik_ffm", firm:"Tikehau Capital",   short:"TIK",role:"Praktikant Private Debt – Frankfurt",          type:"PC",  tier:"MM",  loc:"Frankfurt",  region:"D", year:2026, deadline:"2026-06-30", start:"Okt 2026",   duration:"6 Monate Praktikant",                   apps:260, avgScore:70, spots:2,  acceptRate:0.8,  url:"https://tikehau-capital-career.talentview.io/",          department:"Private Debt – DACH / Nordeuropa",        abteilung:"Direct Lending · Sub Debt · Special Situations",firmDesc:"Tikehau Capital – französischer Alternative Asset Manager (€46bn AUM), stark in Private Debt und Direct Lending. Frankfurter Team fokussiert auf DACH-Mid-Market-Finanzierungen (€20m-€200m Tickets).", aufgaben:["Transaktionsanalyse & Strukturierung","Credit Committee Papers","Kreditszenarien & Sensitivitätsanalysen"], anforderungen:["Master-Student Finance/BWL/VWL","Note ≤1,7","Target / Semi-Target: WHU, FS, Mannheim, Goethe","1-2 Praktika: IB LevFin, Big 4 TAS, Debt/Credit Advisory","Credit-Modelling + LevFin-Kenntnisse","Englisch C2 zwingend (französisches HQ)","Französisch ein klarer Vorteil","Private-Debt/Unitranche-Interesse","Tikehau Capital Portal: talentview.io – spezifische Job-IDs"], required:{uni:19,gpa:16,praktika:14,lang:10,skills:7}, medianGpa:1.5, medianPrak:"IB / Big 4 TAS", medianLang:"C1", salaryMonth:2400, salaryY1:82000, conversion:70, hours:60, currency:"EUR"},
{id:"ard_pc",  firm:"Ardian – Private Credit",short:"APC",role:"Praktikum – Private Credit Frankfurt",    type:"PC",  tier:"MM",  loc:"Frankfurt",  region:"D", year:2026, deadline:"2026-06-30", start:"Sep 2026",   duration:"3–6 Monate",                 apps:230, avgScore:69, spots:2,  acceptRate:0.9,  url:"https://www.ardian.com/join-us",                    department:"Private Debt – DACH",                    abteilung:"Senior Debt · Unitranche · Mezzanine",firmDesc:"Ardian Private Credit ($8 Mrd. AUM) – einer der europaweit führenden Anbieter von Private Credit Solutions. Frankfurter Team investiert in mittelständische DACH-Transaktionen.", aufgaben:["Kreditwürdigkeitsanalyse","Financial Models & Covenant Testing","Credit Papers für IC","Portfoliomonitoring"], anforderungen:["BWL/VWL/Finance, gute Noten","CF/IB/Credit-Erfahrung","Englisch + Deutsch"], required:{uni:19,gpa:16,praktika:14,lang:10,skills:7}, medianGpa:1.5, medianPrak:"IB / TAS / PC", medianLang:"C1", salaryMonth:2400, salaryY1:82000, conversion:72, hours:60, currency:"EUR"},
{id:"ares_ffm",firm:"Ares Management",   short:"ARE",role:"Private Credit Analyst Intern – Frankfurt",           type:"PC",  tier:"MM",  loc:"Frankfurt",  region:"D", year:2026, deadline:"2026-04-30", start:"Sep 2026",   duration:"6 Monate Intern",                   apps:290, avgScore:71, spots:2,  acceptRate:0.7,  url:"https://www.aresmgmt.com/careers",                  department:"European Credit – Direct Lending",        abteilung:"Senior Secured · Unitranche · Sponsor Finance",firmDesc:"Ares Management – weltgrößter Private-Credit-Manager ($450bn+ AUM). Frankfurter Team fokussiert auf DACH-Direct-Lending für PE-Sponsoren. US-Kultur, hohes Tempo, kompetitive Bezahlung.", aufgaben:["Underwriting neuer DL-Transaktionen","Cash-Flow-Modelling","Portfolio-Monitoring"], anforderungen:["Master-Student Finance","Note ≤1,5","Top-Target: WHU, FS, Mannheim","2 Praktika: BB IB LevFin + Big 4 oder PC","Englisch C2 (US-Firma), Deutsch fließend","LBO-Modellierung + Credit-Analyse meisterhaft","US-geprägte Arbeitskultur in FFM","Ares ist weltgrößter PC-Manager – €450bn AUM","Direct Lending Fund VIII aktiv in DACH"], required:{uni:20,gpa:16,praktika:16,lang:10,skills:8}, medianGpa:1.4, medianPrak:"BB IB + PC / Big 4", medianLang:"C2", salaryMonth:2600, salaryY1:88000, conversion:65, hours:65, currency:"EUR"},
{id:"eura_ffm",firm:"Eurazeo",           short:"EZ", role:"Analyst – Private Debt Europa",               type:"PC",  tier:"MM",  loc:"Frankfurt",  region:"D", year:2026, deadline:"2026-05-31", start:"Sep 2026",   duration:"6 Monate",                   apps:190, avgScore:67, spots:1,  acceptRate:0.5,  url:"https://www.eurazeo.com/en/join-us",                 department:"Private Debt – Europa",                  abteilung:"Direct Lending · Growth Lending · Unitranche",firmDesc:"Eurazeo (€35 Mrd. AUM) – eine der führenden europäischen Private-Asset-Gesellschaften. Private-Debt-Plattform fokussiert auf Mid-Market in DACH, Frankreich und Benelux.", aufgaben:["Origination-Support","Due-Diligence-Unterstützung","Financial Models & IC-Memoranda"], anforderungen:["Gutes bis sehr gutes Finance-Studium","Englisch + Deutsch fließend"], required:{uni:18,gpa:15,praktika:13,lang:10,skills:6}, medianGpa:1.6, medianPrak:"IB Boutique / Big 4", medianLang:"C1", salaryMonth:2300, salaryY1:80000, conversion:75, hours:58, currency:"EUR"},

/* ══ PC – Zürich ══ */
{id:"lgt_zh",  firm:"LGT Capital Partners",short:"LGT",role:"Analyst Intern – Private Debt",              type:"PC",  tier:"MM",  loc:"Zürich",     region:"CH",   year:2026, deadline:"2026-08-01", start:"Nov 2026",   duration:"6 Monate",                   apps:195, avgScore:67, spots:2,  acceptRate:1.3,  url:"https://www.lgtcp.com/en/careers",                  department:"Private Debt",                           abteilung:"Direct Lending · Senior / Junior · DACH",firmDesc:"LGT Capital Partners – Schweizer Family-Office-naher Alternativ-Asset-Manager mit starker Private-Debt-Plattform. HQ in Pfäffikon/Zürich. DACH Direct Lending Fokus.", aufgaben:["Kreditanalyse & Underwriting","Modellierung & Szenarioanalysen","Portfolio-Tracking"], anforderungen:["Finance-Studium Schweiz/Europa","Kredit-Vorerfahrung hilfreich","Englisch + Deutsch"], required:{uni:18,gpa:15,praktika:12,lang:10,skills:6}, medianGpa:1.6, medianPrak:"Big 4 / Boutique IB", medianLang:"C1", salaryMonth:3800, salaryY1:115000, conversion:75, hours:60, currency:"CHF"},
{id:"pg_pc_zh",firm:"Partners Group Credit",short:"PGC",role:"Analyst Intern – Private Debt Zürich",      type:"PC",  tier:"MM",  loc:"Zürich",     region:"CH",   year:2026, deadline:"2026-07-15", start:"Okt 2026",   duration:"6 Monate",                   apps:250, avgScore:73, spots:3,  acceptRate:1.2,  url:"https://www.partnersgroup.com/en/careers",          department:"Private Debt – DACH",                    abteilung:"Direct Lending · Mezzanine · Structured",firmDesc:"Partners Group Credit (CHF 150 Mrd. gesamt) – Zürich-HQ. Private-Debt-Strategien für institutionelle Kunden weltweit.", aufgaben:["Credit Underwriting & Kreditanalysen","Financial Modelling","IC-Unterlagen"], anforderungen:["Gutes Finance-Studium (HSG/ETH/Uni ZH)","Englisch C1","Eigenverantwortung"], required:{uni:19,gpa:17,praktika:14,lang:10,skills:7}, medianGpa:1.5, medianPrak:"IB / Big 4 / PC", medianLang:"C1", salaryMonth:4000, salaryY1:120000, conversion:70, hours:62, currency:"CHF"},

/* ══ PC – London ══ */
{id:"icg_lon", firm:"ICG – Intermediate Capital Group",short:"ICG",role:"Analyst – European Private Credit",type:"PC",tier:"MM", loc:"London",     region:"LDN",  year:2026, deadline:"2026-09-01", start:"Okt 2026",   duration:"6 Monate",                   apps:380, avgScore:74, spots:3,  acceptRate:0.8,  url:"https://www.icgam.com/careers",                     department:"European Private Credit",                abteilung:"Direct Lending · Sub Debt · Structured",  firmDesc:"ICG ($100+ Mrd. AUM) ist eine der führenden europäischen Private-Credit-Gesellschaften. Das Londoner Team verwaltet Senior, Subordinated und Structured Credit.", aufgaben:["Kreditanalyse & Underwriting","IC-Memoranda","Financial Modelling","Portfolio-Monitoring"], anforderungen:["Top-Finance-Studium","IB oder PC-Erfahrung","Englisch C2"], required:{uni:20,gpa:17,praktika:16,lang:12,skills:8}, medianGpa:1.4, medianPrak:"BB / IB / PC", medianLang:"C2", salaryMonth:3500, salaryY1:80000, conversion:68, hours:65, currency:"GBP"},
{id:"bri_lon", firm:"Bridgepoint Credit", short:"BRI",role:"Analyst Intern – Private Credit Europe",      type:"PC",  tier:"MM",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-08-15", start:"Sep 2026",   duration:"6 Monate",                   apps:290, avgScore:72, spots:2,  acceptRate:0.7,  url:"https://www.bridgepoint.eu/careers",                department:"Credit – Europe",                        abteilung:"Direct Lending · Senior Secured · Sub",   firmDesc:"Bridgepoint Credit – Direct-Lending-Arm einer führenden europäischen PE-Gesellschaft. Londoner Team mit starker DACH- und UK-Deal-Pipeline.", aufgaben:["Underwriting & Credit Analysis","Financial Models","IC-Memos"], anforderungen:["Finance-Studium","IB/TAS-Vorerfahrung","Englisch C2"], required:{uni:20,gpa:17,praktika:15,lang:12,skills:7}, medianGpa:1.5, medianPrak:"IB / Big 4", medianLang:"C2", salaryMonth:3400, salaryY1:78000, conversion:70, hours:62, currency:"GBP"},

/* ══ IB – Erweiterung D ══ */
{id:"laz_ffm", firm:"Lazard",              short:"LAZ",role:"Off-Cycle Intern – Financial Advisory",         type:"IB",  tier:"EB",  loc:"Frankfurt",  region:"D",    year:2026, deadline:"2026-05-15", start:"Okt 2026",   duration:"6 Monate Off-Cycle",                   apps:260, avgScore:79, spots:2,  acceptRate:0.8,  url:"https://www.lazard.com/careers/students-graduates/",                    department:"Financial Advisory",                     abteilung:"M&A · Restrukturierung · Private Capital",firmDesc:"Weltweit älteste unabhängige Investmentbank. Frankfurter Team fokussiert auf Cross-Border-M&A, komplexe Financial Advisory und Restructuring.",aufgaben:["M&A-Transaktionsunterstützung","Pitchbooks & Bewertungsmodelle","Restrukturierungsanalysen"],anforderungen:["Bachelor 5.+ Semester oder Master","Note ≤1,5 (Master) / ≤1,7 (Bachelor)","Target: WHU, FS, Mannheim, HSG, LBS, HEC, Oxbridge","2+ Praktika: idealerweise BB, EB oder Big 4 TAS","Englisch C2, Deutsch C2 + Französisch ein Plus","LBO-Modellierung + Präsentationskompetenz","Lazard-Kultur: sehr prestigeorientiert, selektiv","Superday: 4-5 Interviews + Case"],required:{uni:22,gpa:21,praktika:18,lang:12,skills:8},medianGpa:1.3,medianPrak:"BB / EB / Big 4 TAS",medianLang:"C2", salaryMonth:2600, salaryY1:88000, conversion:72, hours:82, currency:"EUR"},
{id:"moel_ffm",firm:"Moelis & Company",    short:"MOE",role:"2026 Analyst, Investment Banking – Frankfurt",         type:"IB",  tier:"EB",  loc:"Frankfurt",  region:"D",    year:2027, deadline:"2026-01-19", start:"Jun 2027",   duration:"2,5 Jahre Analyst Programme (Full-Time)",                  apps:320, avgScore:81, spots:2,  acceptRate:0.6,  url:"https://moelis.wd1.myworkdayjobs.com/en-US/University-Hires/job/XMLNAME-2026-Analyst--Investment-Banking---Frankfurt_REQ101925-1",                    department:"Investment Banking",                     abteilung:"M&A · Restructuring · Capital Markets",   firmDesc:"Elite Boutique mit globalem Training in NYC. Frankfurter Team klein aber hochkarätig – fokussiert auf DACH Cross-Border-M&A und Restructuring. Bekannt für direkte Partner-Exposure und aggressive Bonus-Struktur.",aufgaben:["Komplexe Finanzmodelle","Pitchbook-Erstellung","Transaktionsausführung"],anforderungen:["Master-Student oder finaler Bachelor (Penultimate Year)","Zwingend Top-Target: WHU, FS, HSG, LBS, HEC, Bocconi","Note ≤1,3 (Top 5% des Jahrgangs)","Min. 2 Top-Tier Praktika (BB oder EB)","LBO-Modelling exzellent – Test im Superday","Englisch C2 zwingend (US-geprägte Kultur, kein Deutsch-Pflicht)","Moelis Frankfurt klein (~15 Bankers) – erwartet Top 5% Profil","Intensives Global Training in New York vor Deal-Einsatz","Direkter Zugang zu senior Bankers – Live-Deal-Expertise ab Woche 1","Application Deadline: 19. Januar"],required:{uni:23,gpa:22,praktika:20,lang:12,skills:9},medianGpa:1.3,medianPrak:"BB + EB zwingend",medianLang:"C2", salaryMonth:2700, salaryY1:92000, conversion:70, hours:85, currency:"EUR"},
{id:"jef_ffm", firm:"Jefferies",           short:"JEF",role:"Analyst Intern – Investment Banking Frankfurt",         type:"IB",  tier:"BB",  loc:"Frankfurt",  region:"D",    year:2026, deadline:"2026-05-31", start:"Okt 2026",   duration:"6 Monate Off-Cycle",                   apps:340, avgScore:72, spots:4,  acceptRate:1.2,  url:"https://www.jefferies.com/careers/student-programs/",                 department:"Investment Banking",                     abteilung:"LevFin · M&A · ECM",                      firmDesc:"Jefferies – US-Investmentbank mit schnell wachsendem DACH-Team. Starker LevFin-Fokus, aktive Mid-Cap und Sponsor-Coverage. Weniger Prestige als BB, dafür mehr Deal-Verantwortung früher.",aufgaben:["Finanzmodelle","LevFin-Unterlagen","Transaktionsunterstützung"],anforderungen:["Master oder letztes Bachelor-Semester","Note ≤1,7 (gute Note wichtig da Jefferies stark wächst in Europa)","Target / Semi-Target (WHU, Mannheim, Goethe, LMU)","1-2 Praktika: TAS, Boutique IB, Credit Analysis","LevFin-Interesse ist Plus (starkes LevFin-Franchise)","Englisch C2 (US-Team), Deutsch fließend","Bonus oft >60% Base – kompetitiv mit BB","Kleineres Team als BB – schnellere Verantwortungsübernahme"],required:{uni:20,gpa:18,praktika:15,lang:11,skills:7},medianGpa:1.5,medianPrak:"Big 4 TAS + IB Boutique",medianLang:"C2", salaryMonth:2200, salaryY1:75000, conversion:70, hours:80, currency:"EUR"},
{id:"barc_ffm",firm:"Barclays",            short:"BRC",role:"2026 Investment Banking Off-Cycle Intern (Frankfurt)",        type:"IB",  tier:"BB",  loc:"Frankfurt",  region:"D",    year:2026, deadline:"2026-03-15", start:"Okt 2026",   duration:"10 Wochen Summer Internship / 6 Monate Off-Cycle",                   apps:410, avgScore:74, spots:5,  acceptRate:1.2,  url:"https://search.jobs.barclays/search-jobs?k=Frankfurt&acm=37059,37058",                     department:"Investment Bank – DACH",                 abteilung:"M&A · DCM · Leveraged Finance",           firmDesc:"Barclays Frankfurt – UK-basierte BB mit starker LevFin-Aktivität in DACH. Team fokussiert auf Mid-Cap M&A, ECM und structured finance. Weniger kompetitiv als GS/JPM, dafür gute Deal-Exposure.",aufgaben:["Transaktionsmodelle","Pitchbooks","Research"],anforderungen:["Penultimate Year Bachelor oder Master","Note ≤1,5-1,7","Target / Semi-Target: WHU, FS, Mannheim, Goethe, LMU","1-2 Praktika: Big 4 TAS, MM IB, Corporate Finance","Deutsch + Englisch C1/C2","LBO-Grundlagen (LevFin-Team mit starker DACH-Aktivität)","Barclays online Assessment + HireVue","Superday mit 3-4 Interviews"],required:{uni:20,gpa:18,praktika:14,lang:11,skills:7},medianGpa:1.5,medianPrak:"BB / Big 4 TAS",medianLang:"C1", salaryMonth:2500, salaryY1:88000, conversion:70, hours:80, currency:"EUR"},
{id:"citi_ffm",firm:"Citigroup",           short:"CITI",role:"Investment Banking Placement Analyst Internship – Frankfurt 2026",          type:"IB",  tier:"BB",  loc:"Frankfurt",  region:"D",    year:2026, deadline:"2026-04-30", start:"Okt 2026",   duration:"3 Monate Placement Analyst Internship",                   apps:380, avgScore:73, spots:4,  acceptRate:1.1,  url:"https://jobs.citi.com/job/frankfurt-am-main/banking-investment-banking-placement-analyst-internship-frankfurt-germany-2026/287/85946872800",                             department:"Banking, Capital Markets & Advisory",    abteilung:"M&A · ECM · DCM · CorpBank",              firmDesc:"Citi Frankfurt bietet Advisory für Corporate und Financial Sponsor Clients in Deutschland – private und public M&A, Kapitalmarkt-Transaktionen (ECM, DCM), Finanzrestrukturierungen. Teil des globalen Citi IB-Network. Aktuelle Stelle verifiziert: Placement Analyst IB.",aufgaben:["Pitchbooks","Finanzmodellierung","Client-Coverage"],anforderungen:["Penultimate oder final year Student (Graduation Dec 2025 - 2026)","Business Administration, Economics oder verwandtes Fach","Note ≤2,5 (UK-Äquivalent) / ≤1,5 (DE)","Vorherige IB- oder Transaction-Advisory-Erfahrung gewünscht","3 Monate Internship, Start flexibel 2026","Top Performer bekommen Full-Time Offer (Analyst Program 2027)","Starke Excel-Skills (Financial Modeling, Valuations)","Englisch C2, Deutsch fließend (DACH-Kunden)","M&A, ECM, DCM Produkt-Exposure","Citi Early ID Leadership Program verschafft Fast-Track"],required:{uni:20,gpa:18,praktika:14,lang:12,skills:7},medianGpa:1.4,medianPrak:"BB / Big 4 TAS",medianLang:"C2", salaryMonth:2500, salaryY1:88000, conversion:68, hours:82, currency:"EUR"},
{id:"com_ffm", firm:"Commerzbank",         short:"COB",role:"Praktikant Corporate Finance / M&A Advisory", type:"IB",  tier:"BB",  loc:"Frankfurt",  region:"D",    year:2026, deadline:"2026-08-31", start:"Okt 2026",   duration:"6 Monate Praktikant",                 apps:280, avgScore:58, spots:6,  acceptRate:2.1,  url:"https://www.commerzbank.de/karriere/",               department:"Corporate Clients",                      abteilung:"M&A · DCM · Finanzierungsberatung",       firmDesc:"Commerzbank – zweitgrößte deutsche Bank. Corporate Finance Team in Frankfurt fokussiert auf DAX-30, Mittelstand und Familienunternehmen. Geregeltere Arbeitszeiten als US-BBs, konservativere Kultur.",aufgaben:["Kreditanalysen","Deal-Support","Marktresearch"],anforderungen:["Bachelor oder Master Finance/BWL","Note ≤2,3","Auch Non-Target-Uni OK (Goethe, TU Darmstadt etc.)","1 Vorpraktikum (Industrie, Bank, Big 4) hilfreich","Deutsch C2 zwingend (Mittelstandsbetreuung)","Englisch B2/C1 ausreichend","Geregelte Arbeitszeiten im Vergleich zu BB","Commerzbank ist tariflich organisiert – stabile Vergütung","Guter Einstieg für Bewerber ohne BB-Profil"],required:{uni:16,gpa:14,praktika:8,lang:9,skills:4},medianGpa:1.9,medianPrak:"Big 4 / Industrie",medianLang:"C1", salaryMonth:2000, salaryY1:70000, conversion:75, hours:65, currency:"EUR"},

/* ══ IB – Erweiterung London ══ */
{id:"pjt_lon", firm:"PJT Partners",        short:"PJT",role:"Summer Analyst – Investment Banking",         type:"IB",  tier:"EB",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-09-30", start:"Jun 2027",   duration:"10 Wochen",                  apps:1600,avgScore:88, spots:12, acceptRate:0.75, url:"https://pjtpartners.com/careers",                   department:"Investment Banking",                     abteilung:"Strategic Advisory · RSSG · PFG",         firmDesc:"PJT Partners – renommierte US-Elite-Boutique mit starkem Restrukturierungs- und M&A-Team in London.",aufgaben:["Deal-Execution","LBO-Modelle","Restrukturierungsanalysen"],anforderungen:["Master oder Penultimate Bachelor Top-Target","First Class Honours (≥2:1 / ≤1,3)","Zwingend Oxbridge/LSE/Imperial/LBS/WHU/HSG/Bocconi","2+ Top-Praktika (BB, EB, oder Top-MBB)","Perfekte LBO/Restructuring-Modellierung","Englisch native level","PJT nimmt ~10-12 Summer Analysts – extrem selektiv"],required:{uni:24,gpa:22,praktika:21,lang:12,skills:10},medianGpa:1.2,medianPrak:"BB + EB zwingend",medianLang:"C2", salaryMonth:4000, salaryY1:95000, conversion:70, hours:85, currency:"GBP"},
{id:"ppl_lon", firm:"Perella Weinberg",    short:"PWP",role:"Summer Analyst – Financial Advisory",         type:"IB",  tier:"EB",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-09-30", start:"Jun 2027",   duration:"10 Wochen",                  apps:1100,avgScore:85, spots:8,  acceptRate:0.7,  url:"https://www.pwpartners.com/careers",                department:"Advisory",                               abteilung:"M&A · Restructuring · Capital Solutions", firmDesc:"Perella Weinberg – unabhängige US-Elite-Boutique mit starkem europäischen M&A- und Restrukturierungsteam.",aufgaben:["Komplexe M&A","Restrukturierungsmodelle","Pitchbooks"],anforderungen:["Top-Uni europaweit","BB-Praktikum","Englisch C2"],required:{uni:23,gpa:22,praktika:20,lang:12,skills:9},medianGpa:1.3,medianPrak:"BB / EB",medianLang:"C2", salaryMonth:3900, salaryY1:92000, conversion:70, hours:85, currency:"GBP"},
{id:"gug_lon", firm:"Guggenheim Partners", short:"GUG",role:"Summer Analyst – Investment Banking",         type:"IB",  tier:"EB",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-09-15", start:"Jun 2027",   duration:"10 Wochen",                  apps:820, avgScore:82, spots:6,  acceptRate:0.75, url:"https://www.guggenheimpartners.com/careers",        department:"Investment Banking",                     abteilung:"M&A · Healthcare · Energy · TMT",         firmDesc:"Guggenheim – US-Elite-Boutique mit starker Sektor-Spezialisierung in Healthcare, TMT und Energy. London ist der EMEA-Hub.",aufgaben:["Sektor-Research","Transaktionsmodelle","Pitchbooks"],anforderungen:["Top-Uni","BB-Praktikum"],required:{uni:22,gpa:21,praktika:19,lang:12,skills:9},medianGpa:1.3,medianPrak:"BB / Big 4",medianLang:"C2", salaryMonth:3800, salaryY1:88000, conversion:70, hours:80, currency:"GBP"},
{id:"gh_lon",  firm:"Greenhill & Co",      short:"GH", role:"Summer Analyst – M&A",                        type:"IB",  tier:"EB",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-09-30", start:"Jun 2027",   duration:"10 Wochen",                  apps:680, avgScore:80, spots:4,  acceptRate:0.6,  url:"https://www.greenhill.com/en/careers",              department:"M&A Advisory",                           abteilung:"M&A · Restructuring · Capital Advisory",  firmDesc:"Greenhill – unabhängige US-Boutique mit Fokus auf komplexe M&A-Transaktionen. Londoner Team ist EMEA-Hauptsitz.",aufgaben:["M&A-Prozess","Bewertungsmodelle","Deal-Support"],anforderungen:["Top-Uni","BB/EB-Praktikum"],required:{uni:22,gpa:21,praktika:19,lang:12,skills:9},medianGpa:1.3,medianPrak:"BB / EB",medianLang:"C2", salaryMonth:3700, salaryY1:87000, conversion:72, hours:80, currency:"GBP"},
{id:"hsbc_lon",firm:"HSBC",                short:"HSBC",role:"Investment Banking Summer Analyst EMEA",      type:"IB",  tier:"BB",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-10-31", start:"Jun 2027",   duration:"10 Wochen",                  apps:2400,avgScore:79, spots:30, acceptRate:1.25, url:"https://www.hsbc.com/careers",                      department:"Global Banking",                         abteilung:"M&A · LevFin · ECM · DCM",                firmDesc:"HSBC – globale Universalbank mit starker europäischer IB-Präsenz. Londoner Team deckt EMEA-Large Cap M&A und DCM ab.",aufgaben:["Transaktionsunterstützung","Finanzmodelle","Research"],anforderungen:["Top-Uni","Englisch C2"],required:{uni:20,gpa:19,praktika:15,lang:12,skills:7},medianGpa:1.5,medianPrak:"BB / Big 4",medianLang:"C2", salaryMonth:3500, salaryY1:80000, conversion:70, hours:75, currency:"GBP"},
{id:"nom_lon", firm:"Nomura",              short:"NOM",role:"Summer Analyst – Investment Banking EMEA",    type:"IB",  tier:"BB",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-10-15", start:"Jun 2027",   duration:"10 Wochen",                  apps:1800,avgScore:76, spots:20, acceptRate:1.1,  url:"https://www.nomura.com/careers",                    department:"Investment Banking",                     abteilung:"M&A · Leveraged Finance · ECM",           firmDesc:"Nomura – größte japanische Investmentbank. Londoner Team ist EMEA-Hub mit starkem LevFin-Fokus.",aufgaben:["Deal-Analyse","Finanzmodelle","Pitchbooks"],anforderungen:["Top-Uni","Finance-Praktikum"],required:{uni:19,gpa:17,praktika:14,lang:12,skills:7},medianGpa:1.6,medianPrak:"BB / Big 4",medianLang:"C2", salaryMonth:3400, salaryY1:78000, conversion:70, hours:80, currency:"GBP"},
{id:"macq_lon",firm:"Macquarie Capital",   short:"MAC",role:"Summer Analyst – Investment Banking",         type:"IB",  tier:"BB",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-09-30", start:"Jun 2027",   duration:"10 Wochen",                  apps:1400,avgScore:78, spots:15, acceptRate:1.1,  url:"https://www.macquarie.com/careers",                 department:"Macquarie Capital",                      abteilung:"M&A · Infrastruktur · Green Investments", firmDesc:"Macquarie – australische Bank mit globaler IB-Präsenz und starkem Infrastruktur-Fokus. Londoner Team führend in Green Investments.",aufgaben:["Infrastruktur-Modelle","M&A-Support","Sektor-Research"],anforderungen:["Top-Uni","BB-Praktikum"],required:{uni:21,gpa:19,praktika:16,lang:12,skills:8},medianGpa:1.4,medianPrak:"BB / Big 4",medianLang:"C2", salaryMonth:3700, salaryY1:88000, conversion:70, hours:75, currency:"GBP"},
{id:"wb_lon",  firm:"William Blair",       short:"WB", role:"Summer Analyst – Investment Banking",         type:"IB",  tier:"EB",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-09-30", start:"Jun 2027",   duration:"10 Wochen",                  apps:540, avgScore:79, spots:4,  acceptRate:0.75, url:"https://williamblaircareers.com",                   department:"Investment Banking",                     abteilung:"Mid-Market M&A · Healthcare · Technology", firmDesc:"William Blair – US-Boutique mit starkem Mid-Market-Fokus. Londoner Team deckt Tech und Healthcare ab.",aufgaben:["M&A-Unterlagen","Sektor-Research","Finanzmodelle"],anforderungen:["Top-Uni","Finance-Praktikum"],required:{uni:21,gpa:20,praktika:17,lang:12,skills:8},medianGpa:1.4,medianPrak:"BB / EB",medianLang:"C2", salaryMonth:3600, salaryY1:85000, conversion:75, hours:75, currency:"GBP"},

/* ══ PE – Erweiterung D ══ */
{id:"adv_ffm", firm:"Advent International",short:"ADV",role:"Analyst Intern – Private Equity Europe",      type:"PE",  tier:"MF",  loc:"Frankfurt",  region:"D",    year:2026, deadline:"2026-06-30", start:"Okt 2026",   duration:"6 Monate",                   apps:680, avgScore:83, spots:2,  acceptRate:0.3,  url:"https://www.adventinternational.com/careers",       department:"Private Equity – DACH",                  abteilung:"Large Cap Buyout · Industrials · Healthcare",firmDesc:"Advent International – eine der weltgrößten PE-Gesellschaften ($110 Mrd. AUM). Frankfurter Team fokussiert auf DACH Large-Cap-Buyouts in Industrials und Healthcare.",aufgaben:["LBO-Modelle","Deal-Sourcing","IC-Memoranda","Due Diligence"],anforderungen:["Top-Uni","BB-Praktikum","LBO-Modeling"],required:{uni:22,gpa:21,praktika:20,lang:12,skills:9},medianGpa:1.3,medianPrak:"BB + PE",medianLang:"C2", salaryMonth:3000, salaryY1:95000, conversion:60, hours:70, currency:"EUR"},
{id:"cin_ffm", firm:"Cinven",              short:"CIN",role:"Analyst Intern – Private Equity DACH",        type:"PE",  tier:"MF",  loc:"Frankfurt",  region:"D",    year:2026, deadline:"2026-07-15", start:"Okt 2026",   duration:"6 Monate",                   apps:540, avgScore:81, spots:2,  acceptRate:0.4,  url:"https://www.cinven.com/careers",                    department:"Private Equity",                         abteilung:"Pan-European Large Cap Buyout",           firmDesc:"Cinven – europäische Large-Cap-PE mit €40 Mrd. AUM. Starker DACH-Fokus auf Healthcare, Business Services und Technology.",aufgaben:["LBO-Analysen","Sektor-Screenings","IC-Unterlagen"],anforderungen:["Top-Uni","BB-Praktikum","Englisch C2"],required:{uni:22,gpa:20,praktika:19,lang:12,skills:9},medianGpa:1.3,medianPrak:"BB / EB",medianLang:"C2", salaryMonth:3000, salaryY1:92000, conversion:62, hours:68, currency:"EUR"},
{id:"perm_ffm",firm:"Permira",             short:"PRM",role:"Analyst Intern – Private Equity",             type:"PE",  tier:"MF",  loc:"Frankfurt",  region:"D",    year:2026, deadline:"2026-06-30", start:"Okt 2026",   duration:"6 Monate",                   apps:520, avgScore:82, spots:2,  acceptRate:0.4,  url:"https://www.permira.com/careers",                   department:"Private Equity – DACH",                  abteilung:"Tech · Services · Consumer · Healthcare", firmDesc:"Permira – europäische Large-Cap-PE mit starkem Tech- und Consumer-Fokus. Frankfurter Team investiert in DACH-Mittelstand.",aufgaben:["Deal-Analysen","LBO-Modelle","Portfolio-Support"],anforderungen:["Top-Uni","BB-Praktikum"],required:{uni:22,gpa:20,praktika:19,lang:12,skills:9},medianGpa:1.3,medianPrak:"BB + PE",medianLang:"C2", salaryMonth:2900, salaryY1:92000, conversion:60, hours:68, currency:"EUR"},
{id:"nc_ffm",  firm:"Nordic Capital",      short:"NC", role:"Analyst Intern – Private Equity DACH",        type:"PE",  tier:"MF",  loc:"Frankfurt",  region:"D",    year:2026, deadline:"2026-07-31", start:"Okt 2026",   duration:"6 Monate",                   apps:380, avgScore:79, spots:2,  acceptRate:0.5,  url:"https://www.nordiccapital.com/careers",             department:"Private Equity",                         abteilung:"Healthcare · Tech · Financial Services",  firmDesc:"Nordic Capital – skandinavische PE mit €28 Mrd. AUM. Frankfurter Team baut DACH-Investmentplattform auf.",aufgaben:["LBO-Modelle","Branchenanalysen","IC-Memos"],anforderungen:["Top-Uni","Finance-Vorerfahrung"],required:{uni:21,gpa:20,praktika:18,lang:12,skills:8},medianGpa:1.4,medianPrak:"BB / Big 4",medianLang:"C2", salaryMonth:2800, salaryY1:90000, conversion:65, hours:65, currency:"EUR"},
{id:"hf_ffm",  firm:"Hellman & Friedman",  short:"HF", role:"Analyst Intern – Private Equity",             type:"PE",  tier:"MF",  loc:"Frankfurt",  region:"D",    year:2026, deadline:"2026-07-01", start:"Okt 2026",   duration:"6 Monate",                   apps:460, avgScore:84, spots:2,  acceptRate:0.4,  url:"https://www.hf.com/careers",                        department:"Private Equity",                         abteilung:"Large Cap Buyout · Software · Services",  firmDesc:"Hellman & Friedman – US-PE mit $100 Mrd. AUM und Fokus auf Software und Business Services. Frankfurter Team deckt DACH ab.",aufgaben:["LBO-Modellierung","Sektor-Analysen","Due Diligence"],anforderungen:["Top-Uni","BB-Praktikum"],required:{uni:22,gpa:21,praktika:20,lang:12,skills:9},medianGpa:1.3,medianPrak:"BB + PE",medianLang:"C2", salaryMonth:3100, salaryY1:98000, conversion:58, hours:72, currency:"EUR"},
{id:"wp_ffm",  firm:"Warburg Pincus",      short:"WP", role:"Analyst Intern – Private Equity",             type:"PE",  tier:"MF",  loc:"Frankfurt",  region:"D",    year:2026, deadline:"2026-08-15", start:"Okt 2026",   duration:"6 Monate",                   apps:420, avgScore:81, spots:2,  acceptRate:0.5,  url:"https://warburgpincus.com/careers",                 department:"Private Equity – DACH",                  abteilung:"Tech · Healthcare · Financial Services",  firmDesc:"Warburg Pincus – globale PE mit $80 Mrd. AUM. Frankfurter Team investiert in DACH-Growth und Buyouts.",aufgaben:["Finanzmodelle","Deal-Sourcing","Portfolio-Monitoring"],anforderungen:["Top-Uni","BB/PE-Praktikum"],required:{uni:22,gpa:20,praktika:19,lang:12,skills:9},medianGpa:1.3,medianPrak:"BB + PE",medianLang:"C2", salaryMonth:2900, salaryY1:92000, conversion:60, hours:70, currency:"EUR"},

/* ══ PE – Erweiterung Zürich ══ */
{id:"trit_zh", firm:"Triton Partners",     short:"TRI",role:"Analyst Intern – Private Equity DACH",        type:"PE",  tier:"LG",  loc:"Zürich",     region:"CH",   year:2026, deadline:"2026-07-15", start:"Okt 2026",   duration:"6 Monate",                   apps:320, avgScore:78, spots:3,  acceptRate:0.9,  url:"https://www.triton-partners.com/careers",           department:"Private Equity",                         abteilung:"DACH Mid-to-Large Cap · Industrials",     firmDesc:"Triton – europäische PE mit €17 Mrd. AUM und starkem DACH-Fokus auf Industrials und Business Services.",aufgaben:["LBO-Modelle","Deal-Sourcing","Due Diligence"],anforderungen:["Top-Uni","Finance-Praktikum"],required:{uni:20,gpa:19,praktika:17,lang:12,skills:8},medianGpa:1.4,medianPrak:"IB / Big 4",medianLang:"C2", salaryMonth:4200, salaryY1:120000, conversion:68, hours:65, currency:"CHF"},

/* ══ PE – Erweiterung London ══ */
{id:"cvc_lon", firm:"CVC Capital Partners",short:"CVC",role:"Summer Analyst – Private Equity Europe",      type:"PE",  tier:"MF",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-10-15", start:"Jun 2027",   duration:"10 Wochen",                  apps:1900,avgScore:88, spots:5,  acceptRate:0.3,  url:"https://www.cvc.com/careers",                       department:"Private Equity – Europe",                abteilung:"Large Cap Buyout · Strategic Opportunities",firmDesc:"CVC Capital Partners – eine der größten europäischen PE ($190 Mrd. AUM). Londoner Team ist globales Hauptquartier.",aufgaben:["Deal-Analyse","LBO-Modelle","IC-Präsentationen"],anforderungen:["Absolutes Top-Profil","BB+PE Vorerfahrung","Englisch C2"],required:{uni:24,gpa:22,praktika:22,lang:12,skills:10},medianGpa:1.2,medianPrak:"BB + Top-PE",medianLang:"C2", salaryMonth:4500, salaryY1:100000, conversion:55, hours:75, currency:"GBP"},
{id:"sl_lon",  firm:"Silver Lake",         short:"SL", role:"Summer Analyst – Technology Investing",       type:"PE",  tier:"MF",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-09-30", start:"Jun 2027",   duration:"10 Wochen",                  apps:1400,avgScore:91, spots:3,  acceptRate:0.2,  url:"https://www.silverlake.com/careers",                department:"Technology Private Equity",              abteilung:"Large Cap Tech Buyout · Growth",          firmDesc:"Silver Lake – weltweit führende Tech-PE mit $100 Mrd. AUM. Londoner Team investiert in europäische Tech-Large-Caps.",aufgaben:["Tech-Sektor-Analysen","LBO-Modelle","Deal-Sourcing"],anforderungen:["Absolutes Top-Profil","Tech-IB Praktikum","LBO-Modeling"],required:{uni:24,gpa:23,praktika:22,lang:12,skills:11},medianGpa:1.2,medianPrak:"BB Tech + PE",medianLang:"C2", salaryMonth:4800, salaryY1:105000, conversion:55, hours:75, currency:"GBP"},
{id:"tpg_lon", firm:"TPG Capital",         short:"TPG",role:"Summer Analyst – Private Equity Europe",      type:"PE",  tier:"MF",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-10-01", start:"Jun 2027",   duration:"10 Wochen",                  apps:1700,avgScore:87, spots:4,  acceptRate:0.25, url:"https://www.tpg.com/careers",                       department:"Private Equity",                         abteilung:"Capital · Growth · Rise · Real Estate",   firmDesc:"TPG – US-PE mit $220 Mrd. AUM und diversifizierten Strategien. Londoner Team deckt europäische Buyouts und Growth ab.",aufgaben:["LBO-Modelle","Deal-Sourcing","IC-Memos"],anforderungen:["Top-Uni","BB+PE Vorerfahrung"],required:{uni:23,gpa:22,praktika:21,lang:12,skills:10},medianGpa:1.2,medianPrak:"BB + PE",medianLang:"C2", salaryMonth:4500, salaryY1:100000, conversion:55, hours:75, currency:"GBP"},
{id:"prov_lon",firm:"Providence Equity",   short:"PRV",role:"Summer Analyst – Private Equity",             type:"PE",  tier:"MF",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-09-30", start:"Jun 2027",   duration:"10 Wochen",                  apps:780, avgScore:84, spots:3,  acceptRate:0.4,  url:"https://www.provequity.com/careers",                department:"Private Equity",                         abteilung:"Media · Communications · Education",      firmDesc:"Providence Equity – US-PE mit $30 Mrd. AUM und Fokus auf Media, Tech und Bildungssektor. Londoner Team deckt EMEA ab.",aufgaben:["Sektor-Research","LBO-Modelle","Deal-Unterstützung"],anforderungen:["Top-Uni","BB-Praktikum"],required:{uni:22,gpa:21,praktika:20,lang:12,skills:9},medianGpa:1.3,medianPrak:"BB + PE",medianLang:"C2", salaryMonth:4200, salaryY1:95000, conversion:58, hours:72, currency:"GBP"},
{id:"oak_lon", firm:"Oakley Capital",      short:"OAK",role:"Analyst – European Private Equity",           type:"PE",  tier:"LG",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-08-31", start:"Sep 2026",   duration:"6 Monate",                   apps:420, avgScore:80, spots:2,  acceptRate:0.5,  url:"https://www.oakleycapital.com/careers",             department:"Private Equity",                         abteilung:"Western European Mid-Market · DACH",      firmDesc:"Oakley Capital – europäische Mid-Market-PE mit €8 Mrd. AUM. Starker DACH-Fokus mit Londoner Hauptsitz.",aufgaben:["LBO-Modelle","Deal-Sourcing","Portfolio-Arbeit"],anforderungen:["Top-Uni","BB/EB-Praktikum"],required:{uni:21,gpa:20,praktika:18,lang:12,skills:8},medianGpa:1.4,medianPrak:"BB / EB",medianLang:"C2", salaryMonth:4000, salaryY1:90000, conversion:70, hours:70, currency:"GBP"},
{id:"lc_lon",  firm:"L Catterton",         short:"LC", role:"Summer Analyst – Consumer Private Equity",    type:"PE",  tier:"LG",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-09-30", start:"Jun 2027",   duration:"10 Wochen",                  apps:560, avgScore:82, spots:2,  acceptRate:0.35, url:"https://www.lcatterton.com/careers",                department:"Private Equity",                         abteilung:"Consumer · Retail · Food & Beverage",     firmDesc:"L Catterton – weltweit führende Consumer-PE mit $37 Mrd. AUM. Londoner Team deckt EMEA-Consumer ab.",aufgaben:["Consumer-Analysen","LBO-Modelle","Due Diligence"],anforderungen:["Top-Uni","BB/PE-Praktikum"],required:{uni:22,gpa:20,praktika:19,lang:12,skills:9},medianGpa:1.3,medianPrak:"BB + PE",medianLang:"C2", salaryMonth:4200, salaryY1:95000, conversion:65, hours:72, currency:"GBP"},
{id:"tb_lon",  firm:"Thoma Bravo",         short:"TB", role:"Summer Analyst – Software Private Equity",    type:"PE",  tier:"MF",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-10-15", start:"Jun 2027",   duration:"10 Wochen",                  apps:1200,avgScore:87, spots:3,  acceptRate:0.25, url:"https://www.thomabravo.com/careers",                department:"Software Private Equity",                abteilung:"Software · SaaS Large Cap Buyout",        firmDesc:"Thoma Bravo – weltweit führende Software-PE mit $140 Mrd. AUM. Londoner Team deckt europäische Software-Buyouts ab.",aufgaben:["SaaS-Analysen","LBO-Modelle","Sektor-Research"],anforderungen:["Top-Uni","Tech-IB Praktikum"],required:{uni:23,gpa:22,praktika:20,lang:12,skills:10},medianGpa:1.2,medianPrak:"BB Tech + PE",medianLang:"C2", salaryMonth:4800, salaryY1:105000, conversion:55, hours:78, currency:"GBP"},

/* ══ PC – Erweiterung ══ */
{id:"perm_pc_lon",firm:"Permira Credit",   short:"PMC",role:"Analyst – European Credit",                   type:"PC",  tier:"MM",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-08-31", start:"Okt 2026",   duration:"6 Monate",                   apps:340, avgScore:74, spots:2,  acceptRate:0.6,  url:"https://www.permiracredit.com/careers",             department:"Private Credit",                         abteilung:"Direct Lending · Structured Credit",      firmDesc:"Permira Credit – Direct-Lending-Arm von Permira mit €15 Mrd. AUM. Fokus auf europäische Sponsor-Transaktionen.",aufgaben:["Credit Underwriting","Financial Models","Portfolio-Monitoring"],anforderungen:["Top-Uni","IB/TAS-Praktikum","Englisch C2"],required:{uni:20,gpa:18,praktika:16,lang:12,skills:8},medianGpa:1.4,medianPrak:"BB / IB",medianLang:"C2", salaryMonth:3500, salaryY1:80000, conversion:68, hours:65, currency:"GBP"},
{id:"arc_lon", firm:"Arcmont Asset Management",short:"ARC",role:"Analyst Intern – Direct Lending",        type:"PC",  tier:"MM",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-07-31", start:"Okt 2026",   duration:"6 Monate",                   apps:310, avgScore:73, spots:2,  acceptRate:0.65, url:"https://www.arcmont.com/careers",                   department:"Direct Lending",                         abteilung:"Senior · Sub Debt · Sponsor Coverage",    firmDesc:"Arcmont – europäischer Direct-Lender mit €25 Mrd. AUM. Londoner Team sehr aktiv im DACH- und UK-Markt.",aufgaben:["Kreditanalysen","IC-Memos","Covenant-Testing"],anforderungen:["Finance-Studium","IB/Big 4 Praktikum"],required:{uni:20,gpa:18,praktika:15,lang:12,skills:7},medianGpa:1.5,medianPrak:"IB / Big 4",medianLang:"C2", salaryMonth:3400, salaryY1:78000, conversion:70, hours:62, currency:"GBP"},
{id:"hay_lon", firm:"Hayfin Capital",      short:"HAY",role:"Analyst – Private Credit Europe",             type:"PC",  tier:"MM",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-08-15", start:"Okt 2026",   duration:"6 Monate",                   apps:280, avgScore:72, spots:2,  acceptRate:0.7,  url:"https://www.hayfin.com/careers",                    department:"Private Credit",                         abteilung:"Direct Lending · Special Situations",     firmDesc:"Hayfin Capital – europäische Credit-Gesellschaft mit €30 Mrd. AUM. Londoner Team deckt DACH und UK Direct Lending ab.",aufgaben:["Credit Analysis","Financial Modelling","IC-Support"],anforderungen:["Finance-Studium","IB/Credit-Vorerfahrung"],required:{uni:19,gpa:17,praktika:14,lang:12,skills:7},medianGpa:1.5,medianPrak:"IB / Big 4",medianLang:"C2", salaryMonth:3300, salaryY1:77000, conversion:72, hours:60, currency:"GBP"},
{id:"muz_lon", firm:"Muzinich & Co",       short:"MUZ",role:"Analyst – Private Debt EMEA",                 type:"PC",  tier:"MM",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-09-15", start:"Okt 2026",   duration:"6 Monate",                   apps:190, avgScore:68, spots:2,  acceptRate:1.0,  url:"https://www.muzinich.com/careers",                  department:"Private Debt",                           abteilung:"Lower Mid-Market Direct Lending",         firmDesc:"Muzinich – US/europäischer Credit-Manager mit starkem europäischen Direct-Lending-Programm für Lower Mid-Market.",aufgaben:["Kreditanalyse","Portfolio-Monitoring"],anforderungen:["Finance-Studium","Englisch C1/C2"],required:{uni:18,gpa:16,praktika:13,lang:11,skills:6},medianGpa:1.6,medianPrak:"IB / Big 4",medianLang:"C1", salaryMonth:3100, salaryY1:72000, conversion:75, hours:58, currency:"GBP"},
{id:"kart_ffm",firm:"Kartesia",            short:"KAR",role:"Analyst – Private Credit DACH",               type:"PC",  tier:"MM",  loc:"Frankfurt",  region:"D",    year:2026, deadline:"2026-07-31", start:"Okt 2026",   duration:"6 Monate",                   apps:180, avgScore:66, spots:2,  acceptRate:1.1,  url:"https://www.kartesia.com/careers",                  department:"Private Credit",                         abteilung:"Senior Debt · Unitranche · Hybrid",       firmDesc:"Kartesia – europäischer Direct-Lender mit €4 Mrd. AUM und starkem DACH/Frankreich-Fokus auf Lower-Mid-Market.",aufgaben:["Underwriting","Credit Memos","Financial Models"],anforderungen:["Finance-Studium","IB/TAS-Vorerfahrung"],required:{uni:18,gpa:16,praktika:13,lang:10,skills:6},medianGpa:1.6,medianPrak:"IB / Big 4",medianLang:"C1", salaryMonth:2200, salaryY1:78000, conversion:75, hours:55, currency:"EUR"},
{id:"chey_lon",firm:"Cheyne Capital",      short:"CHY",role:"Analyst Intern – Private Credit",             type:"PC",  tier:"MM",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-08-15", start:"Okt 2026",   duration:"6 Monate",                   apps:220, avgScore:71, spots:2,  acceptRate:0.9,  url:"https://www.cheynecapital.com/careers",             department:"Alternative Credit",                     abteilung:"Direct Lending · Strategic Value",        firmDesc:"Cheyne Capital – europäische Hedge-Fund/Credit-Gesellschaft mit $10 Mrd. AUM. Starkes Private-Credit-Team in London.",aufgaben:["Credit-Analysen","Special Situations","IC-Unterlagen"],anforderungen:["Top-Uni","IB-Vorerfahrung"],required:{uni:20,gpa:18,praktika:15,lang:12,skills:7},medianGpa:1.5,medianPrak:"IB / Credit",medianLang:"C2", salaryMonth:3400, salaryY1:78000, conversion:68, hours:62, currency:"GBP"},
{id:"ps_lon",  firm:"Park Square Capital", short:"PSQ",role:"Analyst – European Private Debt",             type:"PC",  tier:"MM",  loc:"London",     region:"LDN",  year:2026, deadline:"2026-08-31", start:"Okt 2026",   duration:"6 Monate",                   apps:250, avgScore:72, spots:2,  acceptRate:0.8,  url:"https://parksquarecapital.com/careers",             department:"Private Debt",                           abteilung:"Senior Secured · Junior Debt",            firmDesc:"Park Square – europäischer Credit-Spezialist mit $14 Mrd. AUM. Starker Sponsor-Focus und aktiv im DACH-Markt.",aufgaben:["Underwriting","Credit Memos","Portfolio-Tracking"],anforderungen:["Top-Uni","IB/TAS-Praktikum"],required:{uni:20,gpa:18,praktika:15,lang:12,skills:7},medianGpa:1.5,medianPrak:"IB / Big 4",medianLang:"C2", salaryMonth:3400, salaryY1:78000, conversion:70, hours:60, currency:"GBP"},

/* ══ Consulting / MBB – Erweiterung ══ */
{id:"kea_ffm", firm:"Kearney",             short:"KEA",role:"Praktikant Consultant (Frankfurt/München)",                    type:"MBB", tier:"MBB", loc:"Frankfurt",  region:"D",    year:2026, deadline:"2026-07-31", start:"Laufend",    duration:"3-6 Monate Praktikant",                 apps:780, avgScore:68, spots:12, acceptRate:1.5,  url:"https://www.kearney.com/careers",                   department:"Strategy & Operations",                  abteilung:"Industrials · Consumer · Operations",     firmDesc:"Kearney – globale Strategie-Tier-2-Beratung mit starkem Operations- und Analytics-Fokus. Frankfurter Büro bedient DAX-Konzerne und Mittelstand. Bekannt für WLB und strukturierte Karrierewege.",aufgaben:["Strategieprojekte","Markt-Analysen","Präsentationen"],anforderungen:["Bachelor ab 3. Semester oder Master","Note ≤1,7","Target / Semi-Target: WHU, Mannheim, FS, Goethe, LMU, TUM","Case-Interview (2 Runden à 1 Case)","1+ Praktikum (Beratung, Industrie, Finance)","Deutsch + Englisch C1","Kearney Online Case (Pymetrics/Game)","Weniger aggressiv als MBB, aber solide Ausbildung"],required:{uni:18,gpa:16,praktika:11,lang:10,skills:5},medianGpa:1.6,medianPrak:"Industrie / Beratung",medianLang:"C1", salaryMonth:2600, salaryY1:82000, conversion:75, hours:58, currency:"EUR"},
{id:"sw_ffm",  firm:"Strategy& (PwC)",     short:"S&", role:"Praktikant Strategy (Frankfurt/München)",      type:"MBB", tier:"MBB", loc:"Frankfurt",  region:"D",    year:2026, deadline:"2026-07-31", start:"Laufend",    duration:"3-6 Monate Praktikant",                 apps:950, avgScore:70, spots:15, acceptRate:1.6,  url:"https://www.strategyand.pwc.com/careers",           department:"Strategy Consulting",                    abteilung:"Deals · Industrials · Financial Services",firmDesc:"Strategy& – Strategieberatung innerhalb des PwC Network. Seit Booz & Co. Akquisition 2014 Teil von PwC. Gute Brücke zwischen Strategy-Beratung und PwC Advisory/TAS. Weniger selektiv als MBB.",aufgaben:["Strategieprojekte","Due-Diligence-Support","Klienten-Präsentationen"],anforderungen:["Bachelor ab 4. Semester oder Master","Note ≤1,7","Target / Semi-Target","Case-Interview + Technical (2 Runden)","1+ Praktikum (Finance, Industrie, Beratung)","Deutsch + Englisch C1/C2","Strategy& ist PwC-Beratungsarm – PwC-Network nutzbar","Industrie-Spezialisierung möglich (Auto, FS, Healthcare)"],required:{uni:19,gpa:17,praktika:12,lang:10,skills:5},medianGpa:1.5,medianPrak:"Beratung / Big 4",medianLang:"C1", salaryMonth:2700, salaryY1:85000, conversion:72, hours:58, currency:"EUR"},
{id:"acc_ffm", firm:"Accenture Strategy",  short:"ACC",role:"Praktikant Strategy (Accenture Strategy)",      type:"MBB", tier:"MBB", loc:"Frankfurt",  region:"D",    year:2026, deadline:"2026-09-30", start:"Laufend",    duration:"3-6 Monate Praktikant",                 apps:820, avgScore:66, spots:20, acceptRate:2.4,  url:"https://www.accenture.com/de-de/careers",                 department:"Strategy & Consulting",                  abteilung:"Digital · Operations · Technology",       firmDesc:"Accenture Strategy ist der Strategy-Arm des weltgrößten Beratungs-Tech-Giganten (750k+ Mitarbeiter). Bedient DAX-Konzerne mit Transformation-Projekten. Hybrid zwischen Strategy und Implementation.",aufgaben:["Strategie- und Tech-Projekte","Datenanalysen","Klienten-Delivery"],anforderungen:["Bachelor ab 3. Semester oder Master","Note ≤2,0","WHU, Mannheim, FS, LMU, TUM, Goethe – auch Non-Target ok","Case-Interview (1-2 Runden)","Erstes Praktikum ausreichend","Deutsch + Englisch C1","Online Assessment (numerical + verbal)","Tech-Affinität gern gesehen (Accenture = größter Tech-Consultant)","Weniger kompetitiv als MBB, aber guter Einstieg"],required:{uni:17,gpa:15,praktika:10,lang:10,skills:5},medianGpa:1.7,medianPrak:"Industrie / IT",medianLang:"C1", salaryMonth:2400, salaryY1:78000, conversion:75, hours:55, currency:"EUR"},
{id:"mon_ffm", firm:"Monitor Deloitte",    short:"MON",role:"Praktikant Monitor Deloitte Strategy",                type:"MBB", tier:"MBB", loc:"Frankfurt",  region:"D",    year:2026, deadline:"2026-08-31", start:"Laufend",    duration:"3 Monate Praktikant",                 apps:620, avgScore:68, spots:10, acceptRate:1.6,  url:"https://www.deloitte.com/de/de/careers.html",                 department:"Monitor Deloitte – Strategy",            abteilung:"Corporate Strategy · PE Advisory",        firmDesc:"Monitor Deloitte – Strategy-Arm von Deloitte. 2013 Akquisition von Monitor Group. Gute Brücke zwischen Strategy und Deloitte Financial Advisory. Hohe Präsenz im deutschen Mittelstand.",aufgaben:["Strategieprojekte","M&A/PE-Unterstützung","Marktanalysen"],anforderungen:["Bachelor ab 3. Semester oder Master","Note ≤1,9","Target / Semi-Target: WHU, Mannheim, FS, Goethe, LMU, TUM","Case-Interview (2 Runden)","1+ Praktikum (Beratung, Industrie, Finance)","Deutsch + Englisch C1","Monitor Deloitte ist Strategy-Arm von Deloitte (Big 4)","Weniger selektiv als MBB, solide Case-Preparation nötig","Gute Transfer-Optionen zu Deloitte TAS/Audit"],required:{uni:18,gpa:16,praktika:11,lang:10,skills:5},medianGpa:1.6,medianPrak:"Industrie / Big 4",medianLang:"C1", salaryMonth:2500, salaryY1:80000, conversion:72, hours:55, currency:"EUR"},
{id:"adl_ffm", firm:"Arthur D. Little",    short:"ADL",role:"Praktikant Management Consultant",                           type:"MBB", tier:"MBB", loc:"Frankfurt",  region:"D",    year:2026, deadline:"2026-07-31", start:"Laufend",    duration:"3-6 Monate Praktikant",                 apps:380, avgScore:65, spots:8,  acceptRate:2.1,  url:"https://www.adlittle.com/en/career",                  department:"Strategy & Innovation",                  abteilung:"Tech · Industrials · Automotive",         firmDesc:"Arthur D. Little – älteste Strategieberatung der Welt (gegründet 1886), mit starkem Technologie- und Innovation-Fokus. Frankfurter Büro klein, hohe Projektvielfalt in Automotive, Healthcare, Energy.",aufgaben:["Innovations-Projekte","Tech-Strategien","Klienten-Präsentationen"],anforderungen:["Bachelor 3.+ Semester oder Master","Note ≤2,0","Target / Semi-Target","Case-Interview (1-2 Runden)","1 Praktikum hilfreich","Deutsch + Englisch C1","ADL hat starken Innovation/Technology-Fokus","Kleineres Team – schnelle Verantwortung","Bekannt für Innovation Consulting und Deep-Tech"],required:{uni:17,gpa:15,praktika:10,lang:10,skills:5},medianGpa:1.7,medianPrak:"Industrie / IT",medianLang:"C1", salaryMonth:2400, salaryY1:78000, conversion:70, hours:55, currency:"EUR"},
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
          <div key={s.l} style={{background:C.card,border:`0.5px solid ${C.faint}`,padding:"7px 8px",textAlign:"center"}}>
            <div style={{fontFamily:mono,fontSize:9,color:C.dim,marginBottom:3,letterSpacing:"0.08em"}}>{s.l}</div>
            <div style={{fontFamily:mono,fontSize:9,color:s.c,fontWeight:700}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{background:C.card,border:`0.5px solid ${C.faint}`,padding:"10px 11px",marginBottom:8}}>
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
      <div style={{background:C.card,border:`0.5px solid ${C.faint}`,padding:"9px 11px",marginBottom:8}}>
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
  const [mobileView,setMobileView]=useState("list");
  const [windowWidth,setWindowWidth]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{const h=()=>setWindowWidth(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);
  const isMobile=windowWidth<768;
  const [time,setTime]=useState(new Date());
  const STEPS=["HOCHSCHULE","ABSCHLUSS & NOTE","PRAKTIKA","SPRACHEN","SKILLS & EXTRAS"];

  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t);},[]);

  const sc=calcScore(profile);
  const setP=u=>setProfile(p=>({...p,...u}));

  /* Only seed data (live search removed) */
  const allJobs=SEED;

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
  const nDACH=allJobs.filter(j=>j.region==="D").length;
  const nCH=allJobs.filter(j=>j.region==="CH").length;
  const nLDN=allJobs.filter(j=>j.region==="LDN").length;
  const nIB=allJobs.filter(j=>j.type==="IB").length;
  const nPE=allJobs.filter(j=>j.type==="PE").length;
  const nPC=allJobs.filter(j=>j.type==="PC").length;
  const nMBB=allJobs.filter(j=>j.type==="MBB").length;

  /* ── Questionnaire ── */
  if(view==="questionnaire")return(
    <div style={{fontFamily:sans,background:C.bg,color:C.text}}>
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
    <div style={{fontFamily:sans,background:C.bg,color:C.text}}>

      {/* ① TOP BAR */}
      <div style={{background:C.bg,borderBottom:`0.5px solid ${C.border}`,padding:"6px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontFamily:mono,fontSize:isMobile?13:10,color:C.orange,letterSpacing:"0.16em",fontWeight:700}}>PIPELINE</span>
          {!isMobile&&<><div style={{width:1,height:14,background:C.border}}/>
          <span style={{fontFamily:mono,fontSize:9,color:C.dim,letterSpacing:"0.06em"}}>CAREER INTELLIGENCE  ·  IB · PE · PC · MBB  ·  DACH · ZRH · LDN</span></>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {profileDone&&<span style={{fontFamily:mono,fontSize:9,color:C.green,letterSpacing:"0.06em"}}>SCORE: {sc.total}/100</span>}
          {!isMobile&&<span style={{fontFamily:mono,fontSize:10,color:C.dim}}>{time.toLocaleTimeString("de-DE")}</span>}
          <button onClick={()=>setView("questionnaire")} style={{padding:"4px 10px",background:C.orangeDim,border:`0.5px solid ${C.orange}`,color:C.orange,fontFamily:mono,fontSize:isMobile?10:10,cursor:"pointer",letterSpacing:"0.06em"}}>{profileDone?"PROFIL":"PROFIL ▶"}</button>
        </div>
      </div>

      {/* ② COCKPIT DASHBOARD – 4 focused KPIs */}
      <div style={{background:C.panel,borderBottom:`0.5px solid ${C.border}`,padding:"10px 14px",overflowX:isMobile?"auto":"visible"}}>
        <div style={{display:"flex",gap:8,minWidth:isMobile?"500px":"auto"}}>
          <KpiCard label="ALLE STELLEN" value={allJobs.length} color={C.text}/>
          <KpiCard label="MATCH ≥ 75%" value={profileDone?allJobs.filter(j=>matchPct(j.required,sc)>=75).length:"–"} sub={profileDone?"Für dich passend":"Profil erstellen"} color={C.green}/>
          <KpiCard label="DEADLINE < 14d" value={allJobs.filter(j=>{const d=daysLeft(j.deadline);return d<14&&d<999;}).length} sub="Dringend bewerben" color={C.red}/>
          {profileDone?<KpiCard label="MEIN SCORE" value={`${sc.total}`} sub={sc.total>=70?"Konkurrenzfähig":sc.total>=50?"Solides Profil":"Aufbaupotenzial"} color={sc.total>=70?C.green:sc.total>=50?C.amber:C.red}/>:<KpiCard label="START 2027" value={n27} sub="Früh bewerben" color={C.amber}/>}
        </div>
      </div>

      {/* ③ FILTER + SORT BAR */}
      <div style={{background:C.bg,borderBottom:`0.5px solid ${C.border}`,padding:"0 12px",display:"flex",justifyContent:"space-between",alignItems:"stretch",overflowX:isMobile?"auto":"visible"}}>
        <div style={{display:"flex",flexShrink:0}}>
          {[["ALL","ALLE"],["IB","IB"],["PE","PE"],["PC","CREDIT"],["MBB","BERATUNG"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFT(v)} style={{padding:"9px 11px",background:"transparent",border:"none",borderBottom:`2px solid ${filterType===v?C.orange:"transparent"}`,color:filterType===v?C.orange:C.dim,fontFamily:mono,fontSize:isMobile?11:10,cursor:"pointer",letterSpacing:"0.08em",whiteSpace:"nowrap"}}>
              {l}
            </button>
          ))}
          <div style={{width:1,background:C.border,margin:"8px 6px"}}/>
          {[["ALL","ALLE"],["D","D"],["CH","ZRH"],["LDN","LDN"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFR(v)} style={{padding:"9px 11px",background:"transparent",border:"none",borderBottom:`2px solid ${filterRegion===v?C.orange:"transparent"}`,color:filterRegion===v?C.orange:C.dim,fontFamily:mono,fontSize:isMobile?11:10,cursor:"pointer",letterSpacing:"0.08em",whiteSpace:"nowrap"}}>
              {l}
            </button>
          ))}
        </div>
        {!isMobile&&<div style={{display:"flex",alignItems:"center",gap:3,padding:"7px 0"}}>
          <span style={{fontFamily:mono,fontSize:9,color:C.dim,marginRight:5}}>SORT:</span>
          {[["deadline","DEADLINE"],["year","JAHR"],["name","A–Z"],["match","MATCH"]].map(([v,l])=>(
            <button key={v} onClick={()=>setSort(v)} style={{padding:"4px 8px",fontFamily:mono,fontSize:9,letterSpacing:"0.06em",background:sortBy===v?C.orangeDim:"transparent",border:`0.5px solid ${sortBy===v?C.orange:C.faint}`,color:sortBy===v?C.orange:C.dim,cursor:"pointer"}}>
              {l}
            </button>
          ))}
          <span style={{fontFamily:mono,fontSize:10,color:C.dim,marginLeft:8}}>{filtered.length} STELLEN</span>
        </div>}
        {isMobile&&<div style={{display:"flex",alignItems:"center",gap:3,padding:"5px 0",flexShrink:0}}>
          {[["deadline","DEAD"],["name","A–Z"],["match","MATCH"]].map(([v,l])=>(
            <button key={v} onClick={()=>setSort(v)} style={{padding:"4px 7px",fontFamily:mono,fontSize:9,background:sortBy===v?C.orangeDim:"transparent",border:`0.5px solid ${sortBy===v?C.orange:C.faint}`,color:sortBy===v?C.orange:C.dim,cursor:"pointer"}}>
              {l}
            </button>
          ))}
        </div>}
      </div>

      {/* ④ MAIN LAYOUT – responsive */}
      {isMobile ? (
        <div style={{background:C.bg}}>
          {/* Mobile: list view */}
          {mobileView==="list"&&(
            <div style={{overflowY:"auto",maxHeight:"calc(100vh - 200px)"}}>
              {filtered.map(j=>{
                const dl=daysLeft(j.deadline),urgent=dl<14&&dl<999;
                const regionColor={D:C.blue,CH:C.amber,LDN:C.green}[j.region]||C.muted;
                return(
                  <div key={j.id} onClick={()=>{setSelJob(j);setMobileView("detail");}} style={{padding:"12px 14px",borderBottom:`0.5px solid ${C.faint}`,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:sans,fontSize:14,color:C.text,fontWeight:500,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.firm}</div>
                      <div style={{fontFamily:sans,fontSize:11,color:C.muted,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.role}</div>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <span style={{fontFamily:mono,fontSize:9,padding:"1px 5px",border:`0.5px solid ${regionColor}`,color:regionColor}}>{j.region}</span>
                        <span style={{fontFamily:mono,fontSize:9,color:C.dim}}>{j.type}</span>
                        <span style={{fontFamily:mono,fontSize:9,color:urgent?C.red:dl===999?C.dim:C.amber}}>{dl===999?"–":dl===0?"HEUTE":dl+"d"}</span>
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      {j.matchScore!=null&&<div style={{fontFamily:mono,fontSize:16,color:j.matchScore>=75?C.green:j.matchScore>=50?C.amber:C.red,fontWeight:700}}>{j.matchScore}%</div>}
                      <div style={{fontFamily:mono,fontSize:9,color:C.dim}}>→</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* Mobile: detail view */}
          {mobileView==="detail"&&job&&(
            <div style={{overflowY:"auto",maxHeight:"calc(100vh - 200px)"}}>
              <button onClick={()=>setMobileView("list")} style={{width:"100%",padding:"10px 14px",background:C.panel,border:"none",borderBottom:`0.5px solid ${C.border}`,color:C.orange,fontFamily:mono,fontSize:10,cursor:"pointer",textAlign:"left",letterSpacing:"0.06em"}}>
                ← ALLE STELLEN
              </button>
              <div style={{padding:14}}>
                <div style={{fontFamily:mono,fontSize:13,color:C.orange,fontWeight:700,marginBottom:2}}>{job.firm.toUpperCase()}</div>
                <div style={{fontFamily:sans,fontSize:13,color:C.text,marginBottom:8}}>{job.role}</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
                  {job.tier&&job.tier!=="–"&&<Pill>{TIER_LABEL[job.tier]||job.tier}</Pill>}
                  <Pill c={C.cyan} bg={C.blueDim}>{job.type}</Pill>
                  <Pill c={C.muted} bg={C.faint}>{job.loc}</Pill>
                  <Pill c={job.year===2026?C.green:C.amber} bg={job.year===2026?C.greenDim:C.amberDim}>Start {job.year}</Pill>
                </div>
                <div style={{background:C.card,border:`0.5px solid ${C.faint}`,padding:"10px 12px",marginBottom:8}}>
                  <div style={{fontFamily:mono,fontSize:9,color:C.dim,letterSpacing:"0.1em",marginBottom:4}}>ORT · START · DAUER</div>
                  <div style={{fontFamily:sans,fontSize:13,color:C.text}}>{job.loc} · {job.start} · {job.duration}</div>
                </div>
                <div style={{background:C.card,border:`0.5px solid ${C.faint}`,padding:"10px 12px",marginBottom:8}}>
                  <div style={{fontFamily:mono,fontSize:9,color:C.dim,letterSpacing:"0.1em",marginBottom:6}}>ÜBER DAS UNTERNEHMEN</div>
                  <div style={{fontFamily:sans,fontSize:12,color:C.muted,lineHeight:1.6}}>{job.firmDesc}</div>
                </div>
                <div style={{background:C.card,border:`0.5px solid ${C.faint}`,padding:"10px 12px",marginBottom:8}}>
                  <div style={{fontFamily:mono,fontSize:9,color:C.dim,letterSpacing:"0.1em",marginBottom:6}}>AUFGABEN</div>
                  {job.aufgaben.map((a,i)=><div key={i} style={{display:"flex",gap:6,marginBottom:4}}><span style={{color:C.orange,flexShrink:0}}>▸</span><span style={{fontFamily:sans,fontSize:12,color:C.muted,lineHeight:1.5}}>{a}</span></div>)}
                </div>
                <div style={{background:C.card,border:`0.5px solid ${C.faint}`,padding:"10px 12px",marginBottom:8}}>
                  <div style={{fontFamily:mono,fontSize:9,color:C.dim,letterSpacing:"0.1em",marginBottom:6}}>ANFORDERUNGEN</div>
                  {job.anforderungen.map((a,i)=><div key={i} style={{display:"flex",gap:6,marginBottom:4}}><span style={{color:C.green,flexShrink:0}}>✓</span><span style={{fontFamily:sans,fontSize:12,color:C.muted,lineHeight:1.5}}>{a}</span></div>)}
                </div>
                <CompPanel job={job} sc={sc} done={profileDone}/>
                <a href={job.url} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px",background:C.orangeDim,border:`0.5px solid ${C.orange}`,color:C.orange,fontFamily:mono,fontSize:11,cursor:"pointer",letterSpacing:"0.1em",textDecoration:"none",marginTop:8}}>
                  ↗ JETZT BEWERBEN — {job.firm}
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
      <div style={{display:"grid",gridTemplateColumns:"300px 1fr 260px",gap:1,background:C.border,minHeight:520}}>

        {/* LEFT – job list */}
        <div style={{background:C.bg,overflowY:"auto",maxHeight:560}}>
          {filtered.map(j=>{
            const sel=j.id===job?.id,dl=daysLeft(j.deadline),urgent=dl<14&&dl<999;
            const matchColor=j.matchScore>=75?C.green:j.matchScore>=50?C.amber:C.red;
            return(
              <div key={j.id} onClick={()=>{setSelJob(j);if(isMobile)setMobileView("detail");}} style={{padding:"14px 16px",borderBottom:`0.5px solid ${C.faint}`,background:sel?"rgba(255,107,0,0.06)":"transparent",cursor:"pointer",borderLeft:`2px solid ${sel?C.orange:"transparent"}`,transition:"all 0.15s",display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{flex:1,minWidth:0}}>
                  {/* Firm name – editorial serif */}
                  <div style={{fontFamily:serif,fontSize:14,color:sel?C.orange:C.text,fontWeight:500,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",lineHeight:1.25}}>
                    {j.firm}
                  </div>
                  {/* Role – sans secondary */}
                  <div style={{fontFamily:sans,fontSize:11,color:C.muted,marginBottom:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",lineHeight:1.3}}>{j.role}</div>
                  {/* Meta row */}
                  <div style={{display:"flex",gap:10,alignItems:"center",fontFamily:mono,fontSize:9,color:C.dim,letterSpacing:"0.04em"}}>
                    <span>{j.loc} ({j.region})</span>
                    <span style={{color:C.faint}}>•</span>
                    <span>{j.type}</span>
                    <span style={{color:C.faint}}>•</span>
                    <span style={{color:urgent?C.red:dl===999?C.dim:C.muted}}>{dl===999?"offen":dl===0?"HEUTE":dl+"d"}</span>
                  </div>
                </div>
                {/* Match score circle */}
                {j.matchScore!=null&&(
                  <div style={{flexShrink:0,width:44,height:44,borderRadius:"50%",border:`1.5px solid ${matchColor}`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
                    <span style={{fontFamily:mono,fontSize:13,color:matchColor,fontWeight:700,lineHeight:1}}>{j.matchScore}</span>
                    <span style={{fontFamily:mono,fontSize:6,color:matchColor,letterSpacing:"0.1em",marginTop:1}}>MATCH</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CENTER – detail */}
        <div style={{background:C.bg,overflowY:"auto",maxHeight:560}}>
          {job&&(
            <div style={{padding:"18px 16px"}}>
              {/* Editorial Header */}
              <div style={{marginBottom:16,paddingBottom:14,borderBottom:`0.5px solid ${C.faint}`}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <span style={{fontFamily:mono,fontSize:9,color:C.orange,letterSpacing:"0.1em",fontWeight:600}}>{job.type}{job.tier&&job.tier!=="–"?` · ${TIER_LABEL[job.tier]||job.tier}`:""}</span>
                  <span style={{color:C.faint}}>•</span>
                  <span style={{fontFamily:mono,fontSize:9,color:C.muted,letterSpacing:"0.06em"}}>{job.loc.toUpperCase()} ({job.region})</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",gap:14}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:serif,fontSize:22,color:C.text,fontWeight:500,marginBottom:6,lineHeight:1.2}}>{job.firm}</div>
                    <div style={{fontFamily:sans,fontSize:13,color:C.muted,lineHeight:1.4}}>{job.role}</div>
                  </div>
                  {job.matchScore!=null&&(
                    <div style={{flexShrink:0,width:60,height:60,borderRadius:"50%",border:`2px solid ${job.matchScore>=75?C.green:job.matchScore>=50?C.amber:C.red}`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
                      <span style={{fontFamily:mono,fontSize:17,color:job.matchScore>=75?C.green:job.matchScore>=50?C.amber:C.red,fontWeight:700,lineHeight:1}}>{job.matchScore}</span>
                      <span style={{fontFamily:mono,fontSize:7,color:job.matchScore>=75?C.green:job.matchScore>=50?C.amber:C.red,letterSpacing:"0.12em",marginTop:2}}>MATCH</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Apply Button – TOP */}
              <a href={job.url} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"13px",background:C.orange,border:`1px solid ${C.orange}`,color:"#FFF",fontFamily:sans,fontSize:12,cursor:"pointer",letterSpacing:"0.08em",textDecoration:"none",fontWeight:600,marginBottom:14}}>
                JETZT BEWERBEN  →
              </a>

              {/* Meta Grid – cleaner 2x2 */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                <div style={{background:C.card,border:`0.5px solid ${C.faint}`,padding:"10px 12px"}}>
                  <div style={{fontFamily:mono,fontSize:8,color:C.dim,letterSpacing:"0.12em",marginBottom:4}}>BEREICH</div>
                  <div style={{fontFamily:sans,fontSize:12,color:C.text,fontWeight:500,marginBottom:3,lineHeight:1.3}}>{job.department}</div>
                  <div style={{fontFamily:sans,fontSize:11,color:C.muted,lineHeight:1.4}}>{job.abteilung}</div>
                </div>
                <div style={{background:C.card,border:`0.5px solid ${C.faint}`,padding:"10px 12px"}}>
                  <div style={{fontFamily:mono,fontSize:8,color:C.dim,letterSpacing:"0.12em",marginBottom:4}}>START · DAUER</div>
                  <div style={{fontFamily:sans,fontSize:12,color:C.text,fontWeight:500,marginBottom:3,lineHeight:1.3}}>{job.start}</div>
                  <div style={{fontFamily:sans,fontSize:11,color:C.muted,lineHeight:1.4}}>{job.duration}</div>
                </div>
              </div>

              {/* KPIs – Selectivity (existing) */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:6}}>
                {[
                  {l:"SPOTS",v:job.spots||"k.A.",c:C.text},
                  {l:"BEWERBER",v:job.apps?.toLocaleString?.("de-DE")||"–",c:C.text},
                  {l:"ACCEPT RATE",v:job.acceptRate?`${job.acceptRate.toFixed(1)}%`:"k.A.",c:!job.acceptRate?C.muted:job.acceptRate<0.5?C.red:job.acceptRate<1.5?C.amber:C.green},
                  {l:"DEADLINE",v:job.deadline?(daysLeft(job.deadline)===0?"HEUTE":daysLeft(job.deadline)+"d"):"offen",c:!job.deadline?C.dim:daysLeft(job.deadline)<14?C.red:C.amber},
                ].map(k=>(
                  <div key={k.l} style={{background:C.panel,border:`0.5px solid ${C.border}`,padding:"7px 9px"}}>
                    <div style={{fontFamily:mono,fontSize:9,color:C.dim,marginBottom:3,letterSpacing:"0.1em"}}>{k.l}</div>
                    <div style={{fontFamily:mono,fontSize:11,color:k.c,fontWeight:600}}>{k.v}</div>
                  </div>
                ))}
              </div>

              {/* KPIs – Gehalt & Karriere (neu) */}
              {(() => {
                const curSym = job.currency==="CHF"?"CHF ":job.currency==="GBP"?"£":"€";
                const curSuffix = job.currency==="CHF"?"":job.currency==="GBP"?"":"";
                return (
                <>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:12}}>
                {[
                  {l:"PRAKTIKUM",v:job.salaryMonth?`${curSym}${job.salaryMonth.toLocaleString("de-DE")}/Mon.`:"k.A.",c:C.text,sub:"Bruttogehalt"},
                  {l:"FESTANSTELL.",v:job.salaryY1?`${curSym}${(job.salaryY1/1000).toFixed(0)}k/J.`:"k.A.",c:C.text,sub:"Year 1 Base"},
                  {l:"ÜBERNAHME",v:job.conversion?`${job.conversion}%`:"k.A.",c:!job.conversion?C.muted:job.conversion>=70?C.green:job.conversion>=55?C.amber:C.red,sub:"Praktikum → Full-time"},
                  {l:"STUNDEN",v:job.hours?`${job.hours}h/Wo.`:"k.A.",c:!job.hours?C.muted:job.hours>=80?C.red:job.hours>=65?C.amber:C.green,sub:"Durchschnitt"},
                ].map(k=>(
                  <div key={k.l} style={{background:C.panel,border:`0.5px solid ${C.border}`,padding:"7px 9px"}}>
                    <div style={{fontFamily:mono,fontSize:9,color:C.dim,marginBottom:3,letterSpacing:"0.1em"}}>{k.l}</div>
                    <div style={{fontFamily:mono,fontSize:11,color:k.c,fontWeight:600,marginBottom:1}}>{k.v}</div>
                    <div style={{fontFamily:sans,fontSize:9,color:C.dim}}>{k.sub}</div>
                  </div>
                ))}
                </div>
                </>
                );
              })()}
              <div style={{fontFamily:sans,fontSize:9,color:C.dim,fontStyle:"italic",marginBottom:12,lineHeight:1.4}}>Gehalt, Übernahmequote und Arbeitsstunden sind Schätzungen basierend auf öffentlichen Quellen und Marktdaten.</div>

              {/* Firm desc */}
              <div style={{background:C.card,border:`0.5px solid ${C.faint}`,padding:"9px 11px",marginBottom:7}}>
                <div style={{fontFamily:mono,fontSize:9,color:C.muted,letterSpacing:"0.1em",marginBottom:5}}>ÜBER DAS UNTERNEHMEN</div>
                <div style={{fontFamily:sans,fontSize:9,color:C.muted,lineHeight:1.6}}>{job.firmDesc}</div>
              </div>

              {/* Tasks */}
              <div style={{background:C.card,border:`0.5px solid ${C.faint}`,padding:"9px 11px",marginBottom:7}}>
                <div style={{fontFamily:mono,fontSize:9,color:C.muted,letterSpacing:"0.1em",marginBottom:6}}>AUFGABEN</div>
                {job.aufgaben.map((a,i)=>(
                  <div key={i} style={{display:"flex",gap:6,marginBottom:3,alignItems:"flex-start"}}>
                    <span style={{fontFamily:mono,fontSize:10,color:C.orange,flexShrink:0,marginTop:1}}>▸</span>
                    <span style={{fontFamily:sans,fontSize:9,color:C.muted,lineHeight:1.5}}>{a}</span>
                  </div>
                ))}
              </div>

              {/* Requirements */}
              <div style={{background:C.card,border:`0.5px solid ${C.faint}`,padding:"9px 11px",marginBottom:7}}>
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
                <div style={{background:C.card,border:`0.5px solid ${C.faint}`,padding:"9px 11px",marginBottom:7}}>
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

            </div>
          )}
        </div>

        {/* RIGHT – competitor */}
        <div style={{background:C.bg,overflowY:"auto",maxHeight:560}}>
          {job&&<CompPanel job={job} sc={sc} done={profileDone}/>}
        </div>
      </div>
      )} {/* end responsive ternary */}

      {/* ⑤ STATUS BAR */}
      <div style={{background:C.panel,borderTop:`0.5px solid ${C.border}`,padding:"4px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:4}}>
        <div style={{display:"flex",gap:12}}>
          {[["IB",nIB,C.blue],["PE",nPE,C.green],["PC",nPC,C.purple],["MBB",nMBB,C.amber]].map(([t,n,c])=>(
            <span key={t} style={{fontFamily:mono,fontSize:9,color:C.dim}}>{t}: <span style={{color:c}}>{n}</span></span>
          ))}
          <span style={{fontFamily:mono,fontSize:9,color:C.dim}}>2026: <span style={{color:C.green}}>{n26}</span></span>
          <span style={{fontFamily:mono,fontSize:9,color:C.dim}}>2027: <span style={{color:C.amber}}>{n27}</span></span>
        </div>
        <div style={{display:"flex",gap:10}}>
          <span style={{fontFamily:mono,fontSize:9,color:C.dim}}>D: {nDACH}  ·  ZRH: {nCH}  ·  LDN: {nLDN}</span>
          <span style={{fontFamily:mono,fontSize:9,color:C.dim}}>·  PIPELINE v4.0  ·  Auto-Refresh 30 Min</span>
        </div>
      </div>
    </div>
  );
}
