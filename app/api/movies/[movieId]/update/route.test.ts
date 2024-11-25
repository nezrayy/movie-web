/**
 * @jest-environment node
 */

import { PUT } from "./route";
import prisma from "../../../../../lib/db";
import fs from "fs";
import path from "path";

// Mocking the required modules
jest.mock("fs", () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

jest.mock("path", () => {
  const actualPath = jest.requireActual("path");
  return {
    ...actualPath,
    join: jest.fn((...args: string[]) => {
      if (args.includes("public") && args.includes("uploads")) {
        return "public/uploads"; // Mock consistent path for uploads
      }
      return args.join("/");
    }),
  };
});

jest.mock("../../../../../lib/db", () => ({
  movie: {
    update: jest.fn(),
  },
}));

describe("/api/movies/update", () => {
  it("should update a movie successfully", async () => {
    const mockBody = {
      id: "1",
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA",
      fileName: "updated-poster.png",
      title: "Updated Movie Title",
      alternativeTitle: "Updated Alternative Title",
      releaseYear: "2024",
      synopsis: "Updated synopsis for the movie",
      countryId: "2",
      genres: [1, 2],
      actors: [1, 2],
      availabilities: [1, 2],
      linkTrailer: "https://example.com/updated-trailer",
    };

    const mockUpdatedMovie = {
      id: 1,
      title: mockBody.title,
      alternativeTitle: mockBody.alternativeTitle,
      releaseYear: parseInt(mockBody.releaseYear, 10),
      synopsis: mockBody.synopsis,
      posterUrl: "/uploads/updated-poster.png",
      linkTrailer: mockBody.linkTrailer,
    };

    // Mock Prisma update function
    (prisma.movie.update as jest.Mock).mockResolvedValue(mockUpdatedMovie);

    // Mock filesystem operations
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    const request = new Request("http://localhost/api/movies/update", {
      method: "PUT",
      body: JSON.stringify(mockBody),
    });

    const response = await PUT(request);

    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toEqual({ updatedMovie: mockUpdatedMovie });

    expect(prisma.movie.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: expect.objectContaining({
        title: mockBody.title,
        posterUrl: "/uploads/updated-poster.png",
      }),
    });
  });
});
