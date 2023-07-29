---
title:  "Call queue study - Q and A"
mathjax: true
layout: post
categories: media
---


# Questions for the data:

## What does the QUEUE_* ontology look like?
- QUEUE_BRAND = Large means VIP customers
- QUEUE_BRAND = SoHo means regular enterprise customers (SME)
- QUEUE_SILO = Refers to consumer vs. enterprise customers, and our data only has enterprise customers
- QUEUE_TYPE = Only has customer service, but could be internal calls from shops etc.

The QUEUE variable denotes the various queues that were active in the sampling period. Queues are divided based on SLA and topic. Some VIP customers have their own dedicated queue. 




## What does RELEASE_TYPE refer to?
- release = customer hangs up after talking to agent
- customerDrop = customer hangs up while waiting for an agent

- transferedOutbound = ?
- customerDropAuto = ?
- ivrDrop = ?
- PiqSameErrand = ?
- MaxRouteFailed = ?
- conferencedoutbound = ?

## What does ERRAND_TYPE refer to?
- Refers to the nature of the call, but haven't investigated whether this is logged by the agent (after the call) or the customer (when entering the specific queue)



## Is DESTINATION_PARTY the handler ID?
- Sometimes not - agents can transfer calls between each other, and I suspect that is why the agent ID and destination party is not the same.



## What is source of the satisfaction and loyalty scores per call?
- The NPS originates from a separate survey, and is thereby not measured directly after the call. Instead, tSAT has been used (score from 1-10) until the beginning of 2023 where cSAT (score from 1-5) was adopted.
- The cSAT and tSAT scores are collected via SMS after a case is closed.

# Notes to the data
- The chain of events after a customer calls the customer service can be re-structured into a event-log, by using logic around the timestamps and ids.