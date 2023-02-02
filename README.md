# Hello World

This App is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Requirements
- [Node 16](https://nodejs.org/en/download/)

### Installation

```
$ yarn
```

### Environment Setup
In the project root folder rename the file `dotenv` to `.env`.

### Docusaurus Config
Make sure to update the `docusaurus.config.js` file to reflect your project details.
```
const config = {
    ...
    organizationName: 'alicenet', // Usually your GitHub org/user name.
    projectName: 'hello-world', // Usually your repo name.
    ...
    presets: [
        [
            ...
            ({
                docs: {
                    ...
                    // Please change this to your repo.
                    editUrl: 'https://github.com/alicenet/hello-world/',
                },
                ...
            }),
        ],
    ],
}
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
