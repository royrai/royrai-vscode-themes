# RoyrAI VSCode Themes

A collection of **33 hand-crafted dark color themes** for Visual Studio Code, organized into color families.

## Themes

**Cool** (Blues & Teals):
RoyrAI Cool Arctic Frost · RoyrAI Cool Deep Blue · RoyrAI Cool Mono Teal · RoyrAI Cool Ocean Deep · RoyrAI Cool Slate & Coral · RoyrAI Cool Turquoise Lagoon

**Crystals**:
RoyrAI Crystals Labradorite Blue · RoyrAI Crystals Labradorite Green · RoyrAI Crystals Labradorite Purple · RoyrAI Crystals Rose Quartz

**Greens**:
RoyrAI Greens Citrus Bliss · RoyrAI Greens Forest Canopy · RoyrAI Greens Green Lime · RoyrAI Greens Sage Garden

**Metals**:
RoyrAI Metals Bronze Bar · RoyrAI Metals Golden Land · RoyrAI Metals Metalic Wealth · RoyrAI Metals Silver Spoon

**Parrots** (Parrots & RoyrAI Brand):
RoyrAI Parrots Golden-Blue Macaw · RoyrAI Parrots Scarlet Macaw · RoyrAI Parrots Teal & Gold

**Purples** (Purples & Pinks):
RoyrAI Purples Cyberpunk Neon · RoyrAI Purples Indigo Night · RoyrAI Purples Purple Berry · RoyrAI Purples Royal Purple · RoyrAI Purples Star Dust

**Warm** (Reds, Oranges & Ambers):
RoyrAI Warm Earth Amber · RoyrAI Warm Hot Lava · RoyrAI Warm Mocha Cream · RoyrAI Warm Peach Sorbet · RoyrAI Warm Red Basalt · RoyrAI Warm Red Wine · RoyrAI Warm Sunset Ember

## How to use

1. Open the Command Palette (`Cmd+K Cmd+T` / `Ctrl+K Ctrl+T`).
2. Pick any theme from the list above.

## Install from a `.vsix` file (no Marketplace needed)

1. Download `royrai-vscode-themes-1.0.2.vsix`.
2. In VS Code: Command Palette → **Extensions: Install from VSIX…** → select the file.
   (Or from a terminal: `code --install-extension royrai-vscode-themes-1.0.2.vsix`.)

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
