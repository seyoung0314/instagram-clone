package com.example.instagramclone.domain.like.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LikeStatusResponse {
    private boolean liked; // true : 좋아요 ,  false : 취소
    private long likeCount; // 피드의 좋아요 갯수

    public static LikeStatusResponse of(boolean liked
            , long likeCount) {
        return LikeStatusResponse.builder()
                .liked(liked)
                .likeCount(likeCount)
                .build();
    }
}
