const getProfile = async () => {
  const res = await fetch("http://localhost:8080/api/user/profile", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  return await res.json();
};
