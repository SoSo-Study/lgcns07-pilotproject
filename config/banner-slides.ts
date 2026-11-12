import { studiesHref } from "@/lib/studies-href";
import type { StudyCategory } from "@/types/study";

// ① 둘러보기 맨 위 터미널 배너에 나오는 슬라이드 (#59)
// 슬라이드를 바꾸거나 더하려면 이 파일만 고치면 돼요.
export type BannerSlide = {
  /** 명령어 줄에서 쓰는 이름 — `ls`에 나오고 `open react.png`로 열어요 */
  name: string;
  category: StudyCategory;
  title: string;
  description: string;
  /** "보러 가기"가 가는 주소 */
  href: string;
  /** 이미지가 없을 때 그림 대신 보여 줄 코드 글자 (예: `<React />`) */
  art: string;
  /** 이미지 (없어도 돼요). `public/banner/`에 파일을 넣고 주소를 적어요 */
  image?: { src: string; alt: string };
};

export const bannerSlides: BannerSlide[] = [
  {
    name: "react.png",
    category: "FRONTEND",
    title: "React · Next.js, 같이 파 볼 분?",
    description: "프론트엔드 스터디만 모아서 봐요.",
    href: studiesHref({ category: "FRONTEND" }),
    art: "<React />",
  },
  {
    name: "spring.png",
    category: "BACKEND",
    title: "Spring · JPA, 처음이어도 괜찮아요",
    description: "백엔드 스터디만 모아서 봐요.",
    href: studiesHref({ category: "BACKEND" }),
    art: "@Spring",
  },
  {
    name: "algo.png",
    category: "ALGORITHM",
    title: "코딩 테스트, 혼자보다 같이",
    description: "알고리즘 스터디만 모아서 봐요.",
    href: studiesHref({ category: "ALGORITHM" }),
    art: "O(log n)",
  },
];
