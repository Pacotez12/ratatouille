/**
 * app.js — Ratatouille Bistró
 * Lógica de interactividad, validación y consumo de API
 */

const API_URL = 'http://localhost:8000/api';

document.addEventListener('DOMContentLoaded', () => {
    // 1. NAVEGACIÓN Y UI
    initNavigation();
    initCookieBanner();
    initScrollReveal();

    // 2. CARGA DINÁMICA DE MENÚ
    fetchProducts();

    // 3. VALIDACIÓN DE FORMULARIOS
    initFormValidation();

    // 4. ANALÍTICA SIMULADA (Lineamiento 5)
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
    } catch (error) {
        console.error('API Error:', error);
        // Fallback: Si la API falla, el HTML ya tiene contenido estático.
    }
}

function renderMenu(products) {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = ''; // Limpiar estático

    products.forEach(product => {
        const card = document.createElement('article');
        card.className = 'card';
        card.dataset.category = product.category;
        
        card.innerHTML = `
            <div class="card__img-wrap">
                <img src="${product.image_path}" alt="${product.name}" class="card__img" loading="lazy" />
            </div>
            <div class="card__body">
                <span class="card__category">${product.category}</span>
                <h3 class="card__title">${product.name}</h3>
                <p class="card__desc">${product.description}</p>
                <div class="card__footer">
                    <span class="card__price">Gs. ${product.price.toLocaleString()}</span>
                    <button class="card__add" data-id="${product.id}">+ Agregar</button>
                </div>
            </div>
        `;
        menuGrid.appendChild(card);
    });

    initMenuFilters();
}

function initMenuFilters() {
    const filters = document.querySelectorAll('.menu__filter');
    const cards = document.querySelectorAll('.card');

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI Update
            filters.forEach(b => b.classList.remove('menu__filter--active'));
            btn.classList.add('menu__filter--active');

            const filterValue = btn.getAttribute('data-filter');

            cards.forEach(card => {
                if (filterValue === 'todos' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
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
    try {
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
