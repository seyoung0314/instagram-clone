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
    this.$likeCount = container.querySelector(".likes-count");

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
    this.addDoubleLikeLike();
  }

  // 좋아요 처리
  updateUI({ liked, likeCount }) {
    // 아이콘 색상 처리
    this.$likeButton.classList.toggle("liked", liked);
    this.$heartIcon.className = liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart';

    // 좋아요 수 처리
    this.$likeCount.textContent = likeCount;

    // 프로필 페이지의 포스트 모달에서 하트 클릭 시 프로필 페이지 좋아요 동적변경되야함
    const $gridItem = document.querySelector(`.grid-item[data-post-id="${this.postId}"]`);
    if ($gridItem) {
      $gridItem.querySelector('.grid-likes-count').textContent = likeCount;
    }

    // 전체피드 목록 페이지에서 피드 목록의 좋아요 수와 상태 수동으로 변경
    const $feed = document.querySelector(`.post[data-post-id="${this.postId}"]`);
    if ($feed) {
      $feed.querySelector('.likes-count').textContent = likeCount;

      const $likeBtn = $feed.querySelector('.like-button');
      $likeBtn.classList.toggle('liked', liked);
      $likeBtn.querySelector('i').className = liked
        ? 'fa-solid fa-heart'
        : 'fa-regular fa-heart';
    }
  }

  addDoubleLikeLike(){
    const $carousel = this.$container.querySelector('.carousel-container');
    $carousel.ondblclick = () =>{
      this.$likeButton.onclick();
      
      // 하트 애니메이션 표시
      const $heartAnimation = document.createElement('div');
      $heartAnimation.classList.add('heart-animation');
      $heartAnimation.innerHTML = '<i class="fa-solid fa-heart"></i>';
      $carousel.append($heartAnimation);
      // 1초 후 애니메이션이 끝나면 하트 박스 삭제
      setTimeout(() => { 
        $heartAnimation.remove();
      }, 1000);
    };
  }

  
}

export default PostLikeManager;
