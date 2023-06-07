---
title:  "Optimal Control for Rocket Landing Problem"
mathjax: true
layout: post
categories: media
---

## Overview and Motivation

Resuable rockets pose an incredibly complex landing sequence problem. This porject focuses really on the final stage of landing and the objective here is to use applied optimal control strategies for this application is to minimize the fuel consumed.

- Languages: MATLAB, Python
- Framework: ACADO Toolkit

## Approach

Since an elaborate dynamical model of the rocket is extremely complex, we start with a basic 2 DOF dynamic model. In this system, we have for states the position, $[x,/ y]$, velocity, $(v)$, mass, $(m)$ and the control input, $[u_{T},/ u_{\theta}]$ is the thrust and the angle of attack.
Constraints were put on the control inputs, velocity, mass and the angle of attack. Boundary conditions were specified for the final positions and angle of attack, initial velovity and angle of attack. Optimization problem was solved by using final mass as the Mayer Term in ACADO through MATLAB interface.

Once the convergence was met, this was extended to a 3-DOF system. Since the problem has both path and control constraints, Sequential Quadractic Programming(SQP) was used to solve this Nonlinear Programming(NLP) problem. 

## Result

The algorithm was tested on a real UR5.

{% include youtubePlayer.html id=page.youtubeId1 %}

## Challenges
- Used `rcl_interfaces` library to declare parameters that need to be dynamically reconfired. It was challenging to keep track of the changing variables - was solved using a callback that checked for changed variables.
- `\robot_description` topic publishes the description only once when it is initiated. This was a challenge because by the time deployer starts running it would miss the description that was published - solved by adding a delay to the `robot_description_node` in the launch file. 
- Vibrations when implementing the algorithm on the real UR5 - solved by increasing the number of steps in the IK solver method.  
