---
title:  "HW 6"
layout: post
---
\>details here<

[Downlaod tar](/graveyard/cs370/Brock-Kaess-HW6.tar)

{% highlight yml %}

  version: "3.8"
  services:
    server:
        build:  server/
        command: python ./server.py
        ports:
          - 5000:5000

    client:
        build:  client/
        command: python ./client.py
        network_mode:  host
        depends_on:
          - server

{% endhighlight %}

**CLIENT**
*app*
{% highlight py %}

    # # Does a GET request on http://localhost:5000 to get data from 
    # # server and prints the message received.
    import requests

    if __name__ == "__main__":
        x = requests.get('http://localhost:5000')
        print(x.text)
        exit(0)

{% endhighlight %}

*Dockerfile*
{% highlight txt%}

    # Create an image based on the official NOde 6 image from dockerhub
    FROM python:3.8

    # Change directory so that our commands run inside this new directory
    WORKDIR /HW6

    # Copy dependency definitions
    COPY requirements.txt .

    # Install dependencies
    RUN pip install -r requirements.txt

    # Expose the port the app runs in
    COPY /app/client.py .

    # Serve the app
    CMD [ "python", "./client.py" ]

{% endhighlight %}

*requirements.txt*
{% highlight txt%}

    certifi==2020.12.5
    chardet==4.0.0
    click==7.1.2
    Flask==1.1.2
    idna==2.10
    itsdangerous==1.1.0
    Jinja2==2.11.3
    MarkupSafe==1.1.1
    requests==2.25.1
    urllib3==1.26.4
    Werkzeug==1.0.1

{% endhighlight %}

**SERVER**
*app*
{% highlight py %}

    # Listens on port 5000 and returns
    # 'Hello world!' when a request is recieved
    from flask import Flask
    server = Flask(__name__)

    @server.route('/')
    def hello_world():
        return "Hello World!"

    if __name__ == "__main__":
        server.run("0.0.0.0") #:5000")

{% endhighlight %}

*Dockerfile*
{% highlight txt%}

    # # Create an image based on the official NOde 6 image from dockerhub
    # FROM node:latest

    # # Create a directory where our app will be placed
    # RUN mkdir -p /user/src/app

    # # Change directory so that our commands run inside this new directory
    # WORKDIR /user/src/app

    # # Copy dependency definitions
    # COPY package.json /usr/src/app

    # # Install dependencies
    # RUN npm install

    # # Get all the code needed to run the app
    # COPY . /usr/src/app

    # # Expose the port the app runs in
    # EXPOSE 4200

    # # Serve the app
    # CMD ["npm", "start"]

    # Create an image based on the official NOde 6 image from dockerhub
    FROM python:3.8

    # Change directory so that our commands run inside this new directory
    WORKDIR /HW6

    # Copy dependency definitions
    COPY requirements.txt .

    # Install dependencies
    RUN pip install -r requirements.txt

    # Expose the port the app runs in
    COPY /app/server.py .

    # Serve the app
    CMD [ "python", "./server.py" ]

{% endhighlight %}

*requirements.txt*
{% highlight txt%}

    certifi==2020.12.5
    chardet==4.0.0
    click==7.1.2
    Flask==1.1.2
    idna==2.10
    itsdangerous==1.1.0
    Jinja2==2.11.3
    MarkupSafe==1.1.1
    requests==2.25.1
    urllib3==1.26.4
    Werkzeug==1.0.1

{% endhighlight %}

*README*
{% highlight txt %}
    1. What is a docker container? [2]
    - A small platform, both open and secure, that simplifies 
        the production and distribution of apps which can be ran
        on linux/windows servers. A docker consists of images 
        and containers. The container can run based of information
        from an image which is a sort of application.

    2. What is the difference between a container and a virtual machine? [2]
    - A VM needs an OS inside of an existing OS. However a docker just needs
        an image like the example UBuntu with Node.js and Application Code
        which can be ran inside a container. More technically, at a system
        level breakdown, the difference is an OS on top of apps, bins/libs, 
        and the host OS, a VM also needs a hypervisor and Guest OS's. In 
        contrast the docker everything but the hyperviser and Guest OS's, though
        with the addition of the Docker Engine.

    3. What is the purpose of a Dockerfile? [2]
    - To create a docker image

    4. What is the purpose of a requirements.txt file? [2]
    - It captures any and all app dependencies

    5. What is the purpose of a docker-compose.yml file? [2]
    - Helps when you have multiple containers and you want to build the images for
        all the containers and runs the containers for ALL the dock containers.

    6. What is the difference between a docker image and docker container? [2]
    - A docker image contains the actual implementation of some application Code
        and a container is a contained environment in which the image can run/execute.

    7. What command can be used to create an image from a Dockerfile? [2]
    - docker build <path>

    8. What command will start a docker container? [2]
    - docker container run -d -p <port>:<port> <image ID>

    9. What command will stop a docker container? [2]
    - docker container stop node(or <container id>)

    10. What command will remove a docker container? Image? [5]
    - docker container rm node (or <container id>)

    11. What command will list all running docker containers? all containers? [5]
    - docker container ps
    - docker container ps --all

    12. What command will list all docker images?
    - docker images

    13. What command do you use to deploy docker containers using information 
    in the docker-compose.yml file? [2]
    -  docker-compose up

    14. How can you specify in the docker-compose.yml file that you want docker 
    containers to use the hosts network? [5]
    - network_mode: host

    15. How can you specify in the docker-compose.yml file where the Dockerfile 
    for a particular container is found? [5]
    - /<path>
{% endhighlight %}