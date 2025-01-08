package com.example.instagramclone.repository;

import com.example.instagramclone.domain.member.entity.Member;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberRepository {

    //회원정보 생성 (회원가입)
    void insert(Member member);
}
