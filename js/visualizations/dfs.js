/* DFS (Depth-First Search) Visualization */
window.Visualizations = window.Visualizations || {};
window.Visualizations.dfs = {
    info: { title: 'DFS (Depth-First Search)', subtitle: 'Deep-dive graph traversal', type: 'Algorithm', timeComplexity: 'O(V + E)', timeDesc: 'V = vertices, E = edges', spaceComplexity: 'O(V)', spaceDesc: 'Stack (recursion or explicit)' },
    steps: [
        {
            title: 'Graph & Stack', description: 'DFS explores as far as possible along each branch before backtracking. It uses a Stack (LIFO) — either explicitly or via recursion. DFS is great for pathfinding, cycle detection, and topological sorting.',
            render(c) { drawDFS(c, [], null, [], 'Graph with 7 nodes — DFS uses a Stack'); }
        },
        {
            title: 'Step 1: Visit A', description: 'Start at node A. Push A onto the Stack. Pop A, mark as visited. Push A\'s neighbors (C, B) onto the Stack (reverse order so B is processed first). Stack: [C, B].',
            render(c) { drawDFS(c, ['A'], 'A', ['C', 'B'], 'Visit A → push neighbors B, C to stack'); }
        },
        {
            title: 'Step 2: Visit B (go deep!)', description: 'Pop B from the top of the Stack. Mark B as visited. Push B\'s unvisited neighbors (E, D). Stack: [C, E, D]. We go DEEP into B\'s branch first!',
            render(c) { drawDFS(c, ['A', 'B'], 'B', ['C', 'E', 'D'], 'Pop B → visit → push D, E (go deep!)'); }
        },
        {
            title: 'Step 3: Visit D', description: 'Pop D from the Stack. Mark D as visited. Push D\'s unvisited neighbor (G). Stack: [C, E, G]. We keep going deeper!',
            render(c) { drawDFS(c, ['A', 'B', 'D'], 'D', ['C', 'E', 'G'], 'Pop D → visit → push G (deeper!)'); }
        },
        {
            title: 'Step 4: Visit G (deepest)', description: 'Pop G from the Stack. Mark G as visited. G has no unvisited neighbors. Stack: [C, E]. We\'ve reached the deepest point on this branch — time to backtrack!',
            render(c) { drawDFS(c, ['A', 'B', 'D', 'G'], 'G', ['C', 'E'], 'Pop G → visit → dead end, backtrack'); }
        },
        {
            title: 'Step 5: Backtrack to E', description: 'Pop E from the Stack. Mark E as visited. E has no unvisited neighbors. Stack: [C]. We\'ve finished B\'s entire branch (B→D→G→E). Now we backtrack to A\'s other branch.',
            render(c) { drawDFS(c, ['A', 'B', 'D', 'G', 'E'], 'E', ['C'], 'Pop E → visit → B\'s branch complete'); }
        },
        {
            title: 'Step 6: Visit C, F — Complete!', description: 'Pop C, mark visited, push F. Pop F, mark visited. Stack is empty — DFS is complete! Visit order: A→B→D→G→E→C→F. Notice: DFS went deep first (A→B→D→G) before exploring other branches.',
            render(c) { drawDFS(c, ['A', 'B', 'D', 'G', 'E', 'C', 'F'], 'F', [], 'DFS Complete! Order: A→B→D→G→E→C→F'); }
        },
    ],
    createSimulation(container, log) {
        const adj = { A: ['B', 'C'], B: ['A', 'D', 'E'], C: ['A', 'F'], D: ['B', 'G'], E: ['B'], F: ['C'], G: ['D'] };
        let timer = null, speed = 1, destroyed = false, visited = [], current = null, stack = [], step = 0;
        function draw() { container.innerHTML = ''; drawDFS(container, visited, current, stack, `DFS — visited: ${visited.join(', ') || 'none'}`); }
        function tick() {
            if (destroyed) return;
            if (stack.length === 0 && step === 0) { stack.push('A'); addLog(log, 'Start: push A'); draw(); step++; timer = setTimeout(tick, 1000 / speed); return; }
            if (stack.length > 0) {
                current = stack.pop();
                if (!visited.includes(current)) {
                    visited.push(current);
                    addLog(log, `Pop & visit ${current}`);
                    const neighbors = (adj[current] || []).slice().reverse();
                    neighbors.forEach(n => { if (!visited.includes(n)) { stack.push(n); } });
                }
                draw(); step++;
                timer = setTimeout(tick, 1000 / speed);
            } else {
                addLog(log, 'DFS complete!');
                setTimeout(() => {
                    if (destroyed) return;
                    visited = []; current = null; stack = []; step = 0;
                    addLog(log, '— Loop restart —');
                    draw();
                    timer = setTimeout(tick, 1200 / speed);
                }, 2000 / speed);
            }
        }
        draw();
        return {
            start() { if (!timer) tick(); },
            pause() { clearTimeout(timer); timer = null; },
            reset() { clearTimeout(timer); timer = null; visited = []; current = null; stack = []; step = 0; log.innerHTML = ''; draw(); },
            setSpeed(s) { speed = s; },
            destroy() { destroyed = true; clearTimeout(timer); }
        };
    }
};

