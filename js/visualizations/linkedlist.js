/* Linked List Visualization */
window.Visualizations = window.Visualizations || {};
window.Visualizations.linkedlist = {
    info: { title: 'Linked List', subtitle: 'Dynamic data structure', type: 'Data Structure', timeComplexity: 'O(1) / O(n)', timeDesc: 'Insert/Delete O(1), Search O(n)', spaceComplexity: 'O(n)', spaceDesc: 'Total nodes stored' },
    steps: [
        {
            title: 'Empty List', description: 'A linked list is a linear data structure where each node contains data and a pointer (reference) to the next node. We start with an empty list — the Head pointer is null.',
            render(c) { drawLL(c, [], null, 'Head → null'); }
        },
        {
            title: 'Insert Node A', description: 'We insert node "A" at the head. The Head pointer now points to A, and A points to null. This is our first node.',
            render(c) { drawLL(c, ['A'], { op: 'insert', idx: 0 }, 'Head → [A] → null'); }
        },
        {
            title: 'Insert Node B at Tail', description: 'We insert "B" at the tail. Node A\'s next pointer is updated to point to B. B points to null.',
            render(c) { drawLL(c, ['A', 'B'], { op: 'insert', idx: 1 }, 'Head → [A] → [B] → null'); }
        },
        {
            title: 'Insert Node C at Head', description: 'We insert "C" at the head. C\'s next pointer is set to A (the old head). The Head pointer is updated to C.',
            render(c) { drawLL(c, ['C', 'A', 'B'], { op: 'insert', idx: 0 }, 'Head → [C] → [A] → [B] → null'); }
        },
        {
            title: 'Delete Node A', description: 'To delete A, we update C\'s next pointer to skip A and point directly to B. Node A is removed from the chain.',
            render(c) { drawLL(c, ['C', 'B'], { op: 'delete', val: 'A' }, 'Head → [C] → [B] → null (A removed)'); }
        },
        {
            title: 'Traverse', description: 'Traversal visits each node from Head to the end. We start at C, follow the pointer to B, then reach null. Traversal is O(n).',
            render(c) { drawLL(c, ['C', 'B'], { op: 'traverse', cur: 0 }, 'Traversing: C → B → null'); }
        },
    ],
    createSimulation(container, log) {
        let list = [], timer = null, speed = 1, step = 0, destroyed = false, hlIdx = -1;
        const actions = [
            { op: 'insertH', v: 'A' }, { op: 'insertT', v: 'B' }, { op: 'insertT', v: 'C' },
            { op: 'insertH', v: 'D' }, { op: 'trav' }, { op: 'deleteH' }, { op: 'deleteH' },
            { op: 'insertH', v: 'E' }, { op: 'trav' }, { op: 'deleteH' }, { op: 'deleteH' }, { op: 'deleteH' }
        ];
        function draw() {
            container.innerHTML = '';
            const wrap = el('div', 'flex items-center gap-1 flex-wrap');
            const headLbl = el('div', 'text-xs font-bold text-primary mr-2'); headLbl.textContent = 'Head';
            wrap.appendChild(headLbl);
            const arrow0 = el('div', 'text-primary text-lg mr-1'); arrow0.textContent = '→';
            wrap.appendChild(arrow0);
            list.forEach((v, i) => {
                const node = el('div', `viz-box h-12 px-4 ${i === hlIdx ? 'viz-highlight anim-pulse' : 'viz-default'}`);
                node.textContent = v;
                wrap.appendChild(node);
                const arr = el('div', 'text-slate-500 text-lg mx-1'); arr.textContent = '→';
                wrap.appendChild(arr);
            });
            const nullLbl = el('div', 'text-slate-500 text-sm italic'); nullLbl.textContent = 'null';
            wrap.appendChild(nullLbl);
            container.appendChild(wrap);
        }
        function tick() {
            if (destroyed) return;
            const a = actions[step % actions.length];
            hlIdx = -1;
            if (a.op === 'insertH') { list.unshift(a.v); hlIdx = 0; addLog(log, `Insert "${a.v}" at head`); }
            else if (a.op === 'insertT') { list.push(a.v); hlIdx = list.length - 1; addLog(log, `Insert "${a.v}" at tail`); }
            else if (a.op === 'deleteH' && list.length) { addLog(log, `Delete head "${list.shift()}"`); }
            else if (a.op === 'trav') { hlIdx = 0; addLog(log, 'Traversing list...'); }
            draw(); step++;
            if (step >= actions.length) { step = 0; list = []; hlIdx = -1; addLog(log, '— Loop restart —'); }
            timer = setTimeout(tick, 1000 / speed);
        }
        draw();
        return {
            start() { if (!timer) tick(); },
            pause() { clearTimeout(timer); timer = null; },
            reset() { clearTimeout(timer); timer = null; list = []; step = 0; hlIdx = -1; log.innerHTML = ''; draw(); },
            setSpeed(s) { speed = s; },
            destroy() { destroyed = true; clearTimeout(timer); }
        };
    }
};

function drawLL(c, nodes, op, caption) {
    const wrap = el('div', 'flex flex-col items-center gap-4');
    if (op && op.op === 'delete') {
        const r = el('div', 'flex items-center gap-2 mb-2');
        const b = el('div', 'viz-box viz-removed h-12 px-4'); b.textContent = op.val;
        const l = el('span', 'viz-label label-danger'); l.textContent = 'DELETED';
        r.appendChild(b); r.appendChild(l); wrap.appendChild(r);
    }
    const row = el('div', 'flex items-center gap-1 flex-wrap');
    const headLbl = el('div', 'text-xs font-bold text-primary mr-1'); headLbl.textContent = 'Head';
    row.appendChild(headLbl);
    const ha = el('div', 'text-primary text-lg mr-1'); ha.textContent = '→'; row.appendChild(ha);
    nodes.forEach((v, i) => {
        const isNew = op && op.op === 'insert' && i === op.idx;
        const isTrav = op && op.op === 'traverse';
        const cls = isNew ? 'viz-highlight anim-bounce' : (isTrav && i <= op.cur) ? 'viz-highlight' : 'viz-default';
        const node = el('div', `viz-box h-12 px-5 ${cls}`); node.textContent = v;
        node.style.position = 'relative';
        if (isNew) { const l = el('div', 'viz-label label-success absolute -top-7 left-1/2 whitespace-nowrap'); l.textContent = 'NEW'; l.style.transform = 'translateX(-50%)'; node.appendChild(l); }
        if (isTrav && i === op.cur) { const l = el('div', 'viz-label label-warn absolute -bottom-7 left-1/2 whitespace-nowrap'); l.textContent = 'CURRENT'; l.style.transform = 'translateX(-50%)'; node.appendChild(l); }
        row.appendChild(node);
        const arr = el('div', 'text-slate-500 text-lg mx-1'); arr.textContent = '→'; row.appendChild(arr);
    });
    const nl = el('div', 'text-slate-500 text-sm italic'); nl.textContent = 'null'; row.appendChild(nl);
    wrap.appendChild(row);
    if (caption) { const cap = el('div', 'text-xs text-slate-400 mt-3 text-center font-medium'); cap.textContent = caption; wrap.appendChild(cap); }
    c.appendChild(wrap);
}
