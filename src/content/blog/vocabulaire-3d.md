---
title: "3D Vocabulary: the Essential Glossary for Beginners"
description: "Mesh, vertex, topology, UV, PBR… A glossary of the essential terms I had to learn when starting 3D modeling with Blender."
pubDate: 2026-06-11
tags: ["Blender", "3D", "Beginner", "Learning"]
---

I started learning 3D with Blender, and the first barrier wasn't the software: it was the **vocabulary**. 3D uses English as its common language, and running into words like *mesh*, *normal*, or *topology* without understanding them makes any tutorial unreadable.

Here's the glossary I put together to build a solid foundation. I'm keeping it here as much for myself as for anyone just getting started.

> 💡 One tip I picked up: **don't use a translated version of your 3D software**. Translated terms don't match anything in tutorials, which are almost all in English.

## Basic Geometry

Every 3D object is built from a few fundamental building blocks:

| Term | Definition |
|---|---|
| **Mesh** | A set of polygons forming a 3D object |
| **Vertex** | A point in space; plural *vertices* |
| **Edge** | A segment connecting two vertices |
| **Face** | A flat surface defined by several edges — synonym for polygon |
| **Normal** | A vector indicating the orientation of a face (crucial for lighting) |
| **Triangle / Quad / N-gon** | Face types by vertex count: 3, 4, or more |

The **normal** comes up constantly whenever lighting or rendering is discussed: if it's pointing the wrong way, a face can become invisible or poorly lit.

## Topology and Mesh

Once you start manipulating geometry, these terms become essential:

- **Topology** — the organization of vertices, edges, and faces in a model. "Good" topology makes animation and rendering easier.
- **Retopology** — rebuilding a simplified mesh on top of a heavy model (typically after sculpting) to optimize it.
- **Decimation** — the *automatic* reduction of polygon count.
- **High poly / Low poly** — models with high or low polygon density. High poly is very detailed, low poly is very lightweight.
- **Subdivision** (often *subd*) — adding detail through automatic mesh smoothing.
- **Remesh** — an automatic recalculation of the mesh to even out the polygons.

## Sculpting

Blender lets you sculpt like clay. A few terms specific to this discipline:

- **Sculpting** — organic modeling (faces, creatures…), in the style of ZBrush.
- **Dyntopo** (dynamic topology) — a mode where the mesh becomes denser where you work, and stays light elsewhere.
- **Masking** — protecting an area from sculpting so you only work on the rest.

## Materials and Textures

This is the part that brings a model to life:

| Term | Definition |
|---|---|
| **Shader** | A program that determines how light interacts with a surface |
| **Texture** | A simple image applied to a model to define its appearance |
| **Texture map** | An image file containing *one* property of a material |
| **Base color** | The base color of a material |
| **Normal map** | Simulates surface detail without modifying geometry (the typical pink/blue image) |
| **Bump map** | A simpler alternative to a normal map, in grayscale |
| **Height / Displacement map** | Actually deforms the mesh from an image |
| **Ambient occlusion** | Simulates soft shadows in crevices, for added realism |
| **Alpha channel** | Controls the transparency of a material |

Two concepts come up everywhere: the **Principled BSDF**, Blender's most complete and straightforward shader, and **PBR** (*Physically Based Rendering*), a realistic rendering method grounded in physics.

Special mention goes to **subsurface scattering**: the simulation of light penetrating and scattering inside a material like skin, candle wax, or ears. It's what makes a face look convincing.

## UV and Rendering

- **UV mapping** — projecting a 2D texture onto a 3D model.
- **UV unwrapping** — "unfolding" a 3D object flat so it can be textured without distortion.
- **Rendering** — generating a final image from a 3D scene.
- **Render engine** — the engine that computes the render. In Blender: **Cycles** (powerful but slow) and **EEVEE** (real-time, ultra fast, slightly less realistic).
- **Real-time rendering** — a render computed without waiting, like with EEVEE.
- **HDRI** — a 360° image used as a realistic lighting source, very easy to set up.

## Animation and Rigging

| Term | Definition |
|---|---|
| **Armature** | A skeleton for animating an object |
| **Bone** | A segment of the skeleton |
| **Rigging** | Adding a skeleton and animation controls |
| **Skinning** | Attaching the mesh to the bones |
| **Weight painting** | Distributing each bone's influence over the mesh |
| **IK / FK** | *Inverse* (from the end) or *Forward* (bone by bone) kinematics |
| **Keyframe** | A key frame marking a change in the animation |
| **Motion capture** | Capturing real movement to apply to a model |

On the animation tooling side: the **timeline** represents the animation over time, and the **graph editor** shows curves for fine-tuning transitions between keyframes.

## Tools, Formats, and Ecosystem

Finally, the "pipeline" vocabulary:

- **Pipeline** — the sequence of steps in a 3D production: modeling → texturing → rigging → animation → rendering.
- **Modifier** — a *non-destructive* effect applied to a model (mirror, array, subdivision…).
- **Boolean** — merge, subtract, or intersect two objects.
- **Gizmo** — the visual controller for moving, rotating, or scaling.
- **Outliner** — the hierarchical view of objects in the scene.
- **Other software**: ZBrush, Maya, 3DS Max, Houdini. **Unreal Engine** and **Unity** are real-time game engines.
- **Formats**: FBX, OBJ, BLEND, MAX for 3D; PNG (with transparency) and JPEG for textures.
- **CG / CGI** — *Computer Generated Imagery*, images created by computer (special effects, animation, video games).

---

With this glossary in mind, tutorials suddenly become much more readable. My next step: getting my hands on Blender's interface — that'll be the subject of the next article.

*Notes taken from the "Vocabulaire 3D" video by the Apprendre Blender channel.*
