function initSignUp() {
  // form submit이벤트
  const $form = document.querySelector(".auth-form");

  $form.addEventListener("submit", (e) => {
    e.preventDefault(); // 폼 전송 시 새로고침 방지

    //사용자가 입력한 모든 입력값 읽어오기
    const emailOrPhone = document.querySelector('input[name="email"]').value;
    const name = document.querySelector('input[name="name"]').value;
    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    const payload = {
      emailOrPhone: emailOrPhone,
      name: name,
      username: username,
      password: password,
    };

    console.log(payload);

    //서버전송
    fetchToSighup(payload);
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
