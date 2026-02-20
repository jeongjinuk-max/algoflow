/* Quick Sort Visualization */
window.Visualizations = window.Visualizations || {};
window.Visualizations.quicksort = {
    info: { title: 'Quick Sort', subtitle: 'Divide-and-conquer sorting', type: 'Algorithm', timeComplexity: 'O(n log n)', timeDesc: 'Average case (worst O(n²))', spaceComplexity: 'O(log n)', spaceDesc: 'Recursion stack' },
    steps: [
        {
            title: 'Initial Array', description: 'Quick Sort selects a "pivot" element, then partitions the array so all elements smaller than the pivot go left, and all larger go right. We start with [6, 3, 8, 1, 5, 2, 7, 4].',
            render(c) { drawQS(c, [6, 3, 8, 1, 5, 2, 7, 4], -1, [], [], 'Unsorted array — choose a pivot'); }
        },
        {
            title: 'Choose Pivot = 4', description: 'We select the last element (4) as the pivot. Now we partition: scan from left, placing elements < 4 on the left side and elements ≥ 4 on the right.',
            render(c) { drawQS(c, [6, 3, 8, 1, 5, 2, 7, 4], 7, [], [], 'Pivot = 4 (last element)'); }
        },
        {
            title: 'Partition Result', description: 'After partitioning: [3, 1, 2] are less than 4, [6, 8, 5, 7] are greater. 4 is now in its final sorted position (index 3).',
            render(c) { drawQS(c, [3, 1, 2, 4, 6, 8, 5, 7], 3, [0, 1, 2], [4, 5, 6, 7], 'Partitioned! 4 is in final position'); }
        },
        {
            title: 'Recurse Left [3,1,2]', description: 'Now we recursively Quick Sort the left partition [3, 1, 2]. Pivot = 2. After partition: [1] | 2 | [3]. Both 1 and 2 are in final positions.',
            render(c) { drawQS(c, [1, 2, 3, 4, 6, 8, 5, 7], -1, [0, 1, 2, 3], [], 'Left side sorted: [1, 2, 3, 4]'); }
        },
        {
            title: 'Recurse Right [6,8,5,7]', description: 'Now sort the right partition [6, 8, 5, 7]. Pivot = 7. After partition: [6, 5] | 7 | [8]. Continue recursing on [6, 5].',
            render(c) { drawQS(c, [1, 2, 3, 4, 5, 6, 7, 8], -1, [0, 1, 2, 3, 4, 5, 6, 7], [], 'Fully sorted: [1, 2, 3, 4, 5, 6, 7, 8]'); }
        },
        {
            title: 'Quick Sort Complete', description: 'Quick Sort is complete! Average O(n log n) with small constant factor, making it one of the fastest sorting algorithms in practice. The key insight: each partition places one element in its final position.',
            render(c) { drawQS(c, [1, 2, 3, 4, 5, 6, 7, 8], -1, [0, 1, 2, 3, 4, 5, 6, 7], [], '✓ Sorted! Average O(n log n)'); }
        },
    ],
    createSimulation(container, log) {
        let arr, timer = null, speed = 1, destroyed = false, sorted = [], pivotIdx = -1, phase = 0;
        const snapshots = [
            { a: [6, 3, 8, 1, 5, 2, 7, 4], p: 7, s: [], m: 'Start: pivot=4' },
            { a: [3, 1, 2, 4, 8, 5, 7, 6], p: 3, s: [3], m: 'Partitioned around 4' },
            { a: [1, 2, 3, 4, 8, 5, 7, 6], p: -1, s: [0, 1, 2, 3], m: 'Left sorted' },
            { a: [1, 2, 3, 4, 5, 6, 7, 8], p: -1, s: [0, 1, 2, 3, 4, 5, 6, 7], m: 'Fully sorted!' },
        ];
        function draw() { container.innerHTML = ''; const s = snapshots[phase % snapshots.length]; drawQS(container, s.a, s.p, s.s, [], s.m); }
        function tick() {
            if (destroyed) return;
            const s = snapshots[phase % snapshots.length];
            addLog(log, s.m); draw(); phase++;
            if (phase >= snapshots.length) { setTimeout(() => { if (!destroyed) { phase = 0; addLog(log, '— Loop restart —'); draw(); timer = setTimeout(tick, 1200 / speed); } }, 2000 / speed); return; }
            timer = setTimeout(tick, 1500 / speed);
        }
        draw();
        return { start() { if (!timer) tick(); }, pause() { clearTimeout(timer); timer = null; }, reset() { clearTimeout(timer); timer = null; phase = 0; log.innerHTML = ''; draw(); }, setSpeed(s) { speed = s; }, destroy() { destroyed = true; clearTimeout(timer); } };
    }
};
function drawQS(c, arr, pivotIdx, sortedIdxs, partitionIdxs, caption) {
    const wrap = el('div', 'flex flex-col items-center gap-4');
    const bars = el('div', 'flex items-end gap-2 h-56');
    const maxV = Math.max(...arr);
    arr.forEach((v, i) => {
        const col = el('div', 'flex flex-col items-center gap-1');
        const h = (v / maxV) * 180 + 30;
        const isSorted = sortedIdxs.includes(i), isPivot = i === pivotIdx;
        const bar = el('div', 'sort-bar w-12 flex items-end justify-center pb-2 text-sm font-bold');
        bar.style.height = h + 'px';
        if (isSorted) { bar.className += ' viz-sorted'; bar.style.color = '#22c55e'; }
        else if (isPivot) { bar.className += ' viz-compare anim-pulse'; bar.style.color = '#fbbf24'; }
        else { bar.className += ' viz-default'; bar.style.color = '#07b6d5'; }
        bar.textContent = v; col.appendChild(bar);
        if (isPivot) { const l = el('div', 'text-[10px] text-yellow-400 font-bold mt-1'); l.textContent = 'PIVOT'; col.appendChild(l); }
        bars.appendChild(col);
    });
    wrap.appendChild(bars);
    if (caption) { const cap = el('div', 'text-xs text-slate-400 mt-2 text-center font-medium'); cap.textContent = caption; wrap.appendChild(cap); }
    c.appendChild(wrap);
}
