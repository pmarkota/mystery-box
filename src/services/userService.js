const API_URL = "https://mystery-back.vercel.app/api/user-management";

export const fetchUserData = async (token, userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const parsedId = parseInt(userId, 10);
    if (isNaN(parsedId)) {
      throw new Error("Invalid user ID");
    }

    console.log("Fetching user data for ID:", parsedId);

    const response = await fetch(`${API_URL}/admin/get-user`, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ id: parsedId }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.data[0];
  } catch (error) {
    console.error("Error in fetchUserData:", error, "userId:", userId);
    throw new Error("Failed to fetch user data");
  }
};
