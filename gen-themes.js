/* Generator for the Royr Color Themes VSCode extension.
   Expands each 3-accent palette (keyword / string / func) + background into a
   full VSCode color theme, then writes package.json + themes/*.json.
   Uses the same color math as the HTML palette previews so themes match. */

const fs = require("fs");
const path = require("path");

// ── palette data (same as the grouped preview) ──
// entry: [name, [keyword, string, func]]  — optional 3rd element forces a background hex
const groups = [
  ["Blues & Teals", [
    ["RoyrAI Cool Ocean Deep",        ["#023e8a","#0077b6","#48cae4"]],
    ["RoyrAI Cool Deep Blue",         ["#3b82f6","#60a5fa","#93c5fd"]],
    ["RoyrAI Cool Arctic Frost",      ["#4cc9f0","#4361ee","#b8c0ff"]],
    ["RoyrAI Cool Mono Teal",         ["#014f4f","#029191","#5ee0e0"]],
    ["RoyrAI Cool Turquoise Lagoon",  ["#053a4d","#0a7d92","#19b6d9"]],
    ["RoyrAI Cool Slate & Coral",     ["#3d5a80","#98c1d9","#f5a98b"]],
  ]],
  ["Greens", [
    ["RoyrAI Greens Forest Canopy",   ["#2d6a4f","#52b788","#95d5b2"]],
    ["RoyrAI Greens Mono Green",      ["#1b4332","#40916c","#74c69c"]],
    ["RoyrAI Greens Green Lime",      ["#386641","#6a994e","#a7c957"]],
    ["RoyrAI Greens Sage Garden",     ["#606c38","#a3b18a","#dad7cd"]],
    ["RoyrAI Greens Citrus Bliss",    ["#ff7a00","#a8e10c","#ffe23d"], "#16280d"],
  ]],
  ["Purples & Pinks", [
    ["RoyrAI Purples Star Dust",      ["#cba6f7","#89b4fa","#f5c2e7"]],
    ["RoyrAI Purples Purple Berry",   ["#7b2cbf","#c77dff","#e0aaff"]],
    ["RoyrAI Purples Royal Purple",   ["#7c3aed","#a855f7","#c084fc"]],
    ["RoyrAI Purples Indigo Night",   ["#6366f1","#818cf8","#a5b4fc"]],
    ["RoyrAI Purples Cyberpunk Neon", ["#e040fb","#05d9e8","#d1f7ff"]],
  ]],
  ["Warm — Reds, Oranges & Ambers", [
    ["RoyrAI Warm Red Wine",          ["#5b0e1c","#931c33","#c8455e"]],
    ["RoyrAI Warm Hot Lava",          ["#9d0208","#dc2f02","#ffba08"]],
    ["RoyrAI Warm Sunset Ember",      ["#ff6b35","#f7931e","#ffd166"]],
    ["RoyrAI Warm Peach Sorbet",      ["#e76f51","#f4a261","#e9c46a"]],
    ["RoyrAI Warm Earth Amber",       ["#7a4f01","#d99700","#ffcf56"]],
    ["RoyrAI Warm Mocha Cream",       ["#6f4518","#a47148","#d4a373"]],
  ]],
  ["Metals", [
    ["RoyrAI Metals Silver Spoon",    ["#8c9196","#b5bcc2","#dfe4e8"]],
    ["RoyrAI Metals Golden Land",     ["#9c7a16","#d4a72c","#f5d76e"]],
    ["RoyrAI Metals Bronze Bar",      ["#7a3e1e","#a85a30","#d2854f"], "#150f0e"],
    ["RoyrAI Metals Metalic Wealth",  ["#d4a72c","#dfe4e8","#f5d76e"], "#241310"],
  ]],
  ["Crystals", [
    ["RoyrAI Crystals Labradorite Blue",   ["#5a5248","#2e6db5","#5fb0e8"]],
    ["RoyrAI Crystals Labradorite Green",  ["#57544a","#2f8f5b","#5fd49a"]],
    ["RoyrAI Crystals Labradorite Purple", ["#565049","#6a3fae","#a17be0"]],
    ["RoyrAI Crystals Rose Quartz",        ["#f7c9d4","#e7a6b3","#d28a9c"]],
  ]],
  ["Parrots & Brand", [
    ["RoyrAI Parrots Teal & Gold",       ["#0fa4a0","#f7ce46","#76e4e0"]],
    ["RoyrAI Parrots Golden-Blue Macaw", ["#1565c0","#f9c80e","#4c9a2a"]],
    ["RoyrAI Parrots Scarlet Macaw",     ["#e63016","#f6c213","#1b6fc4"]],
  ]],
];

