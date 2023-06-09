---
title:  "UR5 trajectory generation using OROCOS real-time toolkit"
youtubeId1: feqXhstn2l8
mathjax: true
layout: post
categories: media
excerpt_img_url: ../assets/ur5.png
---

## Overview and Motivation

The goal here was to create dynamically reconfigurable parameters that sets the desired configuration of the robot for the trajectory generator real time.

- Languages: C++, Python
- Framework: ROS2 
- Library  : OROCOS Toolchain, KDL, Reflexxes  

## Approach

Used the urdf description from Universal Robotics to solve the inverse kinmeatics problem. The ROS parameters were exposed to RQT to enable them to be adjusted by a GUI. The parameters that were dynamically reconfired were desired cartesian position, $$[x,\ y,\ z,\ roll,\ pitch,\ yaw]$$ desired joint angles, $$[\theta_{1},\ \theta_{2},\ \theta_{3},\ \theta_{4},\ \theta_{5},\ \theta_{6}]$$, and velocity sclaing parameter to adjust the velocity of the robot from 0-100%.    

A RTT component was implemented. This RTT component has two operations; one to trigger a new joint
trajectory that moves the robot, from wherever the robot is, to the desired position.
And another one to move the robot by producing a Cartesian trajectory that moves the
robot from its current position to the desired Cartesian frame. Inverse kinematics was computed at every time step using the KDL library.

## Result

The algorithm was tested on a real UR5.

{% include youtubePlayer.html id=page.youtubeId1 %}

## Challenges
- Used `rcl_interfaces` library to declare parameters that need to be dynamically reconfired. It was challenging to keep track of the changing variables - was solved using a callback that checked for changed variables.
- `\robot_description` topic publishes the description only once when it is initiated. This was a challenge because by the time deployer starts running it would miss the description that was published - solved by adding a delay to the `robot_description_node` in the launch file. 
- Vibrations when implementing the algorithm on the real UR5 - solved by increasing the number of steps in the IK solver method.  
