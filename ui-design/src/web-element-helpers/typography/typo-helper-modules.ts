import { cTitle } from "../../web-elements/typography/typography";

/**
 * Creates a custom heading element with specified level and content.
 *
 * @param {string} level - The heading level (up to "3" - defaults to 1).
 * @param {string} content - Content of the heading.
 * @returns {cTitle} The created element.
 *
 * @example
 * const heading = createHeading("3", "Section Title");
 * document.body.appendChild(heading);
 */
export function createHeading(level: string, content: string): cTitle {
  const h = document.createElement("c-title") as cTitle;
  h.setAttribute("level", level);
  h.content = content;

  return h;
}
