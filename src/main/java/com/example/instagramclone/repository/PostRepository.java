package com.example.instagramclone.repository;

import com.example.instagramclone.domain.post.dto.response.ProfilePostResponse;
import com.example.instagramclone.domain.post.entity.Post;
import com.example.instagramclone.domain.post.entity.PostImage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface PostRepository {

    // 피드 게시물 저장
    void saveFeed(Post post);

    // 피드 이미지 저장
    void saveFeedImage(PostImage postImage);

    // 특정 피드에 첨부된 이미지 목록을 조회
    List<PostImage> findImagesByPostId(Long postId);

    // 전체 피드 게시물 목록 조회
    List<Post> findAll(
            @Param("offset") int offset
            , @Param("limit") int limit);

    // 특정 사용자의 피드 개수를 조회
    long countByMemberId(Long memberId);

    // 특정 사용자의 프로필 페이지 전용 피드 목록 조회
    List<ProfilePostResponse> findProfilePosts(Long memberId);

    // 단일 피드 상세 조회
    Optional<Post> findPostDetailById(Long postId);
}
