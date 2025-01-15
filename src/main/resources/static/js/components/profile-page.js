
import { fetchWithAuth } from "../util/api.js";
import initCreateFeedModal from "./create-feed-modal.js";
import initMoreMenu from "./more-menu.js";
import initSideBar from "./side-bar.js";

function getPageUsername(){
  const url = window.location.pathname;
  return url.substring(1);
}

// 프로필 페이지 상단부 렌더링 
async function initProfileHeader(){
  //해당 페이지 사용자이름 url에서 추출
  const username = getPageUsername();

  //서버에서 프로필 헤더 정보 요청하기
  const response = await fetchWithAuth(`/api/profiles/${username}`);
  const profileHeader = await response.json();

  //렌더링
  renderProfileHeader(profileHeader);
  
}

// 프로필 헤더 렌더링하기
function renderProfileHeader({ feedCount, name, username, profileImageUrl }) {
  // 프로필 이미지 업데이트
  document.querySelector('.profile-image-container .profile-image img').src =
    profileImageUrl ?? '/images/default-profile.svg';

  // 사용자명 업데이트
  document.querySelector('.profile-actions .username').textContent = username;

  // 실명 업데이트
  document.querySelector('.profile-bio .full-name').textContent = name;

  // 게시물 수 업데이트
  document.querySelector(
    '.profile-stats li:first-child .stats-number'
  ).textContent = feedCount;
}

document.addEventListener('DOMContentLoaded',()=>{

  // 인덱스 페이지와 공통처리
  initCreateFeedModal();  //피드 생성관련 js
  initMoreMenu(); // 더보기 버튼 클릭 관련 js
  initSideBar();  // 사이드바 관련
  
  //프로필 페이지 개별 처리
  initProfileHeader(); // 프로필 페이지 헤더 관련
  
});