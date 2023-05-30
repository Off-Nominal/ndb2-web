export const getAppUrl = () => {
  const baseUrl =
    process.env.APP_URL || process.env.VERCEL_URL || "localhost:3000";

  if (process.env.NODE_ENV !== "development") {
    return "https://" + baseUrl;
  } else {
    return "http://" + baseUrl;
  }
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - 3) + "...";
};
