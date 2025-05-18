// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "chromium-cl-viewer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('chromium-cl-viewer.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Inline Code Review Comments!');
	});

	context.subscriptions.push(disposable);

	const showCommentsDisposable = vscode.commands.registerCommand('chromium-cl-viewer.showComments', async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders || workspaceFolders.length === 0) {
			vscode.window.showErrorMessage('No workspace folder found.');
			return;
		}
		const cwd = workspaceFolders[0].uri.fsPath;
		try {
			const exec = require('child_process').exec;
			exec('git cl comments --json -', { cwd }, (error: any, stdout: string, stderr: string) => {
				if (error) {
					vscode.window.showErrorMessage('Failed to run git cl comments: ' + stderr);
					return;
				}
				// Only the last non-empty line of stdout is the JSON
				const lines = stdout.split(/\r?\n/).filter((line: string) => line.trim() !== '');
				const lastLine = lines[lines.length - 1];
				try {
					const comments = JSON.parse(lastLine);
					vscode.window.showInformationMessage('Loaded ' + comments.length + ' code review comments.');
					// TODO: Display comments inline in the editor
				} catch (parseErr) {
					vscode.window.showErrorMessage('Failed to parse comments JSON.');
				}
			});
		} catch (err) {
			vscode.window.showErrorMessage('Error running git cl comments: ' + err);
		}
	});
	context.subscriptions.push(showCommentsDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
