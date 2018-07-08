[![pipeline status](https://gitlab.com/hitask/hitask-web/badges/develop/pipeline.svg)](https://gitlab.com/hitask/hitask-web/commits/develop) [![coverage report](https://gitlab.com/hitask/hitask-web/badges/develop/coverage.svg)](https://gitlab.com/hitask/hitask-web/commits/develop) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

### Rewrite from scratch of current web-based task management product that you can see at [hitask.com/app](https://hitask.com/app)

## 1 Products

This project generates following products:

| Product name | Description | Deployment - production | Deployment - test |
| ---- | ---- | --- | --- |
| Web-app | Web application | [app.hitask.com](https://app.hitask.com) | [app.testask.com](https://app.testask.com) |
| Desktop | Electron-based desktop version of web-app | [Mac](https://cdn.hitask.com/desktop/production/macos/Hitask.dmg), [Windows](https://cdn.hitask.com/desktop/production/windows/Hitask.exe) | [Mac](https://cdn.hitask.com/desktop/testask/macos/Hitask-Beta.dmg), [Windows](https://cdn.hitask.com/desktop/testask/windows/Hitask-Beta.exe) |
| Chrome Ext | Chrome Extension | [Chrome store](https://chrome.google.com/webstore/detail/hitask-team-task-manageme/nnlnblaalckiclfobnmlpmokohcnblol) | [Chrome store](https://chrome.google.com/webstore/detail/hitask-beta/hdlaolppagcfiibhhdifefmphimaeigm) |
| Chrome Ext Calendar | Chrome Extension Calendar | | |

## 2 Repository structure

Read about repository structure in [WORKSPACE.md](WORKSPACE.md)

## 3 Requirements for compilation and development

All requirements are same for all projects:

* node: >=8.9.3
* npm: >=5.5.1
* yarn >=1.3.2

Note: after updating node or npm it is better to reinstall node_modules:

```bash
rm -rf node_modules
yarn
```

## 4 Sub-projects

### 4.1 Webapp development

Hitask webapp development workflow is described in [WEBAPP.md](WEBAPP.md)

### 4.2 Chrome extension development

Hitask Chrome extension development workflow is described in [CHROME.md](CHROME.md)

### 4.3 Chrome extension development

Hitask Desktop app development workflow is described in [DESKTOP.md](DESKTOP.md)

### 4.4 Components development in catalog

To develop a new atomic React component, do it firstly in development catalog. To run the catalog, use:

```bash
yarn catalog:run
```

## 5 Git and repository guidelines

### 5.1   Set your git user name and email

Git id should be your Full Name and email. No nicknames please.

<pre>
git config --global user.email "your_email@example.com"
git config --global user.name "Billy Everyteen"
</pre>

* We use western name format, with First name first and Last name second.
* Add avatar picture to your account in Gitlab and Slack. We like to put a face to the name 😎.

### 5.2 Branches

We use [Git-flow system](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

* **Current Version** working branch is `develop` This branch is automatically deployed to app.testask.com environment.
* **Next Release Version** branch is called `next`

New features and fixes developed on their own branches, merging them to `develop` (or `next`) afterwards. Bugfixes go under `bugfix/` path, tasks under `feature/` path.

* feature/<task number>
* bugfix/<task number>

Example:

<pre>
feature/3345
bugfix/2901
</pre>

### 5.3 Commit title

Commit title should provide some description. It's not enough to only have ticket number. Few words from ticket description is ok.

Examples of commit messages:

<pre>
#3451 Added check for invalid email
#6571 - Edit Item screen – after attaching image and canceling editing, confirmation alert dialog is shown
#6561: Refactoring of ItemDetails screen
</pre>

### 5.4 All commits related to tasks

Any commit is attached to a task. There are no commits with no associated task. 

### 5.5 Skip CI Build

All pushed commits trigger CI Build process.  
Sometimes you commit some minor change that is definitely does nto require build/testing. To skip the build add `[ci skip]` at the end of your commit message.


### 5.6 Merge Requests

**Title with task number**

Usually merge request has same name as the ticket it's for.
Merge request title should be meaningful and have same format as commit title.  Examples:

<pre>
#351 Added check for invalid email
#661 Refactoring of ItemDetails screen
</pre>

**Assign merge request** to reviewer.

## 6 Deployment workflow

This repository is used for development only. Deployment is performed via another project repositories ([hitask-chrome-ext](https://gitlab.com/hitask/hitask-chrome-ext), [hitask-web-app](https://gitlab.com/hitask/hitask-web-app)). Steps to make a development deploy:

1. Develop in `hitask-web` repository. Commit & push to `develop` branch
1. Go to project repository
1. Run `yarn release` - Here you can choose how to update the version - major, minor or patch
1. Push to `develop` branch

If you want to make a production deploy, make additional step:

1. In project repository merge `develop` to `master` and push

## 7 Development guides

Project uses ES6.

### 7.1 Code style

For code style consistency use editor with ESlint and Stylelint support, .eslintrc and .stylelintrc files are included in the repository. Use

```bash
yarn eslint
```

and

```bash
yarn stylelint
```

commands to check codebase on errors.

### 7.2  Code documentation

We use [JSDoc](http://usejsdoc.org/) for inline code documentation. Describe all declarations of main functions and constants. Run `yarn docs:run` to open auto-generated docs pages.

### 7.3 Test your changes locally

It's highly recommended to check your changes on errors before merging feature/bugfix branch to `develop` branch and before pushing `develop`. Tests run automatically on each `develop` push, so the pipeline will fail in case of errors. Commands to check:

```bash
yarn eslint
yarn stylelint
yarn test
```

Read more about test coverage in [TEST.md](TEST.md)

### 7.4 Adding a dependency

Check 'Adding a dependency' section in [WORKSPACE.md](WORKSPACE.md)

### 7.5 Mock API server

To make development 100% locally, there is a local read-only API server. You can start the server with `yarn mockapi:run`. It accepts any username/password for authorization and always returns the same data. Any PUT/POST/PATCH request will take no effect and always return same response `{ response_status: 0, __mockResponse: true }`. Mock API is useful for quick start

### 7.6 Editor setup

#### VS Code

* disable jshint plugin
* [install editorconfig plugin](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
* [install eslint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* [install stylelint plugin](https://marketplace.visualstudio.com/items?itemName=shinnn.stylelint)
* [install prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
* [install Code Spell Checker plugin](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
* [install Gitlab Workflow plugin](https://marketplace.visualstudio.com/items?itemName=fatihacet.gitlab-workflow)

## 8 Working with issues/tasks

### Labels (Tags) meanings

* ~"In Progress" Working on this task. Task implementation is in progress.
* ~Feedback Need additional information. Add assignee whom you want to ask and reference them with "@" in question comment
* ~Resolved task is implemented. May be ready for ~Testing once deployed. Or ~"Code Review" once MR is created
* ~Testing task is done and task is deployed to test environment or test product build is available to tester for testing
* ~"Tested OK" Tester confirms that implementation is correct
* ~"Tested Error" Test result invalid
* ~"Code Review" MR is created and assigned to reviewer
* ~"Unit Tests" This task need Unit tests to be implemented. Remove tag once unit tests are implemented
* ~"Design Needed" Task is missing visual or specification design

### 8.1 Development

#### 8.1.1 Where are my tasks?

* **Check your email.** You will be added as Assignee for tasks that are for you to work on. Email notification is automatically sent to you. This means that you should start working on assigned tasks.
* If you are not the only one assignee please consult with manager or add comment to the task if you should be working on it.
* To see tickets that are assigned to you, open [Issues list](https://gitlab.com/hitask/hitask-web/issues) and in search bar use `assignee:` to filter issues by Assignee.
* Work on tasks in order of version and severity. Lower version tasks to be done first. Bug fixes and tasks marked with `Urgent`, `High` labels to be done first.

For example, You have tasks assigned to you:

* Task A, version 1.1
* Task B, version 1.1 `Bug`
* Task C, version 1.2
* Task D, version 1.2 `Urgent`

Your work order will be: B,A,D,C

#### 8.1.2 Working on a task

* When you start working on a task, add Label ~"In Progress" to the task. This way we can see what are you working on.
* If you switch between tasks, remove ~"In Progress" from task you're not working anymore.

#### 8.1.3 Finishing work and handing over

* When work is finished, create a merge request (MR) from feature/bugfix branch with the ticket.
* Check that build pipeline passes before handing over or merging your work to develop branch.
* Remove label ~"In Progress"
* If Code review is required, add label ~"Code Review"
* If there's no Code Review but MR is not merged or not deployed, add label ~Resolved
* If your branch was merged to `develop` and available for qa testing, set label to ~Testing

#### 8.1.4 Task questions

* If you have question about a task, add assignee person for whom the question is. Or `@mention` them in comment.
* Add label ~"Feedback". Remove ~"In Progress" if you're waiting for input.

### 8.2 Tester: Testing

#### 8.2.1 What to test

See 8.1.1 above, please note that tasks that are intended for testing should have label ~Testing. If there's no label ~Testing you shouldn't be testing the task.

#### 8.2.2 When Testing is completed

* Tester remove label ~Testing and add label ~"Tested OK" or ~"Tested Error" depending on outcome.
* Tester remove themselves from ticket's assignees.
* In case of ~"Tested Error" add appropriate comment describing what is the problem.

## 9 Localization

There should not be any plain strings in code. Every string is localized.

### Development

* Add text form the task or design to `locales/src/en/js.properties`
* run `yarn compile:locales`
* We use [react-redux-i18n](https://github.com/artisavotins/react-redux-i18n). To use text in code use `<Translate value="__T(js.your.key)>` or `I18n.t(__T(js.your.key))` (__T is required for tests)

### Text exceptions

Some strings should not be translated and remain in English, hardcoded without translation:

| text | notes |
|------|-------|
| Hitask | Product name |
| Team Business, Premium | Hitask product names |
| API, HTML, iOS, Android | Technical terms|
| Excel, OpenOffice, Numbers|3rd party product names.("Numbers" is the name of Apple spreadsheet software)|

## 10 Component naming conventions

### Item List

* **ItemList** - list of Items
* **ItemListItem** - item in list, before it's clicked
* **ItemView** - Expanded item after it's clicked
* **ItemForm** - modify item form after "Edit" button clicked
* NewItemForm - new item
* ItemListToolbar - toolbar above item list with sort options
* CompletedGroup, OverdueGroup, ProjectGroup, ColorGroup, PersonGroup - groups when items are grouped

### Navbar

* **NavBar** - top bar in the web app or chrome ext
* **SettingsMenu** - new menu that replaces settings page
* ReportsMenu
* ExportMenu

### Small Calendar (left column)

* BigCalendar - tab with calendar grid
* SmallCalendar - calendar on the left
* DayPlanner - day agenda timeline in left column under SmallCalendar

### Team (right column)

* Team - team column on the right
* TeamPerson - person item in Team list
* TeamPersonDetails - information window about person
