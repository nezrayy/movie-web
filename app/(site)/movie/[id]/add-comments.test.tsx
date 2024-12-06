import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Detail from "@/app/(site)/movie/[id]/page";
import "@testing-library/jest-dom";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ReviewProvider } from "@/contexts/CommentsContext";
import { SessionProvider } from "next-auth/react";

const mockMovie = {
  id: 1,
  title: "Alien: Romulus",
  releaseYear: "2024",
  synopsis: "A new chapter in the Alien franchise.",
  linkTrailer: "https://youtu.be/example",
  rating: 4.5,
  posterUrl: "/alien-romulus.jpg",
  genres: [{ genre: { id: 1, name: "Horror" } }],
  availabilities: [{ availability: { id: 1, name: "Amazon Prime" } }],
  actors: [
    {
      actor: {
        id: 1,
        name: "Cailee Spaeny",
        photoUrl: "/cailee.jpg",
      },
    },
  ],
};
// Mock fetch API
global.fetch = jest.fn();

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <SessionProvider
      session={{
        user: {
          id: "1",
          username: "Test User",
          role: "USER",
          email: "example@mail.com",
          status: "ACTIVE",
        },
        expires: "9999-12-31T23:59:59.999Z",
      }}
    >
      {" "}
      <NotificationProvider>
        <ReviewProvider>{ui}</ReviewProvider>
      </NotificationProvider>
    </SessionProvider>
  );
};

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useSession: jest.fn(() => ({
    data: { user: { id: "1", name: "Test User" } },
    status: "authenticated",
  })),
}));

// Mock Rating component
jest.mock("@smastrom/react-rating", () => ({
  Rating: ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (v: number) => void;
  }) => (
    <div data-testid="mock-rating" onClick={() => onChange(4)}>
      Mock Rating - {value}
    </div>
  ),
}));

jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "1" }), // Mock ID parameter
}));

describe("Movie Detail Page - Authenticated User", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("allows authenticated user to submit a review", async () => {
    // Mock data untuk movie

    (global.fetch as jest.Mock).mockImplementation((url, options) => {
      if (url.startsWith("/api/get-movie-details/1")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMovie),
        });
      }
      if (
        url.startsWith("/api/comments/movie/1?sortOrder=rating&sortType=desc")
      ) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]), // Mock data komentar
        });
      }
      if (url.startsWith("/api/comments/movie/1")) {
        if (options?.method === "POST") {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true }),
          });
        }
      }
      return Promise.reject(new Error(`Unexpected API call: ${url}`));
    });

    // Render halaman Detail
    renderWithProviders(<Detail />);

    // Tunggu hingga data movie dirender
    await waitFor(() => {
      expect(screen.getByText("Alien: Romulus (2024)")).toBeInTheDocument();
    });

    // Simulasikan input rating
    const ratingComponent = screen.getByTestId("mock-rating");
    fireEvent.click(ratingComponent);

    // Simulasikan input komentar
    const commentTextarea = screen.getByPlaceholderText(
      "Type your review here..."
    );
    fireEvent.change(commentTextarea, {
      target: { value: "This movie is awesome!" },
    });

    // Simulasikan klik tombol submit
    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    // Tunggu hingga request selesai
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/comments/movie/1",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            movieId: 1,
            userId: "1",
            commentText: "This movie is awesome!",
            rating: 4,
          }),
        })
      );
    });

    // Verifikasi bahwa input telah direset setelah submit
    expect(commentTextarea).toHaveValue("");
  });
  it("shows error when user tries to submit a second comment", async () => {
    // Mock implementasi fetch
    (global.fetch as jest.Mock).mockImplementation((url, options) => {
      if (url.startsWith("/api/get-movie-details/1")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMovie),
        });
      }
      if (
        url.startsWith("/api/comments/movie/1?sortOrder=rating&sortType=desc")
      ) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]), // Mock data komentar
        });
      }
      if (url.startsWith("/api/comments/movie/1")) {
        if (options?.method === "POST") {
          // Simulasikan respons untuk komentar yang sudah ada
          return Promise.resolve({
            ok: false,
            status: 400,
            json: () =>
              Promise.resolve({
                message: "You have already commented on this movie.",
              }),
          });
        }
      }
      return Promise.reject(new Error(`Unexpected API call: ${url}`));
    });

    // Render halaman Detail
    renderWithProviders(<Detail />);

    // Tunggu hingga data movie dirender
    await waitFor(() => {
      expect(screen.getByText("Alien: Romulus (2024)")).toBeInTheDocument();
    });

    // Simulasikan input rating
    const ratingComponent = screen.getByTestId("mock-rating");
    fireEvent.click(ratingComponent);

    // Simulasikan input komentar
    const commentTextarea = screen.getByPlaceholderText(
      "Type your review here..."
    );
    fireEvent.change(commentTextarea, {
      target: { value: "This movie is amazing!" },
    });

    // Simulasikan klik tombol submit
    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    // Tunggu hingga pesan error muncul
    await waitFor(() => {
      expect(
        screen.getByText("You have already commented on this movie.")
      ).toBeInTheDocument();
    });

    // Pastikan input komentar tidak direset
    expect(commentTextarea).toHaveValue("This movie is amazing!");
  });
});
