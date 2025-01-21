import { fetchWithAuth } from "../util/api.js";
import { getPageUsername, isUserMatched } from "./profile-page.js";

// 서버에 팔로우 토글 요청 보내기
async function toggleFollow() {
  const pageUserName = getPageUsername();
  const response = await fetchWithAuth(`/api/follows/${pageUserName}`, {
    method: "POST",
  });
  if (!response.ok) {
    alert("실패");
  }
  const data = await response.json();

  return data;
}

function updateFollowButton($button,isFollowing){

  $button.className = isFollowing ? 'following-button' : 'follow-button';
  $button.innerHTML = isFollowing ? `팔로잉 <i class="fa-solid fa-chevron-down"></i>` : '팔로우';

  if (isFollowing) {
    // 마우스 오버 시 언팔로우로 텍스트 변경
    $button.onmouseover = () => {
      $button.innerHTML = '언팔로우';
      $button.classList.add('unfollow-hover');
    };

    $button.onmouseout = () => {
      $button.innerHTML = '팔로잉 <i class="fa-solid fa-chevron-down"></i>';
      $button.classList.remove('unfollow-hover');
    };
  } else {
    $button.onmouseover = null;
    $button.onmouseout = null;
  }

}

async function initFollowButton() {
  // 내페이지에서는 팔로우 처리 하지 않기
  if (await isUserMatched()) return;

  // 팔로우 버튼 이벤트 처리
  // 팔로우 토글 기능
  const $followButton = document.querySelector(".follow-button");
  
  $followButton.addEventListener("click", async (e) => {
    console.log("Dddd");

    const { following: isFollowing, followerCount } = await toggleFollow();

    // 해당 페이지 유저의 팔로우 수 갱신
    document.querySelector(".follower-count").textContent = followerCount;

    // 버튼 상태 업데이트
    updateFollowButton($followButton, isFollowing);
  });
}

// 팔로우 관련 종합 처리 (팔로우 버튼 토글, 팔로우 모달 등)
export async function initFollow() {
  await initFollowButton();
}
