import { ValidationRules, checkPasswordStrength } from "./validation.js";
import { debounce } from "../util/debounce.js";

function initSignUp() {
  // form submit이벤트
  const $form = document.querySelector(".auth-form");

  const $submitButton = $form.querySelector(".auth-button");
  $submitButton.disabled = true;

  // 입력 태그들을 읽어서 객체로 관리
  const $inputs = {
    emailOrPhone: $form.querySelector('input[name="email"]'),
    name: $form.querySelector('input[name="name"]'),
    username: $form.querySelector('input[name="username"]'),
    password: $form.querySelector('input[name="password"]'),
  };

  createPasswordToggle($inputs.password);

  // 디바운스가 걸린 validateField 함수
  const debouncedValidate = debounce(async ($input) => {
    await validateField($input);
  }, 700);

  const handleInput = async ($input) => {
    removeErrorMessage($input.closest(".form-field"));
    await debouncedValidate($input); //입력값 검증 함수 호출
    // debounce(($input) => {
    //   console.log("함수");
    //   validateField($input);
    // }, 700)();
  };

  // form 입력창 4개에 입력이벤트 바인딩
  // for(const key of $inputs){

  // }
  Object.values($inputs).forEach(($input) => {
    $input.addEventListener("input", async (e) => {
      $submitButton.disabled = true;
      const $formField = $input.closest(".form-field");
      await handleInput($input);
      if (validateForm()) {
        $submitButton.disabled = false;
      }
    });

    // 포커스를 잃었을 때 이벤트
    $input.addEventListener("blur", (e) => {
      handleInput($input);
    });
  });

  function validateForm() {
    let flag = true;
    Object.values($inputs).forEach(($input) => {
      const $formField = $input.closest(".form-field");
      console.log($input.value);
      console.log($formField.classList);

      if (!$input.value) {
        console.log("값이 덜 입력됨");

        flag = false; // 폼 제출을 막습니다.
      }
      if ($formField.classList.contains("error")) {
        console.log("에러메세지가 있는 상태");

        flag = false; // 폼 제출을 막습니다.
      }
    });
    return flag;
  }

  // 입력값을 검증하고 에러메세지를 렌더링하는 함수
  async function validateField($input) {
    // 1. 빈값체크
    //어떤 태그의 input인지 확인
    const fieldName = $input.name;
    // 입력값 읽어오기
    const inputValue = $input.value.trim();

    // $input의 부모태그 가져오기
    const $formField = $input.closest(".form-field");
    if (!inputValue) {
      showError($formField, ValidationRules[fieldName]?.requiredMessage); // 에러메세지 렌더링
    } else {
      // 2. 상세체크(패턴검증, 중복검증)
      // 2-1. 이메일, 전화번호 검증
      if (fieldName === "email") {
        validateFieldEmailOrPhone($formField, inputValue);
      } else if (fieldName === "password") {
        validateFieldPassword($formField, inputValue);
      } else if (fieldName === "name") {
        validateUsername($formField, inputValue);
      }
    }
  }

  // 서버에 중복체크 api 요청을 보내고 결과를 반환
  async function fetchToCheckDuplicate(type, value, $formField) {
    const response = await fetch(
      `/api/auth/check-duplicate?type=${type}&value=${value}`
    );
    const data = await response.json();
    if (!data.available) {
      showError($formField, data.message);
    }
  }

  // 이메일 또는 전화번호를 상세검증
  async function validateFieldEmailOrPhone($formField, inputValue) {
    // 이메일 패턴체크
    if (inputValue.includes("@")) {
      // 패턴체크
      if (!ValidationRules.email.pattern.test(inputValue)) {
        showError($formField, ValidationRules.email.message);
        //중복체크 (서버통신)
      } else {
        const data = await fetchToCheckDuplicate(
          "email",
          inputValue,
          $formField
        );
      }
      //전화번호 패턴체크
    } else {
      // 전화번호 처리(숫자만 추출)
      const numbers = inputValue.replace(/[^0-9]/g, "");
      // 패턴체크
      if (!ValidationRules.phone.pattern.test(numbers)) {
        showError($formField, ValidationRules.phone.message);
        //중복체크 (서버통신)
      } else {
        const data = await fetchToCheckDuplicate("phone", numbers, $formField);
      }
    }
  }

  //비밀번호 검증(길이,강도 체크)
  function validateFieldPassword($formField, inputValue) {
    //길이 확인
    if (!ValidationRules.password.patterns.length.test(inputValue)) {
      showError($formField, ValidationRules.password.messages.length);
    }
    //강도 체크
    const strenth = checkPasswordStrength(inputValue);
    switch (strenth) {
      case "weak": // 에러
        showError($formField, ValidationRules.password.messages.weak);
        break;
      case "medium":
        showPasswordFeedback(
          $formField,
          ValidationRules.password.messages.medium,
          "warning"
        );
        break;
      case "strong":
        showPasswordFeedback(
          $formField,
          ValidationRules.password.messages.strong,
          "succese"
        );
        break;
    }
  }

  /**
   * 비밀번호 강도 피드백 표시
   */
  function showPasswordFeedback($formField, message, type) {
    const $feedback = document.createElement("span");
    $feedback.className = `password-feedback ${type}`;
    $feedback.textContent = message;
    $formField.append($feedback);
  }

  /**
   * 사용자 이름(username) 필드 검증
   */
  async function validateUsername($formField, inputValue) {
    if (!ValidationRules.username.pattern.test(inputValue)) {
      showError($formField, ValidationRules.username.message);
    } else {
      const data = await fetchToCheckDuplicate(
        "username",
        inputValue,
        $formField
      );
    }

    // 중복검사
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
    const feedback = $formField.querySelector(".password-feedback");
    if (error) error.remove();
    if (feedback) feedback.remove();
  }

  /**
   * 비밀번호 표시/숨기기 토글 기능 생성
   */
  function createPasswordToggle(passwordInput) {
    const $toggle = document.querySelector(".password-toggle");

    passwordInput.addEventListener("input", (e) => {
      $toggle.style.display = e.target.value.length > 0 ? "block" : "none";
    });

    $toggle.addEventListener("click", () => {
      const isCurrentlyPassword = passwordInput.type === "password";
      passwordInput.type = isCurrentlyPassword ? "text" : "password";
      $toggle.textContent = isCurrentlyPassword ? "숨기기" : "패스워드 표시";
    });
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
