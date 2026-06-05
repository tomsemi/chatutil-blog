import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getNotes } from "../lib/notes";

export const GET: APIRoute = async (context) => {
  const notes = await getNotes();

  return rss({
    title: "ChatUtil Blog",
    description: "Learning notes, technical summaries, and build logs from ChatUtil.",
    site: context.site ?? "https://blog.chatutil.top",
    items: notes.map((note) => ({
      title: note.data.title,
      description: note.data.description,
      pubDate: note.data.date,
      link: `/notes/${note.slug}/`,
      categories: note.data.tags,
    })),
  });
};
