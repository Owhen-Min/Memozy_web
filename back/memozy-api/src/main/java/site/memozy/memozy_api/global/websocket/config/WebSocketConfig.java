package site.memozy.memozy_api.global.websocket.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import lombok.RequiredArgsConstructor;
import site.memozy.memozy_api.global.websocket.handler.CustomHandshakeHandler;
import site.memozy.memozy_api.global.websocket.handler.StompErrorHandler;
import site.memozy.memozy_api.global.websocket.handler.StompHandler;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	private final StompHandler stompHandler;
	private final StompErrorHandler stompErrorHandler;
	private final CustomHandshakeHandler customHandshakeHandler;
	private final ThreadPoolTaskScheduler taskScheduler = createTaskScheduler();

	private ThreadPoolTaskScheduler createTaskScheduler() {
		ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
		scheduler.setPoolSize(1);
		scheduler.setThreadNamePrefix("ws-heartbeat-");
		scheduler.initialize();
		return scheduler;
	}

	@Override
	public void configureClientInboundChannel(ChannelRegistration registration) {
		registration.interceptors(stompHandler);
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		config.enableSimpleBroker("/sub")
			.setHeartbeatValue(new long[] {10000, 10000})
			.setTaskScheduler(taskScheduler);
		config.setApplicationDestinationPrefixes("/pub");
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/ws-connect")
			.setAllowedOriginPatterns("*")
			.setHandshakeHandler(customHandshakeHandler);

		registry.setErrorHandler(stompErrorHandler);
	}
}
