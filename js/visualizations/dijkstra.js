/* Dijkstra's Algorithm Visualization */
window.Visualizations = window.Visualizations || {};
window.Visualizations.dijkstra = {
    info: { title: 'Dijkstra\'s Algorithm', subtitle: 'Shortest path algorithm', type: 'Algorithm', timeComplexity: 'O((V+E) log V)', timeDesc: 'With priority queue', spaceComplexity: 'O(V)', spaceDesc: 'Distance table + visited set' },
    steps: [
        {
            title: 'Weighted Graph', description: 'Dijkstra\'s algorithm finds the shortest path from a source node to all other nodes in a weighted graph. We have 5 nodes (A–E) with weighted edges.',
            render(c) { drawDijkstra(c, { A: 0, B: Infinity, C: Infinity, D: Infinity, E: Infinity }, [], null, 'Weighted graph — find shortest paths from A'); }
        },
        {
            title: 'Start at A (dist=0)', description: 'Initialize: distance to A = 0, all others = ∞. Mark A as current. Update neighbors: B = 4, C = 2.',
            render(c) { drawDijkstra(c, { A: 0, B: 4, C: 2, D: Infinity, E: Infinity }, ['A'], 'A', 'Visit A: B=4, C=2'); }
        },
        {
            title: 'Visit C (dist=2)', description: 'Pick the unvisited node with smallest distance: C (dist=2). Update C\'s neighbors: D = 2+3 = 5, B = min(4, 2+1) = 3.',
            render(c) { drawDijkstra(c, { A: 0, B: 3, C: 2, D: 5, E: Infinity }, ['A', 'C'], 'C', 'Visit C: B updated to 3, D=5'); }
        },
        {
            title: 'Visit B (dist=3)', description: 'Next smallest: B (dist=3). Update B\'s neighbors: D = min(5, 3+1) = 4, E = 3+5 = 8.',
            render(c) { drawDijkstra(c, { A: 0, B: 3, C: 2, D: 4, E: 8 }, ['A', 'C', 'B'], 'B', 'Visit B: D updated to 4, E=8'); }
        },
        {
            title: 'Visit D (dist=4)', description: 'Next: D (dist=4). Update D\'s neighbors: E = min(8, 4+2) = 6.',
            render(c) { drawDijkstra(c, { A: 0, B: 3, C: 2, D: 4, E: 6 }, ['A', 'C', 'B', 'D'], 'D', 'Visit D: E updated to 6'); }
        },
        {
            title: 'Complete!', description: 'Visit E (dist=6). All nodes visited! Shortest paths from A: B=3, C=2, D=4, E=6. Dijkstra always picks the nearest unvisited node — this greedy choice guarantees optimality.',
            render(c) { drawDijkstra(c, { A: 0, B: 3, C: 2, D: 4, E: 6 }, ['A', 'C', 'B', 'D', 'E'], null, 'All shortest paths found!'); }
        },
    ],
    createSimulation(container, log) {
        let dist, visited, timer = null, speed = 1, step = 0, destroyed = false, current = null;
        const order = ['A', 'C', 'B', 'D', 'E'];
        const distSteps = [{ A: 0, B: Infinity, C: Infinity, D: Infinity, E: Infinity }, { A: 0, B: 4, C: 2, D: Infinity, E: Infinity }, { A: 0, B: 3, C: 2, D: 5, E: Infinity }, { A: 0, B: 3, C: 2, D: 4, E: 8 }, { A: 0, B: 3, C: 2, D: 4, E: 6 }, { A: 0, B: 3, C: 2, D: 4, E: 6 }];
        function reset() { dist = { A: 0, B: Infinity, C: Infinity, D: Infinity, E: Infinity }; visited = []; step = 0; current = null; }
        reset();
        function draw() { container.innerHTML = ''; drawDijkstra(container, dist, visited, current, `Step ${step}/${order.length}`); }
        function tick() {
            if (destroyed) return;
            if (step <= order.length) {
                dist = distSteps[step];
                if (step > 0) { current = order[step - 1]; visited = order.slice(0, step); addLog(log, `Visit ${current}, dist=${dist[current]}`); }
                draw(); step++;
                if (step > order.length) { setTimeout(() => { if (!destroyed) { reset(); addLog(log, '— Loop restart —'); draw(); timer = setTimeout(tick, 1200 / speed); } }, 2500 / speed); return; }
                timer = setTimeout(tick, 1500 / speed);
            }
        }
        draw();
        return { start() { if (!timer) tick(); }, pause() { clearTimeout(timer); timer = null; }, reset() { clearTimeout(timer); timer = null; reset(); log.innerHTML = ''; draw(); }, setSpeed(s) { speed = s; }, destroy() { destroyed = true; clearTimeout(timer); } };
    }
};
function drawDijkstra(c, dist, visited, current, caption) {
    const wrap = el('div', 'flex flex-col items-center gap-4');
    const graphArea = el('div', 'relative'); graphArea.style.width = '420px'; graphArea.style.height = '250px';
    const pos = { A: [30, 100], B: [170, 20], C: [170, 180], D: [310, 20], E: [360, 130] };
    const edges = [['A', 'B', 4], ['A', 'C', 2], ['B', 'C', 1], ['B', 'D', 1], ['C', 'D', 3], ['B', 'E', 5], ['D', 'E', 2]];
    edges.forEach(([f, t, w]) => {
        const [x1, y1] = pos[f], [x2, y2] = pos[t]; const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy), angle = Math.atan2(dy, dx) * 180 / Math.PI;
        const bothV = visited.includes(f) && visited.includes(t);
        const edge = el('div', `graph-edge ${bothV ? 'edge-active' : ''}`); edge.style.cssText = `left:${x1 + 24}px;top:${y1 + 24}px;width:${len}px;transform:rotate(${angle}deg)`;
        graphArea.appendChild(edge);
        const lbl = el('div', 'text-[10px] font-bold text-slate-400 absolute'); lbl.textContent = w; lbl.style.left = ((x1 + x2) / 2 + 20) + 'px'; lbl.style.top = ((y1 + y2) / 2 + 10) + 'px'; graphArea.appendChild(lbl);
    });
    Object.entries(pos).forEach(([name, [x, y]]) => {
        const isV = visited.includes(name), isC = name === current;
        const cls = isC ? 'node-current anim-pulse' : isV ? 'node-visited' : 'node-default';
        const node = el('div', `graph-node ${cls}`); node.textContent = name; node.style.left = x + 'px'; node.style.top = y + 'px';
        graphArea.appendChild(node);
    });
    wrap.appendChild(graphArea);
    // Distance table
    const tbl = el('div', 'flex gap-2 mt-2');
    Object.entries(dist).forEach(([k, v]) => {
        const cell = el('div', 'flex flex-col items-center gap-1');
        const name = el('div', 'text-xs font-bold text-slate-400'); name.textContent = k;
        const val = el('div', `viz-box h-8 w-12 text-xs ${visited.includes(k) ? 'viz-sorted' : v === Infinity ? 'viz-empty' : 'viz-default'}`);
        val.textContent = v === Infinity ? '∞' : v;
        cell.appendChild(name); cell.appendChild(val); tbl.appendChild(cell);
    });
    const tblLbl = el('div', 'text-[10px] text-slate-500 mb-1'); tblLbl.textContent = 'Distance Table:';
    const tblWrap = el('div', 'flex flex-col items-center'); tblWrap.appendChild(tblLbl); tblWrap.appendChild(tbl); wrap.appendChild(tblWrap);
    if (caption) { const cap = el('div', 'text-xs text-slate-400 mt-2 text-center font-medium'); cap.textContent = caption; wrap.appendChild(cap); }
    c.appendChild(wrap);
}
