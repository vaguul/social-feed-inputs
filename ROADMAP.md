# Roadmap

This roadmap keeps provider support and maintenance work explicit.

## Current focus

- Keep provider parsing deterministic and covered by tests.
- Document the supported input and output shapes.
- Avoid live credentials, cookies, or private account data in fixtures.
- Keep the public API small until new provider behavior is tested.

## Good first issues

- Document a provider support matrix in the README or docs.
- Add missing negative test cases for malformed provider URLs.
- Improve examples for bots and dashboards that accept user-provided feed inputs.

## Later

- Evaluate additional providers only when they have stable public feed URLs.
- Add generated documentation from test fixtures if examples start drifting.
