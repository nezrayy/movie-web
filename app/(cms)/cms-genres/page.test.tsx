import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CMSGenre from "@/app/(cms)/cms-genres/page";
import "@testing-library/jest-dom";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { PaginationProvider } from "@/contexts/CMSPaginationContext";
import { EditFormProvider } from "@/contexts/EditFormContext";

global.fetch = jest.fn();

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <EditFormProvider>
      <NotificationProvider>
        <PaginationProvider>{ui}</PaginationProvider>
      </NotificationProvider>
    </EditFormProvider>
  );
};
describe("CMS Genre", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches genres data and displays it in the table", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, name: "Action" },
          { id: 2, name: "Drama" },
        ]),
    });

    renderWithProviders(<CMSGenre />);

    // Tunggu hingga data dirender
    await waitFor(() => {
      const genreRows = screen.getAllByTestId("row");
      expect(genreRows).toHaveLength(2); // 2 genre
      expect(genreRows[0]).toHaveTextContent("Action");
      expect(genreRows[1]).toHaveTextContent("Drama");
    });
    // Verifikasi bahwa API dipanggil
    expect(global.fetch).toHaveBeenCalledWith("/api/genres");
  });

  //   it("fetches and displays genres data", async () => {
  //     (global.fetch as jest.Mock).mockResolvedValueOnce({
  //       ok: true,
  //       json: () =>
  //         Promise.resolve([
  //           { id: 1, name: "Action" },
  //           { id: 2, name: "Drama" },
  //         ]),
  //     });

  //     renderWithProviders(<CMSGenre />);

  //     // Tunggu hingga state selesai diupdate
  //     await waitFor(() => {
  //       const genreRows = screen.getAllByRole("row");
  //       expect(genreRows).toHaveLength(3); // 1 header + 2 genre
  //     });
  //   });
});
