package com.example.instagramclone.controller.rest;

import com.example.instagramclone.domain.like.dto.response.LikeStatusResponse;
import com.example.instagramclone.service.PostLikeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Slf4j
public class PostLikeController {

    private final PostLikeService postLikeService;

    // 좋아요 토글 api
    @PostMapping("/{postId}/likes")
    public ResponseEntity<?> toggleLike(
            @AuthenticationPrincipal String username
            , @PathVariable Long postId
    ) {
        //좋아요 토글 수행
        LikeStatusResponse likeStatusResponse = postLikeService.toggleLike(postId, username);

        return ResponseEntity.ok().body(likeStatusResponse);
    }
}
