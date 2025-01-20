package com.example.instagramclone.domain.comment.dto.request;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.validator.constraints.NotBlank;

@Getter @Setter
@ToString
public class CommentCreateRequest {

    @NotBlank(message = "댓글을 써주세요")
    private String content;
}
