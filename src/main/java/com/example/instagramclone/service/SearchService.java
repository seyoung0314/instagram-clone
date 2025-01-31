package com.example.instagramclone.service;

import com.example.instagramclone.domain.member.entity.Member;
import com.example.instagramclone.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class SearchService {
    private final MemberRepository memberRepository;

    // 사용자 검색 기능
    @Transactional(readOnly = true)
    public void searchMembers(String keyword){
        // 검색어를 통한 조회
        List<Member> members = memberRepository.searchMember(keyword);

    }

}
