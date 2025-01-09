package com.example.instagramclone.controller.rest;

import com.example.instagramclone.domain.member.dto.SignUpRequest;
import com.example.instagramclone.domain.member.dto.response.DuplicateCheckResponse;
import com.example.instagramclone.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    // 중복확인을 검사하는 api
    @GetMapping("/check-duplicate")
    public ResponseEntity<?> checkDuplicate(
            @RequestParam String type,
            @RequestParam String value
    ){
        log.info("check duplicate type:{},value:{}",type,value);
        DuplicateCheckResponse responsedto = memberService.checkDuplicate(type, value);
        return ResponseEntity.ok().body(responsedto);
    }
}
