const API_URL = "http://localhost:3000/box-selection";

export const fetchBoxes = async (token) => {
  try {
    const response = await fetch(`${API_URL}/boxes`, {
      headers: {
        Authorization: `Bearer ${token}`,
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
      headers: {
        "Content-Type": "application/json",
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.color;
  } catch (error) {
    throw new Error("Failed to fetch box color");
  }
};
