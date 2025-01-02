package com.example.instagramclone.exception;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
// 에러 발생 시 클라이언트에게 전송할 구체적인 데이터(json)
public class ErrorResponse {

    private final LocalDateTime timestamp;  //발생시간
    private final int status;   //상태코드
    private final String error; //에러 이름
    private final String message;   //원인 메세지
    private final String path;  //발생경로
}