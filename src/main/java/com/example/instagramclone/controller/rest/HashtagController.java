package com.example.instagramclone.controller.rest;

import com.example.instagramclone.domain.hashtag.dto.response.HashtagSearchResponse;
import com.example.instagramclone.domain.post.dto.response.FeedResponse;
import com.example.instagramclone.domain.post.dto.response.ProfilePostResponse;
import com.example.instagramclone.service.HashtagService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // 해시태그 기반 피드 목록 요청
    @GetMapping("/{tagName}/posts")
    public ResponseEntity<FeedResponse<ProfilePostResponse>> getPostsByHashtag(
            @PathVariable String tagName
            ,@RequestParam(defaultValue = "1") int page
            ,@RequestParam(defaultValue = "6") int size
    ){
        return ResponseEntity.ok()
                .body(hashtagService.getPostsByHashtag(
                        tagName,page,size
                ));
    }
}
