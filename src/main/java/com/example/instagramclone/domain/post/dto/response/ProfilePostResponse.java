package com.example.instagramclone.domain.post.dto.response;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Builder
// 프로필 페이지에 3열 피드 레이아웃 렌더링을 위한 데이터
public class ProfilePostResponse {

    //Long 은 기본값이 null long 은 0
    private Long id;    // 상세보기때 사용할 id값
    private String mainThumbnail;  // 피드 썸네일
    private long likeCount; // 좋아요 수
    private long commentCount;  // 댓글 수
}
