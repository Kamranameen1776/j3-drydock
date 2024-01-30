# DryDock API

The backend part of DryDock application.

**← back to** [Main README](../README.md)

## Quick start

1. Rename .env.local to .env and fill the credentials.

2. Install packages

```sh
$ npm install
```

3. Start application.

```sh
$ npm run local
```

## Run unit tests locally

```sh
$ npm run test
```

## Run integration tests locally

```sh
$ npm run test:integration
```

## Generate API documentation/swagger.json
```sh
$ npm run swagger
```

## healthcheck
```
    http://localhost:3020/drydock/actuator/version
    http://localhost:3020/drydock/actuator/health
```
