# Lux

Lux is a collection of helpful little applications that function together to shine some light in your life.

Current programs include:
- Accounting
- Meal Planner

## Development

The project consists of a React web app front-end (see `./src/App.tsx`) and an HTTP server backend (see `./src/server/`).

To start the web app:

```sh
$ bun run --silent dev
```

To start the HTTP/TRPC server:

```sh
$ bun run --prefer-offline --silent --watch ./src/server/main.js
```

