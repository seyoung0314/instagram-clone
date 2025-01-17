import CarouselManager from "../ui/CarouselManager.js";
import { fetchWithAuth } from "../util/api.js";
import { convertHashtagsToLinks, formatDate } from "./feed.js";

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

function renderModalContent({ postId, content, createdAt, user, images }) {
  const { username, name, profileImageUrl } = user;

  $modal.querySelectorAll(".post-username").forEach(($username) => {
    $username.textContent = username;
    $username.href = `/${username}`;
  });

  $modal.querySelectorAll(".post-profile-image img").forEach(($image) => {
    $image.src = profileImageUrl ?? "/images/default-profile.svg";
    $image.alt = `${username}님의 프로필 사진`;
  });

  $modal.querySelector(".post-caption").innerHTML =
    convertHashtagsToLinks(content);
  $modal.querySelector(".post-time").textContent = formatDate(createdAt);

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
                                  .join("")}
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
                                                index === 0 ? "active" : ""
                                              }"></span>`
                                          )
                                          .join("")}
                                      </div>
                              `
                                  : ""
                              }
                           </div>`;

  // 캐러셀 만들기
  if (images.length > 1) {
    const carousel
      = new CarouselManager($carouselContainer);
    
    carousel.initWithImgTag([...$carouselContainer.querySelectorAll('img')]);
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

  renderModalContent(data);

  //모달 디스플레이 변경
  $modal.style.display = "flex";
  document.body.style.overflow = "";
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
}

export default initFeedDetailModal;
