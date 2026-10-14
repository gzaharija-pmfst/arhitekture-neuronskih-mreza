# Arhitekture neuronskih mreža — P01 (Slidev)

Urediva prezentacija izrađena prema postojećem **Predavanju 01**, uz nužne sadržajne revizije i prilagodbu projekciji.

## Pokretanje

Preduvjet je **Node.js 22.18.0 ili noviji** (preporuka: ažurirani Node.js 22 LTS ili noviji). Paket `ast-walker-scope` među neizravnim ovisnostima zahtijeva barem Node.js 22.18.0. Provjera:

```bash
node --version
npm --version
```

Ako `node --version` ispisuje 18.x, 20.x ili verziju 22 stariju od 22.18, najprije ažurirajte Node.js. `@slidev/cli` je zaključan na `53.0.0`, a tema na `0.25.0`.

Iz **korijena mape `predavanja/p01`** (ne iz korijena repozitorija):

```bash
npm install
npm run dev
```

Otvorite adresu koju Slidev ispiše (obično http://localhost:3030).

Provjera da se prezentacija može izgraditi:

```bash
npm run build
```

Izvoz u PDF:

```bash
npm run export
```

### Ako ste već pokrenuli `npm audit fix`

Prvo vratite izvorni `package.json` iz GitHuba (`git pull` odnosno `git restore package.json` ako ste ga samo lokalno izmijenili). Potom izbrišite lokalne `node_modules` i `package-lock.json` i instalirajte ponovno. U Bash/zsh terminalu:

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

Na Windowsu iste dvije stavke možete ukloniti kroz Explorer, zatim pokrenuti `npm install`.

`npm audit` prikazuje prijavljene sigurnosne probleme u cijelom stablu ovisnosti, uključujući razvojne alate. Njegov broj ranjivosti **nije isto što i izlazni status pokretanja Slideva**. Nemojte koristiti `npm audit fix --force` bez pregleda predloženih promjena; može zamijeniti CLI ili tranzitivne pakete nekompatibilnim verzijama.

Ako aplikacija i dalje javlja pogrešku, pošaljite cjelovit izlaz naredbi `node -v` i `npm run dev` (po mogućnosti od prve linije `Error`).

## Datoteke

- `slides.md` — 40 slajdova, nastavni tekst i HTML raspored.
- `style.css` — vizualni identitet, tipografija i layouti.
- `public/assets/` — lokalne slike, tekstura pozadine i motiv ribarske mreže.
- `components/ThresholdDemo.vue` — interaktivni klasifikacijski prag, lokalna Vue komponenta.
- `manifest.json` — mapiranje novih slajdova na izvorni P01 (slajdovi 01–32).
- `P01-pregled.pdf` (u razgovoru) — zaseban statični pregled.

## Napomene

- Zadržani su plavo-crna teksturirana pozadina, bijeli naslovi i koraljno-crveni naglasci, uz format 16:9 i veće fontove.
- Guste cjeline podijeljene su na više slajdova: ukupno 40.
- Matematičke korekcije: linearni model nije opći ML model; `A·w≈b` je primjer; revidirani su pojmovi generalizacije, vrsta učenja i klasifikacijskih metrika.
- **Slajd 36**: nakon klika se otkriva rješenje zadatka (`v-click`).
- **Slajd 37**: `components/ThresholdDemo.vue` — lokalna interaktivna demonstracija praga klasifikacije na 100 unaprijed pripremljenih primjera; bez interneta, dodatnih ovisnosti ili ponovnog uvježbavanja modela. Pri početnom pragu 0,50 rezultati su isti kao na slajdu 36.
- **Presenter notes** na slajdovima 5, 9, 12, 14, 19, 34–37 dostupne su kroz Slidev Presenter Mode (`/presenter/`).
- Naslovnica sadrži suptilan vektorski motiv ribarske mreže (`public/assets/fishing-net.svg`).
- Slidev build provjerava se GitHub Actions postupkom `.github/workflows/p01-slidev.yml`.
