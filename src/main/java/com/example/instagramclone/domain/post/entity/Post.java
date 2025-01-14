package com.example.instagramclone.domain.post.entity;


import com.example.instagramclone.domain.member.entity.Member;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Builder
public class Post {
    private Long id;          // id 필드 (BIGINT)
    private String content;   // content 필드 (TEXT)
    private Long memberId;    // memberId 필드 (BIGINT)
    private int viewCount;    // view_count 필드 (INT)
    private LocalDateTime createdAt;  // created_at 필드
    private LocalDateTime updatedAt;  // updated_at 필드
    private List<PostImage> images;

    // member 객체 포함
    private Member member;
}
