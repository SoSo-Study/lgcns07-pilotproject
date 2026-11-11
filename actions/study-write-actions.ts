"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { getServerAuth } from "@/lib/auth-session";
import { fieldErrors } from "@/lib/field-errors";
import {
  readStudyWriteForm,
  studyWriteSchema,
  type StudyWriteValues,
} from "@/schema/study-write-schema";
import {
  createStudy,
  deleteStudy,
  findStudy,
  updateStudy,
} from "@/service/study-service";

// ③ 모집글 등록 · 수정 · ② 삭제 — 화면 → 여기 → service → 강사님 API (#46 · #45 A4)
// 🔒 작성자는 폼으로 받지 않아요. 서버가 토큰으로 정해요 (#45 B7)

export type StudyWriteResult =
  | { ok: true; studyId: number }
  | {
      ok: false;
      errors?: Partial<Record<keyof StudyWriteValues, string>>;
      formError?: string;
    };

// [등록하기] · [수정하기] — studyId가 있으면 수정
export async function saveStudyAction(
  formData: FormData,
): Promise<StudyWriteResult> {
  // 1. 화면과 같은 규칙으로 서버에서 다시 검사 (화면을 거치지 않고 직접 불러도 막혀요)
  const parsed = studyWriteSchema.safeParse(readStudyWriteForm(formData));
  if (!parsed.success) {
    return { ok: false, errors: fieldErrors(parsed.error) };
  }

  const auth = await getServerAuth();
  if (!auth) return { ok: false, formError: "로그인이 필요해요." };

  const editId = Number(formData.get("studyId"));
  const isEdit = Number.isInteger(editId) && editId > 0;

  // 2. 수정이면 내 글인지 먼저 확인 (서버도 403으로 한 번 더 막아요)
  if (isEdit) {
    const study = await findStudy(String(editId));
    if (!study || study.authorId !== auth.userId) {
      return { ok: false, formError: "스터디장만 수정할 수 있어요." };
    }
  }

  // 3. 강사님 API로 저장
  const result = isEdit
    ? await updateStudy(auth.accessToken, editId, parsed.data)
    : await createStudy(auth.accessToken, parsed.data);
  if (!result.success || !result.data) {
    return {
      ok: false,
      formError: result.message || "저장하지 못했어요. 다시 시도해 주세요.",
    };
  }

  revalidatePath(routes.studies);
  revalidatePath(routes.myStudies);
  return { ok: true, studyId: result.data.id };
}

// ── 삭제 ──
export type DeleteStudyState = { message: string } | null;

// [삭제] — 스터디장만. 끝나면 내 모집글로
export async function deleteStudyAction(
  _prev: DeleteStudyState,
  formData: FormData,
): Promise<DeleteStudyState> {
  const studyId = Number(formData.get("studyId"));
  if (!Number.isInteger(studyId) || studyId <= 0) {
    return { message: "잘못된 요청이에요. 새로고침 후 다시 시도해 주세요." };
  }

  const auth = await getServerAuth();
  if (!auth) return { message: "로그인이 필요해요." };

  const result = await deleteStudy(auth.accessToken, studyId);
  if (!result.success) return { message: result.message };

  revalidatePath(routes.studies);
  revalidatePath(routes.myStudies);
  redirect(routes.myStudies);
}
