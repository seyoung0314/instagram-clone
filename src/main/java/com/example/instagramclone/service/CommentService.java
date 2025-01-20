package com.example.instagramclone.service;

import com.example.instagramclone.domain.comment.dto.response.CommentResponse;
import com.example.instagramclone.domain.comment.entity.Comment;
import com.example.instagramclone.domain.member.entity.Member;
import com.example.instagramclone.domain.post.entity.Post;
import com.example.instagramclone.repository.CommentRepository;
import com.example.instagramclone.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;

    // 댓글 작성 처리
    public Map<String, Object> createComment(Long postId, String username, String content){

        Member foundMember = memberRepository.findByUsername(username)
                .orElseThrow();

        Comment newComment = Comment.of(
                postId, foundMember.getId(), content);

        commentRepository.insert(newComment);

        // 댓글 작성 시 댓글정보와 댓글 수 리턴
        Comment foundComment = commentRepository.findById(newComment.getId()).orElseThrow();

        return Map.of("comment", CommentResponse.from(foundComment)
                      ,"commentCount",commentRepository.countByPostId(postId));
    }
}
