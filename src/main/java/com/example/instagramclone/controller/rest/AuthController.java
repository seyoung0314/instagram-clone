package com.example.instagramclone.controller.rest;

import com.example.instagramclone.domain.member.dto.SignUpRequest;
import com.example.instagramclone.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signUp(
            @RequestBody @Valid SignUpRequest signUpRequest){
        log.info("request for signup: {}",signUpRequest.getUsername());
        memberService.signup(signUpRequest);
        return ResponseEntity
                .ok()
                .body(Map.of(
                        "message","회원가입이 완료되었습니다.",
                        "username",signUpRequest.getUsername()
                ));
    }
}
