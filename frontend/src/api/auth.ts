import api from "./client";

type LoginResponse = {
  access_token: string;
  token_type: string;
};

export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await api.post<LoginResponse>(
    "/auth/login",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
};
