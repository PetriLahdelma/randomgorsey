import { cardResponse, legacyServerCard } from "@/lib/server-cards";

export function GET() { return cardResponse(legacyServerCard, "application/json"); }
export function HEAD() { return cardResponse(legacyServerCard, "application/json", true); }
