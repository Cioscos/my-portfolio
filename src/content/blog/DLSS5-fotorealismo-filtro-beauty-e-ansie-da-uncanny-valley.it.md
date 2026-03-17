---
title: "DLSS 5: fotorealismo, filtro beauty e ansie da uncanny valley"
date: "2026-03-17"
excerpt: "NVIDIA promette un salto di fotorealismo con DLSS 5, ma le prime demo sollevano dubbi su art direction, uncanny valley e requisiti hardware."
tags: ["nvidia", "dlss5", "ray tracing", "ai", "pc-gaming"]
readTime: 8
---

## Cos'è realmente DLSS 5?

NVIDIA ha presentato DLSS 5 al GTC 2026 come "la svolta più significativa nella grafica in tempo reale dai tempi del ray tracing" del 2018, definendolo un modello di neural rendering in tempo reale che "infonde i pixel di illuminazione e materiali fotorealistici" per colmare il divario tra rendering e realtà.[^1][^2]
A differenza delle versioni precedenti, che ruotavano principalmente attorno a upscaling, frame generation e ray reconstruction, DLSS 5 sposta l'ago della bilancia: la GPU non si limita più a ricostruire una risoluzione più alta, ma delega a una rete neurale una parte consistente dell'aspetto finale dell'immagine (materiali, luci, micro-dettagli).[^3][^4][^2]
Secondo NVIDIA, il sistema prende in ingresso colore e motion vectors di ogni frame e, sfruttando un modello addestrato end‑to‑end, applica a runtime illuminazione fotorealistica e materiali coerenti, funzionando fino al 4K in tempo reale sulle future RTX 50‑series.[^5][^2][^3]

## Dal supersampling alla neural rendering mode

Quando DLSS è arrivato nel 2018, l'idea era semplice: renderizzare a una risoluzione più bassa e usare una rete neurale per risalire a un frame "ideale", guadagnando framerate senza perdere troppa qualità.[^2][^3]
Con DLSS 3 e 4, il sistema ha iniziato a generare interi frame aggiuntivi e a ricostruire i raggi del ray tracing, tanto che con DLSS 4.5 NVIDIA dichiara che 23 pixel su 24 sullo schermo vengono disegnati dall'IA invece che dal rendering tradizionale.[^6][^2]
DLSS 5 spinge ancora oltre: qui il focus non è più solo la risoluzione apparente, ma la trasformazione del look & feel complessivo, dalle superfici metalliche alla pelle fino alle foglie degli alberi, con una sorta di "AI lighting/materials pass" che si aggiunge alla pipeline classica.[^4][^3][^5]

## Il fascino (e il problema) del filtro beauty

Il primo impatto delle demo è ipnotico: personaggi che sembrano usciti da un film, pelle più morbida, riflessi più credibili, capelli più voluminosi; in alcuni casi il salto rispetto alla versione "liscia" del gioco ricorda il passaggio da una foto raw ad uno scatto pesantemente ritoccato.[^7][^4]
Non a caso, molta stampa ha descritto DLSS 5 come una sorta di "beauty filter" applicato all'intera scena: Polygon parla esplicitamente di effetto "Snapchat filter" su volti e materiali, dove ogni personaggio sembra rielaborato secondo uno standard estetico da IA più che secondo l'art direction originale.[^8][^5]
Digital Foundry sottolinea che il modello è semantic‑aware (riconosce pelle, capelli, acqua, metallo, tessuti e li tratta in modo diverso), ma proprio questa consapevolezza può portare a un'omologazione stilistica: facce e materiali che iniziano ad assomigliarsi da gioco a gioco, come se fossero passati tutti dallo stesso tool di photobashing neurale.[^9][^10][^3]

## Grace, Leon e l'uncanny valley in tempo reale

Una delle sequenze più discusse delle preview riguarda Grace, un personaggio mostrato in condizioni di luce complessa, dove il modello DLSS 5 sembra "prendersi libertà" sui lineamenti fino a farla somigliare a un volto AI generico, più che alla versione voluta dai character artist.[^11][^5]
Al contrario, Leon in Resident Evil Requiem regge molto meglio il trattamento: il modello è estremamente dettagliato di suo e le cutscene hanno inquadrature e luci relativamente controllate, condizioni in cui la rete neurale può lavorare con più segnali e tende a rispettare maggiormente le feature originali.[^3][^9][^11]
In pratica si ottiene una uncanny valley dinamica: in certe angolazioni o lighting setup i volti risultano credibili, in altre il modello "generalizza" e restituisce una faccia plausibile ma non fedele, con microvariazioni frame‑to‑frame che fanno sembrare l'espressione leggermente diversa a ogni cambio di camera.[^10][^8][^5]

## Illuminazione 2.0 o "AI enhanced" toggle?

