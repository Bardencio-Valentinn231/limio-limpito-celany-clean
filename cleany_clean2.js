
   // Array de Productos y Servicios
let catalogData = [
    {
        id: 1,
        name: "Detergente Bio-Acuático 5L",
        category: "productos",
        price: 12500,
        rating: "4.9",
        icon: "fa-bottle-droplet",
        badge: "Más Vendido",
        description: "Fórmula concentrada biodegradable de alta espuma y aroma marino."
    },
    {
        id: 2,
        name: "Limpiavidrios Cristal Brillo 1L",
        category: "productos",
        price: 4800,
        rating: "4.8",
        icon: "fa-spray-can",
        badge: "Efecto Espejo",
        description: "Elimina manchas de agua y grasa instantáneamente sin dejar marcas."
    },
    {
        id: 3,
        name: "Kit Limpieza Profunda Hogar",
        category: "productos",
        price: 24900,
        rating: "5.0",
        icon: "fa-box-open",
        badge: "Combo Ahorro",
        description: "Incluye desinfectante, microfibras premium, lustrador y guantes."
    },
    {
        id: 4,
        name: "Servicio Limpieza Residencia (4h)",
        category: "servicios",
        price: 35000,
        rating: "4.9",
        icon: "fa-house-chimney-window",
        badge: "Servicio VIP",
        description: "Atención especializada con insumos y maquinarias Cleany Clean."
    },
    {
        id: 5,
        name: "Desinfección de Tapizados y Sofás",
        category: "servicios",
        price: 28000,
        rating: "4.7",
        icon: "fa-couch",
        badge: "Anti-Ácaros",
        description: "Extracción e inyección a vapor para sillones, colchones y alfombras."
    },
    {
        id: 6,
        name: "Desinfectante Amonio Cuaternario 5L",
        category: "productos",
        price: 15200,
        rating: "4.9",
        icon: "fa-shield-virus",
        badge: "Grado Médico",
        description: "Elimina el 99.9% de bacterias y virus en todo tipo de pisos y superficies."
    }
];

let cart = [];

