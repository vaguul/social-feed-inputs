# Contributing

Thanks for considering a contribution.

## Good first changes

- Add tests for provider parsing edge cases.
- Improve README examples.
- Keep feed URL builders small and deterministic.

## Local validation

```bash
npm ci
npm run typecheck
npm test
```

## Pull requests

- Explain the input case or behavior being changed.
- Include tests for parsing, normalization, or output shape changes.
- Do not include API keys, account tokens, cookies, or private feed data.
