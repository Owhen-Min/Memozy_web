import { CollectionResponse } from '../types/collection';

export const collectionData: CollectionResponse = {
    success: true,
    errorMsg: null,
    errorCode: null,
    data: [
        {
            "id": 1,
            "name": "CS스터디",
            "memozyCount": 5,
            "quizCount": 50
        },
        {
            "id": 2,
            "name": "개발",
            "memozyCount": 3,
            "quizCount": 30
        },
        {
            "id": 3,
            "name": "정처기",
            "memozyCount": 8,
            "quizCount": 80
        },
        {
            "id": 4,
            "name": "알고리즘",
            "memozyCount": 2,
            "quizCount": 10
        }
    ]
};