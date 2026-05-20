import { LucideIcon, BedDouble, Clock, Dog, DoorClosed, Users } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  BedDouble,
  Clock,
  Dog,
  DoorClosed,
  Users,
};

export function getIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || DoorClosed;
}
