# EcoBubble — sito ecobubble.it

Sito vetrina di EcoBubble S.r.l. come **Intelligence Module Foundry**: costruttore di moduli di
intelligenza artificiale per **ambiente e territorio** (verde/Bio-Driven + Geo-Driven di qualsiasi
tipo). Vende i motori resi governabili (misurabili, auditabili, certificabili), non il verticale.

PIVOT 2026-07-05 (decisione Nicola): supera la precedente bozza "vetrina servizi Tier-0". EcoBubble
NON è un aggregatore delle controllate: Ennous ORCHESTRA i modelli, EcoBubble li FABBRICA;
Plantiverse/GreenEazy sono verticali-clienti nel portfolio. Vetrina costruita da asset reali
(modulo Flora+Phyto live, banco di prova ~90 motori, architetture Bio-Driven+Geo-Driven).
Foto vecchio Webflow salvate in `assets/old-site/` (FAO rooftop, MAXXI) per la sezione track-record.
La landing Meta-Intelligence che era su ecobubble.it vive ora su https://ennous.it.

## Struttura

- `index.html` — pagina unica, self-contained (HTML/CSS/JS inline, canvas hero, configuratore fitorimedio)
- `404.html`, `robots.txt`, `sitemap.xml`

## Deploy previsto

GitHub Pages con custom domain `www.ecobubble.it` (NS Aruba).
Stato DNS al 2026-06-26: `www` già CNAME → `nicolaplantiverse.github.io`; apex ancora sul vecchio Webflow (75.2.70.75 / 99.83.190.102).
Passi: creare repo → push → Pages on → attendere apex A 185.199.108-111.153 su Aruba → custom domain + Enforce HTTPS.
Webflow: rimuovere i domini dal vecchio progetto (Site ID 65cce294e2d8e70958f11936), senza cancellarlo.

## Contatti nel sito

- `info@ecobubble.it` (mailto CTA)
- Calendly: `calendly.com/nicola-nescatelli/30min`
