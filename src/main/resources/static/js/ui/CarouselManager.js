class CarouselManager {
  // 생성자+필드
  constructor(container) {
    // 캐러셀을 감싸는 전체 부모태그 (step)
    this.container = container;

    // 이미지 트랙(실제 이미지가 배치될 공간)
    this.track = this.container.querySelector(".carousel-track");

    // 실제 이미지 파일 배열
    this.slides = [];

    // 인디케이터 영역
    this.indicatorContainer = this.container.querySelector(
      ".carousel-indicators"
    );
  }

  // 기능 : 메서드
  // 초기 이미지 파일 배열 받기
  init(files) {
    this.slides = files;
    console.log(this.slides);

    //이미지 슬라이드 띄우기
    this.setUpPreview();
  }

  setUpPreview() {
    //이미지 트랙 리셋
    this.track.innerHTML = "";
    //인디케이터 리셋셋
    this.indicatorContainer.innerHTML = "";

    this.slides.forEach((file, index) => {
      //이미지 생성
      const $img = document.createElement("img");
      //raw 파일을 이미지url로 변환
      $img.src = URL.createObjectURL(file);

      //이미지를 감쌀 박스구성
      const $slideDiv = document.createElement("div");
      $slideDiv.classList.add("carousel-slide");
      $slideDiv.append($img);

      this.track.append($slideDiv);

      // 인디케이터 생성
      if (this.slides.length > 1) this.makeIndicator(index);
    });
  }

  //인디케이터 생성하기
  makeIndicator(index) {

    const $indicator = document.createElement("span");
    $indicator.classList.add("indicator");
    if (index === 0) {
      $indicator.classList.add("active");
    }

    this.indicatorContainer.append($indicator);
  }
}
export default CarouselManager;
