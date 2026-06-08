/**
 * app.js — Ratatouille Bistró
 * Lógica de interactividad, validación y consumo de API
 */

const API_URL = 'http://localhost:8000/api';

document.addEventListener('DOMContentLoaded', () => {
    // 1. NAVEGACIÓN Y UI
    initNavigation();
    initCookieBanner();
    initLegalModals();
    initScrollReveal();
    initDateValidation();

    // 2. CARGA DINÁMICA DE MENÚ
    fetchProducts();

    // 3. VALIDACIÓN DE FORMULARIOS
    initFormValidation();

    // 4. ANALÍTICA (Lineamiento 5)
    trackVisit();
});

async function trackVisit() {
    try {
        await fetch(`${API_URL}/track`, { method: 'POST' });
    } catch (e) { /* silent fail for analytics */ }
}

/* ─────────────────────────────────────────────
   1. NAVEGACIÓN Y UI
───────────────────────────────────────────── */

function initNavigation() {
    const header = document.querySelector('.nav');
    const hamburger = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('nav-mobile');
    const backTop = document.getElementById('back-top');

    // Scroll efectos (Nav background y Botón Volver Arriba)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('nav--scrolled');
            backTop.classList.add('back-top--visible');
        } else {
            header.classList.remove('nav--scrolled');
            backTop.classList.remove('back-top--visible');
        }
    });

    // Menú Hamburguesa
    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('nav__hamburger--open');
        mobileMenu.classList.toggle('nav-mobile--open');
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Cerrar menú mobile al hacer click en un link
    document.querySelectorAll('.nav-mobile__link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('nav__hamburger--open');
            mobileMenu.classList.remove('nav-mobile--open');
        });
    });

    // Botón volver arriba
    backTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    const btnAccept = document.getElementById('btn-cookie-accept');
    const btnReject = document.getElementById('btn-cookie-reject');

    // Web Storage: Verificar si ya aceptó (Lineamiento 2)
    if (localStorage.getItem('cookies-accepted') === 'true') {
        banner.style.display = 'none';
    }

    btnAccept.addEventListener('click', () => {
        localStorage.setItem('cookies-accepted', 'true');
        banner.classList.add('cookie--hidden');
        showToast('¡Gracias por aceptar las cookies!');
    });

    btnReject.addEventListener('click', () => {
        banner.classList.add('cookie--hidden');
    });
}

function initScrollReveal() {
    // Implementar animaciones al scroll (Lineamiento 5 Performance)
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal--visible');
            }
        });
    }, observerOptions);

    // Aplicar clase reveal a secciones principales
    const reveals = ['about', 'menu', 'chef', 'gallery', 'reservas', 'contact'];
    reveals.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('reveal');
            observer.observe(el);
        }
    });
}

function initDateValidation() {
    // Establece fecha mínima = hoy ("No me hagas errar" — Lineamiento 1A)
    const hoy = new Date().toISOString().split('T')[0];
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) fechaInput.min = hoy;
}

/* ─────────────────────────────────────────────
   2. CARGA DINÁMICA DE MENÚ (Lineamiento 4)
───────────────────────────────────────────── */

async function fetchProducts() {
    const menuGrid = document.getElementById('menu-grid');
    if (!menuGrid) return;

    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Error al cargar productos');
        const products = await response.json();
        renderMenu(products);
        
        // Aplicar filtro guardado en SessionStorage (Punto 2 Web Storage)
        const savedFilter = sessionStorage.getItem('active-menu-filter');
        if (savedFilter) {
            applyFilter(savedFilter);
        }

        // Actualizar la estadística de Platos en Carta dinámicamente
        const statsResponse = await fetch(`${API_URL}/stats`);
        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            const statsPlatosEl = document.getElementById('stats-platos');
            if (statsPlatosEl) {
                statsPlatosEl.textContent = stats.total_platos;
            }
        }
    } catch (error) {
        console.error('API Error:', error);
    }
}

function renderMenu(products) {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = ''; 

    products.forEach(product => {
        const card = document.createElement('article');
        card.className = 'card';
        card.dataset.category = product.category;
        
        card.innerHTML = `
            <div class="card__img-wrap">
                <img src="${product.image_path.startsWith('/') ? 'http://localhost:8000' + product.image_path : product.image_path}" alt="${product.name}" class="card__img" loading="lazy" />
            </div>
            <div class="card__body">
                <span class="card__category">${product.category}</span>
                <h3 class="card__title">${product.name}</h3>
                <p class="card__desc">${product.description}</p>
                <div class="card__footer">
                    <span class="card__price">Gs. ${product.price.toLocaleString()}</span>
                </div>
            </div>
        `;
        menuGrid.appendChild(card);
    });

    initMenuFilters();
}

function initMenuFilters() {
    const filters = document.querySelectorAll('.menu__filter');
    
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');
            
            // Persistir en SessionStorage (Lineamiento 2)
            sessionStorage.setItem('active-menu-filter', filterValue);
            
            applyFilter(filterValue);
        });
    });
}

function applyFilter(filterValue) {
    const filters = document.querySelectorAll('.menu__filter');
    const cards = document.querySelectorAll('.card');

    // UI Update botones
    filters.forEach(b => {
        b.classList.remove('menu__filter--active');
        if (b.getAttribute('data-filter') === filterValue) {
            b.classList.add('menu__filter--active');
        }
    });

    cards.forEach(card => {
        if (filterValue === 'todos' || card.getAttribute('data-category') === filterValue) {
            card.style.display = 'block';
            setTimeout(() => card.style.opacity = '1', 10);
        } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 300);
        }
    });
}

/* ─────────────────────────────────────────────
   3. VALIDACIÓN DE FORMULARIOS (Lineamiento 2)
───────────────────────────────────────────── */

