# Kom i gang med Supabase

> Rasmus Cederdorff (RACE) · Senior Lecturer & Web App Developer · race@eaaa.dk

---

## Indholdsfortegnelse

- [0. Opret et Supabase projekt](#0-opret-et-supabase-projekt)
- [1. Opret en tabel (products)](#1-opret-en-tabel-products)
- [2. Indsæt data i din tabel](#2-indsæt-data-i-din-tabel)
- [3. REST API i Supabase](#3-rest-api-i-supabase)
- [4. Security og Row Level Security (RLS)](#4-security-og-row-level-security-rls)
- [5. Test i browser](#5-test-i-browser)
- [6. Test REST API med Thunderclient](#6-test-rest-api-med-thunderclient)
  - [6.1. READ: Hent alle produkter (GET)](#61-read-hent-alle-produkter-get)
  - [6.2. CREATE: Opret nyt produkt (POST)](#62-create-opret-nyt-produkt-post)
  - [6.3. UPDATE: Opdater eksisterende produkt (PATCH)](#63-update-opdater-eksisterende-produkt-patch)
  - [6.4. DELETE: Slet eksisterende produkt (DELETE)](#64-delete-slet-eksisterende-produkt-delete)
- [7. Filtrering & Sortering med Supabase REST](#7-filtrering--sortering-med-supabase-rest)
  - [7.1. Syntaks](#71-syntaks)
  - [7.2. Operatorer](#72-operatorer)
  - [7.3. Test Filtrering](#73-test-filtrering)
  - [7.4. Test Sortering](#74-test-sortering)
  - [7.5. Kombiner filtrering, sortering og limit](#75-kombiner-filtrering-sortering-og-limit)
  - [7.6. JavaScript fetch med filtrering, sortering og paginering](#76-javascript-fetch-med-filtrering-sortering-og-paginering)

---

## 0. Opret et Supabase projekt

- Gå til [supabase.com](https://supabase.com)
- Klik **"Start your project"**
- Login med GitHub — eller **"Sign up"** for at oprette konto med email og password
- Klik **"Create a new organisation"**, udfyld felterne og klik **"Create organisation"**
- Klik **"Create a new project"**
  - Generér et **"Database password"** og gem det til senere brug
  - Sørg for at **"Enable Data API"** er slået til

Nu har du:

- En PostgreSQL database
- Et REST API
- API keys

… som vi kan tilgå fra React. Men først skal vi have noget data at arbejde med.

---

## 1. Opret en tabel (products)

- I Dashboard → venstre menu → **"Table editor"**
- Gå til **"Table Editor"** og klik **"Create Table"**
- Angiv table name: `products`
- Tilføj kolonner — klik **"Add column"**:

Sørg for at du har følgende kolonner:

**Table name: products**

| column     | type               |
| ---------- | ------------------ |
| id         | int8 (primary key) |
| created_at | timestamp          |
| title      | text               |
| price      | numeric            |
| image      | text               |

- Klik **"Save"**
- Nu kan du se din products table

---

## 2. Indsæt data i din tabel

Nu skal vi have indsat en masse produktdata.

- Find den grønne **"Insert"**-knap → **"Insert row"**
- Indtast kun værdier for `title`, `price` og `image` — `id` og `created_at` autogenereres
- Du kan genbruge produktdata fra:  
  `https://raw.githubusercontent.com/cederdorff/race/refs/heads/master/data/webshop/products.json`
- Klik **"Save"** for at gemme
- Læg mærke til hvordan `id` og `created_at` bliver autogenereret
- Gentag og opret 3–4 produkter

---

## 3. REST API i Supabase

_Du skal ikke gøre noget i dette step — blot læse._

Supabase bruger **PostgREST**, som automatisk eksponerer dine tabeller som REST endpoints:

| Metode | Endpoint                    | Beskrivelse              |
| ------ | --------------------------- | ------------------------ |
| GET    | `/rest/v1/products`         | Hent alle produkter      |
| POST   | `/rest/v1/products`         | Opret nyt produkt        |
| PATCH  | `/rest/v1/products?id=eq.1` | Opdater produkt med id=1 |
| DELETE | `/rest/v1/products?id=eq.1` | Slet produkt med id=1    |

Ingen serverkode nødvendig.

Men før vi kan tilgå det skal vi tillade det.

---

## 4. Security og Row Level Security (RLS)

Som standard har vi ikke fri adgang til data — det skal vi slå til.

Først skal du finde din Data API:

- Gå til **"Integrations"** → **"Data API"** og kopiér din API URL
- Tilføj `/rest/v1/products` i enden af din API URL, fx:  
  `https://dit-project-id.supabase.co/rest/v1/products`
- Prøv at køre URL'en i browseren — du vil se en fejl, fordi vi ikke bruger en API key endnu

Næste trin — hent din API key:

- Gå til **"Project Settings"** og vælg **"API Keys"**
- Kopiér **"Publishable key"**
- Tilføj `?apikey=din-lange-sb-publishable-key` i enden af din URL, så den ligner denne:

```
https://dit-project-id.supabase.co/rest/v1/products?apikey=din-lange-sb-publishable-key
```

Husk at ændre til dine egne værdier. En URL ser fx sådan ud (men brug din egen):

```
https://frbjedghkanvumtvtzrh.supabase.co/rest/v1/products?apikey=sb_publishable_CbP-FMIMbGOqg1IwlxiBkQ_mq8UOSR8
```

- Test den nu i browseren (din egen URL)
- Du vil se et **tomt array** (`[]`) — det er fordi der stadig er opsat sikkerhed for tabellen `products`, som vi nu skal tilpasse

Nu skal vi slå RLS fra:

- Gå til **"Table Editor"** og åbn `products`
- Tryk på knappen med tre dots ud for `products`
- Vælg **"View policies"** (du kan også finde det via **"Authentication"** → **"Policies"**)
- Vælg **"Disable RLS"** for products-tabellen

> ⚠️ Vi slår Row Level Security fra for at gøre det nemt at teste. I et produktionsmiljø skal RLS være slået til og konfigureret korrekt.  
> Senere vender vi tilbage til sikkerhed og Row Level Security.

---

## 5. Test i browser

Test nu igen din URL i browseren:

```
https://dit-project-id.supabase.co/rest/v1/products?apikey=din-lange-sb-publishable-key
```

Nu får du listen af alle dine produkter gemt i `products`-tabellen i Supabase.

- Kan du se det smarte i det her?
- Hvad kan vi bruge det her til? Den her data?

---

## 6. Test REST API med Thunderclient

**Thunderclient** er en HTTP-klient der er bygget direkte ind i VS Code. Vi bruger den til at sende rigtige HTTP-requests til Supabase og se hvad API'et svarer, inden vi skriver React-kode.

### Installér Thunderclient (hvis ikke allerede du har den)

1. Gå til **Extensions** i VS Code
2. Søg efter `Thunder Client`
3. Klik **Install**
4. Et lyn-ikon dukker op i venstre sidebar — klik på det for at åbne Thunderclient

### Opret en ny request (generel beskrivelse)

Klik på **"New Request"** øverst i Thunderclient-panelet. Du får en tom request med:

- Et dropdown til at vælge **HTTP-metode** (GET, POST, PATCH, DELETE …) — helt til venstre
- Et **URL-felt** til højre for metoden — her indsætter du din endpoint-URL
- Faner nedenunder: **Headers**, **Body**, **Query** m.fl.

### Headers — bruges i alle requests

Supabase kræver en API-nøgle på **alle** requests. Den sætter vi som en header:

1. Klik på fanen **"Headers"**
2. Klik **"Add Header"**
3. Udfyld:
   - **Name:** `apikey`
   - **Value:** din publishable key (den lange `sb_publishable_...`-nøgle fra trin 4)

> 💡 Du skal tilføje denne header i **alle fire** requests herunder. Nogle requests kræver desuden en `Content-Type`-header — det er beskrevet under hvert punkt.

---

### 6.1. READ: Hent alle produkter (GET)

GET bruges til at **hente data**. Vi sender ingen body — vi beder bare om at få alle rækker i `products`-tabellen tilbage.

**Thunderclient — trin for trin:**

1. Sæt metoden til **`GET`**
2. Indsæt URL: `https://dit-project-id.supabase.co/rest/v1/products`
3. Gå til fanen **"Headers"** og tilføj:
   - `apikey` → din publishable key
4. Klik den blå **"Send"**-knap
5. I bunden / eller højre side ser du svaret — en JSON-liste med alle dine produkter

**JavaScript fetch**

Hvis vi skulle gøre det her i JavaScript, vil det se sådan ud — men det venter vi lige lidt med endnu!

```js
const response = await fetch("https://xyz.supabase.co/rest/v1/products", {
  headers: {
    apikey: "din_sb_publishable_xyz"
  }
});

const data = await response.json();
console.log(data);
```

---

### 6.2. CREATE: Opret nyt produkt (POST)

POST bruges til at **oprette en ny række** i databasen. Her skal vi sende data med i requestens **body** som JSON.

**Thunderclient:**

_Du kan med fordel duplikere dit GET-request og arbejde videre derfra._

1. Sæt metoden til **`POST`**
2. Indsæt URL: `https://dit-project-id.supabase.co/rest/v1/products`
3. Gå til fanen **"Headers"** og tilføj begge headers:
   - `apikey` → din publishable key
   - `Content-Type` → `application/json`  
     _(Fortæller Supabase at vi sender JSON i body'en)_
4. Gå til fanen **"Body"** → vælg **"JSON"**
5. Indsæt dette i tekstfeltet eller definer selv et produkt med `title`, `price` og `image`:

```json
{
  "title": "MacBook Pro",
  "price": 14995,
  "image": "https://upload.wikimedia.org/wikipedia/commons/4/49/MacBook_Pro_Retina_001.jpg"
}
```

6. Klik **"Send"** og se hvad der sker

Får du statuskode **201** betyder det at alt er gået godt og produktet er oprettet.

7. Kontroller at produktet er oprettet. Du kan enten køre dit foregående GET-request igen eller tjekke databasetabellen i Supabase.

**JavaScript fetch:**

Sådan vil det se ud i JavaScript (det venter vi også med):

```js
await fetch("https://xyz.supabase.co/rest/v1/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    apikey: "din_sb_publishable_xyz"
  },
  body: JSON.stringify({
    title: "MacBook Pro",
    price: 14995,
    image: "https://upload.wikimedia.org/wikipedia/commons/4/49/MacBook_Pro_Retina_001.jpg"
  })
});
```

---

### 6.3. UPDATE: Opdater eksisterende produkt (PATCH)

PATCH bruges til at **ændre en eksisterende række**. Vi skal fortælle Supabase hvilket produkt vi vil opdatere — det gør vi med en **query parameter** i URL'en: `?id=eq.1` betyder "hvor id er lig med 1". Husk at bruge det rigtige id for det produkt du vil prøve at opdatere!

**Thunderclient:**

_Du kan med fordel duplikere dit POST-request og arbejde videre derfra._

1. Sæt metoden til **`PATCH`**
2. Indsæt URL med id på det produkt du vil opdatere:  
   `https://dit-project-id.supabase.co/rest/v1/products?id=eq.1`  
   _(Skift `1` ud med et rigtigt id fra din tabel)_
3. Gå til fanen **"Headers"** og tilføj:
   - `apikey` → din publishable key
   - `Content-Type` → `application/json`
4. Gå til fanen **"Body"** → vælg **"JSON"**
5. Indsæt kun de felter du vil ændre:

```json
{
  "title": "MacBook Air",
  "price": 13499
}
```

6. Klik **"Send"** — Supabase returnerer den opdaterede række

> 💡 Med PATCH sender du **kun** de felter du vil ændre — de øvrige felter i rækken forbliver uændrede.

Prøv fx kun at ændre ét felt (én property):

```json
{
  "image": "https://yi-files.yellowimages.com/products/1543000/1543101/2483828-cover.jpg"
}
```

Og se hvad der sker.

Husk at du kan teste dine ændringer med PATCH (update) ved at køre dit GET-request igen eller tjekke tabellen i Supabase.

**JavaScript fetch:**

```js
const id = 1;

await fetch(`https://xyz.supabase.co/rest/v1/products?id=eq.${id}`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    apikey: "din_sb_publishable_xyz"
  },
  body: JSON.stringify({
    title: "MacBook Air",
    price: 13499
  })
});
```

---

### 6.4. DELETE: Slet eksisterende produkt (DELETE)

DELETE bruges til at **slette en række** fra databasen. Ligesom PATCH bruger vi en query parameter til at angive hvilken række der skal slettes. Der sendes ingen body.

**Thunderclient:**

_Du kan med fordel duplikere og genbruge dit PATCH-request._

1. Sæt metoden til **`DELETE`**
2. Indsæt URL med id på det produkt du vil slette:  
   `https://dit-project-id.supabase.co/rest/v1/products?id=eq.1`  
   _(Skift `1` ud med et rigtigt id fra din tabel)_
3. Gå til fanen **"Headers"** og tilføj:
   - `apikey` → din publishable key
4. Lad **"Body"** være tom — DELETE behøver ingen data
5. Klik **"Send"** — du får et tomt svar tilbage med statuskode `204 No Content`, hvilket betyder at det lykkedes
6. Kontroller nu at produktet er blevet slettet ved at køre dit GET-request igen eller tjekke tabellen i Supabase

> ⚠️ DELETE kan ikke fortrydes! Tjek altid at du har det rigtige `id` i URL'en inden du sender. I en rigtig app bør du bekræfte med brugeren først, fx med `window.confirm()`.

**JavaScript fetch:**

```js
const id = 1;

await fetch(`https://xyz.supabase.co/rest/v1/products?id=eq.${id}`, {
  method: "DELETE",
  headers: {
    apikey: "din_sb_publishable_xyz"
  }
});
```

---

## 7. Filtrering & Sortering med Supabase REST

Indtil nu har vi hentet **alle** rækker fra tabellen med en simpel `GET`-request. Men i praksis vil man sjældent have brug for hele datasættet — man vil måske kun hente ét bestemt produkt, produkter under en bestemt pris, eller have resultaterne sorteret.

Supabase understøtter filtrering, sortering og paginering direkte via **query parameters** i URL'en. Det sker på databaseniveau, så kun de relevante rækker sendes tilbage — det er langt mere effektivt end at hente alt og filtrere i JavaScript bagefter.

### 7.1. Syntaks

Query parameters tilføjes i enden af URL'en efter et `?`. Har du flere parametre, adskilles de med `&`:

```
/rest/v1/products?<kolonne>=<operator>.<værdi>
/rest/v1/products?<kolonne>=<operator>.<værdi>&<kolonne2>=<operator2>.<værdi2>
```

### 7.2. Operatorer

Operatoren bestemmer _hvordan_ værdien sammenlignes med kolonnen:

| Operator | Betydning                 | Eksempel             |
| -------- | ------------------------- | -------------------- |
| `eq`     | Lig med (equals)          | `?id=eq.1`           |
| `neq`    | Ikke lig med              | `?id=neq.1`          |
| `lt`     | Mindre end (less than)    | `?price=lt.1000`     |
| `lte`    | Mindre end eller lig med  | `?price=lte.1000`    |
| `gt`     | Større end (greater than) | `?price=gt.5000`     |
| `gte`    | Større end eller lig med  | `?price=gte.5000`    |
| `like`   | Mønster (case-sensitiv)   | `?title=like.Mac*`   |
| `ilike`  | Mønster (case-insensitiv) | `?title=ilike.*mac*` |
| `is`     | Er null / true / false    | `?image=is.null`     |

> 💡 I `like` og `ilike` bruges `*` som wildcard — fx `*mac*` matcher alt der _indeholder_ "mac", mens `mac*` matcher alt der _starter med_ "mac".

---

### 7.3. Test Filtrering

Dupliker dit GET-request i Thunderclient og arbejd videre derfra.

**Hent ét bestemt produkt via id:**

Bruges fx når du vil hente et specifikt produkt til en detaljevisning.

```
/rest/v1/products?id=eq.1
```

**Hent produkter billigere end kr. 1.000:**

Nyttigt til at filtrere på pris — fx vise "budget"-produkter.

```
/rest/v1/products?price=lt.1000
```

**Hent produkter dyrere end eller lig med kr. 5.000:**

```
/rest/v1/products?price=gte.5000
```

**Søg produkter der indeholder "mac" (case-insensitiv):**

`ilike` bruges til simpel tekstsøgning. `*mac*` betyder "indeholder mac" — uanset store/små bogstaver.

```
/rest/v1/products?title=ilike.*mac*
```

Afprøv gerne med andre værdier, id'er, priser og tekststrenge. Vær sikker på at du forstår ideen, inden du fortsætter.

---

### 7.4. Test Sortering

_Dupliker evt. dit filtrerings-GET-request i Thunderclient og arbejd videre derfra._

Brug `order`-parameteren til at sortere resultater. Angiv kolonnenavn efterfulgt af `.asc` (stigende) eller `.desc` (faldende):

**Billigste først:**

```
/rest/v1/products?order=price.asc
```

**Dyreste først:**

```
/rest/v1/products?order=price.desc
```

Prøv også at sortere efter `title` eller `created_at`.

---

### 7.5. Kombiner filtrering, sortering og limit

Du kan kombinere flere parametre med `&`. Herunder hentes produkter under kr. 5.000, sorteret billigste først, og begrænset til maks 5 resultater:

```
/rest/v1/products?price=lt.5000&order=price.asc&limit=5
```

`limit` er praktisk til paginering eller til at undgå at hente for mange rækker på én gang.

Prøv det af med forskellige værdier:

```
/rest/v1/products?price=lt.5000&order=price.asc&limit=5

/rest/v1/products?price=lt.1300&order=price.asc&limit=2

/rest/v1/products?price=gt.700&order=price.asc&limit=2

/rest/v1/products?price=gt.700&order=price.desc&limit=2

... eller noget helt andet!
```

---

### 7.6. JavaScript fetch med filtrering, sortering og paginering

Filtrene er blot en del af URL-strengen — der er intet nyt at lære i selve `fetch`-kaldet:

```js
// Hent de 5 billigste produkter under kr. 5.000
const response = await fetch("https://xyz.supabase.co/rest/v1/products?price=lt.5000&order=price.asc&limit=5", {
  headers: {
    apikey: "din_sb_publishable_xyz"
  }
});

const data = await response.json();
console.log(data);
```

Du kan selvfølgelig også sammensætte det med template string og variabler, hvor variablerne kunne være state-værdier, så vi dynamisk kan ændre og reagere på det fra UI:

```js
const price = 5000;
const order = "price";
const orderDirection = "asc";
const limit = 5;

const response = await fetch(
  `https://xyz.supabase.co/rest/v1/products?price=lt.${price}&order=${order}.${orderDirection}&limit=${limit}`,
  {
    headers: {
      apikey: "din_sb_publishable_xyz"
    }
  }
);

const data = await response.json();
console.log(data);
```

---

> **Dokumentation:** [supabase.com/docs](https://supabase.com/docs) · [PostgREST filtering](https://postgrest.org/en/stable/references/api/tables_views.html#horizontal-filtering)