// Generar Burbujas Animadas de Fondo
function createBubbles() {
    const container = document.getElementById('bubbleContainer');
    if (!container) return;
    const bubbleCount = 18;

    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        const size = Math.random() * 40 + 15; // 15px a 55px
        const left = Math.random() * 100; // 0% a 100%
        const duration = Math.random() * 12 + 8; // 8s a 20s
        const delay = Math.random() * 8;

        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${left}%`;
        bubble.style.animationDuration = `${duration}s`;
        bubble.style.animationDelay = `${delay}s`;

        container.appendChild(bubble);
    }
}

// Rellenar los dos paneles del telón inicial con burbujas.
function createBubbleCurtainBubbles() {
    const curtain = document.getElementById('bubbleCurtain');
    if (!curtain) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        curtain.remove();
        return;
    }

    ['curtainLeft', 'curtainRight'].forEach(panelId => {
        const panel = document.getElementById(panelId);
        if (!panel || panel.childElementCount) return;
        for (let i = 0; i < 24; i += 1) {
            const bubble = document.createElement('span');
            bubble.className = 'curtain-bubble';
            bubble.style.setProperty('--bubble-size', (Math.random() * 46 + 14).toFixed(0) + 'px');
            bubble.style.setProperty('--bubble-left', (Math.random() * 94).toFixed(1) + '%');
            bubble.style.setProperty('--bubble-top', (Math.random() * 96).toFixed(1) + '%');
            bubble.style.setProperty('--bubble-delay', (Math.random() * 0.7).toFixed(2) + 's');
            panel.appendChild(bubble);
        }
    });
}

// Emitir burbujas desde ambos bordes al subir o bajar por la portada.
function initializeEdgeBubbles() {
    const layer = document.getElementById('edgeBubbleLayer');
    if (!layer || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;

    let previousScrollY = window.scrollY;
    let lastBurstAt = 0;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - previousScrollY;
        previousScrollY = currentScrollY;
        if (Math.abs(delta) < 2) return;

        const now = Date.now();
        if (now - lastBurstAt < 105) return;
        lastBurstAt = now;
        const direction = delta > 0 ? 'down' : 'up';

        for (let i = 0; i < 4; i += 1) {
            const side = i % 2 === 0 ? 'left' : 'right';
            const bubble = document.createElement('span');
            const size = Math.round(Math.random() * 28 + 12);
            bubble.className = 'edge-bubble edge-bubble--' + side + ' edge-bubble--' + direction;
            bubble.style.width = size + 'px';
            bubble.style.height = size + 'px';
            bubble.style.top = Math.round(Math.random() * Math.max(100, window.innerHeight - 90)) + 'px';
            bubble.style.setProperty('--edge-offset', Math.round(Math.random() * 18) + 'px');
            bubble.style.setProperty('--bubble-duration', (Math.random() * 0.65 + 0.85).toFixed(2) + 's');
            layer.appendChild(bubble);
            bubble.addEventListener('animationend', () => bubble.remove(), { once: true });
            window.setTimeout(() => bubble.remove(), 2200);
        }
    }, { passive: true });
}

// Renderizar Productos
function renderProducts(items) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    items.forEach(prod => {
        const card = document.createElement('div');
        card.className = "glass-card rounded-2xl p-5 flex flex-col justify-between glass-card-hover border border-slate-800 relative";
        const iconClass = /^fa-[a-z0-9-]+$/i.test(String(prod.icon || '')) ? prod.icon : 'fa-box-open';
        const imageData = isSafeImageDataURI(prod.imageData) ? prod.imageData : '';
        const imageMarkup = imageData
            ? '<img src="' + escapeHtml(imageData) + '" alt="' + escapeHtml(prod.name) + '" loading="lazy" class="h-full w-full object-contain p-2">'
            : '<i class="fa-solid ' + iconClass + ' transform group-hover:scale-110 transition-transform"></i>';
        const stockKnown = prod.stock !== null && prod.stock !== undefined && Number.isFinite(Number(prod.stock));
        const stock = stockKnown ? Math.max(0, Math.floor(Number(prod.stock))) : null;
        const soldOut = stock === 0;
        const stockText = stockKnown ? '<p class="mb-3 text-xs ' + (soldOut ? 'text-rose-300' : 'text-slate-400') + '">' + (soldOut ? 'Sin stock disponible' : 'Disponibles: ' + stock) + '</p>' : '';
        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-3">
                    <span class="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold">${escapeHtml(prod.badge || 'Producto')}</span>
                    <span class="text-amber-400 text-xs font-bold flex items-center gap-1"><i class="fa-solid fa-star"></i> ${escapeHtml(prod.rating || '')}</span>
                </div>
                <div class="w-full h-40 rounded-xl bg-slate-950/60 flex items-center justify-center my-3 text-cyan-400 text-4xl group overflow-hidden">
                    ${imageMarkup}
                </div>
                <h3 class="text-lg font-bold text-white mb-1">${escapeHtml(prod.name)}</h3>
                <p class="text-slate-400 text-xs mb-4">${escapeHtml(prod.description || '')}</p>
            </div>
            <div>
                <div class="flex justify-between items-center mb-4">
                    <span class="text-xs text-slate-400">Precio</span>
                    <span class="text-xl font-extrabold text-cyan-300">${moneyARS(prod.price)}</span>
                </div>
                ${stockText}
                <button type="button" onclick="addToCart(${Number(prod.id)})" ${soldOut ? 'disabled' : ''} class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-40">
                    <i class="fa-solid fa-cart-plus"></i> ${soldOut ? 'Sin stock' : 'Agregar al Carrito'}
                </button>
            </div>`;
        grid.appendChild(card);
    });
}

function moneyARS(value) {
    return '$' + (Number(value) || 0).toLocaleString('es-AR', { maximumFractionDigits: 2 });
}

function isSafeImageDataURI(value) {
    return typeof value === 'string' &&
        value.length <= 420000 &&
        /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/i.test(value);
}

