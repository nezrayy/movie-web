export const fetchUserByEmail = async (email: string) => {
  const response = await fetch('/api/users/get-user-by-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  return await response.json();
};