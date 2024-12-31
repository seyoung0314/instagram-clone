//피드 생성 모달을 전역관리
let $modal = document.getElementById("createPostModal");

//모달 관련 dom들을 저장할 객체
let element = {
  $closeBtn: $modal.querySelector(".modal-close-button"),
  $backdrop: $modal.querySelector(".modal-backdrop"),
  $uploadBtn: $modal.querySelector(".upload-button"),
  $fileInput: $modal.querySelector("#fileInput"),
};

// 파일 업로드 관련 이벤트 함수
function setUpFileUploadEvents() {
  const { $uploadBtn, $fileInput } = element;

  // 업로드 버튼을 누르면 숨겨져 있던 파일 선택창이 눌리도록 조작
  $uploadBtn.addEventListener("click", (e) => {
    $fileInput.click();
  });

  // 파일 선택이 끝났을 때 파일정보를 읽는 이벤트
  $fileInput.addEventListener('change', e =>{
    console.log(e.target.files);
  })
}

// 피드 생성 모달 관련 이벤트 함수
function setUpModalEvents() {
  const { $closeBtn, $backdrop } = element;

  // 모달 열기 함수
  const openModal = (e) => {
    e.preventDefault();
    //모달 열기
    $modal.style.display = "flex";
    //배경 바디 스크롤 방지
    document.body.style.overflow = "hidden";
  };

  // 모달 닫기 함수
  const closeModal = (e) => {
    e.preventDefault();
    //모달 닫기
    $modal.style.display = "none";
    document.body.style.overflow = "auto";
  };

  //피드 생성 모달 열기 이벤트
  document
    .querySelector(".fa-square-plus")
    .closest(".menu-item")
    .addEventListener("click", openModal);

  // x버튼 눌렀을 때
  $closeBtn.addEventListener("click", closeModal);

  // 배경 눌렀을 때
  $backdrop.addEventListener("click", closeModal);
}

// 이벤트 바인딩 관련 함수
function bindEvents() {
  setUpModalEvents();
  setUpFileUploadEvents();
}

//모달 관련 js 함수 - 외부에 노출
function initCreateFeedModal() {
  bindEvents();
}

export default initCreateFeedModal();
