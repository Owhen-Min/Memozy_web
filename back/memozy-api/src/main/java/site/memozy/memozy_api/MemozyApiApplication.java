package site.memozy.memozy_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class MemozyApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(MemozyApiApplication.class, args);
	}

}
