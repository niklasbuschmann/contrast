---
title:  "Trajectory Generation and Tracking of an Iver3 AUV"
mathjax: true
layout: post
categories: media
---



## Overview and Motivation

Various nonlinear control strategies are beneficial to deal with dynamic uncertainities of highly nonlinear, complex systems. One such system is the Iver3 Autonomous Underwater Vehicle(AUV).

The objective of the project is to generate a smooth trajectory to a desired goal position and to track the generated
trajectory using feedback control for an Iver3 AUV model. Seabed exploration is the practical scenario considered
to simulate the environment. Efforts were made to design a path planner that finds a smooth path in the presence
of obstacles and to design a controller that tracks the path found. The two different parts of the problem are
trajectory generation and trajectory tracking.

- Languages: MATLAB

## Approach

The model is an underactuated, nonlinear system. For the purpose of the project, a simplified 5-DOF model has been
considered. The AUV has three translational degrees of freedom in $(x,\ y,\ z)$ and two rotational degrees of freedom
in pitch $(\theta)$ and yaw $(\psi)$. The independent fins of the Iver3 model generate rotational motion whereas the thruster
produces surge velocity in the x-direction. The control inputs to the system are the normalized driving input $\delta q$ ,
normalized rudder input $\delta r$ , and the thruster rate $\delta u$.



## Result

Rocket velocities                          |  Convergence for the 3-DOF problem
:-----------------------------------------:|:-------------------------:
![](/assets/rocketLanding/Velocities.jpg)  |  ![](/assets/rocketLanding/ConvergenceWindow.png)

## Challenges
- The intial position, integration tolerance and tight constraints played a significant role in the convergence of the NLP problem. This was particularly challenging because of the control constraints on thurst, AOA, mass and velocities. 
- This project does not address the dynamics of pitch angle and heading angle.  
