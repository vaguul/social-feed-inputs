# social-feed-inputs

![CI](https://github.com/valaksi/social-feed-inputs/actions/workflows/ci.yml/badge.svg)
![MIT License](https://img.shields.io/badge/license-MIT-8fe3c7)

Helpers to normalize user input and resolve feed URLs for social alert systems.

## Supported cases

- YouTube channel IDs and feed URLs
- Twitch logins and channel URLs
- Reddit subreddits and users
- generic RSS-backed social sources

## Why this exists

Bots and dashboards often need the same input cleanup rules for social alerts. This package keeps the normalization and feed-resolution logic in one reusable place.

## Install

```bash
npm install
```

## Validate

```bash
npm run typecheck
npm test
```

## Maintenance

- Keep provider parsing deterministic and covered by tests.
- Do not add API keys, OAuth secrets, cookies, or live account data to fixtures.
- Update the README when a new provider or output shape is added.

## Author

Built and published by Valaksi.

## License

MIT
