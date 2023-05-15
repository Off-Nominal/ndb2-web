export const getAppUrl = () => {
  const baseUrl = process.env.VERCEL_URL || "localhost:3000";

  if (process.env.NODE_ENV !== "development") {
    return "https://" + baseUrl;
  } else {
    return "http://" + baseUrl;
  }
};
