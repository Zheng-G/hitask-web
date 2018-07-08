# Desktop app development

All project CLI commands have pattern `{project}:{environment}:{command}`. Current document describes `desktop` project. Available environments: `testask`, `production`, `mockapi` (replace `{env}` placeholder with environment name in following commands)

## Prepare

Install all dependencies and compile JSON locales. Run in root folder:

```bash
yarn
yarn locales:compile
```

## Local development

To run dev webpack server for the desktop app run

```bash
yarn desktop:{env}:dev
```

To run development process using mock API server, use

```bash
yarn desktop:mockapi:dev
```

## Bundle build

To build a bundle, run:

```bash
yarn desktop:{env}:build
```

This command creates `dist/desktop-{env}` dist folder.

After that you can start the application, using:

```bash
yarn desktop:{env}:serve
```

## Packages build

To build a native distributive packages, run:

```bash
yarn desktop:{env}:package

