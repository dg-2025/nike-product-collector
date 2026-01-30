// ==UserScript==
// @name         Nike Scraper - Design Profissional Blindado
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Extrai dados da Nike com interface moderna em azul
// @author       Daniel Gomes (IA Assistant)
// @match        https://www.nike.com.br/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 🔑 CHAVES DE ARMAZENAMENTO
    const STORAGE_DATA = 'nike_dados_coletados';
    const STORAGE_STATUS = 'nike_status_rodando';

    // ======================================================
    // 🎨 SISTEMA DE DESIGN - TEMA AZUL PROFISSIONAL
    // ======================================================
    const styles = `
        /* Reset e variáveis */
        :root {
            --primary-blue: #1e3a8a;
            --secondary-blue: #3b82f6;
            --accent-blue: #0ea5e9;
            --light-blue: #60a5fa;
            --dark-blue: #1e40af;
            --success-blue: #2dd4bf;
            --warning-orange: #f97316;
            --error-red: #ef4444;
            --background-dark: #0f172a;
            --background-light: rgba(30, 58, 138, 0.1);
            --card-bg: rgba(255, 255, 255, 0.95);
            --text-dark: #1e293b;
            --text-light: #64748b;
            --shadow-lg: 0 20px 60px rgba(30, 58, 138, 0.3);
            --shadow-md: 0 10px 40px rgba(30, 58, 138, 0.2);
            --shadow-sm: 0 4px 20px rgba(30, 58, 138, 0.15);
            --border-radius: 16px;
            --border-radius-sm: 12px;
        }

        /* Animações suaves */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulseBlue {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }

        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes cardCollected {
            0% { background-color: rgba(59, 130, 246, 0); }
            100% { background-color: rgba(59, 130, 246, 0.08); }
        }

        @keyframes cardGlow {
            0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.3); }
            50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
        }

        @keyframes checkmarkAppear {
            0% { opacity: 0; transform: scale(0) rotate(-180deg); }
            70% { transform: scale(1.2) rotate(10deg); }
            100% { opacity: 1; transform: scale(1) rotate(0); }
        }

        @keyframes wave {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Componentes principais */
        .nike-control-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--card-bg);
            border-radius: var(--border-radius);
            padding: 24px;
            box-shadow: var(--shadow-lg);
            z-index: 99999;
            min-width: 320px;
            border: 1px solid rgba(30, 58, 138, 0.1);
            backdrop-filter: blur(10px);
            animation: fadeIn 0.5s ease-out;
        }

        .nike-status-overlay {
            position: fixed;
            top: 20px;
            left: 20px;
            background: var(--card-bg);
            border-radius: var(--border-radius);
            padding: 24px;
            box-shadow: var(--shadow-lg);
            z-index: 99998;
            width: 350px;
            max-height: 80vh;
            overflow-y: auto;
            border: 1px solid rgba(30, 58, 138, 0.1);
            backdrop-filter: blur(10px);
            animation: slideIn 0.5s ease-out;
            display: none;
        }

        .nike-waves-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 99990;
            pointer-events: none;
            opacity: 0.03;
        }

        .nike-wave {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 200%;
            height: 100%;
            background: linear-gradient(60deg, var(--primary-blue) 0%, var(--secondary-blue) 50%, var(--accent-blue) 100%);
            animation: wave 12s linear infinite;
        }

        .nike-wave:nth-child(2) {
            animation: wave 18s linear infinite;
            opacity: 0.5;
        }

        /* Botões */
        .nike-btn {
            padding: 14px 28px;
            border: none;
            border-radius: var(--border-radius-sm);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            margin-bottom: 12px;
        }

        .nike-btn-primary {
            background: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
            color: white;
            box-shadow: var(--shadow-sm);
        }

        .nike-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
            background: linear-gradient(135deg, var(--dark-blue), var(--primary-blue));
        }

        .nike-btn-primary:active {
            transform: translateY(0);
        }

        .nike-btn-stop {
            background: linear-gradient(135deg, var(--error-red), #dc2626);
            color: white;
            box-shadow: var(--shadow-sm);
        }

        .nike-btn-stop:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 40px rgba(239, 68, 68, 0.3);
            background: linear-gradient(135deg, #dc2626, #b91c1c);
        }

        .nike-btn-download {
            background: linear-gradient(135deg, var(--success-blue), #0d9488);
            color: white;
            box-shadow: var(--shadow-sm);
        }

        .nike-btn-download:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 40px rgba(45, 212, 191, 0.3);
            background: linear-gradient(135deg, #0d9488, #0f766e);
        }

        /* Títulos e textos */
        .nike-title {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 20px;
            font-weight: 700;
            color: var(--primary-blue);
            margin: 0 0 20px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .nike-subtitle {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 600;
            color: var(--text-dark);
            margin: 0 0 8px 0;
        }

        .nike-text {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
            color: var(--text-light);
            line-height: 1.5;
            margin: 0;
        }

        /* Status items */
        .nike-status-item {
            background: rgba(30, 58, 138, 0.05);
            border-radius: var(--border-radius-sm);
            padding: 16px;
            margin-bottom: 12px;
            border-left: 4px solid var(--secondary-blue);
            animation: fadeIn 0.5s ease-out;
        }

        .nike-status-item.active {
            animation: pulseBlue 2s infinite;
            border-left-color: var(--accent-blue);
        }

        .nike-status-value {
            font-family: 'SF Mono', Monaco, 'Courier New', monospace;
            font-size: 13px;
            color: var(--primary-blue);
            font-weight: 600;
        }

        /* Progress bars */
        .nike-progress-container {
            background: rgba(30, 58, 138, 0.1);
            border-radius: 10px;
            height: 8px;
            overflow: hidden;
            margin: 12px 0;
        }

        .nike-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--secondary-blue), var(--accent-blue));
            border-radius: 10px;
            width: 0%;
            transition: width 0.5s ease;
        }

        /* Notificações */
        .nike-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--card-bg);
            border-radius: var(--border-radius-sm);
            padding: 16px 20px;
            box-shadow: var(--shadow-lg);
            z-index: 99997;
            max-width: 300px;
            border: 1px solid rgba(30, 58, 138, 0.1);
            animation: fadeIn 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .nike-notification-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            flex-shrink: 0;
        }

        .notification-info {
            background: rgba(59, 130, 246, 0.1);
            color: var(--secondary-blue);
        }

        .notification-success {
            background: rgba(45, 212, 191, 0.1);
            color: var(--success-blue);
        }

        .notification-warning {
            background: rgba(249, 115, 22, 0.1);
            color: var(--warning-orange);
        }

        .notification-error {
            background: rgba(239, 68, 68, 0.1);
            color: var(--error-red);
        }

        /* EFEITO PARA CARDS COLETADOS */
        .nike-card-collected {
            animation: cardCollected 0.8s ease-out forwards !important;
            position: relative !important;
            border: 2px solid var(--secondary-blue) !important;
            border-radius: 12px !important;
        }

        .nike-card-collected::before {
            content: "✓ COLETADO";
            position: absolute !important;
            top: 8px !important;
            right: 8px !important;
            background: var(--secondary-blue) !important;
            color: white !important;
            padding: 4px 10px !important;
            border-radius: 20px !important;
            font-size: 10px !important;
            font-weight: 600 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            z-index: 100 !important;
            animation: checkmarkAppear 0.5s ease-out !important;
            box-shadow: 0 2px 8px rgba(30, 58, 138, 0.3) !important;
        }

        .nike-card-collected::after {
            content: "" !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(14, 165, 233, 0.04)) !important;
            border-radius: 10px !important;
            pointer-events: none !important;
            z-index: 1 !important;
        }

        /* Efeito de glow para cards sendo coletados */
        .nike-card-collecting {
            animation: cardGlow 1.5s infinite !important;
            transition: all 0.3s ease !important;
        }

        /* Loading animation */
        .nike-loader {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(59, 130, 246, 0.2);
            border-radius: 50%;
            border-top-color: var(--secondary-blue);
            animation: spin 1s ease-in-out infinite;
        }

        /* Divider */
        .nike-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(30, 58, 138, 0.1), transparent);
            margin: 20px 0;
        }

        /* Scrollbar personalizada */
        .nike-status-overlay::-webkit-scrollbar {
            width: 6px;
        }

        .nike-status-overlay::-webkit-scrollbar-track {
            background: rgba(30, 58, 138, 0.05);
            border-radius: 3px;
        }

        .nike-status-overlay::-webkit-scrollbar-thumb {
            background: var(--secondary-blue);
            border-radius: 3px;
        }
    `;

    // ======================================================
    // 🚀 MOTOR DE SCROLL BLINDADO
    // ======================================================
    async function scrollCompletoBlindado() {
        let ultimaAltura = document.body.scrollHeight;
        let tentativasSemMudanca = 0;
        let scrollPosition = 0;
        const maxTentativas = 6;
        
        mostrarNotificacao('🔍 Iniciando varredura profunda...', 'info');
        
        while (tentativasSemMudanca < maxTentativas) {
            // Calcula quanto descer
            const viewportHeight = window.innerHeight;
            const passoScroll = viewportHeight * 0.8;
            
            // Desce suavemente
            window.scrollBy({
                top: passoScroll,
                behavior: 'smooth'
            });
            
            // Aguarda carregamento
            await new Promise(resolve => setTimeout(resolve, 1800));
            
            // Verifica se a página cresceu
            const alturaAtual = document.body.scrollHeight;
            
            if (alturaAtual > ultimaAltura) {
                // Página cresceu - novos itens carregados
                ultimaAltura = alturaAtual;
                tentativasSemMudanca = 0;
                
                // Coleta dados imediatamente
                const novosDados = extrairDadosDaPagina();
                if (novosDados.length > 0) {
                    salvarDados(novosDados);
                }
                
                // Atualiza status
                atualizarStatusOverlay({
                    total: JSON.parse(localStorage.getItem(STORAGE_DATA) || '[]').length.toString(),
                    pagina: paginaAtual.toString(),
                    status: 'Carregando...',
                    progresso: Math.min(90, Math.round((scrollPosition / alturaAtual) * 100)) + '%'
                });
            } else {
                // Nada novo
                tentativasSemMudanca++;
                
                // Tenta descer mais um pouco
                if (tentativasSemMudanca < maxTentativas) {
                    mostrarNotificacao(`⏳ Aguardando (${tentativasSemMudanca}/${maxTentativas})...`, 'info');
                }
            }
            
            // Verifica se chegou no final
            const distanciaDoFim = alturaAtual - (window.scrollY + viewportHeight);
            if (distanciaDoFim < 100) {
                // Scroll até o fundo absoluto
                window.scrollTo(0, document.body.scrollHeight);
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Última verificação
                const ultimosDados = extrairDadosDaPagina();
                if (ultimosDados.length > 0) {
                    salvarDados(ultimosDados);
                }
                
                break;
            }
            
            scrollPosition = window.scrollY;
        }
        
        mostrarNotificacao('✅ Varredura completa!', 'success');
    }

    // ======================================================
    // 🎮 FUNÇÕES AUXILIARES
    // ======================================================
    function salvarDados(novosItens) {
        if (novosItens.length === 0) return;
        
        const dadosExistentes = JSON.parse(localStorage.getItem(STORAGE_DATA) || '[]');
        const nomesExistentes = new Set(dadosExistentes.map(item => item.nome));
        
        // Filtra duplicados exatos (mesmo nome)
        const itensUnicos = novosItens.filter(item => !nomesExistentes.has(item.nome));
        
        if (itensUnicos.length > 0) {
            const todosDados = [...dadosExistentes, ...itensUnicos];
            localStorage.setItem(STORAGE_DATA, JSON.stringify(todosDados));
            return itensUnicos.length;
        }
        
        return 0;
    }

    // ======================================================
    // 🎨 SISTEMA DE INTERFACE
    // ======================================================
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // ======================================================
    // 🌊 FUNÇÕES DE BACKGROUND E EFEITOS
    // ======================================================
    function criarBackgroundWaves() {
        const wavesContainer = document.createElement('div');
        wavesContainer.className = 'nike-waves-background';

        const wave1 = document.createElement('div');
        wave1.className = 'nike-wave';

        const wave2 = document.createElement('div');
        wave2.className = 'nike-wave';

        wavesContainer.appendChild(wave1);
        wavesContainer.appendChild(wave2);
        document.body.appendChild(wavesContainer);

        return wavesContainer;
    }

    function mostrarNotificacao(mensagem, tipo = 'info', duracao = 3000) {
        // Remove notificação existente
        const notifExistente = document.querySelector('.nike-notification');
        if (notifExistente) notifExistente.remove();

        const notificacao = document.createElement('div');
        notificacao.className = 'nike-notification';

        const icon = document.createElement('div');
        icon.className = `nike-notification-icon notification-${tipo}`;

        const iconTexts = {
            'info': 'ℹ️',
            'success': '✅',
            'warning': '⚠️',
            'error': '❌'
        };
        icon.textContent = iconTexts[tipo] || 'ℹ️';

        const message = document.createElement('div');
        message.className = 'nike-text';
        message.textContent = mensagem;
        message.style.color = 'var(--text-dark)';

        notificacao.appendChild(icon);
        notificacao.appendChild(message);
        document.body.appendChild(notificacao);

        // Remove após duração
        setTimeout(() => {
            if (notificacao.parentNode) {
                notificacao.style.opacity = '0';
                notificacao.style.transform = 'translateY(-10px)';
                setTimeout(() => notificacao.remove(), 300);
            }
        }, duracao);

        return notificacao;
    }

    // ======================================================
    // 🎮 COMPONENTES DA INTERFACE
    // ======================================================
    function criarPainelControle() {
        const painel = document.createElement('div');
        painel.className = 'nike-control-panel';

        // Título
        const titulo = document.createElement('h2');
        titulo.className = 'nike-title';
        titulo.innerHTML = '<span>🤖</span> Nike Scraper Pro';

        // Subtítulo
        const subtitulo = document.createElement('p');
        subtitulo.className = 'nike-text';
        subtitulo.textContent = 'Coleta automática de produtos';
        subtitulo.style.marginBottom = '20px';

        // Botão Iniciar
        const btnIniciar = document.createElement('button');
        btnIniciar.className = 'nike-btn nike-btn-primary';
        btnIniciar.innerHTML = '🚀 Iniciar Coleta';
        btnIniciar.onclick = iniciarColeta;

        // Botão Parar
        const btnParar = document.createElement('button');
        btnParar.className = 'nike-btn nike-btn-stop';
        btnParar.innerHTML = '⏹️ Parar Coleta';
        btnParar.onclick = pararColeta;

        // Botão Baixar
        const btnBaixar = document.createElement('button');
        btnBaixar.className = 'nike-btn nike-btn-download';
        btnBaixar.innerHTML = '💾 Baixar JSON';
        btnBaixar.onclick = baixarDados;

        // Status atual
        const statusContainer = document.createElement('div');
        statusContainer.className = 'nike-status-item';

        const statusLabel = document.createElement('div');
        statusLabel.className = 'nike-subtitle';
        statusLabel.textContent = 'Status atual:';

        const statusValue = document.createElement('div');
        statusValue.className = 'nike-status-value';
        statusValue.id = 'nike-status-atual';
        statusValue.textContent = 'Pronto para iniciar';

        statusContainer.appendChild(statusLabel);
        statusContainer.appendChild(statusValue);

        // Adiciona tudo ao painel
        painel.appendChild(titulo);
        painel.appendChild(subtitulo);
        painel.appendChild(btnIniciar);
        painel.appendChild(btnParar);
        painel.appendChild(btnBaixar);
        painel.appendChild(statusContainer);

        document.body.appendChild(painel);
        return painel;
    }

    function criarOverlayStatus() {
        const overlay = document.createElement('div');
        overlay.className = 'nike-status-overlay';
        overlay.id = 'nike-status-overlay';

        const titulo = document.createElement('h2');
        titulo.className = 'nike-title';
        titulo.innerHTML = '<span>📊</span> Status da Coleta';

        const containerStatus = document.createElement('div');
        containerStatus.id = 'nike-status-items';

        overlay.appendChild(titulo);
        overlay.appendChild(containerStatus);
        document.body.appendChild(overlay);

        return overlay;
    }

    function atualizarStatusOverlay(dados) {
        const overlay = document.getElementById('nike-status-overlay');
        const container = document.getElementById('nike-status-items');

        if (!overlay || !container) return;

        // Mostra o overlay
        overlay.style.display = 'block';

        // Limpa conteúdo anterior
        container.innerHTML = '';

        // Item: Produtos coletados
        const itemProdutos = document.createElement('div');
        itemProdutos.className = 'nike-status-item active';

        const labelProdutos = document.createElement('div');
        labelProdutos.className = 'nike-subtitle';
        labelProdutos.textContent = 'Produtos coletados';

        const valueProdutos = document.createElement('div');
        valueProdutos.className = 'nike-status-value';
        valueProdutos.textContent = dados.total || '0';

        itemProdutos.appendChild(labelProdutos);
        itemProdutos.appendChild(valueProdutos);

        // Item: Página atual
        const itemPagina = document.createElement('div');
        itemPagina.className = 'nike-status-item';

        const labelPagina = document.createElement('div');
        labelPagina.className = 'nike-subtitle';
        labelPagina.textContent = 'Página atual';

        const valuePagina = document.createElement('div');
        valuePagina.className = 'nike-status-value';
        valuePagina.textContent = dados.pagina || '1';

        itemPagina.appendChild(labelPagina);
        itemPagina.appendChild(valuePagina);

        // Item: Status do processo
        const itemStatus = document.createElement('div');
        itemStatus.className = 'nike-status-item';

        const labelStatus = document.createElement('div');
        labelStatus.className = 'nike-subtitle';
        labelStatus.textContent = 'Status';

        const valueStatus = document.createElement('div');
        valueStatus.className = 'nike-status-value';
        valueStatus.textContent = dados.status || 'Ativo';

        itemStatus.appendChild(labelStatus);
        itemStatus.appendChild(valueStatus);

        // Barra de progresso
        const progressContainer = document.createElement('div');
        progressContainer.className = 'nike-progress-container';

        const progressBar = document.createElement('div');
        progressBar.className = 'nike-progress-bar';
        progressBar.style.width = dados.progresso || '0%';

        progressContainer.appendChild(progressBar);

        // Adiciona tudo ao container
        container.appendChild(itemProdutos);
        container.appendChild(itemPagina);
        container.appendChild(itemStatus);
        container.appendChild(progressContainer);
    }

    // ======================================================
    // 🔵 FUNÇÕES PARA DESTAQUE DE CARDS COLETADOS
    // ======================================================
    function marcarCardComoColetado(cardElement) {
        if (!cardElement || cardElement.classList.contains('nike-card-collected')) {
            return;
        }

        // Adiciona classe de coleta
        cardElement.classList.add('nike-card-collected');

        // Adiciona efeito temporário de coleta
        cardElement.classList.add('nike-card-collecting');

        // Remove o efeito de glow após 1.5 segundos
        setTimeout(() => {
            cardElement.classList.remove('nike-card-collecting');
        }, 1500);
    }

    function verificarEHighlightCardsColetados() {
        const dadosColetados = JSON.parse(localStorage.getItem(STORAGE_DATA) || '[]');
        if (dadosColetados.length === 0) return;

        const nomesColetados = new Set(dadosColetados.map(item => item.nome));
        const cards = document.querySelectorAll('div.group');

        cards.forEach(card => {
            try {
                const h3 = card.querySelector('h3');
                if (h3) {
                    const nomeProduto = h3.innerText.trim();
                    if (nomesColetados.has(nomeProduto)) {
                        marcarCardComoColetado(card);
                    }
                }
            } catch (e) {
                // Ignora erros em cards específicos
            }
        });
    }

    // ======================================================
    // 🧠 FUNÇÃO DE EXTRAÇÃO BLINDADA
    // ======================================================
    function extrairDadosDaPagina() {
        const selectoresCards = [
            'div[data-testid="product-card"]',
            'div.product-card',
            'div[class*="product-card"]',
            'div[class*="product"]',
            'article[data-testid="product"]',
            'div[role="listitem"]',
            'div.group'
        ];

        let cards = [];
        let novosItens = [];

        // Tenta todos os seletores possíveis
        for (const seletor of selectoresCards) {
            const elementos = document.querySelectorAll(seletor);
            if (elementos.length > 0) {
                cards = Array.from(elementos);
                break;
            }
        }

        // Se não encontrou cards, tenta achar produtos por outros métodos
        if (cards.length === 0) {
            // Método alternativo: procura por links de produtos
            const linksProdutos = document.querySelectorAll('a[href*="produto"], a[href*="product"], a[href*="tenis"], a[href*="camiseta"]');
            linksProdutos.forEach(link => {
                const card = link.closest('div') || link.parentElement;
                if (card && !cards.includes(card)) {
                    cards.push(card);
                }
            });
        }

        // Processa cada card encontrado
        cards.forEach((card, index) => {
            try {
                // Tenta encontrar o nome do produto
                let nome = '';
                const selectoresNome = [
                    'h3',
                    'h2',
                    'h1',
                    '[data-testid="product-title"]',
                    '.product-name',
                    '[class*="product-title"]',
                    '[class*="product-name"]'
                ];

                for (const seletor of selectoresNome) {
                    const elemento = card.querySelector(seletor);
                    if (elemento && elemento.textContent.trim()) {
                        nome = elemento.textContent.trim();
                        break;
                    }
                }

                if (!nome || nome.length < 3) return;

                // Extrai categoria (primeira palavra do nome)
                const categoria = nome.split(' ')[0];

                // Procura preço
                let preco = "Indisponível";
                const selectoresPreco = [
                    '[data-testid="product-price"]',
                    '.product-price',
                    '[class*="price"]',
                    'span:contains("R$")',
                    'div:contains("R$")'
                ];

                for (const seletor of selectoresPreco) {
                    if (seletor.includes('contains')) {
                        // Procura por texto "R$"
                        const elementos = card.querySelectorAll('span, div');
                        for (const el of elementos) {
                            if (el.textContent.includes('R$') && !el.className.includes('line-through')) {
                                preco = el.textContent.replace('no Pix', '').trim();
                                break;
                            }
                        }
                    } else {
                        const elemento = card.querySelector(seletor);
                        if (elemento && elemento.textContent.includes('R$')) {
                            preco = elemento.textContent.replace('no Pix', '').trim();
                            break;
                        }
                    }
                }

                // Procura imagem
                let foto = "Sem foto";
                const selectoresImagem = [
                    'img[src*="nike"]',
                    'img[alt*="produto"]',
                    'img[alt*="product"]',
                    'img[alt*="tenis"]',
                    'img[alt*="camiseta"]',
                    'img'
                ];

                for (const seletor of selectoresImagem) {
                    const img = card.querySelector(seletor);
                    if (img && (img.src || img.currentSrc)) {
                        foto = img.currentSrc || img.src;
                        break;
                    }
                }

                // Subcategoria (tenta encontrar)
                let subCategoria = "Geral";
                const selectoresSubCategoria = [
                    'span[class*="category"]',
                    'span[class*="type"]',
                    'div[class*="category"]',
                    'span[class*="text"]'
                ];

                for (const seletor of selectoresSubCategoria) {
                    const elemento = card.querySelector(seletor);
                    if (elemento && elemento.textContent.trim()) {
                        subCategoria = elemento.textContent.trim();
                        break;
                    }
                }

                // Adiciona ao array de novos itens
                novosItens.push({
                    nome: nome,
                    categoria: categoria,
                    subCategoria: subCategoria,
                    preco: preco,
                    foto: foto
                });

                // Marca o card como coletado visualmente
                setTimeout(() => {
                    marcarCardComoColetado(card);
                }, index * 50);

            } catch (e) {
                // Ignora erro neste card específico
            }
        });

        return novosItens;
    }

    // ======================================================
    // ⚙️ FUNÇÕES PRINCIPAIS
    // ======================================================
    let processoAtivo = false;
    let paginaAtual = 1;

    async function iniciarColeta() {
        if (processoAtivo) {
            mostrarNotificacao('Coleta já está em andamento', 'warning');
            return;
        }

        processoAtivo = true;
        localStorage.setItem(STORAGE_STATUS, 'rodando');

        mostrarNotificacao('🚀 Iniciando coleta massiva...', 'success');
        atualizarStatusTexto('Coletando produtos...');

        // Limpa dados anteriores se quiser começar do zero
        const dadosExistentes = JSON.parse(localStorage.getItem(STORAGE_DATA) || '[]');
        if (dadosExistentes.length === 0) {
            localStorage.setItem(STORAGE_DATA, JSON.stringify([]));
        }

        await processarPagina();
    }

    async function processarPagina() {
        if (!processoAtivo) return;

        // Atualiza overlay
        atualizarStatusOverlay({
            total: JSON.parse(localStorage.getItem(STORAGE_DATA) || '[]').length.toString(),
            pagina: paginaAtual.toString(),
            status: 'Iniciando...',
            progresso: '10%'
        });

        // Fase 1: Scroll profundo
        mostrarNotificacao(`📄 Página ${paginaAtual} - Carregando produtos...`, 'info');
        await scrollCompletoBlindado();

        // Fase 2: Extração final
        atualizarStatusOverlay({
            total: JSON.parse(localStorage.getItem(STORAGE_DATA) || '[]').length.toString(),
            pagina: paginaAtual.toString(),
            status: 'Extraindo dados...',
            progresso: '80%'
        });

        const itensColetados = extrairDadosDaPagina();
        const novos = salvarDados(itensColetados);

        // Atualiza status
        const totalAtual = JSON.parse(localStorage.getItem(STORAGE_DATA) || '[]').length;
        atualizarStatusOverlay({
            total: totalAtual.toString(),
            pagina: paginaAtual.toString(),
            status: 'Dados extraídos',
            progresso: '95%'
        });

        if (novos > 0) {
            mostrarNotificacao(`✅ Página ${paginaAtual}: ${novos} novos produtos`, 'success');
        }

        // Verifica próxima página
        await verificarProximaPagina(totalAtual);
    }

    async function verificarProximaPagina(totalAcumulado) {
        if (!processoAtivo) return;

        await new Promise(r => setTimeout(r, 2000));

        // PROCURA O BOTÃO PRÓXIMA PÁGINA DE FORMA BLINDADA
        let btnProximo = null;
        
        // Método 1: Seletor original da Nike
        btnProximo = document.querySelector('a[aria-label="Próxima página"]');
        
        // Método 2: Botão com texto "Próxima" ou ">"
        if (!btnProximo) {
            const botoes = document.querySelectorAll('button, a');
            for (const btn of botoes) {
                const texto = btn.textContent.toLowerCase();
                if (texto.includes('próxima') || texto.includes('>') || texto === '>' || texto === '»') {
                    btnProximo = btn;
                    break;
                }
            }
        }
        
        // Método 3: Paginação numérica
        if (!btnProximo) {
            const pagination = document.querySelector('[data-testid="pagination"], .pagination, nav[aria-label*="pagination"]');
            if (pagination) {
                const currentPage = pagination.querySelector('[aria-current="page"], .active');
                if (currentPage) {
                    const nextSibling = currentPage.nextElementSibling;
                    if (nextSibling && (nextSibling.tagName === 'A' || nextSibling.tagName === 'BUTTON')) {
                        btnProximo = nextSibling;
                    }
                }
            }
        }
        
        // Método 4: URL direta (último recurso)
        if (!btnProximo) {
            const currentUrl = window.location.href;
            if (currentUrl.includes('pagina=') || currentUrl.includes('page=')) {
                const urlObj = new URL(currentUrl);
                const currentPageNum = parseInt(urlObj.searchParams.get('pagina') || urlObj.searchParams.get('page') || '1');
                urlObj.searchParams.set('pagina', (currentPageNum + 1).toString());
                window.location.href = urlObj.toString();
                return;
            }
        }

        if (btnProximo && processoAtivo) {
            paginaAtual++;
            mostrarNotificacao(`➡️ Indo para página ${paginaAtual}...`, 'info');

            // Destaque visual no botão
            const estiloOriginal = btnProximo.style.cssText;
            btnProximo.style.outline = '3px solid #3b82f6';
            btnProximo.style.outlineOffset = '3px';
            btnProximo.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
            btnProximo.style.transition = 'all 0.3s';

            await new Promise(r => setTimeout(r, 1000));

            // Clique seguro
            try {
                if (btnProximo.href) {
                    window.location.href = btnProximo.href;
                } else {
                    btnProximo.click();
                }
            } catch (e) {
                // Tenta simular clique
                btnProximo.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                }));
            }

            // Aguarda carregamento e continua
            setTimeout(() => {
                if (processoAtivo && document.readyState === 'complete') {
                    setTimeout(processarPagina, 3000);
                }
            }, 4000);

        } else {
            // FIM DAS PÁGINAS
            processoAtivo = false;
            localStorage.setItem(STORAGE_STATUS, 'parado');

            atualizarStatusOverlay({
                total: totalAcumulado.toString(),
                pagina: paginaAtual.toString(),
                status: 'Concluído',
                progresso: '100%'
            });

            atualizarStatusTexto('Coleta concluída');
            mostrarNotificacao(`🎉 COLETA FINALIZADA! Total: ${totalAcumulado} produtos`, 'success');

            // Auto-download após conclusão
            setTimeout(baixarDados, 3000);
        }
    }

    function pararColeta() {
        if (!processoAtivo) {
            mostrarNotificacao('Nenhuma coleta em andamento', 'warning');
            return;
        }

        processoAtivo = false;
        localStorage.setItem(STORAGE_STATUS, 'parado');

        const dadosAtuais = JSON.parse(localStorage.getItem(STORAGE_DATA) || '[]');

        atualizarStatusOverlay({
            total: dadosAtuais.length.toString(),
            pagina: paginaAtual.toString(),
            status: 'Interrompido',
            progresso: '50%'
        });

        atualizarStatusTexto('Coleta interrompida');
        mostrarNotificacao(`⏹️ Coleta interrompida. ${dadosAtuais.length} produtos coletados`, 'warning');
    }

    function baixarDados() {
        const dadosFinais = localStorage.getItem(STORAGE_DATA);

        if (!dadosFinais || dadosFinais === '[]') {
            mostrarNotificacao('Nenhum dado para baixar', 'error');
            return;
        }

        try {
            const dados = JSON.parse(dadosFinais);

            const arquivoFinal = {
                metadata: {
                    site: "Nike Brasil",
                    dataColeta: new Date().toISOString(),
                    totalProdutos: dados.length,
                    paginasColetadas: paginaAtual,
                    versaoScript: "6.0"
                },
                produtos: dados
            };

            const blob = new Blob([JSON.stringify(arquivoFinal, null, 2)], {
                type: "application/json;charset=utf-8"
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            const timestamp = new Date().toLocaleString('pt-BR')
                .replace(/[\/:, ]/g, '-')
                .replace(/--/g, '-')
                .replace(/-$/g, '');

            a.download = `nike-produtos-${timestamp}-${dados.length}-itens.json`;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            mostrarNotificacao(`📥 Download iniciado: ${dados.length} produtos`, 'success');

        } catch (error) {
            console.error('Erro ao baixar dados:', error);
            mostrarNotificacao('Erro ao baixar dados', 'error');
        }
    }

    function atualizarStatusTexto(texto) {
        const elemento = document.getElementById('nike-status-atual');
        if (elemento) {
            elemento.textContent = texto;
        }
    }

    // ======================================================
    // 🔄 OBSERVER PARA NOVOS CARDS
    // ======================================================
    function configurarObserver() {
        // Observer para detectar quando novos cards são carregados
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    setTimeout(verificarEHighlightCardsColetados, 500);
                }
            });
        });

        // Observa mudanças no body
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    }

    // ======================================================
    // 🚀 INICIALIZAÇÃO
    // ======================================================
    function inicializar() {
        // Cria elementos visuais
        criarBackgroundWaves();
        criarPainelControle();
        criarOverlayStatus();

        // Configura observer para novos cards
        configurarObserver();

        // Verifica se há coleta em andamento
        const status = localStorage.getItem(STORAGE_STATUS);
        const dadosExistentes = JSON.parse(localStorage.getItem(STORAGE_DATA) || '[]');

        // Marca cards já coletados na página atual
        setTimeout(verificarEHighlightCardsColetados, 2000);

        if (status === 'rodando' && dadosExistentes.length > 0) {
            processoAtivo = true;
            atualizarStatusTexto('Retomando coleta...');
            mostrarNotificacao('🔄 Retomando coleta anterior...', 'info');

            // Calcula página atual baseado na quantidade de dados
            paginaAtual = Math.max(1, Math.floor(dadosExistentes.length / 40));

            atualizarStatusOverlay({
                total: dadosExistentes.length.toString(),
                pagina: paginaAtual.toString(),
                status: 'Retomando...',
                progresso: '50%'
            });

            setTimeout(() => {
                if (processoAtivo) {
                    processarPagina();
                }
            }, 2000);
        } else {
            atualizarStatusTexto('Pronto para iniciar');

            if (dadosExistentes.length > 0) {
                atualizarStatusOverlay({
                    total: dadosExistentes.length.toString(),
                    pagina: '1',
                    status: 'Dados disponíveis',
                    progresso: '100%'
                });

                mostrarNotificacao(`📊 ${dadosExistentes.length} produtos coletados anteriormente`, 'info');
            }
        }
    }

    // Inicializa quando a página carrega
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        setTimeout(inicializar, 1000);
    }

})();