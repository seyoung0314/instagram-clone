import { fetchWithAuth } from "../util/api.js";
import CarouselManager from "../ui/CarouselManager.js";
import HashtagSearch from "../ui/HashtagSearch.js";

//step 모듈내에서 전역관리
let currentStep = 1;

let step2Carousel = null;
let step3Carousel = null;

// 선택한 이미지 파일들을 전역관리
let selectedFiles = null;

//피드 생성 모달을 전역관리
let $modal = document.getElementById("createPostModal");

//모달 관련 dom들을 저장할 객체
let element = {
  $closeBtn: $modal.querySelector(".modal-close-button"),
  $backdrop: $modal.querySelector(".modal-backdrop"),
  $uploadBtn: $modal.querySelector(".upload-button"),
  $fileInput: $modal.querySelector("#fileInput"),
  $backStepBtn: $modal.querySelector(".back-button"),
  $nextStepBtn: $modal.querySelector(".next-button"),
  $modalTitle: $modal.querySelector(".modal-title"),
  $uploadArea: $modal.querySelector(".upload-area"),
  $contentTextarea: $modal.querySelector(".content-input textarea"),
  $charCounter: $modal.querySelector(".char-counter"),
  $nestedModal: $modal.querySelector(".nested-modal"),
  $deleteBtn: $modal.querySelector(".delete-button"),
  $cancelBtn: $modal.querySelector(".cancel-button"),
  $loadingSpinner: $modal.querySelector(".loading-spinner"),
};

// 로딩 스피너 처리
function setLoading(loading = false) {
  const { $loadingSpinner, $backStepBtn, $nextStepBtn } = element;
  $loadingSpinner.style.display = loading ? "block" : "none";
  $backStepBtn.style.visibility = loading ? "hidden" : "visible";
  $nextStepBtn.style.display = loading ? "none" : "block";
  $nextStepBtn.disabled = loading;
}

async function fetchFeed() {
  if (currentStep !== 3) return;

  const { $contentTextarea } = element;

  // 작성자이름과 피드 내용 전송
  const feedData = {
    writer: "web",
    content: $contentTextarea.value.trim(),
  };

  // JSON과 이미지를 같이 전송하려면 form-data가 필요함
  const formData = new FormData();
  // JSON 전송
  formData.append(
    "feed",
    new Blob([JSON.stringify(feedData)], {
      type: "application/json",
    })
  );

  // 이미지 전송
  selectedFiles.forEach((file) => {
    formData.append("images", file);
  });

  setLoading(true);

  setTimeout(async () => {
    // 서버에 POST요청 전송 (토큰 포함)
    const response = await fetchWithAuth("/api/posts", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      window.location.reload(); // 피드 새로고침
    } else {
      console.error("failed to request");
      alert(data.message);
    }
    setLoading(false);
  }, 1500);
}

// 모달 바디 스텝을 이동하는 함수
function goToStep(step) {
  if (step < 1 || step > 3) return;

  currentStep = step;

  const { $backStepBtn, $nextStepBtn, $modalTitle, $fileInput } = element;

  // active 클래스 포함 시 이동
  [...$modal.querySelectorAll(".step")].forEach(($step, index) => {
    // if ($step.classList.contains("active")) {
    //   $step.classList.remove("active");
    // }
    // if (step === index + 1) {
    //   $step.classList.add("active");
    // }

    //.toggle(,boolean) : true - 모두 추가 , false - 모두 제거
    $step.classList.toggle("active", step === index + 1);

    if (step === 1) {
      // 다음번 change이벤트 발동을 위해 초기화
      $fileInput.value = "";
      $nextStepBtn.style.display = "none";
      $backStepBtn.style.visibility = "hidden";
      $modalTitle.textContent = "새 게시물 만들기";
    } else if (step === 2) {
      $nextStepBtn.style.display = "block";
      $backStepBtn.style.visibility = "visible";
      $modalTitle.textContent = "편집";
      $nextStepBtn.textContent = "다음";
    } else if (step === 3) {
      $nextStepBtn.textContent = "공유하기";
      $modalTitle.textContent = "새 게시물 만들기";
    }
  });
}

