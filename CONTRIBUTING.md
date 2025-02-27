# Contributing to Lerna

> Please note that this project is released with a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md).
> By participating in this project you agree to abide by its terms.

First, ensure you have the [latest `npm`](https://docs.npmjs.com/).

To get started with the repo:

```sh
$ git clone git@github.com:lerna/lerna.git && cd lerna
$ npm ci
```

## Code Structure

Currently, the [source](https://github.com/lerna/lerna/tree/main) is split up into a few categories:

- [utils](https://github.com/lerna/lerna/tree/main/utils): shared packages to run git, npm, fs, and more.
- [core](https://github.com/lerna/lerna/tree/main/core): basic building blocks, including Package-related abstractions and the command superclass.
- [commands](https://github.com/lerna/lerna/tree/main/commands): each command has an `initialize` and `execute` function.
  - These commands are consumed as yargs subcommands in [core/cli/index.js](https://github.com/lerna/lerna/blob/main/core/cli/index.js), which is required from the executable [`core/lerna/cli.js`](https://github.com/lerna/lerna/blob/main/core/lerna/cli.js).

## Submission Guidelines

### <a name="submit-issue"></a> Submitting an Issue

Before you submit an issue, please search the issue tracker. An issue for your problem may already exist and has been resolved, or the discussion might inform you of workarounds readily available.

We want to fix all the issues as soon as possible, but before fixing a bug we need to reproduce and confirm it. Having a reproducible scenario gives us wealth of important information without going back and forth with you requiring additional information, such as:

- the output of `npx lerna info`
- `yarn.lock` or `package-lock.json`
- and most importantly - a use-case that fails

A minimal reproduction allows us to quickly confirm a bug (or point out a coding problem) as well as confirm that we are fixing the right problem.

We will be insisting on a minimal reproduction in order to save maintainers' time and ultimately be able to fix more bugs. Interestingly, from our experience, users often find coding problems themselves while preparing a minimal reproduction repository. We understand that sometimes it might be hard to extract essentials bits of code from a larger codebase, but we really need to isolate the problem before we can fix it.

You can file new issues by filling out our [issue form](https://github.com/lerna/lerna/issues/new/choose).

### <a name="submit-pr"></a> Submitting a PR

This project follows [GitHub's standard forking model](https://guides.github.com/activities/forking/). Please fork the project to submit pull requests.

## Commands

### Run Unit Tests

```sh
$ npm test

# watch for changes
$ npm test -- --watch

# For a specific file (e.g., in core/command/__tests__/command.test.js)
$ npm test -- --watch core/command
```

By default, `npm test` also runs the linter.
You can skip this by calling `jest` directly:

```sh
$ npx jest
$ npx jest --watch
$ npx jest --config jest.integration.js
# etc
```

### Run Integration Tests

```sh
$ npm run integration

# test a specific file
$ npm run integration -- lerna-publish

# watch for changes
$ npm run integration -- --watch

# watch a specific file
$ npm run integration -- --watch lerna-publish
```

### Linting

```sh
$ npm run lint
```

It's also a good idea to hook up your editor to an eslint plugin.

To fix lint errors from the command line:

```sh
$ npm run lint -- --fix
```

### Local CLI Testing

If you want to test out Lerna on local repos, you can leverage verdaccio as a local npm regsitry.

Open a new terminal window and run the following from the root of the workspace:

```sh
$ npx lerna run --scope @lerna/e2e start-verdaccio
```

This will run verdaccio on http://localhost:4872

In another terminal window you can now publish any new version (in this example `999.9.9`) to that local registry:

```sh
npm run e2e:local-publish -- 999.9.9
```

You can then install your local version of lerna wherever you want by leveraging the `--registry` flag on the npm/npx client.

E.g. you could start a new lerna workspace with your new version

```sh
cd /some/path/on/your/machine
npx --registry=http://localhost:4872/ lerna@999.9.9 init
npm --registry=http://localhost:4872/ install
npx lerna --version # 999.9.9
```

### Coverage

If you would like to check test coverage, run the coverage script, then open
`coverage/lcov-report/index.html` in your favorite browser.

```sh
$ npm test -- --coverage

# OS X
$ open coverage/lcov-report/index.html

# Linux
$ xdg-open coverage/lcov-report/index.html
```

### Releasing

If you are a member of Lerna's [GitHub org](https://github.com/orgs/lerna/people) and have read-write privileges in Lerna's [npm org](https://www.npmjs.com/org/lerna) _with 2-factor auth enabled_, congratulations, you can cut a release!

You'll need to set up a local `.env` file in the repo root to provide the required environment variables.
The `.env.example` file is available in the root as a template.
The root `.env` file is _never_ placed under version control.

Once that's done, run the release script and await glory:

```sh
npm run release
```
