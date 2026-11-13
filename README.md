# RoyrAI VSCode Themes

A collection of **65 hand-crafted dark color themes** for Visual Studio Code, organized into color families.

## Themes

**Cool** (Blues & Teals):

- RoyrAI Cool Arctic Frost
- RoyrAI Cool Coral Mist
- RoyrAI Cool Coral Slate
- RoyrAI Cool Deep Blue
- RoyrAI Cool Harbor Lights
- RoyrAI Cool Mono Teal
- RoyrAI Cool Night Lantern
- RoyrAI Cool Ocean Deep
- RoyrAI Cool Teal Dusk
- RoyrAI Cool Turquoise Lagoon

**Crystals**:

- RoyrAI Crystals Labradorite Blue
- RoyrAI Crystals Labradorite Green
- RoyrAI Crystals Labradorite Purple
- RoyrAI Crystals Rose Quartz

**Greens**:

- RoyrAI Greens Citrus Bliss
- RoyrAI Greens Emerald Sky
- RoyrAI Greens Forest Canopy
- RoyrAI Greens Green Lime
- RoyrAI Greens Mint Branch
- RoyrAI Greens Mint Fresh
- RoyrAI Greens Mint Frost
- RoyrAI Greens Mint Mojito
- RoyrAI Greens Sage Garden

**Metals**:

- RoyrAI Metals Bronze Bar
- RoyrAI Metals Ember Graphite
- RoyrAI Metals Golden Land
- RoyrAI Metals Gunmetal Gold
- RoyrAI Metals Metalic Wealth
- RoyrAI Metals Silver Spoon

**Parrots** (Parrots & RoyrAI Brand):

- RoyrAI Parrots Brazil Carnival
- RoyrAI Parrots Brazil Samba
- RoyrAI Parrots Golden-Blue Macaw
- RoyrAI Parrots Scarlet Macaw
- RoyrAI Parrots Teal & Gold

**Purples** (Purples & Pinks):

- RoyrAI Purples Amethyst Ember
- RoyrAI Purples Cyberpunk Neon
- RoyrAI Purples Grapevine
- RoyrAI Purples Indigo Blossom
- RoyrAI Purples Indigo Night
- RoyrAI Purples Neon Mint
- RoyrAI Purples Printer Ink
- RoyrAI Purples Purple Berry
- RoyrAI Purples Royal Purple
- RoyrAI Purples Star Dust
- RoyrAI Purples Violet Haze
- RoyrAI Purples Violet Prism

**Tech**:

- RoyrAI Tech Copper Chip
- RoyrAI Tech Quantum Steel
- RoyrAI Tech Titanium Leaf

**Warm** (Reds, Oranges & Ambers):

- RoyrAI Warm Burgundy Cornflower
- RoyrAI Warm Burgundy Frost
- RoyrAI Warm Burgundy Persimmon
- RoyrAI Warm Burgundy Sky
- RoyrAI Warm Dune Fremen
- RoyrAI Warm Dune Sands
- RoyrAI Warm Dune Spice
- RoyrAI Warm Earth Amber
- RoyrAI Warm Hot Lava
- RoyrAI Warm Lighthouse
- RoyrAI Warm Mocha Cream
- RoyrAI Warm Peach Sorbet
- RoyrAI Warm Red Basalt
- RoyrAI Warm Red Wine
- RoyrAI Warm Sunset Ember
- RoyrAI Warm Tangerine Velvet

## How to use

1. Open the Command Palette (`Cmd+K Cmd+T` / `Ctrl+K Ctrl+T`).
2. Pick any theme from the list above.

## Install from a `.vsix` file (no Marketplace needed)

1. Download `royrai-vscode-themes-1.0.6.vsix`.
2. In VS Code: Command Palette → **Extensions: Install from VSIX…** → select the file.
   (Or from a terminal: `code --install-extension royrai-vscode-themes-1.0.6.vsix`.)

## Generating the themes

The theme JSON files in [themes/](themes/) are **not edited by hand** — they are generated from the palette data. The pipeline has two source files:

- [themes-data.js](themes-data.js) — the palette data. Each theme is defined by 3 accent colors (`keyword`, `string`, `func`) plus optional `bg` (editor background) and `bar` (status/activity bar) overrides.
- [gen-themes.js](gen-themes.js) — the generator. It expands every palette into a full VS Code color theme using the shared color math, writes one `themes/*.json` file per theme, and updates the `contributes.themes` list in [package.json](package.json).

### Steps

1. **Edit the palette data** in [themes-data.js](themes-data.js) — add, remove, or tweak a theme entry.

2. **Generate the theme files.** From the project root (requires [Node.js](https://nodejs.org/)):

   ```bash
   node gen-themes.js
   ```

   This regenerates all `themes/*.json` files and refreshes the theme list in `package.json` (version and description are left untouched). On success it prints e.g. `Generated 65 themes + package.json`.

3. **Preview / test** the themes by pressing `F5` in VS Code to launch an Extension Development Host, then switch themes with `Cmd+K Cmd+T` / `Ctrl+K Ctrl+T`.

4. **Package into a `.vsix`** (only needed to distribute or install outside the dev host):

   ```bash
   npx @vscode/vsce package   # produces royrai-vscode-themes-<version>.vsix
   ```

   `npx` runs the packaging tool without installing it. [.vscodeignore](.vscodeignore) controls which files go into the `.vsix` — only the theme files, `package.json`, README, CHANGELOG and LICENSE are packaged.

## Project Structure

```
royrai-vscode-themes/
├── themes/            # generated theme JSON files, one per theme
├── docs/              # HTML preview of all palettes
├── themes-data.js     # palette data (source)
├── gen-themes.js      # generator: palette data → themes/*.json + package.json
├── package.json       # extension manifest
├── .vscodeignore      # files excluded from the .vsix
├── CHANGELOG.md
└── README.md
```

## Key Files

- [themes-data.js](themes-data.js) — the only file to edit when adding or changing a theme.
- [gen-themes.js](gen-themes.js) — run it after every change to `themes-data.js`.
- [docs/color-palettes-dark-grouped.html](docs/color-palettes-dark-grouped.html) — open in a browser to preview every palette. It holds its own copy of the palette data, so update it together with `themes-data.js`.
- [CHANGELOG.md](CHANGELOG.md) — add an entry for every new version.

## License

MIT
