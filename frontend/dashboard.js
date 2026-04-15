/* ─── OPC Dashboard Renderer ─── */

(function () {
    'use strict';

    // ─── Init ───
    document.addEventListener('DOMContentLoaded', () => {
        renderOrgChart();
        renderMetrics();
        loadTimeline();
        renderFunnel();
        renderRevenuePipes();
    });

    // ─── Module A: Org Chart (Hub-and-Spoke) ───
    function renderOrgChart() {
        const container = document.getElementById('org-chart');
        if (!container) return;

        const centerX = container.offsetWidth / 2;
        const centerY = container.offsetHeight / 2;
        const radius = Math.min(centerX, centerY) - 50;
        const outerNodes = ORG_NODES.filter(n => !n.isCenter);
        const centerNode = ORG_NODES.find(n => n.isCenter);
        const angleStep = (2 * Math.PI) / outerNodes.length;
        const startAngle = -Math.PI / 2;

        // SVG layer for connection lines
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'org-lines');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.pointerEvents = 'none';
        container.appendChild(svg);

        // Center node
        if (centerNode) {
            renderNode(container, centerNode, centerX, centerY, 80);
        }

        // Outer nodes + connection lines
        outerNodes.forEach((node, i) => {
            const angle = startAngle + i * angleStep;
            const nx = centerX + radius * Math.cos(angle);
            const ny = centerY + radius * Math.sin(angle);
            renderNode(container, node, nx, ny, 56);

            // SVG dashed line from center to node
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', centerX);
            line.setAttribute('y1', centerY);
            line.setAttribute('x2', nx);
            line.setAttribute('y2', ny);
            line.setAttribute('stroke', node.color);
            line.setAttribute('stroke-width', '1.5');
            line.setAttribute('stroke-dasharray', '6 4');
            line.setAttribute('opacity', '0.5');
            line.classList.add('breathing-line');
            // Stagger animation
            line.style.animationDelay = (i * 0.4) + 's';
            svg.appendChild(line);
        });
    }

    function renderNode(container, node, x, y, size) {
        const el = document.createElement('div');
        el.className = 'org-node' + (node.isCenter ? ' org-center' : '');
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        el.style.left = (x - size / 2) + 'px';
        el.style.top = (y - size / 2) + 'px';
        el.style.borderColor = node.color;
        el.style.boxShadow = '0 0 12px ' + node.color + '4d';

        el.innerHTML =
            '<span class="org-emoji">' + node.emoji + '</span>' +
            '<span class="org-name">' + node.name + '</span>' +
            '<span class="org-role-label">' + node.role + '</span>';

        container.appendChild(el);
    }

    // ─── Module B: Metrics ───
    function renderMetrics() {
        const grid = document.getElementById('metrics-grid');
        if (!grid) return;

        METRICS.forEach((m, i) => {
            const card = document.createElement('div');
            card.className = 'metric-card';
            card.style.setProperty('--metric-color', m.color);
            card.style.setProperty('--metric-glow', m.color + '26');
            card.style.borderColor = 'var(--glass-border)';
            card.style.animationDelay = (i * 0.1) + 's';

            card.innerHTML =
                '<div class="metric-icon">' + m.icon + '</div>' +
                '<div class="metric-label">' + m.label + '</div>' +
                '<div class="metric-value" style="color:' + m.color + '">' + m.value + '</div>' +
                '<div class="metric-desc">' + m.desc + '</div>';

            // Hover: highlight border
            card.addEventListener('mouseenter', () => {
                card.style.borderColor = m.color;
            });
            card.addEventListener('mouseleave', () => {
                card.style.borderColor = 'var(--glass-border)';
            });

            grid.appendChild(card);
        });
    }

    // ─── Module C: Timeline ───
    let TIMELINE_LOGS = [];

    async function loadTimeline() {
        try {
            const resp = await fetch('timeline-data.json');
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            TIMELINE_LOGS = await resp.json();
        } catch (err) {
            console.warn('[Dashboard] timeline-data.json 加载失败，使用备份数据:', err.message);
            TIMELINE_LOGS = typeof TIMELINE_FALLBACK !== 'undefined' ? TIMELINE_FALLBACK : [];
        }
        renderTimeline();
    }

    function renderTimeline() {
        const container = document.getElementById('timeline');
        if (!container) return;

        TIMELINE_LOGS.forEach((log, i) => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.style.animationDelay = (i * 0.08) + 's';

            item.innerHTML =
                '<div class="timeline-dot" style="background:' + log.color + '; box-shadow: 0 0 8px ' + log.color + '"></div>' +
                '<div class="timeline-content">' +
                    '<span class="timeline-meta">' + log.sender + ' · ' + log.time + '</span>' +
                    '<p class="timeline-text">' + log.text + '</p>' +
                '</div>';

            container.appendChild(item);
        });
    }

    // ─── Module D: Funnel ───
    function renderFunnel() {
        const container = document.getElementById('funnel-flow');
        if (!container) return;

        FUNNEL_DATA.forEach((stage, i) => {
            // Arrow between stages
            if (i > 0) {
                const arrow = document.createElement('div');
                arrow.className = 'funnel-arrow';
                arrow.textContent = '→';
                container.appendChild(arrow);
            }

            const node = document.createElement('div');
            node.className = 'funnel-node';

            let itemsHtml = '';
            stage.items.forEach(item => {
                itemsHtml += '<li>· ' + item + '</li>';
            });

            node.innerHTML =
                '<div class="funnel-node-icon">' + stage.icon + '</div>' +
                '<div class="funnel-node-title">' + stage.title + '</div>' +
                '<ul class="funnel-node-items">' + itemsHtml + '</ul>';

            container.appendChild(node);
        });
    }

    // ─── Module E: Revenue Pipes ───
    function renderRevenuePipes() {
        const container = document.getElementById('revenue-pipes');
        if (!container) return;

        REVENUE_PIPES.forEach(pipe => {
            const item = document.createElement('div');
            item.className = 'pipe-item';

            item.innerHTML =
                '<span class="pipe-status ' + pipe.status + '"></span>' +
                '<span class="pipe-name">' + pipe.name + '</span>' +
                '<span class="pipe-price">' + pipe.price + '</span>' +
                '<span class="pipe-note">' + pipe.note + '</span>';

            container.appendChild(item);
        });
    }

})();
