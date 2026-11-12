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
  const [tags, setTags] = useState<string[]>(initial?.techTags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [mode, setMode] = useState<StudyMode>(initial?.mode ?? "ONLINE");
  const [deadline, setDeadline] = useState(initial?.deadline ?? "");
  const [dateType, setDateType] = useState<"text" | "date">(
    initial ? "date" : "text",
  );
  const [description, setDescription] = useState(initial?.content ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tagInput.trim().slice(0, MAX_TAG_LENGTH);
      // 쉼표는 태그를 이어 붙이는 기호라 빼요. 5개까지만 (서버 규칙과 같게)
      if (
        trimmed &&
        !trimmed.includes(",") &&
        !tags.includes(trimmed) &&
        tags.length < MAX_TAGS
      ) {
        setTags([...tags, trimmed]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // 등록 후 폼 비우기: state로 관리하는 값 + defaultValue를 쓰는 칸을 둘 다 되돌려요
  const resetForm = (form: HTMLFormElement) => {
    form.reset(); // 제목 · 분야 · 모집 인원 (defaultValue 칸)
    setTags([]);
    setTagInput("");
    setMode("ONLINE");
    setDeadline("");
    setDateType("text"); // 마감일을 "날짜 선택" 안내 글이 보이는 상태로
    setDescription("");
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // 서버 액션: 검사 → 강사님 API 저장. 기다리는 동안 버튼이 잠겨요(연타 방지)
    startTransition(async () => {
      const result = await saveStudyAction(formData);
      if (!result.ok) {
        setErrors(result.errors ?? {});
        setFormError(result.formError ?? null);
        return;
      }
      setErrors({});
      setFormError(null);
      if (!initial) resetForm(form); // 등록이면 폼 초기화
      // 저장한 글의 상세로 (replace: 뒤로 가기로 폼에 다시 오지 않게)
      router.replace(routes.study(result.studyId));
      router.refresh();
    });
  };

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
      <input type="hidden" name="mode" value={mode} />
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
          기술 태그
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
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
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
          {(Object.keys(studyModeLabels) as StudyMode[]).map((option) => {
            const isSelected = mode === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setMode(option)}
                style={{
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: isSelected
                    ? "var(--bg-btn-active, #2d3142)"
                    : "transparent",
                  color: isSelected
                    ? "var(--text-main, #ffffff)"
                    : "var(--text-muted, #6b7280)",
                  fontWeight: isSelected ? "bold" : "normal",
                  cursor: "pointer",
                }}
              >
                {studyModeLabels[option]}
              </button>
            );
          })}
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
