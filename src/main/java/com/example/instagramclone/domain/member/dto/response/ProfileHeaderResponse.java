package com.example.instagramclone.domain.member.dto.response;

/*
    프로필 페이지 상단에 렌더링할 데이터들을 json으로 변환하는 클래스
    ( 프로필 사진, 사용자 이름, 이름, 피드 게시물 수 )
 */
import com.example.instagramclone.domain.follow.dto.FollowStatusResponse;
import com.example.instagramclone.domain.member.entity.Member;
import lombok.*;

@Getter
@Builder
public class ProfileHeaderResponse {
    private String profileImageUrl;
    private String username;
    private String name;
    private long feedCount;

    // 팔로우 상태
    private FollowStatusResponse followStatusResponse;

    // 정적 팩토리 메서드
    // 파라미터 1개면 from 2개이상이면 of로 짓는게 관례
    public static ProfileHeaderResponse of(Member member, long feedCount, FollowStatusResponse followStatusResponse){
        return ProfileHeaderResponse.builder()
                .profileImageUrl(member.getProfileImageUrl())
                .username(member.getUsername())
                .name(member.getName())
                .feedCount(feedCount)
                .followStatusResponse(followStatusResponse)
                .build();
    }
}
