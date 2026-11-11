// app/(main)/studies/write/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { StudyWriteService } from "./service";

export async function handleStudySubmitAction(formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const capacity = formData.get("capacity") as string;
  const deadline = formData.get("deadline") as string;
  const mode = formData.get("mode") as string;
  const description = formData.get("description") as string;

  const tagsRaw = formData.get("tags") as string;
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()) : [];

  // 기본 선택 안내 문구 상태로 들어오거나 값이 비어있으면 차단
  if (!title || !category || !capacity || !deadline || !mode || !description) {
    throw new Error("필수 항목을 빠짐없이 선택 및 입력해주세요.");
  }

  if (description.length > 2000) {
    throw new Error("소개는 2000자 이내로 작성해주세요.");
  }

  await StudyWriteService.createStudy({
    title,
    category,
    capacity,
    deadline,
    tags,
    mode,
    description,
  });

  revalidatePath("/studies");
}
