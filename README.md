# Scalable Recommender — MovieLens-25M on 16GB RAM

A scalable two-tower recommender system for the **MovieLens-25M** dataset, built to train on a single laptop with **16GB of RAM** — no cluster, no GPU farm.

> From OOM crash → **6.1 GB peak RAM** and **7-minute epochs** (5.7× speedup) by streaming data from disk instead of loading it into memory.

---

## The problem

The baseline recommender tried to load the full MovieLens-25M dataset into RAM:

- 25M ratings
- ~162K users
- ~62K movies

Loading the rating matrix as `float32` required ~18 GB. Negative samples doubled it. The kernel killed the process before epoch 1.

```
MemoryError: Unable to allocate 18.6 GiB for array
  with shape (25000095, ...) of float32
```

## The fix

Stop loading the universe into RAM. Stream it.

| Lever | Before | After |
|---|---|---|
| Data access | `pd.read_csv` → in-memory DataFrame | `np.memmap` over a flat `int32` binary |
| Negatives | Materialized matrix | Sampled on the fly (k=4 per positive) |
| I/O | Single-threaded | `DataLoader(num_workers=4, persistent_workers=True, pin_memory=True)` |
| Peak RAM | 16+ GB (OOM) | **6.1 GB** |
| Epoch time | 40 min | **7 min** (5.7×) |

## Architecture

Two-tower neural recommender with sampled-softmax loss:

```
  ratings.bin (mmap)              movies.bin (mmap)
  25M rows · int32                62K rows · int32
            │                              │
            └────────────┬─────────────────┘
                         ▼
        DataLoader · 4 workers · persistent · pinned
              (user_id, pos_item, [neg_item × 4])
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
       USER TOWER                ITEM TOWER
    Embed(162K, 64)           Embed(62K, 64)
    MLP[128 → 64]             MLP[128 → 64]
            └────────────┬────────────┘
                         ▼
              dot product · sampled-softmax loss
```

## Pipeline

1. **Preprocess once** — convert `ratings.csv` → `ratings.bin` (int32, row-major). Build user/item ID maps. One-time cost (~90s).
2. **Memory-map at startup** — `np.memmap` opens the binary in O(1). The dataset never enters Python's heap.
3. **Sample on the fly** — each `__getitem__` returns `(u, i+, neg×k)`. Negatives drawn uniformly.
4. **Parallelize I/O** — 4 worker processes prefetch batches while the trainer is busy, hiding I/O behind compute.
5. **Train two towers** — user and item embeddings + MLP heads, scored by dot product.

## Repo layout

```
.
├── data/                    # raw MovieLens-25M (gitignored)
├── artifacts/               # ratings.bin, id maps (gitignored)
├── src/
│   ├── preprocess.py        # csv → memmap
│   ├── dataset.py           # mmap-backed Dataset + negative sampler
│   ├── model.py             # two-tower model
│   └── train.py             # training loop
└── web/                     # this case-study site
```

## Quickstart

```bash
# 1. Download MovieLens-25M
curl -L https://files.grouplens.org/datasets/movielens/ml-25m.zip -o ml-25m.zip
unzip ml-25m.zip -d data/

# 2. One-time preprocess → memmap binary
python src/preprocess.py --in data/ml-25m/ratings.csv --out artifacts/

# 3. Train
python src/train.py \
    --data artifacts/ \
    --workers 4 \
    --batch-size 4096 \
    --neg-k 4 \
    --epochs 10
```

Expected on a 16GB laptop: **~6 GB peak RAM, ~7 min/epoch**.

## What this project demonstrates

- Scalable ML systems
- Data pipeline design
- Memory optimization
- Recommender systems
- Representation learning
- Parallel data loading
- Engineering under hardware constraints

## License

MIT
