<div style="display: flex; align-items: center;">
  <img src="https://apps.ufs.arizona.edu/buildingmanager/assets/BlockA_w_line-290716d5.png" alt="Block A" style="margin-right: 10px;"/>
  <h1 style="margin: 0;">TemplateApp</h1>
</div>

TemplateApp is a starter template for building new Vue.js applications for Business Affairs.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)


## Features

- Vue.js framework
- Basic project structure and components
- Pinia for state management
- Vue Router for client-side routing
- UofA Branding, Styling
- Webauth authentication
- API calls to get employee Profile information
- Employee Search
- Building Search
- Other example components

## Requirements

Ensure you have the following installed on your development environment:

- [Node.js](https://nodejs.org/) (version 18.x or later)
- [npm](https://www.npmjs.com/) (version 6.x or later)

## Getting Started

### Installation

1. Clone the repository:

    ```git clone https://KyloDren74@bitbucket.org/kylo_dren/templateapp.git
    ```

2. Navigate to the project directory:

    ```cd TemplateApp
    ```

3. Install the dependencies:

    ```npm install
    ```

### Running the Application

To start the application in development mode, run the following command:
```npm run dev```

## Project Structure

Here's a quick overview of the project's structure:

```plaintext
TemplateApp/
├── public/             # Static files
│   └── index.html      # Main HTML file
├── src/
│   ├── assets/         # Asset files
│   ├── components/     # Vue.js components
│   ├── router/         # Vue Router setup
│   ├── store/          # Pinia store setup
│   ├── views/          # View components
│   ├── App.vue         # Main app component
│   └── main.js         # Entry point
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation
```

## Available Scripts

Below are the scripts available for this project:

- **`npm run dev`**: Launches the development server with hot-reloading.
- **`npm run build`**: Builds the application for production.

### Script Details

- **`npm run dev`**
    - Launches the development server with hot-reloading, allowing you to see changes in real-time. The application will be available at [http://localhost:3000](http://localhost:3000) by default.

- **`npm run build`**
    - Builds the application for production. The output files will be located in the `dist` folder and optimized for performance.

- **`npm deploy:beta || deploy:prod`**
    - Robocopys the build files to the destination.  This requires editing to remove the underscore and replace 'templateapp' with correct path.
 
- **`npm build:deploy:beta || build:deploy:prod`**
    - Combines the build and deploy in one step.  This requires editing to remove the underscore and replace 'templateapp' with correct path.
     
## Roles and Permissions
- JWT is generated in common API
- Roles are store in the "Cerberus" system
- An app-id in .env will match up to the Cerberus roles encoded into token

## Store Design
- store/app.js  - main store for this apps logic and state
- store/api.js  - holds all external apis, no business logic
- store/user.js - related to this users role, token, login
- store/ui.js   - holds state for all ui, show/hide, loading, etc.

## Starting a new app from TemplateApp

- Clone
- Install Node, npm install, npm run dev.  Make sure it runs
- Do global search on 'TemplateApp', and address each instance.
- Start new EMPTY repository on remote, no readme, no .gitignore.
- Copy remote address
- Edit local app's remote address with new remote address
- Push

## TLDR Github Workflows.

Files exist in `.github/workflows` and these files serve as instructions for a `runner` to execute when certain actions are taken with the repository.

* These can do anything you can script, basically. If you run a specific sequence of commands to build and run an app, or build and deploy it, you can just repeat those as a series of commands in a given `job` which is just a construct to group various steps.
* This repository has two scripts inside of it
  * A simple script when a pull request happens or is updated that'll install npm, build the app, and run a simple test suite.
  * A simple script when `main` branch is updated to build and deploy to beta.apps

## How Github Workflows Works

In short, this section will serve as notes for how this is being built.

These instructions concerns a very specific environment where the deploy environments for both test and prod are on a network-shared drive. Due to access to those servers only allowing logins via netid, and the difficulty associated with safely storing a non-personal login secret on GitHub for this case, the proposed solution for developers in this case is to use a self-hosted runner.

Self-hosted runners are relatively simple to install and let us ignore those needs entirely provided you've already authenticated to the network share drive.

### Environment requirements

Due to the environment, the following must be true for the self-hosted runners to work:

* You are on a UArizona network, whether a physical device on-premises or the VPN. 
* User secrets are managed through GitHub Secrets, which lets you safely and securely store environment secrets on a per-repo basis. All runners can use a pre-defined environment with your netid and password safely stored.

### Setting up a self-hosted runner.

1. Go to the repository you're trying to setup a runner for.
2. Navigate to Settings > Actions > Runners > New self-hosted runner
3. Choose your OS and architecture and follow the install instructions provided on the form.
4. Verify that you can see the Runner on GitHub by refreshing the Runners page; you should see your newly configured Runner with a status of `Idle`.

### Potential ideas for improvement

* Could we potentially find a way to have infrastructure allow a shared login for this and let a given host machine serve as one singular runner point, so we can eliminate self-constructed environment needs here?
  * Solved through GitHub Secrets
