package com.example.instagramclone.domain.follow.dto.response;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Builder
public class FollowStatusResponse {
private boolean following;
private long followerCount;
private long followingCount;

public static FollowStatusResponse of(boolean following, long followerCount, long followingCount){
    return FollowStatusResponse.builder()
            .following(following)
            .followerCount(followerCount)
            .followingCount(followingCount)
            .build();
}


}
