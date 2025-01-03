

//피드 렌더링 함수
async function renderFeed(){
  //피드 데이터를 서버로부터 불러오기
  const feedList = await fetchFeed();
  console.log(feedList);
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
