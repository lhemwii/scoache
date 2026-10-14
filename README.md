# Scoaché — refonte du site · 3 propositions

Maquettes navigables de la refonte de [scoache.com](https://scoache.com). Elles suivent toutes la **sitemap Figma** (page *Sitemap*) :

- 4 entrées de navigation : Offre, Cas d’usage, À propos, Nous contacter
- 10 pages, 4 fiches formation et 15 cas d’usage

Les trois propositions partagent le même contenu. Seule la direction artistique change :

| # | Proposition | Inspiration | En une phrase |
|---|---|---|---|
| 1 | **Évolution** — `v1-evolution/` | le site actuel | On garde la grammaire actuelle (fond blanc, cartes à liseré de couleur, bouton noir, bandeau Qualiopi) et on la modernise. |
| 2 | **Conseil** — `v2-conseil/` | bcg.com | Titres serif, blocs arrondis bleu nuit, cartes photo à étiquette vitrée, boutons-pastilles rose poudré. |
| 3 | **Studio** — `v3-studio/` | wjystudios.com | Fond noir, capitales géantes framboise, rail vertical, menu plein écran, liste de clients monumentale, bloc pervenche. |

**Couleurs.** On garde le rouge (#D60B52) et le bleu (#0031FF) de Scoaché, mais on les adoucit : même teinte, moins de saturation.
- Proposition 1 : framboise #C2385F, bleu #3A52B8.
- Proposition 2 : framboise #B93A5F et rose poudré #F3C3D0 ; le bleu devient bleu nuit #151C3F et bleu glacier #DDE3F6.
- Proposition 3 : framboise vive #EC5C85 et pervenche #A7B4FF sur noir.

## Voir les maquettes

Ouvrir `index.html` à la racine. Cette page présente les trois propositions et liste toutes les pages. Sur chaque page, le sélecteur en bas de l’écran permet de passer à la même page dans les autres versions. Aucune installation n’est nécessaire : tout fonctionne en local, ou sur n’importe quel hébergement statique (GitHub Pages, Vercel, Netlify).

## Modifier / régénérer

Les pages HTML sont générées par un petit script Node, sans dépendance :

```sh
node src/build.js
```

- `src/content.js` : tout le contenu (échelles, 15 cas, 4 formations, témoignages, FAQ…). Une modification se répercute sur les 3 versions.
- `src/pages.js` : la structure des pages intérieures, calée sur le bloc « Contenu des pages » de la sitemap.
- `src/parts.js` : les briques HTML partagées (cartes, méga-menus, formulaire, filtres…).
- `src/versions/v1.js`, `v2.js`, `v3.js` : l’en-tête, le pied de page, le hero et la home de chaque proposition.
- `assets/css/base.css` : la mécanique commune. Les fichiers `v1.css`, `v2.css` et `v3.css` contiennent la DA de chaque version.
- `assets/js/site.js` : menus, slider, filtres des cas d’usage (synchronisés avec l’URL, par exemple `?echelle=collectif`), formulaire.

## À valider avec Ilana (contenu provisoire)

- **Repris tel quel du site actuel** : méthode, témoignages, objectifs des formations *Prise de parole* et *Communication impactante*, chiffres (4,9/5 Google, 94 %), coordonnées.
- **Rédigé pour la maquette, à remplacer ou valider** :
  - les 15 cas d’usage, présentés comme des exemples anonymisés ;
  - les programmes des 4 formations ;
  - les objectifs de *Cadre relationnel & performance* et de *Gestion de conflit* ;
  - les délais d’accès, la mention de la référente handicap et la bio d’Ilana ;
  - les formats du collectif et de l’organisation, et la FAQ.
- **Tarifs** : affichés « sur devis », puisque aucun prix n’est publié aujourd’hui. Qualiopi impose d’afficher un tarif sur chaque fiche formation.
- **Portrait d’Ilana** : un emplacement « portrait à venir » est prévu.
- **Polices** : Graphik, utilisée sur le site actuel, est une police payante. Les maquettes utilisent des Google Fonts proches (Hanken Grotesk, Newsreader, Instrument Sans, Archivo).
- **Formulaire** : il est factice, rien n’est envoyé.
