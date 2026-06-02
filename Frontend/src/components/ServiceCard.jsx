import { ArrowUpRight, Clock, DollarSign } from "lucide-react";

export default function ServiceCard({ service }) {
  return (
    <article className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className="h-3 w-12 rounded-full" style={{ backgroundColor: service.accent }} />
        {service.isFeatured ? (
          <span className="rounded-md bg-mist px-2.5 py-1 text-xs font-bold text-moss">Featured</span>
        ) : null}
      </div>
      <h3 className="text-xl font-bold text-ink">{service.title}</h3>
      <p className="mt-3 min-h-20 text-sm leading-6 text-ink/65">{service.summary}</p>
      <div className="mt-5 grid gap-2 text-sm text-ink/70">
        <span className="flex items-center gap-2"><DollarSign size={16} /> From ${service.priceFrom}</span>
        <span className="flex items-center gap-2"><Clock size={16} /> {service.duration}</span>
      </div>
      <a href="#booking" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-moss">
        Book consultation <ArrowUpRight size={16} />
      </a>
    </article>
  );
}
