package site.memozy.memozy_api.global.openai;

import static site.memozy.memozy_api.global.payload.code.ErrorStatus.*;

import java.util.List;
import java.util.Map;
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
	private final ChatClient.Builder chatClientBuilder;
	private final ObjectMapper objectMapper;

	public String summarizeMarkdown(QuizSourceCreateRequest request) {
		String promptText = """
			당신의 임무는 받는 데이터를 **한국어로 정리**해주는 것입니다.
			모든 응답은 반드시 **한국어로 출력**해야 합니다.
			
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

		ChatClient gpt4oClient = chatClientBuilder
			.defaultOptions(new MapChatOptions(Map.of("model", "gpt-4o")))
			.build();

		String resultJson = gpt4oClient
			.prompt()
			.user(promptText)
			.call()
			.content();

		try {
			log.info("퀴즈 생성 요청:");
			log.info(resultJson);

			JsonNode root = objectMapper.readTree(resultJson);

			int type = root.path("type").asInt();
			if (type == 0) {
				log.error("퀴즈 생성 실패: {}", resultJson);
				throw new GeneralException(QUIZ_VALID_SUMMARY);
			}

			JsonNode contentNode = root.path("content");
			List<QuizItemResponse> items = objectMapper.convertValue(
				contentNode,
				new TypeReference<>() {
				}
			);

			return new QuizResponse(type, items);

		} catch (GeneralException ge) {
			throw ge;
		} catch (Exception e) {
			log.error("퀴즈 결과 JSON 파싱 실패", e);
			throw new GeneralException(QUIZ_CREATE_ERROR);
		}
	}

	private static String fetchPromptText(Integer quizCount, List<String> quizTypes, String inputData) {
		return String.format("""
				당신의 임무는 투입된 데이터를 분석하여 **IT 관련 퀴즈**를 JSON 형식으로 생성하는 것입니다.
				
				---
				
				## 0. 파라미터 정의
				 - num_questions: %d
				 - question_types: %s
				
				## 1. 필터링 조건 정의
				
				### 1.1 악성 콘텐츠 (Malicious Content)
				- **개인정보 포함**: 주민등록번호, 신용카드 번호, 계좌번호, 비밀번호, 주소 등
				- **혐오·차별 표현**: 인종·성별·종교 비하, 욕설, 위협 등
				- **불법·유해 정보**: 해킹·악성코드 제작, 불법 약물·무기 제조법 등
				- **기타 위험 콘텐츠**: 자해·자살 조장, 폭력 선동 등
				
				### 1.2 비-IT 주제 (Non-IT Topic)
				- **IT 범주 예시**
				  - 프로그래밍 언어: Java, Python, JavaScript 등
				  - 웹 프레임워크: Spring, Django, React 등
				  - 네트워크·보안: TCP/IP, SSL/TLS, 방화벽 등
				  - 데이터베이스: SQL, NoSQL
				  - 클라우드·가상화·컨테이너: AWS, Docker, Kubernetes 등
				  - DevOps·CI/CD·모니터링: Jenkins, GitHub Actions, Prometheus 등
				  - 알고리즘·자료구조·컴퓨터 구조
				
				### 1.3 일반 정보 (General Info / Non-Quizable Content)
				- **비-문제성 개념 정의는 허용**, 단 아래의 경우는 퀴즈 생성을 거부합니다:
				  - **단순 개요 설명**: 예) 코딩 테스트 개요, 회사 채용 절차 등
				  - **비-지식성 목록**: 예) 온라인 저지 사이트 모음, 개발 도구 리스트 등
				  - **기술 외 역사/배경**: 예) 특정 기업의 창립 이야기, 서비스 연혁 등
				- 단, **DB/네트워크/언어/프레임워크 등 IT 기술 개념 정의**는 퀴즈 출제 허용
				
				위 항목에 해당하면 → **거부**
				
				- **비-IT 예시**
				  요리 레시피, 역사 사건, 스포츠 경기 결과, 여행지 추천 등
				
				---
				
				## 2. Steps
				
				1. **데이터 검토 및 분석**
				   - 입력 데이터를 위 정의에 따라 검사
				     - **악성 콘텐츠** 또는 **비-IT 주제**인 경우 → 거부
				     - 그 외 신뢰할 수 있는 IT 관련 데이터인 경우 → 퀴즈 생성
				
				2. **퀴즈 생성**
				   - **`num_questions`** 만큼 문제를 생성
				   - **`question_type`** 에 따라 결과 포맷 분기
				
				   - 퀴즈 생성 전, **이미 생성된 문제들과 의미적으로 중복되지 않는지 검사**합니다.
				   - 다음과 같은 경우는 중복 퀴즈로 간주되어 생성하지 않습니다:
				     1. 질문 문장만 다르고 **정답(answer)** 및 **해설(commentary)** 이 동일하거나 매우 유사한 경우
				     2. **동일한 개념 또는 키워드(예: 기밀성, 무결성 등)** 을 반복적으로 출제한 경우
				     3. 문제 유형은 달라도, 같은 개념을 정의하는 퀴즈가 이미 있다면 **출제를 생략**합니다.
				   - 예시:
				     - “기밀성은 무엇인가요?” → 출제됨
				     - “인가되지 않은 접근을 방지하는 특성은?” → 동일 개념 → 출제 거부
				
				   - **multiple_choice**:
				     {
				       "quiz_type" : 1,
				       "question": "...",
				       "options": ["foo", "bar", "baz", "qux"],
				       "answer": "bar",
				       "explanation": "해설"
				     }
				   - **true_false** (OX 퀴즈):
				     {
				       "quiz_type" : 2,
				       "question": "...",
				       "options" : null,
				       "answer": "O",  // 또는 "X"
				       "explanation": "해설"
				     }
				   - **short_answer** (단답형):
				     {
				       "quiz_type" : 3,
				       "question": "...",
				       "options" : null,
				       "answer": "정답(단답)",
				       "explanation": "해설"
				     }
				
				3. **응답 반환**
				   - **거부 시**
				     {
				       "type": 0,
				       "content": null
				     }
				   - **정상 생성 시**
				     {
				       "type": 1,
				       "content": [<생성된 문제 객체가 num_questions 개 만큼>]
				     }
				
				---
				
				## 3. Examples
				
				**Example 1: 악성 사용자 입력**
				`입력 데이터: [Spring Boot] ...`
				- Output:
				  {
				    "type": 0,
				    "content": null
				  }
				
				**Example 2: 신뢰할 수 있는 입력**
				`입력 데이터: comeTrue.log ...`
				- Output:
				  {
				    "type": 1,
				    "content": [ ... ]
				  }
				
				# Notes
				
				- 데이터가 악성인지 아닌지를 판단하기 위해 논리적이고 체계적인 접근 방식을 사용하세요.
				- 퀴즈 문제는 IT 관련이며 입력된 주제에 부합해야 합니다.
				- **모든 출력은 반드시 한국어로 작성되어야 합니다. 영어로 출제하지 마세요.**
				""",
			quizCount,
			quizTypes.stream()
				.map(text -> "\"" + text + "\"")
				.collect(Collectors.joining(", "))
		) + "\n\n입력 데이터: " + inputData
			+ "\n\n 최종 출력은 반드시 JSON 본문만 단독으로 출력하세요. 절대 ```json 이나 코드 블럭으로 감싸지 마세요.";
	}

}
