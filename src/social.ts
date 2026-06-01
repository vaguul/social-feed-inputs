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
  const candidate = (urlCandidate ?? trimmed).replace(/^r\//i, "").replace(/^\/r\//i, "").replace(/\/+$/, "");
  return REDDIT_SUBREDDIT_PATTERN.test(candidate) ? candidate : null;
}

export function normalizeRedditUser(value: string) {
  const trimmed = value.trim();
  const urlCandidate = getRedditPathSegment(trimmed, ["u", "user"]);
  const candidate = (urlCandidate ?? trimmed)
    .replace(/^u\//i, "")
    .replace(/^\/u\//i, "")
    .replace(/^user\//i, "")
    .replace(/^\/user\//i, "")
    .replace(/\/+$/, "");
  return REDDIT_USER_PATTERN.test(candidate) ? candidate : null;
}

export function buildRedditSubredditFeedUrl(subreddit: string) {
  return `https://www.reddit.com/r/${subreddit}/new.json?limit=10&raw_json=1`;
}

export function buildRedditUserFeedUrl(userName: string) {
  return `https://www.reddit.com/user/${userName}/submitted.json?limit=10&raw_json=1`;
}

export function normalizeTwitchLogin(value: string) {
  const candidate = value
    .trim()
    .replace(/^@/, "")
    .replace(/^https?:\/\/(www\.)?twitch\.tv\//i, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .split(/[/?#]/)[0];

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

  if (!url.hostname.includes("youtube.com")) {
    return null;
  }

  return normalizeYouTubeChannelId(url.searchParams.get("channel_id") ?? "");
}

export function decodeBasicHtmlEntities(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'");
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

  if (url.hostname !== "reddit.com" && !url.hostname.endsWith(".reddit.com")) {
    return null;
  }

  const [kind, segment] = url.pathname.split("/").filter(Boolean);

  if (!kind || !prefixes.includes(kind.toLowerCase()) || !segment) {
    return null;
  }

  return segment;
}
