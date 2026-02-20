/* Bubble Sort Visualization */
window.Visualizations = window.Visualizations || {};
window.Visualizations.bubblesort = {
    info: { title: 'Bubble Sort', subtitle: 'Comparison-based sorting', type: 'Algorithm', timeComplexity: 'O(n²)', timeDesc: 'Worst / Average case', spaceComplexity: 'O(1)', spaceDesc: 'In-place sorting' },
    steps: [
        {
            title: 'Initial Array', description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. We start with array [5, 3, 8, 1, 4].',
            render(c) { drawBars(c, [5, 3, 8, 1, 4], -1, -1, [], 'Initial unsorted array'); }
        },
        {
            title: 'Compare 5 and 3 → Swap', description: 'We compare the first two elements: 5 > 3, so we swap them. The larger element "bubbles up" towards the end.',
            render(c) { drawBars(c, [3, 5, 8, 1, 4], 0, 1, [], '5 > 3 → Swap! Array: [3, 5, 8, 1, 4]'); }
        },
        {
            title: 'Compare 5 and 8 → No Swap', description: 'Next pair: 5 and 8. Since 5 < 8, they are already in order. No swap needed.',
            render(c) { drawBars(c, [3, 5, 8, 1, 4], 1, 2, [], '5 < 8 → No swap needed'); }
        },
        {
            title: 'Compare 8 and 1 → Swap', description: 'Next pair: 8 and 1. Since 8 > 1, we swap them. 8 continues bubbling up.',
            render(c) { drawBars(c, [3, 5, 1, 8, 4], 2, 3, [], '8 > 1 → Swap! Array: [3, 5, 1, 8, 4]'); }
        },
        {
            title: 'Compare 8 and 4 → Swap', description: 'Last pair of pass 1: 8 and 4. Since 8 > 4, we swap. Now 8 is in its final position at the end.',
            render(c) { drawBars(c, [3, 5, 1, 4, 8], 3, 4, [4], '8 > 4 → Swap! 8 is now sorted'); }
        },
        {
            title: 'Pass 2 Begins', description: 'Pass 2 starts from the beginning. We compare 3 and 5 — no swap. Then 5 and 1 — swap! Then 5 and 4 — swap! Now 5 is sorted.',
            render(c) { drawBars(c, [3, 1, 4, 5, 8], -1, -1, [3, 4], 'After Pass 2: [3, 1, 4, 5, 8]'); }
        },
        {
            title: 'Final Sorted Array', description: 'After all passes complete, every element is in its correct position. The array is fully sorted in ascending order.',
            render(c) { drawBars(c, [1, 3, 4, 5, 8], -1, -1, [0, 1, 2, 3, 4], 'Sorted! [1, 3, 4, 5, 8]'); }
        },
    ],
    createSimulation(container, log) {
        let arr, timer = null, speed = 1, destroyed = false, i = 0, j = 0, sorted = [];
        function reset_arr() { arr = [5, 3, 8, 1, 4]; i = 0; j = 0; sorted = []; }
        reset_arr();
        function draw(ci, cj) {
            container.innerHTML = '';
            const wrap = el('div', 'flex flex-col items-center gap-4');
            const bars = el('div', 'flex items-end gap-2 h-64');
            const maxV = Math.max(...arr);
            arr.forEach((v, idx) => {
                const col = el('div', 'flex flex-col items-center gap-1');
                const h = (v / maxV) * 200 + 20;
                const bar = el('div', 'sort-bar w-12 flex items-end justify-center pb-1 text-xs font-bold');
                bar.style.height = h + 'px';
                if (sorted.includes(idx)) { bar.className += ' viz-sorted'; bar.style.color = '#22c55e'; }
                else if (idx === ci || idx === cj) { bar.className += ' viz-compare'; bar.style.color = '#fbbf24'; }
                else { bar.className += ' viz-default'; bar.style.color = '#07b6d5'; }
                bar.textContent = v;
                col.appendChild(bar);
                bars.appendChild(col);
            });
            wrap.appendChild(bars);
            container.appendChild(wrap);
        }
        function tick() {
            if (destroyed) return;
            const n = arr.length;
            if (i >= n - 1) {
                sorted = arr.map((_, i) => i);
                draw(-1, -1);
                addLog(log, 'Array sorted! Restarting...');
                setTimeout(() => { if (!destroyed) { reset_arr(); draw(-1, -1); addLog(log, '— Loop restart —'); timer = setTimeout(tick, 800 / speed); } }, 1500 / speed);
                return;
            }
            if (j >= n - 1 - i) { j = 0; i++; if (i < n - 1) addLog(log, `Pass ${i + 1} starting`); timer = setTimeout(tick, 600 / speed); return; }
            if (arr[j] > arr[j + 1]) {
                addLog(log, `${arr[j]} > ${arr[j + 1]} → Swap`);
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            } else { addLog(log, `${arr[j]} ≤ ${arr[j + 1]} → No swap`); }
            draw(j, j + 1);
            if (j === n - 2 - i) { sorted.push(n - 1 - i); }
            j++;
            timer = setTimeout(tick, 800 / speed);
        }
        draw(-1, -1);
        return {
            start() { if (!timer) tick(); },
            pause() { clearTimeout(timer); timer = null; },
            reset() { clearTimeout(timer); timer = null; reset_arr(); log.innerHTML = ''; draw(-1, -1); },
            setSpeed(s) { speed = s; },
            destroy() { destroyed = true; clearTimeout(timer); }
        };
    }
};

function drawBars(c, arr, ci, cj, sortedIdxs, caption) {
    const wrap = el('div', 'flex flex-col items-center gap-4');
    const bars = el('div', 'flex items-end gap-3 h-56');
    const maxV = Math.max(...arr);
    arr.forEach((v, i) => {
        const col = el('div', 'flex flex-col items-center gap-1');
        const h = (v / maxV) * 180 + 30;
        const isSorted = sortedIdxs.includes(i);
        const isCompare = i === ci || i === cj;
        const bar = el('div', 'sort-bar w-14 flex items-end justify-center pb-2 text-sm font-bold');
        bar.style.height = h + 'px';
        if (isSorted) { bar.className += ' viz-sorted'; bar.style.color = '#22c55e'; }
        else if (isCompare) { bar.className += ' viz-compare anim-pulse'; bar.style.color = '#fbbf24'; }
        else { bar.className += ' viz-default'; bar.style.color = '#07b6d5'; }
        bar.textContent = v;
        const idx = el('div', 'text-[10px] text-slate-500 font-bold mt-1'); idx.textContent = v;
        col.appendChild(bar);
        bars.appendChild(col);
    });
    wrap.appendChild(bars);
    if (ci >= 0 && cj >= 0) {
        const cmp = el('div', 'op-badge bg-yellow-500/10 text-yellow-400 mt-2');
        cmp.textContent = `Comparing positions ${ci} and ${cj}`;
        wrap.appendChild(cmp);
    }
    if (caption) { const cap = el('div', 'text-xs text-slate-400 mt-2 text-center font-medium'); cap.textContent = caption; wrap.appendChild(cap); }
    c.appendChild(wrap);
}
