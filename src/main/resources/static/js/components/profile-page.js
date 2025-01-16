import { fetchWithAuth } from "../util/api.js";
import initCreateFeedModal from "./create-feed-modal.js";
import initMoreMenu from "./more-menu.js";
import initSideBar from "./side-bar.js";
import { getCurrentUser } from "../util/auth.js";
import initFeedDetailModal from "./feed-detail-modal.js";

const $profileImageContainer = document.querySelector(
  ".profile-image-container"
);

function getPageUsername() {
  const url = window.location.pathname;
  return url.substring(1);
}

// 프로필 페이지 상단부 렌더링
async function initProfileHeader() {
  //해당 페이지 사용자이름 url에서 추출
  const username = getPageUsername();

  //서버에서 프로필 헤더 정보 요청하기
  const response = await fetchWithAuth(`/api/profiles/${username}`);
  const profileHeader = await response.json();

  console.log(profileHeader);

  //렌더링
  renderProfileHeader(profileHeader);
}

// 현재 페이지가 들어온 사람이 본인인지 확인
async function isUserMatched() {
  const pageUsername = getPageUsername();
  const loggedInUser = await getCurrentUser();
  return pageUsername === loggedInUser.username;
}

// 프로필 헤더 렌더링하기
async function renderProfileHeader({
  feedCount,
  name,
  username,
  profileImageUrl,
}) {
  // 프로필 이미지 업데이트
  document.querySelector(".profile-image-container .profile-image img").src =
    profileImageUrl ?? "/images/default-profile.svg";

  // 사용자명 업데이트
  document.querySelector(".profile-actions .username").textContent = username;

  // 실명 업데이트
  document.querySelector(".profile-bio .full-name").textContent = name;

  // 게시물 수 업데이트
  document.querySelector(
    ".profile-stats li:first-child .stats-number"
  ).textContent = feedCount;

  // 본인 페이지인지 확인
  const match = await isUserMatched();

  // 버튼 영역 렌더링
  const $actionButtonsContainer = document.querySelector(".action-buttons");
  $actionButtonsContainer.innerHTML = "";

  const $naviBookMark = document.querySelector(".profile-nav a:nth-child(3)");

  if (match) {
    // 본인 프로필인 경우
    $actionButtonsContainer.innerHTML = `
              <button class="profile-edit-button">프로필 편집</button>
              <button class="settings-button">
                  <i class="fa-solid fa-gear"></i>
              </button>
          `;

    $naviBookMark.style.display = "block";
  } else {
    // 타인 프로필인 경우
    $actionButtonsContainer.innerHTML = `
              <button class="follow-button">팔로우</button>
              <button class="message-button">메시지 보내기</button>
          `;

    $naviBookMark.style.display = "none";
  }
}

function renderProfileFeeds(feedList) {
  const $gridContainer = document.querySelector(".posts-grid");

  // 그리드 아이템 HTML 생성
  $gridContainer.innerHTML = feedList
    .map(
      (feed) => `
            <div class="grid-item" data-post-id="${feed.id}">
                <img src="${feed.mainThumbnail}" alt="게시물 이미지">
                <div class="grid-item-overlay">
                    <div class="grid-item-stats">
                        <span>
                            <i class="fa-solid fa-heart"></i> ${feed.likeCount}
                        </span>
                        <span>
                            <i class="fa-solid fa-comment"></i> ${feed.commentCount}
                        </span>
                    </div>
                </div>
            </div>
        `
    )
    .join("");
}

// 프로필 페이지 피드 목록 렌더링
async function initProfileFeeds() {
  const username = getPageUsername();
  const response = await fetchWithAuth(`api/profiles/${username}/posts`);

  if (!response.ok) {
    alert("실패");
  }
  const feedList = await response.json();

  // 피드 렌더링 업데이트
  renderProfileFeeds(feedList);
}

async function handleProfileImage(e) {
  // console.log("file selected : ", e.target);

  if (!e.target.files.length) return;

  const uploadProfileImage = e.target.files[0];

  // 파일 유효성 검사
  if (!uploadProfileImage.type.startsWith("image/")) {
    alert("이미지 파일만 업로드 가능합니다.");
    return;
  }

  if (uploadProfileImage.size > 10 * 1024 * 1024) {
    // 2MB
    alert("파일 크기는 10MB 이하여야 합니다.");
    return;
  }

  const formData = new FormData();
  formData.append("profileImage", uploadProfileImage);

  // 서버에 프로필 이미지 전송
  const response = await fetchWithAuth(`/api/profiles/profile-image`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    alert("프로필 사진 업로드 실패");
    return;
  }

  const { imageUrl } = await response.json();

  const $img = $profileImageContainer.querySelector("img");
  $img.src = imageUrl;
  location.reload();

}

async function initChangeProfileImage() {
  const $fileInput = document.querySelector("input[name=profileImage]");

  //본인만 변경가능하게
  const match = await isUserMatched();

  if (!match) {
    $profileImageContainer.querySelector(".profile-image").style.cursor =
      "default";
    $fileInput.disabled = true;
    return;
  }

  $profileImageContainer.addEventListener("click", () => {
    $fileInput.click();
  });

  // 파일 선택 완료 시 서버로 프로필 이미지 전송
  $fileInput.addEventListener("change", handleProfileImage);
}

document.addEventListener("DOMContentLoaded", () => {
  // 인덱스 페이지와 공통처리
  initCreateFeedModal(); //피드 생성관련 js
  initMoreMenu(); // 더보기 버튼 클릭 관련 js
  initSideBar(); // 사이드바 관련

  //프로필 페이지 개별 처리
  initProfileHeader(); // 프로필 페이지 헤더 관련
  initProfileFeeds(); // 프로필 페이지 피드 관련
  initChangeProfileImage(); // 프로필 이미지 변경 관련

  initFeedDetailModal(); // 포스트 상세보기 관련
});
