# go-struct-tag-highlighter

Go Struct Tag Highlighter is a lightweight VS Code extension that highlights struct tag keys and values in Go (.go) files.
It improves readability of struct annotations by applying color-coded syntax highlighting.

__Before__
<p align="center">
    <img src="images/dark_before.png" alt="Dark mode before" width="45%" />
    <img src="images/light_before.png" alt="Light mode before" width="45%" />
</p>

__After__
<p align="center">
    <img src="images/dark_after.png" alt="Dark mode after" width="45%" />
    <img src="images/light_after.png" alt="Light mode after" width="45%" />
</p>

## Features

- Highlights struct tag keys and values.

- Automatically adapts to light and dark themes.

- User-configurable colors in settings.json.

## Extension Settings

This extension contributes the following settings:

* `goStructTagHighlighter.colors.dark.key`: Color for struct tag keys in dark mode.
* `goStructTagHighlighter.colors.dark.value`: Color for struct tag values in dark mode.
* `goStructTagHighlighter.colors.light.key`: Color for struct tag keys in light mode.
* `goStructTagHighlighter.colors.light.value`: Color for struct tag values in light mode.

<!-- ## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension. -->

## Release Notes

### 0.0.1

Initial release
