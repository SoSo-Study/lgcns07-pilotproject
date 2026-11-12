import "server-only";
import { env } from "@/lib/env";
import type { ApiResponse } from "@/types/api-response";

// 강사님 API를 부르는 단 하나의 함수 (🔒 #45 A3 · #46 1-2)
// 흐름: 화면 → actions → service → 여기 → 강사님 API
// - "server-only": 이 파일을 클라이언트 컴포넌트에서 import하면 빌드가 막혀요 → 토큰 · 서버 주소가 브라우저로 못 가요
// - 로그인이 필요한 요청은 token을 넘기면 Authorization: Bearer 헤더로 붙여요
// - cache: "no-store": 사람마다 응답이 다를 수 있어서 저장하지 않아요 (#45 D1)
// - 토큰 · 응답을 console.log 하지 않아요 (#45 B9)

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: Method;
  body?: unknown;
  token?: string | null;
  query?: Record<string, string | number | undefined>;
};

export type ApiResult<T> = ApiResponse<T | null> & { status: number };

const NETWORK_ERROR = "서버와 연결하지 못했어요. 잠시 후 다시 시도해 주세요.";
const BAD_RESPONSE = "서버 응답을 읽지 못했어요. 잠시 후 다시 시도해 주세요.";

export async function apiRequest<T>(
  path: string,
  { method = "GET", body, token, query }: RequestOptions = {},
): Promise<ApiResult<T>> {
  const url = new URL(env.apiUrl + path);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000), // 10초 넘게 답이 없으면 포기
    });
  } catch {
    return {
      success: false,
      message: NETWORK_ERROR,
      code: "NETWORK_ERROR",
      data: null,
      status: 0,
    };
  }

  const json: unknown = await response.json().catch(() => null);
  if (isApiResponse(json)) {
    return {
      success: json.success,
      message: json.message ?? "",
      code: json.code,
      data: (json.data ?? null) as T | null,
      status: response.status,
    };
  }

  return {
    success: false,
    message: BAD_RESPONSE,
    code: "BAD_RESPONSE",
    data: null,
    status: response.status,
  };
}

function isApiResponse(value: unknown): value is {
  success: boolean;
  message?: string;
  code?: string;
  data?: unknown;
} {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { success?: unknown }).success === "boolean"
  );
}
