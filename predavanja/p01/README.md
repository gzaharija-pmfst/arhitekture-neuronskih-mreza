# Arhitekture neuronskih mreža — P01 (Slidev)

Urediva prezentacija izrađena prema postojećem **Predavanju 01**, uz nužne sadržajne revizije i prilagodbu projekciji.

## Pokretanje

Potreban je **Node.js 20 ili noviji** i pristup npm repozitoriju pri prvom postavljanju.

```bash
npm install
npm run dev
```

Otvorite lokalnu adresu koju Slidev prikaže (obično http://localhost:3030).

Za izvoz u PDF nakon što se postave ovisnosti:

```bash
npm run export
```

Prezentacija nema vanjskih API poziva, ugrađenih web-fontova ni resursa koji se učitavaju s drugih web-stranica.

## Datoteke

- `slides.md` — 39 slajdova i nastavni tekst; uređuje se kao Markdown uz HTML za precizniji raspored.
- `style.css` — vizualni identitet, tipografija i layouti.
- `public/assets/texture.webp` — izvorna ilustrirana tekstura pozadine iz dostavljenog PDF-a.
- `manifest.json` — mapiranje novih slajdova na izvorni P01 (slajd 01–32).
- `P01-pregled.pdf` (zasebno uz zip) — statični pregled pripremljen kao rezervna verzija.

## Napomene

- Zadržani su plavo-crna teksturirana pozadina, bijeli naslovi i koraljno-crvena crta, ali 16:9 oblik i značajno veći tekst povećavaju čitljivost.
- Guste cjeline (primjerice matrica konfuzije i metrike) podijeljene su na više slajdova; ukupno je **39 slajdova**.
- Matematičke korekcije: linearni model nije opći ML model; `A·w≈b` je primjer, optimizacija je opisana funkcijom gubitka. Ispravljene su definicije vrsta učenja, generalizacije i klasifikacijskih metrika.
- U ovoj verziji nema zahtjevnih live-demonstracija, radi pouzdanosti neposredno prije predavanja. Dijagrami se mogu naknadno zamijeniti Vue komponentama u okviru Slideva.
- Statični PDF služi za vizualnu provjeru; za službeni PDF najbolje je koristiti Slidevov `npm run export` nakon instalacije.
- Originalni PDF poslužilo je kao polazište; konačne izmjene nisu doslovna transkripcija izvora.