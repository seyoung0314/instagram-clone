package com.example.instagramclone.controller.rest;

import com.example.instagramclone.domain.member.dto.response.MeResponse;
import com.example.instagramclone.domain.member.dto.response.ProfileHeaderResponse;
import com.example.instagramclone.domain.post.dto.response.ProfilePostResponse;
import com.example.instagramclone.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/profiles")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {
    private final ProfileService profileService;

    //로그인한 유저의 프로필 정보를 갖다주는 API
    @GetMapping("/me")
    public ResponseEntity<MeResponse> getCurrentUser(
            @AuthenticationPrincipal String username
    ) {
        MeResponse responseDto = profileService.getLoggedInUser(username);

        return ResponseEntity.ok().body(responseDto);
    }

    // 사용자 프로필 페이지 헤더 데이터를 전송하는 api
    @GetMapping("/{username}")
    public ResponseEntity<ProfileHeaderResponse> getProfileHeader(
            @PathVariable String username
    ) {
        ProfileHeaderResponse responseData = profileService.getProfileHeader(username);

        return ResponseEntity.ok().body(responseData);

    }

    // 사용자 프로필 페이지 헤더 데이터를 전송하는 api
    @GetMapping("/{username}/posts")
    public ResponseEntity<List<ProfilePostResponse>> getProfilePost(
            @PathVariable String username
    ) {
        List<ProfilePostResponse> profilePosts = profileService.findProfilePosts(username);

        return ResponseEntity.ok().body(profilePosts);

    }

    // 프로필 사진 업로드 api
    @PutMapping("/profile-image")
    public ResponseEntity<?> updateProfile(
            @RequestParam MultipartFile profileImage,
            @AuthenticationPrincipal String username
    ) {
        String imageUrl = profileService.updateProfileImage(profileImage, username);

        return ResponseEntity.ok().body(Map.of(
                "imgaeUrl", imageUrl,
                "message", "image upload success"
        ));
    }

}
