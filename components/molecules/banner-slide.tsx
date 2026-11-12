import Image from "next/image";
import Link from "next/link";
import { CategoryLabel } from "@/components/atoms/category-label";
import { buttonVariants } from "@/components/ui/button";
import type { BannerSlide as BannerSlideData } from "@/config/banner-slides";

type BannerSlideProps = {
  slide: BannerSlideData;
};

/**
 * 배너 슬라이드 한 장 — 분야 · 제목 · 설명 · "보러 가기" + 이미지 칸
 * 넓은 화면: 글 왼쪽, 큰 이미지 오른쪽 / 좁은 화면: 글 옆 작은 이미지, 버튼은 아래 줄
 *
 * @example
 * <BannerSlide slide={bannerSlides[0]} />
 */
export function BannerSlide({ slide }: BannerSlideProps) {
  // 2칸 격자: 왼쪽 칸에 글(1줄) · 버튼(2줄), 오른쪽 칸에 이미지
  // 좁은 화면은 작은 이미지가 글 옆에만, 넓은 화면(lg)은 큰 이미지가 두 줄을 다 차지해요
  return (
    <div className="grid h-full grid-cols-[minmax(0,1fr)_auto] items-start gap-3 p-3.5 md:px-14 md:py-4 lg:items-center lg:gap-x-6 lg:gap-y-2.5">
      <div className="flex min-w-0 flex-col gap-1.5 lg:self-end">
        <CategoryLabel category={slide.category} />
        <p className="line-clamp-2 text-base font-bold lg:line-clamp-1 lg:text-xl">
          {slide.title}
        </p>
        <p className="line-clamp-2 text-sm text-muted-foreground lg:line-clamp-1">
          {slide.description}
        </p>
      </div>
      <SlideImage slide={slide} />
      <Link
        href={slide.href}
        className={buttonVariants({
          className: "col-start-1 row-start-2 w-fit lg:self-start",
        })}
      >
        보러 가기
      </Link>
    </div>
  );
}

// 이미지 칸 — 이미지가 있으면 next/image, 없으면 코드로 그린 카드
function SlideImage({ slide }: BannerSlideProps) {
  return (
    <div className="relative col-start-2 row-start-1 grid size-21 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-linear-to-r from-link-subtle to-status-open-subtle lg:row-span-2 lg:h-32 lg:w-80">
      {slide.image ? (
        <Image
          src={slide.image.src}
          alt={slide.image.alt}
          fill
          sizes="(min-width: 1024px) 320px, 84px"
          className="object-cover"
        />
      ) : (
        <div aria-hidden className="text-center font-mono">
          <p className="text-xs font-bold text-link lg:text-2xl">{slide.art}</p>
          <p className="mt-1 hidden text-xs text-muted-foreground lg:block">
            {slide.name}
          </p>
        </div>
      )}
    </div>
  );
}
