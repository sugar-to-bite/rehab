# Migrazione repo condivisa

Questa guida permette di spostare il lavoro futuro dalla repository privata personale alla repository ufficiale condivisa:

- Repository ufficiale: `https://github.com/sugar-to-bite/rehab`
- Branch di produzione: `main`
- Applicazione: `https://rehab-pi-one.vercel.app`

La repository privata precedente rimane soltanto come archivio. Non deve essere trasformata nella nuova repository cambiandone il remote: le due storie Git possono contenere file, decisioni e dipendenze diverse.

## Risultato atteso

Al termine:

- il codice ufficiale è clonato in una nuova cartella locale;
- Codex usa quella cartella come progetto principale;
- le nuove chat e gli agenti lavorano sulla repository `sugar-to-bite/rehab`;
- ogni modifica passa da un branch e da una pull request;
- la vecchia repository privata non riceve altri sviluppi MVP.

## 1. Accettare l'accesso GitHub

1. Accettare l'invito ricevuto su GitHub.
2. Accedere con l'account GitHub corretto.
3. Verificare l'autenticazione:

```powershell
gh auth status
```

4. Verificare i permessi sulla repository:

```powershell
gh api repos/sugar-to-bite/rehab --jq ".permissions"
```

Per contribuire, il risultato deve indicare almeno `push: true`.

## 2. Mettere in sicurezza il lavoro nella repository privata

Aprire un terminale nella vecchia repository privata ed eseguire:

```powershell
git status --short
git branch --show-current
git remote -v
git log -5 --oneline
```

Prima di proseguire:

- non devono esserci modifiche importanti non salvate;
- eventuali modifiche locali vanno committate nella repository privata o annotate;
- non copiare `.git`, `.env*`, `node_modules`, `.next`, token, credenziali o dati personali;
- non cambiare il remote `origin` della repository privata verso `sugar-to-bite/rehab`.

Prompt consigliato per il Codex collegato alla vecchia repository:

```text
Esegui una ricognizione in sola lettura di questa repository privata.
Elenca il lavoro non pubblicato, le modifiche locali e le funzionalità che potrebbero
essere ancora utili per l'MVP condiviso. Non modificare file, non fare push e non
proporre di copiare l'intera repository. Separa chiaramente codice utile, documenti,
configurazioni locali e materiale da non trasferire.
```

Conservare il risultato come riferimento. Il trasferimento di eventuali funzionalità avverrà successivamente, una alla volta e tramite pull request dedicate.

## 3. Clonare la repository condivisa in una nuova cartella

Da PowerShell:

```powershell
cd "$HOME\Documents\GitHub"
git clone https://github.com/sugar-to-bite/rehab.git
cd rehab
```

Se esiste già una cartella chiamata `rehab`, scegliere un nome locale diverso senza modificare il nome remoto:

```powershell
git clone https://github.com/sugar-to-bite/rehab.git rehab-shared
cd rehab-shared
```

Non clonare la repository condivisa dentro la cartella della repository privata.

## 4. Verificare che Git punti alla repository corretta

Eseguire dalla nuova cartella:

```powershell
git rev-parse --show-toplevel
git remote -v
git branch --show-current
git status
git log -1 --oneline
```

Controlli attesi:

- la radice restituita è la nuova cartella locale;
- `origin` è `https://github.com/sugar-to-bite/rehab.git`;
- il branch iniziale è `main`;
- il working tree è pulito.

Se anche uno solo di questi controlli non coincide, fermarsi prima di eseguire commit o push.

## 5. Installare e verificare il progetto

```powershell
npm ci
npm run lint
npm run typecheck
npm run build
npm run dev
```

Aprire `http://localhost:3000` e verificare:

- homepage della demo;
- percorso `/demo/menisco`;
- passaggio fra vista fisioterapista e vista paziente.

Interrompere il server con `Ctrl+C` al termine.

## 6. Collegare la nuova cartella a Codex

