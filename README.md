# Scooter Tuner

CFW-Builder für Ninebot/Segway **G3 Max**, **F3 Pro** und **ZT3 Pro**.
Läuft vollständig im Browser — **kein Server, kein Upload, keine Anmeldung**.
Die Dateien werden auf dem eigenen Gerät gebaut und verlassen es nicht.

**→ [App öffnen](https://dwjjws85y4-collab.github.io/scooter-tuner/)**

## Was die App macht
- Firmware-Pakete bauen (VCU und MCU), fertig zum Flashen mit SHU
- **Jede Datei vor der Ausgabe prüfen**: Kennung, Vektortabelle, jeder
  eingebaute Sprung, Bremslimiter, `info.json`-Dialekt
- **Fremde Dateien prüfen**, die man aus einer Gruppe bekommen hat: Was steckt
  wirklich drin? Nur Zahlen geändert, oder läuft fremder Code mit?
- Roller über Bluetooth auslesen und flashen (Chrome/Edge, Android — **nicht
  auf iPhone**, Apple sperrt Bluetooth in jedem Browser dort)
- Zu jeder Datei die passende **Stock-Rettung** daneben

## Auf den Startbildschirm legen
Im Browser öffnen → Menü → *Zum Startbildschirm hinzufügen*. Danach eigenes
Symbol, kein Browser-Rahmen, läuft auch ohne Netz.

## Wichtig
**Nichts davon ist an echter Hardware erprobt.** Wer flasht, legt vorher die
Stock-Rettungsdatei bereit. Ein Abbruch mitten in der Übertragung hinterlässt
eine halbe Firmware im Roller — die App verlangt deshalb eine Rückfall-Datei,
bevor sie überhaupt sendet.

Bluetooth braucht eine https-Seite. Die Einzeldatei zum Verschicken kann
Dateien bauen und prüfen, aber nicht flashen — dafür ist dieser Link da.
