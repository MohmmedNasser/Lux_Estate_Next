import { ExternalLink, MapPin } from "lucide-react";

interface LocationMapProps {
  address: string;
  location: string;
}

export function LocationMap({ address, location }: LocationMapProps) {
  const query = encodeURIComponent(address || location);
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-neutral-200">
      {/* Subtle map-grid surface */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(229,229,229,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(229,229,229,0.6) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Centered pin with a soft ping */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-ping rounded-full bg-amber-700/30"
        />
        <span className="relative grid h-11 w-11 place-items-center rounded-full bg-amber-700 text-white shadow-lg">
          <MapPin className="size-5" aria-hidden="true" />
        </span>
      </div>

      {/* Address card */}
      <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white px-4 py-3 shadow-md sm:right-auto sm:max-w-xs">
        <p className="text-[14px] font-medium text-neutral-900">{address || location}</p>
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-1 text-[13px] font-medium text-amber-800 transition-colors hover:text-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
        >
          Open in Maps
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
