# Webapp development

All project CLI commands have pattern `{project}:{environment}:{command}`. Current document describes `webapp` project. Available environments: `testask`, `production`, `mockapi` (replace `{env}` placeholder with environment name in following commands)

## Prepare

Install all dependencies and compile JSON locales. Run in root folder:

```bash
yarn
yarn locales:compile
```

## Local development

To run dev webpack server for the webapp run

```bash
yarn webapp:{env}:dev
```

To run development process using mock API server, use

```bash
yarn webapp:mockapi:dev
```

## Build, test & deploy

To build a bundle, run:

```bash
yarn webapp:{env}:build
```

This command creates `dist/webapp-{env}` dist folder.

After that you can start the application, using:

```bash
yarn webapp:{env}:serve
```

To run automatic integration test in browser, run:

```bash
yarn webapp:{env}:test
```

To deploy a bundle, run:

```bash
yarn webapp:{env}:deploy
```
