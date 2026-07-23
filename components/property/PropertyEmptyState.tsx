import { SearchX } from "lucide-react";

export function PropertyEmptyState({
  title = "No properties found",
  description = "Try adjusting your filters or check back later.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-secondary/30 px-6 py-20 text-center">
      <SearchX className="size-10 text-muted-foreground" />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
