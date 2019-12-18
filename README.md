## Demo

[http://generals.tantanguanguan.com/](http://generals.tantanguanguan.com/)

## System Requirement

Node v6.0+

### 1. Setup and Run Server

```
$ git clone git@github.com:mrmarktyy/generalio-server.git
$ cd generalio-server
$ npm install
$ node index.js
```

### 2. Setup and Run Client

```
$ git clone git@github.com:mrmarktyy/generalio-client.git
$ cd generalio-client
$ npm install
$ npm run start
```

### 3. Sample Random AI code

Find the sample ai implementation here,

```
generalio-server/ai/bots/Sample.js
```

#### To create and use another version of Bot, for example MyAIBot,

* 1) create generalio-server/ai/bots/MyAIBot.js
* 2) in generalio-server/controllers/GameMatchingCentre.js#L67
  change

     `const ai = new AIPlayer(new AISocket({type: 'Sample'}), this);`

  to

     `const ai = new AIPlayer(new AISocket({type: 'MyAIBot'}), this);`


  where `type` should match the file name of the bot file

* 3) restart the generalio server, then `MyAIBot` will be in use now.
