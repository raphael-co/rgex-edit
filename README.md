````md
# Regex Editor — Next.js 15 + TS

Éditeur d’expressions régulières **modulaire** et **thématisé** (Email, Mot de passe, URL, IPv4, Date, Custom) construit sur **Next.js 15 (App Router) + TypeScript**, **Tailwind**, **theming** et **i18n**.

## 🚀 Démarrage rapide
```bash
git clone <votre-repo> regex-editor
cd regex-editor
npm i
npm run dev
# Ouvrir http://localhost:3000 (redirige vers /fr ou /en)
````

## 🧭 Routes utiles

* Page principale : `/fr/regex` ou `/en/regex`
* API d’exemple : `/api/hello`

## ✨ Fonctionnalités clés

* **Éditeur Regex** en temps réel :

  * surbrillance des matches, affichage des groupes **numérotés** et **nommés**
  * panneau **Remplacement** avec prévisualisation (texte remplacé)
  * **mesure de perf** (ms) et limite anti-boucle (10 000 matches)
* **Thèmes** prêts à l’emploi (panneaux dédiés) :

  * **Custom** (édition libre), **Email**, **Password**, **URL**, **IPv4**, **Date**
  * chaque thème **génère** `pattern`, `flags`, `test`, `replace`
* **UX avancée** dans l’aperçu :

  * navigation entre occurrences (◀︎ / ▶︎), **zoom police**, **wrap/no-wrap**, **swap** des volets
  * copie de l’**HTML surligné**, copie du **texte d’entrée/sortie**, **export .txt** du résultat
* **Presets** (optionnel) :

  * CRUD + **import/export JSON**, **partage d’URL** (état encodé en Base64)
  * persistance via `localStorage`
* **i18n** : fr/en via `middleware.ts` + dictionnaires JSON
* **Theming** : clair/sombre/système

## 🧱 Stack

* **Next.js 15** (App Router) + **TypeScript**
* **Tailwind CSS**
* **Theming** (provider custom avec `next-themes`)
* **i18n** par **middleware** + fichiers `dictionnaire/{fr,en}.json`

## 🗂️ Structure (extrait)

```
app/
  [locale]/
    page.tsx          # démo i18n (si conservée)
    regex/page.tsx    # page de l'éditeur
  api/hello/route.ts
  layout.tsx          # détection locale (cookies + Accept-Language)
components/
  RegexEditor.tsx
  regex/
    types.ts
    constants.ts
    utils.ts
    useLocalStorage.ts
    ThemePicker.tsx
    ThemePanel.tsx
    PatternControls.tsx
    PresetsPanel.tsx         # optionnel (peut être commenté)
    Cheatsheet.tsx
    TestInput.tsx
    PreviewPane.tsx
    ResultsTable.tsx
    themes/
      EmailTheme.tsx
      PasswordTheme.tsx
      UrlTheme.tsx
      IPv4Theme.tsx
      DateTheme.tsx
dictionnaire/
  fr.json
  en.json
```

## 🔧 Scripts NPM

```bash
npm run dev        # dev server
npm run build      # build production
npm run start      # start production
npm run lint       # lint
```

## ⚙️ Configuration

* **Env**: rien d’obligatoire par défaut. Voir `.env.example` si besoin et dupliquer en `.env.local`.
* **Node**: utilisez la version indiquée par `.nvmrc` (si présent).

## 🌐 i18n (clés ajoutées)

Les clés suivantes sont utilisées par l’éditeur (extrait) :

* Éditeur : `re_title`, `re_intro`, `re_pattern`, `re_replace`, `re_replace_help`, `re_matches`, `re_error`, `re_highlight`, `re_preview_matches`, `re_preview_replaced`, `re_results`, `re_span`, `re_match`, `re_groups`, `re_numbered_groups`, `re_named_groups`, `re_no_match`, `re_clear`, `re_copy_regex`, flags `re_flag_{g,i,m,s,u,y,d}`
* Aide-mémoire : `re_cheatsheet`, `re_tokens`, `re_quantifiers`
* Thèmes : `re_theme_title`, `re_theme_{custom,email,password,url,ipv4,date}` et `*_desc`
* Email : `re_email_allow_plus`, `re_email_allow_dots`, `re_email_allow_subdomains`, `re_email_min_tld`
* Password : `re_pw_minlen`, `re_pw_maxlen`, `re_pw_need_lower`, `re_pw_need_upper`, `re_pw_need_digit`, `re_pw_need_special`, `re_pw_allow_spaces`
* URL : `re_url_allow_query`, `re_url_allow_fragment`
* IPv4 : `re_ipv4_desc`
* Date : `re_date_format`, `re_date_leading_zero`

## ➕ Ajouter un nouveau thème

1. Créer `components/regex/themes/MyTheme.tsx` qui reçoit `{ locale, setPattern, setFlags, setTest, setReplace }` et fixe les valeurs selon vos options.
2. Enregistrer la clé dans `types.ts` (`ThemeKey`) et l’ordre d’affichage dans `constants.ts` (`THEME_ORDER`).
3. Importer et router le composant dans `ThemePanel.tsx`.
4. Ajouter les étiquettes i18n (`re_theme_mytheme`, `re_theme_mytheme_desc`, etc.).

## 🧪 Qualité & Accessibilité

* Contrastes conformes au thème, taille de police ajustable dans l’aperçu, navigation par boutons sur les occurrences.
* Limitation de recherche pour éviter les blocages (motifs vides, lookaheads nuls, etc.).

## 🚀 Déploiement

* **Vercel** recommandé (`next build` puis import du repo).
* Variables d’environnement : aucune obligatoire. Ajouter les vôtres si besoin (analytics, etc.).

## 📄 Licence

Choisissez votre licence (MIT recommandée) et ajoutez `LICENSE` à la racine.

```
```