function drawDFS(c, visited, current, stack, caption) {
    const wrap = el('div', 'flex flex-col items-center gap-4');
    const graphArea = el('div', 'relative'); graphArea.style.width = '460px'; graphArea.style.height = '280px';
    const positions = { A: [210, 15], B: [100, 95], C: [320, 95], D: [40, 190], E: [170, 190], F: [350, 190], G: [100, 270] };
    const edges = [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'F'], ['D', 'G']];
    edges.forEach(([from, to]) => {
        const [x1, y1] = positions[from], [x2, y2] = positions[to];
        const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy), angle = Math.atan2(dy, dx) * 180 / Math.PI;
        const bothV = visited.includes(from) && visited.includes(to);
        const edge = el('div', `graph-edge ${bothV ? 'edge-active' : ''}`);
        edge.style.cssText = `left:${x1 + 24}px;top:${y1 + 24}px;width:${len}px;transform:rotate(${angle}deg)`;
        graphArea.appendChild(edge);
    });
    Object.entries(positions).forEach(([name, [x, y]]) => {
        const isVisited = visited.includes(name), isCurrent = name === current;
        const cls = isCurrent ? 'node-current anim-pulse' : isVisited ? 'node-visited' : 'node-default';
        const node = el('div', `graph-node ${cls}`);
        node.textContent = name; node.style.left = x + 'px'; node.style.top = y + 'px';
        graphArea.appendChild(node);
    });
    wrap.appendChild(graphArea);
    // Stack display (shown top to bottom, top of stack first)
    const sWrap = el('div', 'flex items-center gap-2 mt-1');
    const sLbl = el('div', 'text-xs font-bold text-slate-400'); sLbl.textContent = 'Stack:';
    sWrap.appendChild(sLbl);
    if (stack.length) {
        [...stack].reverse().forEach((v, i) => {
            const b = el('div', `viz-box h-8 w-10 text-xs ${i === 0 ? 'viz-highlight' : 'viz-default'}`); b.textContent = v;
            if (i === 0) { b.style.position = 'relative'; const lbl = el('div', 'viz-label label-primary absolute -top-5 left-1/2 whitespace-nowrap'); lbl.textContent = 'TOP'; lbl.style.transform = 'translateX(-50%)'; b.appendChild(lbl); }
            sWrap.appendChild(b);
        });
    } else { const emp = el('div', 'text-xs text-slate-500 italic'); emp.textContent = 'empty'; sWrap.appendChild(emp); }
    wrap.appendChild(sWrap);
    // Legend
    const legend = el('div', 'flex gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1');
    legend.innerHTML = '<div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full node-default"></div> Unvisited</div>'
        + '<div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full node-visited"></div> Visited</div>'
        + '<div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full node-current"></div> Current</div>';
    wrap.appendChild(legend);
    if (caption) { const cap = el('div', 'text-xs text-slate-400 mt-2 text-center font-medium'); cap.textContent = caption; wrap.appendChild(cap); }
    c.appendChild(wrap);
}
