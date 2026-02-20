/* AlgoFlow — Main Application Controller */
(function () {
    const TOPICS = [
        { id: 'stack', icon: 'layers', category: 'ds' },
        { id: 'queue', icon: 'queue', category: 'ds' },
        { id: 'array', icon: 'view_column', category: 'ds' },
        { id: 'linkedlist', icon: 'link', category: 'ds' },
        { id: 'hashtable', icon: 'tag', category: 'ds' },
        { id: 'heap', icon: 'filter_alt', category: 'ds' },
        { id: 'tree', icon: 'account_tree', category: 'ds' },
        { id: 'bubblesort', icon: 'filter_list', category: 'algo' },
        { id: 'mergesort', icon: 'call_merge', category: 'algo' },
        { id: 'quicksort', icon: 'sort', category: 'algo' },
        { id: 'binarysearch', icon: 'search', category: 'algo' },
        { id: 'bfs', icon: 'hub', category: 'algo' },
        { id: 'dfs', icon: 'account_tree', category: 'algo' },
        { id: 'dijkstra', icon: 'route', category: 'algo' },
        { id: 'greedy', icon: 'emoji_objects', category: 'algo' },
        { id: 'dp', icon: 'grid_on', category: 'algo' },
        { id: 'twopointer', icon: 'compare_arrows', category: 'algo' },
    ];

    let currentId = null, currentStep = 0, currentSim = null;
    // Flag: true when navigating via browser back/forward (popstate)
    // This prevents pushState from being called during popstate handling
    let navigatingFromPopstate = false;
    const V = () => window.Visualizations || {};

    function init() {
        // Hide SEO crawlable content — Google sees it, users see the app
        const seoEl = document.getElementById('seo-content');
        if (seoEl) seoEl.style.display = 'none';

        buildNav();

        // Logo click → landing page
        const logoBtn = document.getElementById('logo-btn');
        if (logoBtn) logoBtn.addEventListener('click', () => showLanding());

        // Support hash-based navigation (e.g. #bfs, #dijkstra)
        const hashId = location.hash.replace('#', '');
        const validTopic = TOPICS.find(t => t.id === hashId);
        if (validTopic) {
            selectTopic(hashId, true); // initial load → replaceState
        } else {
            showLanding(true); // initial load → replaceState
        }

        // Back/Forward: Browser History Stack popstate event
        // Browser History = 2 stacks (Back Stack + Forward Stack)
        // pushState → push to Back Stack, clear Forward Stack
        // Back → pop from Back Stack → push to Forward Stack
        // Forward → pop from Forward Stack → push to Back Stack
        window.addEventListener('popstate', (e) => {
            navigatingFromPopstate = true;
            const state = e.state;
            if (state && state.topicId) {
                selectTopic(state.topicId);
            } else {
                showLanding();
            }
            navigatingFromPopstate = false;
        });
    }

    /* ─── Landing Page ─── */
    function showLanding(isInitialLoad) {
        if (currentSim) { currentSim.destroy(); currentSim = null; }
        currentId = null;
        // Hide sidebar on landing page
        const sidebar = document.querySelector('aside');
        if (sidebar) sidebar.classList.add('hidden');
        document.querySelectorAll('.nav-item').forEach(el => {
            el.className = 'nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 transition-colors';
        });
        // Push landing state to history stack (enables back navigation)
        if (!navigatingFromPopstate) {
            if (isInitialLoad) {
                history.replaceState({ topicId: null }, '', location.pathname);
            } else {
                history.pushState({ topicId: null }, '', location.pathname);
            }
        }
        document.title = 'AlgoFlow — Interactive Data Structure & Algorithm Visualizer';

        const c = document.getElementById('main-content');
        const dsList = TOPICS.filter(t => t.category === 'ds');
        const algoList = TOPICS.filter(t => t.category === 'algo');

        c.innerHTML = `
        <div class="max-w-5xl mx-auto">
            <!-- Hero Section -->
            <div class="text-center mb-12 pt-8">
                <div class="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
                    <span class="material-symbols-outlined text-sm">auto_awesome</span> 17 Essential Topics · Step-by-Step Visualizations
                </div>
                <h2 class="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-primary to-cyan-300 bg-clip-text text-transparent leading-tight pb-1">
                    Algorithms,<br>Visualized.
                </h2>
                <p class="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Stop reading. <strong class="text-slate-300">Start seeing.</strong>
                    Watch how data structures and algorithms actually work — step by step.
                </p>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4 mb-12">
                <div class="glass rounded-xl p-5 text-center border border-slate-800 hover:border-primary/30 transition-colors">
                    <p class="text-3xl font-bold text-primary mb-1">17</p>
                    <p class="text-xs text-slate-400 uppercase tracking-wider">Core Topics</p>
                </div>
                <div class="glass rounded-xl p-5 text-center border border-slate-800 hover:border-primary/30 transition-colors">
                    <p class="text-3xl font-bold text-primary mb-1">Step-by-Step</p>
                    <p class="text-xs text-slate-400 uppercase tracking-wider">Visual Walkthroughs</p>
                </div>
                <div class="glass rounded-xl p-5 text-center border border-slate-800 hover:border-primary/30 transition-colors">
                    <p class="text-3xl font-bold text-primary mb-1">▶ Play</p>
                    <p class="text-xs text-slate-400 uppercase tracking-wider">Live Simulations</p>
                </div>
            </div>

            <!-- Data Structures Grid -->
            <div class="mb-10">
                <div class="flex items-center gap-3 mb-5">
                    <div class="w-1 h-6 bg-primary rounded-full"></div>
                    <h3 class="text-sm font-bold text-slate-300 uppercase tracking-widest">Data Structures</h3>
                    <span class="text-xs text-slate-500 ml-1">${dsList.length}</span>
                </div>
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    ${dsList.map(t => topicCard(t)).join('')}
                </div>
            </div>

            <!-- Algorithms Grid -->
            <div class="mb-10">
                <div class="flex items-center gap-3 mb-5">
                    <div class="w-1 h-6 bg-cyan-400 rounded-full"></div>
                    <h3 class="text-sm font-bold text-slate-300 uppercase tracking-widest">Algorithms</h3>
                    <span class="text-xs text-slate-500 ml-1">${algoList.length}</span>
                </div>
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    ${algoList.map(t => topicCard(t)).join('')}
                </div>
            </div>

            <!-- Footer -->
            <div class="text-center py-8 border-t border-slate-800/50">
                <p class="text-xs text-slate-500">AlgoFlow — Interactive Data Structure & Algorithm Visualization Platform</p>
            </div>
        </div>`;

        // Attach click handlers
        c.querySelectorAll('[data-topic]').forEach(el => {
            el.addEventListener('click', () => selectTopic(el.dataset.topic));
        });
    }

    function topicCard(t) {
        const vis = V()[t.id];
        if (!vis) return '';
        return `
        <div data-topic="${t.id}" class="group glass rounded-xl p-4 border border-slate-800 hover:border-primary/50 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
            <div class="flex items-start justify-between mb-3">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                    <span class="material-symbols-outlined">${t.icon}</span>
                </div>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase font-bold">${vis.info.type}</span>
            </div>
            <h4 class="text-sm font-bold mb-1 group-hover:text-primary transition-colors">${vis.info.title}</h4>
            <p class="text-[11px] text-slate-500 mb-2 line-clamp-1">${vis.info.subtitle}</p>
            <div class="flex items-center gap-2 text-[10px] text-primary/70">
                <span>${vis.info.timeComplexity}</span>
                <span class="text-slate-700">·</span>
                <span>${vis.info.spaceComplexity}</span>
            </div>
        </div>`;
    }

    /* ─── Navigation ─── */
    function buildNav() {
        const dsNav = document.getElementById('nav-ds');
        const algoNav = document.getElementById('nav-algo');
        TOPICS.forEach(t => {
            const vis = V()[t.id];
            if (!vis) return;
            const a = document.createElement('a');
            a.href = '#';
            a.dataset.id = t.id;
            a.className = 'nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 transition-colors';
            a.innerHTML = `<span class="material-symbols-outlined text-xl">${t.icon}</span> ${vis.info.title}`;
            a.addEventListener('click', e => { e.preventDefault(); selectTopic(t.id); });
            (t.category === 'ds' ? dsNav : algoNav).appendChild(a);
        });
    }

    function selectTopic(id, isInitialLoad) {
        if (currentSim) { currentSim.destroy(); currentSim = null; }
        currentId = id; currentStep = 0;
        // Show sidebar when viewing a topic
        const sidebar = document.querySelector('aside');
        if (sidebar) sidebar.classList.remove('hidden');
        document.querySelectorAll('.nav-item').forEach(el => {
            const isActive = el.dataset.id === id;
            el.className = 'nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ' +
                (isActive ? 'text-primary sidebar-item-active font-medium' : 'text-slate-400 hover:bg-slate-800');
        });
        // Push topic state to history stack (enables back navigation)
        if (!navigatingFromPopstate) {
            if (isInitialLoad) {
                history.replaceState({ topicId: id }, '', '#' + id);
            } else {
                history.pushState({ topicId: id }, '', '#' + id);
            }
        }
        // Update document title per topic for Google title links
        const vis = V()[id];
        if (vis) document.title = `${vis.info.title} — AlgoFlow | Algorithm Visualizer`;
        renderContent();
    }

    /* ─── Topic Content ─── */
    function renderContent() {
        const vis = V()[currentId];
        if (!vis) return;
        const c = document.getElementById('main-content');
        c.innerHTML = `
        <div class="grid grid-cols-1 gap-6 mb-8">
            <div class="glass p-6 rounded-xl border-l-4 border-l-primary">
                <div class="flex justify-between items-start mb-4">
                    <div><h2 class="text-lg font-bold">${vis.info.title}</h2><p class="text-sm text-slate-400">${vis.info.subtitle}</p></div>
                    <span class="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded uppercase">${vis.info.type}</span>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="p-3 rounded-lg bg-slate-800/50">
                        <p class="text-xs text-slate-400 mb-1 uppercase tracking-tighter">Time Complexity</p>
                        <p class="text-xl font-bold text-primary">${vis.info.timeComplexity}</p>
                        <p class="text-[10px] text-slate-500 mt-1">${vis.info.timeDesc}</p>
                    </div>
                    <div class="p-3 rounded-lg bg-slate-800/50">
                        <p class="text-xs text-slate-400 mb-1 uppercase tracking-tighter">Space Complexity</p>
                        <p class="text-xl font-bold text-primary">${vis.info.spaceComplexity}</p>
                        <p class="text-[10px] text-slate-500 mt-1">${vis.info.spaceDesc}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col glass rounded-2xl overflow-hidden" style="min-height:520px">
            <div class="flex border-b border-slate-800 bg-slate-800/20">
                <button id="tab-steps" class="tab-btn px-8 py-4 text-sm font-bold transition-all flex items-center gap-2">
                    <span class="material-symbols-outlined text-lg">view_carousel</span> Step-by-Step
                </button>
                <button id="tab-sim" class="tab-btn px-8 py-4 text-sm font-bold transition-all flex items-center gap-2">
                    <span class="material-symbols-outlined text-lg">play_circle</span> Simulation
                </button>
            </div>
            <div id="viz-content" class="flex-1 canvas-bg p-8"></div>
        </div>`;
        document.getElementById('tab-steps').addEventListener('click', () => switchTab('steps'));
        document.getElementById('tab-sim').addEventListener('click', () => switchTab('sim'));
        switchTab('steps');
    }

    function switchTab(tab) {
        const sBtn = document.getElementById('tab-steps'), mBtn = document.getElementById('tab-sim');
        const act = 'tab-btn px-8 py-4 text-sm font-bold text-primary border-b-2 border-primary transition-all flex items-center gap-2';
        const ina = 'tab-btn px-8 py-4 text-sm font-bold text-slate-400 hover:text-slate-300 transition-all flex items-center gap-2';
        if (tab === 'steps') { sBtn.className = act; mBtn.className = ina; renderSteps(); }
        else { mBtn.className = act; sBtn.className = ina; renderSim(); }
    }

    function renderSteps() {
        if (currentSim) { currentSim.destroy(); currentSim = null; }
        const vis = V()[currentId], steps = vis.steps;
        const c = document.getElementById('viz-content');
        c.innerHTML = `
        <div class="flex gap-8 h-full">
            <div class="w-72 flex flex-col gap-4 shrink-0">
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest">Step-by-Step Guide</h4>
                <div class="flex items-center gap-3">
                    <button id="s-prev" class="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-30"><span class="material-symbols-outlined">chevron_left</span></button>
                    <span id="s-count" class="text-sm font-bold text-primary flex-1 text-center"></span>
                    <button id="s-next" class="p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-30"><span class="material-symbols-outlined">chevron_right</span></button>
                </div>
                <div id="s-title" class="text-base font-bold"></div>
                <div id="s-desc" class="text-sm text-slate-400 leading-relaxed"></div>
                <div id="s-dots" class="flex gap-1.5 flex-wrap mt-2"></div>
            </div>
            <div class="flex-1 flex items-center justify-center relative" style="min-height:380px">
                <div class="absolute inset-0 grid-bg"></div>
                <div id="s-render" class="relative z-10 w-full h-full flex items-center justify-center"></div>
            </div>
        </div>`;
        document.getElementById('s-prev').addEventListener('click', () => { if (currentStep > 0) { currentStep--; updateStep(); } });
        document.getElementById('s-next').addEventListener('click', () => { if (currentStep < steps.length - 1) { currentStep++; updateStep(); } });
        updateStep();
    }

    function updateStep() {
        const steps = V()[currentId].steps, s = steps[currentStep];
        document.getElementById('s-count').textContent = `Step ${currentStep + 1} / ${steps.length}`;
        document.getElementById('s-title').textContent = s.title;
        document.getElementById('s-desc').textContent = s.description;
        document.getElementById('s-prev').disabled = currentStep === 0;
        document.getElementById('s-next').disabled = currentStep === steps.length - 1;
        const dots = document.getElementById('s-dots');
        dots.innerHTML = steps.map((_, i) =>
            `<div class="w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${i === currentStep ? 'bg-primary scale-125' : 'bg-slate-700 hover:bg-slate-600'}" data-i="${i}"></div>`
        ).join('');
        dots.querySelectorAll('[data-i]').forEach(d => d.addEventListener('click', () => { currentStep = +d.dataset.i; updateStep(); }));
        const r = document.getElementById('s-render');
        r.innerHTML = '';
        s.render(r);
    }

    function renderSim() {
        if (currentSim) { currentSim.destroy(); currentSim = null; }
        const vis = V()[currentId];
        const c = document.getElementById('viz-content');
        c.innerHTML = `
        <div class="flex gap-8 h-full">
            <div class="w-72 flex flex-col gap-4 shrink-0">
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest">Simulation Controls</h4>
                <div class="flex gap-2">
                    <button id="sim-play" class="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-1 transition-all shadow-lg shadow-primary/20">
                        <span class="material-symbols-outlined text-lg">play_arrow</span> Play
                    </button>
                    <button id="sim-pause" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-1 transition-all hidden">
                        <span class="material-symbols-outlined text-lg">pause</span> Pause
                    </button>
                    <button id="sim-reset" class="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center transition-all">
                        <span class="material-symbols-outlined text-lg">restart_alt</span>
                    </button>
                </div>
                <div>
                    <label class="text-xs text-slate-400 uppercase tracking-widest mb-2 block">Speed</label>
                    <input id="sim-speed" type="range" min="0.5" max="2" step="0.5" value="1" class="w-full"/>
                    <div class="flex justify-between text-[10px] text-slate-500 mt-1"><span>0.5x</span><span>1x</span><span>1.5x</span><span>2x</span></div>
                </div>
                <div id="sim-log" class="text-sm text-slate-400 mt-2 space-y-1 max-h-48 overflow-y-auto"></div>
            </div>
            <div class="flex-1 flex items-center justify-center relative" style="min-height:380px">
                <div class="absolute inset-0 grid-bg"></div>
                <div id="sim-render" class="relative z-10 w-full h-full flex items-center justify-center"></div>
            </div>
        </div>`;
        const sr = document.getElementById('sim-render');
        const sl = document.getElementById('sim-log');
        currentSim = vis.createSimulation(sr, sl);
        let playing = false;
        const playBtn = document.getElementById('sim-play'), pauseBtn = document.getElementById('sim-pause');
        playBtn.addEventListener('click', () => { currentSim.start(); playing = true; playBtn.classList.add('hidden'); pauseBtn.classList.remove('hidden'); });
        pauseBtn.addEventListener('click', () => { currentSim.pause(); playing = false; pauseBtn.classList.add('hidden'); playBtn.classList.remove('hidden'); });
        document.getElementById('sim-reset').addEventListener('click', () => { currentSim.reset(); playing = false; pauseBtn.classList.add('hidden'); playBtn.classList.remove('hidden'); });
        document.getElementById('sim-speed').addEventListener('input', e => currentSim.setSpeed(+e.target.value));
    }

    document.addEventListener('DOMContentLoaded', init);
})();
