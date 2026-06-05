import { getCollection } from "astro:content";

export type NoteEntry = Awaited<ReturnType<typeof getNotes>>[number];

export async function getNotes() {
  const notes = await getCollection("notes", ({ data }) => !data.draft);
  return notes.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getReadingMinutes(body: string) {
  const chineseChars = body.match(/[\u4e00-\u9fa5]/g)?.length ?? 0;
  const latinWords = body.replace(/[\u4e00-\u9fa5]/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil((chineseChars + latinWords) / 450));
}

export function getAllTags(notes: NoteEntry[]) {
  const counts = new Map<string, number>();

  for (const note of notes) {
    for (const tag of note.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
