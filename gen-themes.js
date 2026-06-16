/* Generator for the Royr Color Themes VSCode extension.
   Expands each 3-accent palette (keyword / string / func) + background into a
   full VSCode color theme, then writes package.json + themes/*.json.
   Uses the same color math as the HTML palette previews so themes match. */

const fs = require("fs");
const path = require("path");

const { groups } = require("./themes-data");

// ── color math (mirrors the preview) ──
const parseHex = (hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

const clampChannel = (value) => Math.round(Math.max(0, Math.min(255, value)));

const formatHex = ([red, green, blue]) =>
  "#" +
  [red, green, blue]
    .map((channel) => clampChannel(channel).toString(16).padStart(2, "0"))
    .join("");

const getLuminance = (hex) => {
  const [red, green, blue] = parseHex(hex);
  return 0.299 * red + 0.587 * green + 0.114 * blue;
};

const mixHex = (colorA, colorB, ratio) => {
  const rgbA = parseHex(colorA);
  const rgbB = parseHex(colorB);
  return formatHex(
    [0, 1, 2].map((idx) => rgbA[idx] + (rgbB[idx] - rgbA[idx]) * ratio),
  );
};

// alphaHex is a 2-char hex string appended as an opacity suffix
const addAlpha = (hex, alphaHex) => hex + alphaHex;

const deriveBg = (accents) => {
  const darkest = accents
    .slice()
    .sort((colorA, colorB) => getLuminance(colorA) - getLuminance(colorB))[0];
  return mixHex(darkest, "#0a0a0d", 0.86);
};

const deriveFg = (accents) => {
  const lightest = accents
    .slice()
    .sort((colorA, colorB) => getLuminance(colorB) - getLuminance(colorA))[0];
  return mixHex(lightest, "#f4f4fa", 0.7);
};

const buildSlug = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function buildTheme(theme) {
  const {
    name,
    keyword: keywordColor,
    string: stringColor,
    func: funcColor,
    bg: bgOverride,
    bar,
  } = theme;
  const accents = [keywordColor, stringColor, funcColor];
  const bg = bgOverride || deriveBg(accents);
  const fg = deriveFg(accents);
  const cmt = mixHex(fg, bg, 0.5); // muted comment
  const num = mixHex(stringColor, funcColor, 0.5); // numbers/constants
  const punct = mixHex(fg, bg, 0.32); // operators/punctuation

  const bgDark = mixHex(bg, "#000000", 0.45); // activity bar / title bar
  const bgPanel = mixHex(bg, "#000000", 0.25); // side bar / tabs strip
  const bgLight = mixHex(bg, fg, 0.06); // line highlight / hover
  const bgSel = mixHex(bg, keywordColor, 0.3); // selection

  const badgeFg = getLuminance(keywordColor) > 140 ? "#111111" : "#ffffff";

  const barBg = bar || bgDark; // status bar / activity bar (bar override)
  const barFg = getLuminance(barBg) > 140 ? "#111111" : "#ffffff";

  return {
    name,
    type: "dark",
    semanticHighlighting: true,
    colors: {
      focusBorder: keywordColor,
      foreground: fg,
      "editor.background": bg,
      "editor.foreground": fg,
      "editorLineNumber.foreground": mixHex(fg, bg, 0.6),
      "editorLineNumber.activeForeground": funcColor,
      "editorCursor.foreground": funcColor,
      "editor.selectionBackground": bgSel,
      "editor.selectionHighlightBackground": addAlpha(keywordColor, "22"),
      "editor.lineHighlightBackground": bgLight,
      "editor.findMatchBackground": addAlpha(funcColor, "55"),
      "editor.findMatchHighlightBackground": addAlpha(funcColor, "33"),
      "editorWhitespace.foreground": mixHex(bg, fg, 0.18),
      "editorIndentGuide.background1": mixHex(bg, fg, 0.12),
      "editorIndentGuide.activeBackground1": mixHex(bg, fg, 0.3),
      "editorBracketMatch.border": funcColor,
      "editorWidget.background": bgPanel,
      "editorHoverWidget.background": bgPanel,
      "editorSuggestWidget.background": bgPanel,
      "editorSuggestWidget.selectedBackground": bgSel,

      "sideBar.background": bgPanel,
      "sideBar.foreground": mixHex(fg, bg, 0.15),
      "sideBarTitle.foreground": fg,
      "sideBarSectionHeader.background": bgDark,

      "activityBar.background": barBg,
      "activityBar.foreground": barFg,
      "activityBar.inactiveForeground": mixHex(barFg, barBg, 0.55),
      "activityBarBadge.background": keywordColor,
      "activityBarBadge.foreground": badgeFg,

      "titleBar.activeBackground": bgDark,
      "titleBar.activeForeground": fg,
      "titleBar.inactiveBackground": bgDark,

      "statusBar.background": barBg,
      "statusBar.foreground": mixHex(barFg, barBg, 0.1),
      "statusBar.noFolderBackground": barBg,
      "statusBar.debuggingBackground": keywordColor,

      "tab.activeBackground": bg,
      "tab.inactiveBackground": bgPanel,
      "tab.activeForeground": fg,
      "tab.inactiveForeground": mixHex(fg, bg, 0.5),
      "tab.activeBorderTop": funcColor,
      "tab.border": bgDark,
      "editorGroupHeader.tabsBackground": bgPanel,
      "editorGroup.border": bgDark,

      "panel.background": bg,
      "panel.border": bgDark,
      "panelTitle.activeForeground": fg,
      "panelTitle.inactiveForeground": mixHex(fg, bg, 0.5),

      "list.activeSelectionBackground": bgSel,
      "list.activeSelectionForeground": fg,
      "list.hoverBackground": bgLight,
      "list.highlightForeground": funcColor,

      "badge.background": keywordColor,
      "badge.foreground": badgeFg,
      "button.background": keywordColor,
      "button.foreground": badgeFg,
      "button.hoverBackground": mixHex(keywordColor, fg, 0.15),
      "progressBar.background": funcColor,

      "input.background": bgLight,
      "input.foreground": fg,
      "input.border": mixHex(bg, fg, 0.15),
      "inputOption.activeBorder": funcColor,
      "dropdown.background": bgPanel,

      "scrollbarSlider.background": addAlpha(fg, "22"),
      "scrollbarSlider.hoverBackground": addAlpha(fg, "33"),
      "scrollbarSlider.activeBackground": addAlpha(fg, "44"),

      "textLink.foreground": funcColor,
      "textLink.activeForeground": stringColor,

      "gitDecoration.modifiedResourceForeground": funcColor,
      "gitDecoration.addedResourceForeground": stringColor,
      "gitDecoration.deletedResourceForeground": mixHex("#e53e3e", fg, 0.2),
      "gitDecoration.untrackedResourceForeground": keywordColor,

      "terminal.background": bg,
      "terminal.foreground": fg,
      "terminalCursor.foreground": funcColor,

      "minimap.selectionHighlight": keywordColor,
    },
    tokenColors: [
      {
        scope: ["comment", "punctuation.definition.comment"],
        settings: { foreground: cmt, fontStyle: "italic" },
      },
      {
        scope: [
          "string",
          "string.quoted",
          "string.template",
          "punctuation.definition.string",
        ],
        settings: { foreground: stringColor },
      },
      {
        scope: [
          "constant.numeric",
          "constant.language",
          "constant.character",
          "constant.other",
        ],
        settings: { foreground: num },
      },
      {
        scope: [
          "keyword",
          "keyword.control",
          "storage",
          "storage.type",
          "storage.modifier",
          "keyword.operator.new",
        ],
        settings: { foreground: keywordColor },
      },
      {
        scope: [
          "keyword.operator",
          "punctuation",
          "meta.brace",
          "punctuation.separator",
          "punctuation.terminator",
        ],
        settings: { foreground: punct },
      },
      {
        scope: [
          "entity.name.function",
          "support.function",
          "meta.function-call",
          "variable.function",
        ],
        settings: { foreground: funcColor },
      },
      {
        scope: [
          "entity.name.type",
          "entity.name.class",
          "support.type",
          "support.class",
          "entity.other.inherited-class",
        ],
        settings: { foreground: mixHex(funcColor, fg, 0.15) },
      },
      {
        scope: ["variable", "variable.other", "meta.definition.variable"],
        settings: { foreground: fg },
      },
      {
        scope: ["variable.parameter"],
        settings: { foreground: mixHex(fg, funcColor, 0.25) },
      },
      {
        scope: ["variable.language", "variable.language.this"],
        settings: { foreground: keywordColor, fontStyle: "italic" },
      },
      {
        scope: ["entity.name.tag", "punctuation.definition.tag"],
        settings: { foreground: keywordColor },
      },
      {
        scope: ["entity.other.attribute-name"],
        settings: { foreground: funcColor },
      },
      {
        scope: ["support.type.property-name", "meta.object-literal.key"],
        settings: { foreground: mixHex(funcColor, fg, 0.1) },
      },
      {
        scope: ["markup.heading", "entity.name.section"],
        settings: { foreground: funcColor, fontStyle: "bold" },
      },
      { scope: ["markup.bold"], settings: { fontStyle: "bold" } },
      { scope: ["markup.italic"], settings: { fontStyle: "italic" } },
      {
        scope: ["markup.inline.raw", "markup.fenced_code"],
        settings: { foreground: stringColor },
      },
      {
        scope: ["invalid", "invalid.illegal"],
        settings: { foreground: "#ff5370" },
      },
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
  for (const themeData of themes) {
    const theme = buildTheme(themeData);
    const file = `${buildSlug(themeData.name)}-color-theme.json`;
    fs.writeFileSync(
      path.join(themesDir, file),
      JSON.stringify(theme, null, 2) + "\n",
    );
    contributes.push({
      label: themeData.name,
      uiTheme: "vs-dark",
      path: `./themes/${file}`,
    });
    count++;
  }
}

// Read the existing package.json and update only the themes list,
// leaving version, description, and everything else untouched.
const pkgPath = path.join(outDir, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.contributes = { ...pkg.contributes, themes: contributes };
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

console.log(`Generated ${count} themes + package.json`);
