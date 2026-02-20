/* Array Visualization */
window.Visualizations = window.Visualizations || {};
window.Visualizations.array = {
    info: { title: 'Array', subtitle: 'Indexed data structure', type: 'Data Structure', timeComplexity: 'O(1) / O(n)', timeDesc: 'Access O(1), Insert/Delete O(n)', spaceComplexity: 'O(n)', spaceDesc: 'Total elements stored' },
    steps: [
        {
            title: 'Initial Array', description: 'An array stores elements in contiguous memory locations. Each element is accessed by its index (0-based). Here we have an array of 5 elements.',
            render(c) { drawArr(c, [10, 20, 30, 40, 50], -1, null, 'Array with 5 elements, indices 0–4'); }
        },
        {
            title: 'Access Index 2', description: 'Accessing an element by index is O(1) — direct access. We access index 2, which contains the value 30.',
            render(c) { drawArr(c, [10, 20, 30, 40, 50], 2, { op: 'access' }, 'arr[2] → 30 (constant time access)'); }
        },
        {
            title: 'Insert 25 at Index 2', description: 'Inserting at a specific position requires shifting all subsequent elements to the right. This takes O(n) time in the worst case.',
            render(c) { drawArr(c, [10, 20, 25, 30, 40, 50], 2, { op: 'insert', val: 25 }, 'Insert 25 at index 2 → shift elements right'); }
        },
        {
            title: 'Result After Insert', description: 'After insertion, the array now has 6 elements. The value 25 is at index 2, and all subsequent elements shifted right by one position.',
            render(c) { drawArr(c, [10, 20, 25, 30, 40, 50], -1, null, 'Array after insertion — 6 elements'); }
        },
        {
            title: 'Delete at Index 3', description: 'Deleting at a specific position requires shifting all subsequent elements to the left. We remove the element at index 3 (value 30).',
            render(c) { drawArr(c, [10, 20, 25, 40, 50], 3, { op: 'delete', val: 30 }, 'Delete index 3 (was 30) → shift elements left'); }
        },
        {
            title: 'Final Array', description: 'After deletion, the array has 5 elements again. The gap left by 30 is filled by shifting 40 and 50 to the left.',
            render(c) { drawArr(c, [10, 20, 25, 40, 50], -1, null, 'Final array — 5 elements'); }
        },
    ],
    createSimulation(container, log) {
        let arr = [10, 20, 30, 40, 50], timer = null, speed = 1, step = 0, destroyed = false, highlight = -1;
        const actions = [
            { op: 'access', idx: 2 }, { op: 'access', idx: 4 }, { op: 'insert', idx: 1, v: 15 },
            { op: 'access', idx: 3 }, { op: 'delete', idx: 1 }, { op: 'insert', idx: 0, v: 5 },
            { op: 'delete', idx: 0 }, { op: 'access', idx: 0 }
        ];
        function draw() {
            container.innerHTML = '';
            const wrap = el('div', 'flex flex-col items-center gap-2');
            const row = el('div', 'flex gap-1 items-end');
            arr.forEach((v, i) => {
                const col = el('div', 'flex flex-col items-center gap-1');
                const box = el('div', `viz-box h-14 w-16 ${i === highlight ? 'viz-highlight anim-pulse' : 'viz-default'}`);
                box.textContent = v;
                const idx = el('div', 'text-[10px] text-slate-500 font-bold'); idx.textContent = i;
                col.appendChild(box); col.appendChild(idx); row.appendChild(col);
            });
            wrap.appendChild(row);
            container.appendChild(wrap);
        }
        function tick() {
            if (destroyed) return;
            const a = actions[step % actions.length];
            if (a.op === 'access') { highlight = a.idx; addLog(log, `Access arr[${a.idx}] → ${arr[a.idx]}`); }
            else if (a.op === 'insert') { arr.splice(a.idx, 0, a.v); highlight = a.idx; addLog(log, `Insert ${a.v} at index ${a.idx}`); }
            else if (a.op === 'delete') { const v = arr.splice(a.idx, 1)[0]; highlight = -1; addLog(log, `Delete arr[${a.idx}] → ${v}`); }
            draw(); step++;
            if (step >= actions.length) { step = 0; arr = [10, 20, 30, 40, 50]; highlight = -1; addLog(log, '— Loop restart —'); }
            timer = setTimeout(tick, 1200 / speed);
        }
        draw();
        return {
            start() { if (!timer) tick(); },
            pause() { clearTimeout(timer); timer = null; },
            reset() { clearTimeout(timer); timer = null; arr = [10, 20, 30, 40, 50]; step = 0; highlight = -1; log.innerHTML = ''; draw(); },
            setSpeed(s) { speed = s; },
            destroy() { destroyed = true; clearTimeout(timer); }
        };
    }
};

function drawArr(c, items, hl, op, caption) {
    const wrap = el('div', 'flex flex-col items-center gap-3');
    if (op && op.op === 'delete') {
        const r = el('div', 'flex items-center gap-2 mb-2');
        const b = el('div', 'viz-box viz-removed h-14 w-16'); b.textContent = op.val;
        const l = el('span', 'viz-label label-danger'); l.textContent = 'DELETED';
        r.appendChild(b); r.appendChild(l); wrap.appendChild(r);
    }
    if (op && op.op === 'insert') {
        const r = el('div', 'flex items-center gap-2 mb-2');
        const l = el('span', 'viz-label label-success'); l.textContent = `INSERT ${op.val}`;
        const a = el('div', 'text-primary'); a.textContent = '↓';
        r.appendChild(l); r.appendChild(a); wrap.appendChild(r);
    }
    const row = el('div', 'flex gap-1 items-end');
    items.forEach((v, i) => {
        const col = el('div', 'flex flex-col items-center gap-1');
        const isHl = i === hl;
        const isInsert = op && op.op === 'insert' && i === hl;
        const cls = isInsert ? 'viz-highlight anim-bounce' : isHl ? 'viz-highlight anim-pulse' : 'viz-default';
        const box = el('div', `viz-box h-14 w-16 ${cls}`);
        box.textContent = v;
        const idx = el('div', 'text-[10px] text-slate-500 font-bold'); idx.textContent = i;
        col.appendChild(box); col.appendChild(idx); row.appendChild(col);
        if (op && op.op === 'insert' && i >= hl && i > hl) {
            const sh = el('div', 'text-primary text-xs absolute -top-4'); sh.textContent = '→';
        }
    });
    wrap.appendChild(row);
    const idxLabel = el('div', 'text-[10px] text-slate-500 font-bold mt-1'); idxLabel.textContent = 'Index';
    wrap.appendChild(idxLabel);
    if (op && op.op === 'access') {
        const info = el('div', 'op-badge bg-primary/10 text-primary mt-2'); info.textContent = `arr[${hl}] = ${items[hl]}`;
        wrap.appendChild(info);
    }
    if (caption) { const cap = el('div', 'text-xs text-slate-400 mt-2 text-center font-medium'); cap.textContent = caption; wrap.appendChild(cap); }
    c.appendChild(wrap);
}
