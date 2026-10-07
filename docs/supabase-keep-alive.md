# Guide: Hold dit Supabase-projekt i live med GitHub Actions

Gratis Supabase-projekter bliver sat på pause, hvis databasen ikke bliver brugt i ca. en uge. Når det sker, holder din app op med at virke, indtil du selv går ind i Supabase og starter projektet igen.

Det er træls, hvis det sker lige før en aflevering eller en eksamen. I denne guide sætter du et lille GitHub Actions workflow op, som automatisk bruger din database to gange om ugen, så projektet ikke bliver sat på pause.

Guiden virker til alle dine projekter, der bruger Supabase og ligger på GitHub.

## Indhold

1. [Hvad er GitHub Actions?](#1-hvad-er-github-actions)
2. [Sådan virker keep-alive](#2-sådan-virker-keep-alive)
3. [Opsætning trin for trin](#3-opsætning-trin-for-trin)
4. [Test at det virker](#4-test-at-det-virker)
5. [Fejlfinding](#5-fejlfinding)
6. [Godt at vide](#6-godt-at-vide)

## 1. Hvad er GitHub Actions?

GitHub Actions er GitHubs indbyggede system til at køre kode automatisk. Du beskriver i en fil, **hvad** der skal ske, og **hvornår** det skal ske. Så starter GitHub en computer i skyen, kører dine kommandoer og lukker den ned igen.

Typiske ting man bruger GitHub Actions til:

- **Deploy:** Byg din React-app og læg den på GitHub Pages, hver gang du pusher til `main`
- **Test og lint:** Kør tests og ESLint på hver pull request, så fejl bliver fanget før de bliver merget
- **Planlagte opgaver:** Kør noget på faste tidspunkter, fx et keep-alive ping eller en backup
- **Automatisering:** Sæt labels på issues, send beskeder, opdatér afhængigheder osv.

I offentlige repositories er GitHub Actions gratis.

### Hvad er en `.yml` fil?

Workflows skrives i **YAML** (filendelsen `.yml` eller `.yaml`). YAML er bare et tekstformat til at beskrive data og opsætning, ligesom JSON, som du kender fra `package.json`. Du skal ikke kunne skrive YAML selv, men det er godt at kunne læse det.

Her er de samme data i JSON og i YAML:

```json
{
  "name": "Supabase keep alive",
  "on": {
    "workflow_dispatch": null
  },
  "branches": ["main"]
}
```

```yaml
name: Supabase keep alive
on:
  workflow_dispatch:
branches:
  - main
```

De vigtigste regler:

- `navn: værdi` svarer til `"navn": "værdi"` i JSON
- **Indrykning bestemmer strukturen** i stedet for `{ }`. Det, der er rykket ind under `on:`, hører til `on`
- `-` starter et punkt i en liste, ligesom `[ ]` i JSON
- `#` starter en kommentar

> **Pas på indrykningen:** Brug mellemrum, ikke tabs, og ryk ind præcis som i eksemplerne. Er en linje rykket forkert ind, forstår GitHub ikke workflowet, og det vil ikke køre. Kopiér derfor hele filen i ét stykke.

### Begreberne

| Begreb       | Hvad det er                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------- |
| **Workflow** | En automatisering beskrevet i en `.yml` fil i mappen `.github/workflows/`                     |
| **Trigger**  | Det, der starter workflowet (`on:`), fx et push, et tidspunkt eller et klik                    |
| **Job**      | En gruppe trin, der kører på samme maskine                                                   |
| **Runner**   | Den maskine i skyen, jobbet kører på, fx `ubuntu-latest`                                       |
| **Step**     | Et enkelt trin i et job, fx en kommando med `run:`                                            |
| **Variables**| Værdier, du gemmer på GitHub og bruger i workflowet med `${{ vars.NAVN }}`                     |
| **Secrets**  | Ligesom variables, men skjulte. Bruges til hemmelige nøgler med `${{ secrets.NAVN }}`          |

### Triggers

Et workflow kan startes på flere måder. De tre mest almindelige er:

```yaml
on:
  push:
    branches: ["main"] # når der bliver pushet til main
  schedule:
    - cron: "0 6 * * 1,4" # på faste tidspunkter
  workflow_dispatch: # manuelt med en knap under Actions
```

### Cron: hvornår skal det køre?

`schedule` bruger et **cron-udtryk** med fem felter:

```txt
┌───────── minut (0-59)
│ ┌─────── time (0-23, UTC)
│ │ ┌───── dag i måneden (1-31)
│ │ │ ┌─── måned (1-12)
│ │ │ │ ┌─ ugedag (0-6, søndag = 0)
│ │ │ │ │
0 6 * * 1,4
```

`0 6 * * 1,4` betyder: kl. 06:00 UTC hver mandag (`1`) og torsdag (`4`). `*` betyder "alle". Du kan afprøve cron-udtryk på [crontab.guru](https://crontab.guru).

## 2. Sådan virker keep-alive

Workflowet laver ét lille GET-request til en tabel i din database. Det er præcis samme slags request, som du laver i Thunder Client eller med `fetch` i React:

```txt
GET https://dit-project-id.supabase.co/rest/v1/posts?select=*&limit=1
```

- `select=*&limit=1` henter højst én række, så kaldet er så lille som muligt
- Fordi det er en rigtig forespørgsel mod databasen, kan Supabase se, at projektet bliver brugt
- Mandag og torsdag betyder, at der højst går 4 dage mellem to ping, hvilket er et godt stykke under Supabases grænse på ca. 7 dage

### Hvorfor ikke bare pinge `/rest/v1`?

Man kunne tro, det var nok at pinge roden af API'et. Men `/rest/v1` kræver en **secret key** og svarer `401 Secret API key required`, når man bruger en publishable key. Derfor pinger vi en tabel, som din publishable key har adgang til.

Endpoints som `/auth/v1/health` er heller ikke gode. De svarer, uden at databasen nødvendigvis bliver brugt.

## 3. Opsætning trin for trin

### 3.1 Find dine værdier i Supabase

Du skal bruge to ting fra dit Supabase-projekt (**Project Settings** -> **API**):

| Variabel               | Eksempel                                     |
| ---------------------- | -------------------------------------------- |
| `VITE_SUPABASE_URL`    | `https://dit-project-id.supabase.co/rest/v1` |
| `VITE_SUPABASE_APIKEY` | `sb_publishable_...`                         |

> **Bemærk:** Workflowet forventer, at URL'en slutter på `/rest/v1`. Bruger dit projekt en URL uden `/rest/v1` (fx fordi du bruger `supabase-js`), så ret URL'en i workflowet til `${{ vars.VITE_SUPABASE_URL }}/rest/v1/$PING_TABLE...`.

Har dit projekt en ældre `anon` key (en lang tekst, der starter med `eyJ...`), virker den også.

### 3.2 Gem værdierne på GitHub

Din `.env` fil bliver ikke pushet til GitHub, så GitHub skal have værdierne et andet sted. Du kan vælge mellem to steder:

**A. Repository variables** (enklest, hvis dit projekt ikke deployes med et environment)

1. Gå til dit repository på GitHub
2. Gå til **Settings** -> **Secrets and variables** -> **Actions**
3. Vælg fanen **Variables**
4. Tilføj `VITE_SUPABASE_URL` og `VITE_SUPABASE_APIKEY`

**B. Environment variables** (hvis du allerede har dem i et environment til deploy, fx `github-pages-deployment`)

1. Gå til **Settings** -> **Environments**
2. Vælg dit environment
3. Tjek at `VITE_SUPABASE_URL` og `VITE_SUPABASE_APIKEY` ligger under **Environment variables**

> **Variables eller secrets?** Det er fint at bruge variables. Den publishable key er lavet til at være offentlig, og alle `VITE_`-variabler bliver alligevel bygget ind i den JavaScript, som brugerne downloader. Det, der beskytter dine data, er Row Level Security (RLS) i Supabase. Hvis du en dag skal bruge en `sb_secret_...` key i et workflow, så skal den ligge som **secret**, og den må aldrig bruges i frontend-kode.

### 3.3 Opret workflow-filen

Opret filen `.github/workflows/supabase-keep-alive.yml` i dit projekt med dette indhold:

```yaml
name: Supabase keep alive

on:
  schedule:
    - cron: "0 6 * * 1,4" # mandag og torsdag kl. 06 (UTC)
  workflow_dispatch: # gør det muligt at køre den manuelt

jobs:
  ping:
    # Brug kun denne linje, hvis dine variabler ligger i et environment (3.2 B)
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

1. **`environment:`** Bruger du repository variables (3.2 A), så slet linjen. Bruger du et environment (3.2 B), så skriv navnet på dit environment.
2. **`PING_TABLE:`** Skriv navnet på en tabel, der findes i **dit** projekt, fx `posts`, `users` eller `products`.

### 3.4 Hvad gør linjerne?

| Linje                             | Betydning                                                                |
| --------------------------------- | ------------------------------------------------------------------------ |
| `schedule` + `cron`               | Kører workflowet mandag og torsdag kl. 06 UTC                            |
| `workflow_dispatch`               | Giver en **Run workflow**-knap, så du selv kan teste det                 |
| `environment`                     | Fortæller GitHub, hvilket environment variablerne skal hentes fra        |
| `runs-on: ubuntu-latest`          | Jobbet kører på en Linux-maskine i skyen                                 |
| `PING_TABLE`                      | Den tabel, der bliver pinget                                             |
| `curl`                            | Kommandolinje-værktøj, der laver et HTTP-request, ligesom `fetch`        |
| `--fail`                          | Får workflowet til at fejle (blive rødt), hvis Supabase svarer med fejl  |
| `-sS -o /dev/null`                | Skjuler svaret, men viser fejlbeskeder                                   |
| `-H "apikey: ..."`                | Sender din API key med som header, ligesom `headers` i `fetch`           |

### 3.5 Commit og push

```bash
git add .github/workflows/supabase-keep-alive.yml
git commit -m "Add Supabase keep-alive workflow"
git push
```

## 4. Test at det virker

Du behøver ikke vente til mandag. Kør workflowet manuelt:

1. Gå til fanen **Actions** i dit repository
2. Vælg **Supabase keep alive** i listen til venstre
3. Klik **Run workflow** -> **Run workflow**
4. Vent et par sekunder og tjek, at kørslen bliver grøn ✅

Fra nu af kører det automatisk mandag og torsdag. Du kan altid se tidligere kørsler under **Actions**.

## 5. Fejlfinding

Hvis kørslen bliver rød ❌, så klik på den og åbn trinnet **Ping Supabase** for at se fejlen.

| Fejl                                   | Årsag                                                       | Løsning                                                                 |
| -------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------- |
| `404`                                  | Tabellen findes ikke                                        | Ret `PING_TABLE` til en tabel, der findes i dit projekt                 |
| `401`                                  | Forkert eller manglende API key                             | Tjek `VITE_SUPABASE_APIKEY` og at variablerne ligger det rigtige sted   |
| `URL rejected: No host part in the URL` | Variablerne kan ikke findes                                 | Tjek navnene, og om `environment:` passer med, hvor variablerne ligger  |
| `401 Secret API key required`          | URL'en peger på `/rest/v1` uden tabelnavn                   | Tjek at `PING_TABLE` er sat, og at URL'en slutter på `/rest/v1`         |
| Workflowet vises ikke under Actions    | Filen ligger forkert eller er ikke pushet                   | Filen skal ligge i `.github/workflows/` på `main`                       |

> **Tip:** Hvis tabellen har RLS slået til uden en policy, der tillader læsning, får du stadig et grønt resultat (med en tom liste). Det er fint. Forespørgslen rammer stadig databasen.

## 6. Godt at vide

- **GitHub slår planlagte workflows fra efter 60 dage uden aktivitet.** Hvis der ikke er blevet committet til dit repository i 60 dage, stopper `schedule`-workflows. Du får en mail om det. Gå til **Actions**, vælg workflowet og klik **Enable workflow** for at slå det til igen.
- **`schedule` kan blive forsinket.** Når der er travlt hos GitHub, kan kørsler blive forsinket, nogle gange med flere timer. Med to ping om ugen betyder det ikke noget.
- **Tidspunkter er i UTC.** `0 6` er kl. 07 dansk vintertid og kl. 08 dansk sommertid.
- **Er projektet allerede sat på pause?** Så hjælper workflowet ikke. Gå ind på [supabase.com/dashboard](https://supabase.com/dashboard) og klik **Restore project** først.
- **Mail ved fejl:** GitHub sender som standard en mail, når et workflow fejler. Så opdager du det, hvis noget går galt.
