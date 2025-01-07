package com.example.instagramclone.controller.rest;

import com.example.instagramclone.domain.hashtag.dto.response.HashtagSearchResponse;
import com.example.instagramclone.service.HashtagService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/hashtags")
@Slf4j
@RequiredArgsConstructor
public class HashtagController {
    private  final HashtagService hashtagService;

    @GetMapping("/search")
    public ResponseEntity<?> searchHashtag(
            @RequestParam("keyword") String keyword
    ){
        log.info("searching hashtags with keyword : {}",keyword);
        List<HashtagSearchResponse> responseList = hashtagService.searchHashtag(keyword);

        return ResponseEntity
                .ok()
                .body(responseList);
    }
}
