import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scalable Recommender — MovieLens-25M on 16GB RAM" },
      {
        name: "description",
        content:
          "Out-of-core two-tower recommender for MovieLens-25M. 6GB peak RAM, 5.7x faster epochs via mmap, negative sampling, and parallel data loading.",
      },
      { property: "og:title", content: "Scalable Recommender — MovieLens-25M on 16GB RAM" },
      {
        property: "og:description",
        content:
          "From OOM crash to 7-minute epochs. A case study in scaling recommender training when the dataset doesn't fit in memory.",
      },
      { property: "og:type", content: "article" },
    ],
  }),
  component: Index,
});

const HANDLE = "Scalable_Recommender";

function Index() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="relative mx-auto max-w-6xl px-6 py-10 md:py-16">
        <Nav />
        <Hero />
        <Problem />
        <Architecture />
        <Metrics />
        <Pipeline />
        <Takeaways />
        <Footer />
      </div>
    </main>
  );
}

function Nav() {
  return (
    <header className="flex items-center justify-between border-b border-gold/30 pb-4">
      <div className="flex items-center gap-3 font-mono text-sm">
        <span className="inline-block h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_var(--gold)]" />
        <span className="text-gold">~/projects/{HANDLE}</span>
      </div>
      <div className="hidden gap-6 font-mono text-xs text-muted-foreground md:flex">
        <a href="#problem" className="hover:text-gold">01_problem</a>
        <a href="#architecture" className="hover:text-gold">02_architecture</a>
        <a href="#metrics" className="hover:text-gold">03_metrics</a>
        <a href="#pipeline" className="hover:text-gold">04_pipeline</a>
      </div>
    </header>
  );
}

function Hero() {
  const [typed, setTyped] = useState("");
  const full = "$ train --dataset ml-25m --mode out-of-core --workers 4";
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setTyped(full.slice(0, ++i));
      if (i >= full.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="grid gap-10 py-12 md:grid-cols-5 md:py-20">
      <div className="md:col-span-3">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
          case_study // recommender_systems
        </p>
        <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          25M ratings.
          <br />
          16GB of RAM.
          <br />
          <span className="text-gold">Zero crashes.</span>
        </h1>
        <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
          A scalable two-tower recommender for MovieLens-25M that stopped
          loading the universe into memory — and started streaming it from
          disk. Result: <span className="text-foreground">6GB peak RAM</span> and{" "}
          <span className="text-foreground">7-minute epochs</span> on the same
          laptop that used to OOM.
        </p>

        <div className="relative mt-10 overflow-hidden rounded-md border border-gold/30 bg-card/80 p-4 shadow-[0_0_40px_-10px_var(--gold)]">
          <div className="mb-3 flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
          </div>
          <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-gold">
            <code>
              {typed}
              <span className="caret" />
            </code>
          </pre>
          <div className="mt-3 space-y-1 font-mono text-xs text-muted-foreground">
            <div>[ok] mmap ratings.bin → 0.2s</div>
            <div>[ok] 4 worker procs spawned</div>
            <div>[ok] negative sampler initialized (k=4)</div>
            <div className="text-foreground">[run] epoch 1/10 ▮▮▮▮▮▮▮▯▯▯ 7m12s</div>
          </div>
        </div>
      </div>

      <aside className="md:col-span-2">
        <div className="rounded-md border border-border bg-card/60 p-5">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            tl;dr
          </div>
          <ul className="mt-4 space-y-3 font-sans text-sm">
            <Bullet k="Dataset">MovieLens-25M · 25M ratings · 162K users</Bullet>
            <Bullet k="Model">Two-tower neural recommender</Bullet>
            <Bullet k="Constraint">16GB RAM laptop, no GPU cluster</Bullet>
            <Bullet k="Approach">mmap + negative sampling + 4 workers</Bullet>
            <Bullet k="Result">40m → 7m epoch · 5.7× speedup</Bullet>
          </ul>
        </div>
        <div className="mt-4 font-mono text-xs text-muted-foreground">
          authored by <span className="text-gold">@{HANDLE}</span>
        </div>
      </aside>
    </section>
  );
}

function Bullet({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="w-20 shrink-0 font-mono text-xs uppercase text-gold/80">{k}</span>
      <span className="text-foreground">{children}</span>
    </li>
  );
}

