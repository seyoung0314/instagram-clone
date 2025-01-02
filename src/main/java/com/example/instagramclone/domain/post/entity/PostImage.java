package com.example.instagramclone.domain.post.entity;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Builder
public class PostImage {

    private Long id;             // id 필드 (BIGINT)
    private Long postId;         // post_id 필드 (BIGINT, 외래 키)
    private String imageUrl;     // image_url 필드 (VARCHAR(255))
    private int imageOrder;      // image_order 필드 (INT)
    private LocalDateTime createdAt; // created_at 필드
}
