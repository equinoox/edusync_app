export type ChunkContentType = 'text' | 'table' | 'code' | 'formula';

export type TextPage = {
  pageNumber: number;
  text: string;
};

export type SemanticTextChunk = {
  content: string;
  pageNumber: number | null;
  chunkIndex: number;
  contentType: ChunkContentType;
};

type LogicalBlock = {
  content: string;
  contentType: ChunkContentType;
};

const MIN_CHUNK_LENGTH = 180;
const TARGET_CHUNK_LENGTH = 4200;
const MAX_CHUNK_LENGTH = 6200;
const OVERLAP_LENGTH = 160;

const normalizeLineEndings = (value: string) =>
  value
    .replace(/\r\n?/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+$/gm, '')
    .trim();

const normalizeBlock = (value: string) =>
  normalizeLineEndings(value)
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const getLines = (value: string) =>
  normalizeLineEndings(value)
    .split('\n')
    .map(line => line.trimEnd());

const isHeadingLine = (line: string) => {
  const trimmed = line.trim();
  if (trimmed.length < 3 || trimmed.length > 120) return false;
  if (/[.!?,;:]$/.test(trimmed)) return false;

  return (
    /^(\d+(\.\d+)*|[A-Z])\s+[\p{L}\p{N}]/u.test(trimmed) ||
    /^#{1,6}\s+\S/.test(trimmed) ||
    /^[\p{Lu}\p{N}][\p{Lu}\p{N}\s/&+\-()]{4,}$/u.test(trimmed)
  );
};

export const isTableBlock = (value: string) => {
  const lines = getLines(value).filter(line => line.trim().length > 0);
  if (lines.length < 2) return false;

  const pipeRows = lines.filter(line => line.includes('|')).length;
  const tabRows = lines.filter(line => line.includes('\t')).length;
  if (pipeRows >= 2 || tabRows >= 2) return true;

  const columnCounts = lines
    .map(line => line.trim().split(/\s{2,}/).filter(Boolean).length)
    .filter(count => count >= 2);

  if (columnCounts.length < 2) return false;

  const mostCommonCount = columnCounts.reduce<Record<number, number>>(
    (counts, count) => ({
      ...counts,
      [count]: (counts[count] ?? 0) + 1,
    }),
    {},
  );

  return Object.values(mostCommonCount).some(count => count >= 2);
};

