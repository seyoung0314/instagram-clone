package com.example.instagramclone.domain.post.dto.response;

import com.example.instagramclone.domain.comment.dto.response.CommentResponse;
import com.example.instagramclone.domain.follow.dto.FollowStatusResponse;
import com.example.instagramclone.domain.like.dto.response.LikeStatusResponse;
import com.example.instagramclone.domain.member.dto.response.MeResponse;
import com.example.instagramclone.domain.post.entity.Post;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Builder
public class PostDetailResponse {
    private Long postId; // 피드 id
    private String content; // 내용
    private LocalDateTime createdAt; // 작성시간

    // 회원 사용자이름, 프사
    private MeResponse user;

    // 피드 이미지 목록
    private List<PostImageResponse> images;

    // 졸아요 상태
    public LikeStatusResponse likeStatus;

    // 댓글 목록
    private List<CommentResponse> comments;

    public static PostDetailResponse of(
            Post post, LikeStatusResponse likeStatus, List<CommentResponse> comments) {
        return PostDetailResponse.builder()
                .postId(post.getId())
                .content(post.getContent())
                .createdAt(post.getCreatedAt())
                .user(MeResponse.from(post.getMember()))
                .images(post.getImages().stream().map(
                                PostImageResponse::from)
                        .collect(Collectors.toList()))
                .likeStatus(likeStatus)
                .comments(comments)
                .build();
    }
}
