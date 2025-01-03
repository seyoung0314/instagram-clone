package com.example.instagramclone.domain.post.dto.response;

import com.example.instagramclone.domain.post.entity.PostImage;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Builder
public class PostImageResponse {
    @JsonProperty("image_id")
    private Long id;
    private String imageUrl;
    private int imageOrder;

    //entity를 주면 dto로 변환
    public static PostImageResponse from(PostImage postImage) {
        return PostImageResponse.builder()
                .id(postImage.getId())
                .imageUrl(postImage.getImageUrl())
                .imageOrder(postImage.getImageOrder())
                .build();
    }
}
