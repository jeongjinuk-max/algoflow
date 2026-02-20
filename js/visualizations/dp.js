/* Dynamic Programming Visualization — Fibonacci */
window.Visualizations = window.Visualizations || {};
window.Visualizations.dp = {
    info: { title: 'Dynamic Programming', subtitle: 'Optimal substructure + overlapping subproblems', type: 'Algorithm', timeComplexity: 'O(n)', timeDesc: 'With memoization (vs O(2ⁿ) naive)', spaceComplexity: 'O(n)', spaceDesc: 'Memoization table' },
    steps: [
        {
            title: 'What is DP?', description: 'Dynamic Programming solves problems by breaking them into overlapping subproblems, solving each once, and storing the result. Classic example: Fibonacci numbers. Naive recursion is O(2ⁿ), but DP makes it O(n).',
            render(c) { drawDP(c, Array(8).fill(null), -1, null, 'DP = solve subproblems once, store results'); }
        },
        {
            title: 'Base Cases', description: 'F(0) = 0, F(1) = 1. These are our base cases — they don\'t depend on any other values. We fill them directly into the table.',
            render(c) { drawDP(c, [0, 1, null, null, null, null, null, null], 1, { op: 'base' }, 'Base cases: F(0)=0, F(1)=1'); }
        },
        {
            title: 'Compute F(2)', description: 'F(2) = F(1) + F(0) = 1 + 0 = 1. We look up previously computed values — no redundant computation!',
            render(c) { drawDP(c, [0, 1, 1, null, null, null, null, null], 2, { op: 'compute', deps: [0, 1] }, 'F(2) = F(1) + F(0) = 1 + 0 = 1'); }
        },
        {
            title: 'Compute F(3)', description: 'F(3) = F(2) + F(1) = 1 + 1 = 2. Each new value only needs the two previous — O(1) per cell!',
            render(c) { drawDP(c, [0, 1, 1, 2, null, null, null, null], 3, { op: 'compute', deps: [1, 2] }, 'F(3) = F(2) + F(1) = 1 + 1 = 2'); }
        },
        {
            title: 'Compute F(4), F(5)', description: 'F(4) = F(3) + F(2) = 2 + 1 = 3. F(5) = F(4) + F(3) = 3 + 2 = 5. The table fills left to right — bottom-up DP!',
            render(c) { drawDP(c, [0, 1, 1, 2, 3, 5, null, null], 5, { op: 'compute', deps: [3, 4] }, 'F(4)=3, F(5)=5 — bottom-up filling'); }
        },
        {
            title: 'Complete Table', description: 'F(6) = 8, F(7) = 13. The entire table is filled in O(n) time. Without DP, computing F(7) would require 41 recursive calls. With DP, just 8 lookups!',
            render(c) { drawDP(c, [0, 1, 1, 2, 3, 5, 8, 13], 7, { op: 'done' }, '✓ F(7)=13 computed in O(n) instead of O(2ⁿ)'); }
        },
    ],
    createSimulation(container, log) {
        let table, timer = null, speed = 1, step = 0, destroyed = false, hlIdx = -1, N = 10;
        function reset() { table = Array(N).fill(null); step = 0; hlIdx = -1; }
        reset();
        function draw() { container.innerHTML = ''; drawDP(container, table, hlIdx, null, hlIdx >= 0 ? `Computing F(${hlIdx})` : 'Fibonacci DP'); }
        function tick() {
            if (destroyed) return;
            if (step === 0) { table[0] = 0; hlIdx = 0; addLog(log, 'F(0) = 0'); }
            else if (step === 1) { table[1] = 1; hlIdx = 1; addLog(log, 'F(1) = 1'); }
            else if (step < N) { table[step] = table[step - 1] + table[step - 2]; hlIdx = step; addLog(log, `F(${step}) = F(${step - 1}) + F(${step - 2}) = ${table[step]}`); }
            draw(); step++;
            if (step >= N) {
                addLog(log, `Done! F(${N - 1}) = ${table[N - 1]}`);
                setTimeout(() => { if (!destroyed) { reset(); addLog(log, '— Loop restart —'); draw(); timer = setTimeout(tick, 800 / speed); } }, 2500 / speed);
                return;
            }
            timer = setTimeout(tick, 1000 / speed);
        }
        draw();
        return { start() { if (!timer) tick(); }, pause() { clearTimeout(timer); timer = null; }, reset() { clearTimeout(timer); timer = null; reset(); log.innerHTML = ''; draw(); }, setSpeed(s) { speed = s; }, destroy() { destroyed = true; clearTimeout(timer); } };
    }
};
function drawDP(c, table, hlIdx, op, caption) {
    const wrap = el('div', 'flex flex-col items-center gap-4');
    // Formula
    const formula = el('div', 'flex items-center gap-2 mb-2');
    formula.innerHTML = '<span class="text-sm text-slate-400">F(n) = F(n-1) + F(n-2)</span>';
    wrap.appendChild(formula);
    // Table
    const row = el('div', 'flex gap-1 items-end');
    table.forEach((v, i) => {
        const col = el('div', 'flex flex-col items-center gap-1');
        const isDep = op && op.deps && op.deps.includes(i);
        const isHl = i === hlIdx;
        const isDone = op && op.op === 'done';
        let cls = 'viz-empty';
        if (v !== null) {
            if (isDone) cls = 'viz-sorted';
            else if (isHl) cls = 'viz-highlight anim-bounce';
            else if (isDep) cls = 'viz-compare anim-pulse';
            else cls = 'viz-default';
        }
        const box = el('div', `viz-box h-14 w-14 text-sm ${cls}`);
        box.textContent = v !== null ? v : '?';
        const idx = el('div', 'text-[10px] text-slate-500 font-bold'); idx.textContent = `F(${i})`;
        col.appendChild(box); col.appendChild(idx); row.appendChild(col);
        if (isDep && i === op.deps[0]) { const plus = el('div', 'text-primary font-bold text-lg mx-0.5'); plus.textContent = '+'; row.appendChild(plus); }
    });
    wrap.appendChild(row);
    // Arrows showing dependencies
    if (op && op.op === 'compute' && op.deps) {
        const depInfo = el('div', 'op-badge bg-primary/10 text-primary mt-2');
        depInfo.textContent = `F(${hlIdx}) = F(${op.deps[1]}) + F(${op.deps[0]}) = ${table[op.deps[1]]} + ${table[op.deps[0]]} = ${table[hlIdx]}`;
        wrap.appendChild(depInfo);
    }
    // Comparison
    const cmp = el('div', 'flex gap-6 mt-3 text-[10px]');
    cmp.innerHTML = '<div class="flex items-center gap-1"><div class="w-2 h-2 rounded-full bg-red-400"></div><span class="text-slate-400">Naive: O(2ⁿ)</span></div><div class="flex items-center gap-1"><div class="w-2 h-2 rounded-full bg-primary"></div><span class="text-slate-400">DP: O(n)</span></div>';
    wrap.appendChild(cmp);
    if (caption) { const cap = el('div', 'text-xs text-slate-400 mt-2 text-center font-medium'); cap.textContent = caption; wrap.appendChild(cap); }
    c.appendChild(wrap);
}
