import type { ComponentProps } from "react";
import { BannerPrompt } from "@/components/molecules/banner-prompt";
import { BannerSlide } from "@/components/molecules/banner-slide";
import { CarouselPager } from "@/components/molecules/carousel-pager";
import { CarouselSlide } from "@/components/molecules/carousel-slide";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { BannerSlide as BannerSlideData } from "@/config/banner-slides";
import { cn } from "@/lib/utils";

type TerminalBannerProps = Omit<
  ComponentProps<typeof Carousel>,
  "children" | "opts" | "orientation"
> & {
  slides: BannerSlideData[];
};

/**
 * ① 둘러보기 맨 위 터미널 모양 배너 (#59, 디자인 #55 시안 D)
 * 수업에서 배운 캐러셀(shadcn Carousel)을 터미널 창 안에 넣었어요.
 *
 * 이 파일은 서버 컴포넌트예요. 브라우저에서 돌아야 하는 부분만 작은 부품으로 나눴어요:
 * - `CarouselSlide`: 안 보이는 슬라이드 잠그기
 * - `CarouselPager`: 지금 번호 표시 · 누르면 이동
 * - `BannerPrompt`: 명령어 줄 (PC)
 *
 * @example
 * <TerminalBanner slides={bannerSlides} className="mb-4" />
 */
export function TerminalBanner({
  slides,
  className,
  ...props
}: TerminalBannerProps) {
  return (
    <Carousel
      opts={{ loop: true }}
      aria-label="추천 스터디 배너"
      className={cn(
        "overflow-hidden rounded-md border border-border bg-inset",
        className,
      )}
      {...props}
    >
      {/* 터미널 창 제목 줄 (꾸밈) */}
      <div
        aria-hidden
        className="flex items-center gap-2 bg-card px-3 py-2 font-mono text-xs text-muted-foreground"
      >
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-destructive" />
          <span className="size-2.5 rounded-full bg-attention" />
          <span className="size-2.5 rounded-full bg-status-open" />
        </span>
        soso.study — zsh
      </div>

      <div className="relative">
        <CarouselContent className="ml-0">
          {slides.map((slide, index) => (
            <CarouselSlide
              key={slide.name}
              index={index}
              aria-label={`${slides.length}장 중 ${index + 1}번`}
              className="pl-0"
            >
              <BannerSlide slide={slide} />
            </CarouselSlide>
          ))}
        </CarouselContent>
        {/* 이전 · 다음 버튼은 PC에서만. 폰은 손가락으로 밀어요 */}
        <CarouselPrevious
          aria-label="이전 슬라이드"
          className="left-3 hidden enabled:cursor-pointer md:inline-flex"
        />
        <CarouselNext
          aria-label="다음 슬라이드"
          className="right-3 hidden enabled:cursor-pointer md:inline-flex"
        />
      </div>

      {/* PC 아래 줄 — 명령어 줄. 폰에서는 숨겨요 */}
      <BannerPrompt
        names={slides.map((slide) => slide.name)}
        className="hidden md:flex"
      />

      {/* 페이저는 하나만 그리고 자리만 옮겨요. 폰: "보러 가기"와 같은 줄 / PC: 아래 줄 오른쪽 */}
      <CarouselPager
        count={slides.length}
        className="absolute right-3.5 bottom-3.5 md:right-4 md:bottom-2"
      />
    </Carousel>
  );
}
