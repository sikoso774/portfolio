---
title: "Premiers pas sur Blender : interface, navigation et modes"
description: "Comprendre l'interface de Blender, naviguer dans le viewport et maîtriser les trois modes de travail — mes notes de démarrage sur le logiciel de 3D libre."
pubDate: 2026-06-12
tags: ["Blender", "3D", "Débutant", "Tutoriel"]
---

Après avoir digéré [le vocabulaire de la 3D](/blog/vocabulaire-3d), il était temps d'ouvrir Blender pour de vrai. Premier réflexe que tous les tutoriels martèlent : **on travaille au clavier, pas dans les menus**. Apprendre les raccourcis dès le début change tout sur la vitesse.

Voici mes notes de démarrage, condensées en un seul endroit.

## L'interface

Au lancement, le *splash screen* propose plusieurs modes (**General**, 2D Animation, Sculpting, VFX, Editing). Ce ne sont que des interfaces préconfigurées : on peut passer de l'une à l'autre à tout moment, donc inutile de se stresser sur le choix de départ.

L'écran se découpe en quelques zones clés :

| Zone | Rôle |
|---|---|
| **Viewport** | La fenêtre 3D principale, là où tout se passe |
| **Outliner** (haut droite) | La hiérarchie de la scène : objets, caméra, lumières |
| **Properties** (droite) | Rendu, propriétés d'objet, modifiers, matériaux… |
| **Timeline** (bas) | L'animation — 250 frames par défaut à 25 fps |

Les fenêtres sont toutes redimensionnables et combinables ; on peut même ouvrir plusieurs viewports sur la même scène. En haut, une barre d'onglets organise le travail par étape : Layout, Modeling, Sculpting, UV Editing, Shading, Animation, Rendering…

Trois raccourcis fichier à graver tout de suite :

| Action | Raccourci |
|---|---|
| Sauvegarder | `Ctrl + S` |
| Annuler | `Ctrl + Z` |
| Rétablir | `Ctrl + Shift + Z` |

## Naviguer dans le viewport

Se déplacer dans la scène repose surtout sur la molette de la souris :

| Action | Raccourci |
|---|---|
| Orbiter (tourner autour) | Clic molette |
| Zoomer / dézoomer | Roulette |
| Se déplacer latéralement | `Shift` + clic molette |
| Afficher le panneau latéral (position, rotation…) | `N` |
| Vue de face / dessus / côté | `1` / `7` / `3` (pavé numérique) |
| Vue opposée | `Ctrl + 1 / 7 / 3` |

> Une distinction qui m'a aidé : la **caméra de travail** (notre point de vue libre) est indépendante de la **caméra de rendu**, celle qui définit l'image finale. Bouger dans le viewport ne déplace pas la caméra de rendu.

## Les trois modes de travail

C'est le concept central de Blender. On bascule entre des modes selon ce qu'on veut faire :

| Mode | Accès | Rôle |
|---|---|---|
| **Object Mode** | Par défaut | Déplacer, positionner, dupliquer les objets |
| **Edit Mode** | `Tab` | Modifier la géométrie : points, arêtes, faces |
| **Sculpt Mode** | Menu déroulant | Sculpter comme de l'argile (demande beaucoup de géométrie) |

La touche `Tab` fait l'aller-retour entre Object Mode et Edit Mode — on l'utilise en permanence.

## Object Mode : manipuler les objets

Trois transformations fondamentales, qu'on peut contraindre à un axe en appuyant ensuite sur `X`, `Y` ou `Z` :

| Action | Raccourci |
|---|---|
| Déplacer (Grab) | `G` |
| Pivoter (Rotate) | `R` |
| Mettre à l'échelle (Scale) | `S` |

> Astuce : après `G`/`R`/`S`, `Shift + X/Y/Z` contraint sur **tous les axes sauf** celui indiqué. Et un clic droit annule la transformation en cours.

Pour gérer les objets eux-mêmes :

| Action | Raccourci |
|---|---|
| Ajouter une primitive | `Shift + A` → Mesh |
| Dupliquer | `Shift + D` |
| Supprimer | `X` |
| Copier / coller | `Ctrl + C` / `Ctrl + V` |

Parmi les primitives : cube, sphère, cylindre, cercle… et **Suzanne**, le singe emblématique de Blender qui sert de modèle de test universel.

## Edit Mode : sculpter la géométrie

On y sélectionne les éléments selon trois niveaux :

| Élément | Raccourci |
|---|---|
| Vertices (points) | `1` |
| Edges (arêtes) | `2` |
| Faces | `3` |
| Tout (dé)sélectionner | `A` |

Et voici les outils que j'utilise déjà le plus :

| Outil | Raccourci | Usage |
|---|---|---|
| Extrude | `E` | Créer du volume à partir d'une face |
| Inset | `I` | Créer une face plus petite à l'intérieur |
| Bevel | `Ctrl + B` | Arrondir une arête (+ roulette = nombre de segments) |
| Loop Cut | `Ctrl + R` | Ajouter une boucle de découpe |
| Knife (couteau) | `K` → clic → `Entrée` | Découpe libre dans la géométrie |
| Fill | `F` | Créer une face entre des points sélectionnés |

> Un piège à connaître pour supprimer proprement : avec `X`, **Dissolve Edge** retire l'arête sans laisser de trou, alors que **Delete Edge** en laisse un. On veut presque toujours le premier.

## Sculpt Mode et modifiers : ce qui vient ensuite

Deux notions que j'ai juste effleurées et qui méritent leur propre article :

- **Le Sculpt Mode** nécessite une géométrie *dense*. Sur un cube à 6 faces, il ne se passe quasiment rien : la bonne pratique est de partir d'une sphère avec beaucoup de segments, puis de subdiviser.
- **Les modifiers** modifient un objet de façon non destructive (toujours réglable, jamais figé). Les indispensables pour débuter : **Subdivision Surface** (lisser), **Bevel** (arrondir), **Array** (répéter en réseau) et **Boolean** (creuser ou fusionner des volumes). Ils se cumulent dans un ordre qu'on peut réarranger.

---

Avec ces raccourcis, je suis passé de « perdu dans les menus » à « capable de modéliser une forme simple » en une session. La suite logique : un vrai petit projet de modélisation du début à la fin — je le documenterai ici.

*Notes prises à partir des tutoriels débutants des chaînes Apprendre Blender et KyneSilverhide.*
