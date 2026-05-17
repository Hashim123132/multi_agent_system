export const sendMessage = async (message: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    }
  );

  return await res.json();
};