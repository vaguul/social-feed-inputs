import assert from "node:assert/strict";
import test from "node:test";
import { matchesSocialCommandProvider, resolveSocialCommandInput } from "../src/resolve-social-input.ts";

test("resolveSocialCommandInput creates native YouTube alerts", () => {
  const resolved = resolveSocialCommandInput({
    provider: "youtube",
    source: "UC_x5XG1OV2P6uZZ5FSM9Ttw",
    channelId: "123",
    mentionRoleId: null
  });

  assert.equal(resolved.alert.provider, "youtube");
  assert.equal(resolved.alert.feedUrl.includes("youtube.com/feeds/videos.xml"), true);
});

test("resolveSocialCommandInput handles normalized provider URL edge cases", () => {
  const youtube = resolveSocialCommandInput({
    provider: "youtube",
    source: "https://www.youtube.com/feeds/videos.xml?utm_source=dashboard&channel_id=UC_x5XG1OV2P6uZZ5FSM9Ttw",
    channelId: "123",
    mentionRoleId: null
  });

  const reddit = resolveSocialCommandInput({
    provider: "subreddit",
    source: "https://www.reddit.com/r/typescript/?utm_source=dashboard",
    channelId: "123",
    mentionRoleId: null
  });

  const twitch = resolveSocialCommandInput({
    provider: "twitch",
    source: "https://www.twitch.tv/Shroud/videos?filter=archives",
    channelId: "123",
    mentionRoleId: null
  });

  const rss = resolveSocialCommandInput({
    provider: "instagram",
    source: "@demo",
    feedUrl: "https://example.com/feeds/announcements.xml?tag=dev#latest",
    channelId: "123",
    mentionRoleId: null
  });

  assert.equal(youtube.alert.feedUrl, "https://www.youtube.com/feeds/videos.xml?channel_id=UC_x5XG1OV2P6uZZ5FSM9Ttw");
  assert.equal(reddit.alert.feedUrl, "https://www.reddit.com/r/typescript/new.json?limit=10&raw_json=1");
  assert.equal(twitch.alert.feedUrl, "https://api.twitch.tv/helix/streams?user_login=shroud");
  assert.equal(rss.alert.feedUrl, "https://example.com/feeds/announcements.xml?tag=dev#latest");
});

test("resolveSocialCommandInput requires feed URLs for rss-backed providers", () => {
  assert.throws(
    () =>
      resolveSocialCommandInput({
        provider: "instagram",
        source: "@demo",
        channelId: "123",
        mentionRoleId: null
      }),
    /A valid feed URL is required for Instagram alerts/
  );
});

test("resolveSocialCommandInput rejects unsupported provider-specific URLs clearly", () => {
  assert.throws(
    () =>
      resolveSocialCommandInput({
        provider: "subreddit",
        source: "https://example.com/r/typescript",
        channelId: "123",
        mentionRoleId: null
      }),
    /Use a subreddit like r\/discordapp/
  );
});

test("matchesSocialCommandProvider maps rss-backed metadata correctly", () => {
  assert.equal(matchesSocialCommandProvider({ provider: "rss", metadata: { requestedProvider: "instagram" } }, "instagram"), true);
  assert.equal(matchesSocialCommandProvider({ provider: "reddit", metadata: {} }, "subreddit"), true);
});
