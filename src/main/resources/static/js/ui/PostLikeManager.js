import { fetchWithAuth } from "../util/api.js";

// 좋아요 기능을 관리하는 클래스
// - 토글
// - 좋아요 상태표시 (좋아요 수, 하트 색상)
class PostLikeManager {
  constructor(container) {
    this.$container = container;

    //좋아요 버튼
    this.$likeButton = container.querySelector(".like-button");
    //좋아요 아이콘
    this.$heartIcon = container.querySelector(".like-button i");
    //좋아요 수
    this.$likeCount = container.querySelector(".like-count");

    // 피드 ID
    this.postId = container.dataset.postId;

    this.likeStatus;

    // 좋아요 토글 이벤트 바인딩
    this.$likeButton.onclick = async (e) => {
      e.preventDefault();

      // 서버에 좋아요 토글 요청
      const response = await fetchWithAuth(`/api/posts/${this.postId}/likes`, {
        method: "POST",
      });

      if (!response.ok) {
        alert("좋아요 처리 실패");
      }

      const likeStatus = await response.json();

      this.likeStatus = likeStatus;
      this.updateUI(likeStatus);
    };
  }

  // 좋아요 처리
  updateUI({ liked, likeCount }) {
    // 아이콘 색상 처리
    this.$likeButton.classList.toggle("liked", liked);
    this.$heartIcon.className = liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
  }
}

export default PostLikeManager;
