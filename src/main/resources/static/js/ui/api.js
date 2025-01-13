// js/utils/api.js
function createAuthHeader() {
  const token = localStorage.getItem('accessToken');
  return token ? {'Authorization': `Bearer ${token}`} : {};
}

export async function fetchWithAuth(url, options = {}) {
  // 기본 헤더에 인증 헤더 추가
  const headers = {
    ...options.headers,
    ...createAuthHeader()
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  // 401 에러시 로그인 페이지로 리다이렉트
  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/';
    return;
  }

  return response;
}