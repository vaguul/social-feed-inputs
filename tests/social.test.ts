import test from "node:test";
import assert from "node:assert/strict";
import {
  buildRedditSubredditFeedUrl,
  buildRedditUserFeedUrl,
  buildTwitchStreamsUrl,
  decodeBasicHtmlEntities,
  extractYouTubeChannelIdFromFeedUrl,
  normalizeRedditSubreddit,
  normalizeRedditUser,
  normalizeTwitchLogin
} from "../src/social.ts";

test("normalizeRedditSubreddit accepts r/ prefix and trims slashes", () => {
  assert.equal(normalizeRedditSubreddit("r/discordapp/"), "discordapp");
  assert.equal(normalizeRedditSubreddit("/r/typescript"), "typescript");
  assert.equal(normalizeRedditSubreddit("https://old.reddit.com/r/selfhosted/?sort=new"), "selfhosted");
  assert.equal(normalizeRedditSubreddit("https://example.com/r/selfhosted"), null);
});

test("normalizeRedditUser accepts u/ and user/ prefixes", () => {
  assert.equal(normalizeRedditUser("u/spez"), "spez");
  assert.equal(normalizeRedditUser("/user/example_user"), "example_user");
  assert.equal(normalizeRedditUser("https://www.reddit.com/user/example_user/?sort=new"), "example_user");
  assert.equal(normalizeRedditUser("https://example.com/user/example_user"), null);
});

test("reddit feed builders generate JSON listing URLs", () => {
  assert.equal(buildRedditSubredditFeedUrl("discordapp"), "https://www.reddit.com/r/discordapp/new.json?limit=10&raw_json=1");
  assert.equal(buildRedditUserFeedUrl("spez"), "https://www.reddit.com/user/spez/submitted.json?limit=10&raw_json=1");
});

test("normalizeTwitchLogin accepts plain login and twitch URLs", () => {
  assert.equal(normalizeTwitchLogin("shroud"), "shroud");
  assert.equal(normalizeTwitchLogin("https://www.twitch.tv/Shroud"), "shroud");
  assert.equal(normalizeTwitchLogin("https://twitch.tv.example.com/Shroud"), null);
});

test("YouTube feed parsing rejects lookalike hostnames", () => {
  assert.equal(
    extractYouTubeChannelIdFromFeedUrl(
      "https://youtube.com.example.org/feeds/videos.xml?channel_id=UC_x5XG1OV2P6uZZ5FSM9Ttw"
    ),
    null
  );
});

test("HTML entity decoding performs exactly one pass", () => {
  assert.equal(decodeBasicHtmlEntities("&lt;title&gt; &amp; &#39;ok&#39;"), "<title> & 'ok'");
  assert.equal(decodeBasicHtmlEntities("&amp;lt;"), "&lt;");
});

test("buildTwitchStreamsUrl targets the Helix streams endpoint", () => {
  assert.equal(buildTwitchStreamsUrl("shroud"), "https://api.twitch.tv/helix/streams?user_login=shroud");
});
