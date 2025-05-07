package site.memozy.memozy_api.global.openai;

import java.util.List;
import java.util.Map;

import org.springframework.ai.chat.prompt.ChatOptions;

public record MapChatOptions(Map<String, Object> options) implements ChatOptions {

	@Override
	public String getModel() {
		return (String)options.get("model");
	}

	@Override
	public Double getFrequencyPenalty() {
		return null;
	}

	@Override
	public Integer getMaxTokens() {
		return null;
	}

	@Override
	public Double getPresencePenalty() {
		return null;
	}

	@Override
	public List<String> getStopSequences() {
		return null;
	}

	@Override
	public Double getTemperature() {
		return null;
	}

	@Override
	public Integer getTopK() {
		return null;
	}

	@Override
	public Double getTopP() {
		return null;
	}

	@Override
	@SuppressWarnings("unchecked")
	public <T extends ChatOptions> T copy() {
		return (T)new MapChatOptions(Map.copyOf(options));
	}
}
