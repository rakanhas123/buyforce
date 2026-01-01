type Props = {
  children: React.ReactNode;
  onPress?: () => void;
};

export function Button({ children }: Props) {
  return <button>{children}</button>;
}
