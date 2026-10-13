# Interactive Perth Map

A responsive Leaflet map with seven Perth region overlays. Hover or focus a region to see its boundary description; click or tap to retain selection. Escape or Clear selection clears it. Reset view restores the map extent.

## Development

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

Build with `npm run build`; serve the production output with `npm run preview`.

## Boundary accuracy

The polygons in `src/main.js` are illustrative, manually traced approximations of the user-provided highway and Swan River boundaries. They are not official administrative or surveyed boundaries. Shared coordinate arrays align neighbouring regions. Outer edges use an explicitly chosen metropolitan extent because the supplied definitions do not specify outer limits. For authoritative use, replace these coordinates with verified GIS boundary data.

Street and suburb labels render above the translucent regions so the underlying Perth map stays readable. Street tiles are supplied by CARTO / OpenStreetMap and require network access to `*.basemaps.cartocdn.com`. Google Fonts are optional; local fallback fonts work offline. Region overlays and controls remain available without tiles. No API keys are required.