function Section({
  id,
  num,
  title,
  kicker,
  children,
}: {
  id: string;
  num: string;
  title: string;
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-border py-16">
      <div className="mb-8 flex items-baseline gap-4">
        <span className="font-mono text-xs text-gold">{num}</span>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {kicker}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function Problem() {
  return (
    <Section id="problem" num="01" kicker="the wall" title="The baseline ate all the RAM.">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-5">
          <div className="font-mono text-xs uppercase tracking-wider text-destructive">
            before
          </div>
          <pre className="mt-3 overflow-x-auto font-mono text-xs text-foreground">
{`>> df = pd.read_csv("ratings.csv")
>> users = torch.tensor(df.userId.values)
>> ...
MemoryError: Unable to allocate
  18.6 GiB for array with shape
  (25000095, ...) of float32`}
          </pre>
          <p className="mt-4 text-sm text-muted-foreground">
            Loading the whole rating matrix as float32 needed ~18 GB. Negative
            samples doubled it. The kernel killed the process before epoch 1.
          </p>
        </div>
        <div className="rounded-md border border-gold/40 bg-card/60 p-5">
          <div className="font-mono text-xs uppercase tracking-wider text-gold">after</div>
          <pre className="mt-3 overflow-x-auto font-mono text-xs text-foreground">
{`>> ratings = np.memmap("ratings.bin",
     dtype="int32", mode="r")
>> loader = DataLoader(ds,
     num_workers=4,
     persistent_workers=True,
     pin_memory=True)
>> peak_rss ≈ 6.1 GB`}
          </pre>
          <p className="mt-4 text-sm text-muted-foreground">
            Stream from disk via <span className="text-gold">np.memmap</span>,
            sample negatives on the fly, parallelize I/O across 4 workers.
            Training fits — and runs faster.
          </p>
        </div>
      </div>
    </Section>
  );
}

function Architecture() {
  return (
    <Section id="architecture" num="02" kicker="system design" title="Two-tower, out-of-core.">
      <div className="overflow-hidden rounded-md border border-gold/30 bg-card/60 p-6">
        <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed text-foreground md:text-xs">
{`
  ┌──────────────────────────┐         ┌──────────────────────────┐
  │  ratings.bin (mmap)      │         │  movies.bin (mmap)       │
  │  25M rows · int32        │         │  62K rows · int32        │
  └────────────┬─────────────┘         └────────────┬─────────────┘
               │                                    │
               ▼                                    ▼
        ┌────────────────────────────────────────────────┐
        │  DataLoader · 4 workers · persistent · pinned  │
        │   (user_id, pos_item, [neg_item × k=4])        │
        └───────────────────┬────────────────────────────┘
                            │
            ┌───────────────┴────────────────┐
            ▼                                ▼
   ┌──────────────────┐             ┌──────────────────┐
   │   USER TOWER     │             │   ITEM TOWER     │
   │  Embed(162K, 64) │             │  Embed(62K, 64)  │
   │  MLP[128 → 64]   │             │  MLP[128 → 64]   │
   └────────┬─────────┘             └────────┬─────────┘
            └────────────┬───────────────────┘
                         ▼
               dot product · in-batch softmax
                         │
                         ▼
                  sampled-softmax loss
`}
        </pre>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Tile title="mmap, not load">
          Ratings live as a flat <code className="text-gold">int32</code> binary on
          disk. The OS pages in only what each batch touches.
        </Tile>
        <Tile title="Negative sampling">
          For every positive (user, item), draw <code className="text-gold">k=4</code>{" "}
          negatives uniformly. No need to materialize the full interaction matrix.
        </Tile>
        <Tile title="Parallel loaders">
          4 worker processes prefetch and tokenize batches while the GPU/CPU
          trains, hiding I/O behind compute.
        </Tile>
      </div>
    </Section>
  );
}

function Tile({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-card/40 p-5 transition-colors hover:border-gold/40">
      <div className="font-mono text-xs uppercase tracking-wider text-gold">{title}</div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

function Metrics() {
  const rows = [
    { k: "Peak RAM", before: "16+ GB (OOM)", after: "6.1 GB", win: "−62%" },
    { k: "Epoch time", before: "40 min", after: "7 min", win: "5.7× faster" },
    { k: "Workers", before: "1", after: "4", win: "4×" },
    { k: "Dataset on disk", before: "in-RAM df", after: "mmap int32", win: "O(1) load" },
    { k: "Training runs", before: "0 (crash)", after: "10+ epochs", win: "∞" },
  ];
  return (
    <Section id="metrics" num="03" kicker="numbers" title="What actually changed.">
      <div className="overflow-hidden rounded-md border border-border">
        <table className="w-full font-mono text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">metric</th>
              <th className="px-4 py-3 text-left">before</th>
              <th className="px-4 py-3 text-left">after</th>
              <th className="px-4 py-3 text-left text-gold">delta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.k} className="border-t border-border">
                <td className="px-4 py-3">{r.k}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.before}</td>
                <td className="px-4 py-3">{r.after}</td>
                <td className="px-4 py-3 text-gold">{r.win}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <BarCompare label="Peak RAM (GB)" before={16} after={6.1} max={20} />
        <BarCompare label="Epoch time (min)" before={40} after={7} max={45} />
      </div>
    </Section>
  );
}

function BarCompare({
  label,
  before,
  after,
  max,
}: {
  label: string;
  before: number;
  after: number;
  max: number;
}) {
  const w = (v: number) => `${Math.min(100, (v / max) * 100)}%`;
  return (
    <div className="rounded-md border border-border bg-card/40 p-5">
      <div className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between font-mono text-xs">
            <span className="text-muted-foreground">before</span>
            <span>{before}</span>
          </div>
          <div className="h-2 rounded-sm bg-secondary">
            <div
              className="h-full rounded-sm bg-destructive/70"
              style={{ width: w(before) }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between font-mono text-xs">
            <span className="text-gold">after</span>
            <span className="text-gold">{after}</span>
          </div>
          <div className="h-2 rounded-sm bg-secondary">
            <div
              className="h-full rounded-sm bg-gold shadow-[0_0_12px_var(--gold)]"
              style={{ width: w(after) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Pipeline() {
  const steps = [
    {
      t: "Preprocess once",
      d: "Convert ratings.csv → ratings.bin (int32, row-major). Build user/item ID maps. One-time cost, ~90s.",
    },
    {
      t: "Memory-map at startup",
      d: "np.memmap opens the binary in O(1). The dataset never enters Python's heap.",
    },
    {
      t: "Sample on the fly",
      d: "Each __getitem__ returns (u, i+, neg×k). Negatives drawn from a uniform item distribution.",
    },
    {
      t: "Parallelize I/O",
      d: "DataLoader(num_workers=4, persistent_workers=True). Workers prefetch while the trainer is busy.",
    },
    {
      t: "Train two towers",
      d: "User and item embeddings + MLP heads, scored by dot product. Sampled-softmax loss.",
    },
  ];
  return (
    <Section id="pipeline" num="04" kicker="pipeline" title="From CSV to recommendations.">
      <ol className="relative space-y-6 border-l border-gold/30 pl-8">
        {steps.map((s, i) => (
          <li key={s.t} className="relative">
            <span className="absolute -left-[37px] flex h-6 w-6 items-center justify-center rounded-full border border-gold/40 bg-background font-mono text-[10px] text-gold">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-mono text-base text-foreground">{s.t}</h3>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{s.d}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Takeaways() {
  return (
    <Section id="takeaways" num="05" kicker="what this proves" title="More than a model.">
      <div className="grid gap-3 md:grid-cols-2">
        {[
          "Scalable ML systems",
          "Data pipeline design",
          "Memory optimization",
          "Recommender systems",
          "Representation learning",
          "Parallel data loading",
          "Practical training bottlenecks",
          "Engineering under constraints",
        ].map((t) => (
          <div
            key={t}
            className="flex items-center gap-3 rounded-md border border-border bg-card/40 px-4 py-3 transition-colors hover:border-gold/40"
          >
            <span className="font-mono text-xs text-gold">▸</span>
            <span className="font-mono text-sm">{t}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 font-mono text-xs text-muted-foreground md:flex-row md:items-center">
      <div>
        © {new Date().getFullYear()} <span className="text-gold">@{HANDLE}</span> — built on a 16GB laptop.
      </div>
      <div>exit 0</div>
    </footer>
  );
}
