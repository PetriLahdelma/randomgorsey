import HomeRoute from "./page";

describe("home route content boundary", () => {
  it("serializes seven full posts and a lightweight archive index", () => {
    const element = HomeRoute();
    const props = element.props as {
      archive: Array<Record<string, unknown>>;
      posts: Array<Record<string, unknown>>;
      totalPosts: number;
    };

    expect(props.posts).toHaveLength(7);
    expect(props.archive).toHaveLength(65);
    expect(props.totalPosts).toBe(65);
    expect(Object.keys(props.archive[0]).sort()).toEqual([
      "category",
      "id",
      "timestamp",
      "title",
    ]);
    expect(props.archive.every((entry) => !("body" in entry))).toBe(true);
  });
});
