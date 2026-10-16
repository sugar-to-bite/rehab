# Linee guida UI/UX di RE.HAB

Questo documento è il riferimento condiviso per ogni sviluppo UI/UX dell'app. Prima di introdurre o modificare schermate, componenti, testi o flussi, verificare la coerenza con queste regole e aggiornare il documento quando emerge una nuova decisione riutilizzabile.

## Principi

- Rendere sempre evidente se l'utente sta consultando, modificando o pubblicando dati.
- Privilegiare chiarezza clinica, tracciabilità e prevenzione degli errori rispetto alla velocità percepita.
- Mostrare una sola azione primaria per contesto; le azioni secondarie non devono competere visivamente.
- Usare termini concreti che descrivano l'effetto: `Salva bozza`, `Approva e pubblica`, `Annulla`.
- Non usare `Salva` quando l'azione rende dati visibili al paziente.
- Il paziente vede solo contenuti esplicitamente approvati e pubblicati dal professionista.

## Stati dei contenuti clinici

Ogni contenuto modificabile deve rendere visibile il proprio stato:

- **Nessun contenuto**: empty state con spiegazione breve e CTA di creazione.
- **Bozza**: badge ambra; non visibile al paziente.
- **Pubblicato/attivo**: badge verde con numero di versione, quando applicabile.
- **Revisione in corso**: badge blu; la versione pubblicata precedente resta disponibile al paziente.
- **Errore o attenzione clinica**: corallo/rosso, accompagnato da testo e non comunicato solo tramite colore.

## Consultazione e modifica

- Le schermate di dettaglio sono read-only per impostazione predefinita.
- Il comando `Modifica` è posizionato in alto a destra del pannello interessato.
- La modalità modifica sostituisce `Modifica` con `Annulla` e `Salva bozza`.
- `Annulla` ripristina l'ultima versione salvata senza effetti esterni.
- Campi read-only sono mostrati come testo strutturato, non come input disabilitati.
- Una modifica a un contenuto già pubblicato crea una bozza/revisione; non modifica silenziosamente ciò che vede il paziente.

## Creazione e pubblicazione dei piani

1. In assenza di piano, mostrare `Crea piano` nelle sezioni pertinenti.
2. La creazione apre un editor dedicato con informazioni del piano ed esercizi della prima settimana.
3. I valori suggeriti o dimostrativi possono essere precompilati, ma devono restare modificabili e dichiarati.
4. `Salva bozza` porta alle viste read-only senza rendere il piano visibile al paziente.
5. `Approva e pubblica` richiede una conferma esplicita di avvenuta verifica clinica.
6. La pubblicazione genera una versione e una voce nel log delle modifiche.

## Gerarchia delle azioni

- **Primaria**: sfondo teal; una sola per area decisionale.
- **Secondaria**: fondo bianco e bordo neutro, per esempio `Modifica`.
- **Terziaria**: stile ghost, per esempio `Annulla`.
- Le azioni di salvataggio negli editor lunghi restano visibili in una barra inferiore sticky.
- Le azioni distruttive richiedono stile e conferma dedicati; non riutilizzare il colore primario.

## Struttura visiva

- Header del pannello: titolo a sinistra; stato e azioni a destra.
- Contenuti raggruppati in card con bordo leggero, raggio coerente e spaziatura regolare.
- Etichette brevi sopra i valori; contenuto leggibile sotto.
- Empty state con icona, titolo, descrizione e una CTA.
- Usare gli stessi componenti per badge, pulsanti, campi, note informative ed empty state in tutta l'app.

## Linguaggio

- Testi brevi, diretti e non ambigui.
- Distinguere sempre tra `bozza`, `approvato` e `pubblicato`.
- Dichiarare chiaramente dati fittizi, suggerimenti automatici e contenuti non ancora verificati.
- Evitare linguaggio che faccia sembrare automatica una decisione clinica.

## Accessibilità e responsive

- Target interattivi di almeno 44 px.
- Label associate a ogni input; icone decorative escluse dalle tecnologie assistive.
- Focus visibile e navigazione completa da tastiera.
- Contrasto sufficiente e significato mai affidato al solo colore.
- Su mobile, griglie e barre di azione diventano verticali senza perdere gerarchia o contesto.

## Tracciabilità

- Registrare creazione, salvataggio, approvazione, pubblicazione e revisione.
- Mostrare autore, data e versione per i contenuti clinici pubblicati.
- Non sovrascrivere una versione pubblicata mentre esiste una revisione in bozza.

## Riferimenti di prodotto

Il modello generale prende spunto dai flussi professionista-paziente di Physitrack/PhysiApp e MedBridge: il professionista prepara e assegna il programma; il paziente consulta ed esegue esclusivamente il programma pubblicato.

