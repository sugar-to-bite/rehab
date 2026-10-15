# RE.HAB

Repository condiviso ufficiale per lo sviluppo dell'MVP RE.HAB.

La prima versione contiene una demo navigabile del percorso post-operatorio del menisco. I dati, il piano e i feedback sono fittizi e vengono salvati esclusivamente nel `localStorage` del browser.

## Avvio locale

```bash
npm install
npm run dev
```

Apri `http://localhost:3000` oppure vai direttamente a `/demo/menisco`.

## Verifiche

```bash
npm run lint
npm run typecheck
npm run build
```

## Perimetro

La demo copre il passaggio fra vista fisioterapista e vista paziente: quadro clinico, piano dimostrativo, pubblicazione, calendario, sessione, feedback e consultazione dello storico. Non include ancora autenticazione, backend o dati clinici reali.

Vedi [docs/demo-mvp-menisco.md](docs/demo-mvp-menisco.md) per lo scenario dimostrativo e i criteri di verifica.
