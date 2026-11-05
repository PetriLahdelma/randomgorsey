import { GET as getFull } from "./llms-full.txt/route";
import { GET as getIndex } from "./llms.txt/route";

describe("LLM discovery routes", () => {
  it.each([
    ["/llms.txt", getIndex],
    ["/llms-full.txt", getFull],
  ])("serves %s as cached plain text", async (_path, handler) => {
    const response = handler();
    const text = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(response.headers.get("cache-control")).toContain("s-maxage=300");
    expect(text).toContain("# Random Gorsey");
  });
});
