// React 18 doesn't know the camelCase fetchPriority prop (it warns and lower-
// cases it); the lowercase HTML attribute passes straight through.
import "react";

declare module "react" {
  interface ImgHTMLAttributes<T> {
    fetchpriority?: "high" | "low" | "auto";
  }
}
