---
title:  "Turtlebot teaming"
youtubeId1: smgqKGkIvUg
youtubeId2: p8ss_OPU6lk
mathjax: true
layout: post
categories: media
---
<div style="width:60px ; height:60px">
| Map in Rviz                   | Real world setting           |
| ----------------------------- | ---------------------------- |
| ![](/assets/MapRealTime.png)  | ![](/assets/Maze_Setup.jpg)  |
<div>
  
## Overview and Motivation

To facilitate a successful teaming operation between two mobile robots, several subtasks must be accomplished, including mapping, navigation, sensor calibration, and real-time communication. In this project, we implemented and integrated these submodules to achieve a collaborative teaming task involving two Turtlebots

This project utilizes ROS2 actions and the navigation stack to enable cooperative teamwork between two Turtlebots. The task involves Turtlebot3 Burger moving from one end of a platform to the other. However, the platform consists of moving blocks, and one of the blocks is strategically positioned, creating a gap. When Burger reaches this specific spot on the platform, it sends a request to Waffle. Subsequently, Waffle responds by pushing the platform to close the gap, allowing Burger to pass through smoothly.

## Approach

Burger uses camera and ArUco markers to know its location in the world whereas Waffle uses a lidar to map the world and get to Burger. Waffles drives around the world using teleop and uses SLAM toolbox to create the map. 

ROS2 Nav2 was used to calibrate the camera. Burger and Waffle use ROS2 action operations to communicate. These actions have a goal, result and feedback. Actions were chosen instead of services since actions give the ability to cancel requests. Burger is the action client in this project and gives out a 2D goal pose to Waffle as soon as it reaches the gap on the platform. Waffle is the action server and can return feedback while it is perfomring the task of going from it's current pose to the target pose and a result regarding the status of the task. 

Picture calibration 

An inbuilt Adaptive Monte-Carlo Lozalizer was used to estimate the current 2D pose of Waffle. The laser model used was of likelihood field type. A good estimate for the initial pose, $[x, y, \theta]^{T}$ where $\theta$ is the orientation, was fed to the localizer. Parameters such as process and sensor noise covariances were tuned to have the particle filter converge eventually. 

Existing turlebot3 robot descriptions were used to visualize the task in simulation. Ignition Gazebo was used to render the bots in simulation environment.  

Ignition world               |  World rendered in Rviz
:---------------------------:|:-------------------------:
![](/assets/sim_gazebo.png) |  ![](/assets/sim_rviz.png)

## Result
  
Real time simulation                               |  Turtlebot teaming 
:-------------------------------------------------:|:-------------------------:
{% include youtubePlayer.html id=page.youtubeId1 %} | {% include youtubePlayer.html id=page.youtubeId2 %}  


## Challenges
- Reammping topics for multirobot environment
- Camera calibration and communication between ArUco marker node and Burger's camera node

