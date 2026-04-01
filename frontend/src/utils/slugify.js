export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");

export const deslugify = (slug) =>
  slug.replace(/-/g, " ");
