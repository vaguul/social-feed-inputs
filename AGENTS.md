# Agent Guide

- Keep this package small, deterministic, and reusable outside private products.
- Do not add API keys, cookies, OAuth tokens, private feed data, or account-specific fixtures.
- Add tests for parsing, normalization, and output-shape changes.
- Update README, CONTRIBUTING, and workflow validation when public behavior changes.
- Run `npm run typecheck` and `npm test` before committing.
