import { MemozyResponse } from '../types/memozy';

export const memozyData: MemozyResponse = {
    success: true,
    errorMsg: null,
    errorCode: null,
    data: {
        collectionName: "알고리즘",
        content: [
            {
                urlId: 1,
                urlTitle: "백준 코딩 테스트 : 코딩",
                summary: "백준 코딩 테스트 요약본입니다. 백준 코딩 테스트 요약본입니다. 백준 코딩 테스트 요약본입니다. 백준 코딩 테스트 요약본입니다. 백준 코딩 테스트 요약본입니다. 백준 코딩 테스트 요약본입니다. ",
                quizCount: 5
            },
            {
                urlId: 2,
                urlTitle: "프로그래머스 코딩 테스트 : 코딩",
                summary: "프로그래머스 코딩 테스트 요약본입니다.",
                quizCount: 5
            }
        ],
        offset: 10,
        page: 1,
        last: true
    }
};
