import { Leaf, Target, Brain, TrendingUp, BookOpen, Gem, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  leaf: Leaf,
  target: Target,
  brain: Brain,
  "trending-up": TrendingUp,
  "book-open": BookOpen,
  gem: Gem,
};

export function TierIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? BookOpen;
  return <Icon className={className} />;
}
