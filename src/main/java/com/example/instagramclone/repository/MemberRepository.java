package com.example.instagramclone.repository;

import com.example.instagramclone.domain.member.entity.Member;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface MemberRepository {

    //회원정보 생성 (회원가입)
    void insert(Member member);

    //중복체크용 조회 메서드
    Optional<Member> findByEmail(String email);
    Optional<Member> findByPhone(String phone);
    Optional<Member> findByUsername(String username);

    // 프로필 사진 수정 메서드
    void updateProfileImage(
            @Param("imageUrl")String imageUrl, 
            @Param("username") String username);

    // 검색어 기반 회원 검색
    List<Member> searchMembers(String keyword);

    //  추천할 사용자 목록 조회 (팔로우하지 않은 사용자 중)
    List<Member> findMembersToSuggest(
            @Param("currentUserId") Long currentUserId,
            @Param("limit") int limit
    );
}
