package site.memozy.memozy_api.domain.collection.util;

import org.springframework.stereotype.Component;

@Component
public class TitleCleaner {
	private static final String COPY_PREFIX = "(복사본 - ";
	private static final String COPY_SUFFIX = ")";

	public String removeCopySuffix(String title) {
		int startIndex = title.lastIndexOf(COPY_PREFIX);
		int endIndex = title.lastIndexOf(COPY_SUFFIX);

		// 복사본 형식이 있는 경우만 잘라냄
		if (startIndex != -1 && endIndex == title.length() - 1 && startIndex < endIndex) {
			return title.substring(0, startIndex).trim();
		}

		return title;
	}
}
