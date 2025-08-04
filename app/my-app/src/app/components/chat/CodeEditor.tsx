// CodeEditor.tsx
import React, { useEffect, useRef, FC } from 'react';
import Editor, { useMonaco, OnMount } from '@monaco-editor/react';
import Modal from '../common/Modal';
// import * as monaco from 'monaco-editor';

interface Props {
    isOpen: boolean
    value?: string;
    onCancel: () => void;
    onSave: (code: string) => void;
}

const CodeEditor: FC<Props> = (props) => {
    const { isOpen, value, onCancel, onSave } = props;
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

    if (!monacoInstance) {
        return <></>
    }

    const handleSave = () => {
        if (editorRef.current) {
            const code = editorRef.current.getValue();
            onSave(code);
            onCancel();
        }
    }

    return (
        <Modal open={isOpen} onClose={()=> onCancel()}>
            Proglog Code Editor
            <Editor
                height="600px"
                defaultLanguage="prolog"
                defaultValue={value}
                onMount={handleEditorDidMount}
            />

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    onClick={onCancel}
                    type="button"
                    className="cursor-pointer text-sm/6 font-semibold text-white">
                    Cancel
                </button>

                <button
                    onClick={handleSave}
                    type="submit"
                    className="cursor-pointer rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                    Save
                </button>
            </div>
        </Modal>
    );
};

export default CodeEditor;
