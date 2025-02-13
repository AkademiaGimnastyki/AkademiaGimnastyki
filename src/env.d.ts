/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@astrojs/react" />

declare module 'lucide-react';

type Props = Record<string, any>;

declare namespace astroHTML.JSX {
  interface HTMLAttributes {
    className?: string;
  }
  interface ImgHTMLAttributes extends HTMLAttributes {
    src?: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
  }
  interface AnchorHTMLAttributes extends HTMLAttributes {
    href?: string;
  }
}
