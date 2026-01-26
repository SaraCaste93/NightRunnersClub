// global.js - Funcionalidad compartida para todas las páginas
// Versión mejorada con debugging

console.log('🔧 global.js cargado');

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando menú móvil...');
    initMobileMenu();
    initSharedFunctionality();
});

// También ejecutar si el DOM ya está cargado
if (document.readyState === 'loading') {
    console.log('⏳ Documento aún se está cargando...');
} else {
    console.log('⚡ Documento ya cargado, ejecutando inmediatamente...');
    initMobileMenu();
    initSharedFunctionality();
}

function initMobileMenu() {
    console.log('📱 Inicializando menú móvil...');
    
    // Obtener elementos del DOM
    const hamburger = document.querySelector('.hamburger');
    const mobileMenuContainer = document.querySelector('.mobile-menu-container');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    
    // Validar que los elementos existan
    if (!hamburger) {
        console.warn('⚠️ Botón hamburguesa no encontrado');
        return;
    }
    
    if (!mobileMenuContainer) {
        console.warn('⚠️ Contenedor del menú móvil no encontrado');
        return;
    }
    
    console.log('✓ Elementos encontrados:', {
        hamburger: !!hamburger,
        container: !!mobileMenuContainer,
        overlay: !!mobileMenuOverlay,
        close: !!mobileMenuClose,
        links: mobileNavLinks.length
    });
    
    // Función para abrir/cerrar menú
    function toggleMenu() {
        console.log('🔄 Alternando menú...');
        hamburger.classList.toggle('active');
        mobileMenuContainer.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        
        // Prevenir scroll cuando el menú está abierto
        if (mobileMenuContainer.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            console.log('🔒 Scroll deshabilitado');
        } else {
            document.body.style.overflow = '';
            console.log('🔓 Scroll habilitado');
        }
    }
    
    // Función para cerrar menú
    function closeMenu() {
        console.log('❌ Cerrando menú...');
        hamburger.classList.remove('active');
        mobileMenuContainer.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event Listeners
    
    // 1. Click en hamburguesa
    hamburger.addEventListener('click', function(e) {
        console.log('👆 Click en hamburguesa');
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
    
    // 2. Click en overlay
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function(e) {
            console.log('👆 Click en overlay');
            closeMenu();
        });
    }
    
    // 3. Click en botón cerrar
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function(e) {
            console.log('👆 Click en botón cerrar');
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
        });
    }
    
    // 4. Click en enlace del menú
    mobileNavLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            console.log(`👆 Click en enlace ${index}: ${this.textContent.trim()}`);
            
            // No cerrar si es un enlace externo
            const href = this.getAttribute('href');
            const isExternal = this.hasAttribute('target') && this.getAttribute('target') === '_blank';
            
            if (!isExternal) {
                closeMenu();
            }
        });
    });
    
    // 5. Tecla ESC para cerrar menú
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && mobileMenuContainer.classList.contains('active')) {
            console.log('⌨️ Tecla ESC presionada');
            closeMenu();
        }
    });
    
    // 6. Redimensionar ventana
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            console.log('Ventana redimensionada a desktop');
            closeMenu();
        }
    });
    
    console.log('Menú móvil inicializado correctamente');
}

function initSharedFunctionality() {
    console.log('Inicializando funcionalidad compartida...');
    
    // Agregar clase activa al enlace actual
    const currentLocation = location.pathname;
    const navLinks = document.querySelectorAll('.nav a, .mobile-nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Comparar rutas
        if (href && currentLocation.includes(href.replace('.html', '')) || 
            (href === 'index.html' && currentLocation === '/')) {
            link.classList.add('active');
        }
    });
    
    // Suavizar desplazamiento
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    console.log('✅ Funcionalidad compartida inicializada');
}