const getProfile = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return await res.json();
};
