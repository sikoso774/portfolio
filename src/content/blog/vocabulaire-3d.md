---
title: "Le vocabulaire de la 3D : le lexique pour bien débuter"
description: "Mesh, vertex, topologie, UV, PBR… Le glossaire des termes essentiels que j'ai dû apprivoiser en démarrant la modélisation 3D sur Blender."
pubDate: 2026-06-11
tags: ["Blender", "3D", "Débutant", "Apprentissage"]
---

Je me suis lancé dans la 3D avec Blender, et la première barrière n'a pas été le logiciel : c'est le **vocabulaire**. La 3D utilise l'anglais comme langue commune, et croiser des mots comme *mesh*, *normale* ou *topologie* sans les comprendre rend n'importe quel tutoriel illisible.

Voici donc le lexique que je me suis constitué pour poser des bases solides. Je le garde ici autant pour moi que pour quiconque débute.

> 💡 Petit conseil que j'ai retenu : **n'utilisez pas une version traduite de votre logiciel 3D**. Les termes traduits ne correspondent à rien dans les tutoriels, qui sont presque tous en anglais.

## La géométrie de base

Tout objet 3D est construit à partir de quelques briques élémentaires :

| Terme | Définition |
|---|---|
| **Mesh** (maillage) | Un ensemble de polygones formant un objet 3D |
| **Vertex** (sommet) | Un point dans l'espace ; pluriel *vertices* |
| **Edge** (arête) | Un segment reliant deux vertices |
| **Face** | Une surface plane définie par plusieurs edges — synonyme de polygone |
| **Normale** | Un vecteur indiquant l'orientation d'une face (crucial pour l'éclairage) |
| **Triangle / Quad / N-gon** | Types de face selon le nombre de sommets : 3, 4, ou plus |

La **normale** revient sans arrêt dès qu'on parle d'éclairage ou de rendu : si elle est mal orientée, une face peut devenir invisible ou mal éclairée.

## Topologie et maillage

Une fois qu'on manipule la géométrie, ces termes deviennent indispensables :

- **Topologie** — l'organisation des vertices, edges et faces d'un modèle. Une « bonne » topologie facilite l'animation et le rendu.
- **Rétopologie** — refaire un maillage simplifié par-dessus un modèle trop lourd (typiquement après une sculpture) pour l'optimiser.
- **Décimation** — la réduction *automatique* du nombre de polygones.
- **High poly / Low poly** — modèles à haute ou basse densité de polygones. Le high poly est très détaillé, le low poly très léger.
- **Subdivision** (souvent *subd*) — l'ajout de détail par lissage automatique du maillage.
- **Remesh** — un recalcul automatique du maillage pour uniformiser les polygones.

## La sculpture

Blender permet de sculpter comme avec de l'argile. Quelques termes propres à cette discipline :

- **Sculpting** — la modélisation organique (visages, créatures…), à la manière de ZBrush.
- **Dyntopo** (dynamic topology) — un mode où le maillage se densifie là où l'on travaille, et reste léger ailleurs.
- **Masking** — protéger une zone de la sculpture pour ne travailler que sur le reste.

## Matériaux et textures

C'est la partie qui donne vie à un modèle :

| Terme | Définition |
|---|---|
| **Shader** | Un programme qui détermine comment la lumière interagit avec une surface |
| **Texture** | Une simple image appliquée sur un modèle pour définir son apparence |
| **Texture map** | Un fichier image contenant *une* propriété d'un matériau |
| **Base color** | La couleur de base d'une matière |
| **Normal map** | Simule du relief sans modifier la géométrie (l'image rose/bleue typique) |
| **Bump map** | Alternative plus simple à la normal map, en niveaux de gris |
| **Height / Displacement map** | Déforme réellement le maillage à partir d'une image |
| **Ambient occlusion** | Simule des ombres douces dans les creux, pour plus de réalisme |
| **Alpha channel** | Le contrôle de la transparence d'un matériau |

Deux notions reviennent partout : le **Principled BSDF**, le shader le plus complet et le plus simple de Blender, et le **PBR** (*Physically Based Rendering*), une méthode de rendu réaliste basée sur la physique.

Mention spéciale au **subsurface scattering** : la simulation de la lumière qui pénètre puis se diffuse dans un matériau comme la peau, la cire d'une bougie ou les oreilles. C'est ce qui rend un visage crédible.

## UV et rendu

- **UV mapping** — la projection d'une texture 2D sur un modèle 3D.
- **UV unwrapping** — « déplier » un objet 3D à plat pour le texturer sans distorsion.
- **Rendering** (rendu) — la génération d'une image finale à partir d'une scène 3D.
- **Render engine** — le moteur qui calcule le rendu. Sur Blender : **Cycles** (puissant mais lent) et **EEVEE** (temps réel, ultra rapide, un peu moins réaliste).
- **Real-time rendering** — un rendu calculé sans attente, comme avec EEVEE.
- **HDRI** — une image à 360° servant de source d'éclairage réaliste très facilement.

## Animation et rigging

| Terme | Définition |
|---|---|
| **Armature** | Un squelette pour animer un objet |
| **Bone** | Un segment du squelette |
| **Rigging** | L'ajout d'un squelette et de contrôles d'animation |
| **Skinning** | L'attachement du maillage aux os |
| **Weight painting** | La répartition de l'influence de chaque os sur le maillage |
| **IK / FK** | *Inverse* (depuis l'extrémité) ou *Forward* (os par os) kinematics |
| **Keyframe** | Une image clé marquant un changement dans l'animation |
| **Motion capture** | La capture d'un mouvement réel pour l'appliquer à un modèle |

Côté outils d'animation : la **timeline** représente l'animation dans le temps, et le **graph editor** affiche les courbes pour régler finement les transitions entre keyframes.

## Outils, formats et écosystème

Pour finir, le vocabulaire « de la pipeline » :

- **Pipeline** — la suite d'étapes d'une production 3D : modélisation → texturing → rigging → animation → rendu.
- **Modifier** — un effet *non destructif* appliqué à un modèle (mirror, array, subdivision…).
- **Boolean** — fusionner, soustraire ou croiser deux objets.
- **Gizmo** — le contrôleur visuel pour déplacer, pivoter ou redimensionner.
- **Outliner** — la vue hiérarchique des objets de la scène.
- **Autres logiciels** : ZBrush, Maya, 3DS Max, Houdini. **Unreal Engine** et **Unity** sont des moteurs de jeu temps réel.
- **Formats** : FBX, OBJ, BLEND, MAX pour la 3D ; PNG (avec transparence) et JPEG pour les textures.
- **CG / CGI** — *Computer Generated Imagery*, les images créées par ordinateur (effets spéciaux, animation, jeux vidéo).

---

Avec ce lexique en tête, les tutoriels deviennent d'un coup beaucoup plus lisibles. La prochaine étape pour moi : mettre les mains dans l'interface de Blender — ce sera le sujet du prochain article.

*Notes prises à partir de la vidéo « Vocabulaire 3D » de la chaîne Apprendre Blender.*
