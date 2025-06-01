import * as vscode from 'vscode';

function rawConfig() {
    const cfg = vscode.workspace.getConfiguration(`goStructTagHighlighter`);

    return {
        colorsLight: {
            key: cfg.get<string>(`colors.light.key`),
            value: cfg.get<string>(`colors.light.value`)
        },
        colorsDark: {
            key: cfg.get<string>(`colors.dark.key`),
            value: cfg.get<string>(`colors.dark.value`)
        },
    };
}

export function getColorConfigForCurrentTheme() {
    const cfg = rawConfig();

    const currentThemeMode = vscode.window.activeColorTheme.kind;

    const themeKindToColorScheme = {
        [vscode.ColorThemeKind.Light]: cfg.colorsLight,
        [vscode.ColorThemeKind.Dark]: cfg.colorsDark,
        [vscode.ColorThemeKind.HighContrast]: cfg.colorsDark,
        [vscode.ColorThemeKind.HighContrastLight]: cfg.colorsLight,
    };

    return themeKindToColorScheme[currentThemeMode] ?? cfg.colorsDark;
}
