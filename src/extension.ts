import * as vscode from 'vscode'

export function activate(context : vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand('vscode-remote-compiler', () => {

			const panel = vscode.window.createWebviewPanel(
				'remoteCompiler',
				'Remote Compiler',
				vscode.ViewColumn.One,
				{
					enableScripts : true
				}
			);

			panel.webview.html = getWebviewContent();

			panel.webview.onDidReceiveMessage(
				async (message) => {
					if(message.command === 'runCode'){
						const activateEditor = vscode.window.activeTextEditor;
						if(activateEditor){
							const code = activateEditor.document.getText();


							const result = await sendCodeToBackend(code, message.input);

							panel.webview.postMessage({
								command : 'runCodeResult',
								output : result
							});
						}
					}
				},
				undefined,
				context.subscriptions
			);

		})
	);
}

async function sendCodeToBackend(code : string, input : string) {
	try{
		const uniqueId = Date.now().toString();
		const response = await fetch('http://localhost:5000/run',{
			method : 'POST',
			headers : {
				'Content-Type' : 'application/json'
			},
			body : JSON.stringify({code, input, request : uniqueId})

		});
		const data = (await response.json()) as { output : string};
		return data.output; 
	}catch(e){
		console.error('Error:',e);
		return 'Eror communicating with the backend';
	}
}

function getWebviewContent() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Remote Compiler</title>
            <script type="module" crossorigin src="http://localhost:5173/src/main.tsx"></script>
        </head>
        <body>
            <div id="root"></div>
        </body>
        </html>
    `;
}

export function deactivate() {}