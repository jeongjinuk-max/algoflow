/* Two Pointer Visualization */
window.Visualizations = window.Visualizations || {};
window.Visualizations.twopointer = {
    info: { title: 'Two Pointer', subtitle: 'Array traversal technique', type: 'Algorithm', timeComplexity: 'O(n)', timeDesc: 'Single pass with two pointers', spaceComplexity: 'O(1)', spaceDesc: 'Constant extra space' },
    steps: [
        {
            title: 'Two-Sum Problem', description: 'Given a sorted array and a target sum, find two numbers that add up to the target. The Two Pointer technique uses a left pointer (start) and right pointer (end), moving them inward.',
            render(c) { drawTP(c, [1, 3, 5, 7, 9, 11], 12, 0, 5, null, 'Find two numbers that sum to 12'); }
        },
        {
            title: 'Step 1: Check Sum', description: 'Left=0 (value 1), Right=5 (value 11). Sum = 1+11 = 12. This equals our target! In a typical problem, we might continue to find all pairs.',
            render(c) { drawTP(c, [1, 3, 5, 7, 9, 11], 12, 0, 5, { sum: 12, match: true }, '1 + 11 = 12 ✓ Found!'); }
        },
        {
            title: 'New Target: 14', description: 'Now let\'s try target=14. Left=0 (1), Right=5 (11). Sum=12 < 14. Since the sum is too small, we move the left pointer right to increase the sum.',
            render(c) { drawTP(c, [1, 3, 5, 7, 9, 11], 14, 0, 5, { sum: 12, dir: 'right' }, '1 + 11 = 12 < 14 → move left pointer right'); }
        },
        {
            title: 'Step 2: Move Left', description: 'Left=1 (3), Right=5 (11). Sum=14. Found! When sum < target, we move Left right. When sum > target, we move Right left. This narrows the search space.',
            render(c) { drawTP(c, [1, 3, 5, 7, 9, 11], 14, 1, 5, { sum: 14, match: true }, '3 + 11 = 14 ✓ Found!'); }
        },
        {
            title: 'Sum Too Large Example', description: 'Target=8. Left=0 (1), Right=5 (11). Sum=12 > 8. The sum is too large, so we move the right pointer left to decrease the sum.',
            render(c) { drawTP(c, [1, 3, 5, 7, 9, 11], 8, 0, 5, { sum: 12, dir: 'left' }, '1 + 11 = 12 > 8 → move right pointer left'); }
        },
        {
            title: 'Why It Works', description: 'Because the array is sorted, moving left pointer right increases the sum, and moving right pointer left decreases it. This guarantees we find the answer in O(n) time — much faster than O(n²) brute force.',
            render(c) { drawTP(c, [1, 3, 5, 7, 9, 11], 8, 2, 3, { sum: 12, match: true }, 'O(n) vs O(n²) — sorted array enables two pointer!'); }
        },
    ],
    createSimulation(container, log) {
        let timer = null, speed = 1, destroyed = false, step = 0;
        const arr = [1, 3, 5, 7, 9, 11, 13, 15];
        const targets = [16, 10, 22, 8, 20]; let tIdx = 0, left, right, found;
        function resetSearch() { left = 0; right = arr.length - 1; found = false; return targets[tIdx % targets.length]; }
        let target = resetSearch();
        function draw(msg) {
            container.innerHTML = '';
            drawTP(container, arr, target, left, right, found ? { sum: arr[left] + arr[right], match: true } : { sum: arr[left] + arr[right] }, msg || `Target: ${target}`);
        }
        function tick() {
            if (destroyed) return;
            if (left >= right || found) { tIdx++; target = resetSearch(); addLog(log, `New target: ${target}`); draw(); timer = setTimeout(tick, 1200 / speed); return; }
            const sum = arr[left] + arr[right];
            if (sum === target) { found = true; addLog(log, `${arr[left]} + ${arr[right]} = ${sum} ✓ Found!`); draw(`Found! ${arr[left]} + ${arr[right]} = ${target}`); }
            else if (sum < target) { addLog(log, `${arr[left]} + ${arr[right]} = ${sum} < ${target} → move left`); left++; draw(); }
            else { addLog(log, `${arr[left]} + ${arr[right]} = ${sum} > ${target} → move right`); right--; draw(); }
            step++;
            if (tIdx >= targets.length) { tIdx = 0; addLog(log, '— Loop restart —'); }
            timer = setTimeout(tick, 1000 / speed);
        }
        draw();
        return { start() { if (!timer) tick(); }, pause() { clearTimeout(timer); timer = null; }, reset() { clearTimeout(timer); timer = null; tIdx = 0; target = resetSearch(); step = 0; log.innerHTML = ''; draw(); }, setSpeed(s) { speed = s; }, destroy() { destroyed = true; clearTimeout(timer); } };
    }
};
function drawTP(c, arr, target, left, right, op, caption) {
    const wrap = el('div', 'flex flex-col items-center gap-3');
    const tgt = el('div', 'op-badge bg-primary/10 text-primary mb-2'); tgt.textContent = `Target Sum: ${target}`; wrap.appendChild(tgt);
    const row = el('div', 'flex gap-1 items-end');
    arr.forEach((v, i) => {
        const col = el('div', 'flex flex-col items-center gap-1');
        const isLeft = i === left, isRight = i === right, inRange = i >= left && i <= right;
        const isMatch = op && op.match && (isLeft || isRight);
        let cls = 'viz-empty';
        if (isMatch) cls = 'viz-sorted anim-bounce'; else if (isLeft) cls = 'viz-highlight anim-pulse'; else if (isRight) cls = 'viz-compare anim-pulse'; else if (inRange) cls = 'viz-default';
        const box = el('div', `viz-box h-12 w-12 text-sm ${cls}`); box.textContent = v; box.style.position = 'relative';
        if (isLeft) { const l = el('div', 'viz-label label-primary absolute -top-6 left-1/2 whitespace-nowrap'); l.textContent = 'L'; l.style.transform = 'translateX(-50%)'; box.appendChild(l); }
        if (isRight) { const l = el('div', 'viz-label label-warn absolute -top-6 left-1/2 whitespace-nowrap'); l.textContent = 'R'; l.style.transform = 'translateX(-50%)'; box.appendChild(l); }
        col.appendChild(box); row.appendChild(col);
    });
    wrap.appendChild(row);
    if (op) {
        const info = el('div', `op-badge mt-3 ${op.match ? 'bg-green-500/10 text-green-400' : 'bg-slate-800/50 text-slate-300'}`);
        info.textContent = `${arr[left]} + ${arr[right]} = ${op.sum}${op.match ? ' ✓' : ''}${op.dir === 'right' ? ' → move L right' : op.dir === 'left' ? ' → move R left' : ''}`;
        wrap.appendChild(info);
    }
    if (caption) { const cap = el('div', 'text-xs text-slate-400 mt-2 text-center font-medium'); cap.textContent = caption; wrap.appendChild(cap); }
    c.appendChild(wrap);
}
