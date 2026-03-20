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

test("resolveSocialCommandInput requires feed URLs for rss-backed providers", () => {
  assert.throws(() =>
    resolveSocialCommandInput({
      provider: "instagram",
      source: "@demo",
      channelId: "123",
      mentionRoleId: null
    })
  );
});

test("matchesSocialCommandProvider maps rss-backed metadata correctly", () => {
  assert.equal(matchesSocialCommandProvider({ provider: "rss", metadata: { requestedProvider: "instagram" } }, "instagram"), true);
  assert.equal(matchesSocialCommandProvider({ provider: "reddit", metadata: {} }, "subreddit"), true);
});
