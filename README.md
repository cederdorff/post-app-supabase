# RACE 10 - Øvelse: Post App med Forms og CRUD

## 0. Formål

I denne øvelse skal du bygge en lille Post App i React med Supabase som backend.

Fokus er på:

- controlled forms i React
- GET, POST, PATCH og DELETE med `fetch`
- navigation mellem sider
- at få det grundlæggende CRUD-flow til at virke

Målet er ikke at bygge en avanceret app.
Målet er at bygge en CRUD-app, som virker.

## 1. Startprojekt

- Brug dette template repo: [post-app-supabase-template](https://github.com/cederdorff/post-app-supabase-template)
- Opret dit eget repository ud fra templaten
- Hent derefter dit eget repository ned lokalt
- Åbn projektet i VS Code
- Kør:

```bash
npm install
npm run dev
```

> Vigtigt: Projektet fungerer ikke fuldt endnu. Før appen kan hente og gemme data, skal du have et Supabase-projekt, en `posts`-tabel og en korrekt `.env` fil.

## 2. Før du starter

Du skal have:

- et Supabase-projekt
- en tabel med navnet `posts`
- felterne `id`, `image` og `caption`
- testet GET, POST, PATCH og DELETE i Thunder Client

Du må meget gerne bare arbejde videre i det Supabase-projekt, du allerede har fra tidligere.

### Opret `posts`-tabellen i Supabase

Hvis du ikke allerede har en `posts`-tabel, så gør sådan her:

1. Åbn dit eksisterende Supabase-projekt
2. Gå til **Table Editor**
3. Klik på **Create a new table**
4. Giv tabellen navnet `posts`
5. Sørg for at tabellen har disse kolonner:

| column     | type               |
| ---------- | ------------------ |
| id         | int8 (primary key) |
| created_at | timestampz         |
| image      | text               |
| caption    | text               |

6. Gem tabellen

Hvis `id` ikke autogenereres, så sørg for at `id` er sat op som primary key.

`created_at` bliver ofte oprettet automatisk af Supabase. Det er helt fint. Du skal ikke bruge det aktivt i denne øvelse.

### Gør tabellen unrestricted lige nu

For at gøre det nemt at teste i denne øvelse, skal tabellen være åben for requests lige nu.

1. Gå til **Table Editor**
2. Åbn tabellen `posts`
3. Find **Table settings** eller menuen med de tre prikker
4. Gå til policies / security
5. Sæt tabellen til **unrestricted** eller slå RLS fra for `posts`

Det er kun for at gøre det nemt at komme i gang. Senere kan du arbejde med sikkerhed og policies igen.

### Indsæt et par test-data

Det er en god ide at indsætte 2-3 rækker med det samme, så du har noget at vise på forsiden.

Du må gerne tage udgangspunkt i disse eksempler og kun indsætte `image` og `caption` i Supabase:

```json
[
  {
    "caption": "Beautiful sunset at the beach",
    "image": "https://images.unsplash.com/photo-1566241832378-917a0f30db2c?auto=format&fit=crop&w=500&q=80"
  },
  {
    "caption": "Exploring the city streets of Aarhus",
    "image": "https://images.unsplash.com/photo-1559070169-a3077159ee16?auto=format&fit=crop&w=500&q=80"
  },
  {
    "caption": "Delicious food at the restaurant",
    "image": "https://images.unsplash.com/photo-1548940740-204726a19be3?auto=format&fit=crop&w=500&q=80"
  }
]
```

### Test dit endpoint

Når tabellen er klar, så lav lige et par hurtige tests i Thunder Client.

Du skal bruge:

1. URL'en til `posts`
2. din `anon` eller `publishable` API key

Begge dele finder du i Supabase under:

- **Project Settings** -> **API**

Brug denne URL:

```txt
https://dit-project-id.supabase.co/rest/v1/posts
```

I Thunder Client:

1. Åbn Thunder Client i VS Code
2. Opret en ny request
3. Indsæt URL'en
4. Tilføj disse headers:

```txt
apikey: DIN_KEY
Content-Type: application/json
```

Til `PATCH` og `DELETE` kan du bruge:

```txt
https://dit-project-id.supabase.co/rest/v1/posts?id=eq.1
```

Til `POST` og `PATCH` skal du også sende JSON i body, fx:

```json
{
  "image": "https://example.com/photo.jpg",
  "caption": "Mit første post"
}
```

Når det er sat op, så test:

- GET alle posts
- POST et nyt post
- PATCH et eksisterende post
- DELETE et eksisterende post

Målet er bare at sikre, at endpointet virker, før du går videre til React-koden.

Opret en `.env` fil i projektets rod:

```dotenv
VITE_SUPABASE_URL=https://dit-project-id.supabase.co/rest/v1/posts
VITE_SUPABASE_APIKEY=din_sb_publishable_key
```

## 3. Få overblik over projektet

Kig i disse filer, før du går i gang (du skal ikke gøre noget):

- `src/App.jsx`
- `src/pages/HomePage.jsx`
- `src/pages/CreatePage.jsx`
- `src/pages/PostDetailPage.jsx`
- `src/pages/UpdatePage.jsx`

Appen bruger disse routes:

- `/` viser alle posts
- `/create` viser formularen til at oprette et post
- `/posts/:id` viser et enkelt post
- `/posts/:id/update` viser formularen til at redigere et post

Tænk over:

- Hvilke sider findes allerede?
- Hvilke routes findes allerede?
- Hvilken side viser alle posts?
- Hvilken side bruges til at oprette et post?
- Hvilke sider bruger `:id` i URL'en?

## 4. Implementer GET i HomePage

Mål: Vis alle posts på forsiden.

Eksempel:

```jsx
useEffect(() => {
  async function getPosts() {
    const response = await fetch(URL, { headers });
    const data = await response.json();
    setPosts(data);
  }

  getPosts();
}, []);
```

Du skal:

1. Bruge `fetch(URL, { headers })`
2. Konvertere svaret med `await response.json()`
3. Gemme data i `posts` state
4. Vise posts i UI
5. Kontrollere i browseren, at data (`posts`) faktisk bliver vist

## 5. Gør formularen controlled i CreatePage

Mål: Opret et nyt post med en controlled form.

Eksempel:

```jsx
const [image, setImage] = useState("");
const [caption, setCaption] = useState("");

<input
  value={image}
  onChange={(event) => setImage(event.target.value)}
  required
/>

<textarea
  value={caption}
  onChange={(event) => setCaption(event.target.value)}
  required
/>
```

Du skal:

1. Lave state til `image`
2. Lave state til `caption`
3. Binde felterne til state med `value`
4. Opdatere state med `onChange`
5. Bruge `required` på felterne
6. Bruge `event.preventDefault()` i `handleSubmit`

## 6. Implementer POST i CreatePage

Mål: Gem et nyt post i databasen.

1. Brugeren udfylder formularen
2. `handleSubmit` bliver kaldt
3. Data sendes med `fetch`
4. Appen navigerer tilbage til `/`

Eksempel:

```jsx
async function handleSubmit(event) {
  event.preventDefault();

  await fetch(URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      image: image.trim(),
      caption: caption.trim(),
    }),
  });

  navigate("/");
}
```

Du skal:

1. Lave `handleSubmit(event)`
2. Bruge `event.preventDefault()`
3. Sende `POST` med `fetch`
4. Bruge `JSON.stringify(...)`
5. Navigere tilbage til forsiden med `navigate("/")`

## 7. Implementer GET og DELETE i PostDetailPage

Mål: Vis et enkelt post og gør det muligt at slette det.

1. Brugeren klikker på et post på forsiden
2. Appen navigerer til `"/posts/:id"`
3. `PostDetailPage` læser `id` med `useParams()`
4. Komponenten henter et enkelt post
5. Data bliver vist
6. Brugeren kan slette med delete-knappen
7. Appen spørger om bekræftelse med `window.confirm(...)`
8. Ved bekræftelse sendes en DELETE-request
9. Appen navigerer tilbage til `/`

Eksempel:

```jsx
useEffect(() => {
  async function getPost() {
    const response = await fetch(`${URL}?id=eq.${id}`, { headers });
    const data = await response.json();
    setPost(data[0]);
  }

  getPost();
}, [id]);
```

Du skal:

1. Bruge `useParams()` til at læse `id`
2. Hente et post med:

```js
`${URL}?id=eq.${id}`;
```

3. Gemme resultatet i state
4. Vise `image` og `caption`
5. Lave en delete-knap
6. Bruge `window.confirm(...)`
7. Sende en DELETE-request
8. Navigere tilbage til forsiden

Eksempel på delete:

```jsx
async function handleDelete() {
  const confirmed = window.confirm("Delete this post?");

  if (!confirmed) return;

  await fetch(`${URL}?id=eq.${id}`, {
    method: "DELETE",
    headers,
  });

  navigate("/");
}
```

## 8. Implementer GET og PATCH i UpdatePage

Mål: Hent et eksisterende post, vis det i formularen og gem ændringer.

1. Brugeren klikker på edit på detail-siden
2. Appen navigerer til `"/posts/:id/update"`
3. `UpdatePage` læser `id` med `useParams()`
4. `UpdatePage` henter et enkelt post
5. `image` og `caption` sættes som startværdier i formularen
6. Brugeren retter felterne
7. `handleSubmit` sender en PATCH-request
8. Appen navigerer tilbage til detail-siden

Eksempel:

```jsx
useEffect(() => {
  async function getPost() {
    const response = await fetch(`${URL}?id=eq.${id}`, { headers });
    const data = await response.json();
    setImage(data[0].image);
    setCaption(data[0].caption);
  }

  getPost();
}, [id]);
```

Du skal:

1. Bruge `id` fra `useParams()`
2. Hente et enkelt post med querystring
3. Sætte `image` og `caption` i state ud fra det hentede post
4. Bruge state som `value` i formularen
5. Sende en PATCH-request i `handleSubmit`
6. Navigere tilbage til `"/posts/:id"`

Eksempel på submit:

```jsx
async function handleSubmit(event) {
  event.preventDefault();

  await fetch(`${URL}?id=eq.${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      image: image.trim(),
      caption: caption.trim(),
    }),
  });

  navigate(`/posts/${id}`);
}
```

## 9. Ekstra udfordringer

Hvis du bliver hurtigt færdig, kan du for eksempel også:

- tilføj loading states
- tilføj en tom-state på forsiden
- tilføj `try/catch`
- tilføj simple fejlbeskeder
- tilføj `response.ok` checks
- disable knapper mens requests kører
- saml `URL` og `headers` i en separat fil

Tag gerne kun et punkt ad gangen.

## 10. Refleksion

Svar kort på disse spørgsmål:

1. Hvad er forskellen på GET, POST, PATCH og DELETE i din app?
2. Hvordan hænger controlled forms sammen med `useState`?
3. Hvorfor er `value` og `onChange` vigtige i formularen?
4. Hvorfor er `event.preventDefault()` vigtig i `handleSubmit`?
5. Hvordan bruger appen `id` fra URL'en i detail- og update-siderne?
