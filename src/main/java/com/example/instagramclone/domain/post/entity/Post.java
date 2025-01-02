package com.example.instagramclone.domain.post.entity;


import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Builder
public class Post {
    private Long id;          // id 필드 (BIGINT)
    private String content;   // content 필드 (TEXT)
    private String writer;    // writer 필드 (VARCHAR(100))
    private int viewCount;    // view_count 필드 (INT)
    private LocalDateTime createdAt;  // created_at 필드
    private LocalDateTime updatedAt;  // updated_at 필드
}