// 파일 업로드 관련 이벤트 함수
function setUpFileUploadEvents() {
  const { $uploadBtn, $fileInput, $uploadArea } = element;

  // 파일을 검사하고 다음 단계로 이동하는 함수
  const handleFiles = (files) => {
    //파일의 개수가 10개가 넘는 지 검사
    if (files.length > 3) {
      alert("최대 3개의 파일만 선택 가능합니다.");
      return;
    }

    //파일이 10MB 이하의 이미지 파일인지 검증
    // console.log(files);
    const validFiles = files
      .filter((file) => {
        if (!file.type.startsWith("image")) {
          alert(`${file.name}은 이미지가 아닙니다.`);
          return false;
        }
        return true;
      })
      .filter((file) => {
        if (file.size > 10 * 1024 * 1024) {
          alert(`${file.name}은 10MB를 초과합니다.`);
          return false;
        }
        return true;
      });

    // 서버전송을 위해 전역변수에 저장
    selectedFiles = validFiles;

    //이미지 슬라이드 생성
    //기존 캐러셀이 없을 시에만 생성 (중복방지)
    if (!step2Carousel) {
      step2Carousel = new CarouselManager(
        $modal.querySelector(".preview-container")
      );
    }
    step2Carousel.init(validFiles);

    //이미지 슬라이드 생성
    if (!step3Carousel) {
      step3Carousel = new CarouselManager(
        $modal.querySelector(".write-container")
      );
    }
    step3Carousel.init(validFiles);

    // 모달 step2(이미지 슬라이드)로 이동
    goToStep(2);
  };

  // 업로드 버튼을 누르면 숨겨져 있던 파일 선택창이 눌리도록 조작
  $uploadBtn.addEventListener("click", (e) => {
    $fileInput.click();
  });

  // 파일 선택이 끝났을 때 파일정보를 읽는 이벤트
  $fileInput.addEventListener("change", (e) => {
    const files = [...e.target.files];
    if (files.length > 0) {
      handleFiles(files);
    }
  });

  // 파일 드래그앤드롭 이벤트
  // 드래그 영역에 진입 시
  $uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    $uploadArea.classList.add("dragover");
  });

  // 드래그 영역을 벗어났을 시
  $uploadArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    $uploadArea.classList.remove("dragover");
  });
  // 드래그 영역에 놓았을 시

  $uploadArea.addEventListener("drop", (e) => {
    e.preventDefault(); // 드롭했을 시 이미지 새탭이 열리거나 파일다운로드 방지

    //콘솔로그에서 안찍힘
    console.log(e);

    //파일정보 얻어오기
    const files = [...e.dataTransfer.files];
    //파일검증
    if (files.length > 0) handleFiles(files);
  });
}

// 피드 생성 모달 관련 이벤트 함수
function setUpModalEvents() {
  const { $closeBtn, $backdrop, $backStepBtn, $nextStepBtn, $nestedModal } =
    element;

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

    //step2,3 에선 닫기여부 모달 띄우기
    if (currentStep >= 2) {
      //중첩 모달 열기
      $nestedModal.style.display = "flex";
      return;
    }
    //모달 닫기
    $modal.style.display = "none";
    document.body.style.overflow = "auto";

    //모달 스텝 초기화
    goToStep(1);
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

  // 모달 이전,다음 버튼 클릭 이벤트
  $backStepBtn.addEventListener("click", () => goToStep(currentStep - 1));

  $nextStepBtn.addEventListener("click", () => {
    if (currentStep < 3) {
      goToStep(currentStep + 1);
    } else {
      alert("서버로 게시글 공유");
      fetchFeed(); // 서버로 전송
    }
  });
}

// 피드 내용 입력 이벤트
function setUpTextareaEvents() {
  const { $contentTextarea, $charCounter } = element;

  $contentTextarea.addEventListener("input", () => {
    const length = $contentTextarea.value.length;
    $charCounter.textContent = `${length.toString()} / 2,200`;

    if (length > 2200) {
      $charCounter.classList.add("exceed");
      $contentTextarea.value = $contentTextarea.value.slice(0, 2200);
    } else {
      $charCounter.classList.remove("exceed");
    }
  });
}

// 피드 모달 닫기 시 삭제/취소 관련
function setUpNestedModalEvents() {
  const { $nestedModal, $deleteBtn, $cancelBtn } = element;

  //취소버튼
  $cancelBtn.addEventListener("click", () => {
    $nestedModal.style.display = "none";
  });

  //삭제버튼
  $deleteBtn.addEventListener("click", () => {
    window.location.reload();
  });
}

// 해시태그 추천 처리
function setUpSuggestionHashtag() {
  // 해시태그 모듈을 분리해서 처리
  const hashtagSearch = new HashtagSearch(element.$contentTextarea);
  hashtagSearch.init();
}

// 이벤트 바인딩 관련 함수
function bindEvents() {
  setUpModalEvents(); //모달관련 이벤트
  setUpFileUploadEvents(); //파일업로드 관련 이벤트
  setUpTextareaEvents();
  setUpNestedModalEvents(); //중첩 모달 관련 이벤트트
  setUpSuggestionHashtag(); //해시태그 추천관련 이벤트
}

//모달 관련 js 함수 - 외부에 노출
function initCreateFeedModal() {
  bindEvents();
}

export default initCreateFeedModal;
