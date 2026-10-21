/**
 * Formerly a 2px animated gradient rule with a diamond ornament between every
 * section. Sitting on the page background, it showed as a dark seam between
 * two light sections and read as unfinished, so it now renders nothing: the
 * change of section background is the divider. Kept as a no-op so the pages
 * that still place it don't need touching.
 */
const SectionTransition = () => null;

export default SectionTransition;
