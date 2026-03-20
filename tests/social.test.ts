import test from "node:test";
import assert from "node:assert/strict";
import {
  buildRedditSubredditFeedUrl,
  buildRedditUserFeedUrl,
  buildTwitchStreamsUrl,
  normalizeRedditSubreddit,
  normalizeRedditUser,
  normalizeTwitchLogin
} from "../src/social.ts";

test("normalizeRedditSubreddit accepts r/ prefix and trims slashes", () => {
  assert.equal(normalizeRedditSubreddit("r/discordapp/"), "discordapp");
  assert.equal(normalizeRedditSubreddit("/r/typescript"), "typescript");
});

test("normalizeRedditUser accepts u/ and user/ prefixes", () => {
  assert.equal(normalizeRedditUser("u/spez"), "spez");
  assert.equal(normalizeRedditUser("/user/example_user"), "example_user");
});

test("reddit feed builders generate JSON listing URLs", () => {
  assert.equal(buildRedditSubredditFeedUrl("discordapp"), "https://www.reddit.com/r/discordapp/new.json?limit=10&raw_json=1");
  assert.equal(buildRedditUserFeedUrl("spez"), "https://www.reddit.com/user/spez/submitted.json?limit=10&raw_json=1");
});

test("normalizeTwitchLogin accepts plain login and twitch URLs", () => {
  assert.equal(normalizeTwitchLogin("shroud"), "shroud");
  assert.equal(normalizeTwitchLogin("https://www.twitch.tv/Shroud"), "shroud");
});

test("buildTwitchStreamsUrl targets the Helix streams endpoint", () => {
  assert.equal(buildTwitchStreamsUrl("shroud"), "https://api.twitch.tv/helix/streams?user_login=shroud");
});
