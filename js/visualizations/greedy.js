/* Greedy Algorithm Visualization — Activity Selection */
window.Visualizations = window.Visualizations || {};
window.Visualizations.greedy = {
    info: { title: 'Greedy Algorithm', subtitle: 'Optimal local choices', type: 'Algorithm', timeComplexity: 'O(n log n)', timeDesc: 'Sort + single scan', spaceComplexity: 'O(n)', spaceDesc: 'Selected activities' },
    steps: [
        {
            title: 'Activity Selection Problem', description: 'Greedy algorithms make the locally optimal choice at each step. The classic example: given activities with start/end times, select the maximum number of non-overlapping activities.',
            render(c) { drawGreedy(c, [{ s: 1, e: 3 }, { s: 2, e: 5 }, { s: 4, e: 7 }, { s: 1, e: 8 }, { s: 5, e: 9 }, { s: 8, e: 10 }, { s: 9, e: 11 }, { s: 11, e: 14 }, { s: 13, e: 16 }], [], -1, 'Activities sorted by end time'); }
        },
        {
            title: 'Step 1: Select First', description: 'Greedy strategy: always pick the activity that finishes earliest. This leaves the most room for remaining activities. Select A1 (1–3).',
            render(c) { drawGreedy(c, [{ s: 1, e: 3 }, { s: 2, e: 5 }, { s: 4, e: 7 }, { s: 1, e: 8 }, { s: 5, e: 9 }, { s: 8, e: 10 }, { s: 9, e: 11 }, { s: 11, e: 14 }, { s: 13, e: 16 }], [0], 0, 'Select A1 (1–3): earliest finish time'); }
        },
        {
            title: 'Step 2: Skip Conflicts', description: 'A2 (2–5) overlaps with A1 (ends before 3). Skip it. A3 (4–7) starts after A1 ends (4 ≥ 3). Select A3!',
            render(c) { drawGreedy(c, [{ s: 1, e: 3 }, { s: 2, e: 5 }, { s: 4, e: 7 }, { s: 1, e: 8 }, { s: 5, e: 9 }, { s: 8, e: 10 }, { s: 9, e: 11 }, { s: 11, e: 14 }, { s: 13, e: 16 }], [0, 2], 2, 'Skip A2 (conflict), Select A3 (4–7)'); }
        },
        {
            title: 'Step 3: Continue', description: 'A4 (1–8) and A5 (5–9) overlap with A3. Skip both. A6 (8–10) starts at 8 ≥ 7 (A3 end). Select A6!',
            render(c) { drawGreedy(c, [{ s: 1, e: 3 }, { s: 2, e: 5 }, { s: 4, e: 7 }, { s: 1, e: 8 }, { s: 5, e: 9 }, { s: 8, e: 10 }, { s: 9, e: 11 }, { s: 11, e: 14 }, { s: 13, e: 16 }], [0, 2, 5], 5, 'Skip A4, A5 (conflict), Select A6 (8–10)'); }
        },
        {
            title: 'Step 4: More Selections', description: 'A7 (9–11) overlaps with A6. Skip. A8 (11–14) starts at 11 ≥ 10. Select A8! A9 (13–16) overlaps. Skip.',
            render(c) { drawGreedy(c, [{ s: 1, e: 3 }, { s: 2, e: 5 }, { s: 4, e: 7 }, { s: 1, e: 8 }, { s: 5, e: 9 }, { s: 8, e: 10 }, { s: 9, e: 11 }, { s: 11, e: 14 }, { s: 13, e: 16 }], [0, 2, 5, 7], 7, 'Select A8 (11–14). 4 activities selected!'); }
        },
        {
            title: 'Optimal Solution', description: 'Greedy selected 4 non-overlapping activities [A1, A3, A6, A8] — this is the maximum possible! The greedy choice (earliest finish) is provably optimal for this problem.',
            render(c) { drawGreedy(c, [{ s: 1, e: 3 }, { s: 2, e: 5 }, { s: 4, e: 7 }, { s: 1, e: 8 }, { s: 5, e: 9 }, { s: 8, e: 10 }, { s: 9, e: 11 }, { s: 11, e: 14 }, { s: 13, e: 16 }], [0, 2, 5, 7], -1, '✓ Optimal: 4 activities selected (greedy = optimal here!)'); }
        },
    ],
    createSimulation(container, log) {
        const activities = [{ s: 1, e: 3 }, { s: 2, e: 5 }, { s: 4, e: 7 }, { s: 1, e: 8 }, { s: 5, e: 9 }, { s: 8, e: 10 }, { s: 9, e: 11 }, { s: 11, e: 14 }, { s: 13, e: 16 }];
        let selected = [], timer = null, speed = 1, step = 0, destroyed = false, lastEnd = 0, idx = 0;
        function draw() { container.innerHTML = ''; drawGreedy(container, activities, selected, idx < activities.length ? idx : -1, `Selected: ${selected.length}`); }
        function tick() {
            if (destroyed) return;
            if (idx < activities.length) {
                const a = activities[idx];
                if (a.s >= lastEnd) { selected.push(idx); lastEnd = a.e; addLog(log, `Select A${idx + 1} (${a.s}–${a.e})`); }
                else { addLog(log, `Skip A${idx + 1} (${a.s}–${a.e}) — conflict`); }
                draw(); idx++;
                timer = setTimeout(tick, 1000 / speed);
            } else {
                addLog(log, `Done! ${selected.length} activities selected`);
                setTimeout(() => { if (!destroyed) { selected = []; lastEnd = 0; idx = 0; step = 0; addLog(log, '— Loop restart —'); draw(); timer = setTimeout(tick, 1000 / speed); } }, 2500 / speed);
            }
        }
        draw();
        return { start() { if (!timer) tick(); }, pause() { clearTimeout(timer); timer = null; }, reset() { clearTimeout(timer); timer = null; selected = []; lastEnd = 0; idx = 0; step = 0; log.innerHTML = ''; draw(); }, setSpeed(s) { speed = s; }, destroy() { destroyed = true; clearTimeout(timer); } };
    }
};
function drawGreedy(c, activities, selected, hlIdx, caption) {
    const wrap = el('div', 'flex flex-col items-center gap-3');
    const maxEnd = Math.max(...activities.map(a => a.e));
    const chart = el('div', 'flex flex-col gap-1.5 w-full max-w-xl');
    activities.forEach((a, i) => {
        const row = el('div', 'flex items-center gap-2');
        const lbl = el('div', 'text-xs font-bold text-slate-400 w-8'); lbl.textContent = `A${i + 1}`;
        row.appendChild(lbl);
        const barWrap = el('div', 'relative h-7 flex-1 rounded'); barWrap.style.background = 'rgba(100,116,139,0.1)';
        const bar = el('div', 'h-full rounded flex items-center justify-center text-[10px] font-bold');
        const leftPct = (a.s / maxEnd) * 100, widthPct = ((a.e - a.s) / maxEnd) * 100;
        bar.style.cssText = `position:absolute;left:${leftPct}%;width:${widthPct}%;top:0;height:100%`;
        const isSel = selected.includes(i), isHl = i === hlIdx;
        if (isSel) { bar.className += ' bg-primary/40 text-primary border border-primary/60'; }
        else if (isHl) { bar.className += ' bg-yellow-500/30 text-yellow-400 border border-yellow-500/50 anim-pulse'; }
        else { bar.className += ' bg-slate-700/40 text-slate-400 border border-slate-600/30'; }
        bar.textContent = `${a.s}–${a.e}`;
        barWrap.appendChild(bar); row.appendChild(barWrap);
        if (isSel) { const badge = el('span', 'viz-label label-success ml-1'); badge.textContent = '✓'; row.appendChild(badge); }
        chart.appendChild(row);
    });
    // Timeline
    const tl = el('div', 'flex items-center justify-between w-full max-w-xl text-[10px] text-slate-500 mt-1 px-10');
    for (let i = 0; i <= maxEnd; i += 2) { const t = el('span', ''); t.textContent = i; tl.appendChild(t); }
    wrap.appendChild(chart); wrap.appendChild(tl);
    if (caption) { const cap = el('div', 'text-xs text-slate-400 mt-2 text-center font-medium'); cap.textContent = caption; wrap.appendChild(cap); }
    c.appendChild(wrap);
}
