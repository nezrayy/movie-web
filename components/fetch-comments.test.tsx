// import { render, screen, waitFor, fireEvent } from "@testing-library/react";
// import CommentsTable from "@/components/comments-table-client";
// import { ReviewProvider } from "@/contexts/CommentsContext";
// import "@testing-library/jest-dom";

// const mockFetchComments = jest.fn();

// const mockComments = [
//   {
//     id: 1,
//     user: { username: "John Doe" },
//     commentText: "Amazing movie! A must-watch.",
//     rating: 5,
//     createdAt: "2024-01-01T00:00:00Z",
//     status: "APPROVE",
//   },
//   {
//     id: 2,
//     user: { username: "Jane Doe" },
//     commentText: "Not my type, but still okay.",
//     rating: 3,
//     createdAt: "2024-01-02T00:00:00Z",
//     status: "APPROVE",
//   },
// ];

// const renderWithContext = (movieId: number) => {
//   render(
//     <ReviewProvider
//       value={{
//         comments: mockComments,
//         loading: false,
//         fetchComments: mockFetchComments,
//       }}
//     >
//       <CommentsTable movieId={movieId} />
//     </ReviewProvider>
//   );
// };

// describe("CommentsTable Component", () => {
//   it("renders and fetches comments for the movie", async () => {
//     renderWithContext(1);

//     // Tunggu hingga komentar dirender
//     await waitFor(() => {
//       expect(screen.getByText("John Doe")).toBeInTheDocument();
//       expect(
//         screen.getByText("Amazing movie! A must-watch.")
//       ).toBeInTheDocument();
//       expect(screen.getByText("Jane Doe")).toBeInTheDocument();
//       expect(
//         screen.getByText("Not my type, but still okay.")
//       ).toBeInTheDocument();
//     });

//     // Verifikasi rating tampil
//     expect(screen.getAllByTestId("mock-rating")).toHaveLength(2);

//     // Verifikasi tanggal tampil
//     expect(screen.getByText("1/1/2024")).toBeInTheDocument();
//     expect(screen.getByText("1/2/2024")).toBeInTheDocument();

//     // Verifikasi fetchComments dipanggil
//     expect(mockFetchComments).toHaveBeenCalledWith(1, "rating", "desc");
//   });

//   it("shows a message if there are no comments", async () => {
//     render(
//       <ReviewProvider
//         value={{
//           comments: [],
//           loading: false,
//           fetchComments: mockFetchComments,
//         }}
//       >
//         <CommentsTable movieId={1} />
//       </ReviewProvider>
//     );

//     // Tunggu hingga pesan kosong dirender
//     await waitFor(() => {
//       expect(
//         screen.getByText("Be the first one to review!")
//       ).toBeInTheDocument();
//     });
//   });

//   it("sorts comments by date when selected", async () => {
//     renderWithContext(1);

//     // Pilih sorting berdasarkan tanggal
//     const sortDateSelect = screen.getByText("Date");
//     fireEvent.click(sortDateSelect);

//     const newestOption = screen.getByText("Newest");
//     fireEvent.click(newestOption);

//     // Verifikasi fetchComments dipanggil ulang dengan parameter baru
//     await waitFor(() => {
//       expect(mockFetchComments).toHaveBeenCalledWith(1, "createdAt", "desc");
//     });
//   });
// });
