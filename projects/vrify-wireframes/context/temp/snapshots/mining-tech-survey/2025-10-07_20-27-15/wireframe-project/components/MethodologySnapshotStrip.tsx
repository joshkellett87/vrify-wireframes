export const MethodologySnapshotStrip = () => {
  return (
    <section className="wireframe-section py-6" aria-labelledby="methodology-snapshot">
      <div className="wireframe-container">
        <div className="wireframe-grid">
          <div className="col-span-12">
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background/60 px-6 py-4 text-xs uppercase tracking-wide text-muted-foreground">
              <span id="methodology-snapshot" className="font-semibold text-foreground">Methodology snapshot</span>
              <span className="rounded-full border border-border px-3 py-1 text-xs normal-case">1,247 survey responses</span>
              <span className="rounded-full border border-border px-3 py-1 text-xs normal-case">Fielded Q3 2024</span>
              <span className="rounded-full border border-border px-3 py-1 text-xs normal-case">Mining &amp; extraction</span>
              <span className="rounded-full border border-border px-3 py-1 text-xs normal-case">30-minute quant survey</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
