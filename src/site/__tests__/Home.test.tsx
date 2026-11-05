import React from "react";
import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import Home from "../Home";
import posts from "@/content/posts";

describe("Home Page", () => {
  it("renders featured post section", () => {
    vi.useFakeTimers();
    render(
      <HelmetProvider>
        <Home posts={posts.slice(0,7)} archive={posts.map(({id,title,timestamp,category})=>({id,title,timestamp,category}))} totalPosts={posts.length} />
      </HelmetProvider>
    );
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.getByRole("heading", { level: 1, name: "Random Gorsey" })).toHaveTextContent("Random Gorsey");
    expect(screen.getByLabelText("Featured post")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("renders all posts section", () => {
    vi.useFakeTimers();
    render(
      <HelmetProvider>
        <Home posts={posts.slice(0,7)} archive={posts.map(({id,title,timestamp,category})=>({id,title,timestamp,category}))} totalPosts={posts.length} />
      </HelmetProvider>
    );
    act(() => {
      vi.runAllTimers();
    });
    expect(screen.getByLabelText("All posts")).toBeInTheDocument();
    vi.useRealTimers();
  });
  it("keeps journal index titles separate from dates and arrows", () => {
    const getContext=vi.spyOn(HTMLCanvasElement.prototype,"getContext").mockReturnValue(null);
    render(<Home posts={posts.slice(0,7)} archive={posts.map(({id,title,timestamp,category})=>({id,title,timestamp,category}))} totalPosts={posts.length}/>);
    fireEvent.click(screen.getByRole("button",{name:"Index"}));
    const firstEntry=screen.getByRole("link",{name:new RegExp(posts[0].title)});
    expect(firstEntry.querySelector("span:not([aria-hidden])")).toHaveTextContent(posts[0].title);
    expect(firstEntry.querySelector('span[aria-hidden="true"]')).toHaveTextContent("↗");
    getContext.mockRestore();
  });
  it("loads archive bodies on demand and retains entries if a request fails", async () => {
    const getContext=vi.spyOn(HTMLCanvasElement.prototype,"getContext").mockReturnValue(null);
    const request=vi.fn().mockResolvedValueOnce({ok:false}).mockResolvedValueOnce({ok:true,json:async()=>({posts:posts.slice(7,13),totalPosts:posts.length})});
    vi.stubGlobal("fetch",request);
    render(<Home posts={posts.slice(0,7)} archive={posts.map(({id,title,timestamp,category})=>({id,title,timestamp,category}))} totalPosts={posts.length}/>);
    expect(screen.getAllByRole("article")).toHaveLength(7);
    fireEvent.click(screen.getByRole("button",{name:"Load more posts"}));
    expect(await screen.findByRole("alert")).toHaveTextContent("could not be loaded");
    expect(screen.getAllByRole("article")).toHaveLength(7);
    fireEvent.click(screen.getByRole("button",{name:"Load more posts"}));
    await waitFor(()=>expect(screen.getAllByRole("article")).toHaveLength(13));
    expect(request).toHaveBeenLastCalledWith("/api/posts?offset=7&limit=6");
    vi.unstubAllGlobals();getContext.mockRestore();
  });

});
