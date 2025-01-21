// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as https from 'https';

interface StatusResponse {
	status: {
		indicator: string;
		description: string;
	};
}

interface ServiceStatus {
	openai: string;
	anthropic: string;
	cursor: string;
}

let statusBarItem: vscode.StatusBarItem;
let showText: boolean = false;
let serviceStatus: ServiceStatus = {
	openai: 'normal',
	anthropic: 'normal',
	cursor: 'normal'
};
let hasShownCursorDegradedNotification = false;

function fetchOpenAIStatus(): Promise<void> {
	return new Promise((resolve, reject) => {
		https.get('https://status.openai.com/api/v2/status.json', (res) => {
			let data = '';
			
			res.on('data', (chunk) => {
				data += chunk;
			});
			
			res.on('end', () => {
				try {
					const response = JSON.parse(data) as StatusResponse;
					serviceStatus.openai = response.status.indicator === 'none' ? 'normal' : 'degraded';
					updateStatusText();
					resolve();
				} catch (error) {
					console.error('Error parsing OpenAI status:', error);
					reject(error);
				}
			});
		}).on('error', (error) => {
			console.error('Error fetching OpenAI status:', error);
			reject(error);
		});
	});
}

function fetchAnthropicStatus(): Promise<void> {
	return new Promise((resolve, reject) => {
		https.get('https://status.anthropic.com/api/v2/status.json', (res) => {
			let data = '';
			
			res.on('data', (chunk) => {
				data += chunk;
			});
			
			res.on('end', () => {
				try {
					const response = JSON.parse(data) as StatusResponse;
					serviceStatus.anthropic = response.status.indicator === 'none' ? 'normal' : 'degraded';
					updateStatusText();
					resolve();
				} catch (error) {
					console.error('Error parsing OpenAI status:', error);
					reject(error);
				}
			});
		}).on('error', (error) => {
			console.error('Error fetching OpenAI status:', error);
			reject(error);
		});
	});
}

function fetchCursorStatus(): Promise<void> {
	return new Promise((resolve, reject) => {
		https.get('https://status.cursor.com/api/v2/status.json', (res) => {
			let data = '';
			
			res.on('data', (chunk) => {
				data += chunk;
			});
			
			res.on('end', () => {
				try {
					const response = JSON.parse(data) as StatusResponse;
					const newStatus = response.status.indicator === 'none' ? 'normal' : 'degraded';
					serviceStatus.cursor = newStatus;
					updateStatusText();
					checkCursorDegradation();
					resolve();
				} catch (error) {
					console.error('Error parsing OpenAI status:', error);
					reject(error);
				}
			});
		}).on('error', (error) => {
			console.error('Error fetching OpenAI status:', error);
			reject(error);
		});
	});
}

async function refreshStatus(showNotification: boolean = false) {
	try {
		await fetchOpenAIStatus();
		await fetchAnthropicStatus();
		await fetchCursorStatus();
		if (showNotification) {
			vscode.window.showInformationMessage('Services status refreshed');
		}
	} catch (error) {
		if (showNotification) {
			vscode.window.showErrorMessage('Failed to refresh services status');
		}
	}
}

function checkCursorDegradation() {
	if (serviceStatus.cursor === 'degraded' && !hasShownCursorDegradedNotification) {
		vscode.window.showWarningMessage('Cursor services are currently degraded');
		hasShownCursorDegradedNotification = true;
	} else if (serviceStatus.cursor === 'normal') {
		hasShownCursorDegradedNotification = false;
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Create status bar item with lowest priority to move it to the far right
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 9999999999);
	updateStatusText();
	statusBarItem.color = '#89D185'; // Green color
	
	// Add menu items
	statusBarItem.command = {
		title: 'Show Commands',
		command: 'workbench.action.quickOpen',
		arguments: ['>CursorStatus']
	};
	statusBarItem.tooltip = 'Click to show commands';
	statusBarItem.show();

	// Initial status fetch for all services
	refreshStatus(false);

	// Set up staggered periodic refresh (every 5 minutes) for each service
	const openaiInterval = setInterval(async () => {
		try {
			await fetchOpenAIStatus();
		} catch (error) {
			console.error('Failed to refresh OpenAI status:', error);
		}
	}, 300000); // 5 minutes

	const anthropicInterval = setInterval(async () => {
		try {
			await fetchAnthropicStatus();
		} catch (error) {
			console.error('Failed to refresh Anthropic status:', error);
		}
	}, 300000); // 5 minutes

	const cursorInterval = setInterval(async () => {
		try {
			await fetchCursorStatus();
		} catch (error) {
			console.error('Failed to refresh Cursor status:', error);
		}
	}, 300000); // 5 minutes

	// Register commands
	context.subscriptions.push(
		vscode.commands.registerCommand('cursorstatus.toggleText', () => {
			showText = !showText;
			updateStatusText();
		}),
		vscode.commands.registerCommand('cursorstatus.refreshStatus', () => {
			refreshStatus(true);
		})
	);

	// Register the status bar item and intervals to be disposed
	context.subscriptions.push(
		statusBarItem,
		{ dispose: () => {
			clearInterval(openaiInterval);
			clearInterval(anthropicInterval);
			clearInterval(cursorInterval);
		}}
	);
}

function updateStatusText() {
	const cursorDegraded = serviceStatus.cursor === 'degraded';
	const aiDegraded = serviceStatus.openai === 'degraded' || serviceStatus.anthropic === 'degraded';
	
	let icon = '$(circle-filled)';
	let color = '#89D185'; // Default green
	let text = 'Working';
	
	if (cursorDegraded) {
		icon = '$(error)';
		color = '#FF0000'; // Red
		text = 'Degraded';
	} else if (aiDegraded) {
		icon = '$(warning)';
		color = '#FF8800'; // Orange
		text = 'Possibly Degrading';
	}
	
	statusBarItem.text = showText ? `${icon} ${text}` : icon;
	statusBarItem.color = color;
	
	// Update tooltip with detailed status in title case
	const formatStatus = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);
	statusBarItem.tooltip = `OpenAI: ${formatStatus(serviceStatus.openai)}\nAnthropic: ${formatStatus(serviceStatus.anthropic)}\nCursor: ${formatStatus(serviceStatus.cursor)}`;
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (statusBarItem) {
		statusBarItem.dispose();
	}
}
