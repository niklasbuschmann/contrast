---
title:  "A Robust Strategy to Track the Fin a Weakly Electric Knifefish"
youtubeId1: Jx1Ayr9Fp4Q
mathjax: true
layout: post
categories: media
---
![Doris, a glassknife fish](./assets/ribbonFin/VideoMoreClear.png)
{% include youtubePlayer.html id=page.youtubeId1 %}
## Overview and Motivation

My interest in studying unique locomotion motivated me to join the [Locmotion in Mechanical and Biological Systems Lab](https://limbs.lcsr.jhu.edu/) where I studied methods to track the ribbon-fin of a glassknife fish using Deep Lab Cut.
The objective of the project is to to track the motion of the undulatory ribbon-fin of a glassknife fish, Eigenmannia virescen effectively. 
This fish's swimming motions are unique and interesting from a locomotion perspective because of the complex mechanics of the two counter propagating waves produced by the fish, one starting from the head and the other starting from the tail. 
These waves help the fish swim forward and backwards without moving it's body too much.

Tracking of the fin is a challenging problem because the number of waves produced at each time step might vary and tracking a point on the wave is not equivalent to tracking a point on the fin. This idea, a lot of trial and test, and co-ordinate frame transformations were used to track the fin efficiently.

## Approach

### Head and Body Center Orientation
Two stationary points that are easy to track are bodycenter and the head. Along with the head, the body center, the pectoral fins,
the tail and a point on the shuttle was tracked. The fish naturally follows the shuttle and tries to stay inside the
shuttle. But even for stationary shuttle experiments, the position of the head changes with each frame. Having
the same coordinates for the head position in all frames is useful in efficient tracking. Frames were extracted from
the analysed DLC video. The head position of the first frame was used as the reference position. Head positions
from all other frames were moved to this point as described in the following equations:
$$\Delta x = x_{ref} - x$$
$$\Delta y = y_{ref} - y$$
$$x_{h_{new}} = x_h + \Delta x$$
$$y_{h_{new}} = y_h + \Delta y$$

Frame translation                     |  Frame rotation
:------------------------------------:|:-------------------------:
![](/assets/ribbonFin/NewTrans.png) |  ![](/assets/ribbonFin/NewTrans.png)

## Result

## Challenges
