import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/(site)/page";
import "@testing-library/jest-dom";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { FilterSortProvider } from "@/contexts/FilterSortContext";

// Mock fetch API
global.fetch = jest.fn();

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <NotificationProvider>
      <FilterSortProvider>{ui}</FilterSortProvider>
    </NotificationProvider>
  );
};

// Mock Rating component
jest.mock("@smastrom/react-rating", () => ({
  Rating: () => <div data-testid="mock-rating" />,
}));

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches movies and displays them", async () => {
    // Mock data untuk movies
    const mockMovies = [
      {
        id: 1,
        title: "Alien: Romulus",
        releaseYear: "2024",
        rating: 4.5,
        posterUrl: "/alien-romulus.jpg",
        genres: [{ genre: { id: 1, name: "Sci-Fi" } }],
      },
      {
        id: 2,
        title: "Interstellar",
        releaseYear: "2014",
        rating: 4.8,
        posterUrl: "/interstellar.jpg",
        genres: [{ genre: { id: 2, name: "Drama" } }],
      },
    ];

    // Mock data untuk genres
    const mockGenres = [
      { id: 1, name: "Sci-Fi" },
      { id: 2, name: "Drama" },
    ];

    // Mock data untuk availabilities
    const mockAvailabilities = [
      { id: 1, name: "Amazon Prime" },
      { id: 2, name: "Netflix" },
    ];

    // Mock implementasi fetch untuk berbagai endpoint
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.startsWith("/api/movies")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMovies),
        });
      }
      if (url.startsWith("/api/genres")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockGenres),
        });
      }
      if (url.startsWith("/api/get-availabilities")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAvailabilities),
        });
      }
      return Promise.reject(new Error(`Unexpected API call: ${url}`));
    });

    // Render halaman Home
    renderWithProviders(<Home />);

    // Tunggu hingga elemen movie dirender
    await waitFor(() => {
      expect(screen.getByText("Alien: Romulus (2024)")).toBeInTheDocument();
      expect(screen.getByText("Interstellar (2014)")).toBeInTheDocument();
    });

    // Verifikasi poster film ditampilkan
    const posters = screen.getAllByRole("img");
    expect(posters).toHaveLength(2);
    expect(posters[0]).toHaveAttribute("src", "/alien-romulus.jpg");
    expect(posters[1]).toHaveAttribute("src", "/interstellar.jpg");

    // Verifikasi bahwa fetch dipanggil tiga kali
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});
