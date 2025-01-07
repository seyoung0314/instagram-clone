class HashTagSearch {
  constructor($textarea) {
    // console.log("해시태그 객체 생성");
    //사용자가 피드내용을 입력하는 영역
    this.$textarea = $textarea;
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
        //서버에 검색요청 보내기
        this.fetchHashtagSearch(hastagMatch.keword);
      }
    });
  }

  // 서버에 검색요청을 보내는 함수
  async fetchHashtagSearch(keword) {
    const response = await fetch(`/api/hashtags/search?keyword=${keword}`);
    const hashtags = await response.json();
    console.log("--------");
    
    console.log(hashtags);
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
}

export default HashTagSearch;
