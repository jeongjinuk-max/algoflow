/* Stack (LIFO) Visualization */
window.Visualizations = window.Visualizations || {};
window.Visualizations.stack = {
    info: { title: 'Stack (LIFO)', subtitle: 'Linear data structure', type: 'Data Structure', timeComplexity: 'O(1)', timeDesc: 'Push/Pop operations', spaceComplexity: 'O(n)', spaceDesc: 'Total elements stored' },
    steps: [
        {
            title: 'Empty Stack', description: 'A stack is a Last-In, First-Out (LIFO) data structure. Think of a stack of plates — you can only add or remove from the top. We start with an empty stack.',
            render(c) { renderStack(c, [], null, 'Empty stack — ready for operations'); }
        },
        {
            title: 'Push 42', description: 'The Push operation adds an element to the top of the stack. We push the value 42 onto the stack. It becomes the first and only element.',
            render(c) { renderStack(c, [42], { op: 'push', idx: 0 }, 'Push(42) → 42 is now the top'); }
        },
        {
            title: 'Push 18', description: 'We push another value, 18, onto the stack. It goes on top of 42. Now 18 is the new top element.',
            render(c) { renderStack(c, [42, 18], { op: 'push', idx: 1 }, 'Push(18) → 18 is now the top'); }
        },
        {
            title: 'Push 95', description: 'We push 95 onto the stack. The stack now has 3 elements, with 95 at the top. Remember: the last element pushed is always on top.',
            render(c) { renderStack(c, [42, 18, 95], { op: 'push', idx: 2 }, 'Push(95) → 95 is now the top'); }
        },
        {
            title: 'Pop → 95', description: 'The Pop operation removes the top element. Since 95 was pushed last, it is removed first (LIFO). The stack now has 2 elements with 18 on top.',
            render(c) { renderStack(c, [42, 18], { op: 'pop', val: 95 }, 'Pop() → returned 95, 18 is now the top'); }
        },
        {
            title: 'Peek → 18', description: 'Peek lets us look at the top element without removing it. The top element is 18. The stack remains unchanged.',
            render(c) { renderStack(c, [42, 18], { op: 'peek', idx: 1 }, 'Peek() → top element is 18'); }
        },
    ],
    createSimulation(container, log) {
        let stack = [], timer = null, speed = 1, step = 0, destroyed = false;
        const actions = [
            { op: 'push', v: 42 }, { op: 'push', v: 18 }, { op: 'push', v: 95 }, { op: 'push', v: 7 },
            { op: 'pop' }, { op: 'pop' }, { op: 'push', v: 63 }, { op: 'pop' }, { op: 'pop' }, { op: 'pop' }
        ];
        function draw() {
            container.innerHTML = '';
            const wrap = el('div', 'flex flex-col items-center gap-2');
            const sc = el('div', 'stack-container');
            stack.forEach((v, i) => {
                const isTop = i === stack.length - 1;
                const box = el('div', `viz-box h-12 w-full ${isTop ? 'viz-highlight anim-pulse' : 'viz-default'}`);
                box.textContent = v;
                if (isTop) {
                    const lbl = el('span', 'viz-label label-primary absolute -right-16');
                    lbl.textContent = 'TOP';
                    box.style.position = 'relative';
                    box.appendChild(lbl);
                }
                sc.appendChild(box);
            });
            if (!stack.length) { const e = el('div', 'text-slate-500 text-sm italic p-4 text-center'); e.textContent = 'Empty'; sc.appendChild(e); }
            wrap.appendChild(sc);
            container.appendChild(wrap);
        }
        function tick() {
            if (destroyed) return;
            const a = actions[step % actions.length];
            if (a.op === 'push') { stack.push(a.v); addLog(log, `Push(${a.v})`); }
            else if (stack.length) { const v = stack.pop(); addLog(log, `Pop() → ${v}`); }
            draw();
            step++;
            if (step >= actions.length) { step = 0; stack = []; addLog(log, '— Loop restart —'); }
            timer = setTimeout(tick, 1000 / speed);
        }
        draw();
        return {
            start() { if (!timer) tick(); },
            pause() { clearTimeout(timer); timer = null; },
            reset() { clearTimeout(timer); timer = null; stack = []; step = 0; log.innerHTML = ''; draw(); },
            setSpeed(s) { speed = s; },
            destroy() { destroyed = true; clearTimeout(timer); timer = null; }
        };
    }
};

function renderStack(c, items, op, caption) {
    const wrap = el('div', 'flex flex-col items-center gap-3');
    if (op && op.op === 'pop') {
        const rm = el('div', 'viz-box viz-removed h-12 w-44 mb-1');
        rm.textContent = op.val;
        const lbl = el('span', 'viz-label label-danger ml-2'); lbl.textContent = 'REMOVED';
        rm.appendChild(lbl);
        wrap.appendChild(rm);
        const arrow = el('div', 'text-red-400 text-xl'); arrow.textContent = '↑ Pop'; wrap.appendChild(arrow);
    }
    if (op && op.op === 'push') {
        const arrow = el('div', 'text-primary text-xl mb-1'); arrow.textContent = '↓ Push'; wrap.appendChild(arrow);
    }
    const sc = el('div', 'stack-container');
    items.forEach((v, i) => {
        const isTop = i === items.length - 1;
        const isNew = op && op.op === 'push' && i === op.idx;
        const isPeek = op && op.op === 'peek' && i === op.idx;
        const cls = isNew ? 'viz-highlight anim-bounce' : isPeek ? 'viz-highlight anim-pulse' : isTop ? 'viz-highlight' : 'viz-default';
        const box = el('div', `viz-box h-12 w-full ${cls}`);
        box.textContent = `Value: ${v}`;
        if (isTop) {
            const lbl = el('span', 'viz-label label-primary absolute -right-16'); lbl.textContent = 'TOP';
            box.style.position = 'relative'; box.appendChild(lbl);
        }
        sc.appendChild(box);
    });
    if (!items.length) { const e = el('div', 'text-slate-500 text-sm italic p-8 text-center'); e.textContent = 'Empty Stack'; sc.appendChild(e); }
    wrap.appendChild(sc);
    if (caption) { const cap = el('div', 'text-xs text-slate-400 mt-3 text-center font-medium'); cap.textContent = caption; wrap.appendChild(cap); }
    c.appendChild(wrap);
}

function el(tag, cls) { const e = document.createElement(tag); if (cls) e.className = cls; return e; }
function addLog(log, msg) { if (!log) return; const d = el('div', 'text-xs text-slate-400 anim-fade'); d.textContent = '▸ ' + msg; log.prepend(d); }
