# LUMOnova Shopify-Theme — Claude-Code-Kontext

Kontext für Claude Code. Zuerst lesen, bevor du Änderungen machst.

## Was das ist

Handgebautes **Shopify-Theme (Liquid)** für die Smart-Lighting-Marke **LUMOnova**
(C&L Handels GmbH, Formerweg 12, 47877 Willich). **Kein Dawn/Impulse** — aus einem
React-Konzept nach Liquid portiert. `config/settings_schema.json` ist bewusst leer
`[]` (keine globalen Theme-Settings; `settings.favicon` o. Ä. rendert daher nie).

**Nicht verwechseln:** Es gibt ein zweites Repo `lumonova-concept` (React/Vite,
Vercel) — das ist die Präsentations-/Konzeptseite. **Dieses** Repo ist der echte
Shop (Phase 2).

## Deployment — WICHTIG

Das Theme deployt über die **Shopify-GitHub-Integration, gebunden an `main`**
(nicht via CLI-Push). Es ist ein **Zwei-Wege-Sync**:
- Push auf `main` → synchronisiert automatisch ins verbundene Shopify-Theme.
- Änderungen im Shopify-Theme-Editor → werden als `shopify[bot]`-Commits
  ("Update from Shopify for theme …") nach `main` zurück-committet.

**Folge: Ein Push auf `main` kann direkt live gehen.** Deshalb:
- Alles Unfertige auf einem **Feature-Branch** entwickeln, nicht direkt auf `main`.
- Vor Arbeit auf `main` immer `git fetch` — der Editor-Sync oder der Kollege
  können `main` bewegt haben (Merge dann als Fast-Forward/Rebase, **nie** force-push).
- Ob das verbundene Theme live oder unpubliziert ist, steht nur im Shopify-Admin
  (Online Store → Themes). Claude hat **keinen** Zugriff auf den Shopify-Admin.

## Workflow-Regeln (von Leon)

- **Nie** direkt auf `main` pushen ohne Freigabe; **nie** aufs Live-Theme pushen.
- Änderungen vorher mit **Leon + Daniel** (Kollege, Repo-Owner `BallooC-L`,
  `balloo@ozeanos-cl.de`) abstimmen. Daniel pusht oft per GitHub-Web-Upload
  (Commits "Add files via upload").
- Sauber in **thematisch getrennten Commits** arbeiten (Bugs / Compliance /
  Texte / Layout), damit Einzelnes gezielt zurückgenommen werden kann.

## Brand-Regeln (nicht verhandelbar)

- **Matter nur bei SMART+** (und SMART+ ist "Demnächst" / kommt 2026). Erlaubt ist
  Matter ausschließlich an zwei Stellen, je mit "Demnächst"-Kennzeichnung:
  Mega-Menü SMART+-Zeile und SMART+-Tier-Karte. Sonst **kein** Matter, **kein**
  Apple Home, **kein** SmartThings.
- **Kompatibilität pro Tier:**
  - CLASSIC / CLASSIC+ / Panels / Tri-Proof: kein Smart, kein Wi-Fi.
  - SMART (Bulbs): Tuya / Wi-Fi 2.4 GHz, Amazon Alexa & Google Home. **Kein**
    Apple Home, **kein** Matter, **kein** SmartThings.
  - SMART+: Matter, Apple Home, SmartThings — aber "Demnächst 2026".
- **Keine Gedankenstriche** (– oder —) als Stilmittel in Marketing-Texten
  (Punkt/Komma stattdessen). Bereichsangaben bleiben: `Mo–Fr`, `2700K–6500K`,
  `€20–€60`, `A–Z`, Uhrzeiten.
- **Tier-Namen exakt:** CLASSIC / CLASSIC+ / SMART / SMART+. Keine Alternativen
  wie Basic/Pro.
- **Fünf Produktfamilien:** Smart Bulbs, Filament, Panels, Ceiling Lights,
  **Tri-Proof** (IP65-Feuchtraumleuchten, CLASSIC, ohne Smart-/Matter-Claims —
  dort nichts "smart" ergänzen).
- **Amber `#E8A060`** ist die einzige Akzentfarbe. Grün `#4CAF8A` nur für
  Checkmarks / Logo-Tagline.
- **Standort Willich (NRW)** — nicht Hamburg, nicht Berlin.
- **Garantie:** 3 Jahre EU-Garantie (Bulbs); Panels 2 Jahre.
- **E-Mail-Domain immer `lumo-nova.de`**, nie `lumonova.com`. (support@ und info@
  sind beide im Einsatz; welche offiziell wird, klärt Leon mit Daniel.)

## Struktur & wo Inhalte liegen

Standard-Shopify-Layout: `assets/`, `config/`, `layout/`, `locales/`, `sections/`,
`snippets/`, `templates/`.

- **Alle sichtbaren Texte** liegen in `locales/de.default.json` (Default) und
  `locales/en.json`, gepflegt über Shopify **Translate & Adapt**. Beide Dateien
  beginnen mit einem `/* … */`-Kommentarblock → **kein striktes JSON**; vor dem
  Validieren mit strengen Parsern den Header bis zur ersten `{` abschneiden.
  DE- und EN-Keys **symmetrisch** halten (sonst `MatchingTranslations`-Fehler).
- **Homepage-Section-Settings** (Hero-Bild, Atmosphäre-Bilder, Featured
  Collection) liegen in **`templates/index.json`**, NICHT in
  `config/settings_data.json` (dort ist `content_for_index` leer).
- **Bilder** werden als `shopify://shop_images/<dateiname>` referenziert. Die
  Dateien selbst liegen in **Shopify Files (Admin)**, nicht im Repo. Dateinamen
  **nicht raten** — beim Nutzer erfragen oder er weist im Editor zu.

## Validierung

- `shopify theme check` läuft **offline** und ist der Standard-Check. Falls der
  `shopify`-Befehl nicht im PATH ist: `npx shopify theme check`.
- **Bekannte, vorbestehende Lints** (nicht jagen): `ImgWidthAndHeight` an quasi
  jedem `<img>`, `ParserBlockingScript` in `theme.liquid`, `MatchingTranslations`
  für `products.product.on_sale` (fehlt in EN), `MissingAsset` fürs Passwort-Logo.
- Locale-JSON nach jeder Änderung auf Gültigkeit prüfen (Header abschneiden, s. o.).
