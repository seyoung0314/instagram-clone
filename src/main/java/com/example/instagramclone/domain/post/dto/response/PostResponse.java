package com.example.instagramclone.domain.post.dto.response;

import com.example.instagramclone.domain.like.dto.response.LikeStatusResponse;
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
    private String username;
    private String profileImageUrl;
    private List<PostImageResponse> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 좋아요 상태 데이터
    private LikeStatusResponse likeStatus;

    // 댓글 갯수
    private long commentCount;

    //entity를 주면 dto로 변환
    public static PostResponse of(Post feed, LikeStatusResponse likeStatusResponse, long commentCount) {
        return PostResponse.builder()
                .id(feed.getId())
                .username(feed.getMember().getUsername())
                .profileImageUrl(feed.getMember().getProfileImageUrl())
                .content(feed.getContent())
                .images(
                        feed.getImages()
                                .stream()
                                .map(PostImageResponse::from)
                                .collect(Collectors.toList())
                )
                .createdAt(feed.getCreatedAt())
                .updatedAt(feed.getUpdatedAt())
                .likeStatus(likeStatusResponse)
                .commentCount(commentCount)
                .build();
    }
}
