import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";

const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("memozy_access_token");
    const client = new Client({
      // brokerURL: "wss://memozy.site/ws-connect",
      brokerURL: "ws://70.12.246.135:8080/ws-connect",
      reconnectDelay: 10000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },

      onConnect: () => {
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

  return { stompClient, isConnected };
};

export default useWebSocket;
