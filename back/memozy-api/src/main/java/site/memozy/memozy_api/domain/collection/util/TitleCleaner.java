package site.memozy.memozy_api.domain.collection.util;

import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

@Component
public class TitleCleaner {
	private static final Pattern COPY_TITLE_PATTERN = Pattern.compile("\\(복사본\\s*-\\s*(.*?)\\)$");

	public String removeCopySuffix(String title) {
		return COPY_TITLE_PATTERN.matcher(title).replaceAll("").trim();
	}
}
