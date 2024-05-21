# Envkey - Running the repo locally

## Steps to download and prepare your local dev environment for Envkey

- Download the repo
  - HTTP - `https://github.com/last-rev-llc/tarealty-marketing`
  - SSH - `git@github.com:last-rev-llc/tarealty-marketing.git`
- Open Terminal within VS Code or your favorite IDE and use the following commands.

```
nvm use
pnpm i
envkey init
```

- You will need to select "Attach an existing EnvKey app", hit return.
- Use your arrow keys and Select the `TA Realty` app, then hit return.

_Once you have attached the appropriate envkey app, it should have created a local cli key for you behind the scenes which will then allow you load the variables._

### <span style="color:red"> _If the `.envkey` file shows a different appId or changes in version control in any way, please alert cameron@lastrev.com immediately. Do not merge any `.envkey` file changes to main, it can and will break builds!_</span>

## Running the dev environment

`envkey-source -- pnpm dev`

OR

`es -- pnpm dev`

This didn't work for a dev a while back because the symbolic link wasn't set up but it is just the shorthand version of the above command.

This will be improved upon to where we only need to run the `pnpm dev` command, but for now, without the `.env` file locally, you will just need to prefix any commands with `es --` or `envkey-source --` in order to load the env vars to your processes.

## Troubleshooting

General troubleshooting steps for Envkey

- Always make sure your envkey is up to date
  - `npm i -g envkey`
- Can't see the environment vars? Try re-loading envkey's core. This typically only occurs when first getting invited or adding a new app, but it is useful to know as a quick troubleshooting step to rule out any issues.
  - `envkey core stop`
  - `envkey core start`
- Viewing the environment variables via CLI, simply type `es` and hit return. As long as everything is running properly, you should be able to see the full output of the current local env you are using.
- ENVKEY MISSING - Did you initialize your envkey app locally? If not, you may need to initialize it which will create a local cli key for that particular repo/app.
  - `envkey init`
  - Follow the CLI instructions to attach it to the existing app.
-

TransparentDark and TransparentLight
Quick Supplemental Body on Block?
Icons for links?

# TODO

[x] Implement 404 for non generated pages
[x] Deploy to Vercel
[x] Deploy Storybook to Vercel
[x] Implement Sitemap
[x] Implement Robots
[x] Implement CSP policies
[x] Implement GraphQL preview endpoint
[x] Implement Preview
[x] Implement Content Redirect
[ ] Create Grid documentation and working with Block, Collection
[ ] Implement Test pipeline
[ ] Implement E2E pipeline
[ ] Implement Chromatic pipeline
[] Implement path resolution for href
[] Implement Custom 404
[] Implement theme on Storybook
[] Implement Analytics
[] Implement Contentful Sidekick
[] Implement Live Editor and other UIEs
[] Implement Theme api endpoint
[] Implement \_error page
[] Implement Algolia
[] Implement path v2 resolution
[] Implement Localization

## Components

[] Block
[] Hero
[] Link
[] Text
[] Media
[] Page

# LastRev starter

This is an official Starter by LastRev with multiple meta-frameworks all working in harmony and sharing packages.

This example also shows how to use [Workspace Configurations](https://turbo.build/repo/docs/core-concepts/monorepos/configuring-workspaces).

## Using this example

Run the following command:

```sh
npx create-turbo@latest -e kitchen-sink
```

## What's inside?

This repo includes the following packages and apps:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) app
- `ui`: a complete React UI library for displaying content
- `scripts`: Jest and ESLint configurations
- `tsconfig`: tsconfig.json's used throughout the monorepo

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This LastRev has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting
