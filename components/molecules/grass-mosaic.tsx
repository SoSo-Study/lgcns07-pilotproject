"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SHOW_MS = 2600; // 보여 주는 시간
const FADE_MS = 500; // 사라지는 시간

// 잔디밭 크기와 글자 — 5×7 점 글씨로 "SOSO"
const ROWS = 7;
const COLUMNS = 57;
const LETTER_START = 17; // 글자가 시작하는 칸 (가운데 오게)
const S = [".###.", "#...#", "#....", ".###.", "....#", "#...#", ".###."];
const O = [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."];
const WORD = [S, O, S, O];

type Cell = {
  /** 색 · 움직임을 정하는 종류 */
  kind: "letter" | "sparkle" | "grass" | "soil";
  /** 나타나는 순서 (ms) — 왼쪽 글자부터 차례로 */
  delay: number;
};

// ⚠ Tailwind는 완성된 클래스 이름만 찾아요 → 종류별로 통째로 적어 둬요
const cellClass: Record<Cell["kind"], string> = {
  letter:
    "bg-status-open duration-300 motion-safe:animate-in motion-safe:fill-mode-both motion-safe:fade-in motion-safe:zoom-in-50",
  sparkle:
    "bg-status-open duration-300 motion-safe:animate-in motion-safe:fill-mode-both motion-safe:fade-in motion-safe:zoom-in-50",
  grass: "bg-status-open/20",
  soil: "bg-muted/60",
};

// 칸 목록은 파일을 읽을 때 한 번만 만들어요 (그릴 때마다 다시 계산하지 않게)
const cells: Cell[] = Array.from({ length: ROWS * COLUMNS }, (_, i) => {
  const row = Math.floor(i / COLUMNS);
  const column = i % COLUMNS;
  const inWord = column - LETTER_START; // 글자 영역 안에서 몇 번째 칸인지
  const letter = WORD[Math.floor(inWord / 6)]; // 글자 5칸 + 띄어쓰기 1칸
  const isLetter = inWord >= 0 && letter?.[row][inWord % 6] === "#";

  if (isLetter) {
    return {
      kind: (column * 3 + row * 5) % 6 === 0 ? "sparkle" : "letter",
      delay: inWord * 30 + row * 12,
    };
  }
  // 글자 둘레는 비워서 글자가 잘 보이게, 바깥은 드문드문 잔디
  const nearWord = inWord >= -2 && inWord < 25;
  const hasGrass =
    !nearWord && (column * 7 + row * 13 + column * row * 3) % 11 > 7;
  return { kind: hasGrass ? "grass" : "soil", delay: 0 };
});

type GrassMosaicProps = {
  /** 다 보여 주고 사라진 뒤에 불려요 — 부모가 이 부품을 지우면 돼요 */
  onDone: () => void;
};

/**
 * 🥚 이스터에그 — 잔디 모자이크가 `SOSO`를 그리고 반짝인 뒤 사라져요.
 * 배너의 슬라이드 자리를 덮어요 (`relative`인 배너 안에 둬요).
 *
 * 가볍게 만든 방법
 * - 칸 수는 고정(57×7), 움직이는 건 투명도 · 크기뿐 (CSS 애니메이션, JS 타이머는 2개)
 * - 빛 번짐은 칸마다 넣지 않고 뒤에 흐린 판 한 장
 * - "움직임 줄이기" 설정이면 움직임 없이 글자만 (`motion-safe:`)
 *
 * @example
 * {egg && <GrassMosaic onDone={() => setEgg(false)} />}
 */
export function GrassMosaic({ onDone }: GrassMosaicProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leave = window.setTimeout(() => setLeaving(true), SHOW_MS);
    const done = window.setTimeout(onDone, SHOW_MS + FADE_MS);
    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
    };
  }, [onDone]);

  return (
    // top-8 · bottom-9 = 터미널 제목 줄 · 명령어 줄 높이 (슬라이드 자리만 덮어요)
    <div
      aria-hidden
      data-slot="grass-mosaic"
      className={cn(
        "absolute inset-x-0 top-8 bottom-9 grid place-items-center overflow-hidden bg-inset px-4 duration-500",
        leaving
          ? "motion-safe:animate-out motion-safe:fill-mode-forwards motion-safe:fade-out"
          : "motion-safe:animate-in motion-safe:fade-in",
      )}
    >
      {/* 빛 번짐: 글자 뒤에 흐린 초록 판 한 장 */}
      <div className="absolute inset-y-6 left-1/4 w-1/2 rounded-full bg-status-open/20 blur-3xl" />
      <div className="relative grid w-full max-w-5xl grid-cols-57 gap-0.5">
        {cells.map((cell, index) => (
          <span
            key={index}
            className={cn("aspect-square rounded-xs", cellClass[cell.kind])}
            style={
              cell.delay ? { animationDelay: `${cell.delay}ms` } : undefined
            }
          >
            {/* 반짝이는 칸: 나타난 뒤 밝은 조각이 깜빡여요 */}
            {cell.kind === "sparkle" && (
              <span className="block size-full rounded-xs bg-foreground/70 motion-safe:animate-pulse" />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
