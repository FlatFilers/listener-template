# Package Usage

Flatfile Listeners will be deployed and run on an AWS Lambda. This means that any package installed and used must be
able to run in a Lambda environment.

- The `@flatfile/api` package is Flatfile's official Typescript SDK. It should be used for all Flatfile-related types and configurations, including `SheetConfig`, `WorkbookConfig`, and other Flatfile-specific types.
