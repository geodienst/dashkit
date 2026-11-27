// Markdown files imported with `with { loader: 'text' }` are their text.
declare module '*.md' {
  const content: string;
  export default content;
}
