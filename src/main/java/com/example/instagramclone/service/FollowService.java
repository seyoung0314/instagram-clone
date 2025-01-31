package com.example.instagramclone.service;

import com.example.instagramclone.domain.follow.dto.response.FollowResponse;
import com.example.instagramclone.domain.follow.dto.response.FollowStatus;
import com.example.instagramclone.domain.follow.entity.Follow;
import com.example.instagramclone.domain.member.entity.Member;
import com.example.instagramclone.exception.ErrorCode;
import com.example.instagramclone.exception.MemberException;
import com.example.instagramclone.repository.FollowRepository;
import com.example.instagramclone.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

import static com.example.instagramclone.domain.follow.dto.response.FollowStatus.FOLLOWER;
import static com.example.instagramclone.domain.follow.dto.response.FollowStatus.FOLLOWING;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final MemberRepository memberRepository;

    // 팔로우 언팔로우 토글
    public Map<String, Object> toggleFollow(String followingUserName, String followerUserName) {

        // 팔로잉한 회원정보와 팔로우 당한 회원정보 조회
        Member following = getMember(followingUserName);
        Member follower = getMember(followerUserName);

        Long followerId = follower.getId();
        Long followingId = following.getId();

        // 자기 자신을 팔로우하는 것을 방지
        if (followerId.equals(followingId)) {
            throw new MemberException(ErrorCode.SELF_FOLLOW);
        }

        // 팔로우 여부 확인
        boolean idFollow = followRepository.doesFollowExist(followerId, followingId);

        if (idFollow) { //  이미 팔로우 한 상태
            //언팔로우
            followRepository.delete(followerId, followingId);
        } else {  // 아직 팔로우 안한 상태
            followRepository.insert(Follow.builder()
                    .followerId(followerId)
                    .followingId(followingId)
                    .build());
        }
        // 팔로우 완료 시 응답할 데이터
        return Map.of("following", !idFollow
               ,"followerCount", followRepository.countFollowByType(followerId, "follower"));
    }

    private Member getMember(String userName) {
        return memberRepository.findByUsername(userName).orElseThrow(
                () -> new MemberException(ErrorCode.MEMBER_NOT_FOUND)
        );
    }


    // 특정 유저의 팔로잉 / 팔로워 목록 조회
    @Transactional(readOnly = true)
    public List<FollowResponse> getFollows(String targetUsername, String loginUsername, FollowStatus type) {
        Member foundMember = getMember(targetUsername);
        Member loginMember = getMember(loginUsername);
        if (type == FOLLOWER) {
            return followRepository.findFollowList(foundMember.getId(), FOLLOWER.name().toLowerCase())
                    .stream()
                    .map(follow -> FollowResponse.of(
                            follow
                            , followRepository.doesFollowExist(follow.getFollowing().getId(), loginMember.getId())
                            , FOLLOWER
                    ))
                    .collect(Collectors.toList());
        } else {
            return followRepository.findFollowList(foundMember.getId(), FOLLOWING.name().toLowerCase())
                    .stream()
                    .map(follow -> FollowResponse.of(
                            follow
                            , followRepository.doesFollowExist(follow.getFollower().getId(), loginMember.getId())
                            , FOLLOWING
                    ))
                    .collect(Collectors.toList());
        }
    }

}
