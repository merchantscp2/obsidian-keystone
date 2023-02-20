// import { KeyPairSyncResult } from 'crypto';
// import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
// import * as internal from 'stream';
// import { KeystoneView, VIEW_TYPE_KEYSTONE } from "./views/keystone-view";

import {Editor, Plugin, MarkdownView, Notice} from 'obsidian';
const ks = require('./keystone')(app);

// interface KeystonePluginSettings {
// 	mySetting: string;
// }

// const DEFAULT_SETTINGS: KeystonePluginSettings = {
// 	mySetting: 'default'
// }

export default class KeystonePlugin extends Plugin {
	// settings: KeystonePluginSettings;

	async onload() {
		
		this.addCommand({
			id: 'keystone-assemble-arm',
			name: 'ARM',
			editorCheckCallback: (check: boolean, editor: Editor, view: MarkdownView) => this.assemble_arm(check, editor, view, ks.ARCH_ARM, ks.MODE_LITTLE_ENDIAN)
		});
		this.addCommand({
			id: 'keystone-assemble-arm64',
			name: 'ARM64',
			editorCheckCallback: (check: boolean, editor: Editor, view: MarkdownView) => this.assemble_arm(check, editor, view, ks.ARCH_ARM64, ks.MODE_LITTLE_ENDIAN)
		});
		this.addCommand({
			id: 'keystone-assemble-x86',
			name: 'x86_64',
			editorCheckCallback: (check: boolean, editor: Editor, view: MarkdownView) => this.assemble_arm(check, editor, view, ks.ARCH_X86, ks.MODE_64)
		});

		// this.addRibbonIcon("cpu", "Keystone Assembler", () => {
		// 	this.activateView();
		//   });

		// This adds a settings tab so the user can configure various aspects of the plugin
		//this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		//this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}
	assemble_arm(check: boolean, editor: Editor, view: MarkdownView, arch: number, mode: number): boolean | void {
		if(check) { // checking if we should run
			return editor.getSelection().length != 0;
		} else {
			var asm = this.do_assemble(editor.getSelection(), arch, mode)
			editor.replaceSelection(asm);
		}
	}

	do_assemble(asm: string, arch: number, mode: number) {
		const lines = asm.split('\n');

		let evaluatedLines = [];
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const asm = ks.assemble(line, arch, mode);
			if(asm.hex.length < 1) {
				new Notice(`Failed to assemble ${line} at line ${(i+1)} of selection`);
				evaluatedLines.push(asm.asm);
			} else 
				evaluatedLines.push(asm.asm + " -> " + asm.hex);
		}
		const formatedResult = evaluatedLines.join('\n');
		return formatedResult;
	}

	onunload() {
	}

	// async loadSettings() {
	// 	this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	// }

	// async saveSettings() {
	// 	await this.saveData(this.settings);
	// }
}

// class SampleSettingTab extends PluginSettingTab {
// 	plugin: MyPlugin;

// 	constructor(app: App, plugin: MyPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		const {containerEl} = this;

// 		containerEl.empty();

// 		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

// 		new Setting(containerEl)
// 			.setName('Setting #1')
// 			.setDesc('It\'s a secret')
// 			.addText(text => text
// 				.setPlaceholder('Enter your secret')
// 				.setValue(this.plugin.settings.mySetting)
// 				.onChange(async (value) => {
// 					console.log('Secret: ' + value);
// 					this.plugin.settings.mySetting = value;
// 					await this.plugin.saveSettings();
// 				}));
// 	}
// }
