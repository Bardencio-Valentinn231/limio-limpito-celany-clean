
   // Array de Productos y Servicios
const catalogData = [
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

// Renderizar Productos
function renderProducts(items) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    items.forEach(prod => {
        const card = document.createElement('div');
        card.className = "glass-card rounded-2xl p-5 flex flex-col justify-between glass-card-hover border border-slate-800 relative";
        card.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-3">
                    <span class="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold">
                        ${prod.badge}
                    </span>
                    <span class="text-amber-400 text-xs font-bold flex items-center gap-1">
                        <i class="fa-solid fa-star"></i> ${prod.rating}
                    </span>
                </div>

                <div class="w-full h-36 rounded-xl bg-slate-950/60 flex items-center justify-center my-3 text-cyan-400 text-4xl group">
                    <i class="fa-solid ${prod.icon} transform group-hover:scale-110 transition-transform"></i>
                </div>

                <h3 class="text-lg font-bold text-white mb-1">${prod.name}</h3>
                <p class="text-slate-400 text-xs mb-4">${prod.description}</p>
            </div>

            <div>
                <div class="flex justify-between items-center mb-4">
                    <span class="text-xs text-slate-400">Precio</span>
                    <span class="text-xl font-extrabold text-cyan-300">$${prod.price.toLocaleString()}</span>
                </div>
                <button type="button" onclick="addToCart(${prod.id})" class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-semibold text-sm transition-all flex items-center justify-center gap-2">
                    <i class="fa-solid fa-cart-plus"></i> Agregar al Carrito
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
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
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
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
function handleFormSubmit(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Por favor agrega al menos un producto o servicio al carrito antes de finalizar la compra.");
        return;
    }

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const dni = document.getElementById('dni').value;
    const cuit = document.getElementById('cuit').value;
    const direccion = document.getElementById('direccion').value;
    const ciudad = document.getElementById('ciudad').value;
    
    const formaPagoEl = document.querySelector('input[name="formaPago"]:checked');
    const formaPago = formaPagoEl ? formaPagoEl.value : "No especificado";
    const total = document.getElementById('totalPrice').innerText;

    const ticketContainer = document.getElementById('ticketDetails');
    if (ticketContainer) {
        ticketContainer.innerHTML = `
            <p><strong>Cliente:</strong> ${nombre}</p>
            <p><strong>DNI:</strong> ${dni} | <strong>CUIL/CUIT:</strong> ${cuit}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Dirección:</strong> ${direccion}, ${ciudad}</p>
            <p><strong>Método de Pago:</strong> ${formaPago}</p>
            <div class="border-t border-slate-700 pt-2 mt-2">
                <p><strong>Total Abonado:</strong> <span class="text-cyan-300 font-bold text-sm">${total}</span></p>
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
window.addEventListener('DOMContentLoaded', () => {
    createBubbles();
    renderProducts(catalogData);
});