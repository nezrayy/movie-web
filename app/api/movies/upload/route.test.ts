/**
 * @jest-environment node
 */

import { POST } from "./route";
import prisma from "../../../../lib/db";
import fs from "fs";
import path from "path";

// Mock modules
jest.mock("fs", () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

jest.mock("path", () => ({
  join: jest.fn(() => "public/uploads"), // Mock consistent path for uploads
}));

jest.mock("../../../../lib/db", () => ({
  movie: {
    create: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  country: {
    findUnique: jest.fn(),
  },
}));

describe("/api/movies/upload", () => {
  it("should upload and save a movie successfully", async () => {
    const mockBody = {
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA",
      fileName: "poster.png",
      title: "Test Movie",
      alternativeTitle: "Alternative Title",
      releaseYear: "2024",
      synopsis: "A test movie",
      createdById: "1",
      countryId: "2",
      genres: [1, 2],
      actors: [1, 2],
      availabilities: [1, 2],
      linkTrailer: "https://example.com",
    };

    const mockMovie = {
      id: 1,
      title: mockBody.title,
      alternativeTitle: mockBody.alternativeTitle,
      releaseYear: parseInt(mockBody.releaseYear, 10),
      synopsis: mockBody.synopsis,
      posterUrl: "/uploads/poster.png",
      linkTrailer: mockBody.linkTrailer,
    };

    // Mock database responses
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(true);
    (prisma.country.findUnique as jest.Mock).mockResolvedValue(true);
    (prisma.movie.create as jest.Mock).mockResolvedValue(mockMovie);

    // Mock file system operations
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

    const request = new Request("http://localhost/api/movies/upload", {
      method: "POST",
      body: JSON.stringify(mockBody),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ movie: mockMovie });
    expect(prisma.movie.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: mockBody.title,
        posterUrl: "/uploads/poster.png",
      }),
    });
  });
});
