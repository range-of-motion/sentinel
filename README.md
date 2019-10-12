# Sentinel

Super easy server monitoring. Named after the [Lockheed Martin RQ-170 Sentinel](https://en.wikipedia.org/wiki/Lockheed_Martin_RQ-170_Sentinel) drone.

![Screenshot](https://i.imgur.com/tCW5DKO.png)

## Requirements

* Node.js v10+
* 70+ IQ human operator

## Setup

```bash
git clone git@github.com:range-of-motion/sentinel.git
cd sentinel
yarn install # Or npm install, but Yarn trumps NPM imo
yarn start
```

And you're done. Go to `http://localhost:7000` in your browser and voila.

## To-do

* Configuration
* Clustering of data in charts
* Building history
* Authentication
