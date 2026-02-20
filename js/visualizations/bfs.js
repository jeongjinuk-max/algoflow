/* BFS (Breadth-First Search) Visualization */
window.Visualizations = window.Visualizations || {};
window.Visualizations.bfs = {
    info: { title: 'BFS (Breadth-First Search)', subtitle: 'Level-by-level graph traversal', type: 'Algorithm', timeComplexity: 'O(V + E)', timeDesc: 'V = vertices, E = edges', spaceComplexity: 'O(V)', spaceDesc: 'Queue for frontier nodes' },
    steps: [
        {
            title: 'Graph & Queue', description: 'BFS explores a graph level by level using a Queue (FIFO). Starting from a source node, it visits all neighbors before moving deeper. This guarantees finding the shortest path in unweighted graphs.',
            render(c) { drawBFS(c, [], null, [], 'Graph with 7 nodes — BFS uses a Queue'); }
        },
        {
            title: 'Step 1: Visit A', description: 'Start at node A. Mark A as visited. Add A\'s unvisited neighbors (B, C) to the Queue. Queue: [B, C].',
            render(c) { drawBFS(c, ['A'], 'A', ['B', 'C'], 'Visit A → enqueue neighbors B, C'); }
        },
        {
            title: 'Step 2: Visit B', description: 'Dequeue B from the front of the Queue. Mark B as visited. Add B\'s unvisited neighbors (D, E) to the Queue. Queue: [C, D, E].',
            render(c) { drawBFS(c, ['A', 'B'], 'B', ['C', 'D', 'E'], 'Dequeue B → visit → enqueue D, E'); }
        },
        {
            title: 'Step 3: Visit C', description: 'Dequeue C. Mark C as visited. Add C\'s unvisited neighbor (F) to the Queue. Queue: [D, E, F]. Notice: we finish level 1 (B, C) before starting level 2.',
            render(c) { drawBFS(c, ['A', 'B', 'C'], 'C', ['D', 'E', 'F'], 'Dequeue C → visit → enqueue F'); }
        },
        {
            title: 'Step 4: Visit D', description: 'Dequeue D. Mark D as visited. D has neighbor G (unvisited). Enqueue G. Queue: [E, F, G].',
            render(c) { drawBFS(c, ['A', 'B', 'C', 'D'], 'D', ['E', 'F', 'G'], 'Dequeue D → visit → enqueue G'); }
        },
        {
            title: 'Step 5: Visit E, F', description: 'Dequeue E, mark visited (no new neighbors). Dequeue F, mark visited (no new neighbors). Queue: [G].',
            render(c) { drawBFS(c, ['A', 'B', 'C', 'D', 'E', 'F'], 'F', ['G'], 'Visit E, F → no new neighbors'); }
        },
        {
            title: 'Step 6: Visit G — Complete!', description: 'Dequeue G, mark visited. Queue is empty — BFS is complete! Visit order: A→B→C→D→E→F→G. Each level was fully explored before moving to the next.',
            render(c) { drawBFS(c, ['A', 'B', 'C', 'D', 'E', 'F', 'G'], 'G', [], 'BFS Complete! Order: A→B→C→D→E→F→G'); }
        },
    ],
    createSimulation(container, log) {
        const adj = { A: ['B', 'C'], B: ['A', 'D', 'E'], C: ['A', 'F'], D: ['B', 'G'], E: ['B'], F: ['C'], G: ['D'] };
        let timer = null, speed = 1, destroyed = false, visited = [], current = null, queue = [], step = 0;
        function draw() { container.innerHTML = ''; drawBFS(container, visited, current, queue, `BFS — visited: ${visited.join(', ') || 'none'}`); }
        function tick() {
            if (destroyed) return;
            if (queue.length === 0 && step === 0) { queue.push('A'); addLog(log, 'Start: enqueue A'); draw(); step++; timer = setTimeout(tick, 1000 / speed); return; }
            if (queue.length > 0) {
                current = queue.shift();
                if (!visited.includes(current)) {
                    visited.push(current);
                    addLog(log, `Dequeue & visit ${current}`);
                    const neighbors = adj[current] || [];
                    neighbors.forEach(n => { if (!visited.includes(n) && !queue.includes(n)) { queue.push(n); } });
                }
                draw(); step++;
                timer = setTimeout(tick, 1000 / speed);
            } else {
                addLog(log, 'BFS complete!');
                setTimeout(() => {
                    if (destroyed) return;
                    visited = []; current = null; queue = []; step = 0;
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
            reset() { clearTimeout(timer); timer = null; visited = []; current = null; queue = []; step = 0; log.innerHTML = ''; draw(); },
            setSpeed(s) { speed = s; },
            destroy() { destroyed = true; clearTimeout(timer); }
        };
    }
};

function drawBFS(c, visited, current, queue, caption) {
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
    // Queue display
    const qWrap = el('div', 'flex items-center gap-2 mt-1');
    const qLbl = el('div', 'text-xs font-bold text-slate-400'); qLbl.textContent = 'Queue:';
    qWrap.appendChild(qLbl);
    if (queue.length) {
        queue.forEach(v => { const b = el('div', 'viz-box viz-default h-8 w-10 text-xs'); b.textContent = v; qWrap.appendChild(b); });
    } else { const emp = el('div', 'text-xs text-slate-500 italic'); emp.textContent = 'empty'; qWrap.appendChild(emp); }
    wrap.appendChild(qWrap);
    // Legend
    const legend = el('div', 'flex gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1');
    legend.innerHTML = '<div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full node-default"></div> Unvisited</div>'
        + '<div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full node-visited"></div> Visited</div>'
        + '<div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full node-current"></div> Current</div>';
    wrap.appendChild(legend);
    if (caption) { const cap = el('div', 'text-xs text-slate-400 mt-2 text-center font-medium'); cap.textContent = caption; wrap.appendChild(cap); }
    c.appendChild(wrap);
}
