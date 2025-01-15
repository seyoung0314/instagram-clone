
import initCreateFeedModal from "./create-feed-modal.js";
import initMoreMenu from "./more-menu.js";
import initSideBar from "./side-bar.js";

document.addEventListener('DOMContentLoaded',()=>{
  initCreateFeedModal();  //피드 생성관련 js
  initMoreMenu(); // 더보기 버튼 클릭 관련 js
  initSideBar();  // 사이드바 관련

  console.log("프로필 페이지 스크립트");
  
});