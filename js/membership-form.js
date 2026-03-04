// membership-form.js

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar PhoneInput si existe
    let phoneInputInstance = null;
    if (typeof PhoneInput !== 'undefined') {
        phoneInputInstance = new PhoneInput('phone-input-container', {
            showFlags: true,
            defaultCountry: 'ES',
            placeholder: 'Ej: 612 345 678',
            required: false
        });
    }

    // Obtener elementos del DOM
    const form = document.getElementById('membership-form');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const loadingSpinner = document.getElementById('loading-spinner');
    const successMessage = document.getElementById('success-message');
    const errorContainer = document.getElementById('error-container');
    
    // Elementos de error para cada campo
    const errorElements = {
        name: document.getElementById('name-error'),
        phone: document.getElementById('phone-error'),
        email: document.getElementById('email-error'),
        age: document.getElementById('age-error'),
        vehicle: document.getElementById('vehicle-error')
    };
    
    // Tu dirección de correo (cámbiala por la tuya)
    const TU_CORREO = 'nightrunners.club2025@gmail.com';
    
    // Función para mostrar errores
    function showError(field, message) {
        if (errorElements[field]) {
            errorElements[field].textContent = message;
            errorElements[field].style.display = 'block';
        }
    }
    
    // Función para limpiar errores
    function clearErrors() {
        Object.values(errorElements).forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
        errorContainer.style.display = 'none';
        errorContainer.innerHTML = '';
    }
    
    // Función para mostrar error global
    function showGlobalError(message) {
        errorContainer.innerHTML = `
            <div class="global-error" style="background-color: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #f5c6cb;">
                <strong>Error:</strong> ${message}
            </div>
        `;
        errorContainer.style.display = 'block';
    }
    
    // Función para mostrar éxito
    function showSuccess() {
        form.style.display = 'none';
        successMessage.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Función para obtener el número de teléfono completo
    function getFullPhoneNumber() {
        if (phoneInputInstance && typeof phoneInputInstance.getFullNumber === 'function') {
            return phoneInputInstance.getFullNumber();
        }
        
        // Si no hay PhoneInput, usar el valor del input oculto
        const fullPhoneInput = document.getElementById('full-phone-number');
        return fullPhoneInput ? fullPhoneInput.value : '';
    }
    
    // Función para validar el formulario
    function validateForm(formData) {
        let isValid = true;
        clearErrors();
        
        // Validar nombre
        if (!formData.name || formData.name.trim().length < 2) {
            showError('name', 'Por favor, introduce tu nombre completo');
            isValid = false;
        }
        
        // Validar teléfono
        const phoneNumber = getFullPhoneNumber();
        if (!phoneNumber || phoneNumber.trim().length < 9) {
            showError('phone', 'Por favor, introduce un número de teléfono válido');
            isValid = false;
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            showError('email', 'Por favor, introduce un correo electrónico válido');
            isValid = false;
        }
        
        // Validar edad
        if (!formData.age) {
            showError('age', 'Por favor, selecciona si eres mayor de edad');
            isValid = false;
        }
        
        // Validar vehículo
        if (!formData.vehicle) {
            showError('vehicle', 'Por favor, selecciona si tienes vehículo propio');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Función para enviar el formulario
    async function submitForm(formData) {
        try {
            // Mostrar estado de carga
            submitBtn.disabled = true;
            submitText.textContent = 'Enviando...';
            loadingSpinner.style.display = 'block';
            
            // Preparar datos para el correo
            const phoneNumber = getFullPhoneNumber();
            const subject = `Nueva solicitud de membresía - ${formData.name}`;
            
            const emailBody = `
Nueva solicitud de membresía recibida:

📋 **Información del solicitante:**

**Nombre:** ${formData.name}
**Teléfono:** ${phoneNumber}
**Email:** ${formData.email}
**Mayor de edad:** ${formData.age === 'si' ? 'Sí' : 'No'}
**Vehículo propio:** ${formData.vehicle === 'si' ? 'Sí' : 'No'}

**Comentarios:** ${formData.comments || 'No hay comentarios'}

---
*Enviado desde el formulario de membresía - Night Runners Club Madrid*
`.trim();

            
            const formspreeURL = 'https://formspree.io/f/mqeepgrw'; // REEMPLAZA CON TU URL DE FORMSPREE
            
            const response = await fetch(formspreeURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: phoneNumber,
                    email: formData.email,
                    age: formData.age === 'si' ? 'Mayor de edad' : 'Menor de edad',
                    vehicle: formData.vehicle === 'si' ? 'Sí tiene vehículo' : 'No tiene vehículo',
                    comments: formData.comments || 'Sin comentarios',
                    _subject: subject,
                    _replyto: formData.email
                })
            });

            if (response.ok) {
                showSuccess();
            } else {
                throw new Error('Error al enviar el formulario');
            }
            
        } catch (error) {
            console.error('Error:', error);
            showGlobalError('Hubo un problema al enviar tu solicitud. Por favor, inténtalo de nuevo más tarde.');
            
            // Restaurar botón
            submitBtn.disabled = false;
            submitText.textContent = 'Enviar';
            loadingSpinner.style.display = 'none';
        }
    }
    
    // Evento de envío del formulario
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            age: document.querySelector('input[name="age"]:checked')?.value,
            vehicle: document.querySelector('input[name="vehicle"]:checked')?.value,
            comments: document.getElementById('comments').value.trim()
        };
        
        // Validar formulario
        if (!validateForm(formData)) {
            return;
        }
        
        // Enviar formulario
        await submitForm(formData);
    });
    
    // Limpiar errores al cambiar los campos
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const field = this.name;
            if (errorElements[field]) {
                errorElements[field].textContent = '';
                errorElements[field].style.display = 'none';
            }
        });
        
        // Para los radio buttons
        if (input.type === 'radio') {
            input.addEventListener('change', function() {
                const field = this.name;
                if (errorElements[field]) {
                    errorElements[field].textContent = '';
                    errorElements[field].style.display = 'none';
                }
            });
        }
    });
    
    // Función para guardar el teléfono completo en el campo oculto
    function updateHiddenPhoneField() {
        if (phoneInputInstance && typeof phoneInputInstance.getFullNumber === 'function') {
            const phoneNumber = phoneInputInstance.getFullNumber();
            const hiddenInput = document.getElementById('full-phone-number');
            if (hiddenInput) {
                hiddenInput.value = phoneNumber;
            }
        }
    }
    
    // Actualizar el campo oculto cuando cambie el teléfono
    const phoneContainer = document.getElementById('phone-input-container');
    if (phoneContainer) {
        phoneContainer.addEventListener('change', updateHiddenPhoneField);
        phoneContainer.addEventListener('input', updateHiddenPhoneField);
    }
});