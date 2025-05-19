import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";

const useWebSocket = (showId: string, userId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("memozy_access_token");
    const client = new Client({
      brokerURL: "wss://memozy.site/ws-connect",
      // brokerURL: "ws://70.12.246.135:8080/ws-connect",

      reconnectDelay: 1000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      connectHeaders: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
            showId: showId,
          }
        : userId
          ? { Authorization: `Bearer ${userId}`, showId: showId }
          : { showId: showId },

      onConnect: () => {
        // heartbeat 주기 확인
        console.log("heartbeatOut:", client.heartbeatOutgoing); // 10000
        console.log("heartbeatIn:", client.heartbeatIncoming); // 10000

        // 내부 웹소켓 객체 상태 확인
        console.log("WebSocket 상태:", client.webSocket);
        console.log("웹소켓 연결");
        setIsConnected(true);
        setStompClient(client);
      },
      onDisconnect: () => {
        console.log("웹소켓 연결 종료");
        setIsConnected(false);
        setStompClient(null);
      },
      onStompError: (frame) => {
        console.error("에러 발생:", frame);
      },
      // debug: (str) => {
      //   console.log(str);
      // },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
        setIsConnected(false);
        setStompClient(null);
      }
    };
  }, []);

  useEffect(() => {
    if (!stompClient || !isConnected) return;

    const timer = setInterval(() => {
      stompClient.publish({ destination: "/pub/ping", body: "" });
    }, 10000);

    return () => clearInterval(timer);
  }, [stompClient, isConnected]);

  return { stompClient, isConnected };
};

export default useWebSocket;
