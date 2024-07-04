# Walenholde Combat System — React App

This repository contains React Interface for playing games of WLHD ecosystem.

Built using React, Redux and GraphQL.

## Description

This is a passion project, created to provide a platform for playing Walenholde Combat System.

WLHD is a tabletop RPG system, created by me, that is still in active development. For more detailed information, check [Learn More](#Learn-More).

## Prerequisites

Before you begin, ensure you have met the following requirements:

-   You have installed [Node.js and npm](https://nodejs.org/en/download/) (built using NodeJS v21.6.1).
-   You have installed [MongoDB](https://www.mongodb.com/try/download/community).
-   You have a `<Windows/Linux/Mac>` machine.

## Installation

1. Clone this repository:

```bash
git clone https://github.com/CatOfJupit3r/wlc-frontend-web.git
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory of the project and populate it with the variables from `.env.example`.

## Environment Variables

-   HOST — Host on which the server will run _(default: localhost)_
-   REACT_APP_BACKEND_URL — FULL URL to the GAME COORDINATOR server.

## Usage

### Local

Open a terminal inside the project directory run according to your package manager:

```bash
npm run start
# or
yarn start
# or
pnpm start
# or
bun start
```

### Docker

This repository supports Docker. To build the image, run:

```bash
docker build -t wlhd-frontend .
```

Then, to run the container:

```bash
docker run -p 3000:3000 -d wlhd-frontend
```

## Learn More

To learn more about Walenholde Combat System... Well, you can't, as it's still a WIP. But in future you will be able to find more information about it on GitHub Wiki page, including:

-   Creating your own lobbies, characters and hosting them.
-   Mechanics of the game, including combat, spells, and other features.

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
To learn React, check out the [React documentation](https://reactjs.org/).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Related

-   [React Frontend](https://github.com/CatOfJupit3r/wlhd-frontend-web) — Frontend for the game coordinator, built using React, Redux and GraphQL. (You are here!)
-   [Game Coordinator](https://github.com/CatOfJupit3r/wlhd-coordinator-server) — Backend for the game coordinator, built using ExpressJS and MongoDB.
-   [Game Engine](https://youtu.be/h81WXIfCnoE?si=LS7HpLYhI-LBg4-9) — Core game engine, built using Python, Python and Python. (also, FastAPI).
-   [Building your own WLHD Package](https://github.com/CatOfJupit3r/wlhd-example-package) — Guide on how to build your own WLHD package, including all the necessary information.
-   [Discord Bot Interface](https://github.com/CatOfJupit3r/wlhd-frontend-discord) — Frontend for the game coordinator, built using Discord API. (Deprecated)
-   [Game Guide] — Contains all the necessary information about the game and its various mechanics in a traditional TTRPG format. (WIP)
-   [Game Wiki] — Contains all the necessary information about the game and its various mechanics in easily navigable way. (WIP)
