# Firefox Build Cache Guide 🚀

## Tổng quan

Build cache giúp giảm thời gian build từ **2-3 giờ** xuống còn **30-60 phút** cho các lần build sau.

---

## Caching Strategy

### 1. ccache (Compiler Cache)
**Mục đích:** Cache compiled object files (.obj, .o)

**Lợi ích:**
- Không cần recompile files không thay đổi
- Giảm 50-70% thời gian build
- Tự động detect file changes

**Cấu hình:**
```bash
CCACHE_DIR=~/.ccache
CCACHE_MAXSIZE=5G
CCACHE_COMPRESS=1
```

**Kích thước:** ~2-5 GB

---

### 2. Mozilla Build Dependencies
**Mục đích:** Cache Python packages, Rust toolchain, build tools

**Bao gồm:**
- `~/.mozbuild/srcdirs` - Source dependencies
- `~/.cargo` - Rust packages
- `~/.rustup` - Rust toolchain

**Lợi ích:**
- Không cần download lại dependencies
- Bootstrap nhanh hơn
- Giảm network usage

**Kích thước:** ~1-3 GB

---

### 3. GitHub Actions Cache
**Mục đích:** Lưu cache giữa các workflow runs

**Cache keys:**
```yaml
# ccache - unique per run, restore from previous
ccache-${{ runner.os }}-${{ github.run_number }}
ccache-${{ runner.os }}-

# Dependencies - based on Cargo.lock
mozbuild-deps-${{ runner.os }}-${{ hashFiles('**/Cargo.lock') }}
mozbuild-deps-${{ runner.os }}-
```

**Giới hạn:**
- Max 10 GB per repository
- Tự động xóa cache cũ sau 7 ngày

---

## Build Time Comparison

### First Build (No Cache)
```
Setup:          30 min
Bootstrap:      30 min
Compile:        120 min
Package:        5 min
─────────────────────
Total:          ~3 hours
```

### Subsequent Builds (With Cache)
```
Setup:          5 min   (cached dependencies)
Bootstrap:      5 min   (cached tools)
Compile:        30 min  (ccache hits)
Package:        5 min
─────────────────────
Total:          ~45 min
```

**Speedup: 4x faster! 🚀**

---

## Cache Hit Scenarios

### Full Cache Hit (Best Case)
**Scenario:** No code changes, just rebuild

**Result:**
- ccache: 95%+ hit rate
- Build time: 20-30 min
- Most files skipped

### Partial Cache Hit (Common)
**Scenario:** Small code changes (1-10 files)

**Result:**
- ccache: 80-90% hit rate
- Build time: 30-60 min
- Only changed files recompiled

### Cache Miss (Worst Case)
**Scenario:** Major changes or cache expired

**Result:**
- ccache: 0-20% hit rate
- Build time: 2-3 hours
- Full rebuild needed

---

## Monitoring Cache

### During Build

Check ccache statistics:
```bash
ccache --show-stats
```

Output:
```
cache hit (direct)     12345
cache hit (preprocessed) 678
cache miss             234
cache hit rate         98.2%
```

### After Build

Workflow shows cache sizes:
```
ccache: 3.45 GB
Cargo: 1.23 GB
mozbuild: 0.89 GB
Total: 5.57 GB
```

---

## Cache Management

### GitHub Actions

**View cache:**
1. Go to repository Settings
2. Click "Actions" → "Caches"
3. See all cached data

**Clear cache:**
1. Go to Actions → Caches
2. Delete specific cache
3. Or delete all caches

### Local Build

**Clear ccache:**
```bash
ccache --clear
```

**Show ccache stats:**
```bash
ccache --show-stats
```

**Set ccache size:**
```bash
ccache --max-size=5G
```

---

## Optimization Tips

### 1. Incremental Builds

Only change what you need:
- Branding files → Fast rebuild (5-10 min)
- UI files → Medium rebuild (20-30 min)
- Core engine → Slow rebuild (1-2 hours)

### 2. Cache Warming

First build after setup:
- Let it run completely
- Don't cancel mid-build
- Cache will be populated

### 3. Parallel Builds

mozconfig already optimized:
```bash
mk_add_options MOZ_MAKE_FLAGS="-j8"
```

Uses all CPU cores for faster compilation.

### 4. Disable Tests

Tests not needed for release:
```bash
ac_add_options --disable-tests
```

Saves 30-40% build time.

---

## Troubleshooting

### Cache Not Working

**Symptoms:**
- Every build takes 2-3 hours
- ccache hit rate: 0%

**Solutions:**
1. Check ccache is enabled in mozconfig
2. Verify CCACHE_DIR is set
3. Check cache size limit
4. Clear and rebuild cache

### Cache Too Large

**Symptoms:**
- GitHub Actions cache limit exceeded
- Workflow fails to save cache

**Solutions:**
1. Reduce CCACHE_MAXSIZE to 3G
2. Clear old caches in GitHub
3. Exclude unnecessary directories

### Build Fails After Cache Restore

**Symptoms:**
- Build works without cache
- Fails with cache restored

**Solutions:**
1. Clear all caches
2. Do fresh build
3. Check for corrupted cache files

---

## Cache Lifecycle

```
Build #1 (No cache)
├─ Download dependencies
├─ Compile everything
├─ Save to cache
└─ Upload cache (3-5 GB)
    ↓
Build #2 (With cache)
├─ Restore cache (3-5 GB)
├─ Reuse compiled files
├─ Compile only changes
└─ Update cache
    ↓
Build #3 (With cache)
├─ Restore cache
├─ Even faster!
└─ Update cache
```

---

## Best Practices

### ✅ Do:
- Let first build complete fully
- Keep cache size under 5 GB
- Monitor cache hit rates
- Clear cache if corrupted

### ❌ Don't:
- Cancel builds mid-compilation
- Disable ccache for release builds
- Set cache size too small (<2 GB)
- Ignore cache statistics

---

## Advanced: Custom Cache Strategy

### For Frequent Branding Changes

Cache only dependencies, not build artifacts:
```yaml
- name: Cache dependencies only
  uses: actions/cache@v4
  with:
    path: |
      ~/.cargo
      ~/.rustup
      ~/.mozbuild
    key: deps-only-${{ hashFiles('**/Cargo.lock') }}
```

### For Testing Different Configs

Separate cache per build type:
```yaml
key: ccache-${{ runner.os }}-${{ github.event.inputs.build_type }}-${{ github.run_number }}
```

---

## Expected Results

### First Build
```
⏱️  Time: 2-3 hours
💾 Cache: 0 GB → 5 GB
📊 ccache hit: 0%
```

### Second Build (No changes)
```
⏱️  Time: 20-30 min
💾 Cache: 5 GB (reused)
📊 ccache hit: 95%+
```

### Third Build (Small changes)
```
⏱️  Time: 30-60 min
💾 Cache: 5 GB (updated)
📊 ccache hit: 80-90%
```

---

## Summary

**Cache Benefits:**
- ⚡ 4x faster builds
- 💰 Save GitHub Actions minutes
- 🔄 Quick iterations
- 🎯 Efficient development

**Cache Costs:**
- 💾 5 GB storage
- 🕐 Initial setup time
- 🔧 Maintenance overhead

**Verdict:** Absolutely worth it! 🎉

---

## Next Steps

1. ✅ Run first build (populate cache)
2. ✅ Make small change (test cache)
3. ✅ Monitor cache statistics
4. ✅ Optimize cache strategy

---

**Happy fast building! 🚀**
