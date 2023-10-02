# J3DryDock

The frontend part of DryDock application.

**← back to** [Main README](../README.md)

## Link with Jibe2Web app

This library needs to be tested with `Jibe2Web`, here are the required setup steps:

- Run `npm run build:watch` script to build library and watch for changes.
- The above command should put the build files in `dist/j3-drydock`. Navigate to this directory in terminal.
- Run `npm link` in the above directory. This will create a symlink for the library in npm's local register.
- Navigate to the `Jibe2Web` repo and run `npm link ../j3-drydock/frontend/dist/j3-drydock` in root. Change the relative path to your `dist/j3-drydock` path mentioned above. The path mentioned here is for an example path.
- In `Jibe2Web` repo run `npm run start` or whichever command which you usually use to start `Jibe2Web`. But as an example you can run `npm run start:local` that uses `my-local` configuration and `src/environments/environment-my-local.ts` file.

At this point, you should be able to make changes to the `j3-drydock` library and see the changes in `Jibe2Web` app automatically.

Note:
To make your module visible in `Jibe2Web` you additionally need to add routing there.
in `app-routing.module` in `Jibe2Web` you will need to add:

```ts
{
    path: "drydock",
    loadChildren: () => import("j3-drydock").then(m => m.J3DryDockModule),
    canActivateChild: [AuthGuardService],
},
```

You need to add the API Prefix to allow the library to make API calls. In `Jibe2Web` you need to add the following line to `environment.ts`:

```ts
    drydockAPI: `http://localhost:<port>`
```

## Code scaffolding

Run `ng generate component component-name --project j3-drydock` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project j3-drydock`.

> Note: Don't forget to add `--project j3-drydock` or else it will be added to the default project in your `angular.json` file.

## Run unit tests locally

```sh
$ npm run test
```