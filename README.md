nodejs-publish-mashup-sns-app
=============================

nodejs sns + mashup app project

# Basic mashup web Application

This application is combination of sns profile application and some mashup features/scenarios. Basically, this application is capable of access to facebook and google, and parses specific user data to display on the application's profile page.

## README version 0.1.0

Basic mashup web Application is divided into few features as the following : 

* *mashup data collection* : so called mashup data are collected periodically using oauth protocol and saved to database server (such as redis, mySQL, and etc)
* *mashup data distribution* : Collected mashup datum are linearly published to servers or clients that are interested to such data. Subscription is ideally unlimited to any candidates. Publish-Subscribe scenarios are done by popular network protocols such as HTTP, UDP, TCP, or websockets

## Getting Started

### Running Server

The following are general sequences to run the application :

1. setting hostname and port for mashup server. By default, 3rd party services are set to google and facebook.

2. run the server by typing "node app.js" on terminal

3. monitor and manage the mashup page by visit "http://{hostname}:{port}"

4. corresponding sensors are published to any clients that are accessed. 

### Environments

- OS which supports Node.js & Javascript : Linux, MacOS, Windows
- For Client or viewing config/status web page, one needs to access browsers which supports websockets, socket.io


### Application Boundaries

Although none of new settings need to be applied, application's boundary needs to be considered before running at least once. Some properties are as follows:

- only profile infos of user are distributed and parsed to clients
- web server, mashup server, and client are included


## Contact