Nell'app Codex:

1. Aggiungere o aprire un progetto locale.
2. Selezionare la nuova cartella `rehab` o `rehab-shared`.
3. Impostarla come cartella principale del progetto, se richiesto.
4. Avviare una nuova chat all'interno di questo progetto.
5. Non continuare le vecchie chat associate alla repository privata per nuovi sviluppi condivisi.

Le chat esistenti possono rimanere come storico. I nuovi agenti ereditano la cartella di lavoro della nuova chat: non esiste un remote Git separato da configurare per ogni agente.

Prompt di verifica da inviare nella prima nuova chat:

```text
Prima di modificare qualsiasi file, verifica il progetto corrente.
Esegui git rev-parse --show-toplevel, git remote -v, git branch --show-current
e git status --short. Conferma che la radice sia la nuova cartella condivisa,
che origin sia https://github.com/sugar-to-bite/rehab.git e che non ci siano
modifiche locali inattese. Controlla inoltre se esistono istruzioni AGENTS.md
applicabili. Fermati e segnala qualsiasi differenza.
```

Codex usa la cartella principale per le operazioni Git e per individuare automaticamente eventuali `AGENTS.md`, skill e configurazioni di progetto. Riferimento: [documentazione ufficiale OpenAI sui progetti locali](https://developers.openai.com/fr-FR/docs/projects).

## 7. Primo test di collaborazione

Creare un branch di prova senza modificare `main`:

```powershell
git switch main
git pull --ff-only
git switch -c nome-persona/verifica-setup
```

Verificare l'accesso in scrittura senza pubblicare nulla:

```powershell
git push --dry-run origin HEAD:refs/heads/nome-persona/verifica-setup
```

Se il dry run riesce, eliminare soltanto il branch locale di prova tornando prima a `main`:

```powershell
git switch main
git branch -D nome-persona/verifica-setup
```

Se il comando restituisce `permission denied`, verificare l'accettazione dell'invito e l'account mostrato da `gh auth status`.

## 8. Flusso per ogni sviluppo successivo

Prima di iniziare:

```powershell
git switch main
git pull --ff-only
git switch -c nome-persona/nome-funzionalita
```

Prima del push:

```powershell
npm run lint
npm run typecheck
npm run build
git status
git diff --check
```

Pubblicazione:

```powershell
git add <file-specifici>
git commit -m "Descrizione concisa della modifica"
git push -u origin nome-persona/nome-funzionalita
gh pr create --base main
```

Regole operative:

- non lavorare direttamente su `main`;
- non usare `git push --force` su branch condivisi;
- non migrare cartelle o interi commit dalla repository privata senza revisione;
- mantenere ogni pull request piccola e riferita a un obiettivo verificabile;
- aggiornare il proprio `main` dopo ogni merge.

## 9. Gestire la vecchia repository privata

Dopo il test riuscito:

- mantenerla disponibile come archivio temporaneo;
- non eliminarla finché i contenuti utili non sono stati valutati;
- non avviare nuove chat Codex per lo sviluppo MVP da quella cartella;
- rinominare eventualmente la cartella locale aggiungendo `-legacy` per ridurre gli errori;
- trasferire solo funzionalità espressamente approvate, tramite nuovi branch della repository condivisa.

## Checklist finale

- [ ] Invito GitHub accettato.
- [ ] `gh auth status` mostra l'account corretto.
- [ ] Repository condivisa clonata in una cartella nuova.
- [ ] `origin` punta a `sugar-to-bite/rehab`.
- [ ] Installazione, lint, type-check e build riusciti.
- [ ] Demo locale verificata.
- [ ] Nuovo progetto Codex collegato alla cartella condivisa.
- [ ] Nuova chat Codex conferma radice, remote e branch corretti.
- [ ] Test `git push --dry-run` riuscito.
- [ ] Vecchia repository trattata come archivio e non più come fonte ufficiale.
