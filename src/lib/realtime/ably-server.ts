import Ably from "ably";
import { serverConfig } from "../config/server-config";

let ablyRestClient: Ably.Rest | null = null;

export function getAblyRest(): Ably.Rest | null {
  if (!serverConfig.ably?.apiKey) return null;
  if (ablyRestClient) return ablyRestClient;
  ablyRestClient = new Ably.Rest({ key: serverConfig.ably.apiKey, queryTime: true });
  return ablyRestClient;
}


