

let element = {
  //피드가 들어갈 전체 영역
  $feedContainer: document.querySelector(".feed-container"),
}

//한개의 피드를 렌더링하는 함수
function createFeedItem(feed){
  return `
  <article class="post">
      <div class="post-header">
        <div class="post-user-info">
          <div class="post-profile-image">
            <img src="/images/default-profile.svg" alt="프로필 이미지">
          </div>
          <div class="post-user-details">
            <a href="#" class="post-username">
                <!--      작성자 이름 배치      -->
            </a>
          </div>
        </div>
        <button class="post-options-btn">
          <i class="fa-solid fa-ellipsis"></i>
        </button>
      </div>

      <div class="post-images">
        <div class="carousel-container">
          <div class="carousel-track">
            <!--     이미지 목록 배치      -->
          </div>
          ${feed.images.length > 1 ? `
            <button class="carousel-prev">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button class="carousel-next">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
            <div class="carousel-indicators">
                <!--        인디케이터 렌더링        -->
            </div>
          ` : ''}
        </div>
      </div>
      
      <div class="post-actions">
        <div class="post-buttons">
          <div class="post-buttons-left">
            <button class="action-button like-button">
              <i class="fa-regular fa-heart"></i>
            </button>
            <button class="action-button comment-button">
              <i class="fa-regular fa-comment"></i>
            </button>
            <button class="action-button share-button">
              <i class="fa-regular fa-paper-plane"></i>
            </button>
          </div>
          <button class="action-button save-button">
            <i class="fa-regular fa-bookmark"></i>
          </button>
        </div>
        <div class="post-likes">
          좋아요 <span class="likes-count">0</span>개
        </div>
      </div>
      

      <div class="post-content">
        <div class="post-text">
            <!--     피드 내용     -->
        </div>
        <div class="post-time">
            <!--      피드 생성 시간      -->
        </div>
      </div>
      
      <div class="post-comments">
        <form class="comment-form">
          <input type="text" placeholder="댓글 달기..." class="comment-input">
          <button type="submit" class="comment-submit-btn" disabled>게시</button>
        </form>
      </div>
    </article>
  `;
}

//피드 렌더링 함수
async function renderFeed(){

  const {$feedContainer} = element;

  //피드 데이터를 서버로부터 불러오기
  const feedList = await fetchFeed();
  console.log(feedList[0]);

  //feed html을 생성하는 함수
  const feedHtml = createFeedItem(feedList[0]);
  $feedContainer.innerHTML = feedHtml;
}

//피드를 서버로부터 불러오는 함수 
async function fetchFeed() {
  const response = await fetch('/api/posts');

  if(!response.ok){
    alert("피드목록을 불러오는 데 실패했습니다.");
  }

  return response.json();
}

//외부에 노출시킬 피드관련 함수
function initFeed(){

  renderFeed();
}


export default initFeed;