// ── color math (mirrors the preview) ──
const hex2rgb = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
const clamp = v => Math.round(Math.max(0, Math.min(255, v)));
const rgb2hex = ([r,g,b]) => "#" + [r,g,b].map(v => clamp(v).toString(16).padStart(2,"0")).join("");
const lum = h => { const [r,g,b]=hex2rgb(h); return 0.299*r+0.587*g+0.114*b; };
const mix = (a,b,t) => { const A=hex2rgb(a), B=hex2rgb(b); return rgb2hex([0,1,2].map(i => A[i]+(B[i]-A[i])*t)); };
const alpha = (hex, aa) => hex + aa; // aa is a 2-char hex string

const deriveBg = cols => {
  const darkest = cols.slice().sort((a,b)=>lum(a)-lum(b))[0];
  return mix(darkest, "#0a0a0d", 0.86);
};
const deriveFg = cols => {
  const lightest = cols.slice().sort((a,b)=>lum(b)-lum(a))[0];
  return mix(lightest, "#f4f4fa", 0.7);
};

const slug = name => name.toLowerCase()
  .replace(/&/g, "and")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

function buildTheme(name, cols, bgOverride) {
  const [c1, c2, c3] = cols;            // keyword, string, func
  const bg  = bgOverride || deriveBg(cols);
  const fg  = deriveFg(cols);
  const cmt = mix(fg, bg, 0.5);          // muted comment
  const num = mix(c2, c3, 0.5);          // numbers/constants
  const punct = mix(fg, bg, 0.32);       // operators/punctuation

  const bgDark   = mix(bg, "#000000", 0.45);  // activity bar / title bar
  const bgPanel  = mix(bg, "#000000", 0.25);  // side bar / tabs strip
  const bgLight  = mix(bg, fg, 0.06);         // line highlight / hover
  const bgSel    = mix(bg, c1, 0.30);         // selection

  return {
    name,
    type: "dark",
    semanticHighlighting: true,
    colors: {
      "focusBorder": c1,
      "foreground": fg,
      "editor.background": bg,
      "editor.foreground": fg,
      "editorLineNumber.foreground": mix(fg, bg, 0.6),
      "editorLineNumber.activeForeground": c3,
      "editorCursor.foreground": c3,
      "editor.selectionBackground": bgSel,
      "editor.selectionHighlightBackground": alpha(c1, "22"),
      "editor.lineHighlightBackground": bgLight,
      "editor.findMatchBackground": alpha(c3, "55"),
      "editor.findMatchHighlightBackground": alpha(c3, "33"),
      "editorWhitespace.foreground": mix(bg, fg, 0.18),
      "editorIndentGuide.background1": mix(bg, fg, 0.12),
      "editorIndentGuide.activeBackground1": mix(bg, fg, 0.3),
      "editorBracketMatch.border": c3,
      "editorWidget.background": bgPanel,
      "editorHoverWidget.background": bgPanel,
      "editorSuggestWidget.background": bgPanel,
      "editorSuggestWidget.selectedBackground": bgSel,

      "sideBar.background": bgPanel,
      "sideBar.foreground": mix(fg, bg, 0.15),
      "sideBarTitle.foreground": fg,
      "sideBarSectionHeader.background": bgDark,

      "activityBar.background": bgDark,
      "activityBar.foreground": c3,
      "activityBar.inactiveForeground": mix(fg, bg, 0.55),
      "activityBarBadge.background": c1,
      "activityBarBadge.foreground": lum(c1) > 140 ? "#111111" : "#ffffff",

      "titleBar.activeBackground": bgDark,
      "titleBar.activeForeground": fg,
      "titleBar.inactiveBackground": bgDark,

      "statusBar.background": bgDark,
      "statusBar.foreground": mix(fg, bg, 0.1),
      "statusBar.noFolderBackground": bgDark,
      "statusBar.debuggingBackground": c1,

      "tab.activeBackground": bg,
      "tab.inactiveBackground": bgPanel,
      "tab.activeForeground": fg,
      "tab.inactiveForeground": mix(fg, bg, 0.5),
      "tab.activeBorderTop": c3,
      "tab.border": bgDark,
      "editorGroupHeader.tabsBackground": bgPanel,
      "editorGroup.border": bgDark,

      "panel.background": bg,
      "panel.border": bgDark,
      "panelTitle.activeForeground": fg,
      "panelTitle.inactiveForeground": mix(fg, bg, 0.5),

      "list.activeSelectionBackground": bgSel,
      "list.activeSelectionForeground": fg,
      "list.hoverBackground": bgLight,
      "list.highlightForeground": c3,

      "badge.background": c1,
      "badge.foreground": lum(c1) > 140 ? "#111111" : "#ffffff",
      "button.background": c1,
      "button.foreground": lum(c1) > 140 ? "#111111" : "#ffffff",
      "button.hoverBackground": mix(c1, fg, 0.15),
      "progressBar.background": c3,

      "input.background": bgLight,
      "input.foreground": fg,
      "input.border": mix(bg, fg, 0.15),
      "inputOption.activeBorder": c3,
      "dropdown.background": bgPanel,

      "scrollbarSlider.background": alpha(fg, "22"),
      "scrollbarSlider.hoverBackground": alpha(fg, "33"),
      "scrollbarSlider.activeBackground": alpha(fg, "44"),

      "textLink.foreground": c3,
      "textLink.activeForeground": c2,

      "gitDecoration.modifiedResourceForeground": c3,
      "gitDecoration.addedResourceForeground": c2,
      "gitDecoration.deletedResourceForeground": mix("#e53e3e", fg, 0.2),
      "gitDecoration.untrackedResourceForeground": c1,

      "terminal.background": bg,
      "terminal.foreground": fg,
      "terminalCursor.foreground": c3,

      "minimap.selectionHighlight": c1,
    },
    tokenColors: [
      { scope: ["comment", "punctuation.definition.comment"],
        settings: { foreground: cmt, fontStyle: "italic" } },
      { scope: ["string", "string.quoted", "string.template", "punctuation.definition.string"],
        settings: { foreground: c2 } },
      { scope: ["constant.numeric", "constant.language", "constant.character", "constant.other"],
        settings: { foreground: num } },
      { scope: ["keyword", "keyword.control", "storage", "storage.type", "storage.modifier", "keyword.operator.new"],
        settings: { foreground: c1 } },
      { scope: ["keyword.operator", "punctuation", "meta.brace", "punctuation.separator", "punctuation.terminator"],
        settings: { foreground: punct } },
      { scope: ["entity.name.function", "support.function", "meta.function-call", "variable.function"],
        settings: { foreground: c3 } },
      { scope: ["entity.name.type", "entity.name.class", "support.type", "support.class", "entity.other.inherited-class"],
        settings: { foreground: mix(c3, fg, 0.15) } },
      { scope: ["variable", "variable.other", "meta.definition.variable"],
        settings: { foreground: fg } },
      { scope: ["variable.parameter"],
        settings: { foreground: mix(fg, c3, 0.25) } },
      { scope: ["variable.language", "variable.language.this"],
        settings: { foreground: c1, fontStyle: "italic" } },
      { scope: ["entity.name.tag", "punctuation.definition.tag"],
        settings: { foreground: c1 } },
      { scope: ["entity.other.attribute-name"],
        settings: { foreground: c3 } },
      { scope: ["support.type.property-name", "meta.object-literal.key"],
        settings: { foreground: mix(c3, fg, 0.1) } },
      { scope: ["markup.heading", "entity.name.section"],
        settings: { foreground: c3, fontStyle: "bold" } },
      { scope: ["markup.bold"], settings: { fontStyle: "bold" } },
      { scope: ["markup.italic"], settings: { fontStyle: "italic" } },
      { scope: ["markup.inline.raw", "markup.fenced_code"], settings: { foreground: c2 } },
      { scope: ["invalid", "invalid.illegal"], settings: { foreground: "#ff5370" } },
    ],
  };
}

