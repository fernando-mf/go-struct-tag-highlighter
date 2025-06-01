// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { getColorConfigForCurrentTheme } from './config';
import { debounce } from './utils';

let tagKeyDecoration: vscode.TextEditorDecorationType;
let tagValueDecoration: vscode.TextEditorDecorationType;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// This line of code will only be executed once when your extension is activated
	console.log('Extension "go-struct-tag-highlighter" is now active');

	const debouncedApplyStyles = debounce(applyStylesToActiveEditor, 50);

	loadBlockStyles();
	debouncedApplyStyles();

	vscode.workspace.onDidChangeTextDocument(debouncedApplyStyles);
	vscode.workspace.onDidOpenTextDocument(debouncedApplyStyles);
	vscode.window.onDidChangeActiveColorTheme(() => {
		loadBlockStyles();
		debouncedApplyStyles();
	});
	vscode.workspace.onDidChangeConfiguration(() => {
		loadBlockStyles();
		debouncedApplyStyles();
	});

	// TODO: these might be needed in the future
	// vscode.window.onDidChangeActiveTextEditor();
	// vscode.window.onDidChangeVisibleTextEditors();
	// vscode.window.onDidChangeTextEditorVisibleRanges();
}

// This method is called when your extension is deactivated
export function deactivate() { }

function applyStylesToActiveEditor() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		throw new Error('No active text editor found');
	}

	if (editor.document.languageId !== 'go') {
		return;
	}

	const keyRanges: vscode.DecorationOptions[] = [];
	const valueRanges: vscode.DecorationOptions[] = [];

	const regEx = /(\w+):"([^"]*)"/g;
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