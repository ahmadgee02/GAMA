// CodeEditor.tsx
import React, { useEffect, useRef, FC } from 'react';
import Editor, { useMonaco, OnMount } from '@monaco-editor/react';
// import * as monaco from 'monaco-editor';

interface Props {
    value: string;
    readOnly?: boolean;
    onChange?: (code: string | undefined) => void;
}

const CodeEditor: FC<Props> = (props) => {
    const { value, onChange, readOnly = false } = props;
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const monacoInstance = useMonaco();

    useEffect(() => {
        if (!monacoInstance) return;
        // Register Prolog language
        monacoInstance.languages.register({ id: "prolog" });

        // Monarch tokenizer
        monacoInstance.languages.setMonarchTokensProvider("prolog", {
            tokenizer: {
                root: [
                    // --- Multi-line comment start ---
                    [/\/\*/, "comment", "@comment"],

                    // Single-line comment
                    [/%.*$/, "comment"],

                    // Atoms and variables
                    [/([a-z][A-Za-z0-9_]*)/, "identifier"],
                    [/([A-Z_][A-Za-z0-9_]*)/, "variable"],

                    // Strings
                    [/"([^"\\]|\\.)*$/, "string.invalid"], // non-terminated
                    [/"([^"\\]|\\.)*"/, "string"],

                    // Punctuation
                    [/[().,:-]/, "delimiter"],
                ],

                // --- Multi-line comment state ---
                comment: [
                    [/[^\/*]+/, "comment"],
                    [/\*\//, "comment", "@pop"],
                    [/[\/*]/, "comment"]
                ],
            },
        });

        monacoInstance.languages.setLanguageConfiguration("prolog", {
            comments: {
                lineComment: "%",
            },
            brackets: [["(", ")"]],
            autoClosingPairs: [
                { open: '"', close: '"' },
                { open: "(", close: ")" },
            ],
        });
    }, [monacoInstance]);

    // Basic Prolog linter to simulate diagnostics
    const runDiagnostics = (value: string) => {
        if (!editorRef.current || !monacoInstance) return;
        const model = editorRef.current.getModel();
        if (!model) return;
        const lines = value.split("\n");
        const markers: monaco.editor.IMarkerData[] = [];

        lines.forEach((line, index) => {
            const lineNum = index + 1;
            const trimmed = line.trim();

            // Skip full-line comments and empty lines
            if (trimmed === "" || trimmed.startsWith("%") || trimmed.startsWith("/*")) return;

            // Strip inline comment portion
            const lineNoComment = trimmed.split("%")[0].trim();

            // Skip lines ending with known continuation symbols
            const allowedEndings = [".", ":-", ",", "->", ";"];
            const endsProperly = allowedEndings.some((ending) => lineNoComment.endsWith(ending));
            if (!endsProperly) {
                markers.push({
                    severity: monaco.MarkerSeverity.Error,
                    message: "Line should end with '.', ':-', ',', or another Prolog clause symbol.",
                    startLineNumber: lineNum,
                    endLineNumber: lineNum,
                    startColumn: 1,
                    endColumn: line.length + 1,
                });
            }

            // Check for balanced parentheses, ignoring quoted atoms
            const stripped = lineNoComment.replace(/'[^']*'/g, "");
            const openParens = (stripped.match(/\(/g) || []).length;
            const closeParens = (stripped.match(/\)/g) || []).length;
            if (openParens !== closeParens) {
                markers.push({
                    severity: monaco.MarkerSeverity.Warning,
                    message: "Unbalanced parentheses.",
                    startLineNumber: lineNum,
                    endLineNumber: lineNum,
                    startColumn: 1,
                    endColumn: line.length + 1,
                });
            }
        });

        monacoInstance.editor.setModelMarkers(model, "prolog", markers);
    };

    const handleEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor;
        const model = editor.getModel();
        if (!model) return;
        runDiagnostics(model.getValue());
        model.onDidChangeContent(() => {
            const value = model.getValue();
            runDiagnostics(value);
        });
    };

    if (!monacoInstance) { return }

    return (
        <Editor
            height="100%"
            defaultLanguage="prolog"
            defaultValue={value}
            onMount={handleEditorDidMount}
            onChange={onChange}
            theme='vs-dark'
            options={{ readOnly }}
        />
    );
};

export default CodeEditor;
