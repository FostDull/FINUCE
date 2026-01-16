import axios from "axios";

const API_URL = "http://localhost:3000/auth";

export const login = async (user, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    user,
    password,
  });

  const { token } = response.data;

  localStorage.setItem("token", token);
};
