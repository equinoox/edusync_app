import { extractText, getDocumentProxy } from 'unpdf';

export async function extractPdfText(file: File) {
  const buffer = await file.arrayBuffer();
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { totalPages, text } = await extractText(pdf, { mergePages: true });

  return {
    text: text.trim(),
    pageCount: totalPages,
  };
}