function applySiteSettings(settings) {
    if (!settings || typeof settings !== 'object') return;
    if (Array.isArray(settings.products)) {
        const defaults = new Map(catalogData.map(function (product) { return [Number(product.id), product]; }));
        catalogData = settings.products.map(function (saved, index) {
            const id = Number(saved.id);
            const original = defaults.get(id) || {};
            const category = saved.category === 'servicios' ? 'servicios' : 'productos';
            const price = Number(saved.price);
            const stock = saved.stock === null || saved.stock === undefined || saved.stock === ''
                ? null : Math.max(0, Math.floor(Number(saved.stock) || 0));
            return {
                id: Number.isFinite(id) && id > 0 ? id : index + 1,
                name: String(saved.name || original.name || 'Nuevo producto').slice(0, 120),
                category: category,
                price: Number.isFinite(price) && price >= 0 ? price : Number(original.price) || 0,
                stock: stock,
                rating: String(saved.rating || original.rating || 'Nuevo').slice(0, 12),
                icon: /^fa-[a-z0-9-]+$/i.test(String(saved.icon || original.icon || '')) ? String(saved.icon || original.icon) : 'fa-box-open',
                badge: String(saved.badge || original.badge || 'Nuevo').slice(0, 40),
                description: String(saved.description || original.description || '').slice(0, 400),
                imageData: isSafeImageDataURI(saved.imageData) ? saved.imageData : ''
            };
        });
    }

    const colors = settings.colors || {};
    const validColor = value => /^#[0-9a-f]{6}$/i.test(String(value || ''));
    const start = validColor(colors.backgroundStart) ? colors.backgroundStart : '#0b132b';
    const middle = validColor(colors.backgroundMiddle) ? colors.backgroundMiddle : '#1c2541';
    const end = validColor(colors.backgroundEnd) ? colors.backgroundEnd : '#0a192f';
    if (document.body) {
        document.body.style.background = 'linear-gradient(135deg, ' + start + ' 0%, ' + middle + ' 50%, ' + end + ' 100%)';
    }

    const logoImage = isSafeImageDataURI(settings.logoImage) ? settings.logoImage : '';
    document.querySelectorAll('[data-site-logo-img]').forEach(function (image) {
        if (logoImage) {
            image.src = logoImage;
            image.classList.remove('hidden');
        } else {
            image.removeAttribute('src');
            image.classList.add('hidden');
        }
    });
    document.querySelectorAll('[data-default-logo]').forEach(function (element) {
        element.classList.toggle('hidden', Boolean(logoImage));
    });
    document.querySelectorAll('[data-default-logo-sparkle]').forEach(function (element) {
        element.classList.toggle('hidden', Boolean(logoImage));
    });

    const siteName = String(settings.siteName || 'Cleany Clean').trim().slice(0, 80) || 'Cleany Clean';
    document.querySelectorAll('[data-site-name]').forEach(function (element) {
        element.textContent = siteName;
    });
    document.title = siteName + ' - Servicios y Productos de Limpieza Impecable';
    renderProducts(catalogData);
}

// Filtrar Categorías (Recibe el elemento botón para evitar errores de evento)
function filterCategory(cat, buttonElement) {
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/30');
        btn.classList.add('text-slate-300', 'border-slate-700');
    });
    
    if (buttonElement) {
        buttonElement.classList.add('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/30');
    }

    if (cat === 'todos') {
        renderProducts(catalogData);
    } else {
        const filtered = catalogData.filter(item => item.category === cat);
        renderProducts(filtered);
    }
}

// Agregar al carrito
function addToCart(productId) {
    const product = catalogData.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    const stockKnown = product.stock !== null && product.stock !== undefined && Number.isFinite(Number(product.stock));
    const quantityInCart = existingItem ? existingItem.quantity : 0;
    if (stockKnown && quantityInCart >= Number(product.stock)) {
        alert('No hay más unidades disponibles de ' + product.name + '.');
        return;
    }

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
}

// Cambiar cantidad
function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        const product = catalogData.find(p => p.id === productId);
        const stockKnown = product && product.stock !== null && product.stock !== undefined && Number.isFinite(Number(product.stock));
        if (delta > 0 && stockKnown && item.quantity >= Number(product.stock)) {
            alert('No hay más unidades disponibles de ' + item.name + '.');
            return;
        }
        item.quantity += delta;
        if (item.quantity <= 0) cart = cart.filter(i => i.id !== productId);
    }
    updateCartUI();
}

