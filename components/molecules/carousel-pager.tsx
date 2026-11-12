"use client";

import type { ComponentProps } from "react";
import { CommitPager } from "@/components/molecules/commit-pager";
import { useCarousel } from "@/components/ui/carousel";
import { useCarouselSelected } from "@/hooks/use-carousel-selected";

type CarouselPagerProps = Omit<
  ComponentProps<typeof CommitPager>,
  "selected" | "onSelect"
>;

/**
 * 캐러셀에 연결된 페이저 — `<Carousel>` 안에 두기만 하면 돼요.
 * 모양은 `CommitPager`가, "지금 번호 알기 · 누르면 이동"은 여기서 맡아요.
 *
 * @example
 * <Carousel>
 *   …
 *   <CarouselPager count={slides.length} />
 * </Carousel>
 */
export function CarouselPager(props: CarouselPagerProps) {
  const { api } = useCarousel();
  const selected = useCarouselSelected();

  return (
    <CommitPager
      selected={selected}
      onSelect={(index) => api?.scrollTo(index)}
      {...props}
    />
  );
}
