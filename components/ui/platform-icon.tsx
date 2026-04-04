import * as LucideIcons from "lucide-react";

type Props = { name: string; className?: string };

export const PlatformIcon = ({ name, className }: Props) => {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  return Icon ? <Icon className={className} /> : null;
};  