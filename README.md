<img src="assets/icon.png" width="100px"/>

# Salesforce Profiler

Salesforce Profiler is a tool for profiling and inspecting your Salesforce ORG's performance.<br/>
Our latest .dmg and .exe installers **[can be found here](https://github.com/forcecreators/salesforce-profiler/releases/latest)**

# Getting Started

```sh
git clone https://github.com/forcecreators/salesforce-profiler salesforce-profiler
cd salesforce-profiler
yarn
yarn start
```

# New to Node.js Development?

If you're new to Node.js development and want to get started quickly, try using our setup scripts.<br/>

**For Windows**<br/>
Windows users will need to install [nvm](https://github.com/coreybutler/nvm-windows) before running setup.bat. The latest installers [can be found here](https://github.com/coreybutler/nvm-windows/releases/latest)<br/>

```bat
git clone https://github.com/forcecreators/salesforce-profiler salesforce-profiler
cd salesforce-profiler
setup.bat
yarn start
```

**For MacOS**

```sh
git clone https://github.com/forcecreators/salesforce-profiler salesforce-profiler
cd salesforce-profiler
sudo sh setup.sh
yarn start
```

## What the Setup Scripts Do

- Installs [Node.js](https://github.com/nodejs/node)
- Installs a Node.js Version Manager
  - **Windows Users:** you'll need to install [nvm](https://github.com/coreybutler/nvm-windows) before running setup. The latest installers [can be found here](https://github.com/coreybutler/nvm-windows/releases/latest)
  - **MacOS Users:** `setup.sh` will automatically install [n](https://github.com/tj/n)
- Tells your Node Version Manager to run on the latest stable release
- Installs [yarn](https://github.com/yarnpkg/yarn)
- Tells yarn to gathers all project dependencies and performs a build
