package site.memozy.memozy_api.domain.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantDto {

	private String userId;

	private String nickname;

	private boolean isMember;
}
