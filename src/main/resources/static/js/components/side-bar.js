import { getCurrentUser } from "../util/auth.js";

// 사이드바의 프로필 영역 처리
async function renderSideBarProfile(){

  const {username, profileImageUrl } = await getCurrentUser();
  const $profileItem = document.querySelector(".profile-item");

  //프로필 사진 렌더링
  const $profileImg = $profileItem.querySelector(".profile-image img");
  $profileImg.scr = profileImageUrl || '/image/default-profile.svg';
  $profileImg.alt = `${username}님의 프로필사진진`


  //프로필 링크 걸기
  $profileItem.setAttribute('href',`/${username}`);
}


function initSideBar(){
  renderSideBarProfile();
}
export default initSideBar;