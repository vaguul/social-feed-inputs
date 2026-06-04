# social-feed-inputs

![CI](https://github.com/vaguul/social-feed-inputs/actions/workflows/ci.yml/badge.svg)
![MIT License](https://img.shields.io/badge/license-MIT-8fe3c7)

Helpers to normalize user input and resolve feed URLs for social alert systems, maintained by Vaguul under the Zemiax personal software studio.

## Supported cases

- YouTube channel IDs and feed URLs
- Twitch logins and channel URLs
- Reddit subreddits and users
- generic RSS-backed social sources

## Provider support matrix

| Provider input | Stored provider | Accepted input example | Normalized output example |
| --- | --- | --- | --- |
| YouTube | `youtube` | `UC_x5XG1OV2P6uZZ5FSM9Ttw` | `https://www.youtube.com/feeds/videos.xml?channel_id=UC_x5XG1OV2P6uZZ5FSM9Ttw` |
| Twitch | `twitch` | `https://www.twitch.tv/Shroud` | `https://api.twitch.tv/helix/streams?user_login=shroud` |
| Reddit subreddit | `reddit` | `https://www.reddit.com/r/typescript/?sort=new` | `https://www.reddit.com/r/typescript/new.json?limit=10&raw_json=1` |
| Generic RSS-backed source | `rss` | `https://example.com/feeds/announcements.xml` | `https://example.com/feeds/announcements.xml` |

## Normalization examples

### YouTube

- Valid input: `https://www.youtube.com/feeds/videos.xml?channel_id=UC_x5XG1OV2P6uZZ5FSM9Ttw`
- Stored provider: `youtube`
- Normalized feed URL: `https://www.youtube.com/feeds/videos.xml?channel_id=UC_x5XG1OV2P6uZZ5FSM9Ttw`

### Twitch

- Valid input: `https://www.twitch.tv/Shroud`
- Stored provider: `twitch`
- Normalized stream URL: `https://api.twitch.tv/helix/streams?user_login=shroud`

### Reddit subreddit

- Valid input: `r/typescript`
- Valid URL input: `https://www.reddit.com/r/typescript/?sort=new`
- Stored provider: `reddit`
- Normalized feed URL: `https://www.reddit.com/r/typescript/new.json?limit=10&raw_json=1`

### Generic RSS-backed sources

Use these providers when the source itself is not normalized by this package and
the caller already has a stable feed URL.

- Valid input label: `Instagram`
- Valid feed URL: `https://example.com/feeds/announcements.xml`
- Stored provider: `rss`
- Normalized feed URL: `https://example.com/feeds/announcements.xml`

Provider-specific parsers do not guess across unsupported domains. For example,
`https://example.com/r/typescript` is rejected as a subreddit input instead of
being treated as Reddit.

## Why this exists

Bots and dashboards often need the same input cleanup rules for social alerts. This package keeps the normalization and feed-resolution logic in one reusable place.

## Install

Install from a GitHub release tag:

```bash
npm install github:vaguul/social-feed-inputs#v0.1.4
```

Local development:

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

Built and maintained by Vaguul for Zemiax.

## License

MIT
