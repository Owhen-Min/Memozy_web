export interface LearningContribution {
  date: string; // ISO 형식 날짜 문자열
  count: number; // 해당 날짜의 학습 횟수
  level: number; // 학습 참여도 레벨 (1~4)
}

export interface CollectionAccuracy {
  collectionId: string;
  name: string;
  latestAccuracy: number; // 가장 최근 정답률 (%)
}

export interface TopCollection {
  collectionId: string;
  name: string;
  problemCount: number; // 해당 컬렉션의 문제 수
}

export interface AnalysisReportData {
  totalQuizCount: number; // 총 문제 수
  solvedQuizCount: number; // 풀린 문제 수
  learningContribution: LearningContribution[]; // 학습 참여도
  collectionAccuracy: CollectionAccuracy[]; // 컬렉션 정답률
  topCollections: TopCollection[]; // 상위 컬렉션
  otherCollectionsCount: number; // 기타 컬렉션 수
}

export interface AnalysisReportResponse {
  success: boolean;
  errorMsg: string | null;
  errorCode: string | null;
  data: AnalysisReportData;
}
