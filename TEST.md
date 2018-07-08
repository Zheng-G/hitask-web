# Guide for test coverage

## Unit tests

Test coverage is important for code maintainability. Every new feature/bugfix (especially hard-catch bugs) must be covered with unit tests, if they are in test coverage scope. If coverage level is going to be decreased after feature/bugfix merge, the pipeline wil automatically fail.

We use [jest](https://facebook.github.io/jest/) and [enzyme](http://airbnb.io/enzyme/) to cover codebase with unit tests.

**Current unit test coverage scope:** `modules` and `utils` packages.

### `Modules` package

Since `modules` package contains all main logic of the application, it has to be covered with tests as much as possible. Read the [docs about writing tests for redux modules](https://redux.js.org/recipes/writing-tests). To test redux functions, create for each module:

* `selectors.{moduleName}.test.js`
* `actions.{moduleName}.test.js`
* `reducer.{moduleName}.test.js`

### `Utils` package

`Utils` contains common reusable utility functions, that's why it's also must be covered. For each utils file create a test file with same name.
