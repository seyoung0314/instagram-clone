package com.example.instagramclone.domain.member.dto.response;

import com.example.instagramclone.domain.member.entity.Member;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
// index 페이지의 우측상단 suggestion 쪽 렌더링 json
public class MeResponse {

    private String username;
    private String name;
    private String profileImageUrl;

    public static MeResponse from(Member member){
        return MeResponse.builder()
                .name(member.getName())
                .username(member.getUsername())
                .profileImageUrl(member.getProfileImageUrl())
                .build();
    }
}
