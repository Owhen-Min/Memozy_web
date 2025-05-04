package site.memozy.memozy_api.domain.quizsource.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.domain.quizsource.dto.QuizSourceCreateRequest;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuizSourceServiceImpl implements QuizSourceService {

	private final ChatClient chatClient;
	private final ObjectMapper objectMapper = new ObjectMapper();

	@Override
	public String summarizeMarkdown(QuizSourceCreateRequest request) {
		String promptText = """
			당신의 임무는 받는 데이터를 정리해주는 것입니다.
			# Steps
			1. **주어진 데이터를 분석하여 해당 데이터에서 어떤 주제인지 확인**
			    - 입력한 데이터를 분석하여 어떤 주제의 내용인지 확인합니다.
			    - 사진의 URL을 통하여 분석하여 해당 이미지가 적절한 이미지 인지 판단합니다.
			
			2. **분석한 주제를 통하여 마크다운 형식으로 응답 반환**
			    - 적절한 이미지가 아니라면 해당 URL은 넣지 않습니다.
			    - 적절한 이미지라면 해당 URL은 적절한 위치에 넣습니다.
			    - 데이터가 하나의 주제로 정리하여 생성합니다.
			
			# Notes
			    - 데이터가 하나의 주제로 파악하기 위해 논리적이고 체계적인 접근 방식을 사용하세요.
			""" + request.getContext();

		return chatClient
			.prompt()
			.user(promptText)
			.call()
			.content();
	}
}

