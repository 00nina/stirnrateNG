# NG's Stirnraten App

Stirnraten als Web-App fürs iPhone: klassisch oder in Teams, mit fertigen und eigenen Kategorien. Läuft nach dem ersten Öffnen auch ohne Internet.

## Veröffentlichen mit GitHub Pages (kostenlos)

1. Auf github.com ein kostenloses Konto anlegen.
2. Oben rechts auf das Plus klicken, dann „New repository“. Einen Namen vergeben, zum Beispiel `stirnraten`, „Public“ auswählen und auf „Create repository“ klicken.
3. Auf der nächsten Seite auf „uploading an existing file“ klicken. Alle Dateien aus diesem Ordner hineinziehen (die Dateien selbst, nicht den Ordner und nicht die ZIP-Datei) und unten auf „Commit changes“ klicken.
4. Im Repository auf „Settings“, links auf „Pages“. Unter „Branch“ `main` und `/ (root)` wählen und auf „Save“ klicken.
5. Nach ein bis zwei Minuten steht oben auf derselben Seite die Adresse, etwa `https://DEINNAME.github.io/stirnraten/`. Diese Adresse schickst du deinen Freundinnen.

## Aufs iPhone holen

1. Die Adresse in Safari öffnen (nicht in WhatsApp oder Instagram, dort fehlt die Funktion).
2. Auf das Teilen-Symbol tippen und „Zum Home-Bildschirm“ wählen.
3. Die App vom Home-Bildschirm starten. Bei der ersten Runde auf „Erlauben“ tippen, wenn das iPhone nach Bewegung und Ausrichtung fragt.

## Welche Datei macht was

| Datei | Inhalt | Wann du sie anfasst |
|---|---|---|
| `begriffe.js` | Alle fertigen Kategorien und Begriffe | Begriffe oder Kategorien ändern |
| `style.css` | Farben, Schriftgrößen, Abstände | Aussehen ändern, die Farben stehen ganz oben |
| `app.js` | Die Spiellogik, oben ein Abschnitt „Einstellungen“ | Rundenzeiten, Kipp-Empfindlichkeit, Team-Farben |
| `index.html` | Das Gerüst aller Seiten und die festen Texte | Texte auf Knöpfen und in „So geht's“ |
| `manifest.webmanifest` | Name und Icon für den Home-Bildschirm | App umbenennen |
| `sw.js` | Macht die App offline nutzbar | Normalerweise nie |
| `icon-*.png`, `schrift.woff2` | App-Icon und Schrift | Nur beim Austausch |

Jede Datei beginnt mit einem Kommentar, der erklärt, was darin steht.

## Häufige Änderungen

- **Begriff ergänzen:** In `begriffe.js` in der passenden Liste einen Eintrag wie `"Neuer Begriff",` einfügen.
- **Andere Rundenzeiten:** In `app.js` die Zeile `const ZEITEN = [60, 90, 120];` ändern.
- **Kippen reagiert zu früh oder zu spät:** In `app.js` die Werte unter `KIPPEN` anpassen, die Erklärung steht direkt darüber.
- **Farben:** In `style.css` die Werte im Block `:root` ändern.

Eine geänderte Datei lädst du in GitHub über „Add file“, „Upload files“ wieder hoch, sie ersetzt die alte. Nach ein paar Minuten die App auf dem Handy ganz schließen und neu öffnen.

## Gut zu wissen

- Eigene Kategorien liegen nur auf dem jeweiligen Handy. Weitergeben geht über „Kategorie teilen“ und „Kategorie importieren“.
- Ein Begriff kommt erst wieder, wenn alle anderen der Kategorie einmal dran waren. Hat eine eigene Kategorie nur wenige Begriffe, wiederholen sie sich entsprechend früher.
- Mit eingeschalteten Tönen sind die Signale auch im Lautlos-Modus zu hören. Musik vom selben Handy kann dabei pausieren.
- Die Schrift ist Bricolage Grotesque und steht unter der SIL Open Font License.
