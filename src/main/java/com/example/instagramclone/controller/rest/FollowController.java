package com.example.instagramclone.controller.rest;

import com.example.instagramclone.service.FollowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Objects;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/follows")
@Slf4j
public class FollowController {
    private final FollowService followService;

    @PostMapping("/{followerName}")
    public ResponseEntity<?> toggleFollow(
            @PathVariable String followerName
            , @AuthenticationPrincipal String followingName) {

        log.info("{} toggled follow status for {} ",followingName,followerName);

        Map<String, Object> responseMap = followService.toggleFollow(followingName, followerName);
        return ResponseEntity.ok().body(responseMap);
    }
}