Sul piano tecnico, NVIDIA insiste molto sul tema dell'illuminazione: DLSS 5 viene descritto come un modo per ottenere luci, ombre e materiali più naturali non solo nei titoli path‑traced, ma anche in giochi raster o con semplice ray tracing ibrido.[^5][^2][^3]
Le anteprime notano miglioramenti notevoli nella gestione di foliage, superfici semi‑traslucide e materiali complessi: foglie, acqua, metalli e tessuti reagiscono in modo più coerente alle sorgenti luminose, con meno shimmering e più profondità di campo percepita rispetto al solo path tracing.[^4][^9][^3]
Guardando i confronti, però, è difficile separare la componente "illuminazione 2.0" dall'effetto filtro: l'intero frame viene riallenato verso un certo look, spesso più luminoso, contrastato e "cinematico", al punto che ha senso parlare più di una modalità AI‑enhanced on/off che di un semplice upgrade di lighting.[^8][^4][^5]

## Requisiti hardware e il nodo delle due GPU

Un altro tema caldo è l'hardware: nelle sessioni a porte chiuse alcuni demo di DLSS 5 giravano con due RTX 5090, una dedicata al gioco e una al modello di neural rendering, configurazione che ovviamente non rappresenta lo scenario reale per la maggior parte dei giocatori.[^9][^11]
Digital Foundry e NVIDIA chiariscono che l'obiettivo per il lancio, previsto per l'autunno 2026, è far girare DLSS 5 su una singola GPU consumer della serie RTX 50, anche se resta da vedere quali tagli di VRAM e quali configurazioni saranno effettivamente consigliate.[^2][^11][^9]
Nel frattempo, il messaggio implicito è chiaro: DLSS 5 è pensato come vetrina tecnologica per la nuova generazione high‑end, non come feature che si attiverà "gratis" sulle GPU entry‑level o sulle vecchie RTX con pochi gigabyte di memoria video.[^7][^3][^2]

## Art direction, controllo e responsabilità dei dev

La domanda centrale dietro tutto questo è quanto controllo avranno realmente gli sviluppatori su DLSS 5: NVIDIA parla di una tecnologia "ancorata al contenuto 3D sorgente" e coerente da frame a frame, ma non è ancora chiaro quanto sia parametrizzabile lo stile del modello e quanto invece sia un filtro relativamente opaco.[^3][^2]
Digital Foundry riporta che il modello è consapevole dei diversi tipi di materiali e oggetti presenti nella scena (pelle, capelli, metallo, acqua, tessuti) e che gli studi possono guidarne in parte il comportamento in fase di integrazione, ma non ci sono ancora dettagli pubblici su controlli granulari come pesi per classe di materiale o maschere di esclusione.[^9][^3]
Questo apre un potenziale conflitto tra art direction e tecnologia: se l'IA tende a "migliorare" volti, capelli o illuminazione andando oltre l'intento originale, il rischio è che lo stile di un gioco venga normalizzato verso un'estetica NVIDIA‑centrica, soprattutto se il marketing spingerà sulle modalità "DLSS 5 ON" come modo "corretto" per vedere il titolo.[^8][^5][^7]

## Modding, etica e possibili derive

Un altro fronte sottovalutato riguarda il modding: se DLSS 5 è in grado di far convergere i volti verso esempi iper‑realistici visti in training, combinare personaggi moddati con somiglianze vaghe a celebrità e un filtro di questo tipo potrebbe avvicinare pericolosamente i risultati a riproduzioni non autorizzate di persone reali.[^10][^5][^7]
La discussione online ha già toccato questo nervo scoperto, ipotizzando scenari in cui, al primo scandalo mediatico legato a una mod + DLSS 5, piattaforme come Steam Workshop o Nexus potrebbero essere spinte a regole molto più rigide su modelli e contenuti, con un impatto pesante sulla scena modding.
Qui non ci sono ancora fatti, solo possibilità, ma è significativo che già nelle anteprime emerga il tema della responsabilità condivisa tra chi fornisce il modello (NVIDIA), chi lo integra (developer) e chi produce contenuti sopra (community).[^10][^7][^3]

## Cosa aspettarsi nei prossimi anni

Nel breve periodo è probabile che DLSS 5 resti una feature di nicchia: pochi giochi supportati, GPU top di gamma richieste, tanta curiosità tecnica e altrettante discussioni su quanto questa "AI rendering mode" alteri l'identità visiva delle produzioni.[^2][^3][^9]
Se NVIDIA riuscirà davvero a portarlo su singola GPU con un profilo prestazionale ragionevole, e se fornirà agli studi strumenti chiari per decidere cosa l'IA può toccare e cosa no (volti in primis), DLSS 5 potrebbe evolvere da gimmick controverso a nuovo tassello della pipeline standard, soprattutto per la gestione avanzata di luci, materiali complessi e foliage.[^4][^3][^9]
La sensazione, guardando le demo, è di trovarsi davanti a un momento "pivot" simile ai primi esperimenti di ray tracing in tempo reale: oggi gli artefatti e l'effetto filtro fanno discutere, ma tra qualche anno il confine tra ciò che è shading fisicamente corretto e ciò che è hallucination dell'IA rischia di diventare sempre più sfumato.[^7][^8][^2]

