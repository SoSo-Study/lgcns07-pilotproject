import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // 카톡 미리보기: 카카오 봇(kakaotalk-scrap)도 제목을 기다려 주게
  // ⚠ 이 설정은 Next 기본 봇 목록을 "덮어써요" → 기본 목록을 그대로 두고 맨 끝에 카카오만 더함
  htmlLimitedBots:
    /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|kakaotalk-scrap/i,
  // 첫 주소(/)로 오면 스터디 목록으로
  async redirects() {
    return [{ source: "/", destination: "/studies", permanent: false }];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
