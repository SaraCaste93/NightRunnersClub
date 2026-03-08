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
            if (error) {
                error.textContent = '';
                error.style.display = 'none';
            }
        });
        if (errorContainer) {
            errorContainer.style.display = 'none';
            errorContainer.innerHTML = '';
        }
    }

    // Función para mostrar error global
    function showGlobalError(message) {
        if (!errorContainer) return;
        errorContainer.innerHTML = `
            <div class="global-error" style="background-color: rgba(220,20,60,0.1); color: #ff6b6b; padding: 15px; border-radius: 5px; margin-bottom: 20px; border: 1px solid rgba(220,20,60,0.3);">
                <strong>Error:</strong> ${message}
            </div>
        `;
        errorContainer.style.display = 'block';
    }

    // Función para mostrar éxito
    function showSuccess() {
        if (form) form.style.display = 'none';
        if (successMessage) {
            successMessage.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Función para obtener el número de teléfono completo
    function getFullPhoneNumber() {
        if (phoneInputInstance && typeof phoneInputInstance.getFullNumber === 'function') {
            return phoneInputInstance.getFullNumber();
        }
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
            if (loadingSpinner) loadingSpinner.style.display = 'block';

            const phoneNumber = getFullPhoneNumber();
            const subject = `Nueva solicitud de membresía - ${formData.name}`;

            const response = await fetch('https://formspree.io/f/mqeepgrw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
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
                const data = await response.json();
                throw new Error(data?.error || 'Error al enviar el formulario');
            }

        } catch (error) {
            console.error('Error:', error);
            showGlobalError('Hubo un problema al enviar tu solicitud. Por favor, inténtalo de nuevo más tarde.');
            submitBtn.disabled = false;
            submitText.textContent = 'Enviar';
            if (loadingSpinner) loadingSpinner.style.display = 'none';
        }
    }

    // Evento de envío del formulario
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name')?.value.trim(),
                email: document.getElementById('email')?.value.trim(),
                age: document.querySelector('input[name="age"]:checked')?.value,
                vehicle: document.querySelector('input[name="vehicle"]:checked')?.value,
                comments: document.getElementById('comments')?.value.trim()
            };

            if (!validateForm(formData)) return;

            await submitForm(formData);
        });
    }

    // Limpiar errores al cambiar los campos
    if (form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                const field = this.name;
                if (errorElements[field]) {
                    errorElements[field].textContent = '';
                    errorElements[field].style.display = 'none';
                }
            });

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
    }

    // Actualizar campo oculto con el teléfono completo
    function updateHiddenPhoneField() {
        if (phoneInputInstance && typeof phoneInputInstance.getFullNumber === 'function') {
            const phoneNumber = phoneInputInstance.getFullNumber();
            const hiddenInput = document.getElementById('full-phone-number');
            if (hiddenInput) hiddenInput.value = phoneNumber;
        }
    }

    const phoneContainer = document.getElementById('phone-input-container');
    if (phoneContainer) {
        phoneContainer.addEventListener('change', updateHiddenPhoneField);
        phoneContainer.addEventListener('input', updateHiddenPhoneField);
    }
});