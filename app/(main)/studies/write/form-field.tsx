// app/(main)/studies/write/FormFields.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { handleStudySubmitAction } from "./actions";

export default function StudyWriteForm() {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>(["React", "Next.js"]);
  const [tagInput, setTagInput] = useState("");
  const [mode, setMode] = useState("온라인");
  const [deadline, setDeadline] = useState("");
  const [dateType, setDateType] = useState<"text" | "date">("text");
  const [description, setDescription] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; // await 전에 미리 저장해야 합니다
    const formData = new FormData(form);

    try {
      await handleStudySubmitAction(formData);
      alert("🎉 모집글이 성공적으로 등록되었습니다!");

      // 폼 초기화
      form.reset(); // 제목, 분야, 모집 인원, 소개
      setTags(["React", "Next.js"]); // 태그를 처음 상태로
      setTagInput("");
      setMode("온라인");
      setDeadline("");

      setDateType("text"); // 날짜칸을 다시 "날짜 선택" 문구로

      router.push("/studies");
    } catch (error) {
      alert("등록 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      <input type="hidden" name="tags" value={tags.join(",")} />
      <input type="hidden" name="mode" value={mode} />

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
            defaultValue=""
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
            <option value="프론트엔드">프론트엔드</option>
            <option value="백엔드">백엔드</option>
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
            name="capacity"
            defaultValue=""
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
            <option value="5명">5명</option>
            <option value="4명">4명</option>
            <option value="3명">3명</option>
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
          {["온라인", "오프라인", "온·오프 함께"].map((option) => {
            const isSelected = mode === option;
            return (
              <button
                key={option}
                type="button"
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
                {option}
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
          name="description"
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
          등록하기
        </button>
      </div>
    </form>
  );
}
