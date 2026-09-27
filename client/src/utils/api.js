// The auth cookie expires after an hour, but the user we keep in
// localStorage doesn't - so the UI could keep showing someone as signed in
// (even as an admin) while every API call came back 401 and pages silently
// showed nothing. Route API calls through here so a 401 signs the user out
// everywhere; AuthProvider listens for this event.
export const UNAUTHORIZED_EVENT = "auth:unauthorized";

const apiFetch = async (url, options) => {
  const response = await fetch(url, options);
  if (response.status === 401) {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }
  return response;
};

export default apiFetch;
