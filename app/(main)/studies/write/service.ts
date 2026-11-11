// app/(main)/studies/write/service.ts

export interface StudyPostInput {
  title: string;
  category: string;
  capacity: string;
  deadline: string;
  tags: string[];
  mode: string;
  description: string;
}

export interface StudyPost extends StudyPostInput {
  id: string;
}

// 로컬 테스트용 메모리 데이터 스토어
const mockStudies: StudyPost[] = [];

export const StudyWriteService = {
  // 새 모집글 등록 기능만 전담
  async createStudy(data: StudyPostInput): Promise<StudyPost> {
    const newStudy: StudyPost = {
      id: Math.random().toString(36).substring(2, 9),
      ...data,
    };
    mockStudies.push(newStudy);
    return newStudy;
  },
};
