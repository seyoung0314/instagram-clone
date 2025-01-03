package com.example.instagramclone.controller.rest;

import com.example.instagramclone.domain.post.dto.request.PostCreate;
import com.example.instagramclone.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@Slf4j
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    //피드 생성 요청
    @PostMapping
    public ResponseEntity<?> createFeed(
            // 피드 내용, 작성자 이름 (json) {"writer":"", "content":""} -> 검증
            // 이미지 파일 목록 (multipart-file)
            @RequestPart("feed") @Valid PostCreate postCreate
            ,@RequestPart("images") List<MultipartFile> images
            ) {
        log.info("============= : {}",postCreate);

        images.forEach(image -> {
            log.info("===============image {}", image.getOriginalFilename());
        });

        postCreate.setImages(images);

        // 이미지와 JSON을 서비스클래스로 전송
        Long postId = postService.createFeed(postCreate);

        return ResponseEntity.ok()
                .body("success to create feed : id - " + postId);
    }
}
