import axios from 'axios'

export function setAuthHeader(token) {
  axios.defaults.headers.common['Authorization'] = `${token}`
}

export const checkAuth = async () => {
  if (typeof window === "undefined") {
    return { isValid: false };
  }

  const token = localStorage.getItem("token");
  if (!token) {
    return { isValid: false };
  }

  try {
    setAuthHeader(token);
    const response = await axios.post('http://localhost:8080/api/auth/validate', '');

    if (response.status !== 200) {
      return { isValid: false };
    }

    return { isValid: true };
  } catch (error) {
    console.error('Token verification error:', error);
    return { isValid: false };
  }
};