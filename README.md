# Task Manager

A small, private to-do app for macOS. It runs as a native desktop window, keeps
everything on your own machine, and has no accounts, servers or network access.

## Features

- **Add tasks** with an optional due date.
- **Complete or delete** tasks, and clear all completed ones at once.
- **Due dates** can be changed or removed at any time. Overdue tasks are shown in
  red and tasks due today in orange.
- **Filter** the list by All, Active or Done.
- **Sort** by your own order or by due date (soonest first, undated tasks last).
- **Drag and drop** tasks to reorder them in "My order" mode.
- **Remembers** your tasks and your chosen sort order between launches.

## Building

`npm start` runs the app in development. `npm run dist` builds the `.app` and
`npm run dist:dmg` builds an installer, both into `dist/`.
