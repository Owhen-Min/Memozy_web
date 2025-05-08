package site.memozy.memozy_api.domain.history.dto;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.querydsl.core.annotations.QueryProjection;

import lombok.Getter;

@Getter
public class HistoryContributeResponse {

	@JsonFormat(pattern = "yyyy-MM-dd")
	private final Date date;
	private final int count;
	private final Integer level;

	@QueryProjection
	public HistoryContributeResponse(Date date, int count, Integer level) {
		this.date = date;
		this.count = count;
		this.level = level;
	}
}
