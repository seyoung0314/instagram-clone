/* src/main/resources/static/js/index.js */

import initStories from "./components/stories.js";
import initCreateFeedModal from "./components/create-feed-modal.js";

// 모든 태그가 랜더링되면 실행되는 이벤트트
document.addEventListener("DOMContentLoaded", () => {
  initStories();
});
