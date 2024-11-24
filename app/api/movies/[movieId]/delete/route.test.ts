/**
 * @jest-environment node
 */
import { DELETE } from "./route"; // Import the DELETE handler

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
    update: jest.fn(),
  },
}));

const mockPrisma = require("../../../../../lib/db");

describe('/api/movies/[movieId]/delete', () => {
  it('should delete a movie successfully', async () => {
    // Mock the movie update response
    const mockMovie = {
      id: 1,
      title: "Mock Movie",
      isDeleted: true,
    };

    mockPrisma.movie.update.mockResolvedValue(mockMovie);

    const request = new Request("http://localhost/api/movies/1/delete", {
      method: "DELETE",
    });

    const context = { params: { movieId: "1" } };

    // Call the DELETE handler
    // @ts-ignore
    const res = await DELETE(request, context);

    expect(res.status).toBe(200);

    // @ts-ignore
    const body = await readableStreamToString(res.body);
    const jsonResponse = JSON.parse(body);

    expect(jsonResponse).toStrictEqual(mockMovie);
    expect(mockPrisma.movie.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { isDeleted: true },
    });
  });
});
