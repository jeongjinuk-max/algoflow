/* Hash Table Visualization */
window.Visualizations = window.Visualizations || {};
window.Visualizations.hashtable = {
    info: { title: 'Hash Table', subtitle: 'Key-value data structure', type: 'Data Structure', timeComplexity: 'O(1) avg', timeDesc: 'Insert/Search/Delete average', spaceComplexity: 'O(n)', spaceDesc: 'Total entries stored' },
    steps: [
        {
            title: 'Empty Hash Table', description: 'A hash table uses a hash function to map keys to bucket indices. We start with 5 empty buckets (indices 0–4). The hash function determines which bucket a key goes to.',
            render(c) { drawHT(c, 5, [], null, 'Empty hash table with 5 buckets'); }
        },
        {
            title: 'Insert "cat"', description: 'We hash the key "cat": hash("cat") % 5 = 3. The key-value pair is stored in bucket 3.',
            render(c) { drawHT(c, 5, [{ k: 'cat', b: 3 }], { op: 'insert', k: 'cat', b: 3 }, 'hash("cat") % 5 = 3 → stored in bucket 3'); }
        },
        {
            title: 'Insert "dog"', description: 'We hash "dog": hash("dog") % 5 = 1. Stored in bucket 1. No collision since bucket 1 was empty.',
            render(c) { drawHT(c, 5, [{ k: 'cat', b: 3 }, { k: 'dog', b: 1 }], { op: 'insert', k: 'dog', b: 1 }, 'hash("dog") % 5 = 1 → stored in bucket 1'); }
        },
        {
            title: 'Collision! Insert "ant"', description: 'We hash "ant": hash("ant") % 5 = 3. Bucket 3 already has "cat"! This is a collision. We resolve it by chaining — "ant" is added to the same bucket as a linked entry.',
            render(c) { drawHT(c, 5, [{ k: 'cat', b: 3 }, { k: 'dog', b: 1 }, { k: 'ant', b: 3 }], { op: 'collision', k: 'ant', b: 3 }, 'hash("ant") % 5 = 3 → COLLISION! Chained with "cat"'); }
        },
        {
            title: 'Lookup "cat"', description: 'To find "cat", we compute hash("cat") % 5 = 3. We go to bucket 3 and search the chain: first entry is "cat" — found!',
            render(c) { drawHT(c, 5, [{ k: 'cat', b: 3 }, { k: 'dog', b: 1 }, { k: 'ant', b: 3 }], { op: 'lookup', k: 'cat', b: 3 }, 'Lookup "cat": hash=3 → found in bucket 3!'); }
        },
        {
            title: 'Delete "dog"', description: 'To delete "dog", we hash it to bucket 1, find it there, and remove it. Bucket 1 is now empty again.',
            render(c) { drawHT(c, 5, [{ k: 'cat', b: 3 }, { k: 'ant', b: 3 }], { op: 'delete', k: 'dog', b: 1 }, 'Delete "dog": hash=1 → removed from bucket 1'); }
        },
    ],
    createSimulation(container, log) {
        let buckets = [[], [], [], [], []], timer = null, speed = 1, step = 0, destroyed = false, hlBucket = -1;
        const actions = [
            { op: 'ins', k: 'cat', b: 3 }, { op: 'ins', k: 'dog', b: 1 }, { op: 'ins', k: 'ant', b: 3 },
            { op: 'ins', k: 'bee', b: 4 }, { op: 'ins', k: 'fox', b: 1 }, { op: 'find', k: 'cat', b: 3 },
            { op: 'del', k: 'dog', b: 1 }, { op: 'find', k: 'ant', b: 3 }, { op: 'del', k: 'cat', b: 3 },
            { op: 'del', k: 'ant', b: 3 }, { op: 'del', k: 'bee', b: 4 }, { op: 'del', k: 'fox', b: 1 }
        ];
        function draw() {
            container.innerHTML = '';
            const wrap = el('div', 'flex flex-col gap-2 w-full max-w-lg');
            for (let i = 0; i < 5; i++) {
                const row = el('div', 'flex items-center gap-2');
                const idx = el('div', `viz-box h-10 w-12 text-xs ${i === hlBucket ? 'viz-highlight' : 'viz-default'}`); idx.textContent = i;
                row.appendChild(idx);
                const arr = el('div', 'text-slate-500'); arr.textContent = '→';
                row.appendChild(arr);
                if (buckets[i].length) {
                    buckets[i].forEach((k, j) => {
                        const box = el('div', 'viz-box viz-default h-10 px-3 text-xs'); box.textContent = k;
                        row.appendChild(box);
                        if (j < buckets[i].length - 1) { const a = el('div', 'text-slate-500 text-sm'); a.textContent = '→'; row.appendChild(a); }
                    });
                } else {
                    const emp = el('div', 'text-slate-500 text-xs italic'); emp.textContent = 'empty';
                    row.appendChild(emp);
                }
                wrap.appendChild(row);
            }
            container.appendChild(wrap);
        }
        function tick() {
            if (destroyed) return;
            const a = actions[step % actions.length];
            hlBucket = a.b;
            if (a.op === 'ins') { buckets[a.b].push(a.k); addLog(log, `Insert "${a.k}" → bucket ${a.b}`); }
            else if (a.op === 'del') { buckets[a.b] = buckets[a.b].filter(x => x !== a.k); addLog(log, `Delete "${a.k}" from bucket ${a.b}`); }
            else if (a.op === 'find') { addLog(log, `Lookup "${a.k}" → bucket ${a.b}: found!`); }
            draw(); step++;
            if (step >= actions.length) { step = 0; buckets = [[], [], [], [], []]; hlBucket = -1; addLog(log, '— Loop restart —'); }
            timer = setTimeout(tick, 1200 / speed);
        }
        draw();
        return {
            start() { if (!timer) tick(); },
            pause() { clearTimeout(timer); timer = null; },
            reset() { clearTimeout(timer); timer = null; buckets = [[], [], [], [], []]; step = 0; hlBucket = -1; log.innerHTML = ''; draw(); },
            setSpeed(s) { speed = s; },
            destroy() { destroyed = true; clearTimeout(timer); }
        };
    }
};

