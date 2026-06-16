# RoyrAI Color Themes

A collection of **33 hand-crafted dark color themes** for Visual Studio Code, organized into color families.

## Themes

**Cool** (Blues & Teals):
RoyrAI Cool Ocean Deep · RoyrAI Cool Deep Blue · RoyrAI Cool Arctic Frost · RoyrAI Cool Mono Teal · RoyrAI Cool Turquoise Lagoon · RoyrAI Cool Slate & Coral

**Greens**:
RoyrAI Greens Forest Canopy · RoyrAI Greens Mono Green · RoyrAI Greens Green Lime · RoyrAI Greens Sage Garden · RoyrAI Greens Citrus Bliss

**Purples** (Purples & Pinks):
RoyrAI Purples Star Dust · RoyrAI Purples Purple Berry · RoyrAI Purples Royal Purple · RoyrAI Purples Indigo Night · RoyrAI Purples Cyberpunk Neon

**Warm** (Reds, Oranges & Ambers):
RoyrAI Warm Red Wine · RoyrAI Warm Hot Lava · RoyrAI Warm Sunset Ember · RoyrAI Warm Peach Sorbet · RoyrAI Warm Earth Amber · RoyrAI Warm Mocha Cream

**Metals**:
RoyrAI Metals Silver Spoon · RoyrAI Metals Golden Land · RoyrAI Metals Bronze Bar · RoyrAI Metals Metalic Wealth

**Crystals**:
RoyrAI Crystals Labradorite Blue · RoyrAI Crystals Labradorite Green · RoyrAI Crystals Labradorite Purple · RoyrAI Crystals Rose Quartz

**Parrots** (Parrots & RoyrAI Brand):
RoyrAI Parrots Teal & Gold · RoyrAI Parrots Golden-Blue Macaw · RoyrAI Parrots Scarlet Macaw

## How to use

1. Open the Command Palette (`Cmd+K Cmd+T` / `Ctrl+K Ctrl+T`).
2. Pick any theme from the list above.

## Install from a `.vsix` file (no Marketplace needed)

1. Download `royrai-vscode-themes-1.0.0.vsix`.
2. In VS Code: Command Palette → **Extensions: Install from VSIX…** → select the file.
   (Or from a terminal: `code --install-extension royrai-vscode-themes-1.0.0.vsix`.)

## Building / packaging

```bash
npm install -g @vscode/vsce
vsce package        # produces the .vsix
```

To regenerate the theme JSON files from the palette data, run:

```bash
node gen-themes.js
```

## License

MIT
