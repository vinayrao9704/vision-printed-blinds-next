export interface Point {
  x: number;
  y: number;
}

/** A point on the editable window outline. Exactly 4 `corner` points
 *  always exist (TL, TR, BR, BL) and drive the perspective warp;
 *  any additional non-corner points only shape the visible clip mask
 *  (e.g. to notch around an obstruction) without affecting perspective. */
export interface EditPoint extends Point {
  corner: boolean;
}

export interface WindowShape {
  id: string;
  points: EditPoint[];
  /** The initially detected (or default) quad, kept so "Reset Shape" can revert edits. */
  original: EditPoint[];
  /** Detection confidence in [0,1], or null for a manually-drawn window. */
  score: number | null;
}
