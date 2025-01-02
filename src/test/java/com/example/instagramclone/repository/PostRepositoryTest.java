package com.example.instagramclone.repository;

import com.example.instagramclone.domain.post.entity.Post;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PostRepositoryTest {

    @Autowired
    PostRepository postRepository;

    // 테스트는 케이스별 메서드를 한개씩 만듬
    @Test
    // 테스트를 설명하는 이름 - 단언(Assertion)
    @DisplayName("피드의 내용을 2200자 내로 작성하면 피드가 반드시 생성된다.")
    void saveFeedTest(){
        //GWT 패턴
        //given - 테스트를 위해 주어지는 데이터
        Post givenPost = Post.builder()
                .content("테스트 컨텐츠 입니다.")
                .writer("admin")
                .build();

        //when - 실제 실행될 테스트 핵심코드
        postRepository.saveFeed(givenPost);

        //then - 테스트 검증(단언)
        Long postId = givenPost.getId();// 생성된 피드게시물의 id를 가져옴
        System.out.println("postId = " + postId);
    }
}