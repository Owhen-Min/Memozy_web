package site.memozy.memozy_api.global.websocket.handler;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import site.memozy.memozy_api.global.websocket.config.StompPrincipal;

@Component
public class CustomHandshakeHandler extends DefaultHandshakeHandler {

	@Override
	protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler,
		Map<String, Object> attributes) {
		String userId = (String)attributes.get("userId");
		return userId != null ? new StompPrincipal(userId) : super.determineUser(request, wsHandler, attributes);
	}
}
