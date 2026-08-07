/**
 * asset-shims.d.ts
 *
 * Some uploaded assets in `attached_assets/` keep their original uppercase
 * extensions (e.g. `App_icon__....WEBP`). Vite's own `vite/client.d.ts`
 * only declares lowercase wildcards (`*.webp`, `*.png`, ...), and TS module
 * wildcard matching is case-sensitive, so those imports fail `tsc` even
 * though Vite resolves and serves them fine at runtime. Mirror the
 * declarations we need for the uppercase variants actually used.
 */

declare module '*.WEBP' {
  const src: string;
  export default src;
}

declare module '*.PNG' {
  const src: string;
  export default src;
}

declare module '*.JPEG' {
  const src: string;
  export default src;
}

declare module '*.JPG' {
  const src: string;
  export default src;
}
