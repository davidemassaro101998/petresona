# Regole di lavoro su questo repo

## Verifica ogni modifica come farebbe una persona

Non basta scrivere il codice e dire "fatto". Per ogni modifica, prima di
considerarla conclusa:

1. **Fai la modifica.**
2. **Guarda il risultato vero**, non solo il codice — screenshot reali via
   Playwright, su più dimensioni (mobile stretto tipo iPhone SE, mobile
   normale, tablet/desktop stretto intorno a 768-1024px, desktop largo).
   Un solo screenshot a una sola dimensione non basta: molti bug (tagli,
   barre, testo che esce) si vedono solo a certe larghezze.
3. **Guarda il contesto attorno**, non solo l'elemento toccato — la
   modifica può creare un doppione altrove, rompere la sezione sopra o
   sotto, lasciare asset o codice ormai inutili.
4. **Chiediti onestamente se è fatta bene**, non solo se "funziona
   tecnicamente". Un fix che risolve un problema creandone uno nuovo
   visibile (una barra, una cucitura, un taglio) non è un fix finito.
5. **Pulisci sempre dietro di te**: componenti, immagini, variabili CSS
   o import rimasti senza nessun riferimento vanno rimossi nella stessa
   modifica, non lasciati lì. `npx oxlint` e `npx tsc -b` devono restare
   puliti prima di ogni commit.
6. **Se durante questo controllo trovi qualcosa che non va** — anche non
   richiesto esplicitamente — dillo subito, non aspettare che l'utente
   se ne accorga da solo.

Solo dopo questi passaggi la modifica si considera conclusa e si può
fare commit + push.
