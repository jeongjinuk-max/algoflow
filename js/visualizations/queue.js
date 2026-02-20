/* Queue (FIFO) Visualization */
window.Visualizations = window.Visualizations || {};
window.Visualizations.queue = {
    info: { title: 'Queue (FIFO)', subtitle: 'Linear data structure', type: 'Data Structure', timeComplexity: 'O(1)', timeDesc: 'Enqueue/Dequeue operations', spaceComplexity: 'O(n)', spaceDesc: 'Total elements stored' },
    steps: [
        {
            title: 'Empty Queue', description: 'A queue is a First-In, First-Out (FIFO) data structure. Like a line at a store — the first person in line is served first. We start with an empty queue.',
            render(c) { drawQueue(c, [], null, 'Empty queue — ready for operations'); }
        },
        {
            title: 'Enqueue A', description: 'The Enqueue operation adds an element to the rear (back) of the queue. We add element "A". It is both the front and rear.',
            render(c) { drawQueue(c, ['A'], { op: 'enq', idx: 0 }, 'Enqueue(A) → A is front and rear'); }
        },
        {
            title: 'Enqueue B', description: 'We enqueue "B". It goes to the rear. "A" is still at the front. Elements are always added at the rear.',
            render(c) { drawQueue(c, ['A', 'B'], { op: 'enq', idx: 1 }, 'Enqueue(B) → B is now the rear'); }
        },
        {
            title: 'Enqueue C', description: 'We enqueue "C". The queue now has 3 elements: A (front), B, C (rear).',
            render(c) { drawQueue(c, ['A', 'B', 'C'], { op: 'enq', idx: 2 }, 'Enqueue(C) → C is now the rear'); }
        },
        {
            title: 'Dequeue → A', description: 'The Dequeue operation removes the front element. Since "A" was enqueued first, it is removed first (FIFO). "B" becomes the new front.',
            render(c) { drawQueue(c, ['B', 'C'], { op: 'deq', val: 'A' }, 'Dequeue() → returned A, B is now front'); }
        },
        {
            title: 'Dequeue → B', description: 'We dequeue again. "B" is removed from the front. Only "C" remains, which is both front and rear.',
            render(c) { drawQueue(c, ['C'], { op: 'deq', val: 'B' }, 'Dequeue() → returned B, C is now front'); }
        },
    ],
    createSimulation(container, log) {
        let queue = [], timer = null, speed = 1, step = 0, destroyed = false;
        const actions = [{ op: 'enq', v: 'A' }, { op: 'enq', v: 'B' }, { op: 'enq', v: 'C' }, { op: 'enq', v: 'D' }, { op: 'deq' }, { op: 'deq' }, { op: 'enq', v: 'E' }, { op: 'deq' }, { op: 'deq' }, { op: 'deq' }];
        function draw() {
            container.innerHTML = '';
            const wrap = el('div', 'flex flex-col items-center gap-4');
            const labels = el('div', 'flex gap-0');
            const qc = el('div', 'queue-container');
            queue.forEach((v, i) => {
                const isFront = i === 0, isRear = i === queue.length - 1;
                const box = el('div', `viz-box h-14 w-16 ${isFront ? 'viz-highlight' : isRear ? 'viz-highlight' : 'viz-default'}`);
                box.textContent = v;
                box.style.position = 'relative';
                if (isFront) { const l = el('div', 'viz-label label-primary absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap'); l.textContent = 'FRONT'; l.style.transform = 'translateX(-50%)'; box.appendChild(l); }
                if (isRear) { const l = el('div', 'viz-label label-success absolute -bottom-6 left-1/2 whitespace-nowrap'); l.textContent = 'REAR'; l.style.transform = 'translateX(-50%)'; box.appendChild(l); }
                qc.appendChild(box);
                if (i < queue.length - 1) { const arr = el('div', 'text-slate-500 text-lg font-bold px-1'); arr.textContent = '→'; qc.appendChild(arr); }
            });
            if (!queue.length) { const e = el('div', 'text-slate-500 text-sm italic px-8'); e.textContent = 'Empty'; qc.appendChild(e); }
            wrap.appendChild(qc);
            const dir = el('div', 'flex justify-between w-full max-w-md text-xs text-slate-500 mt-2');
            dir.innerHTML = '<span>← Dequeue (Front)</span><span>Enqueue (Rear) →</span>';
            wrap.appendChild(dir);
            container.appendChild(wrap);
        }
        function tick() {
            if (destroyed) return;
            const a = actions[step % actions.length];
            if (a.op === 'enq') { queue.push(a.v); addLog(log, `Enqueue(${a.v})`); }
            else if (queue.length) { addLog(log, `Dequeue() → ${queue.shift()}`); }
            draw(); step++;
            if (step >= actions.length) { step = 0; queue = []; addLog(log, '— Loop restart —'); }
            timer = setTimeout(tick, 1000 / speed);
        }
        draw();
        return {
            start() { if (!timer) tick(); },
            pause() { clearTimeout(timer); timer = null; },
            reset() { clearTimeout(timer); timer = null; queue = []; step = 0; log.innerHTML = ''; draw(); },
            setSpeed(s) { speed = s; },
            destroy() { destroyed = true; clearTimeout(timer); }
        };
    }
};