// Actualizar UI del Carrito
function updateCartUI() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    const cartCountEl = document.getElementById('cartCount');
    const summaryCountEl = document.getElementById('summaryCount');
    if (cartCountEl) cartCountEl.innerText = totalItems;
    if (summaryCountEl) summaryCountEl.innerText = `${totalItems} ítems`;

    const listContainer = document.getElementById('checkoutCartItems');
    if (!listContainer) return;
    
    if (cart.length === 0) {
        listContainer.innerHTML = `<p class="text-slate-400 text-sm text-center py-8">Tu carrito está vacío. Agrega productos o servicios para continuar.</p>`;
    } else {
        listContainer.innerHTML = '';
        cart.forEach(item => {
            const row = document.createElement('div');
            row.className = "flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700/50";
            row.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-lg">
                        <i class="fa-solid ${item.icon}"></i>
                    </div>
                    <div>
                        <h4 class="text-sm font-semibold text-white">${item.name}</h4>
                        <span class="text-xs text-cyan-300">$${item.price.toLocaleString()} c/u</span>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <button type="button" onclick="updateQuantity(${item.id}, -1)" class="w-6 h-6 rounded bg-slate-700 text-white flex items-center justify-center text-xs font-bold hover:bg-slate-600">-</button>
                    <span class="text-sm font-bold text-white px-1">${item.quantity}</span>
                    <button type="button" onclick="updateQuantity(${item.id}, 1)" class="w-6 h-6 rounded bg-slate-700 text-white flex items-center justify-center text-xs font-bold hover:bg-slate-600">+</button>
                </div>
            `;
            listContainer.appendChild(row);
        });
    }

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const subtotalEl = document.getElementById('subtotalPrice');
    const totalEl = document.getElementById('totalPrice');
    
    if (subtotalEl) subtotalEl.innerText = `$${total.toLocaleString()}`;
    if (totalEl) totalEl.innerText = `$${total.toLocaleString()}`;
}

// Manejar el submit del Formulario
function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
}

// Manejar el submit del Formulario y guardar el pedido en este navegador.
async function handleFormSubmit(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Por favor agrega al menos un producto o servicio al carrito antes de finalizar la compra.");
        return;
    }

    const getValue = id => document.getElementById(id)?.value?.trim() || '';
    const formaPagoEl = document.querySelector('input[name="formaPago"]:checked');
    const total = cart.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
    const order = {
        id: `CC-${Date.now().toString(36).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        customer: {
            nombre: getValue('nombre'),
            email: getValue('email'),
            telefono: getValue('telefono'),
            dni: getValue('dni'),
            cuit: getValue('cuit'),
            iva: getValue('iva'),
            direccion: getValue('direccion'),
            piso: getValue('piso'),
            ciudad: getValue('ciudad'),
            provincia: getValue('provincia'),
            cp: getValue('cp')
        },
        formaPago: formaPagoEl ? formaPagoEl.value : "No especificado",
        items: cart.map(item => ({
            id: item.id, name: item.name, category: item.category,
            price: Number(item.price), quantity: Number(item.quantity)
        })),
        subtotal: total,
        total: total,
        currency: 'ARS',
        status: 'Recibido'
    };

    try {
        const storageKey = 'cleanyCleanOrders';
        const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const orders = Array.isArray(saved) ? saved : [];
        orders.unshift(order);
        localStorage.setItem(storageKey, JSON.stringify(orders));
    } catch (error) {
        console.error('No se pudo guardar el pedido en este navegador:', error);
        alert('No se pudo guardar el pedido en este navegador. Verifica el almacenamiento del navegador e inténtalo nuevamente.');
        return;
    }

    let syncMessage = 'Pedido guardado en este navegador. La sincronización central todavía no está configurada.';
    if (window.CleanyOrders && window.CleanyOrders.isCloudConfigured()) {
        const syncResult = await window.CleanyOrders.syncOrder(order);
        syncMessage = syncResult.synced
            ? 'Compra sincronizada con el gestor central.'
            : 'El pedido quedó en este navegador, pero no pudo sincronizarse con el gestor central. Se volverá a intentar al cargar la tienda.';
        if (!syncResult.synced) {
            console.error('Falló la sincronización del pedido:', syncResult.error);
        }
    }
    const syncStatus = document.getElementById('orderSyncStatus');
    if (syncStatus) syncStatus.textContent = syncMessage;

    const ticketContainer = document.getElementById('ticketDetails');
    if (ticketContainer) {
        ticketContainer.innerHTML = `
            <p><strong>Número de pedido:</strong> ${escapeHtml(order.id)}</p>
            <p><strong>Cliente:</strong> ${escapeHtml(order.customer.nombre)}</p>
            <p><strong>DNI:</strong> ${escapeHtml(order.customer.dni)} | <strong>CUIL/CUIT:</strong> ${escapeHtml(order.customer.cuit)}</p>
            <p><strong>Email:</strong> ${escapeHtml(order.customer.email)}</p>
            <p><strong>Teléfono:</strong> ${escapeHtml(order.customer.telefono)}</p>
            <p><strong>Dirección:</strong> ${escapeHtml(order.customer.direccion)} ${escapeHtml(order.customer.piso)}, ${escapeHtml(order.customer.ciudad)}, ${escapeHtml(order.customer.provincia)} (${escapeHtml(order.customer.cp)})</p>
            <p><strong>Condición IVA:</strong> ${escapeHtml(order.customer.iva)}</p>
            <p><strong>Método de Pago:</strong> ${escapeHtml(order.formaPago)}</p>
            <div class="border-t border-slate-700 pt-2 mt-2">
                <p><strong>Total del pedido:</strong> <span class="text-cyan-300 font-bold text-sm">$ ${order.total.toLocaleString('es-AR')}</span></p>
            </div>
        `;
    }

    const modal = document.getElementById('confirmationModal');
    if (modal) modal.classList.remove('hidden');

    cart = [];
    updateCartUI();

    const form = document.getElementById('checkoutForm');
    if (form) form.reset();
}

function closeModal() {
    const modal = document.getElementById('confirmationModal');
    if (modal) modal.classList.add('hidden');
}

// Scroll al Checkout al tocar carrito header
function toggleCartModal() {
    const checkoutSection = document.getElementById('checkout');
    if (checkoutSection) {
        checkoutSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Inicialización segura al cargar la ventana
window.addEventListener('DOMContentLoaded', async () => {
    createBubbles();
    createBubbleCurtainBubbles();
    initializeEdgeBubbles();
    renderProducts(catalogData);
    if (window.CleanyOrders) {
        try {
            const settings = await window.CleanyOrders.getSiteSettings();
            if (settings) applySiteSettings(settings);
        } catch (error) {
            console.error('No se pudo cargar la configuración visual de la tienda:', error);
        }
        if (window.CleanyOrders.isCloudConfigured()) {
            window.CleanyOrders.syncPendingOrders().catch(error => {
                console.error('No se pudieron reintentar los pedidos pendientes:', error);
            });
        }
    }
}); + (Number(value) || 0).toLocaleString('es-AR', { maximumFractionDigits: 2 });
}

function isSafeImageDataURI(value) {
    return typeof value === 'string' &&
        value.length <= 420000 &&
        /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/i.test(value);
}

function applySiteSettings(settings) {
    if (!settings || typeof settings !== 'object') return;
    if (Array.isArray(settings.products)) {
        const defaults = new Map(catalogData.map(function (product) { return [Number(product.id), product]; }));
        catalogData = settings.products.map(function (saved, index) {
            const id = Number(saved.id);
            const original = defaults.get(id) || {};
            const category = saved.category === 'servicios' ? 'servicios' : 'productos';
            const price = Number(saved.price);
            const stock = saved.stock === null || saved.stock === undefined || saved.stock === ''
                ? null : Math.max(0, Math.floor(Number(saved.stock) || 0));
            return {
                id: Number.isFinite(id) && id > 0 ? id : index + 1,
                name: String(saved.name || original.name || 'Nuevo producto').slice(0, 120),
                category: category,
                price: Number.isFinite(price) && price >= 0 ? price : Number(original.price) || 0,
                stock: stock,
                rating: String(saved.rating || original.rating || 'Nuevo').slice(0, 12),
                icon: /^fa-[a-z0-9-]+$/i.test(String(saved.icon || original.icon || '')) ? String(saved.icon || original.icon) : 'fa-box-open',
                badge: String(saved.badge || original.badge || 'Nuevo').slice(0, 40),
                description: String(saved.description || original.description || '').slice(0, 400)
            };
        });
    }

    const colors = settings.colors || {};
    const validColor = value => /^#[0-9a-f]{6}$/i.test(String(value || ''));
    const start = validColor(colors.backgroundStart) ? colors.backgroundStart : '#0b132b';
    const middle = validColor(colors.backgroundMiddle) ? colors.backgroundMiddle : '#1c2541';
    const end = validColor(colors.backgroundEnd) ? colors.backgroundEnd : '#0a192f';
    if (document.body) {
        document.body.style.background = 'linear-gradient(135deg, ' + start + ' 0%, ' + middle + ' 50%, ' + end + ' 100%)';
    }

    const siteName = String(settings.siteName || 'Cleany Clean').trim().slice(0, 80) || 'Cleany Clean';
    document.querySelectorAll('[data-site-name]').forEach(function (element) {
        element.textContent = siteName;
    });
    document.title = siteName + ' - Servicios y Productos de Limpieza Impecable';
    renderProducts(catalogData);
}

// Filtrar Categorías (Recibe el elemento botón para evitar errores de evento)
function filterCategory(cat, buttonElement) {
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/30');
        btn.classList.add('text-slate-300', 'border-slate-700');
    });
    
    if (buttonElement) {
        buttonElement.classList.add('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/30');
    }

    if (cat === 'todos') {
        renderProducts(catalogData);
    } else {
        const filtered = catalogData.filter(item => item.category === cat);
        renderProducts(filtered);
    }
}

// Agregar al carrito
function addToCart(productId) {
    const product = catalogData.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    const stockKnown = product.stock !== null && product.stock !== undefined && Number.isFinite(Number(product.stock));
    const quantityInCart = existingItem ? existingItem.quantity : 0;
    if (stockKnown && quantityInCart >= Number(product.stock)) {
        alert('No hay más unidades disponibles de ' + product.name + '.');
        return;
    }

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
}

// Cambiar cantidad
function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        const product = catalogData.find(p => p.id === productId);
        const stockKnown = product && product.stock !== null && product.stock !== undefined && Number.isFinite(Number(product.stock));
        if (delta > 0 && stockKnown && item.quantity >= Number(product.stock)) {
            alert('No hay más unidades disponibles de ' + item.name + '.');
            return;
        }
        item.quantity += delta;
        if (item.quantity <= 0) cart = cart.filter(i => i.id !== productId);
    }
    updateCartUI();
}

