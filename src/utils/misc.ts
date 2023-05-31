export const getAppUrl = () => {
  const baseUrl =
    process.env.APP_URL || process.env.VERCEL_URL || "localhost:3000";

  if (process.env.NODE_ENV !== "development") {
    return "https://" + baseUrl;
  } else {
    return "http://" + baseUrl;
  }
};

export const responseHandler = (res: Response) => {
  if (res.ok) {
    return res.json();
  } else {
    throw res;
  }
};
