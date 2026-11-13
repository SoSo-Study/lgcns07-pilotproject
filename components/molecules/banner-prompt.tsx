"use client";

import {
  type ComponentProps,
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { GrassMosaic } from "@/components/molecules/grass-mosaic";
import { useCarousel } from "@/components/ui/carousel";
import {
  BANNER_COMMAND_MAX_LENGTH,
  type BannerCommandResult,
  runBannerCommand,
} from "@/lib/banner-command";
import { cn } from "@/lib/utils";

const AUTO_COMMAND = "next"; // 가만히 두면 저절로 쳐지는 명령어
const AUTO_EVERY_MS = 6000; // 몇 초마다
const TYPE_EVERY_MS = 140; // 한 글자 치는 속도

const toneClass: Record<BannerCommandResult["tone"], string> = {
  ok: "text-status-open",
  error: "text-destructive",
  info: "text-muted-foreground",
};

type BannerPromptProps = Omit<
  ComponentProps<"form">,
  "onSubmit" | "children"
> & {
  /** 슬라이드 이름 목록 — `ls`에 나오고 `open 이름`으로 열어요 */
  names: string[];
};

/**
 * 배너 명령어 줄 — `<Carousel>` 안에 둬요.
 * 명령어를 치고 Enter를 누르면 캐러셀을 움직여요 (next · prev · goto 2 · ls · open react.png · help).
 * 아무도 안 건드리면 `next`가 저절로 쳐지면서 넘어가요.
 *
 * @example
 * <BannerPrompt names={slides.map((slide) => slide.name)} className="hidden md:flex" />
 */
export function BannerPrompt({
  names,
  className,
  ...props
}: BannerPromptProps) {
  const { api } = useCarousel(); // 캐러셀 리모컨
  // 입력값은 폼(FormData)에서 읽어요. 이 ref는 자동 넘김이 "지금 입력 중인지" 볼 때만 써요
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<BannerCommandResult | null>(null); // 마지막 답
  const [ghost, setGhost] = useState(""); // 저절로 쳐지는 글자
  const [egg, setEgg] = useState(false); // 이스터에그가 나오는 중인지
  // 이스터에그가 끝나면 "잔디를 심었어요"도 같이 지워요 (그사이 다른 명령어를 쳤으면 그 답은 남겨요)
  const handleEggDone = useCallback(() => {
    setEgg(false);
    setResult((current) => (current?.egg ? null : current));
  }, []);
  // 이스터에그가 나오는 동안에는 답을 입력칸 자리에 보여 줘요
  const eggMessage = egg && result?.egg ? result.message : "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // 서버로 보내지 않아요 (새로고침 막기)
    const form = event.currentTarget;
    // 폼에 든 값은 폼에서 꺼내요 — <input name="command">
    const command = String(new FormData(form).get("command") ?? "");

    const next = runBannerCommand(command, names);
    if (next.move === "next") api?.scrollNext();
    else if (next.move === "prev") api?.scrollPrev();
    else if (typeof next.move === "number") api?.scrollTo(next.move);

    if (next.egg) setEgg(true); // 이미 나오는 중이면 그대로 (겹쳐 틀지 않아요)
    setResult(next);
    form.reset(); // 입력칸 비우기
  }

  // 자동 넘김: 일정 시간마다 "next"가 한 글자씩 쳐지고 다음 슬라이드로
  useEffect(() => {
    const input = inputRef.current;
    if (!api || !input) return;
    // "움직임 줄이기"를 켠 사람에게는 자동 넘김을 하지 않아요
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // 사용자가 배너를 한 번이라도 누르면 자동 넘김을 멈춰요
    const carousel = input.closest('[data-slot="carousel"]');
    let stopped = false;
    const stop = () => {
      stopped = true;
    };
    carousel?.addEventListener("pointerdown", stop);

    let typing: number | undefined;
    const every = window.setInterval(() => {
      const busy =
        stopped ||
        document.hidden || // 다른 탭을 보고 있음
        input.offsetParent === null || // 명령어 줄이 숨겨져 있음 (폰)
        input.value !== "" || // 뭔가 입력하는 중
        document.activeElement === input;
      if (busy) return;

      let typed = 0;
      typing = window.setInterval(() => {
        typed += 1;
        if (typed <= AUTO_COMMAND.length) {
          setGhost(AUTO_COMMAND.slice(0, typed));
          return;
        }
        window.clearInterval(typing);
        setGhost("");
        if (!stopped) api.scrollNext();
      }, TYPE_EVERY_MS);
    }, AUTO_EVERY_MS);

    return () => {
      window.clearInterval(every);
      window.clearInterval(typing);
      carousel?.removeEventListener("pointerdown", stop);
    };
  }, [api]);

  return (
    <>
      {/* 입력칸은 테두리가 없어서(outline-none), 포커스가 들어오면 명령어 줄 전체에 테두리를 그려요 (#89)
          배너가 overflow-hidden이라 바깥 테두리는 잘려요 → 안쪽(ring-inset)에 그려요 */}
      <form
        onSubmit={handleSubmit}
        className={cn(
          "items-center gap-2 bg-card py-2 pr-36 pl-4 font-mono text-sm focus-within:ring-2 focus-within:ring-inset focus-within:ring-ring",
          className,
        )}
        {...props}
      >
        <span aria-hidden className="font-bold text-status-open">
          $
        </span>
        <input
          ref={inputRef}
          type="text"
          name="command"
          aria-label="배너 명령어 (help를 입력해 보세요)"
          placeholder={eggMessage || ghost || "help"}
          maxLength={BANNER_COMMAND_MAX_LENGTH}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          onFocus={() => setGhost("")}
          className={cn(
            "w-40 shrink-0 bg-transparent caret-status-open outline-none",
            eggMessage
              ? "placeholder:font-sans placeholder:text-status-open"
              : ghost
                ? "placeholder:text-foreground"
                : "placeholder:text-subtle",
          )}
        />
        {/* 답은 글자로만 보여 줘요. 화면 읽기 프로그램도 읽어 줘요. 한글이 섞여서 글꼴은 본문 글꼴로 */}
        <output
          aria-live="polite"
          className={cn(
            "min-w-0 truncate font-sans text-xs",
            result && toneClass[result.tone],
            eggMessage && "sr-only", // 화면에는 입력칸 자리에 보이니까, 여기서는 읽어 주기만,
          )}
        >
          {result?.message}
        </output>
      </form>
      {/* 🥚 숨은 명령어를 쳤을 때만 만들고, 끝나면 지워요 */}
      {egg && <GrassMosaic onDone={handleEggDone} />}
    </>
  );
}
