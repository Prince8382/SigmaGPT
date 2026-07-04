function Upgrade() {

  const upgradePlan = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/upgrade`, {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <div style={{ padding: "20px", color: "#fff" }}>
      <h2>Upgrade Plan</h2>

      <p>Upgrade to Premium for faster responses 🚀</p>

      <button onClick={upgradePlan}>
        Upgrade Now
      </button>
    </div>
  );
}

export default Upgrade;