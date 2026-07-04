# EcoBubble — sito ecobubble.it

Sito vetrina della holding EcoBubble S.r.l., orientato ai servizi che fatturano (Tier 0):
installazioni multispettrali chiavi in mano, progettazione verde + fitorimedio, piloti
Meta-Intelligence (Ennous), licensing brevetti.

Sostituisce il vecchio sito Webflow (obsoleto). La landing Meta-Intelligence che era su
ecobubble.it vive ora su https://ennous.it (decisione 2026-06-29).

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
