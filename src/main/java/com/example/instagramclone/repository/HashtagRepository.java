package com.example.instagramclone.repository;
import com.example.instagramclone.domain.hashtag.dto.response.HashtagSearchResponse;
import com.example.instagramclone.domain.hashtag.entity.Hashtag;
import com.example.instagramclone.domain.hashtag.entity.PostHashtag;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface HashtagRepository {
    // 해시태그를 저장하는 기능
    void insertHashtag(Hashtag hashtag);
    // 피드와 해시태그를 연결저장하는 기능
    void insertPostHashtag(PostHashtag postHashtag);
    // 해시태그 하나를 단일조회하는 기능 - Optional 감싸기
    Optional<Hashtag> findByName(String name);
    // 해시태그 추천 목록 조회
    List<HashtagSearchResponse> searchHashtagByKeyword(String keyword);
}