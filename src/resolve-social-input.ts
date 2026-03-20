import {
  buildDefaultSocialAlertTemplate,
  buildRedditSubredditFeedUrl,
  buildTwitchStreamsUrl,
  buildYouTubeFeedUrl,
  extractYouTubeChannelIdFromFeedUrl,
  isValidUrl,
  normalizeRedditSubreddit,
  normalizeTwitchLogin,
  normalizeYouTubeChannelId
} from "./social.js";

export interface SocialAlertInput {
  provider: "rss" | "youtube" | "reddit" | "twitch";
  label: string;
  feedUrl: string;
  sourceInput: string | null;
  channelId: string;
  mentionRoleId: string | null;
  messageTemplate: string;
  enabled: boolean;
}

export type SocialCommandProvider =
  | "youtube"
  | "twitch"
  | "subreddit"
  | "instagram"
  | "twitter"
  | "tiktok"
  | "soundcloud"
  | "pinterest"
  | "kick";

export function getStoredSocialProvider(provider: SocialCommandProvider) {
  if (provider === "youtube" || provider === "twitch") {
    return provider;
  }

  if (provider === "subreddit") {
    return "reddit" as const;
  }

  return "rss" as const;
}

export function getSocialProviderLabel(provider: SocialCommandProvider) {
  switch (provider) {
    case "subreddit":
      return "Subreddit";
    case "soundcloud":
      return "SoundCloud";
    default:
      return provider.charAt(0).toUpperCase() + provider.slice(1);
  }
}

export function matchesSocialCommandProvider(
  entry: {
    provider: string;
    metadata?: unknown;
  },
  provider: SocialCommandProvider
) {
  const metadata = asRecord(entry.metadata);
  const requestedProvider = typeof metadata.requestedProvider === "string" ? metadata.requestedProvider : null;

  if (provider === "subreddit") {
    return entry.provider === "reddit";
  }

  if (provider === "youtube" || provider === "twitch") {
    return entry.provider === provider;
  }

  return entry.provider === "rss" && requestedProvider === provider;
}

export function resolveSocialCommandInput(input: {
  provider: SocialCommandProvider;
  source: string;
  feedUrl?: string | null;
  channelId: string;
  mentionRoleId: string | null;
  messageTemplate?: string | null;
  label?: string | null;
}): {
  alert: SocialAlertInput;
  metadata: Record<string, unknown>;
} {
  const source = input.source.trim();
  const base: SocialAlertInput = {
    provider: getStoredSocialProvider(input.provider),
    label: input.label?.trim() || getSocialProviderLabel(input.provider),
    feedUrl: "",
    sourceInput: source || null,
    channelId: input.channelId,
    mentionRoleId: input.mentionRoleId,
    messageTemplate: input.messageTemplate?.trim() || buildDefaultSocialAlertTemplate(),
    enabled: true
  };

  if (input.provider === "youtube") {
    const channelId = normalizeYouTubeChannelId(source) ?? extractYouTubeChannelIdFromFeedUrl(source);

    if (!channelId) {
      throw new Error("Use a YouTube channel ID or feed URL.");
    }

    return {
      alert: {
        ...base,
        provider: "youtube",
        label: input.label?.trim() || "YouTube",
        feedUrl: buildYouTubeFeedUrl(channelId),
        sourceInput: source
      },
      metadata: {
        requestedProvider: "youtube",
        channelId
      }
    };
  }

  if (input.provider === "twitch") {
    const login = normalizeTwitchLogin(source);

    if (!login) {
      throw new Error("Use a Twitch login or channel URL.");
    }

    return {
      alert: {
        ...base,
        provider: "twitch",
        label: input.label?.trim() || login,
        feedUrl: buildTwitchStreamsUrl(login),
        sourceInput: source
      },
      metadata: {
        requestedProvider: "twitch",
        login
      }
    };
  }

  if (input.provider === "subreddit") {
    const subreddit = normalizeRedditSubreddit(source);

    if (!subreddit) {
      throw new Error("Use a subreddit like r/discordapp.");
    }

    return {
      alert: {
        ...base,
        provider: "reddit",
        label: input.label?.trim() || `r/${subreddit}`,
        feedUrl: buildRedditSubredditFeedUrl(subreddit),
        sourceInput: source
      },
      metadata: {
        requestedProvider: "subreddit",
        subreddit
      }
    };
  }

  const feedUrl = input.feedUrl?.trim() ?? "";

  if (!isValidUrl(feedUrl)) {
    throw new Error(`A valid feed URL is required for ${getSocialProviderLabel(input.provider)} alerts.`);
  }

  return {
    alert: {
      ...base,
      provider: "rss",
      label: input.label?.trim() || getSocialProviderLabel(input.provider),
      feedUrl,
      sourceInput: source || feedUrl
    },
    metadata: {
      requestedProvider: input.provider
    }
  };
}

function asRecord(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}
