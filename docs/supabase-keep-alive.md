# Guide: Hold dit Supabase-projekt i live med GitHub Actions

Gratis Supabase-projekter bliver sat på pause, hvis databasen ikke bliver brugt i ca. en uge. Så holder din app op med at virke, indtil du selv starter projektet igen. Det er træls lige før en aflevering eller eksamen.

I denne guide sætter du et lille GitHub Actions workflow op, som automatisk bruger din database to gange om ugen. Guiden virker til alle dine projekter, der bruger Supabase og ligger på GitHub.

## 1. Hvad er GitHub Actions?

GitHub Actions er GitHubs indbyggede system til at køre kode automatisk. Du beskriver i en fil, **hvad** der skal ske, og **hvornår**. Så starter GitHub en computer i skyen, kører dine kommandoer og lukker den ned igen.

Man bruger det typisk til at:

- **deploye** en app til fx GitHub Pages, hver gang man pusher til `main`
- **teste og linte** koden på hver pull request
- **køre planlagte opgaver**, fx et keep-alive ping eller en backup

I offentlige repositories er GitHub Actions gratis.

### Hvad er en `.yml` fil?

Workflows skrives i **YAML** (`.yml`). Det er et tekstformat til data og opsætning, ligesom JSON i `package.json`. Du skal ikke kunne skrive det selv, men det er godt at kunne læse det:

```json
{ "name": "Supabase keep alive", "branches": ["main"] }
```

```yaml
name: Supabase keep alive # navn: værdi
branches:
  - main # - er et punkt i en liste
```

I YAML bestemmer **indrykningen** strukturen i stedet for `{ }`, og `#` starter en kommentar.

> **Pas på indrykningen:** Brug mellemrum, ikke tabs. Er en linje rykket forkert ind, kører workflowet ikke. Kopiér derfor hele filen i ét stykke.

### Begreberne

| Begreb        | Hvad det er                                                                          |
| ------------- | ------------------------------------------------------------------------------------ |
| **Workflow**  | En automatisering beskrevet i en `.yml` fil i mappen `.github/workflows/`            |
| **Trigger**   | Det, der starter workflowet (`on:`), fx et push, et tidspunkt eller et klik          |
| **Job**       | En gruppe trin, der kører på samme maskine (en **runner**, fx `ubuntu-latest`)       |
| **Step**      | Et enkelt trin i et job, fx en kommando med `run:`                                   |
| **Variables** | Værdier, du gemmer på GitHub og bruger med `${{ vars.NAVN }}`                        |
| **Secrets**   | Ligesom variables, men skjulte. Til hemmelige nøgler med `${{ secrets.NAVN }}`       |

### Hvornår kører et workflow?

Det bestemmer du under `on:`. De tre mest almindelige triggers er:

```yaml
on:
  push:
    branches: ["main"] # når der bliver pushet til main
  schedule:
    - cron: "0 6 * * 1,4" # på faste tidspunkter
  workflow_dispatch: # manuelt med en knap under Actions
```

