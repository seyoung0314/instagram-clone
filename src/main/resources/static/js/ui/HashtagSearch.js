class HashTagSearch {
  constructor($textarea) {
    // console.log("해시태그 객체 생성");
    //사용자가 피드내용을 입력하는 영역
    this.$textarea = $textarea;

    //검색결과를 표시할 컨테이너 생성
    this.$suggestionContainer = this.createContainer();

    // 디바운스를 위한 타이머변수수
    this.searchTimeout = null;
  }

  init() {
    //text입력 감지
    this.$textarea.addEventListener("input", (e) => {
      //입력값을 읽어옴
      const text = e.target.value;
      console.log(text);

      // 현재 커서를 읽어오기
      const currentCursorPosition = e.target.selectionStart;

      const hastagMatch = this.findHashtagAtCursor(text, currentCursorPosition);

      if (hastagMatch) {
        //서버에 검색요청 보내기 - 디바운스 적용
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
          this.fetchHashtagSearch(hastagMatch.keword);
        }, 700);
      }
    });
  }

  // 서버에 검색요청을 보내는 함수
  async fetchHashtagSearch(keword) {
    // 키워드가 있을때만 통신
    if (!keword) {
      return;
    }

    const response = await fetch(`/api/hashtags/search?keyword=${keword}`);
    const hashtags = await response.json();

    //서버에서 가져온 해시태그정보 렌더링
    this.renderSuggestions(hashtags);
  }
  // 서버에서 가져온 해시태그 화면에 렌더링하기
  renderSuggestions(hashtags) {
    // 검색결과가 없다면 컨테이너 숨기기기
    if (!hashtags.length || !hashtags) {
      this.hideSuggestions();
      return;
    }

    // HTML 문자열로 각 해시태그 아이템을 구성하여 삽입
    this.$suggestionContainer.innerHTML = hashtags
      .map(
        (tag, index) => `
    <div class="hashtag-item" data-name="${tag.hashtag}" data-index="${index}">
      <div class="hashtag-info">
        <span class="hashtag-name">#${tag.hashtag}</span>
        <span class="post-count">게시물 ${tag.feedCount}개</span>
      </div>
    </div>
  `
      )
      .join("");

    // 생성된 목록을 보여주기
    this.$suggestionContainer.style.display = "block";
  }

  // 해시태그 추천 컨테이너 숨기기
  hideSuggestions() {
    this.$suggestionContainer.style.display = "none";
  }

  /**
   *  현재 커서 앞부분에 있는 가까운 해시태그를 찾는다.
   * @param {string} text - 전체 textarea 값
   * @param {*} currentCursorPosition - 현재 위치한 커서의 인덱스
   */
  //해시태그 입력감지
  findHashtagAtCursor(text, currentCursorPosition) {
    const beforeCursorText = text.substring(0, currentCursorPosition);
    console.log(beforeCursorText);

    const match = beforeCursorText.match(/#[\w가-힣]*$/);

    return match ? { keword: match[0].substring(1) } : null;
  }

  // 해시태그 추천목록을 만들 컨테이너
  createContainer() {
    const $container = document.createElement("div");
    $container.classList.add("hashtag-suggestions");
    this.$textarea.parentElement.append($container);
    return $container;
  }
}

export default HashTagSearch;
