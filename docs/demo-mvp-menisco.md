# Demo MVP menisco

## Obiettivo

Validare un flusso dimostrativo completo nel quale il fisioterapista registra il quadro clinico, prepara e pubblica un piano, mentre il paziente consulta il calendario, esegue una sessione e invia il feedback.

## Scenario

La demo utilizza un paziente, un piano e contenuti clinici interamente fittizi. Non costituisce un protocollo terapeutico e non deve essere utilizzata con dati reali.

## Flusso da mostrare

1. Aprire la vista fisioterapista.
2. Consultare o modificare il quadro clinico strutturato.
3. Verificare il piano e gli esercizi della prima settimana.
4. Confermare e pubblicare il piano.
5. Passare alla vista paziente.
6. Consultare piano e calendario.
7. Registrare esito, dolore e difficoltà per ogni esercizio.
8. Inviare il riepilogo della sessione.
9. Tornare alla vista fisioterapista e verificare il feedback ricevuto.

## Criteri di verifica

- Il piano non è disponibile al paziente prima della pubblicazione.
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