Et **cron-udtryk** har fem felter: `minut time dag måned ugedag`. `0 6 * * 1,4` betyder kl. 06:00 UTC hver mandag (`1`) og torsdag (`4`), og `*` betyder "alle". Du kan afprøve cron-udtryk på [crontab.guru](https://crontab.guru).

## 2. Sådan virker keep-alive

Workflowet laver ét lille GET-request til en tabel i din database, præcis som du gør i Thunder Client eller med `fetch`:

```txt
GET https://dit-project-id.supabase.co/rest/v1/posts?select=*&limit=1
```

Det henter højst én række, men det er en rigtig forespørgsel mod databasen, så Supabase kan se, at projektet bliver brugt. Med mandag og torsdag går der højst 4 dage mellem to ping.

## 3. Opsætning trin for trin

### 3.1 Gem dine Supabase-værdier på GitHub

Din `.env` fil bliver ikke pushet, så GitHub skal have de samme to værdier:

| Variabel               | Eksempel                                     |
| ---------------------- | -------------------------------------------- |
| `VITE_SUPABASE_URL`    | `https://dit-project-id.supabase.co/rest/v1` |
| `VITE_SUPABASE_APIKEY` | `sb_publishable_...`                         |

Du finder dem i Supabase under **Project Settings** -> **API**. Læg dem ét af to steder:

- **Repository variables** (enklest): **Settings** -> **Secrets and variables** -> **Actions** -> fanen **Variables**
- **Environment variables** (hvis du allerede har dem til deploy): **Settings** -> **Environments** -> dit environment, fx `github-pages-deployment`

> **Bemærk:** Slutter din URL ikke på `/rest/v1` (fx fordi du bruger `supabase-js`), så tilføj `/rest/v1` i URL'en i workflowet.

> **Variables eller secrets?** Variables er fint. Den publishable key er lavet til at være offentlig og bliver alligevel bygget ind i din frontend. Dine data beskyttes af Row Level Security (RLS) i Supabase. En `sb_secret_...` key skal derimod altid ligge som **secret**.

### 3.2 Opret workflow-filen

Opret filen `.github/workflows/supabase-keep-alive.yml` i dit projekt:

```yaml
name: Supabase keep alive

on:
  schedule:
    - cron: "0 6 * * 1,4" # mandag og torsdag kl. 06 (UTC)
  workflow_dispatch: # gør det muligt at køre den manuelt

jobs:
  ping:
    # Brug kun denne linje, hvis dine variabler ligger i et environment
    environment: github-pages-deployment
    runs-on: ubuntu-latest
    env:
      # Tilpas til en tabel, der findes i dit Supabase-projekt
      PING_TABLE: posts
    steps:
      # VITE_SUPABASE_URL ender på /rest/v1, så tabelnavnet tilføjes her
      - name: Ping Supabase
        run: |
          curl --fail -sS -o /dev/null \
            "${{ vars.VITE_SUPABASE_URL }}/$PING_TABLE?select=*&limit=1" \
            -H "apikey: ${{ vars.VITE_SUPABASE_APIKEY }}"
```

Tilpas to ting:

1. **`environment:`** Slet linjen, hvis du bruger repository variables. Ellers skriv navnet på dit environment.
2. **`PING_TABLE:`** Skriv navnet på en tabel, der findes i **dit** projekt, fx `posts`, `users` eller `products`.

### 3.3 Hvad gør linjerne?

| Linje                    | Betydning                                                                |
| ------------------------ | ------------------------------------------------------------------------ |
| `schedule` + `cron`      | Kører workflowet mandag og torsdag kl. 06 UTC                            |
| `workflow_dispatch`      | Giver en **Run workflow**-knap, så du selv kan teste det                 |
| `environment`            | Hvilket environment variablerne skal hentes fra                          |
| `runs-on: ubuntu-latest` | Jobbet kører på en Linux-maskine i skyen                                 |
| `curl`                   | Laver et HTTP-request fra kommandolinjen, ligesom `fetch`                |
| `--fail`                 | Gør workflowet rødt, hvis Supabase svarer med en fejl                    |
| `-sS -o /dev/null`       | Skjuler svaret, men viser fejlbeskeder                                   |
| `-H "apikey: ..."`       | Sender din API key som header, ligesom `headers` i `fetch`               |

### 3.4 Commit og push

```bash
git add .github/workflows/supabase-keep-alive.yml
git commit -m "Add Supabase keep-alive workflow"
git push
```

## 4. Test at det virker

Du behøver ikke vente til mandag:

1. Gå til fanen **Actions** i dit repository
2. Vælg **Supabase keep alive** i listen til venstre
3. Klik **Run workflow** -> **Run workflow**
4. Tjek at kørslen bliver grøn ✅

Fra nu af kører det automatisk mandag og torsdag.

## 5. Fejlfinding

Bliver kørslen rød ❌, så klik på den og åbn trinnet **Ping Supabase**:

| Fejl                                    | Løsning                                                                         |
| --------------------------------------- | ------------------------------------------------------------------------------- |
| `404`                                   | Tabellen findes ikke. Ret `PING_TABLE`                                          |
| `401`                                   | Tjek din URL og API key, og at variablerne ligger det rigtige sted              |
| `URL rejected: No host part in the URL` | Variablerne kan ikke findes. Tjek navnene, og om `environment:` passer          |
| Workflowet vises ikke under Actions     | Filen skal ligge i `.github/workflows/` og være pushet til `main`               |

> **Tip:** Har tabellen RLS uden en policy til læsning, bliver kørslen stadig grøn (med en tom liste). Det er fint, for forespørgslen rammer stadig databasen.

## 6. Godt at vide

- **60 dage uden commits:** Så slår GitHub planlagte workflows fra, og du får en mail. Slå det til igen under **Actions** -> workflowet -> **Enable workflow**.
- **UTC og forsinkelser:** `0 6` er kl. 07 dansk vintertid og kl. 08 sommertid. Når GitHub har travlt, kan kørsler blive forsinket, men med to ping om ugen betyder det ikke noget.
- **Allerede sat på pause?** Så hjælper workflowet ikke. Start projektet igen på [supabase.com/dashboard](https://supabase.com/dashboard) med **Restore project**.
