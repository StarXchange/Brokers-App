// Helper to access runtime configuration
export const getConfig = () => {
  return (
    window.APP_CONFIG || {
      API_BASE_URL: "https://gibsbrokersapi.newgibsonline.com/api",
      ROOT_URL: "http://localhost:5174",
    }
  );
};

export const getApiBaseUrl = () => getConfig().API_BASE_URL;
export const getRootUrl = () => getConfig().ROOT_URL;
