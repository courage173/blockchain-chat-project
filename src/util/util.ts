export function isValidEmail(email: string) {
  // Regular expression for a basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test the email against the regular expression
  return emailRegex.test(email);
}

const unexpectedError =
  "There was an error processing your request. Please try later.";

export const INVALID_TOKEN = "INVALID_TOKEN";
export const INVALID_TITLE_ACCESS = "INVALID_TITLE_ACCESS";

export const checkStatus = (response: any) => {
  return new Promise((resolve, reject) => {
    if (response.status >= 200 && response.status < 300) {
      // 204 No Content means that we don't need to parse into JSON
      if (response.status === 204) return resolve({ success: true });

      return response.json().then(resolve);
    }
    if (response.status === 401) {
      throw new Error(INVALID_TOKEN);
    }
    const error = new Error(response.statusText);

    return response
      .json()
      .then((json: any) => {
        // Receive JSON information about the error from the server
        if (Array.isArray(json.error)) {
          error.message = json.error[0].msg || json.error[0].message;
        } else if (json.message && !Array.isArray(json.message)) {
          error.message = json.message;
        } else if (json.message) {
          error.message = json.message;
        } else {
          error.message = unexpectedError;
        }
      })
      .catch(() => {
        // Default error attributes, means server hasn't provided extra information
        error.message = unexpectedError;
      })
      .then(() => reject(error));
  });
};

export const prepareEndpoint = (endpoint: string) =>
  `${import.meta.env.VITE_PUBLIC_BACKEND_URL}${endpoint}`;
