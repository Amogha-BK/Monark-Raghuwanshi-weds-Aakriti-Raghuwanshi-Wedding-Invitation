# Wedding Invitation

Complete React 19, Vite 8, and Tailwind CSS 4 project, including the animated envelope entrance, countdown, event details, calendar and map links, scratch card, music, all media assets, and local owner editor.

This copy preserves the source project's existing invitation content and metadata. The repository name does not automatically personalize it for Monark Raghuwanshi and Aakrati Raghuwanshi.

## Run locally

Use Node.js 22.18 or newer.

```sh
npm ci
npm run dev
```

## Owner editor

```sh
npm run editor
```

Open http://127.0.0.1:8444/owner-editor.html. The local editor supports names, family wording, dates, functions, venues, artwork and music uploads, preview, local drafts, and customer JSON import/export.

See [the customer editor guide](docs/customer-editor.md) for complete instructions and personalized invitation builds.

## Validate and build

```sh
npm test
npm run typecheck
npm run build
npm run preview
```

Production output is generated in `dist/`. The owner editor uses a separate local server and is excluded from the public build. Existing deployment configuration is included; copying this repository does not deploy it.

Images, audio, and video are committed directly so fresh checkouts contain the complete media. Dependencies, generated builds, private customer records, environment files, and operating system metadata are excluded.
