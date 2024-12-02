import { render, screen, waitFor } from "@testing-library/react";
import Detail from "@/app/(site)/movie/[id]/page";
import "@testing-library/jest-dom";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ReviewProvider } from "@/contexts/CommentsContext";
import { SessionProvider } from "next-auth/react";

// Mock fetch API
global.fetch = jest.fn();

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <SessionProvider session={null}>
      <NotificationProvider>
        <ReviewProvider>{ui}</ReviewProvider>
      </NotificationProvider>
    </SessionProvider>
  );
};

// Mock Session
jest.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useSession: jest.fn(() => ({
    data: { user: { id: "1", name: "Test User" } },
    status: "authenticated",
  })),
}));

// Mock Navigation
jest.mock("next/navigation", () => ({
  useParams: () => ({ id: "1" }),
}));

// Mock Rating component
jest.mock("@smastrom/react-rating", () => ({
  Rating: () => <div data-testid="mock-rating" />,
}));

describe("Movie Detail Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches movie details and displays them", async () => {
    // Mock data untuk movie
    const mockMovie = {
      id: 1,
      title: "Alien: Romulus",
      releaseYear: "2024",
      synopsis: "A new chapter in the Alien franchise.",
      linkTrailer: "https://youtu.be/example",
      rating: 4.5,
      posterUrl: "/alien-romulus.jpg",
      genres: [
        { genre: { id: 1, name: "Horror" } },
        { genre: { id: 2, name: "Sci-Fi" } },
      ],
      availabilities: [
        { availability: { id: 1, name: "Amazon Prime" } },
        { availability: { id: 2, name: "Netflix" } },
      ],
      actors: [
        {
          actor: {
            id: 1,
            name: "Cailee Spaeny",
            photoUrl: "/channing.jpg",
          },
        },
        {
          actor: {
            id: 2,
            name: "David Jonsson",
            photoUrl: "/ryan.jpg",
          },
        },
      ],
    };

    // Mock fetch implementation
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.startsWith("/api/get-movie-details/1")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMovie),
        });
      }
      if (url.startsWith("/api/comments/movie/1")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]), // Mock komentar kosong
        });
      }
      return Promise.reject(new Error(`Unexpected API call: ${url}`));
    });

    // Render halaman Detail
    renderWithProviders(<Detail />);

    // Tunggu hingga data movie dirender
    await waitFor(() => {
      expect(screen.getByText("Alien: Romulus (2024)")).toBeInTheDocument();
      expect(
        screen.getByText("A new chapter in the Alien franchise.")
      ).toBeInTheDocument();
    });

    // Verifikasi poster film ditampilkan
    const poster = screen.getByRole("img", { name: "Alien: Romulus" });
    expect(poster).toHaveAttribute("src", "/alien-romulus.jpg");

    // Verifikasi genre ditampilkan
    expect(screen.getByText("Horror")).toBeInTheDocument();
    expect(screen.getByText("Sci-Fi")).toBeInTheDocument();

    // Verifikasi availabilities ditampilkan
    expect(screen.getByText("Amazon Prime")).toBeInTheDocument();
    expect(screen.getByText("Netflix")).toBeInTheDocument();

    // Verifikasi actors ditampilkan
    expect(screen.getByText("Cailee Spaeny")).toBeInTheDocument();
    expect(screen.getByText("David Jonsson")).toBeInTheDocument();
    const photo1 = screen.getByRole("img", {
      name: "Cailee Spaeny",
    });
    const photo2 = screen.getByRole("img", {
      name: "David Jonsson",
    });
    expect(photo1).toHaveAttribute("src", "/channing.jpg");
    expect(photo2).toHaveAttribute("src", "/ryan.jpg");

    // Verifikasi bahwa API dipanggil dengan benar
    expect(global.fetch).toHaveBeenNthCalledWith(1, "/api/get-movie-details/1");
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      "/api/comments/movie/1?sortOrder=rating&sortType=desc"
    );
  });
});
