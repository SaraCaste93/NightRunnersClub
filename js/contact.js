// contact.js - Funcionalidad para la página de contacto

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar menú móvil desde global.js si existe
    if (typeof initMobileMenu === 'function') {
        initMobileMenu();
    }
    
    // Variables globales
    let phoneInputInstance = null;
    const contactForm = document.getElementById('contactForm');
    
    // AÑADIDO: Endpoint de Formspree para contacto
    const FORMSPREE_ENDPOINT_CONTACTO = 'https://formspree.io/f/mykkelyv'; // REEMPLAZA con tu endpoint
    
    // Inicializar PhoneInput si el contenedor existe
    const initPhoneInput = () => {
        const phoneContainer = document.getElementById('phone-input-container');
        if (!phoneContainer) return;
        
        // Si ya está inicializado, no hacer nada
        if (phoneInputInstance) return;
        
        // Usar la clase PhoneInput que ya tienes
        if (typeof PhoneInput !== 'undefined') {
            phoneInputInstance = new PhoneInput('phone-input-container', {
                showFlags: true,
                defaultCountry: 'ES',
                placeholder: 'Ej: 612 345 678',
                required: false // Opcional según tu formulario
            });
            
            // Configurar eventos adicionales para la nota de WhatsApp
            const telefonoInput = phoneContainer.querySelector('.phone-number');
            if (telefonoInput) {
                setupWhatsAppNote(telefonoInput);
            }
        } else {
            console.warn('PhoneInput class not found. Using fallback phone input.');
            setupBasicPhoneInput();
        }
    };
    
    // Configurar la nota de WhatsApp que cambia de color
    const setupWhatsAppNote = (inputElement) => {
        const formNote = document.querySelector('.form-note');
        if (!formNote) return;
        
        inputElement.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                formNote.style.color = '#4CAF50';
                formNote.innerHTML = '* ¡Perfecto! Te contactaremos por WhatsApp si es necesario.';
            } else {
                formNote.style.color = '';
                formNote.innerHTML = '* Rellenando solo si prefieres que te contestemos por WhatsApp';
            }
        });
    };
    
    // Validar formulario
    const validateForm = () => {
        // Validación de campos obligatorios
        const nombre = document.getElementById('nombre')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const mensaje = document.getElementById('mensaje')?.value.trim();
        
        // Validar campos básicos
        if (!nombre || !email || !mensaje) {
            showMessage('Por favor, complete todos los campos obligatorios.', 'error');
            return false;
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Por favor, ingrese un email válido.', 'error');
            return false;
        }
        
        // Validar teléfono si se ingresó
        const telefonoInput = document.querySelector('.phone-number');
        if (telefonoInput && telefonoInput.value.trim() !== '') {
            if (phoneInputInstance && typeof phoneInputInstance.isValid === 'function') {
                if (!phoneInputInstance.isValid()) {
                    showMessage('Por favor, ingrese un número de teléfono válido.', 'error');
                    telefonoInput.focus();
                    return false;
                }
            } else {
                // Validación básica para fallback
                const telefonoValue = telefonoInput.value.trim().replace(/\D/g, '');
                if (telefonoValue.length < 9) {
                    showMessage('El número de teléfono debe tener al menos 9 dígitos.', 'error');
                    telefonoInput.focus();
                    return false;
                }
            }
        }
        
        return true;
    };
    
    // Guardar número completo en campo oculto
    const saveFullPhoneNumber = () => {
        if (!phoneInputInstance || typeof phoneInputInstance.getFullNumber !== 'function') return;
        
        const fullNumber = phoneInputInstance.getFullNumber();
        if (!fullNumber) return;
        
        let hiddenInput = document.getElementById('full-phone-number');
        if (!hiddenInput) {
            hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.id = 'full-phone-number';
            hiddenInput.name = 'full-phone-number';
            contactForm.appendChild(hiddenInput);
        }
        hiddenInput.value = fullNumber;
    };
    
    // Resetear formulario
    const resetForm = () => {
        if (!contactForm) return;
        
        contactForm.reset();
        
        // Resetear PhoneInput si existe
        if (phoneInputInstance && typeof phoneInputInstance.reset === 'function') {
            phoneInputInstance.reset();
        }
        
        // Resetear la nota de WhatsApp
        const formNote = document.querySelector('.form-note');
        if (formNote) {
            formNote.style.color = '';
            formNote.innerHTML = '* Rellenando solo si prefieres que te contestemos por WhatsApp';
        }
    };
    
    // AÑADIDO: Función para enviar a Formspree (igual que en membresía)
    async function submitToFormspree(formData) {
        try {
            // Mostrar estado de carga
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Enviando...</span>';
                // Añadir spinner si no existe
                if (!submitBtn.querySelector('.loading-spinner')) {
                    const spinner = document.createElement('div');
                    spinner.className = 'loading-spinner';
                    spinner.style.cssText = 'display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #1f6feb; border-radius: 50%; animation: spin 1s linear infinite; margin-left: 10px;';
                    submitBtn.appendChild(spinner);
                }
            }
            
            // Preparar datos para Formspree
            const phoneNumber = phoneInputInstance && typeof phoneInputInstance.getFullNumber === 'function' 
                ? phoneInputInstance.getFullNumber() 
                : '';
            
            const formspreeData = {
                nombre: formData.nombre,
                email: formData.email,
                telefono: phoneNumber || 'No proporcionado',
                mensaje: formData.mensaje,
                _subject: `Nuevo mensaje de contacto - ${formData.nombre}`,
                _replyto: formData.email
            };
            
            // Enviar a Formspree
            const response = await fetch(FORMSPREE_ENDPOINT_CONTACTO, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formspreeData)
            });
            
            if (response.ok) {
                showMessage('¡Gracias por contactarnos! Te responderemos lo antes posible.', 'success');
                return true;
            } else {
                throw new Error('Error en la respuesta de Formspree');
            }
            
        } catch (error) {
            console.error('Error al enviar:', error);
            showMessage('Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.', 'error');
            return false;
        } finally {
            // Restaurar botón
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Enviar mensaje</span>';
                const spinner = submitBtn.querySelector('.loading-spinner');
                if (spinner) spinner.remove();
            }
        }
    }
    
    // MODIFICADO: Manejo del envío del formulario
    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            // Validar formulario
            if (!validateForm()) return;
            
            // Guardar número de teléfono completo si existe
            if (phoneInputInstance) {
                saveFullPhoneNumber();
            }
            
            // Obtener datos del formulario
            const formData = {
                nombre: document.getElementById('nombre').value.trim(),
                email: document.getElementById('email').value.trim(),
                mensaje: document.getElementById('mensaje').value.trim()
            };
            
            // Enviar a Formspree
            const success = await submitToFormspree(formData);
            
            // Resetear formulario si fue exitoso
            if (success) {
                setTimeout(() => {
                    resetForm();
                }, 1500);
            }
        });
    }
    
    // Interactividad con el marcador del mapa
    const mapMarker = document.querySelector('.map-marker');
    const mapContainer = document.getElementById('map');
    
    if (mapMarker) {
        mapMarker.addEventListener('click', function() {
            showMessage('¡Estamos en Madrid!', 'info');
        });
        
        // Efecto hover en el mapa
        if (mapContainer) {
            mapContainer.addEventListener('mouseenter', function() {
                mapMarker.style.transform = 'translate(-50%, -50%) scale(1.2)';
                mapMarker.style.transition = 'transform 0.3s ease';
            });
            
            mapContainer.addEventListener('mouseleave', function() {
                mapMarker.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        }
    }
    
    // Función para mostrar mensajes (sin cambios)
    function showMessage(message, type = 'info') {
        // Crear elemento de mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            padding: 15px 25px;
            background-color: ${type === 'error' ? '#dc143c' : type === 'success' ? '#4CAF50' : '#333'};
            color: white;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
        `;
        
        // Agregar al body
        document.body.appendChild(messageDiv);
        
        // Remover después de 4 segundos
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 4000);
    }
    
    // Agregar estilos de animación para los mensajes
    const addMessageStyles = () => {
        if (document.querySelector('#message-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'message-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    };
    
    // Asegurar que los estilos CSS del PhoneInput estén presentes
    const ensurePhoneInputStyles = () => {
        // Los estilos deben estar en tu CSS principal
    };
    
    // Inicializar todo
    const init = () => {
        initPhoneInput();
        addMessageStyles();
        ensurePhoneInputStyles();
    };
    
    // Iniciar
    init();
});