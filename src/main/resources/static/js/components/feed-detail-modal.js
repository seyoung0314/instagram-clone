import CarouselManager from "../ui/CarouselManager.js";
import { fetchWithAuth } from "../util/api.js";
import { convertHashtagsToLinks, formatDate } from "./feed.js";
import PostLikeManager from "../ui/PostLikeManager.js";

const $modal = document.querySelector(".post-detail-modal");
const $backdrop = $modal.querySelector(".modal-backdrop");
const $closeButton = $modal.querySelector(".modal-close-button");
const $gridContainer = document.querySelector(".posts-grid");

//모달 닫기
async function closeModal() {
  //모달 디스플레이 변경
  $modal.style.display = "none";
  document.body.style.overflow = "hidden";
}

// 모달에 피드내용 렌더링
function renderModalContent({ postId, content, createdAt, user, images, likeStatus }) {

  // 모달이 렌더링될 때 현재 피드의 id를 모달태그에 발라놓음
  $modal.dataset.postId = postId;

  const { username, profileImageUrl } = user;
  const { liked, likeCount } = likeStatus;

  $modal.querySelectorAll('.post-username').forEach(($username) => {
    $username.textContent = username;
    $username.href = `/${username}`;
  });

  $modal.querySelectorAll('.post-profile-image img').forEach(($image) => {
    $image.src = profileImageUrl ?? '/images/default-profile.svg';
    $image.alt = `${username}님의 프로필 사진`;
  });

  $modal.querySelector('.post-caption').innerHTML =
    convertHashtagsToLinks(content);
  $modal.querySelector('.post-time').textContent = formatDate(createdAt);

  // 이미지 캐러셀 렌더링
  const $carouselContainer = $modal.querySelector('.modal-carousel-container');

  $carouselContainer.innerHTML = `
                            <div class="carousel-container">
                              <div class="carousel-track">
                                ${images
                                  .map(
                                    (image) =>
                                      `<img src="${image.imageUrl}" alt="피드 이미지 ${image.imageOrder}">`
                                  )
                                  .join('')}
                              </div>
                              ${
                                images.length > 1
                                  ? `
                                      <button class="carousel-prev">
                                        <i class="fa-solid fa-chevron-left"></i>
                                      </button>
                                      <button class="carousel-next">
                                        <i class="fa-solid fa-chevron-right"></i>
                                      </button>
                                      <div class="carousel-indicators">
                                        ${images
                                          .map(
                                            (_, index) =>
                                              `<span class="indicator ${
                                                index === 0 ? 'active' : ''
                                              }"></span>`
                                          )
                                          .join('')}
                                      </div>
                              `
                                  : ''
                              }
                           </div>`;
  
  // 캐러셀 만들기
  if (images.length > 1) {
    const carousel
      = new CarouselManager($carouselContainer);
    
    carousel.initWithImgTag([...$carouselContainer.querySelectorAll('img')]);
  }

  // 좋아요 렌더링 및 토글 처리
  const $likeButton = $modal.querySelector('.like-button');
  const $heartIcon = $modal.querySelector('.like-button i');
  const $likeCount = $modal.querySelector('.likes-count');

  $likeButton.classList.toggle('liked', liked);
  $heartIcon.className = liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
  $likeCount.textContent = likeCount;

  // 토글 처리
  new PostLikeManager($modal);
  
}


function findAdjacentPostIds(currentId) {
  // 현재 피드아이디를 기준으로 양 옆의 피드 id를 구해야함
  const $currentGrid = document.querySelector(
    `.grid-item[data-post-id="${currentId}"]`
  );
  const $prevGrid = $currentGrid.previousElementSibling;
  const $nextGrid = $currentGrid.nextElementSibling;

  const prevId = $prevGrid?.dataset.postId;
  const nextId = $nextGrid?.dataset.postId;

  return {
    prevId: prevId ? prevId : null,
    nextId: nextId ? nextId : null,
  };
}

// 이전, 다음 피드 버튼 업데이트
// (조건부 렌더링, 서버에 새로운 이미지 정보 요청)
function updateFeedNavigation(crrentId) {
  const $prevButton = $modal.querySelector(".modal-prev-button");
  const $nextButton = $modal.querySelector(".modal-next-button");

  // 현재 열려있는 피드 기준으로 이전, 다음 피드가 있는 지 확인하고
  // 존재한다면 해당 피드들의 id를 가져오도록 한다.
  const { prevId, nextId } = findAdjacentPostIds(crrentId);

  // 조건부 렌더링 처리 (현재 렌더링되어있는 피드가 첫피드인지 마지막피드인지? )
  if (prevId) {
    // 이전 버튼 처리
    $prevButton.style.visibility  = "visible";
    $prevButton.style.zIndex = "2";
    $prevButton.onclick = () => openModal(prevId);
  } else {
    $prevButton.style.visibility  = "hidden";
    $prevButton.style.zIndex = "-100";
  }

  if (nextId) {
    // 다음 버튼 처리
    $nextButton.style.visibility  = "visible";
    $nextButton.style.zIndex = "2";
    $nextButton.onclick = () => openModal(nextId);
  } else {
    $nextButton.style.visibility  = "hidden";
    $nextButton.style.zIndex = "-100";
  }
}

//모달 열기
async function openModal(postId) {
  // 서버에 데이터 요청
  const response = await fetchWithAuth(`/api/posts/${postId}`);

  if (!response.ok) {
    alert("피드 정보를 불러오지 못했습니다.");
    return;
  }

  const data = await response.json();

  // 화면에 렌더링
  renderModalContent(data);

  // 이전 다음 버튼 업데이트하기
  updateFeedNavigation(postId);

  //모달 디스플레이 변경
  $modal.style.display = "flex";
  document.body.style.overflow = "";
}

// 키보드 네비게이션
function handleKeyPress(e) {

  if($modal.style.display === "none") return;
  const currentPostId = $modal.dataset.postId;
  if ($modal.style.display === 'none') return;

  const {prevId, nextId} = findAdjacentPostIds(currentPostId);

  if (prevId && e.key === 'ArrowLeft') {
    openModal(prevId);
  } else if (nextId && e.key === 'ArrowRight') {
    openModal(nextId);
  } else if (e.key === 'Escape') {
    closeModal();
  }
}

function initFeedDetailModal() {
  // 피드 썸네일 클릭 시 모달이 열리도록 처리

  // index페이지에서 사용 시 gridContainer가 없기에 처리
  if ($gridContainer) {
    $gridContainer.addEventListener("click", (e) => {
      const $gridItem = e.target.closest(".grid-item");

      const postId = $gridItem.dataset.postId;
      openModal(postId);
    });
  }

  // 모달 닫기 이벤트
  $backdrop.addEventListener("click", closeModal);
  $closeButton.addEventListener("click", closeModal);

  document.addEventListener('keydown',handleKeyPress);
}

export default initFeedDetailModal;
