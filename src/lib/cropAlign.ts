export type AlignSide = "center" | "top" | "bottom" | "left" | "right";

/**
 * Computes the react-easy-crop `crop` offset that pins the image against one
 * edge of the viewport (or centers it), given the media's natural display
 * size (from `onMediaLoaded`) and the current zoom + viewport size.
 */
export const computeAlignedCrop = (
  side: AlignSide,
  mediaSize: { width: number; height: number },
  zoom: number,
  container: { width: number; height: number }
) => {
  const dw = mediaSize.width * zoom;
  const dh = mediaSize.height * zoom;
  const halfX = (dw - container.width) / 2;
  const halfY = (dh - container.height) / 2;

  switch (side) {
    case "left":
      return { x: halfX, y: 0 };
    case "right":
      return { x: -halfX, y: 0 };
    case "top":
      return { x: 0, y: halfY };
    case "bottom":
      return { x: 0, y: -halfY };
    case "center":
    default:
      return { x: 0, y: 0 };
  }
};
