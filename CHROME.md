# Chrome extension development

All project CLI commands have pattern `{project}:{environment}:{command}`. Current document describes `ext-app` and `ext-cal` projects (replace `{project}` placeholder with project name in following commands). Available environments: `testask`, `production` (replace `{env}` placeholder with environment name in following commands)

## Prepare

Install all dependencies and compile JSON locales. Run in the root folder:

```bash
yarn
yarn locales:compile
```

## Local development

To run dev webpack server for the chrome extension run:

```bash
yarn {project}:{env}:dev
```

After that, drag&drop the directory `dist/{project}-dev` to the extensions page in Chrome `chrome://extensions`.

You can also run chrome extension in regular chrome tab, for easier debugging. To do that, run:

```bash
yarn {project}:{env}:dev-tab
```

and open `http://localhost:3003` in Google Chrome.

To run development process using mock API server, use

```bash
yarn webapp:mockapi:dev
```

or

```bash
yarn webapp:mockapi:dev-tab
```

## Build, test & deploy

To build a bundle, run:

```bash
yarn {project}:{env}:build
```

After that you can drag&drop the folder `dist/{project}-{env}` to the extensions page in Chrome `chrome://extensions`

To run automatic integration test in browser, run:

```bash
yarn {project}:{env}:test
```

To deploy a bundle, run:

```bash
yarn {project}:{env}:deploy
```

After that install/update extension from Chrome store.

* Beta stage: [ext-app](https://chrome.google.com/webstore/detail/hitask-beta/hdlaolppagcfiibhhdifefmphimaeigm), [ext-calendar](https://chrome.google.com/webstore/detail/hitask-calendar-beta/mdfleddhginjkilepiklgdpgjhhflikp).
* Production stage: [ext-app](https://chrome.google.com/webstore/detail/hitask-team-task-manageme/nnlnblaalckiclfobnmlpmokohcnblol), [ext-calendar](https://chrome.google.com/webstore/detail/hitask-calendar/klampmflkkkkddabnobekobadggokego)

## Webstore uploads management

More details about uploads and their settings are available in [Chrome webstore developer dashboard](https://chrome.google.com/webstore/developer/dashboard)
