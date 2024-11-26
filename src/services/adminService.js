const API_URL = "https://mystery-back.vercel.app/api/user-management";

export const getAllUsers = async (token) => {
  try {
    const response = await fetch(
      `https://mystery-back.vercel.app/api/user-management/admin/get-all-users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

export const createUser = async (token, userData) => {
  try {
    const response = await fetch(`${API_URL}/admin/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (error) {
    throw new Error("Failed to create user");
  }
};

export const deleteUser = async (token, userId) => {
  try {
    const response = await fetch(`${API_URL}/admin/delete-user`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: userId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};

export const updateUserCredits = async (token, userId, credits) => {
  try {
    const response = await fetch(`${API_URL}/admin/update-user-credits`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: userId, credits }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (error) {
    throw new Error("Failed to update user credits");
  }
};

export const searchUsers = async (token, username) => {
  try {
    const response = await fetch(`${API_URL}/search-users-by-username`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data;
  } catch (error) {
    throw new Error("Failed to search users");
  }
};

export const resetAllBoxes = async (token) => {
  try {
    const response = await fetch(
      `https://mystery-back.vercel.app/api/box-selection/set-all-boxes-to-unselected`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (error) {
    throw new Error("Failed to reset boxes");
  }
};

export const setBoxColor = async (token, color) => {
  try {
    const response = await fetch(
      `https://mystery-back.vercel.app/api/box-selection/admin/set-box-color`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ color }),
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (error) {
    throw new Error("Failed to update box color");
  }
};

export const getBoxColor = async (token) => {
  try {
    const response = await fetch(
      `https://mystery-back.vercel.app/api/box-selection/box-color`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.color;
  } catch (error) {
    throw new Error("Failed to fetch box color");
  }
};
