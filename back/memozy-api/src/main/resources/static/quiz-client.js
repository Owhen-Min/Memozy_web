import {Client} from "https://cdn.jsdelivr.net/npm/@stomp/stompjs/+esm";

let stompClient = null;
let currentShowId = null;

export async function createQuizShow() {
    const collectionId = document.getElementById("collectionId").value;
    const token = localStorage.getItem("jwtToken");

    try {
        const res = await fetch(`/api/quiz/show/${collectionId}?count=5`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token && {Authorization: token}) // token 자체에 "Bearer " 붙어 있어야 함
            }
        });

        const result = await res.json();
        currentShowId = result.data.data.showId || result.data.data.code;

        if (!currentShowId) throw new Error("showId/code 값이 없습니다.");

        document.getElementById("showId").value = currentShowId;
        alert("퀴즈쇼 생성 완료! 코드: " + currentShowId);
    } catch (e) {
        alert("퀴즈 생성 실패!");
        console.error(e);
    }
}

export function connectAndJoin() {
    const showId = document.getElementById("showId").value;
    const token = localStorage.getItem("jwtToken");
    const headers = token ? {Authorization: token} : {};

    stompClient = new Client({
        brokerURL: "ws://localhost:8080/ws-connect",
        connectHeaders: headers,
        debug: (str) => console.log("[STOMP DEBUG]", str),
        reconnectDelay: 5000,
        onConnect: () => {
            document.getElementById("status").innerText = `✔ 연결됨 (${showId})`;

            // 퀴즈 문제 수신
            stompClient.subscribe(`/sub/quiz/show/${showId}/quiz`, (message) => {
                const {index, quiz} = JSON.parse(message.body);
                document.getElementById("question").innerText = `[Q${index + 1}] ${quiz}`;
            });

            // 종료 알림
            stompClient.subscribe(`/sub/quiz/show/${showId}/end`, () => {
                document.getElementById("question").innerText = "퀴즈 종료!";
            });

            // 전체 결과
            stompClient.subscribe(`/sub/quiz/show/${showId}/result`, (message) => {
                const data = JSON.parse(message.body);
                document.getElementById("topResult").innerText = "🏆 랭킹: " +
                    data.topRanking.map(r => `${r.rank}. ${r.name} (${r.score})`).join(", ");
                document.getElementById("wrongQuiz").innerText = `❌ 가장 많이 틀린 문제: ${data.mostWrongQuiz.content}`;
            });

            // 개인 결과
            stompClient.subscribe(`/sub/quiz/show/${showId}/result/guest-user`, (message) => {
                const data = JSON.parse(message.body);
                document.getElementById("personalResult").innerText =
                    `📈 내 점수: ${data.myScore}, 정답 수: ${data.myCorrectQuizCount}/${data.totalQuizCount}`;
            });

            // 입장 요청
            stompClient.publish({
                destination: `/pub/quiz/show/${showId}/join`,
                body: JSON.stringify({nickname: "Guest123", isMember: false})
            });
        }
    });

    stompClient.activate();
}

export function startQuizShow() {
    const showId = document.getElementById("showId").value;
    if (!stompClient || !stompClient.connected) {
        alert("먼저 WebSocket 연결을 완료하세요.");
        return;
    }

    stompClient.publish({
        destination: `/pub/quiz/show/${showId}/start`,
        body: ""
    });
}

export function submitAnswer(choice) {
    const showId = document.getElementById("showId").value;
    if (!stompClient || !stompClient.connected) return;

    stompClient.publish({
        destination: `/pub/quiz/show/${showId}/submit`,
        body: JSON.stringify({
            type: "SUBMIT",
            index: 0,
            answer: choice,
            isCorrect: choice === "O"
        })
    });
}

// 전역에 연결
window.createQuizShow = createQuizShow;
window.connectAndJoin = connectAndJoin;
window.startQuizShow = startQuizShow;
window.submitAnswer = submitAnswer;
