package com.example.instagramclone.domain.hashtag.dto.response;

import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Builder
public class HashtagSearchResponse {
    private String hashtag;
    private int feedCount;
}
