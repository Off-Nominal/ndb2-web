import { NextRequest, NextResponse } from "next/server";
import authAPI from "./utils/auth";
import { sub } from "date-fns";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // refresh cookies if needed
  try {
    const token = request.cookies.get("token");
    const payload = await authAPI.verify(token);

    if (
      !payload ||
      payload.iat * 1000 > sub(new Date(), { days: 1 }).getTime()
    ) {
      return response;
    }

    const newToken = await authAPI.sign(payload);
    response.cookies.set(authAPI.buildCookie(newToken));
  } catch (err) {
    console.error(err);
  }

  return response;
}
