/* Merge Sort Visualization */
window.Visualizations = window.Visualizations || {};
window.Visualizations.mergesort = {
    info: { title: 'Merge Sort', subtitle: 'Divide-and-conquer sorting', type: 'Algorithm', timeComplexity: 'O(n log n)', timeDesc: 'All cases', spaceComplexity: 'O(n)', spaceDesc: 'Auxiliary arrays' },
    steps: [
        {
            title: 'Initial Array', description: 'Merge Sort uses a divide-and-conquer strategy: recursively split the array in half, sort each half, then merge them back together.',
            render(c) { drawMerge(c, { level: 0, groups: [[38, 27, 43, 3, 9, 82, 10]] }, 'Start: [38, 27, 43, 3, 9, 82, 10]'); }
        },
        {
            title: 'Step 1: First Split', description: 'We split the array into two halves: [38, 27, 43] and [3, 9, 82, 10]. Each half will be sorted independently.',
            render(c) { drawMerge(c, { level: 1, groups: [[38, 27, 43], [3, 9, 82, 10]] }, 'Split into two halves'); }
        },
        {
            title: 'Step 2: Split Further', description: 'We continue splitting. [38, 27, 43] → [38] and [27, 43]. [3, 9, 82, 10] → [3, 9] and [82, 10]. Single elements are already sorted.',
            render(c) { drawMerge(c, { level: 2, groups: [[38], [27, 43], [3, 9], [82, 10]] }, 'Continue splitting into smaller pieces'); }
        },
        {
            title: 'Step 3: Split to Singles', description: 'Keep splitting until every sub-array has at most one element. Single elements are trivially sorted — this is the base case.',
            render(c) { drawMerge(c, { level: 3, groups: [[38], [27], [43], [3], [9], [82], [10]] }, 'Base case: single elements are sorted'); }
        },
        {
            title: 'Step 4: Begin Merging', description: 'Now we merge pairs back together in sorted order. [27] + [43] → [27, 43]. [3] + [9] → [3, 9]. [82] + [10] → [10, 82].',
            render(c) { drawMerge(c, { level: 2, groups: [[38], [27, 43], [3, 9], [10, 82]], merging: true }, 'Merge pairs in sorted order'); }
        },
        {
            title: 'Step 5: Continue Merging', description: 'Continue merging larger sub-arrays: [38] + [27, 43] → [27, 38, 43]. [3, 9] + [10, 82] → [3, 9, 10, 82].',
            render(c) { drawMerge(c, { level: 1, groups: [[27, 38, 43], [3, 9, 10, 82]], merging: true }, 'Merge into larger sorted sub-arrays'); }
        },
        {
            title: 'Step 6: Final Merge', description: 'The final merge combines the two sorted halves into the fully sorted array: [3, 9, 10, 27, 38, 43, 82]. Merge Sort is complete!',
            render(c) { drawMerge(c, { level: 0, groups: [[3, 9, 10, 27, 38, 43, 82]], merging: true, done: true }, 'Final merged result — sorted!'); }
        },
    ],
    createSimulation(container, log) {
        let timer = null, speed = 1, step = 0, destroyed = false;
        const stages = [
            { g: [[38, 27, 43, 3, 9, 82, 10]], msg: 'Start' },
            { g: [[38, 27, 43], [3, 9, 82, 10]], msg: 'Split into halves' },
            { g: [[38], [27, 43], [3, 9], [82, 10]], msg: 'Split further' },
            { g: [[38], [27], [43], [3], [9], [82], [10]], msg: 'Base case reached' },
            { g: [[38], [27, 43], [3, 9], [10, 82]], msg: 'Merge pairs' },
            { g: [[27, 38, 43], [3, 9, 10, 82]], msg: 'Merge sub-arrays' },
            { g: [[3, 9, 10, 27, 38, 43, 82]], msg: 'Final merge — sorted!' },
        ];
        function draw() {
            container.innerHTML = '';
            const s = stages[step % stages.length];
            drawMerge(container, { level: 0, groups: s.g, merging: step > 3, done: step === 6 }, s.msg);
        }
        function tick() {
            if (destroyed) return;
            const s = stages[step % stages.length];
            addLog(log, s.msg);
            draw(); step++;
            if (step >= stages.length) {
                setTimeout(() => { if (!destroyed) { step = 0; addLog(log, '— Loop restart —'); draw(); timer = setTimeout(tick, 1200 / speed); } }, 2000 / speed);
                return;
            }
            timer = setTimeout(tick, 1500 / speed);
        }
        draw();
        return {
            start() { if (!timer) tick(); },
            pause() { clearTimeout(timer); timer = null; },
            reset() { clearTimeout(timer); timer = null; step = 0; log.innerHTML = ''; draw(); },
            setSpeed(s) { speed = s; },
            destroy() { destroyed = true; clearTimeout(timer); }
        };
    }
};

function drawMerge(c, state, caption) {
    const wrap = el('div', 'flex flex-col items-center gap-4');
    const row = el('div', 'flex items-center gap-3 flex-wrap justify-center');
    state.groups.forEach((grp, gi) => {
        const grpDiv = el('div', 'flex gap-1');
        grp.forEach(v => {
            const cls = state.done ? 'viz-sorted' : state.merging ? 'viz-highlight' : 'viz-default';
            const box = el('div', `viz-box h-12 w-12 text-sm ${cls} anim-fade`); box.textContent = v;
            grpDiv.appendChild(box);
        });
        const grpWrap = el('div', 'flex flex-col items-center gap-1 px-2 py-2 rounded-lg');
        grpWrap.style.background = 'rgba(7,182,213,0.05)';
        grpWrap.style.border = '1px dashed rgba(7,182,213,0.2)';
        grpWrap.appendChild(grpDiv);
        row.appendChild(grpWrap);
        if (gi < state.groups.length - 1) {
            const sep = el('div', 'text-slate-600 text-lg font-bold'); sep.textContent = '|';
            row.appendChild(sep);
        }
    });
    wrap.appendChild(row);
    const levelLbl = el('div', 'op-badge bg-primary/10 text-primary mt-2');
    levelLbl.textContent = state.done ? '✓ Sorted' : state.merging ? '↑ Merging' : '↓ Splitting';
    wrap.appendChild(levelLbl);
    if (caption) { const cap = el('div', 'text-xs text-slate-400 mt-2 text-center font-medium'); cap.textContent = caption; wrap.appendChild(cap); }
    c.appendChild(wrap);
}
