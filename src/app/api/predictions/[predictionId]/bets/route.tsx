import { NextResponse } from "next/server";
import authAPI from "@/utils/auth";
import ndb2API from "@/utils/ndb2";

export async function POST(
  req: Request,
  { params }: { params: { predictionId: string } }
) {
  const payload = await authAPI.verify();

  if (!payload) {
    return NextResponse.json(
      { error: "You must be authorized to perform this action." },
      { status: 401 }
    );
  }

  const predictionId = params.predictionId;

  if (!predictionId || isNaN(Number(predictionId))) {
    return NextResponse.json(
      { error: "Invalid prediction ID" },
      { status: 400 }
    );
  }

  const { discord_id, endorsed } = await req.json();

  if (!discord_id) {
    return NextResponse.json(
      { error: "Missing required field: discord_id" },
      { status: 400 }
    );
  }

  if (discord_id !== payload.discordId) {
    return NextResponse.json(
      { error: "Can only make bets for yourself" },
      { status: 401 }
    );
  }

  if (typeof endorsed !== "boolean") {
    return NextResponse.json(
      { error: "Missing required field: endorsed" },
      { status: 400 }
    );
  }

  return ndb2API
    .addBet(Number(predictionId), endorsed, discord_id)
    .then((data) => NextResponse.json(data.data))
    .catch((err) => {
      return NextResponse.json(
        { error: `Error fetching predictions: ${err}` },
        { status: 500 }
      );
    });
}