## Una posizione personale, da giocatore e sviluppatore

Da giocatore PC è difficile non rimanere affascinati dall'idea di avere un interruttore che, in tempo reale, trasforma giochi conosciuti in versioni quasi cinematografiche, con luci più vive, materiali tangibili e volti a tratti indistinguibili da riprese dal vivo.[^1][^4]
Da sviluppatore, però, l'entusiasmo si mescola a una certa inquietudine: ogni layer "magico" che si inserisce fra motore e schermo è un nuovo spazio in cui il gioco può sfuggire di mano, sia in termini di performance (VRAM, latenza, compatibilità) sia di controllo sull'immagine finale e sul modo in cui il pubblico percepisce il lavoro artistico fatto a monte.[^11][^3][^9]
Forse la chiave sarà trattare DLSS 5 non come la versione "vera" del gioco, ma come una modalità opzionale, dichiaratamente sperimentale, con preset conservativi che rispettano silhouette e volti e preset più aggressivi per chi vuole spingere verso il fotorealismo a ogni costo; solo in quel compromesso tra controllo umano e libertà dell'IA questa tecnologia potrà davvero diventare un alleato, invece che un filtro invasivo calato dall'alto.[^5][^3][^7]

---

## References

1. [AI-Powered Breakthrough in Visual Fidelity for Games](https://www.youtube.com/watch?v=dJACkKbN-Eo) - NVIDIA DLSS 5, an AI-powered breakthrough in visual fidelity for games is coming later this year. DL...

2. [NVIDIA DLSS 5 Delivers AI-Powered Breakthrough In ...](https://www.nvidia.com/en-us/geforce/news/dlss5-breakthrough-in-visual-fidelity-for-games/) - NVIDIA DLSS 5 infuses pixels with photorealistic lighting and materials to bridge the gap between re...

3. [NVIDIA Unveils AI-Powered DLSS 5 Claiming 'Photorealism' This Year](https://80.lv/articles/nvidia-unveils-ai-powered-dlss-5-claiming-photorealism-coming-this-year) - Particularly impressive is how DLSS 5 handles light and shadow around foliage - something that's ver...

4. [Nvidia debuts DLSS 5 for increased visual fidelity in games](https://www.tomshardware.com/tech-industry/artificial-intelligence/nvidia-debuts-dlss-5-for-increased-visual-fidelity-in-games-ai-infused-tech-transforms-pixels-with-photorealistic-lighting-and-materials) - Nvidia debuts DLSS 5 for increased visual fidelity in games — AI-infused tech transforms pixels with...

5. [Nvidia has just shown off DLSS 5 coming this fall... and ... - PC Gamer](https://www.pcgamer.com/hardware/nvidia-has-just-shown-off-dlss-5-coming-this-fall-and-currently-it-looks-a-lot-like-an-ai-lighting-filter/) - A DLSS 5 demonstration showing Grace Ashcroft&#039;s AI-altered face. AI DLSS 5 clearly overwrites g...

6. [GeForce @ GDC 2026: 20 New DLSS 4.5 and Path-Traced ...](https://www.nvidia.com/en-us/geforce/news/gdc-2026-nvidia-geforce-rtx-announcements/) - GeForce @ GDC 2026: 20 New DLSS 4.5 and Path-Traced Games, DLSS 4.5 Dynamic Multi Frame Gen Availabl...

7. [DLSS 5 is a game-changer, but this first look is controversial](https://www.tweaktown.com/news/110501/dlss-5-is-a-game-changer-but-this-first-look-is-controversial/index.html) - At its core, DLSS 5 is a game-changer and the first look at the future of in-game visuals, aiming to...

8. [Nvidia's next-gen graphics tech will ruin your favorite game](https://www.polygon.com/nvidia-dlss-5-graphics-ai-filter-resident-evil-requiem-starfield/) - It's full of comparison shots that show what games like Resident Evil Requiem and Starfield would lo...

9. [Our First Look At Nvidia's Next-Gen Photo-Realistic Lighting](https://www.youtube.com/watch?v=4ZlwTtgbgVA) - Join the DF Supporter Program and support the team: https://bit.ly/3jEGjvx Coming in Fall 2026, Nivi...

10. [Hands-On With DLSS 5: Our First Look At Nvidia's Next-Gen Photo ...](https://www.reddit.com/r/nvidia/comments/1rvi0rb/handson_with_dlss_5_our_first_look_at_nvidias/) - Shadows, lighting, tone, and highlights are all really important ... But some of the faces are defin...

11. [NVIDIA DLSS 5 trasforma i personaggi dei giochi ...](https://multiplayer.it/notizie/nvidia-dlss-5-trasforma-personaggi-dei-giochi-rendendoli-reali-ecco-un-video.html) - NVIDIA DLSS 5 trasforma i personaggi dei giochi rendendoli reali, ecco un video. Digital Foundry ha ...

