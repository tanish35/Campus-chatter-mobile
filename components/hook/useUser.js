import axios from "axios";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [loadingUser, setLoadingUser] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  async function getDetails() {
    try {
      const res = await axios.get("/api/user/me", {
        withCredentials: true,
      });
      setUserDetails(res.data);
      setLoadingUser(false);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setLoadingUser(false);
    }
  }

  useEffect(() => {
    getDetails();
  }, []);

  useEffect(() => {
    if (userDetails) {
      // Perform any side-effects or operations when userDetails change
    }
  }, [userDetails]);

  return { loadingUser, userDetails };
};
