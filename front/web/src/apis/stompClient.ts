import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";

const useWebSocket = (showId: string) => {
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
        : {
            showId: showId,
          },
      onConnect: () => {
        setIsConnected(true);
        setStompClient(client);
      },
      onDisconnect: () => {
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
