package site.memozy.memozy_api.global.openai;

import static site.memozy.memozy_api.global.payload.code.ErrorStatus.QUIZ_VALID_SUMMARY;
import static site.memozy.memozy_api.global.payload.code.ErrorStatus.VALIDATION_ERROR;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import site.memozy.memozy_api.domain.quiz.dto.QuizItemResponse;
import site.memozy.memozy_api.domain.quiz.dto.QuizResponse;
import site.memozy.memozy_api.domain.quizsource.dto.QuizSourceCreateRequest;
import site.memozy.memozy_api.global.payload.exception.GeneralException;

@Slf4j
@Service
@RequiredArgsConstructor
public class OpenAiService {

	private final ChatClient chatClient;
	private final ObjectMapper objectMapper;

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

	public QuizResponse createQuiz(Integer quizCount, List<String> quizTypes, String inputData) {
		if (quizCount > 10)
			throw new GeneralException(VALIDATION_ERROR);

		String promptText = fetchPromptText(quizCount, quizTypes, inputData);

		String resultJson = chatClient
			.prompt()
			.user(promptText)
			.call()
			.content();

		try {
			// 2) 전체 문자열을 JsonNode로 파싱
			JsonNode root = objectMapper.readTree(resultJson);

			int type = root.path("type").asInt();
			if (type == 0) {
				// 실패 케이스: 에러 처리
				log.error("퀴즈 생성 실패: {}", resultJson);
				throw new GeneralException(QUIZ_VALID_SUMMARY);
			}

			// 3) 정상 케이스(type=1)만 content 파싱
			JsonNode contentNode = root.path("content");
			List<QuizItemResponse> items = objectMapper.convertValue(
				contentNode,
				new TypeReference<>() {
				}
			);

			// 4) DTO 반환
			return new QuizResponse(type, items);

		} catch (GeneralException ge) {
			throw ge;
		} catch (Exception e) {
			log.error("퀴즈 결과 JSON 파싱 실패", e);
			throw new GeneralException(QUIZ_VALID_SUMMARY);
		}
	}

	private static String fetchPromptText(Integer quizCount, List<String> quizTypes, String inputData) {
		String promptText = String.format("""
								당신의 임무는 투입된 데이터를 분석하여 **IT 관련 퀴즈**를 JSON 형식으로 생성하는 것입니다.
				
								---
				
								## 0. 파라미터 정의
								 - num_questions: %d
								 - question_types: %s\s
				
				
								## 1. 필터링 조건 정의
				
								### 1.1 악성 콘텐츠 (Malicious Content)
								- **개인정보 포함**: 주민등록번호, 신용카드 번호, 계좌번호, 비밀번호, 주소 등 \s
								- **혐오·차별 표현**: 인종·성별·종교 비하, 욕설, 위협 등 \s
								- **불법·유해 정보**: 해킹·악성코드 제작, 불법 약물·무기 제조법 등 \s
								- **기타 위험 콘텐츠**: 자해·자살 조장, 폭력 선동 등 \s
				
								### 1.2 비-IT 주제 (Non-IT Topic)
								- **IT 범주 예시** \s
								  - 프로그래밍 언어: Java, Python, JavaScript 등 \s
								  - 웹 프레임워크: Spring, Django, React 등 \s
								  - 네트워크·보안: TCP/IP, SSL/TLS, 방화벽 등 \s
								  - 데이터베이스: SQL, NoSQL \s
								  - 클라우드·가상화·컨테이너: AWS, Docker, Kubernetes 등 \s
								  - DevOps·CI/CD·모니터링: Jenkins, GitHub Actions, Prometheus 등 \s
								  - 알고리즘·자료구조·컴퓨터 구조 \s
				
								- **비-IT 예시** \s
								  요리 레시피, 역사 사건, 스포츠 경기 결과, 여행지 추천 등 \s
				
								---
				
								## 2. Steps
				
								1. **데이터 검토 및 분석** \s
								   - 입력 데이터를 위 정의에 따라 검사 \s
								     - **악성 콘텐츠** 또는 **비-IT 주제**인 경우 → 거부 \s
								     - 그 외 신뢰할 수 있는 IT 관련 데이터인 경우 → 퀴즈 생성
				
								2. **퀴즈 생성** \s
								   - **`num_questions`** 만큼 문제를 생성 \s
								   - **`question_type`** 에 따라 결과 포맷 분기 \s
								     - **multiple_choice**: \s
								       ```json
								       {
									     "quiz_type" : 1,
								         "question": "...",
								         "options": ["foo", "bar", "baz", "qux"],
								         "answer": "bar",
								         "explanation": "해설"
								       }
								       ```
								     - **true_false** (OX 퀴즈): \s
								       ```json
								       {
									     "quiz_type" : 2,
								         "question": "...",
								         "options" : null,
								         "answer": "O"  // 또는 "X",
								         "explanation": "해설"
								       }
								       ```
								     - **short_answer** (단답형): \s
								       ```json
								       {
									       "quiz_type" : 3,
								         "question": "...",
								         "options" : null,
								         "answer": "정답(단답)",
								         "explanation": "해설"
								       }
								       ```
				
				
								3. **응답 반환** \s
								   - **거부 시** \s
								     ```json
								     { "type": 0, "content": null }
								     ```
								   - **정상 생성 시** \s
								     ```json
								     {
								       "type": 1,
								       "content": [<생성된 문제 객체가 num_questions 개 만큼>]
								     }
								     ```
				
								---
				
								## 3. Examples
				
								**Example 1: 악성 사용자 입력** \s
								`입력 데이터: [Spring Boot] ...`
								- Output:
								  ```json
								  {"type": 0, "content": null}
								  ```
				
								**Example 2: 신뢰할 수 있는 입력** \s
								`입력 데이터: comeTrue.log ...`
								- Output:
								  ```json
								  { "type": 1, "content": [ ... ] }
								  ```
				
								# Notes
				
								- 데이터가 악성인지 아닌지를 판단하기 위해 논리적이고 체계적인 접근 방식을 사용하세요.
								- 퀴즈 문제는 IT 관련이며 입력된 주제에 부합해야 합니다.
				""",
			quizCount,
			quizTypes.stream()
				.map(text -> "\"" + text + "\"")
				.collect(Collectors.joining(", "))
		) + "\n\n입력 데이터: " + inputData
							+ "\n\n출력은 절대 ``` 코드 블록 없이, 순수 JSON 형태로만 반환해주세요.";
		return promptText;
	}

}
