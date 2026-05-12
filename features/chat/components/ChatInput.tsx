type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function ChatInput({ value, onChange, onSubmit }: ChatInputProps) {
  return (
    <form onSubmit={onSubmit}>
      <input
        value={value}
        onChange={event => onChange(event.currentTarget.value)}
      />
    </form>
  );
}