function drawQueue(c, items, op, caption) {
    const wrap = el('div', 'flex flex-col items-center gap-4');
    if (op && op.op === 'deq') {
        const row = el('div', 'flex items-center gap-2 mb-2');
        const rm = el('div', 'viz-box viz-removed h-14 w-16'); rm.textContent = op.val;
        const lbl = el('span', 'viz-label label-danger'); lbl.textContent = 'DEQUEUED';
        row.appendChild(rm); row.appendChild(lbl);
        const arrow = el('div', 'text-red-400'); arrow.textContent = '←';
        row.appendChild(arrow);
        wrap.appendChild(row);
    }
    const qc = el('div', 'queue-container');
    items.forEach((v, i) => {
        const isFront = i === 0, isRear = i === items.length - 1;
        const isNew = op && op.op === 'enq' && i === op.idx;
        const cls = isNew ? 'viz-highlight anim-bounce' : isFront ? 'viz-highlight' : isRear ? 'viz-highlight' : 'viz-default';
        const box = el('div', `viz-box h-14 w-16 ${cls}`);
        box.textContent = v; box.style.position = 'relative';
        if (isFront) { const l = el('div', 'viz-label label-primary absolute -top-7 left-1/2 whitespace-nowrap'); l.textContent = 'FRONT'; l.style.transform = 'translateX(-50%)'; box.appendChild(l); }
        if (isRear) { const l = el('div', 'viz-label label-success absolute -bottom-7 left-1/2 whitespace-nowrap'); l.textContent = 'REAR'; l.style.transform = 'translateX(-50%)'; box.appendChild(l); }
        qc.appendChild(box);
        if (i < items.length - 1) { const a = el('div', 'text-slate-500 text-lg font-bold px-1'); a.textContent = '→'; qc.appendChild(a); }
    });
    if (!items.length) { const e = el('div', 'text-slate-500 text-sm italic px-8'); e.textContent = 'Empty Queue'; qc.appendChild(e); }
    wrap.appendChild(qc);
    if (op && op.op === 'enq') { const a = el('div', 'text-primary text-sm mt-1'); a.textContent = '→ Enqueue'; wrap.appendChild(a); }
    const dir = el('div', 'flex justify-between w-full max-w-md text-xs text-slate-500 mt-2');
    dir.innerHTML = '<span>← Dequeue (Front)</span><span>Enqueue (Rear) →</span>';
    wrap.appendChild(dir);
    if (caption) { const cap = el('div', 'text-xs text-slate-400 mt-2 text-center font-medium'); cap.textContent = caption; wrap.appendChild(cap); }
    c.appendChild(wrap);
}
