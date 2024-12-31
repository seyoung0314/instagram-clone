//피드 생성 모달을 전역관리
let $modal = null;

// 피드 생성 모달 간련 이벤트 함수
function setUpModalEvents(){
  $modal = document.getElementById("createPostModal");

  // 모달 열기 함수
  const openModal = (e) => {
    e.preventDefault();
    //모달 열기
    $modal.style.display = "flex";
  };

  //피드 생성 모달 열기 이벤트
  document
    .querySelector(".fa-square-plus")
    .closest(".menu-item")
    .addEventListener("click", openModal);
}

// 이벤트 바인딩 관련 함수
function bindEvents(){
  setUpModalEvents();
}

//모달 관련 js 함수 - 외부에 노출
function initCreateFeedModal() {
  bindEvents();
}

export default initCreateFeedModal();
