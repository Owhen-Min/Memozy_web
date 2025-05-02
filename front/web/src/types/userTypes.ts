// 사용자 정보 타입 정의
export interface UserInfo {
  sub?: string; // 사용자 식별자
  name?: string; // 사용자 이름
  nickname?: string; // 닉네임
  preferred_username?: string; // 선호 사용자명
  [key: string]: unknown; // 추가 속성을 위한 인덱스 시그니처
}
