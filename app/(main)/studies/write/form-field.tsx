// app/(main)/studies/write/form-field.tsx — ③ 모집글 등록 · 수정 폼 (화면: sooahp님 #7)
// API 연결(#46): 값은 코드 · 숫자로 보내고(#14 팀 결정), 서버 액션이 같은 규칙으로 다시 검사해요(#45 A4)
"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  saveStudyAction,
  type StudyWriteResult,
} from "@/actions/study-write-actions";
import { routes } from "@/config/routes";
import { studyCategories } from "@/config/study-category";
import { studyModeLabels } from "@/config/study-mode";
import { earliestDeadline } from "@/schema/study-write-schema";
import type { Study, StudyMode } from "@/types/study";

/** 수정할 때 폼을 채울 값 (등록이면 없음) */
export type StudyFormInitial = Pick<
  Study,
  | "id"
  | "title"
  | "category"
  | "techTags"
  | "maxMembers"
  | "deadline"
  | "mode"
  | "content"
>;

const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 20;
const memberOptions = [2, 3, 4, 5, 6, 7, 8, 9, 10];

type FieldErrors = Extract<StudyWriteResult, { ok: false }>["errors"];

export default function StudyWriteForm({
  initial,
}: {
  initial?: StudyFormInitial;
}) {
  const router = useRouter();
  // 상태는 "입력할 때마다 화면이 바뀌는 것"만 — 칩 목록 · 날짜 칸 안내 글 · 글자 수 · 태그 안내 · 저장 결과
  // (진행 방식은 라디오, 태그 입력칸은 비제어라 상태가 없어요. 화면을 떠나면 page의 ResetOnLeave가 통째로 비워요)
  const [tags, setTags] = useState<string[]>(initial?.techTags ?? []);
  const [deadline, setDeadline] = useState(initial?.deadline ?? "");
  const [dateType, setDateType] = useState<"text" | "date">(
    initial ? "date" : "text",
  );
  const [description, setDescription] = useState(initial?.content ?? "");
  // 칸 문구(errors)와 저장 실패 문구(formError)는 늘 같이 바뀌어서 결과 하나로 들고 있어요
  const [result, setResult] = useState<StudyWriteResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [tagNotice, setTagNotice] = useState<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault(); // Enter로 폼이 제출되는 것 막기
    if (e.nativeEvent.isComposing) return; // 한글 조합 중 Enter는 무시 (중복 입력 방지)

    // 입력칸 글자는 상태로 들고 있지 않고 Enter 때 칸에서 바로 읽어요
    const input = e.currentTarget;
    const trimmed = input.value.trim();
    if (!trimmed) return;

    // 쉼표는 태그를 이어 붙이는 기호라 빼요. 5개까지만 (서버 규칙과 같게)
    if (trimmed.includes(",")) {
      setTagNotice("쉼표(,)는 태그에 넣을 수 없어요.");
      return;
    }
    if (tags.includes(trimmed)) {
      setTagNotice("이미 추가한 태그예요.");
      return;
    }
    if (tags.length >= MAX_TAGS) {
      setTagNotice(`태그는 최대 ${MAX_TAGS}개까지 추가할 수 있어요.`);
      return;
    }

    setTags([...tags, trimmed]);
    input.value = "";
    setTagNotice(null);
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
    setTagNotice(null);
  };

  // ⚠ <form action> 대신 onSubmit을 써요 — form action은 끝나면 React가 칸을 비워서,
  //   서버 검사에 걸렸을 때 쓴 제목 · 분야 · 인원이 날아가요
  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // 서버 액션: 검사 → 강사님 API 저장. 기다리는 동안 버튼이 잠겨요(연타 방지)
    startTransition(async () => {
      const saved = await saveStudyAction(formData);
      setResult(saved);
      if (!saved.ok) return;
      // 저장한 글의 상세로 (replace: 뒤로 가기로 폼에 다시 오지 않게)
      // 폼 비우기는 따로 안 해요 — 화면을 떠나면 page의 ResetOnLeave가 처음 상태로 되돌려요
      router.replace(routes.study(saved.studyId));
      router.refresh();
    });
  };

  const errors: FieldErrors = result && !result.ok ? (result.errors ?? {}) : {};
  const formError = result && !result.ok ? result.formError : undefined;
  const errorList = [
    errors?.title,
    errors?.category,
    errors?.maxMembers,
    errors?.deadline,
    errors?.techTags,
    errors?.mode,
    errors?.content,
  ].filter(Boolean);

  return (
    <form
      onSubmit={onSubmitHandler}
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      <input type="hidden" name="techTags" value={tags.join(",")} />
      {initial && <input type="hidden" name="studyId" value={initial.id} />}

      {/* 스터디 제목 */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
          }}
        >
          스터디 제목{" "}
          <span style={{ color: "var(--color-danger, #ef4444)" }}>*</span>
        </label>
        <input
          name="title"
          type="text"
          required
          maxLength={100}
          defaultValue={initial?.title}
          className="study-input"
          placeholder="예) React 심화 스터디 — 서버 컴포넌트까지"
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "var(--bg-input, #1e2230)",
            border: "1px solid var(--border-color, #2d3142)",
            borderRadius: "6px",
            color: "#fff",
            outline: "none",
          }}
        />
      </div>

      {/* 분야, 모집인원, 마감일 그리드 레이아웃 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1rem",
        }}
      >
        {/* 분야 */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            분야{" "}
            <span style={{ color: "var(--color-danger, #ef4444)" }}>*</span>
          </label>
          <select
            name="category"
            defaultValue={initial?.category ?? ""}
            required
            className="study-select"
            style={{
              width: "100%",
              padding: "0.75rem 2rem 0.75rem 0.75rem",
              backgroundColor: "var(--bg-input, #1e2230)",
              border: "1px solid var(--border-color, #2d3142)",
              borderRadius: "6px",
              outline: "none",
            }}
          >
            <option value="" disabled hidden>
              분야 선택
            </option>
            {/* 값은 코드(FRONTEND), 보이는 글자는 한국어 — config/study-category.ts 한 곳에서 */}
            {Object.entries(studyCategories).map(([code, { label }]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* 모집 인원 */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            모집 인원{" "}
            <span style={{ color: "var(--color-danger, #ef4444)" }}>*</span>
          </label>
          <select
            name="maxMembers"
            defaultValue={initial?.maxMembers ?? ""}
            required
            className="study-select"
            style={{
              width: "100%",
              padding: "0.75rem 2rem 0.75rem 0.75rem",
              backgroundColor: "var(--bg-input, #1e2230)",
              border: "1px solid var(--border-color, #2d3142)",
              borderRadius: "6px",
              outline: "none",
            }}
          >
            <option value="" disabled hidden>
              모집 인원 선택
            </option>
            {/* 값은 숫자(5), 스터디장 포함 2~10명 (서버 규칙과 같게) */}
            {memberOptions.map((count) => (
              <option key={count} value={count}>
                {count}명
              </option>
            ))}
          </select>
        </div>

        {/* 마감일 */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            마감일{" "}
            <span style={{ color: "var(--color-danger, #ef4444)" }}>*</span>
          </label>
          <input
            name="deadline"
            type={dateType}
            required
            min={earliestDeadline()} // 달력에서 오늘 · 지난 날짜는 못 골라요 (#97)
            value={deadline}
            placeholder="날짜 선택"
            onChange={(e) => setDeadline(e.target.value)}
            onFocus={(e) => {
              setDateType("date");
              // 타입이 바뀐 직후 달력 열기
              setTimeout(
                () => (e.target as HTMLInputElement).showPicker?.(),
                0,
              );
            }}
            onBlur={() => {
              if (!deadline) setDateType("text");
            }}
            className="study-input"
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "var(--bg-input, #1e2230)",
              border: "1px solid var(--border-color, #2d3142)",
              borderRadius: "6px",
              color: deadline ? "#fff" : "var(--text-placeholder)",
              colorScheme: "dark",
              cursor: "pointer",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* 기술 태그 */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
          }}
        >
          기술 태그 {/* 현재 개수 표시 */}
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: "normal",
              color:
                tags.length >= MAX_TAGS
                  ? "var(--color-danger, #ef4444)"
                  : "var(--text-muted, #6b7280)",
            }}
          >
            {tags.length} / {MAX_TAGS}
          </span>
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
            padding: "0.5rem 0.75rem",
            backgroundColor: "var(--bg-input, #1e2230)",
            border: "1px solid var(--border-color, #2d3142)",
            borderRadius: "6px",
          }}
        >
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                backgroundColor: "var(--bg-tag, #2563eb33)",
                color: "var(--text-tag, #3b82f6)",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
              onClick={() => removeTag(tag)}
            >
              {tag} ✕
            </span>
          ))}
          {/* maxLength 추가, onChange에서 안내 지우기 */}
          {/* 비제어 칸 — name이 없어서 폼과 같이 보내지지 않아요(태그는 위 숨은 칸 techTags로) */}
          <input
            type="text"
            maxLength={MAX_TAG_LENGTH}
            onChange={() => setTagNotice(null)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? "태그 입력 후 Enter" : ""}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#fff",
              outline: "none",
              flex: 1,
              minWidth: "120px",
            }}
          />
        </div>
        {/* 안내 문구 (소개의 글자 수 안내와 같은 방식) */}
        <span
          role="status"
          aria-live="polite"
          style={{
            display: "block",
            marginTop: "0.25rem",
            fontSize: "0.75rem",
            color:
              tagNotice || tags.length >= MAX_TAGS
                ? "var(--color-danger, #ef4444)"
                : "var(--text-muted, #6b7280)",
          }}
        >
          {tagNotice ??
            (tags.length >= MAX_TAGS
              ? `최대 ${MAX_TAGS}개까지 추가했어요.`
              : `Enter로 태그를 추가해요 · 최대 ${MAX_TAGS}개, 태그당 ${MAX_TAG_LENGTH}자`)}
        </span>
      </div>

      {/* 진행 방식 */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
          }}
        >
          진행 방식{" "}
          <span style={{ color: "var(--color-danger, #ef4444)" }}>*</span>
        </label>
        <div
          style={{
            display: "inline-flex",
            backgroundColor: "var(--bg-input, #1e2230)",
            padding: "0.25rem",
            borderRadius: "6px",
            border: "1px solid var(--border-color, #2d3142)",
          }}
        >
          {/* 진행 방식은 라디오 — 고른 값은 FormData가 들고 가서 상태 · 숨은 칸이 필요 없어요.
              고른 모양은 CSS(has-checked:)가 그려요 (강의: 상태 대신 CSS로) */}
          {(Object.keys(studyModeLabels) as StudyMode[]).map((option) => (
            <label
              key={option}
              className="cursor-pointer rounded-[4px] px-4 py-2 text-[var(--text-muted,#6b7280)] has-checked:bg-[var(--bg-btn-active,#2d3142)] has-checked:font-bold has-checked:text-[var(--text-main,#ffffff)] has-focus-visible:outline-2 has-focus-visible:outline-ring"
            >
              <input
                type="radio"
                name="mode"
                value={option}
                defaultChecked={option === (initial?.mode ?? "ONLINE")}
                className="sr-only"
              />
              {studyModeLabels[option]}
            </label>
          ))}
        </div>
      </div>

      {/* 소개 */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
          }}
        >
          소개 <span style={{ color: "var(--color-danger, #ef4444)" }}>*</span>
        </label>
        <textarea
          name="content"
          required
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          className="study-textarea"
          placeholder="어떤 스터디인지, 진행 방식과 함께하고 싶은 분을 적어 주세요."
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "var(--bg-input, #1e2230)",
            border: "1px solid var(--border-color, #2d3142)",
            borderRadius: "6px",
            color: "#fff",
            resize: "none",
            outline: "none",
          }}
        ></textarea>
        <span
          style={{
            fontSize: "0.75rem",
            color:
              description.length >= 2000
                ? "var(--color-danger, #ef4444)"
                : "var(--text-muted, #6b7280)",
            display: "block",
            marginTop: "0.25rem",
          }}
        >
          {description.length} / 2000자
          {description.length >= 2000 && " · 최대 글자 수에 도달했어요"}
        </span>
      </div>

      {/* 서버가 돌려준 문구 (검사 실패 · 저장 실패) */}
      {(errorList.length > 0 || formError) && (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <ul className="list-disc pl-4">
            {errorList.map((message) => (
              <li key={message}>{message}</li>
            ))}
            {formError && <li>{formError}</li>}
          </ul>
        </div>
      )}

      {/* 하단 제어 바 */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "1rem",
        }}
      >
        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: "0.625rem 1.25rem",
            backgroundColor: "#238636",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {isPending ? "저장 중…" : initial ? "수정하기" : "등록하기"}
        </button>
      </div>
    </form>
  );
}
