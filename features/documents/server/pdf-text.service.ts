import { extractText, getDocumentProxy } from 'unpdf';

export async function extractPdfText(file: File) {
  const buffer = await file.arrayBuffer();
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { totalPages, text } = await extractText(pdf, { mergePages: false });
  const pages = text.map((pageText, index) => ({
    pageNumber: index + 1,
    text: pageText.trim(),
  }));

  return {
    text: pages.map(page => page.text).join('\n\n').trim(),
    pages,
    pageCount: totalPages,
  };
}
