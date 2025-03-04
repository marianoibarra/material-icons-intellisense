import * as path from "path";
import * as vscode from "vscode";
import { CompletionProvider } from "./providers/completion-provider";
import { HoverProvider } from "./providers/hover-provider";
import { loadConfiguration } from "./utils/configuration";
import { Icon, IconRaw } from "./utils/types";

const disposables: vscode.Disposable[] = [];

function clearAndLoadExtension(context: vscode.ExtensionContext) {
  unregisterProviders(context);
  registerProviders(context);
}

function unregisterProviders(context: vscode.ExtensionContext) {
  for (const disposable of disposables) {
    const existingIndex = context.subscriptions.indexOf(disposable);
    if (existingIndex !== -1) {
      context.subscriptions.splice(existingIndex, 1);
    }

    disposable.dispose();
  }
}

function registerProviders(context: vscode.ExtensionContext) {
  const config = loadConfiguration();
  const selector: vscode.DocumentSelector = { language: "html", scheme: "file" };

  const data = require(path.join(path.dirname(__dirname), `data/material-v${config.version}`, "icons.json")) as Record<string, IconRaw>;
  const icons = Object.entries(data).map(([name, entry]) => new Icon(name, entry, config));

  const provideCompletionItems = new CompletionProvider(icons, config.matches);
  const provideHoverItems = new HoverProvider(icons, config.matches);

  disposables.push(
    vscode.languages.registerCompletionItemProvider(selector, provideCompletionItems),
    vscode.languages.registerHoverProvider(selector, provideHoverItems)
  );

  context.subscriptions.push(...disposables);
}

export function activate(context: vscode.ExtensionContext) {
  vscode.workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration("material-icons-intellisense")) {
      clearAndLoadExtension(context);
    }
  });

  clearAndLoadExtension(context);
}

export function deactivate() {}
