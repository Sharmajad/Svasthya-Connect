/**
 * Auth Utility for checking user authentication status
 */

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  // Basic check: if token exists and is not empty
  return !!token;
};

export const setRedirectPath = (path) => {
  localStorage.setItem("redirectAfterLogin", path);
};

export const getRedirectPath = () => {
  return localStorage.getItem("redirectAfterLogin");
};

export const clearRedirectPath = () => {
  localStorage.removeItem("redirectAfterLogin");
};