// Actualizar UI del Carrito
function updateCartUI() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    const cartCountEl = document.getElementById('cartCount');
    const summaryCountEl = document.getElementById('summaryCount');
    if (cartCountEl) cartCountEl.innerText = totalItems;
    if (summaryCountEl) summaryCountEl.innerText = `${totalItems} ítems`;

    const listContainer = document.getElementById('checkoutCartItems');
    if (!listContainer) return;
    
    if (cart.length === 0) {
        listContainer.innerHTML = `<p class="text-slate-400 text-sm text-center py-8">Tu carrito está vacío. Agrega productos o servicios para continuar.</p>`;
    } else {
        listContainer.innerHTML = '';
        cart.forEach(item => {
            const row = document.createElement('div');
            row.className = "flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700/50";
            row.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-lg">
                        <i class="fa-solid ${item.icon}"></i>
                    </div>
                    <div>
                        <h4 class="text-sm font-semibold text-white">${item.name}</h4>
                        <span class="text-xs text-cyan-300">$${item.price.toLocaleString()} c/u</span>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <button type="button" onclick="updateQuantity(${item.id}, -1)" class="w-6 h-6 rounded bg-slate-700 text-white flex items-center justify-center text-xs font-bold hover:bg-slate-600">-</button>
                    <span class="text-sm font-bold text-white px-1">${item.quantity}</span>
                    <button type="button" onclick="updateQuantity(${item.id}, 1)" class="w-6 h-6 rounded bg-slate-700 text-white flex items-center justify-center text-xs font-bold hover:bg-slate-600">+</button>
                </div>
            `;
            listContainer.appendChild(row);
        });
    }

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const subtotalEl = document.getElementById('subtotalPrice');
    const totalEl = document.getElementById('totalPrice');
    
    if (subtotalEl) subtotalEl.innerText = `$${total.toLocaleString()}`;
    if (totalEl) totalEl.innerText = `$${total.toLocaleString()}`;
}

// Manejar el submit del Formulario
function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
}

// Manejar el submit del Formulario y guardar el pedido en este navegador.
async function handleFormSubmit(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Por favor agrega al menos un producto o servicio al carrito antes de finalizar la compra.");
        return;
    }

    const getValue = id => document.getElementById(id)?.value?.trim() || '';
    const formaPagoEl = document.querySelector('input[name="formaPago"]:checked');
    const total = cart.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
    const order = {
        id: `CC-${Date.now().toString(36).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        customer: {
            nombre: getValue('nombre'),
            email: getValue('email'),
            telefono: getValue('telefono'),
            dni: getValue('dni'),
            cuit: getValue('cuit'),
            iva: getValue('iva'),
            direccion: getValue('direccion'),
            piso: getValue('piso'),
            ciudad: getValue('ciudad'),
            provincia: getValue('provincia'),
            cp: getValue('cp')
        },
        formaPago: formaPagoEl ? formaPagoEl.value : "No especificado",
        items: cart.map(item => ({
            id: item.id, name: item.name, category: item.category,
            price: Number(item.price), quantity: Number(item.quantity)
        })),
        subtotal: total,
        total: total,
        currency: 'ARS',
        status: 'Recibido'
    };

    try {
        const storageKey = 'cleanyCleanOrders';
        const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const orders = Array.isArray(saved) ? saved : [];
        orders.unshift(order);
        localStorage.setItem(storageKey, JSON.stringify(orders));
    } catch (error) {
        console.error('No se pudo guardar el pedido en este navegador:', error);
        alert('No se pudo guardar el pedido en este navegador. Verifica el almacenamiento del navegador e inténtalo nuevamente.');
        return;
    }

    let syncMessage = 'Pedido guardado en este navegador. La sincronización central todavía no está configurada.';
    if (window.CleanyOrders && window.CleanyOrders.isCloudConfigured()) {
        const syncResult = await window.CleanyOrders.syncOrder(order);
        syncMessage = syncResult.synced
            ? 'Compra sincronizada con el gestor central.'
            : 'El pedido quedó en este navegador, pero no pudo sincronizarse con el gestor central. Se volverá a intentar al cargar la tienda.';
        if (!syncResult.synced) {
            console.error('Falló la sincronización del pedido:', syncResult.error);
        }
    }
    const syncStatus = document.getElementById('orderSyncStatus');
    if (syncStatus) syncStatus.textContent = syncMessage;

    const ticketContainer = document.getElementById('ticketDetails');
    if (ticketContainer) {
        ticketContainer.innerHTML = `
            <p><strong>Número de pedido:</strong> ${escapeHtml(order.id)}</p>
            <p><strong>Cliente:</strong> ${escapeHtml(order.customer.nombre)}</p>
            <p><strong>DNI:</strong> ${escapeHtml(order.customer.dni)} | <strong>CUIL/CUIT:</strong> ${escapeHtml(order.customer.cuit)}</p>
            <p><strong>Email:</strong> ${escapeHtml(order.customer.email)}</p>
            <p><strong>Teléfono:</strong> ${escapeHtml(order.customer.telefono)}</p>
            <p><strong>Dirección:</strong> ${escapeHtml(order.customer.direccion)} ${escapeHtml(order.customer.piso)}, ${escapeHtml(order.customer.ciudad)}, ${escapeHtml(order.customer.provincia)} (${escapeHtml(order.customer.cp)})</p>
            <p><strong>Condición IVA:</strong> ${escapeHtml(order.customer.iva)}</p>
            <p><strong>Método de Pago:</strong> ${escapeHtml(order.formaPago)}</p>
            <div class="border-t border-slate-700 pt-2 mt-2">
                <p><strong>Total del pedido:</strong> <span class="text-cyan-300 font-bold text-sm">$ ${order.total.toLocaleString('es-AR')}</span></p>
            </div>
        `;
    }

    const modal = document.getElementById('confirmationModal');
    if (modal) modal.classList.remove('hidden');

    cart = [];
    updateCartUI();

    const form = document.getElementById('checkoutForm');
    if (form) form.reset();
}

function closeModal() {
    const modal = document.getElementById('confirmationModal');
    if (modal) modal.classList.add('hidden');
}

// Scroll al Checkout al tocar carrito header
function toggleCartModal() {
    const checkoutSection = document.getElementById('checkout');
    if (checkoutSection) {
        checkoutSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Inicialización segura al cargar la ventana
window.addEventListener('DOMContentLoaded', async () => {
    createBubbles();
    createBubbleCurtainBubbles();
    initializeEdgeBubbles();
    renderProducts(catalogData);
    if (window.CleanyOrders) {
        try {
            const settings = await window.CleanyOrders.getSiteSettings();
            if (settings) applySiteSettings(settings);
        } catch (error) {
            console.error('No se pudo cargar la configuración visual de la tienda:', error);
        }
        if (window.CleanyOrders.isCloudConfigured()) {
            window.CleanyOrders.syncPendingOrders().catch(error => {
                console.error('No se pudieron reintentar los pedidos pendientes:', error);
            });
        }
    }
});