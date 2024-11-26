---
layout: post
title: Plant UML user experience
categories: [blogging]
---

> if i have seen further then others, it is by standing upon the shoulders of giants
>
> *Isaac Newton*

In development and devops environment documentation is important and more then documentation is the visualization of what we have in place.

Diagrams are good as they can explain different level of systems and applications.

* layer 2 infrastructure
* layer 3 connectivity
* application inter-working
* application workflow
* [C4](https://c4model.com/)

Problems that i found with the usual way of diagram creation:

* diagrams get out of date **fast**
* different layout based on different author (*even if we are describing the same system*)
* they are only images and cannot be used by different systems.

Got introduced to PlantUML from a colleague that used to document **E**(ntity)**R**(relationship) and create **LLD**. I tried and fell in love with it.

[Here the resource i used to set my environment](https://medium.com/@shivam.gosavi340_58315/productivity-hack-visual-documentation-using-plantuml-2f9562890a42)

What i like of the tool is the capability to generate a diagrams based on a declarative approach. This in conjunction with Boost Note allows to create notes and documentation on the fly to share within teams and adjust them quickly based on feedbacks.

After i start using i saw the value added to my workflow and the way to improve how to document.

* I created an internal git repo
* i start creating all **puml** files to document whatever i am working on.

Now we use it to keep track of:

* Connectivity matrix between our systems
* troubleshooting diagrams
* High level design
* Application workflow.
* [C4](https://c4model.com/)
* and more to come

## Use cases Example

### Troubleshooting

Here an example of a diagram created during a troubleshooting session where we had problem to access the same service from 2 different machines.

*Be able to step by step describe the flows allowed us to pinpoint the possible root cause that is not relevant for this article*

![tshoot](/assets/images/tshoot.png)

<details>
<summary>Code snipped</summary>
{% highlight plantuml %}
@startuml
skinparam node {
 borderColor Blue
 backgroundColor LightCyan
 backgroundColor<<shared node>> Magenta
}
skinparam rectangle {
    BackgroundColor<<dc>> D5E9D5
    BackgroundColor<<vm>> DCEAFE
    BackgroundColor AntiqueWhite
    BackgroundColor<<dev>> LightGreen
    BackgroundColor<<prod>> #D46A6A
}
skinparam storage {
  backgroundColor DAE8FC
}
skinparam component{
    BackgroundColor WhiteSmoke
    BackgroundColor<<shared>> APPLICATION
    borderColor black
}
title Troubleshooting session
left to right direction
actor user
rectangle DC_1 <<dc>> {
  rectangle machine_1 <<ph>>{
    storage machine_1_nginx {
      [service_1]->(api_1)
      [service_1]->(api_2)
    }
    frame machine_1_address <<ip>> {
      rectangle 10.0.0.1
    }
  }
}
rectangle DC_2 <<dc>> {
  rectangle machine_3 <<vm>>{
    storage machine_3_nginx #WhiteSmoke {
    ' storage nginx {
      [machine_3_spa]
      [machine_3_domain_dev]
    }
    frame machine_3_addr <<ip>> {
      rectangle 10.0.0.2
      rectangle 10.0.2.1
    }
  }
   rectangle machine_2 {
    storage machine_2_nginx {
      [machine_2_domain]
    }
    frame machine_2_address <<ip>> {
      rectangle 10.0.0.3
    }
  }
}
user ==> machine_2_domain: issues
user ..> [machine_3_domain_dev]
[machine_3_domain_dev] ..> service_1
machine_2_domain ==> service_1: issues
@enduml
{% endhighlight %}
</details>

## Connectivity check

> *Providing proper convention for the way*
> we decribe object in the plantuml file are important as we can make use of these convention for further changes.

<details>
<summary>Code snippet</summary> 
{% highlight plantuml %}
@startuml
left to right direction
rectangle DC_1 <<dc>> {
  rectangle machine_1 <<ph>>{
    frame machine_1_address <<ip>> {
      rectangle 10.0.0.1 <<api>>
    }
  }
}
rectangle DC_2 <<dc>> {
  rectangle machine_3 <<vm>>{
    frame machine_3_addr <<ip>> {
      rectangle 10.0.0.2<<ingestion>>
      rectangle 10.0.2.1<<db>>
    }
  }
   rectangle machine_2 {
    frame machine_2_address <<ip>> {
      rectangle 10.0.0.3 <<api>>
    }
  }
}
@enduml
{% endhighlight %}
</details>

![tshoot](/assets/images/puml_base.png)
We would like to check that all the ip related to the API can access the DB ip

```bash
for i in `grep api diagram.puml | grep rectangle | awk '{print $3}' | sort | uniq `;do ssh $i "nc -zvn -w 2 10.0.2.1 6379 &> /dev/null && echo '${i} =[#Green]=> 10.0.2.1' || echo '${i} ==> 10.0.2.1'";done
```

Now based on the result we will have new connection created

```bash
10.0.0.1 =[#Green]=> 10.0.2.1
10.0.0.3 ==> 10.0.2.1
```

Adding this to the the original puml will provide the below result

<details>
<summary>Code snippet</summary>
{% highlight plantuml %}
@startuml
left to right direction
rectangle DC_1 <<dc>> {
  rectangle machine_1 <<ph>>{
    frame machine_1_address <<ip>> {
      rectangle 10.0.0.1 <<api>>
    }
  }
}
rectangle DC_2 <<dc>> {
  rectangle machine_3 <<vm>>{
    frame machine_3_addr <<ip>> {
      rectangle 10.0.0.2<<ingestion>>
      rectangle 10.0.2.1<<db>>
    }
  }
   rectangle machine_2 {
    frame machine_2_address <<ip>> {
      rectangle 10.0.0.3 <<api>>
    }
  }
}
10.0.0.1 =[#Green]=> 10.0.2.1
10.0.0.3 ==> 10.0.2.1
@enduml
{% endhighlight %}
</details>

![tshoot](/assets/images/puml_base_conn.png)

## Result

If i was able to improve the way i am producing documentation with plantuml is thanks to online documentation, blogs and experience shared by other users.

These are the numbers that i can provide related to the usage of Plantuml

* 85 days using it
* 127 commit
* 90 different diagrams 
