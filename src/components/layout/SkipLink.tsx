/**
 * Keyboard skip link. Rendered as the first element of the page body so it
 * is the first tab stop. The target `<main id="main-content">` elements
 * carry tabIndex={-1} so focus lands on the content after activation.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}
