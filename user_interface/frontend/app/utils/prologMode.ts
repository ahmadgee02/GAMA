export function prolog() {
    return {
        startState: () => ({}),
        token: (stream, state) => {
            if (stream.match(/^%.*/)) return "comment";
            if (stream.match(/^[A-Z_][A-Za-z0-9_]*/)) return "variableName";
            if (stream.match(/^[a-z][A-Za-z0-9_]*/)) return "atom";
            if (stream.match(/^\d+/)) return "number";
            stream.next();
            return null;
        },
    };
}