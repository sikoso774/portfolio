---
title: "Glossaire 3D : les termes essentiels de la modélisation 3D pour débutants"
description: "Un glossaire 3D pour débutants : mesh, vertex, topologie, UV, normales, PBR et plus encore — les termes essentiels de la modélisation 3D que j'ai appris en démarrant avec Blender."
pubDate: 2026-06-11
tags: ["Blender", "3D", "Débutant", "Apprentissage"]
---

J'ai commencé la 3D avec Blender, et le premier obstacle n'était pas le logiciel : c'était le **vocabulaire**. La 3D utilise l'anglais comme langue commune, et tomber sur des mots comme _mesh_, _normal_ ou _topology_ sans les comprendre rend n'importe quel tutoriel illisible.

Voici le glossaire que j'ai constitué pour me bâtir des bases solides. Je le garde ici autant pour moi que pour quiconque débute.

> 💡 Un conseil que j'ai retenu : **n'utilisez pas une version traduite de votre logiciel 3D**. Les termes traduits ne correspondent à rien dans les tutoriels, qui sont presque tous en anglais.

## Géométrie de base

Tout objet 3D est construit à partir de quelques briques fondamentales :

| Terme                       | Définition                                                                 |
| --------------------------- | -------------------------------------------------------------------------- |
| **Mesh**                    | Un ensemble de polygones qui forment un objet 3D (le « maillage »)         |
| **Vertex**                  | Un point dans l'espace ; pluriel _vertices_ (les « sommets »)              |
| **Edge**                    | Un segment qui relie deux vertices (l'« arête »)                           |
| **Face**                    | Une surface plane définie par plusieurs arêtes — synonyme de polygone      |
| **Normal**                  | Un vecteur qui indique l'orientation d'une face (crucial pour l'éclairage) |
| **Triangle / Quad / N-gon** | Types de faces selon leur nombre de vertices : 3, 4, ou davantage          |

La **normale** revient constamment dès qu'on parle d'éclairage ou de rendu : si elle pointe dans le mauvais sens, une face peut devenir invisible ou mal éclairée.

## Topologie et maillage

Dès qu'on commence à manipuler la géométrie, ces termes deviennent indispensables :

- **Topology (topologie)** — l'organisation des vertices, des arêtes et des faces dans un modèle. Une « bonne » topologie facilite l'animation et le rendu.
- **Retopology (retopologie)** — reconstruire un maillage simplifié par-dessus un modèle lourd (typiquement après du sculpt) pour l'optimiser.
- **Decimation (décimation)** — la réduction _automatique_ du nombre de polygones.
- **High poly / Low poly** — des modèles à forte ou à faible densité de polygones. Le high poly est très détaillé, le low poly très léger.
- **Subdivision** (souvent _subd_) — ajouter du détail grâce à un lissage automatique du maillage.
- **Remesh** — un recalcul automatique du maillage pour uniformiser les polygones.

## Sculpt

Blender permet de sculpter comme de l'argile. Quelques termes propres à cette discipline :

- **Sculpting (sculpt)** — la modélisation organique (visages, créatures…), dans l'esprit de ZBrush.
- **Dyntopo** (topologie dynamique) — un mode où le maillage devient plus dense là où l'on travaille, et reste léger ailleurs.
- **Masking (masque)** — protéger une zone du sculpt pour ne travailler que sur le reste.

## Matériaux et textures

C'est la partie qui donne vie à un modèle :

| Terme                         | Définition                                                                              |
| ----------------------------- | --------------------------------------------------------------------------------------- |
| **Shader**                    | Un programme qui détermine comment la lumière interagit avec une surface                |
| **Texture**                   | Une simple image appliquée à un modèle pour définir son apparence                       |
| **Texture map**               | Un fichier image contenant _une_ propriété d'un matériau                                |
| **Base color**                | La couleur de base d'un matériau                                                        |
| **Normal map**                | Simule le détail d'une surface sans modifier la géométrie (la fameuse image rose/bleue) |
| **Bump map**                  | Une alternative plus simple à la normal map, en niveaux de gris                         |
| **Height / Displacement map** | Déforme réellement le maillage à partir d'une image                                     |
| **Ambient occlusion**         | Simule des ombres douces dans les creux, pour plus de réalisme                          |
| **Alpha channel**             | Contrôle la transparence d'un matériau                                                  |

Deux notions reviennent partout : le **Principled BSDF**, le shader le plus complet et le plus simple de Blender, et le **PBR** (_Physically Based Rendering_), une méthode de rendu réaliste fondée sur la physique.

Mention spéciale pour la **diffusion sous-surfacique** (_subsurface scattering_) : la simulation de la lumière qui pénètre et se diffuse à l'intérieur d'un matériau comme la peau, la cire d'une bougie ou les oreilles. C'est ce qui rend un visage convaincant.

## UV et rendu

- **UV mapping** — projeter une texture 2D sur un modèle 3D.
- **UV unwrapping** — « déplier » un objet 3D à plat pour pouvoir le texturer sans distorsion.
- **Rendering (rendu)** — générer une image finale à partir d'une scène 3D.
- **Render engine (moteur de rendu)** — le moteur qui calcule le rendu. Dans Blender : **Cycles** (puissant mais lent) et **EEVEE** (temps réel, ultra rapide, un peu moins réaliste).
- **Real-time rendering (rendu en temps réel)** — un rendu calculé sans attendre, comme avec EEVEE.
- **HDRI** — une image à 360° utilisée comme source d'éclairage réaliste, très simple à mettre en place.

## Animation et rigging

| Terme               | Définition                                                          |
| ------------------- | ------------------------------------------------------------------- |
| **Armature**        | Un squelette pour animer un objet                                   |
| **Bone**            | Un segment du squelette (l'« os »)                                  |
| **Rigging**         | Ajouter un squelette et des contrôles d'animation                   |
| **Skinning**        | Attacher le maillage aux os                                         |
| **Weight painting** | Répartir l'influence de chaque os sur le maillage                   |
| **IK / FK**         | Cinématique _inverse_ (depuis l'extrémité) ou _directe_ (os par os) |
| **Keyframe**        | Une image clé qui marque un changement dans l'animation             |
| **Motion capture**  | Capturer un mouvement réel pour l'appliquer à un modèle             |

Côté outils d'animation : la **timeline** représente l'animation dans le temps, et le **graph editor** affiche des courbes pour affiner les transitions entre les images clés.

## Outils, formats et écosystème

Enfin, le vocabulaire du « pipeline » :

- **Pipeline** — l'enchaînement des étapes d'une production 3D : modélisation → texturing → rigging → animation → rendu.
- **Modifier (modificateur)** — un effet _non destructif_ appliqué à un modèle (miroir, array, subdivision…).
- **Boolean (booléen)** — fusionner, soustraire ou intersecter deux objets.
- **Gizmo** — le contrôleur visuel pour déplacer, tourner ou mettre à l'échelle.
- **Outliner** — la vue hiérarchique des objets de la scène.
- **Autres logiciels** : ZBrush, Maya, 3DS Max, Houdini. **Unreal Engine** et **Unity** sont des moteurs de jeu en temps réel.
- **Formats** : FBX, OBJ, BLEND, MAX pour la 3D ; PNG (avec transparence) et JPEG pour les textures.
- **CG / CGI** — _Computer Generated Imagery_, des images créées par ordinateur (effets spéciaux, animation, jeux vidéo).

---

Avec ce glossaire en tête, les tutoriels deviennent d'un coup bien plus lisibles. Ma prochaine étape : prendre en main l'interface de Blender — ce sera le sujet du prochain article.

_Notes prises à partir de la vidéo « Vocabulaire 3D » de la chaîne Apprendre Blender._
