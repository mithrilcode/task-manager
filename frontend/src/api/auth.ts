import api from "./client";

type LoginResponse = {
  access_token: string;
  token_type: string;
};

type LoginRequest = {
  identifier: string;
  password: string;
};

type RegisterRequest = {
  email: string;
  username: string;
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

export const registerUser = async (
  email: string,
  username: string,
  password: string
): Promise<void> => {
  const payload: RegisterRequest = {
    email,
    username,
    password,
  };

  await api.post("/auth/register", payload);
};