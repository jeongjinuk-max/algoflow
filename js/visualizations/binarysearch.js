/* Binary Search Visualization */
window.Visualizations = window.Visualizations || {};
window.Visualizations.binarysearch = {
    info: { title: 'Binary Search', subtitle: 'Efficient search algorithm', type: 'Algorithm', timeComplexity: 'O(log n)', timeDesc: 'Halves search space each step', spaceComplexity: 'O(1)', spaceDesc: 'Iterative approach' },
    steps: [
        {
            title: 'Sorted Array & Target', description: 'Binary Search works on a sorted array. We search for target value 23 in the array [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]. The key idea: compare with the middle element to eliminate half the array.',
            render(c) { drawBS(c, [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23, 0, 9, -1, 'Target: 23. Search entire array'); }
        },
        {
            title: 'Step 1: Check Middle', description: 'low=0, high=9, mid=(0+9)/2=4. arr[4]=16. Since 16 < 23, the target must be in the RIGHT half. We eliminate the left half including mid.',
            render(c) { drawBS(c, [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23, 0, 9, 4, 'arr[4]=16 < 23 → search right half'); }
        },
        {
            title: 'Step 2: Narrow Range', description: 'Now low=5, high=9, mid=(5+9)/2=7. arr[7]=56. Since 56 > 23, the target must be in the LEFT half. We eliminate the right half.',
            render(c) { drawBS(c, [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23, 5, 9, 7, 'arr[7]=56 > 23 → search left half'); }
        },
        {
            title: 'Step 3: Almost There', description: 'Now low=5, high=6, mid=(5+6)/2=5. arr[5]=23. We found the target! 23 == 23. Binary Search completes in just 3 comparisons.',
            render(c) { drawBS(c, [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23, 5, 6, 5, 'arr[5]=23 == 23 → FOUND! ✓'); }
        },
        {
            title: 'Summary', description: 'Binary Search eliminated half the search space at each step: 10 → 5 → 2 → 1. Only 3 comparisons needed instead of up to 10 with linear search. This is the power of O(log n).',
            render(c) {
                const wrap = el('div', 'flex flex-col items-center gap-4');
                const rows = [
                    { step: 'Step 1', range: '[0..9]', mid: 4, val: 16, result: '16 < 23 → right' },
                    { step: 'Step 2', range: '[5..9]', mid: 7, val: 56, result: '56 > 23 → left' },
                    { step: 'Step 3', range: '[5..6]', mid: 5, val: 23, result: '23 = 23 → FOUND!' },
                ];
                const tbl = el('div', 'flex flex-col gap-2 w-full max-w-lg');
                rows.forEach((r, i) => {
                    const row = el('div', `flex items-center gap-3 p-3 rounded-lg ${i === 2 ? 'viz-highlight' : 'viz-default'} anim-fade`);
                    row.innerHTML = `<span class="font-bold w-16">${r.step}</span><span class="text-slate-400 w-20">${r.range}</span><span class="w-24">mid=${r.mid} (${r.val})</span><span class="flex-1 text-right text-sm">${r.result}</span>`;
                    tbl.appendChild(row);
                });
                wrap.appendChild(tbl);
                const summary = el('div', 'op-badge bg-green-500/10 text-green-400 mt-3'); summary.textContent = 'Found in 3 steps (log₂10 ≈ 3.3)';
                wrap.appendChild(summary);
                c.appendChild(wrap);
            }
        },
    ],
    createSimulation(container, log) {
        let timer = null, speed = 1, destroyed = false;
        const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
        const targets = [23, 72, 5, 38, 91];
        let tIdx = 0, low, high, mid, found, phase;
        function resetSearch() { const t = targets[tIdx % targets.length]; low = 0; high = arr.length - 1; mid = -1; found = false; phase = 'start'; return t; }
        let target = resetSearch();
        function draw() {
            container.innerHTML = '';
            drawBS(container, arr, target, low, high, mid, found ? `Found ${target}!` : `Searching for ${target}...`);
        }
        function tick() {
            if (destroyed) return;
            if (phase === 'start') {
                addLog(log, `Searching for ${target}`);
                phase = 'search';
                draw();
                timer = setTimeout(tick, 1000 / speed);
                return;
            }
            if (low <= high && !found) {
                mid = Math.floor((low + high) / 2);
                if (arr[mid] === target) {
                    found = true;
                    addLog(log, `mid=${mid}, arr[${mid}]=${arr[mid]} = ${target} → Found!`);
                } else if (arr[mid] < target) {
                    addLog(log, `mid=${mid}, arr[${mid}]=${arr[mid]} < ${target} → go right`);
                    low = mid + 1;
                } else {
                    addLog(log, `mid=${mid}, arr[${mid}]=${arr[mid]} > ${target} → go left`);
                    high = mid - 1;
                }
                draw();
                timer = setTimeout(tick, 1200 / speed);
            } else {
                tIdx++;
                target = resetSearch();
                if (tIdx > targets.length) { tIdx = 0; addLog(log, '— Loop restart —'); }
                timer = setTimeout(tick, 1500 / speed);
            }
        }
        draw();
        return {
            start() { if (!timer) tick(); },
            pause() { clearTimeout(timer); timer = null; },
            reset() { clearTimeout(timer); timer = null; tIdx = 0; target = resetSearch(); log.innerHTML = ''; draw(); },
            setSpeed(s) { speed = s; },
            destroy() { destroyed = true; clearTimeout(timer); }
        };
    }
};

function drawBS(c, arr, target, low, high, mid, caption) {
    const wrap = el('div', 'flex flex-col items-center gap-3');
    const tgt = el('div', 'op-badge bg-primary/10 text-primary mb-2'); tgt.textContent = `Target: ${target}`;
    wrap.appendChild(tgt);
    const row = el('div', 'flex gap-1 items-end');
    arr.forEach((v, i) => {
        const col = el('div', 'flex flex-col items-center gap-1');
        const inRange = i >= low && i <= high;
        const isMid = i === mid;
        const isFound = isMid && v === target;
        let cls = 'viz-empty';
        if (isFound) cls = 'viz-sorted anim-bounce';
        else if (isMid) cls = 'viz-compare anim-pulse';
        else if (inRange) cls = 'viz-default';
        const box = el('div', `viz-box h-12 w-12 text-sm ${cls}`); box.textContent = v;
        box.style.position = 'relative';
        if (i === low && low <= high) { const l = el('div', 'viz-label label-primary absolute -top-6 left-1/2 whitespace-nowrap'); l.textContent = 'L'; l.style.transform = 'translateX(-50%)'; box.appendChild(l); }
        if (i === high && low <= high) { const l = el('div', 'viz-label label-primary absolute -top-6 left-1/2 whitespace-nowrap'); l.textContent = 'H'; l.style.transform = 'translateX(-50%)'; box.appendChild(l); }
        if (isMid) { const l = el('div', 'viz-label label-warn absolute -bottom-6 left-1/2 whitespace-nowrap'); l.textContent = isFound ? 'FOUND!' : 'MID'; l.style.transform = 'translateX(-50%)'; box.appendChild(l); }
        col.appendChild(box);
        const idx = el('div', 'text-[10px] text-slate-500'); idx.textContent = i;
        col.appendChild(idx);
        row.appendChild(col);
    });
    wrap.appendChild(row);
    if (caption) { const cap = el('div', 'text-xs text-slate-400 mt-3 text-center font-medium'); cap.textContent = caption; wrap.appendChild(cap); }
    c.appendChild(wrap);
}
