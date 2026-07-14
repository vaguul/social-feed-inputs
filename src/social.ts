export const SOCIAL_ALERT_PROVIDER_IDS = ["rss", "youtube", "reddit", "twitch"] as const;

export type SocialAlertProvider = (typeof SOCIAL_ALERT_PROVIDER_IDS)[number];
const YOUTUBE_CHANNEL_ID_PATTERN = /^UC[a-zA-Z0-9_-]{22}$/;
const REDDIT_SUBREDDIT_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_]{1,20}$/;
const REDDIT_USER_PATTERN = /^[A-Za-z0-9_-]{3,20}$/;
const TWITCH_LOGIN_PATTERN = /^[A-Za-z0-9_]{4,25}$/;

export function buildDefaultSocialAlertTemplate() {
  return "**{label}**\n{title}\n{url}";
}

export function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function normalizeYouTubeChannelId(value: string) {
  const candidate = value.trim();
  return YOUTUBE_CHANNEL_ID_PATTERN.test(candidate) ? candidate : null;
}

export function normalizeRedditSubreddit(value: string) {
  const trimmed = value.trim();
  const urlCandidate = getRedditPathSegment(trimmed, ["r"]);
  const candidate = stripTrailingSlashes(stripPathPrefix(urlCandidate ?? trimmed, ["r"]));
  return REDDIT_SUBREDDIT_PATTERN.test(candidate) ? candidate : null;
}

export function normalizeRedditUser(value: string) {
  const trimmed = value.trim();
  const urlCandidate = getRedditPathSegment(trimmed, ["u", "user"]);
  const candidate = stripTrailingSlashes(stripPathPrefix(urlCandidate ?? trimmed, ["u", "user"]));
  return REDDIT_USER_PATTERN.test(candidate) ? candidate : null;
}

export function buildRedditSubredditFeedUrl(subreddit: string) {
  return `https://www.reddit.com/r/${subreddit}/new.json?limit=10&raw_json=1`;
}

export function buildRedditUserFeedUrl(userName: string) {
  return `https://www.reddit.com/user/${userName}/submitted.json?limit=10&raw_json=1`;
}

export function normalizeTwitchLogin(value: string) {
  const trimmed = value.trim();
  const urlCandidate = getTwitchPathSegment(trimmed);

  if (isValidUrl(trimmed) && urlCandidate === null) {
    return null;
  }

  const source = urlCandidate ?? (trimmed.startsWith("@") ? trimmed.slice(1) : trimmed);
  const candidate = stripLeadingSlashes(source).split(/[/?#]/, 1)[0] ?? "";

  return TWITCH_LOGIN_PATTERN.test(candidate) ? candidate.toLowerCase() : null;
}

export function buildTwitchStreamsUrl(login: string) {
  return `https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(login)}`;
}

export function buildYouTubeFeedUrl(channelId: string) {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
}

export function extractYouTubeChannelIdFromFeedUrl(feedUrl: string) {
  if (!isValidUrl(feedUrl)) {
    return null;
  }

  const url = new URL(feedUrl);

  if (!isHostnameOrSubdomain(url.hostname, "youtube.com")) {
    return null;
  }

  return normalizeYouTubeChannelId(url.searchParams.get("channel_id") ?? "");
}

export function decodeBasicHtmlEntities(value: string) {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": "\"",
    "&#39;": "'"
  };

  return value.replace(/&(amp|lt|gt|quot|#39);/g, (entity) => entities[entity] ?? entity);
}

export function renderSocialAlertTemplate(
  template: string,
  context: {
    label: string;
    title: string;
    url: string;
    publishedAt?: string | null;
  }
) {
  return template
    .replaceAll("{label}", context.label)
    .replaceAll("{title}", context.title)
    .replaceAll("{url}", context.url)
    .replaceAll("{published_at}", context.publishedAt ?? "");
}

function getRedditPathSegment(value: string, prefixes: string[]) {
  if (!isValidUrl(value)) {
    return null;
  }

  const url = new URL(value);

  if (!isHostnameOrSubdomain(url.hostname, "reddit.com")) {
    return null;
  }

  const [kind, segment] = url.pathname.split("/").filter(Boolean);

  if (!kind || !prefixes.includes(kind.toLowerCase()) || !segment) {
    return null;
  }

  return segment;
}

function getTwitchPathSegment(value: string) {
  if (!isValidUrl(value)) {
    return null;
  }

  const url = new URL(value);

  if (!isHostnameOrSubdomain(url.hostname, "twitch.tv")) {
    return null;
  }

  return url.pathname.split("/").find(Boolean) ?? null;
}

function isHostnameOrSubdomain(hostname: string, domain: string) {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

function stripPathPrefix(value: string, prefixes: string[]) {
  const candidate = stripLeadingSlashes(value);
  const lowerCandidate = candidate.toLowerCase();

  for (const prefix of prefixes) {
    const marker = `${prefix.toLowerCase()}/`;
    if (lowerCandidate.startsWith(marker)) {
      return candidate.slice(marker.length);
    }
  }

  return candidate;
}

function stripLeadingSlashes(value: string) {
  let index = 0;
  while (value[index] === "/") {
    index += 1;
  }
  return value.slice(index);
}

function stripTrailingSlashes(value: string) {
  let end = value.length;
  while (end > 0 && value[end - 1] === "/") {
    end -= 1;
  }
  return value.slice(0, end);
}
