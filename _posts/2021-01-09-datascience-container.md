---
title:  "How to analyze data with the jupyter/datascience-notebook"
mathjax: true
author: katie
category: jupyter
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/uIipJX7TfBw" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Prereqs

You'll need to install [docker](https://docs.docker.com/get-docker/) on your machine. If you want to borrow our docker-compose.yml file, you can copy from this [repository](https://github.com/pennchildlanglab/docker-compose-demo), or clone it using 

```
git clone https://github.com/pennchildlanglab/docker-compose-demo.git
```


## Docker compose

You'll need a docker-compose.yml file that specifies the [image](https://hub.docker.com/r/jupyter/datascience-notebook/) you want to use, the password, the volume to map to, and the port you want to open on

```yml
version: "3.7"
services: 
  datascience-demo:
    image: jupyter/datascience-notebook:r-4.0.3
    environment: 
      - JUPYTER_TOKEN=hi
    volumes:
      - ./:/home/jovyan/work
    ports: 
      - 8888:8888
    container_name: datascience-demo

```

To bring up the container, navigate to the folder that contains the docker-compose.yml file and use

```
docker-compose up -d --build
```

To bring it down, use

```
docker-compose down
```
