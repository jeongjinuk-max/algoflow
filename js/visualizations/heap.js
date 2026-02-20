/* Heap / Priority Queue Visualization */
window.Visualizations = window.Visualizations || {};
window.Visualizations.heap = {
    info: { title: 'Heap / Priority Queue', subtitle: 'Tree-based data structure', type: 'Data Structure', timeComplexity: 'O(log n)', timeDesc: 'Insert / Extract operations', spaceComplexity: 'O(n)', spaceDesc: 'Total elements stored' },
    steps: [
        {
            title: 'Empty Min-Heap', description: 'A Min-Heap is a complete binary tree where every parent node is smaller than or equal to its children. The smallest element is always at the root. Used to implement Priority Queues.',
            render(c) { drawHeap(c, [], -1, null, 'Empty min-heap — root is always the minimum'); }
        },
        {
            title: 'Insert 10', description: 'We insert 10 into the heap. Since it\'s the first element, it becomes the root. Array representation: [10].',
            render(c) { drawHeap(c, [10], 0, { op: 'insert', v: 10 }, 'Insert 10 → becomes root'); }
        },
        {
            title: 'Insert 5 → Bubble Up', description: 'We insert 5. It initially goes to the next available position (left child of 10). Since 5 < 10, it "bubbles up" — we swap 5 and 10. Now 5 is the root.',
            render(c) { drawHeap(c, [5, 10], 0, { op: 'bubble', from: 1, to: 0 }, 'Insert 5 → bubble up! 5 < 10, swap → 5 is root'); }
        },
        {
            title: 'Insert 8, 15, 3', description: 'We insert 8 (right child of 10, no bubble needed), then 15 (left child of 10, no bubble), then 3. 3 bubbles up from position 5 → 2 → 0, becoming the new root.',
            render(c) { drawHeap(c, [3, 10, 5, 15, 8], 0, { op: 'insert', v: 3 }, 'After inserting 8, 15, 3 → 3 bubbles to root'); }
        },
        {
            title: 'Extract Min → 3', description: 'Extract-Min removes the root (3). We replace the root with the last element (8), then "bubble down" — 8 swaps with the smaller child until heap property is restored.',
            render(c) { drawHeap(c, [5, 10, 8, 15], 0, { op: 'extract', v: 3 }, 'Extract 3 → replace with 8 → bubble down → 5 is root'); }
        },
        {
            title: 'Heap Property', description: 'The heap maintains its property: parent ≤ children at every level. This guarantees O(log n) insert and extract, making it perfect for priority queues, Dijkstra\'s algorithm, and scheduling.',
            render(c) { drawHeap(c, [5, 10, 8, 15], -1, { op: 'done' }, 'Min-Heap: parent ≤ children at every node'); }
        },
    ],
    createSimulation(container, log) {
        let heap = [], timer = null, speed = 1, step = 0, destroyed = false, hlIdx = -1;
        const actions = [{ op: 'ins', v: 10 }, { op: 'ins', v: 5 }, { op: 'ins', v: 8 }, { op: 'ins', v: 15 }, { op: 'ins', v: 3 }, { op: 'ins', v: 12 }, { op: 'ext' }, { op: 'ext' }, { op: 'ext' }, { op: 'ext' }, { op: 'ext' }, { op: 'ext' }];
        function bubbleUp(i) { while (i > 0) { const p = Math.floor((i - 1) / 2); if (heap[p] > heap[i]) { [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } else break; } return i; }
        function bubbleDown(i) { const n = heap.length; while (true) { let s = i, l = 2 * i + 1, r = 2 * i + 2; if (l < n && heap[l] < heap[s]) s = l; if (r < n && heap[r] < heap[s]) s = r; if (s === i) break;[heap[i], heap[s]] = [heap[s], heap[i]]; i = s; } return i; }
        function draw() { container.innerHTML = ''; drawHeap(container, heap, hlIdx, null, `Heap size: ${heap.length}`); }
        function tick() {
            if (destroyed) return;
            const a = actions[step % actions.length];
            if (a.op === 'ins') { heap.push(a.v); hlIdx = bubbleUp(heap.length - 1); addLog(log, `Insert ${a.v}`); }
            else if (heap.length) { const v = heap[0]; heap[0] = heap[heap.length - 1]; heap.pop(); if (heap.length) hlIdx = bubbleDown(0); addLog(log, `Extract min → ${v}`); }
            draw(); step++;
            if (step >= actions.length) { step = 0; heap = []; hlIdx = -1; addLog(log, '— Loop restart —'); }
            timer = setTimeout(tick, 1000 / speed);
        }
        draw();
        return { start() { if (!timer) tick(); }, pause() { clearTimeout(timer); timer = null; }, reset() { clearTimeout(timer); timer = null; heap = []; step = 0; hlIdx = -1; log.innerHTML = ''; draw(); }, setSpeed(s) { speed = s; }, destroy() { destroyed = true; clearTimeout(timer); } };
    }
};
function drawHeap(c, arr, hlIdx, op, caption) {
    const wrap = el('div', 'flex flex-col items-center gap-4');
    if (op && op.op === 'extract') { const r = el('div', 'flex items-center gap-2 mb-2'); const b = el('div', 'viz-box viz-removed h-10 w-14 text-sm'); b.textContent = op.v; const l = el('span', 'viz-label label-danger'); l.textContent = 'EXTRACTED'; r.appendChild(b); r.appendChild(l); wrap.appendChild(r); }
    if (!arr.length) { const e = el('div', 'text-slate-500 italic text-sm'); e.textContent = 'Empty Heap'; wrap.appendChild(e); }
    else {
        const treeArea = el('div', 'relative'); treeArea.style.width = '440px'; treeArea.style.height = '220px';
        const positions = [[210, 10], [110, 70], [310, 70], [60, 140], [160, 140], [260, 140], [360, 140]];
        // edges
        for (let i = 0; i < arr.length; i++) {
            const l = 2 * i + 1, r = 2 * i + 2;
            [l, r].forEach(child => { if (child < arr.length) { const [x1, y1] = positions[i], [x2, y2] = positions[child]; const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy), angle = Math.atan2(dy, dx) * 180 / Math.PI; const edge = el('div', 'graph-edge'); edge.style.cssText = `left:${x1 + 20}px;top:${y1 + 20}px;width:${len}px;transform:rotate(${angle}deg)`; treeArea.appendChild(edge); } });
        }
        // nodes
        arr.forEach((v, i) => { if (i >= positions.length) return; const [x, y] = positions[i]; const isHl = i === hlIdx; const cls = isHl ? 'node-current anim-pulse' : 'node-default'; const node = el('div', `graph-node ${cls}`); node.textContent = v; node.style.cssText = `left:${x}px;top:${y}px;width:40px;height:40px;font-size:0.75rem`; treeArea.appendChild(node); });
        wrap.appendChild(treeArea);
        // array repr
        const arrRow = el('div', 'flex gap-1 mt-2'); arr.forEach((v, i) => { const b = el('div', `viz-box h-8 w-10 text-xs ${i === hlIdx ? 'viz-highlight' : 'viz-default'}`); b.textContent = v; arrRow.appendChild(b); });
        const arrLbl = el('div', 'text-[10px] text-slate-500 mb-1'); arrLbl.textContent = 'Array:'; const arrWrap = el('div', 'flex flex-col items-center'); arrWrap.appendChild(arrLbl); arrWrap.appendChild(arrRow); wrap.appendChild(arrWrap);
    }
    if (caption) { const cap = el('div', 'text-xs text-slate-400 mt-2 text-center font-medium'); cap.textContent = caption; wrap.appendChild(cap); }
    c.appendChild(wrap);
}
