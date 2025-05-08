import { QuizHistoryData } from "../types/wrongAnswer";

export const quizHistoryData: QuizHistoryData[] = [
  {
    id: 1,
    name: "리액트",
    data: [
      {
        historyId: 1,
        round: 2,
        failCount: 5,
        date: "2025.04.12",
        quizDatas: [
          {
            quizId: 101,
            content: "프랑스의 수도는 파리인가?",
            type: "MULTIPLE_CHOICE",
            userSelect: "번호 2",
            choice: ["번호 1", "번호 2", "번호 3", "번호 4"],
            answer: "번호 4",
            commentary:
              "해당 문제는 이벤트 버블링과 캡처링에 대한 개념을 묻는 문제입니다.",
          },
          {
            quizId: 102,
            content: "프랑스의 수도는 파리인가?",
            type: "OBJECTIVE",
            userSelect: "틀린 단답",
            choice: null,
            answer: "맞은 단답",
            commentary: "React의 상태 관리 방식에 대한 설명입니다.",
          },
          {
            quizId: 103,
            content: "프랑스의 수도는 파리인가?",
            type: "OX",
            userSelect: "O",
            choice: null,
            answer: "X",
            commentary: "React의 상태 관리 방식에 대한 설명입니다.",
          },
        ],
      },
      {
        historyId: 2,
        round: 2,
        failCount: 3,
        date: "2025.04.20",
        quizDatas: [
          {
            quizId: 201,
            content: "프랑스의 수도는 파리인가?",
            type: "MULTIPLE_CHOICE",
            userSelect: "번호 4",
            choice: ["번호 1", "번호 2", "번호 3", "번호 4"],
            answer: "번호 2",
            commentary: "useEffect의 의존성 배열 관련 문제입니다.",
          },
          {
            quizId: 202,
            content: "프랑스의 수도는 파리인가?",
            type: "MULTIPLE_CHOICE",
            userSelect: "번호 2",
            choice: ["번호 1", "번호 2", "번호 3", "번호 4"],
            answer: "번호 1",
            commentary: "JSX의 문법적 제약 사항에 대한 설명입니다.",
          },
          {
            quizId: 203,
            content: "프랑스의 수도는 파리인가?",
            type: "MULTIPLE_CHOICE",
            userSelect: "번호 1",
            choice: ["번호 1", "번호 2", "번호 3", "번호 4"],
            answer: "번호 4",
            commentary: "React에서 key 속성의 중요성에 대해 묻는 문제입니다.",
          },
        ],
      },
    ],
  },
];
