# TaskManager

A local-only task manager built with Electron. Tasks are stored in a JSON file in
`~/Library/Application Support/task-manager/tasks.json`; nothing leaves your machine.

## Run in development
    npm install
    npm start

## Build a Mac app
    npm run dist        # produces dist/mac-arm64/Task Manager.app
    npm run dist:dmg    # produces a .dmg installer

Drag `Task Manager.app` into /Applications. The app is unsigned, so on first launch right-click it and choose Open.