function initFormValidation() {
    const contactForm = document.getElementById('form-contacto');
    const reservaForm = document.getElementById('form-reserva');
    
    // Formulario de Contacto
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (validateForm(contactForm)) {
                const formData = new FormData(contactForm);
                const rawData = Object.fromEntries(formData.entries());
                
                // Mapeo para el backend
                const data = {
                    name: rawData.nombre,
                    email: rawData.email,
                    message: rawData.mensaje
                };
                
                await sendFormData(`${API_URL}/contact`, data, contactForm);
            }
        });
    }

    // Formulario de Reserva
    if (reservaForm) {
        reservaForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (validateForm(reservaForm)) {
                const formData = new FormData(reservaForm);
                const rawData = Object.fromEntries(formData.entries());
                
                // Mapeo para el backend
                const data = {
                    name: rawData.nombre,
                    email: rawData.email,
                    phone: rawData.telefono,
                    people: parseInt(rawData.personas),
                    date: rawData.fecha,
                    time: rawData.horario,
                    notes: rawData.notas
                };
                
                await sendFormData(`${API_URL}/reservations`, data, reservaForm);
            }
        });
    }
}

async function sendFormData(url, data, form) {
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    
    try {
        // Estado de carga (Heurística 1A: Visibilidad)
        btn.disabled = true;
        btn.textContent = 'Enviando...';
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showStatus(form, '¡Enviado con éxito!', 'success');
            form.reset();
            showToast('¡Recibimos tu solicitud!');
        } else {
            throw new Error();
        }
    } catch (error) {
        showStatus(form, 'Error al enviar. Intente más tarde.', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('[required]');

    inputs.forEach(input => {
        const errorSpan = document.getElementById(`${input.id}-error`);
        if (!input.value.trim()) {
            input.classList.add('form__input--error');
            if (errorSpan) errorSpan.textContent = 'Este campo es obligatorio';
            isValid = false;
        } else if (input.type === 'email' && !validateEmail(input.value)) {
            input.classList.add('form__input--error');
            if (errorSpan) errorSpan.textContent = 'Formato de email inválido';
            isValid = false;
        } else {
            input.classList.remove('form__input--error');
            if (errorSpan) errorSpan.textContent = '';
        }
    });

    return isValid;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showStatus(form, message, type) {
    const statusDiv = form.querySelector('.form__status');
    statusDiv.textContent = message;
    statusDiv.className = `form__status form__status--${type}`;
    
    setTimeout(() => {
        statusDiv.className = 'form__status';
    }, 5000);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('toast--visible');
    setTimeout(() => toast.classList.remove('toast--visible'), 3000);
}

/* ─────────────────────────────────────────────
   5. ASPECTOS LEGALES (Lineamiento 5)
───────────────────────────────────────────── */
function initLegalModals() {
    const btnLegalLinks = document.querySelectorAll('.btn-legal');
    const modalLegal = document.getElementById('modal-legal');
    const btnCloseLegal = document.getElementById('close-modal-legal');
    const legalTitle = document.getElementById('legal-title');
    const legalContent = document.getElementById('legal-content');
    const btnReopenCookies = document.getElementById('btn-reopen-cookies');

    const textosLegales = {
        terminos: {
            title: "Términos y Condiciones",
            content: `
                <p><strong>1. Aceptación de los Términos</strong><br>
                Al acceder y utilizar el sitio web de Ratatouille Bistró, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro sitio web.</p>
                <br>
                <p><strong>2. Reservas y Cancelaciones</strong><br>
                Las reservas están sujetas a disponibilidad. Ratatouille Bistró se reserva el derecho de cancelar o modificar reservas en circunstancias excepcionales. Solicitamos amablemente que cualquier cancelación se realice con al menos 24 horas de anticipación.</p>
                <br>
                <p><strong>3. Propiedad Intelectual</strong><br>
                Todo el contenido, incluyendo textos, gráficos, logotipos e imágenes en este sitio web es propiedad de Ratatouille Bistró y está protegido por las leyes de propiedad intelectual internacionales y de Paraguay.</p>
            `
        },
        privacidad: {
            title: "Política de Privacidad",
            content: `
                <p><strong>1. Recopilación de Información</strong><br>
                Recopilamos información personal (como nombre, correo electrónico y número de teléfono) que usted proporciona voluntariamente al realizar una reserva o utilizar nuestro formulario de contacto.</p>
                <br>
                <p><strong>2. Uso de la Información</strong><br>
                La información recopilada se utiliza exclusivamente para gestionar sus reservas, responder a sus consultas y mejorar nuestros servicios. No vendemos ni compartimos su información personal con terceros.</p>
                <br>
                <p><strong>3. Protección de Datos</strong><br>
                Implementamos medidas de seguridad para proteger su información personal contra el acceso no autorizado, la alteración, divulgación o destrucción.</p>
            `
        }
    };

    btnLegalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tipo = link.getAttribute('data-legal');
            if (textosLegales[tipo]) {
                legalTitle.textContent = textosLegales[tipo].title;
                legalContent.innerHTML = textosLegales[tipo].content;
                modalLegal.style.display = 'flex';
            }
        });
    });

    if (btnCloseLegal) {
        btnCloseLegal.addEventListener('click', () => {
            modalLegal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modalLegal) {
            modalLegal.style.display = 'none';
        }
    });

    if (btnReopenCookies) {
        btnReopenCookies.addEventListener('click', (e) => {
            e.preventDefault();
            const banner = document.getElementById('cookie-banner');
            if (banner) {
                banner.style.display = 'flex';
                banner.classList.remove('cookie--hidden');
            }
        });
    }
}
