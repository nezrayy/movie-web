import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import CMSActor from "@/app/(cms)/cms-actors/page";
import "@testing-library/jest-dom";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { PaginationProvider } from "@/contexts/CMSPaginationContext";
import { EditFormProvider } from "@/contexts/EditFormContext";

const mockActors = [
  {
    id: 1,
    name: "Ryan Reynolds",
    country: { id: 1, name: "USA" },
    birthdate: "1965-04-04", // Tetap gunakan ISO 8601 untuk kompatibilitas
    photoUrl: "/ryan.jpg",
  },
  {
    id: 2,
    name: "Hugh Jackman",
    country: { id: 2, name: "Australia" },
    birthdate: "1984-11-22", // Tetap gunakan ISO 8601
    photoUrl: "/hugh.jpg",
  },
];

const mockCountries = [
  { id: 1, name: "USA" },
  { id: 2, name: "Australia" },
];

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

describe("CMSActor Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url.startsWith("/api/actors")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockActors),
        });
      }
      if (url.startsWith("/api/countries")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCountries),
        });
      }
      return Promise.reject(new Error(`Unexpected API call: ${url}`));
    });
  });

  it("fetches and displays actors data", async () => {
    renderWithProviders(<CMSActor />);

    // Format tanggal ke MM/DD/YYYY
    const formattedDate1 = new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(new Date(mockActors[0].birthdate));

    const formattedDate2 = new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(new Date(mockActors[1].birthdate));

    console.log("Formatted Date 1:", formattedDate1); // Harus "04/04/1965"
    console.log("Formatted Date 2:", formattedDate2); // Harus "11/22/1984"

    // Tunggu hingga data dirender
    await waitFor(() => {
      expect(screen.getByText("Ryan Reynolds")).toBeInTheDocument();
      expect(screen.getByText("Hugh Jackman")).toBeInTheDocument();
    });

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");

    // Verifikasi detail aktor di tabel
    expect(within(rows[1]).getByText("Ryan Reynolds")).toBeInTheDocument();
    expect(within(rows[1]).getByText("USA")).toBeInTheDocument();
    expect(
      within(rows[1]).getByText((content) => content.includes(formattedDate1))
    ).toBeInTheDocument();

    expect(within(rows[2]).getByText("Hugh Jackman")).toBeInTheDocument();
    expect(within(rows[2]).getByText("Australia")).toBeInTheDocument();
    expect(
      within(rows[2]).getByText((content) => content.includes(formattedDate2))
    ).toBeInTheDocument();
  });

  // it("creates a new actor", async () => {
  //   // Mock fetch implementation
  //   (global.fetch as jest.Mock).mockImplementation((url, options) => {
  //     if (url.startsWith("/api/actors") && options.method === "POST") {
  //       return Promise.resolve({
  //         ok: true,
  //         json: () =>
  //           Promise.resolve({
  //             id: 3,
  //             name: "Channing Tatum",
  //             country: { id: 2, name: "Australia" }, // Country sebagai object
  //             birthdate: "1983-08-11", // ISO 8601 format
  //             photoUrl: "/channing.jpg",
  //           }),
  //       });
  //     }
  //     if (url.startsWith("/api/actors")) {
  //       return Promise.resolve({
  //         ok: true,
  //         json: () => Promise.resolve([]),
  //       });
  //     }
  //     if (url.startsWith("/api/countries")) {
  //       return Promise.resolve({
  //         ok: true,
  //         json: () => Promise.resolve(mockCountries),
  //       });
  //     }
  //     return Promise.reject(new Error(`Unexpected API call: ${url}`));
  //   });

  //   // Render CMSActor page
  //   renderWithProviders(<CMSActor />);

  //   // Format tanggal untuk mencerminkan format aplikasi
  //   const formattedBirthdate = new Intl.DateTimeFormat("en-US", {
  //     day: "numeric",
  //     month: "numeric",
  //     year: "numeric",
  //   }).format(new Date("1983-08-11"));

  //   // Simulate form input
  //   fireEvent.change(screen.getByPlaceholderText("Enter actor name..."), {
  //     target: { value: "Channing Tatum" },
  //   });

  //   // Simulate selecting a country
  //   fireEvent.click(screen.getByText("Select country")); // Buka dropdown
  //   fireEvent.click(screen.getByText("Australia")); // Pilih Australia

  //   // Simulate form submission
  //   fireEvent.click(screen.getByText("Submit"));

  //   // Tunggu hingga aktor baru muncul di tabel
  //   await waitFor(() => {
  //     expect(screen.getByText("Channing Tatum")).toBeInTheDocument();
  //     expect(screen.getByText("Australia")).toBeInTheDocument();
  //     expect(
  //       screen.getByText((content) => content.includes(formattedBirthdate))
  //     ).toBeInTheDocument();
  //   });
  // });

  // it("deletes an actor", async () => {
  //   // Mock data for actors
  //   const mockActors = [
  //     {
  //       id: 1,
  //       name: "Ryan Reynolds",
  //       country: "USA",
  //       birthdate: "1965-04-04",
  //       photoUrl: "/ryan.jpg",
  //     },
  //   ];

  //   // Mock fetch implementation for delete actor
  //   (global.fetch as jest.Mock).mockImplementation((url, options) => {
  //     if (url.startsWith("/api/actors/1") && options.method === "DELETE") {
  //       return Promise.resolve({ ok: true });
  //     }
  //     if (url.startsWith("/api/actors")) {
  //       return Promise.resolve({
  //         ok: true,
  //         json: () => Promise.resolve(mockActors),
  //       });
  //     }
  //     return Promise.reject(new Error(`Unexpected API call: ${url}`));
  //   });

  //   // Render CMSActor page
  //   renderWithProviders(<CMSActor />);

  //   // Wait for actor data to load
  //   await waitFor(() => {
  //     expect(screen.getByText("Ryan Reynolds")).toBeInTheDocument();
  //   });

  //   // Simulate delete action
  //   fireEvent.click(screen.getByText("Delete"));

  //   // Wait for actor to be removed
  //   await waitFor(() => {
  //     expect(screen.queryByText("Ryan Reynolds")).not.toBeInTheDocument();
  //   });
  // });
});
