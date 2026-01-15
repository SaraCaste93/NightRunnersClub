// global.js - Funcionalidad compartida para todas las páginas

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar menú móvil
    initMobileMenu();
    
    // Inicializar cualquier funcionalidad compartida adicional
    initSharedFunctionality();
});

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenuContainer = document.querySelector('.mobile-menu-container');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    
    if (hamburger && mobileMenuContainer && mobileMenuOverlay) {
        // Abrir menú al hacer clic en hamburguesa
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            mobileMenuContainer.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
            
            // Prevenir scroll del body cuando el menú está abierto
            if (mobileMenuContainer.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Cerrar menú al hacer clic en overlay
        mobileMenuOverlay.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileMenuContainer.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Cerrar menú al hacer clic en botón de cerrar
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileMenuContainer.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Cerrar menú al hacer clic en un enlace
        const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileMenuContainer.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Cerrar menú al presionar ESC
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && mobileMenuContainer.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileMenuContainer.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

function initSharedFunctionality() {
    // Aquí puedes agregar funcionalidad compartida para todas las páginas
    console.log('Night Runners Club - Funcionalidad cargada');
}