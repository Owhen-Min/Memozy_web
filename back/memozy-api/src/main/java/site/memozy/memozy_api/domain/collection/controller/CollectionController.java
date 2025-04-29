package site.memozy.memozy_api.domain.collection.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Collection", description = "Collection 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/collection")
public class CollectionController {
	
}
