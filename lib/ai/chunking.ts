export const generateChunks = (input: string): string[] => {
  // First, normalize the text
  const normalized = input.trim();
  
  // Split by multiple sentence delimiters (periods, exclamation marks, question marks)
  const sentences = normalized.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  
  // Group sentences into meaningful chunks (combine smaller sentences)
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    // If adding this sentence would make the chunk too long, save current chunk and start a new one
    if ((currentChunk + ' ' + sentence).length > 500) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence;
    } else {
      currentChunk = currentChunk ? currentChunk + ' ' + sentence : sentence;
    }
  }
  
  // Don't forget the last chunk
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  // Filter out very short chunks (less than 20 characters)
  return chunks.filter(chunk => chunk.length >= 20);
};
