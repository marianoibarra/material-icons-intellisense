import escape from "regexp.escape";
import { Position, Range, TextDocument } from "vscode";
import { Matches } from "./types";

export function match(document: TextDocument, position: Position, matches: Matches): boolean {
  // Regexps to match the opening tag of a mat-icon element
  const openingTagMatIconRegex = /<mat-icon(\s+[^>]*)?\n?\s*>$/;
  const closingTagMatIconRegex = /^<\/(mat-icon)\n?\s*>/;

  // Regexps to match the opening and closing tags of user-specified elements with user-specified classes
  const tagsMatch = matches.matchTags.reduce((match, htmlTag) => match + "|" + escape(htmlTag));
  const classesMatch = matches.matchClasses.reduce((match, htmlClass) => match + "|" + escape(htmlClass));
  const openingTagRegex =
    new RegExp(`<${tagsMatch}\\s+[^>]*class\\s*=\\s*["'][^"']*(?<![\\w-])(${classesMatch})(?![\\w-])[^"']*["'][^>]*>`);
  const closingTagRegex = new RegExp(`^<\\/(${tagsMatch})\\n?\\s*>`);

  // Get the previous and next lines
  const previousLine = position.line > 0 ? document.lineAt(position.line - 1).text : "";
  const nextLine = position.line < document.lineCount - 1 ? document.lineAt(position.line + 1).text : "";

  // Get the content before and after the current word
  const wordRange: Range = document.getWordRangeAtPosition(position)!;
  const currentLineStart = document.lineAt(position.line).text.slice(0, wordRange.start.character);
  const currentLineEnd = document.lineAt(position.line).text.slice(wordRange.end.character);

  // Join the previous and next lines with the current line content
  const previousContent = (previousLine + currentLineStart).trim();
  const nextContent = (currentLineEnd + nextLine).trim();

  // Check if the current line is a mat-icon element
  const openingTagMatIconMatch = previousContent.match(openingTagMatIconRegex);
  const closingTagMatIconMatch = nextContent.match(closingTagMatIconRegex);
  // Check if the current line matches user configuration
  const openingTagMatch = previousContent.match(openingTagRegex);
  const closingTagMatch = nextContent.match(closingTagRegex);

  return Boolean((openingTagMatIconMatch && closingTagMatIconMatch) || (openingTagMatch && closingTagMatch));
}
