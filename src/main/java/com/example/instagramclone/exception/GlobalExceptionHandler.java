package com.example.instagramclone.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

//API 에서 발생한 모든 에러들을 모아서 일괄 처리
@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    private ErrorResponse createErrorResponse
    (Exception e, HttpServletRequest request, HttpStatus status, String errorMessage) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.name())
                .message(errorMessage != null ? errorMessage : e.getMessage())
                .path(request.getRequestURI())
                .build();
    }

    //알 수 없는 에러들을 일괄 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception e, HttpServletRequest request){
        log.error("Unexpected error occurred: {}",e.getMessage(),e);

        ErrorResponse response = createErrorResponse
                (e, request, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_SERVER_ERROR.getMessage());

        return ResponseEntity
                .status(ErrorCode.INTERNAL_SERVER_ERROR.getStatus())
                .body(response);
    }

    // 입력값 검증 예외처리
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException e, HttpServletRequest request) {
        log.error("Validation error occurred: {}", e.getMessage(), e);

        String errorMessage = e.getBindingResult()
                .getFieldErrors()
                .get(0)
                .getDefaultMessage();

        ErrorResponse response = createErrorResponse
                (e, request, HttpStatus.BAD_REQUEST, errorMessage);

        return ResponseEntity
                .status(e.getStatusCode())
                .body(response);
    }

    // 피드 관련 예외처리
    @ExceptionHandler(PostException.class)
    public ResponseEntity<?> handlePostException(PostException e, HttpServletRequest request) {
        log.error("PostException occurred: {}", e.getMessage(), e);

        ErrorResponse response = createErrorResponse
                (e, request, e.getErrorCode().getStatus(), e.getMessage());

        return ResponseEntity
                .status(e.getErrorCode().getStatus())
                .body(response);
    }

}
