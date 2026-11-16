---
title: "Premiers pas dans Blender : interface, navigation et modes"
description: "Comprendre l'interface de Blender, naviguer dans la vue 3D et maîtriser les trois modes de travail — mes notes de démarrage sur le logiciel de 3D gratuit."
pubDate: 2026-06-12
tags: ["Blender", "3D", "Débutant", "Tutoriel"]
---

Après avoir digéré [le vocabulaire 3D](/fr/blog/3d-glossary/), il était temps d'ouvrir Blender pour de bon. Le premier réflexe que tous les tutoriels martèlent : **on travaille au clavier, pas dans les menus**. Apprendre les raccourcis dès le départ change tout en termes de vitesse.

Voici mes notes de démarrage, condensées au même endroit.

## L'interface

Au lancement, l'_écran d'accueil_ propose plusieurs modes (**General**, 2D Animation, Sculpting, VFX, Editing). Ce ne sont que des interfaces préconfigurées : on peut passer de l'une à l'autre à tout moment, inutile donc de stresser sur le choix initial.

L'écran est divisé en quelques zones clés :

| Zone                            | Rôle                                                    |
| ------------------------------- | ------------------------------------------------------- |
| **Viewport**                    | La fenêtre 3D principale, là où tout se passe           |
| **Outliner** (en haut à droite) | La hiérarchie de la scène : objets, caméra, lumières    |
| **Properties** (à droite)       | Rendu, propriétés de l'objet, modificateurs, matériaux… |
| **Timeline** (en bas)           | L'animation — 250 images par défaut à 25 i/s            |

Tous les panneaux se redimensionnent et se combinent ; on peut même ouvrir plusieurs viewports sur la même scène. En haut, une barre d'onglets organise le travail par étape : Layout, Modeling, Sculpting, UV Editing, Shading, Animation, Rendering…

Trois raccourcis de fichier à retenir tout de suite :

| Action      | Raccourci          |
| ----------- | ------------------ |
| Enregistrer | `Ctrl + S`         |
| Annuler     | `Ctrl + Z`         |
| Rétablir    | `Ctrl + Shift + Z` |

## Naviguer dans la vue 3D

Se déplacer dans la scène repose surtout sur la molette de la souris :

| Action                                            | Raccourci                        |
| ------------------------------------------------- | -------------------------------- |
| Orbiter (tourner autour)                          | Clic molette + glisser           |
| Zoom avant / arrière                              | Molette                          |
| Déplacer la vue (pan)                             | `Shift` + clic molette + glisser |
| Afficher le panneau latéral (position, rotation…) | `N`                              |
| Vue de face / de dessus / de côté                 | `1` / `7` / `3` (pavé numérique) |
| Vue opposée                                       | `Ctrl + 1 / 7 / 3`               |

> Une distinction qui m'a aidé : la **caméra de travail** (notre point de vue libre) est indépendante de la **caméra de rendu**, celle qui définit l'image finale. Se déplacer dans le viewport ne déplace pas la caméra de rendu.

## Les trois modes de travail

C'est le concept central de Blender. On bascule d'un mode à l'autre selon ce qu'on veut faire :

| Mode            | Accès          | Rôle                                                       |
| --------------- | -------------- | ---------------------------------------------------------- |
| **Object Mode** | Par défaut     | Déplacer, positionner, dupliquer des objets                |
| **Edit Mode**   | `Tab`          | Modifier la géométrie : vertices, arêtes, faces            |
| **Sculpt Mode** | Menu déroulant | Sculpter comme de l'argile (demande beaucoup de géométrie) |

La touche `Tab` bascule entre l'Object Mode et l'Edit Mode — on s'en sert constamment.

## Object Mode : manipuler les objets

Trois transformations fondamentales, qu'on peut contraindre à un axe en appuyant ensuite sur `X`, `Y` ou `Z` :

| Action          | Raccourci |
| --------------- | --------- |
| Déplacer (Grab) | `G`       |
| Rotation        | `R`       |
| Échelle (Scale) | `S`       |

> Astuce : après `G`/`R`/`S`, `Shift + X/Y/Z` contraint sur **tous les axes sauf** celui indiqué. Et un clic droit annule la transformation en cours.

Pour gérer les objets eux-mêmes :

| Action                | Raccourci               |
| --------------------- | ----------------------- |
| Ajouter une primitive | `Shift + A` → Mesh      |
| Dupliquer             | `Shift + D`             |
| Supprimer             | `X`                     |
| Copier / Coller       | `Ctrl + C` / `Ctrl + V` |

Les primitives disponibles incluent : cube, sphère, cylindre, cercle… et **Suzanne**, la tête de singe emblématique de Blender, qui sert de modèle de test universel.

## Edit Mode : façonner la géométrie

En Edit Mode, on sélectionne des éléments à trois niveaux :

| Élément                            | Raccourci |
| ---------------------------------- | --------- |
| Vertices                           | `1`       |
| Arêtes (edges)                     | `2`       |
| Faces                              | `3`       |
| Tout sélectionner / désélectionner | `A`       |

Et voici les outils que j'utilise déjà le plus :

| Outil    | Raccourci             | Usage                                                |
| -------- | --------------------- | ---------------------------------------------------- |
| Extrude  | `E`                   | Créer du volume à partir d'une face                  |
| Inset    | `I`                   | Créer une face plus petite à l'intérieur d'une autre |
| Bevel    | `Ctrl + B`            | Arrondir une arête (+ molette = nombre de segments)  |
| Loop Cut | `Ctrl + R`            | Ajouter une coupe en boucle                          |
| Knife    | `K` → clic → `Entrée` | Couper la géométrie à main levée                     |
| Fill     | `F`                   | Créer une face entre les points sélectionnés         |

> Un piège à connaître pour supprimer proprement : avec `X`, **Dissolve Edge** supprime l'arête sans laisser de trou, alors que **Delete Edge** en laisse un. On veut presque toujours la première option.

## Sculpt Mode et modificateurs : la suite

Deux notions que je n'ai fait qu'effleurer et qui méritent leur propre article :

- Le **Sculpt Mode** demande une géométrie _dense_. Sur un cube de 6 faces, il ne se passe presque rien : la bonne pratique est de partir d'une sphère avec beaucoup de segments, puis de la subdiviser.
- Les **modificateurs** (_modifiers_) modifient un objet de façon non destructive (toujours ajustables, jamais figés). Les indispensables pour débuter : **Subdivision Surface** (lisser), **Bevel** (arrondir), **Array** (répéter en grille) et **Boolean** (creuser ou fusionner des volumes). Ils s'empilent dans un ordre qu'on peut réorganiser.

---

Avec ces raccourcis, je suis passé de « perdu dans les menus » à « capable de modéliser une forme simple » en une seule session. La suite logique : un vrai petit projet de modélisation de A à Z — je le documenterai ici.

_Notes prises à partir de tutoriels pour débutants des chaînes Apprendre Blender et KyneSilverhide._
