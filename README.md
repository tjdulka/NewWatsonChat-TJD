![Watson Logo](./readme/img/watson-tile-pos.png)

# Watson Billing Agent

The Watson Billing Agent provides the ability to:

1. Provide a user interface to interact with a virtual Watson Billing Agent that will demonstrate an ability to answer a user's questions about their billing account.
2. Provide dynamic conversation flows based on the user's billing status.
3. Provide a mechanism to mask personally identifiable information from the conversation
4. Provide a mechanism to authenticate the user using a set of simple challenges
5. Demonstrate the ability to interface with external APIs to enrich the conversation responses with dynamic information
6. Provide a responsive application that will scale appropriate for mobile through desktop modes.
7. Demonstrate an ability to identify and react to a user's sentiment and emotion

## Default Password
The application is password protected by default. The default credentials are:

```
username: ibm
password: watson
```

## Prerequisites
The application requires the following applications

1. Node (6.9+) Application runtime environment
2. NPM (3.10+) Server side dependency management
3. Gulp (3.9+) `npm install -g gulp`
4. Angular CLI (1.0.0-beta.28-3) `npm install -g angular-cli`

## Application Architecture
### IBM Cognitive Technology
This application uses the following cognitive technologies

1. Watson Conversation
2. AlchemyLanguage

### Application Entry
The application has 3 main entry points.

1. /
   * The application and static content is served from this path
2. /api
   * APIs are exposed at this path, details provided below.
3. /explorer
	* The Loopback API Explorer is served from this point.


 The main executable for the application is [server.js](./server/server.js)

### Starting the application
There are a few quick steps required to stand up the application. In general, the required tasks are.

1. Install the server and client dependencies
2. Commission the required services
3. Configure the environment variables in manifest.yml (cloud deployment) or .env (local deployment)
4. Build and run or deploy

#### Installing the server and client dependencies
The server dependencies are controlled and defined in [the main package.json](./package.json).

The client dependencies are controlled and defined in [the client package.json](./client/package.json).


To install all required dependencies to both build the application and and execute the application, execute the following script from the project root.

Linux/Unix/MacOs

```
sh ./install.sh
```
or Windows

```
./install.bat
```

Alternatively, the dependencies can be installed manually with the following commands from project root

```
npm install
(cd client/ && npm install)
```

#### Commisioning the Required Services
There are two required services:
##### Conversation
A instance of Watson Conversation will need to be [commissioned on Bluemix.] (https://www.ibm.com/cloud-computing/bluemix/)

When the demo conversation has been imported. the environment variables will need to be updated to reflect this instance of Watson Conversation. Please see the section on *Environment Variables* in order for these instructions.

An extract of the conversation workspace is provided at [./conversation_workspace.json](./conversation_workspace.json)


#### Configuring the environment variables
The environment variables that must be defined prior to using the application are:

|Environment Variable|Description|Default Value|
|--------------------|-----------|-------------|
|CONVERSATION\_API\_URL| The endpoint to the conversation API. Includes credentials. Value should be provided in this form, with values for [USERNAME], [PASSWORD], and [WORKSPACE_ID] https://[USERNAME]:[PASSWORD]@gateway.watsonplatform.net/conversation/api/v1/workspaces/[WORKSPACE_ID]/message?version=2016-09-20 | No Default
|ALCHEMY\_API\_KEY|An AlchemyAPI key
|ALCHEMY\_BASE\_URL|The base URL for Alchemy | https://gateway-a.watsonplatform.net/calls/
|ALCHEMY\_SENTIMENT\_PATH| The AlchemyAPI sentiment path | text/TextGetTextSentiment
|ALCHEMY\_EMOTION\_PATH| The AlchemyAPI sentiment path | text/TextGetEmotion


**Cloud Deployments (like Bluemix):** For cloud-based deployments, environment variables should be set on the cloud foundry environment variables console. This will allow environment variables to be set and updated without requiring a new deployment. When environment variables are updated, the environment will need to be cycled. A manifest file should be used in order to set these values at deployment. A sample manifest file is provided at [manifest.yml.example](./manifest.yml.example)

**Local or Virtual Machines:** For deployments that are not cloud-based, environment variables should be set in a .env file, located at the project root. A sample .env file is available at [.env.example](./.env.example)

#### Starting the Application
##### Local Environments
#####Development Mode:

This mode will build and serve the complete application and will rebuild and restart when it detects changes to the source. Issue the following command to start the application in development mode:

```
gulp develop
```

Alternatively, the application be started in development mode for either the server code or the client code exclusively. This will only build the server or client code respectively.

```
gulp develop:server
gulp developer:client
```

#####Standard Mode:

This mode will build and serve the complete application but it will not rebuild and restart when it detects changes to the source. Issue the following command to start the application in standard mode:

```
gulp start
```

Alternatively, the application be started in standard mode and build either the server code or the client code exclusively.

```
gulp start:server
gulp start:client
```

#### Deploying the Application

If the application is intended to be deployed to a cloud foundary environment like Bluemix, there are two steps that must be done.

1. Build the application
2. Set up the manifest.yml

These steps are automated for cloud foundary environemnt with the following command:

```
gulp publish
```

**Important**
Ensure that you have configured your cloud foundary CLI for the correct target. This can be verified for bluemix with a `bluemix target` command.


##### Building the application

To build the application, issue the following command:

```
gulp build
```

This will compile all server code and package all client code into the /dist/ directory

##### Configuring the manifest.yml

Once built, the manifest should be configured so that the environment variables are properly defined. A sample manifest.yml is provided at [./manifest.yml.example](./manifest.yml.example)


## API Documentation

API documentation is provided via the Strongloop API Explorer. Once the application is running, simply visit \<host\>/explorer in a browser to view the API documentation
