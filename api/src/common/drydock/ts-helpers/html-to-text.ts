const replaceWithNewLine: Array<RegExp> = [
    /<br>/g,
    /<p\b[^>]*>/g,
    /<img\b[^>]*>/g,
    /<\/p>/g,
    /<\/?h\d+>/g,
    /<blockquote\b[^>]*>/g,
    /<\/blockquote>/g,
];
const replaceWithEmptyString: Array<RegExp> = [
    /<b\b[^>]*>/g,
    /<\/b>/g,
    /<em\b[^>]*>/g,
    /<\/em>/g,
    /<pre\b[^>]*>/g,
    /<\/pre>/g,
    /<strong\b[^>]*>/g,
    /<\/strong>/g,
    /<span\b[^>]*>/g,
    /<\/span>/g,
];

export function transformHtmlToText(html: string) {
    if (!html) return null;
    let text = html;
    replaceWithNewLine.forEach((reg) => {
        text = text.replace(reg, '\n');
    });
    replaceWithEmptyString.forEach((reg) => {
        text = text.replace(reg, '');
    });
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/\x0B/g, '');
    text = text
        .split(' ')
        .filter((s) => s.trim().length)
        .join(' ');
    text = text
        .split('\n')
        .filter((s) => s.trim().length)
        .join('\n');
    return text;
}
