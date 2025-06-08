// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { getColorConfigForCurrentTheme, getConfig } from './config';
import { debounce } from './utils';

let tagKeyDecoration: vscode.TextEditorDecorationType;
let tagValueDecoration: vscode.TextEditorDecorationType;

let cfg: ReturnType<typeof getConfig>;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// This line of code will only be executed once when your extension is activated
	console.log('Extension "go-struct-tag-highlighter" is now active');

	cfg = getConfig();
	loadBlockStyles();
	applyStylesToActiveEditor();

	const debouncedApplyStyles = debounce(applyStylesToActiveEditor, 50);
	vscode.workspace.onDidChangeTextDocument(debouncedApplyStyles);

	vscode.window.onDidChangeActiveTextEditor(applyStylesToActiveEditor);
	vscode.workspace.onDidOpenTextDocument(applyStylesToActiveEditor);
	vscode.window.onDidChangeActiveColorTheme(() => {
		loadBlockStyles();
		applyStylesToActiveEditor();
	});
	vscode.workspace.onDidChangeConfiguration(() => {
		cfg = getConfig();
		loadBlockStyles();
		debouncedApplyStyles();
	});

	// TODO: these might be needed in the future
	// vscode.window.onDidChangeVisibleTextEditors();
	// vscode.window.onDidChangeTextEditorVisibleRanges();

	vscode.commands.registerCommand('goStructTagHighlighter.toggleCustomColors', () => {
		cfg.customColorsEnabled.update(!cfg.customColorsEnabled.value);
	});
}

// This method is called when your extension is deactivated
export function deactivate() { }

function applyStylesToActiveEditor() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		console.error('No active text editor found.');
		return;
	}

	if (editor.document.languageId !== 'go') {
		return;
	}

	if (!cfg.customColorsEnabled.value) {
		return;
	}

	const keyRanges: vscode.DecorationOptions[] = [];
	const valueRanges: vscode.DecorationOptions[] = [];

	const regEx = /(\w+):"([^"\n]*)"/g;
	const text = editor.document.getText();

	let match;
	while ((match = regEx.exec(text))) {
		const keyStart = match.index;
		const keyEnd = keyStart + match[1].length;

		const valueStart = match.index + match[0].indexOf('"');
		const valueEnd = match.index + match[0].lastIndexOf('"') + 1;

		keyRanges.push({
			range: new vscode.Range(
				editor.document.positionAt(keyStart),
				editor.document.positionAt(keyEnd)
			)
		});

		valueRanges.push({
			range: new vscode.Range(
				editor.document.positionAt(valueStart),
				editor.document.positionAt(valueEnd)
			)
		});
	}

	editor.setDecorations(tagKeyDecoration, keyRanges);
	editor.setDecorations(tagValueDecoration, valueRanges);
}

function loadBlockStyles() {
	const colorCfg = getColorConfigForCurrentTheme();

	tagKeyDecoration?.dispose();
	tagValueDecoration?.dispose();

	tagKeyDecoration = vscode.window.createTextEditorDecorationType({ color: colorCfg.key });
	tagValueDecoration = vscode.window.createTextEditorDecorationType({ color: colorCfg.value });
}