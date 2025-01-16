package com.example.instagramclone.repository;

import com.example.instagramclone.domain.member.entity.Member;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

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
}
