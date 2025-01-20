import { fetchWithAuth } from "../util/api.js";
import { openModal, createCommentHTML } from "./feed-detail-modal.js";


// 댓글 등록 요청 처리 (피드목록 - 여러개, 상세보기 모달 - 하나)
export function createComment($form) {
  // 댓글 입력창 가져오기
  const $commentInput = $form.querySelector(".comment-input");
  // 댓글 입력버튼
  const $commentSubmitBtn = $form.querySelector(".comment-submit-btn");

  // 피드 아이디 가져오기
  const postId = $form.closest("[data-post-id]")?.dataset.postId;

  // 입력값 변경 시 댓글 게시 버튼 활성화 여부 처리

  $commentInput.oninput = () => {
    const isValid = $commentInput.value.trim().length > 0;
    $commentSubmitBtn.disabled = !isValid;
  };

  // 댓글 생성 서버에 요청하기
  $form.onsubmit = async (e) => {
    e.preventDefault();

    //입력한 댓글 읽어오기
    const content = $commentInput.value.trim();
    if (!content) return;

    const response = await fetchWithAuth(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      alert("댓글생성에 실패하였습니다.");
    }

    const commentResponse = await response.json();

    // console.log(commentResponse);

    // 댓글 입력창 초기화
    $commentInput.value = "";
    $commentSubmitBtn.disabled = true;

    // 후속 렌더링 처리
    renderAfterCreated(commentResponse);
  };

  // 렌더링 헬퍼함수
  function renderAfterCreated({ comment, commentCount }) {
    // 댓글이 작성되는 공간 -> 피드목록, 피드모달
    // 피드목록에서 작성 - 첫 댓글일 경우 '댓글 1개보기' 버튼 생성
    // 두번째 부턴 n개의 텍스트만 갱신

    // 피드목록인지 확인
    const $feed = $form.closest('.feed-page');
    if ($feed) {
      if (commentCount === 1) {
        const $commentPreview = document.createElement("div");
        $commentPreview.classList.add("comments-preview");
        $commentPreview.innerHTML = `
            <button class="view-comments-button">
              댓글 1개 모두 보기
            </button>
        `;
        $form.before($commentPreview);
      } else {
        const $viewCommentsBtn = $feed.querySelector(".view-comments-button");
        $viewCommentsBtn.textContent = `댓글 ${commentCount}개 모두 보기`;
      }
    }

        // 댓글이 작성된 공간이 모달 내부라면 실시간으로 새댓글을 렌더링
        const $modal = $form.closest('.post-detail-modal');
        if ($modal) {
          // 첫 댓글인 경우 '아직 댓글이 없습니다'를 제거
          if (commentCount === 1) {
            const $noComment = $modal.querySelector('.no-comments-container');
            $noComment?.remove();
          }
          const $commentsList = $modal.querySelector('.comments-list');
          $commentsList.innerHTML += createCommentHTML(comment);
        }
    
  }
}
