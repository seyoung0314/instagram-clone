package com.example.instagramclone.service;

import com.example.instagramclone.domain.member.dto.SignUpRequest;
import com.example.instagramclone.domain.member.dto.response.DuplicateCheckResponse;
import com.example.instagramclone.domain.member.entity.Member;
import com.example.instagramclone.exception.ErrorCode;
import com.example.instagramclone.exception.MemberException;
import com.example.instagramclone.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Slf4j
@Transactional // 트랜잭션 처리
@RequiredArgsConstructor
public class MemberService {

    //패스워드 암호화
    private final PasswordEncoder passwordEncoder;
    private final MemberRepository memberRepository;

    //회원가입 중간처리
    public void signup(SignUpRequest signUpRequest) {

        /*
            Race condition 방지
            사용자가 중복체크 후 회원가입 버튼을 누르기 전까지의 시간동안
            다른 사용자가 같은값으로 가입랄 수 있음
            이를 최종 회원가입에서 한번 더 검사하여 방지
         */

        String emailOrPhone = signUpRequest.getEmailOrPhone();
        if(emailOrPhone.contains("@")){
            memberRepository.findByEmail(emailOrPhone)
                    .ifPresent(m-> {
                        throw new MemberException(ErrorCode.DUPLICATE_EMAIL);
                    });
        }else{
            memberRepository.findByPhone(emailOrPhone)
                    .ifPresent(m-> {
                        throw new MemberException(ErrorCode.DUPLICATE_PHONE);
                    });
        }
        memberRepository.findByUsername(signUpRequest.getUsername())
                .ifPresent(m-> {
                    throw new MemberException(ErrorCode.DUPLICATE_USERNAME);
                });

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

    /**
     * 중복 검사 통합 처리 (이메일, 전화번호, 유저네임)
     *
     * @param type  - 검사랄 값의 타입(email,phone,usename)
     * @param value - 중복 검사할 값
     */
    public DuplicateCheckResponse checkDuplicate(String type, String value) {
        switch (type) {
            case "email":
                // 중복된 경우를 클라이언트에게 알려야함
                return memberRepository.findByEmail(value)
                        .map(member -> DuplicateCheckResponse.unavailable("이미 사용중인 이메일입니다.")) // null이 아닌 경우
                        .orElse(DuplicateCheckResponse.available());// null인 경우
            case "phone":
                return memberRepository.findByPhone(value.replaceAll("[^0-9]", ""))
                        .map(member -> DuplicateCheckResponse.unavailable("이미 사용중인 전화번호입니다.")) // null이 아닌 경우
                        .orElse(DuplicateCheckResponse.available());// null인 경우;
            case "username":
                return memberRepository.findByUsername(value)
                        .map(member -> DuplicateCheckResponse.unavailable("이미 사용중인 이름입니다.")) // null이 아닌 경우
                        .orElse(DuplicateCheckResponse.available());// null인 경우;
            default:
                throw new MemberException(ErrorCode.INVALID_SIGNUP_DATA);

        }
    }
}
