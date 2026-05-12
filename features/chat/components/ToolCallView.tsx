type ToolCallViewProps = {
  part: {
    type: string;
    state?: string;
    input?: unknown;
  };
};

export function ToolCallView({ part }: ToolCallViewProps) {
  return (
    <pre>
      call{part.state === 'output-available' ? 'ed' : 'ing'} tool: {part.type}
      {'\n'}
      {JSON.stringify(part.input, null, 2)}
    </pre>
  );
}