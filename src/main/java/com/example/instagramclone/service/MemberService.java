package com.example.instagramclone.service;

import com.example.instagramclone.domain.member.dto.SignUpRequest;
import com.example.instagramclone.domain.member.entity.Member;
import com.example.instagramclone.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@Transactional // 트랜잭션 처리
@RequiredArgsConstructor
public class MemberService {

    //패스워드 암호화
    private final PasswordEncoder passwordEncoder;
    private final MemberRepository memberRepository;

    //회원가입 중간처리
    public void signup(SignUpRequest signUpRequest){

        // 숩수 비밀번호를 꺼내서 암호화
        String rawPassword = signUpRequest.getPassword();
        String encodedPassword = passwordEncoder.encode(rawPassword);

        //회원정보를 데이터베이스에 저장
        Member newMember = signUpRequest.toEntity();

        //암호화된 pw로 교체
        newMember.setPassword(encodedPassword);

        // Db로 전송
        memberRepository.insert(newMember);

    }
}
