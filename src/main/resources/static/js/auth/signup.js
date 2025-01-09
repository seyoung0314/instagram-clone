import {ValidationRules, checkPasswordStrength} from './validation.js';


function initSignUp() {
  // form submit이벤트
  const $form = document.querySelector(".auth-form");

  // 입력 태그들을 읽어서 객체로 관리
  const $inputs = {
    emailOrPhone: $form.querySelector('input[name="email"]'),
    name: $form.querySelector('input[name="name"]'),
    username: $form.querySelector('input[name="username"]'),
    password: $form.querySelector('input[name="password"]'),
  };

  const handleInput = ($input) => {
    removeErrorMessage($input.closest(".form-field"));
    validateField($input); //입력값 검증 함수 호출
  };

  // form 입력창 4개에 입력이벤트 바인딩
  // for(const key of $inputs){

  // }
  Object.values($inputs).forEach(($input) => {
    $input.addEventListener("input", (e) => {
      handleInput($input);
    });

    // 포커스를 잃었을 때 이벤트
    $input.addEventListener("blur", (e) => {
      handleInput($input);
    });
  });

  // 입력값을 검증하고 에러메세지를 렌더링하는 함수
  function validateField($input) {
    // 1. 빈값체크
    //어떤 태그의 input인지 확인
    const fieldName = $input.name;
    // 입력값 읽어오기
    const inputValue = $input.value;

    // $input의 부모태그 가져오기
    const $formField = $input.closest(".form-field");
    if (!inputValue) {
      showError($formField, ValidationRules[fieldName]?.requiredMessage); // 에러메세지 렌더링
    }
  }

  /**
   * 에러 메시지를 표시하고, 필드에 error 클래스를 부여
   */
  function showError($formField, message) {
    $formField.classList.add("error");
    const $errorSpan = document.createElement("span");
    $errorSpan.classList.add("error-message");
    $errorSpan.textContent = message;
    $formField.append($errorSpan);
  }

  /**
   * 에러 및 비밀번호 피드백을 제거한다.
   */
  function removeErrorMessage($formField) {
    $formField.classList.remove("error");
    const error = $formField.querySelector(".error-message");
    if (error) error.remove();
  }

  // form submit 이벤트
  $form.addEventListener("submit", (e) => {
    e.preventDefault(); // 폼 전송 시 새로고침 방지

    //사용자가 입력한 모든 입력값 읽어오기
    // const emailOrPhone = document.querySelector('input[name="email"]').value;
    // const name = document.querySelector('input[name="name"]').value;
    // const username = document.querySelector('input[name="username"]').value;
    // const password = document.querySelector('input[name="password"]').value;

    // const payload = {
    //   emailOrPhone: emailOrPhone,
    //   name: name,
    //   username: username,
    //   password: password,
    // };

    // console.log(payload);

    // //서버전송
    // fetchToSighup(payload);
  });
}

//서버로 데이터 전송
async function fetchToSighup(payload) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  alert(data.message);
}

// 메인 실행코드
document.addEventListener("DOMContentLoaded", initSignUp);
