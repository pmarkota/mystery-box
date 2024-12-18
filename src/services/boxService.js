const API_URL = "https://mystery-back.vercel.app/api/box-selection";

export const fetchBoxes = async (token) => {
  try {
    const response = await fetch(`${API_URL}/boxes`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  } catch (error) {
    throw new Error("Failed to fetch boxes");
  }
};

export const submitBoxes = async (token, userId, boxIds) => {
  try {
    const response = await fetch(`${API_URL}/submit-selected-boxes`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, boxIds }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (error) {
    throw new Error("Failed to submit boxes");
  }
};

export const getBoxColor = async (token) => {
  try {
    const response = await fetch(`${API_URL}/box-color`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.color;
  } catch (error) {
    throw new Error("Failed to fetch box color");
  }
};