const codeLinePatterns = [
  /^\s*(import|export)\s+/,
  /^\s*(const|let|var)\s+\w+/,
  /^\s*(function|class|interface|type|enum)\s+\w+/,
  /^\s*(public|private|protected)\s+\w+/,
  /^\s*def\s+\w+\s*\(/,
  /^\s*(if|else|for|while|switch|try|catch|return)\b/,
  /[{};]\s*$/,
  /=>/,
  /^\s{2,}\S/,
];

export const isCodeBlock = (value: string) => {
  const lines = getLines(value).filter(line => line.trim().length > 0);
  if (lines.length === 0) return false;
  if (/```/.test(value)) return true;

  const codeLikeLines = lines.filter(line =>
    codeLinePatterns.some(pattern => pattern.test(line)),
  ).length;

  const symbolDensity = (value.match(/[{}()[\];=<>]/g)?.length ?? 0) / Math.max(value.length, 1);

  return codeLikeLines >= 2 || (codeLikeLines >= 1 && symbolDensity > 0.035);
};

export const isFormulaBlock = (value: string) => {
  const lines = getLines(value).filter(line => line.trim().length > 0);
  if (lines.length === 0) return false;

  const mathSymbolPattern = /[\u2211\u03a3\u221a\u03c0\u00b1\u2264\u2265\u2260\u222b\u00d7\u00f7]/;
  const expressionPattern =
    /\b[A-Za-z][A-Za-z0-9_]*\s*=\s*[-+*/^()A-Za-z0-9_.\s]+|\b[A-Za-z]\s*[\^]\s*\d+|\d+\s*\/\s*\d+/;

  const formulaLines = lines.filter(line => {
    const trimmed = line.trim();
    if (trimmed.length > 180) return false;
    return mathSymbolPattern.test(trimmed) || expressionPattern.test(trimmed);
  }).length;

  return formulaLines > 0 && formulaLines / lines.length >= 0.25;
};

export const detectContentType = (value: string): ChunkContentType => {
  if (isTableBlock(value)) return 'table';
  if (isCodeBlock(value)) return 'code';
  if (isFormulaBlock(value)) return 'formula';
  return 'text';
};

const mergeContentTypes = (
  first: ChunkContentType,
  second: ChunkContentType,
): ChunkContentType => {
  if (first === 'table' || second === 'table') return 'table';
  if (first === 'code' || second === 'code') return 'code';
  if (first === 'formula' || second === 'formula') return 'formula';
  return 'text';
};

export const splitTextIntoLogicalBlocks = (input: string): LogicalBlock[] => {
  const lines = getLines(input);
  const blocks: LogicalBlock[] = [];
  let currentLines: string[] = [];

  const flush = () => {
    const content = normalizeBlock(currentLines.join('\n'));
    currentLines = [];

    if (content.length === 0) return;

    blocks.push({
      content,
      contentType: detectContentType(content),
    });
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flush();
      continue;
    }

    const lineType = detectContentType(trimmed);
    const currentType = currentLines.length > 0
      ? detectContentType(currentLines.join('\n'))
      : null;

    if (
      currentLines.length > 0 &&
      (isHeadingLine(trimmed) ||
        (currentType !== null &&
          lineType !== currentType &&
          (lineType !== 'text' || currentType !== 'formula') &&
          currentType !== 'text'))
    ) {
      flush();
    }

    currentLines.push(line);
  }

  flush();

  return blocks;
};

const splitOversizedBlock = (block: LogicalBlock): LogicalBlock[] => {
  if (block.content.length <= MAX_CHUNK_LENGTH) return [block];

  const paragraphs = block.content
    .split(/\n{2,}/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean);

  const units = paragraphs.length > 1
    ? paragraphs
    : block.content
        .split(/(?<=[.!?])\s+/)
        .map(sentence => sentence.trim())
        .filter(Boolean);

  const chunks: LogicalBlock[] = [];
  let current = '';

  for (const unit of units) {
    const next = current ? `${current}\n\n${unit}` : unit;

    if (next.length > TARGET_CHUNK_LENGTH && current.length >= MIN_CHUNK_LENGTH) {
      chunks.push({
        content: current,
        contentType: detectContentType(current),
      });
      current = unit;
    } else if (unit.length > MAX_CHUNK_LENGTH) {
      if (current) {
        chunks.push({
          content: current,
          contentType: detectContentType(current),
        });
      }

      for (let index = 0; index < unit.length; index += TARGET_CHUNK_LENGTH) {
        const slice = unit.slice(index, index + TARGET_CHUNK_LENGTH).trim();
        if (slice) {
          chunks.push({
            content: slice,
            contentType: block.contentType,
          });
        }
      }

      current = '';
    } else {
      current = next;
    }
  }

  if (current) {
    chunks.push({
      content: current,
      contentType: detectContentType(current),
    });
  }

  return chunks;
};

const shouldMergeBlocks = (
  current: LogicalBlock,
  next: LogicalBlock,
) => {
  const nextLength = current.content.length + next.content.length + 2;
  if (nextLength > TARGET_CHUNK_LENGTH) return false;

  if (current.contentType === next.contentType) return true;
  if (current.contentType === 'formula' && next.contentType === 'text') return true;
  if (current.contentType === 'text' && next.contentType === 'formula') return true;
  if (current.content.length < MIN_CHUNK_LENGTH && next.contentType !== 'table') return true;

  return false;
};

const createPageChunks = (page: TextPage): Omit<SemanticTextChunk, 'chunkIndex'>[] => {
  const blocks = splitTextIntoLogicalBlocks(page.text).flatMap(splitOversizedBlock);
  const chunks: Omit<SemanticTextChunk, 'chunkIndex'>[] = [];
  let current: LogicalBlock | null = null;

  const flush = () => {
    if (!current) return;

    const content = normalizeBlock(current.content);
    current = null;

    if (content.length < 20) return;

    chunks.push({
      content,
      pageNumber: page.pageNumber,
      contentType: detectContentType(content),
    });
  };

  for (const block of blocks) {
    if (!current) {
      current = block;
      continue;
    }

    if (shouldMergeBlocks(current, block)) {
      current = {
        content: `${current.content}\n\n${block.content}`,
        contentType: mergeContentTypes(current.contentType, block.contentType),
      };
      continue;
    }

    flush();
    current = block;
  }

  flush();

  return chunks;
};

const getOverlapText = (content: string) => {
  const normalized = normalizeBlock(content);
  if (normalized.length <= OVERLAP_LENGTH) return normalized;

  const slice = normalized.slice(-OVERLAP_LENGTH);
  const boundary = slice.search(/[.!?]\s+|\n/);

  return (boundary >= 0 ? slice.slice(boundary + 1) : slice).trim();
};

const canOverlap = (
  previous: Omit<SemanticTextChunk, 'chunkIndex'>,
  current: Omit<SemanticTextChunk, 'chunkIndex'>,
) =>
  previous.contentType !== 'table' &&
  previous.contentType !== 'code' &&
  current.contentType !== 'table' &&
  current.contentType !== 'code';

const addChunkOverlap = (
  chunks: Omit<SemanticTextChunk, 'chunkIndex'>[],
) =>
  chunks.map((chunk, index) => {
    if (index === 0) return chunk;

    const previous = chunks[index - 1];
    if (!canOverlap(previous, chunk)) return chunk;

    const overlap = getOverlapText(previous.content);
    if (overlap.length < 40) return chunk;

    return {
      ...chunk,
      content: normalizeBlock(`${overlap}\n\n${chunk.content}`),
    };
  });

export const createSemanticChunks = (
  input: string | TextPage[],
): SemanticTextChunk[] => {
  const pages = typeof input === 'string'
    ? [{ pageNumber: 1, text: input }]
    : input;

  const chunks = pages
    .flatMap(page => createPageChunks(page))
    .filter(chunk => chunk.content.length >= 20);

  return addChunkOverlap(chunks)
    .map((chunk, chunkIndex) => ({
      ...chunk,
      chunkIndex,
    }));
};

export const generateChunks = (input: string): string[] =>
  createSemanticChunks(input).map(chunk => chunk.content);
