# Demo MVP menisco

## Obiettivo

Validare un flusso dimostrativo completo nel quale il fisioterapista registra il quadro clinico, prepara e pubblica un piano, mentre il paziente consulta il calendario, esegue una sessione e invia il feedback.

## Scenario

La demo utilizza un paziente, un piano e contenuti clinici interamente fittizi. Non costituisce un protocollo terapeutico e non deve essere utilizzata con dati reali.

## Flusso da mostrare

1. Aprire la vista fisioterapista.
2. Consultare o modificare il quadro clinico strutturato.
3. Aprire `Info piano` o `Esercizi settimana` e avviare `Crea piano`.
4. Rivedere i dati precompilati e scegliere se salvare la bozza oppure verificare e pubblicare direttamente il piano.
5. Se salvato come bozza, consultare le due sezioni in modalità read-only ed eventualmente modificarle tramite l'azione dedicata.
6. Confermare e pubblicare il piano dalla bozza, se non già pubblicato durante la creazione.
7. Passare alla vista paziente.
8. Consultare piano e calendario.
9. Registrare esito, dolore e difficoltà per ogni esercizio.
10. Inviare il riepilogo della sessione.
11. Tornare alla vista fisioterapista e verificare il feedback ricevuto.

## Criteri di verifica

- Il piano non è disponibile al paziente prima della pubblicazione.
- Le tab `Info piano` ed `Esercizi settimana` sono read-only fuori dalla modalità modifica.
- Il salvataggio della bozza e la pubblicazione sono azioni distinte.
- Le modifiche della scheda e lo stato della demo resistono al ricaricamento della pagina.
- Un esercizio saltato richiede un motivo.
- Il feedback inviato compare nella sezione del fisioterapista.
- Il comando di ripristino riporta la demo allo stato iniziale.

## Limiti intenzionali

- Nessuna autenticazione o autorizzazione.
- Nessun backend o database.
- Nessun dato clinico reale.
- Nessuna generazione automatica del piano.
- Persistenza limitata al `localStorage` del browser.
