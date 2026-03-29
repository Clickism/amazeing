/**
 * Takes a line that may contain one or more labels, followed by code
 * (the parser prohibits labels after code, so we don't have to format this case in a pretty way).
 * 
 * @param line The line to split into labels and code.
 * @returns An array of strings, where each string is either a label (ending with :) or the code part of the line.
 * For example, "start: loop: add x y z # comment" would be split into ["start:", "loop:", "add x y z # comment"].
 */
function splitCodeAndLabels(line: string): string[] {
    const result: string[] = [];
    if (line.trim() === "") {
        return [""];
    }
    let currentLine = "";
    let i = 0;
    while (i < line.length) {
        const c = line[i];
        if (c === "#") {
            // If we encounter a comment, just add the rest of the line as code and break
            currentLine += line.substring(i);
            break;
        }
        if (c === ":") {
            currentLine += c;
            result.push(currentLine.trim());
            currentLine = "";
            i++;
            // Skip any whitespace immediately after the label, because it would land at the start of a new line otherwise
            while (i < line.length && /\s/.test(line[i])) {
                i++;
            }
        } else {
            currentLine += c;
            i++;
        }
    }

    if (currentLine.trim() !== "") {
        result.push(currentLine.trim());
    }

    return result;
}

/**
 * Formats the given Amazeing code by adding indentation for subroutines and ensuring consistent spacing around comments.
 * 
 * @param code The Amazeing code to format.
 * @returns Formatted Amazeing code with proper indentation and spacing.
 */
export default function formatCode(code: string): string {
    const indentSize = 2;
    let isInSubroutine = false;
    const lines = code.split("\n").flatMap(splitCodeAndLabels);

    const formattedLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        let cleanLine = lines[i].trim();
        const commentIndex = cleanLine.indexOf("#");
        if (commentIndex > 0) {
            const beforeComment = cleanLine.substring(0, commentIndex).trimEnd();
            const commentContent = cleanLine.substring(commentIndex + 1).trimStart();
            cleanLine = `${beforeComment} # ${commentContent}`;
        }
        const isLabel = cleanLine.endsWith(":");
        const indent = (isInSubroutine && !isLabel) ? " ".repeat(indentSize) : "";
        formattedLines.push(indent + cleanLine);

        if (isLabel) {
            isInSubroutine = true;
        } else if (cleanLine.startsWith("ret")) {
            isInSubroutine = false;
        }
    };

    return formattedLines.join("\n");
}