// ── write files ──
const outDir = __dirname;
const themesDir = path.join(outDir, "themes");
fs.mkdirSync(themesDir, { recursive: true });

const contributes = [];
let count = 0;
for (const [, themes] of groups) {
  for (const [name, cols, bgOverride] of themes) {
    const theme = buildTheme(name, cols, bgOverride);
    const file = `${slug(name)}-color-theme.json`;
    fs.writeFileSync(path.join(themesDir, file), JSON.stringify(theme, null, 2) + "\n");
    contributes.push({ label: name, uiTheme: "vs-dark", path: `./themes/${file}` });
    count++;
  }
}

const pkg = {
  name: "royrai-vscode-themes",
  displayName: "RoyrAI Color Themes",
  description: "A collection of 33 hand-crafted dark color themes, organized into families: blues & teals, greens, purples & pinks, warm tones, metals, labradorite crystals, and parrots.",
  version: "1.0.0",
  publisher: "royrai",
  engines: { vscode: "^1.70.0" },
  categories: ["Themes"],
  keywords: ["theme", "dark", "color theme", "palette", "royrai"],
  galleryBanner: { color: "#0d0d12", theme: "dark" },
  contributes: { themes: contributes },
};
fs.writeFileSync(path.join(outDir, "package.json"), JSON.stringify(pkg, null, 2) + "\n");

console.log(`Generated ${count} themes + package.json`);
