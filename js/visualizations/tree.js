/* Tree / BST Visualization */
window.Visualizations = window.Visualizations || {};
window.Visualizations.tree = {
    info: { title: 'Tree / BST', subtitle: 'Hierarchical data structure', type: 'Data Structure', timeComplexity: 'O(log n)', timeDesc: 'Search/Insert/Delete (balanced)', spaceComplexity: 'O(n)', spaceDesc: 'Total nodes stored' },
    steps: [
        {
            title: 'What is a BST?', description: 'A Binary Search Tree (BST) is a tree where for every node: all values in the left subtree are smaller, and all values in the right subtree are larger. This enables efficient search.',
            render(c) { drawBST(c, null, -1, null, 'BST property: left < parent < right'); }
        },
        {
            title: 'Insert 8 (root)', description: 'We insert 8 as the root of the BST. Since the tree is empty, 8 becomes the root node.',
            render(c) { drawBST(c, buildBST([8]), 8, { op: 'insert' }, 'Insert 8 → becomes root'); }
        },
        {
            title: 'Insert 3, 10', description: 'Insert 3: 3 < 8, so it goes to the left. Insert 10: 10 > 8, so it goes to the right.',
            render(c) { drawBST(c, buildBST([8, 3, 10]), 10, { op: 'insert' }, 'Insert 3 (left of 8), Insert 10 (right of 8)'); }
        },
        {
            title: 'Insert 1, 6, 14', description: 'Insert 1: go left from 8 → left from 3. Insert 6: left from 8 → right from 3. Insert 14: right from 8 → right from 10.',
            render(c) { drawBST(c, buildBST([8, 3, 10, 1, 6, 14]), 14, { op: 'insert' }, 'Tree growing: 1, 6, 14 inserted'); }
        },
        {
            title: 'Search for 6', description: 'Search 6: start at root 8. 6 < 8 → go left to 3. 6 > 3 → go right. Found 6! Search follows the BST property at each step.',
            render(c) { drawBST(c, buildBST([8, 3, 10, 1, 6, 14]), 6, { op: 'search', path: [8, 3, 6] }, 'Search 6: 8→3→6 found! (2 comparisons)'); }
        },
        {
            title: 'Inorder Traversal', description: 'Inorder traversal (Left → Root → Right) visits nodes in sorted order: 1, 3, 6, 8, 10, 14. This is a key property of BSTs — inorder always gives sorted output.',
            render(c) { drawBST(c, buildBST([8, 3, 10, 1, 6, 14]), -1, { op: 'inorder', order: [1, 3, 6, 8, 10, 14] }, 'Inorder: 1 → 3 → 6 → 8 → 10 → 14 (sorted!)'); }
        },
    ],
    createSimulation(container, log) {
        let tree = null, timer = null, speed = 1, step = 0, destroyed = false, hlVal = -1;
        const actions = [{ op: 'ins', v: 8 }, { op: 'ins', v: 3 }, { op: 'ins', v: 10 }, { op: 'ins', v: 1 }, { op: 'ins', v: 6 }, { op: 'ins', v: 14 }, { op: 'ins', v: 4 }, { op: 'search', v: 6 }, { op: 'search', v: 14 }, { op: 'search', v: 1 }, { op: 'clear' }];
        function ins(node, v) { if (!node) return { v, l: null, r: null }; if (v < node.v) node.l = ins(node.l, v); else node.r = ins(node.r, v); return node; }
        function draw() { container.innerHTML = ''; drawBST(container, tree, hlVal, null, tree ? 'BST' : 'Empty BST'); }
        function tick() {
            if (destroyed) return;
            const a = actions[step % actions.length];
            if (a.op === 'ins') { tree = ins(tree, a.v); hlVal = a.v; addLog(log, `Insert ${a.v}`); }
            else if (a.op === 'search') { hlVal = a.v; addLog(log, `Search ${a.v} → found!`); }
            else if (a.op === 'clear') { tree = null; hlVal = -1; addLog(log, '— Loop restart —'); }
            draw(); step++;
            if (step >= actions.length) step = 0;
            timer = setTimeout(tick, 1000 / speed);
        }
        draw();
        return { start() { if (!timer) tick(); }, pause() { clearTimeout(timer); timer = null; }, reset() { clearTimeout(timer); timer = null; tree = null; step = 0; hlVal = -1; log.innerHTML = ''; draw(); }, setSpeed(s) { speed = s; }, destroy() { destroyed = true; clearTimeout(timer); } };
    }
};
function buildBST(vals) { let root = null; function ins(node, v) { if (!node) return { v, l: null, r: null }; if (v < node.v) node.l = ins(node.l, v); else node.r = ins(node.r, v); return node; } vals.forEach(v => root = ins(root, v)); return root; }
function drawBST(c, root, hlVal, op, caption) {
    const wrap = el('div', 'flex flex-col items-center gap-4');
    if (!root) { const e = el('div', 'text-slate-500 italic text-sm'); e.textContent = 'Empty BST'; wrap.appendChild(e); }
    else {
        const treeArea = el('div', 'relative'); treeArea.style.width = '460px'; treeArea.style.height = '240px';
        const positions = {};
        function layout(node, x, y, dx, depth) { if (!node || depth > 4) return; positions[node.v] = [x, y]; layout(node.l, x - dx, y + 65, dx / 2, depth + 1); layout(node.r, x + dx, y + 65, dx / 2, depth + 1); }
        layout(root, 220, 15, 110, 0);
        function drawEdges(node) {
            if (!node) return;[node.l, node.r].forEach(child => {
                if (child && positions[node.v] && positions[child.v]) {
                    const [x1, y1] = positions[node.v], [x2, y2] = positions[child.v]; const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy), angle = Math.atan2(dy, dx) * 180 / Math.PI;
                    const isSearchPath = op && op.op === 'search' && op.path && op.path.includes(node.v) && op.path.includes(child.v);
                    const edge = el('div', `graph-edge ${isSearchPath ? 'edge-active' : ''}`); edge.style.cssText = `left:${x1 + 20}px;top:${y1 + 20}px;width:${len}px;transform:rotate(${angle}deg)`; treeArea.appendChild(edge);
                } drawEdges(child);
            });
        }
        drawEdges(root);
        function drawNodes(node) {
            if (!node || !positions[node.v]) return; const [x, y] = positions[node.v]; const isHl = node.v === hlVal; const isSearch = op && op.op === 'search' && op.path && op.path.includes(node.v); const isInorder = op && op.op === 'inorder';
            const cls = isHl ? 'node-current anim-pulse' : isSearch ? 'node-visited' : 'node-default';
            const nd = el('div', `graph-node ${cls}`); nd.textContent = node.v; nd.style.cssText = `left:${x}px;top:${y}px;width:40px;height:40px;font-size:0.8rem`; treeArea.appendChild(nd); drawNodes(node.l); drawNodes(node.r);
        }
        drawNodes(root);
        wrap.appendChild(treeArea);
        if (op && op.op === 'inorder') { const row = el('div', 'flex gap-1 items-center mt-2'); op.order.forEach((v, i) => { const b = el('div', 'viz-box viz-highlight h-8 w-10 text-xs anim-fade'); b.textContent = v; row.appendChild(b); if (i < op.order.length - 1) { const a = el('div', 'text-primary text-xs'); a.textContent = '→'; row.appendChild(a); } }); const lbl = el('div', 'text-[10px] text-slate-400 mb-1'); lbl.textContent = 'Inorder:'; const w2 = el('div', 'flex flex-col items-center'); w2.appendChild(lbl); w2.appendChild(row); wrap.appendChild(w2); }
    }
    if (caption) { const cap = el('div', 'text-xs text-slate-400 mt-2 text-center font-medium'); cap.textContent = caption; wrap.appendChild(cap); }
    c.appendChild(wrap);
}
