package com.example.instagramclone.domain.member;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Builder
public class Member {
    private Long id;
    private String username;
    private String password;
    private String email;
    private String phone;
    private String name;
    private String profileImageUrl;
    private String role;
    private String refreshToken;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;

}
