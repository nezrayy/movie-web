import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "./page";
import { signIn } from "next-auth/react";
import { fetchUserByEmail } from "@/lib/get-user-by-email";

jest.mock("../../../lib/get-user-by-email", () => ({
  fetchUserByEmail: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  getSession: jest.fn(),
}));

describe("LoginPage", () => {
  it("renders email and password input fields", () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it("shows an error message when incorrect credentials are submitted", async () => {
    // Mock hasil untuk `signIn` dan `fetchUserByEmail`
    (signIn as jest.Mock).mockResolvedValueOnce({ error: "Some error" });
    (fetchUserByEmail as jest.Mock).mockResolvedValueOnce({ error: "Wrong email or password" });

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByText("Sign in");

    // Masukkan kredensial salah dan klik submit
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    // Tunggu hingga pesan error muncul
    const errorMessage = await screen.findByText((content, element) =>
      element?.tagName.toLowerCase() === "p" &&
      element?.classList.contains("text-red-500")
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("shows validation errors for invalid inputs", async () => {
    render(<LoginPage />);
  
    const submitButton = screen.getByText("Sign in");
    fireEvent.click(submitButton);
  
    // Tunggu hingga pesan error validasi muncul
    const emailError = await screen.findByText("Please enter a valid email address.");
    const passwordError = await screen.findByText("Password must be at least 6 characters.");
  
    expect(emailError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
  });
});
