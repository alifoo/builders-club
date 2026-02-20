export interface DynamicBannerElement {
  id: string;
  type: "text" | "image" | "div";
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  defaultStyle?: string;
}
