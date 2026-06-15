import { getApiBaseUrl } from "@/config/env";
import { createApiClient } from "@/services/api/client";
import { getAccessToken } from "@/services/api/session";
import type { InviteUserInput, UserDto } from "@/services/types/api";

export async function inviteUser(input: InviteUserInput): Promise<UserDto> {
  const accessToken = await getAccessToken();
  const api = createApiClient({ baseUrl: getApiBaseUrl() });
  return api.post<UserDto>("/users", accessToken, input);
}
