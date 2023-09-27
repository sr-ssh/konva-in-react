export enum TextFontFamilyEnum {
  Classic = "classic",
  Modern = "modern",
  Neon = "neon",
  Typewriter = "typewriter",
  Strong = "strong",
}

export type FontFamiliesObjectType = {
  [key in TextFontFamilyEnum]: {
    hasAlign?: boolean;
    hasEmphasis?: boolean;
    hasBackground?: boolean;
  }
}