package com.example.instagramclone.domain.post.dto.response;

import com.example.instagramclone.domain.post.entity.Post;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Builder
public class PostResponse {
    @JsonProperty("feed_id")
    private Long id;
    private String content;
    private String writer;
    private List<PostImageResponse> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    //entity를 주면 dto로 변환
    public static PostResponse from(Post feed) {
        return PostResponse.builder()
                .id(feed.getId())
                .content(feed.getContent())
                .images(
                        feed.getImages()
                                .stream()
                                .map(PostImageResponse::from)
                                .collect(Collectors.toList())
                )
                .createdAt(feed.getCreatedAt())
                .updatedAt(feed.getUpdatedAt())
                .build();
    }
}
