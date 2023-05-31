export const responseHandler = (res: Response) => {
  if (res.ok) {
    return res.json();
  } else {
    throw res;
  }
};
