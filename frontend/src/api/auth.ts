import api from "./client";

type LoginResponse = {
  access_token: string;
  token_type: string;
};

type LoginRequest = {
  identifier: string;
  password: string;
};

export const loginUser = async (
  identifier: string,
  password: string
): Promise<LoginResponse> => {
  const payload: LoginRequest = {
    identifier,
    password,
  };

  const response = await api.post<LoginResponse>(
    "/auth/login",
    payload
  );

  return response.data;
};