function drawHT(c, size, entries, op, caption) {
    const wrap = el('div', 'flex flex-col gap-3 w-full max-w-lg');
    const title = el('div', 'text-xs font-bold text-slate-400 uppercase tracking-widest mb-1'); title.textContent = 'Hash Table Buckets';
    wrap.appendChild(title);
    const buckets = Array.from({ length: size }, () => []);
    entries.forEach(e => buckets[e.b].push(e.k));
    for (let i = 0; i < size; i++) {
        const row = el('div', 'flex items-center gap-2');
        const isHl = op && op.b === i;
        const idx = el('div', `viz-box h-10 w-14 text-xs ${isHl ? 'viz-highlight' : 'viz-default'}`);
        idx.textContent = `[${i}]`;
        row.appendChild(idx);
        const arr = el('div', 'text-slate-500'); arr.textContent = '→'; row.appendChild(arr);
        if (buckets[i].length) {
            buckets[i].forEach((k, j) => {
                const isTarget = op && op.k === k;
                const cls = isTarget ? (op.op === 'collision' ? 'viz-compare anim-bounce' : op.op === 'lookup' ? 'viz-highlight anim-pulse' : 'viz-highlight anim-bounce') : 'viz-default';
                const box = el('div', `viz-box h-10 px-4 text-xs ${cls}`); box.textContent = `"${k}"`;
                row.appendChild(box);
                if (j < buckets[i].length - 1) { const a = el('div', 'text-slate-500 text-sm'); a.textContent = '→'; row.appendChild(a); }
            });
            const nl = el('div', 'text-slate-500 text-sm ml-1'); nl.textContent = '→ null'; row.appendChild(nl);
        } else {
            if (op && op.op === 'delete' && op.b === i) {
                const d = el('div', 'text-xs text-red-400 italic'); d.textContent = `"${op.k}" removed`; row.appendChild(d);
            } else {
                const emp = el('div', 'text-slate-500 text-xs italic'); emp.textContent = 'empty'; row.appendChild(emp);
            }
        }
        if (op && op.op === 'collision' && i === op.b) {
            const badge = el('span', 'viz-label label-warn ml-2'); badge.textContent = 'COLLISION!'; row.appendChild(badge);
        }
        wrap.appendChild(row);
    }
    if (caption) { const cap = el('div', 'text-xs text-slate-400 mt-3 font-medium'); cap.textContent = caption; wrap.appendChild(cap); }
    c.appendChild(wrap);
}
