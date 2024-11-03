import bcrypt from "bcryptjs";

export const fetchUserByEmail = async (email: string, password: string) => {
  const response = await fetch('/api/users/get-user-by-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const user = await response.json();

  if (!response.ok) {
    return { error: user.message };
  }

  if (!user) {
    return { error: 'Wrong email or password' };
  }

  if (
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return { error: 'Invalid credentials' };
  }

  if (email !== user.email) {
    return { error: 'Wrong email or password' };
  }

  if (!user || !user.password) {
    return { error: 'Wrong email or password' };
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );
  if (!isPasswordValid) {
    return { error: 'Wrong email or password' };
  }

  if (user.status === 'SUSPENDED') {
    return { error: 'Your account has been suspended.' };
  }

  return { user };
};
