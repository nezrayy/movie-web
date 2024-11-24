/**
 * @jest-environment node
 */
import { PUT } from "./route"; // Import the PUT handler

async function readableStreamToString(readableStream: ReadableStream) {
  const reader = readableStream.getReader();
  let result = '';
  let done = false;

  while (!done) {
    const { value, done: readDone } = await reader.read();
    if (readDone) {
      done = true;
    } else {
      result += new TextDecoder().decode(value);
    }
  }

  return result;
}

// Mock prisma
jest.mock("../../../../../lib/db", () => ({
  movie: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

const mockPrisma = require("../../../../../lib/db");

describe('/api/movies/[movieId]/update-status', () => {
  it('should update movie status successfully', async () => {
    // Mock the findUnique and update responses
    const mockMovie = {
      id: 1,
      title: "Mock Movie",
      status: "PENDING",
    };

    const updatedMovie = {
      id: 1,
      title: "Mock Movie",
      status: "APPROVE",
    };

    mockPrisma.movie.findUnique.mockResolvedValue(mockMovie);
    mockPrisma.movie.update.mockResolvedValue(updatedMovie);

    const body = JSON.stringify({ status: "APPROVE" });

    const request = new Request("http://localhost/api/movies/1/update-status", {
      method: "PUT",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const context = { params: { movieId: "1" } };

    // Call the PUT handler
    const res = await PUT(request, context);

    expect(res.status).toBe(200);

    // @ts-ignore
    const responseBody = await readableStreamToString(res.body);
    const jsonResponse = JSON.parse(responseBody);

    expect(jsonResponse).toStrictEqual({ message: "Movie status updated" });

    expect(mockPrisma.movie.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(mockPrisma.movie.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: "APPROVE" },
    });
  });
});
