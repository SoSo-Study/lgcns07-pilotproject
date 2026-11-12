// 배너 명령어 줄(#59)의 "번역기" — 입력한 글자를 정해 둔 명령어와 비교만 해요.
// 🔒 입력을 실행하지 않아요(eval 없음). 목록에 없는 말은 전부 "command not found"예요.

export const BANNER_COMMAND_MAX_LENGTH = 40;

export type BannerCommandResult = {
  /** 명령어 줄 옆에 보여 줄 답 (없으면 빈 글자) */
  message: string;
  /** 답의 색: ok 초록 · error 빨강 · info 흐린 글씨 */
  tone: "ok" | "error" | "info";
  /** 슬라이드를 옮겨야 하면: 다음 · 이전 · 몇 번(0부터) */
  move?: "next" | "prev" | number;
  /** 이스터에그(잔디 모자이크)를 틀어야 하면 true */
  egg?: boolean;
};

/**
 * 입력 한 줄 → 무엇을 할지
 *
 * @param input 사용자가 친 글자 (예: "goto 2")
 * @param names 슬라이드 이름 목록 (예: ["react.png", "spring.png", "algo.png"])
 *
 * @example
 * runBannerCommand("next", names)           // { message: "", tone: "ok", move: "next" }
 * runBannerCommand("open algo.png", names)  // { message: "algo.png", tone: "ok", move: 2 }
 * runBannerCommand("hello", names)          // { message: "command not found: hello", tone: "error" }
 * runBannerCommand("git commit", names)     // { message: "잔디를 심었어요 🌱", tone: "ok", egg: true }
 */
export function runBannerCommand(
  input: string,
  names: string[],
): BannerCommandResult {
  // 대소문자 · 앞뒤 공백 · 여러 칸 띄어쓰기는 봐줘요
  const words = input
    .slice(0, BANNER_COMMAND_MAX_LENGTH)
    .trim()
    .toLowerCase()
    .split(/\s+/);
  const [command, argument = ""] = words;

  switch (command) {
    case "":
    case "clear":
      return { message: "", tone: "info" };

    case "next":
      return { message: "", tone: "ok", move: "next" };

    case "prev":
      return { message: "", tone: "ok", move: "prev" };

    case "goto": {
      const page = Number(argument);
      if (!Number.isInteger(page) || page < 1 || page > names.length) {
        return {
          message: `goto: 1~${names.length} 사이 번호를 써 주세요`,
          tone: "error",
        };
      }
      return { message: "", tone: "ok", move: page - 1 };
    }

    case "ls":
      return { message: names.join("  "), tone: "info" };

    case "open": {
      // 목록에 있는 이름만 통해요. 인터넷 주소 · 다른 경로는 받지 않아요
      const index = names.indexOf(argument);
      if (index === -1) {
        return {
          message: "open: 그런 파일이 없어요 (ls로 확인)",
          tone: "error",
        };
      }
      return { message: names[index], tone: "ok", move: index };
    }

    case "help":
      return {
        message: "next · prev · goto 2 · ls · open react.png · 숨은 명령어 1개",
        tone: "info",
      };

    // 🥚 이스터에그: 커밋 = 잔디 심기
    case "git":
      if (argument === "commit") {
        return { message: "잔디를 심었어요 🌱", tone: "ok", egg: true };
      }
      return { message: "git: 여기서는 commit만 돼요", tone: "info" };

    case "sudo":
    case "rm":
      return { message: "permission denied: nice try 😎", tone: "error" };

    default:
      return { message: `command not found: ${command}`, tone: "error" };
  }
}
