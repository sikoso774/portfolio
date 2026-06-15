---
title: "First Steps in Blender: Interface, Navigation, and Modes"
description: "Understanding Blender's interface, navigating the viewport, and mastering the three working modes — my startup notes on the free 3D software."
pubDate: 2026-06-12
tags: ["Blender", "3D", "Beginner", "Tutorial"]
---

After digesting [the 3D vocabulary](/blog/vocabulaire-3d), it was time to open Blender for real. First reflex that every tutorial hammers home: **you work with the keyboard, not the menus**. Learning shortcuts from the start changes everything in terms of speed.

Here are my startup notes, condensed in one place.

## The Interface

At launch, the *splash screen* offers several modes (**General**, 2D Animation, Sculpting, VFX, Editing). These are just preconfigured interfaces: you can switch between them at any time, so there's no need to stress about the initial choice.

The screen is divided into a few key areas:

| Area | Role |
|---|---|
| **Viewport** | The main 3D window, where everything happens |
| **Outliner** (top right) | The scene hierarchy: objects, camera, lights |
| **Properties** (right) | Render, object properties, modifiers, materials… |
| **Timeline** (bottom) | Animation — 250 frames by default at 25 fps |

All panels are resizable and combinable; you can even open multiple viewports on the same scene. At the top, a tab bar organizes work by step: Layout, Modeling, Sculpting, UV Editing, Shading, Animation, Rendering…

Three file shortcuts to memorize right away:

| Action | Shortcut |
|---|---|
| Save | `Ctrl + S` |
| Undo | `Ctrl + Z` |
| Redo | `Ctrl + Shift + Z` |

## Navigating the Viewport

Moving around the scene relies mostly on the mouse wheel:

| Action | Shortcut |
|---|---|
| Orbit (rotate around) | Middle-click drag |
| Zoom in / out | Scroll wheel |
| Pan | `Shift` + middle-click drag |
| Show side panel (position, rotation…) | `N` |
| Front / top / side view | `1` / `7` / `3` (numpad) |
| Opposite view | `Ctrl + 1 / 7 / 3` |

> A distinction that helped me: the **working camera** (our free viewpoint) is independent of the **render camera**, the one that defines the final image. Moving in the viewport does not move the render camera.

## The Three Working Modes

This is the central concept in Blender. You switch between modes depending on what you want to do:

| Mode | Access | Role |
|---|---|---|
| **Object Mode** | Default | Move, position, duplicate objects |
| **Edit Mode** | `Tab` | Modify geometry: vertices, edges, faces |
| **Sculpt Mode** | Dropdown menu | Sculpt like clay (requires a lot of geometry) |

The `Tab` key toggles between Object Mode and Edit Mode — you'll use it constantly.

## Object Mode: Manipulating Objects

Three fundamental transformations, which can be constrained to an axis by pressing `X`, `Y`, or `Z` afterward:

| Action | Shortcut |
|---|---|
| Move (Grab) | `G` |
| Rotate | `R` |
| Scale | `S` |

> Tip: after `G`/`R`/`S`, `Shift + X/Y/Z` constrains to **all axes except** the one specified. And a right-click cancels the current transformation.

To manage objects themselves:

| Action | Shortcut |
|---|---|
| Add a primitive | `Shift + A` → Mesh |
| Duplicate | `Shift + D` |
| Delete | `X` |
| Copy / Paste | `Ctrl + C` / `Ctrl + V` |

Available primitives include: cube, sphere, cylinder, circle… and **Suzanne**, Blender's iconic monkey head, which serves as a universal test model.

## Edit Mode: Shaping Geometry

In Edit Mode, you select elements at three levels:

| Element | Shortcut |
|---|---|
| Vertices | `1` |
| Edges | `2` |
| Faces | `3` |
| Select / deselect all | `A` |

And here are the tools I already use the most:

| Tool | Shortcut | Use |
|---|---|---|
| Extrude | `E` | Create volume from a face |
| Inset | `I` | Create a smaller face inside another |
| Bevel | `Ctrl + B` | Round an edge (+ scroll wheel = number of segments) |
| Loop Cut | `Ctrl + R` | Add a loop cut |
| Knife | `K` → click → `Enter` | Freehand cut through geometry |
| Fill | `F` | Create a face between selected points |

> One gotcha worth knowing for clean deletion: with `X`, **Dissolve Edge** removes the edge without leaving a hole, while **Delete Edge** does leave one. You almost always want the first option.

## Sculpt Mode and Modifiers: What Comes Next

Two concepts I've only touched on that deserve their own article:

- **Sculpt Mode** requires *dense* geometry. On a cube with 6 faces, almost nothing happens: the best practice is to start from a sphere with many segments, then subdivide.
- **Modifiers** alter an object non-destructively (always adjustable, never baked). The must-knows for beginners: **Subdivision Surface** (smooth), **Bevel** (round), **Array** (repeat in a grid), and **Boolean** (carve or merge volumes). They stack in an order you can rearrange.

---

With these shortcuts, I went from "lost in the menus" to "able to model a simple shape" in a single session. The logical next step: a real small modeling project from start to finish — I'll document it here.

*Notes taken from beginner tutorials on the Apprendre Blender and KyneSilverhide channels.*
