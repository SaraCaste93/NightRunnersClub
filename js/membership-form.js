// membership-form.js
document.addEventListener('DOMContentLoaded', function () {
    // ============================================
    // VARIABLES Y ELEMENTOS
    // ============================================
    const form = document.getElementById('membership-form');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const loadingSpinner = document.getElementById('loading-spinner');
    const successMessage = document.getElementById('success-message');
    const errorContainer = document.getElementById('error-container');

    // ============================================
    // VALIDACIÓN EN TIEMPO REAL
    // ============================================

    // Validar nombre
    const nameInput = document.getElementById('name');
    if (nameInput) {
        nameInput.addEventListener('blur', validateName);
        nameInput.addEventListener('input', clearError);
    }

    // Validar teléfono
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('blur', validatePhone);
        phoneInput.addEventListener('input', clearError);
    }

    // Validar email
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
        emailInput.addEventListener('input', clearError);
    }

    // Validar radio buttons
    const ageRadios = document.querySelectorAll('input[name="age"]');
    const vehicleRadios = document.querySelectorAll('input[name="vehicle"]');

    ageRadios.forEach(radio => {
        radio.addEventListener('change', () => clearRadioError('age'));
    });

    vehicleRadios.forEach(radio => {
        radio.addEventListener('change', () => clearRadioError('vehicle'));
    });

    // ============================================
    // FUNCIONES DE VALIDACIÓN
    // ============================================

    function validateName() {
        const name = nameInput.value.trim();
        const errorElement = document.getElementById('name-error');

        if (name.length < 2) {
            showError(nameInput, 'El nombre debe tener al menos 2 caracteres');
            return false;
        } else {
            showSuccess(nameInput);
            return true;
        }
    }

    function validatePhone() {
        const phone = phoneInput.value.trim();
        const errorElement = document.getElementById('phone-error');
        const phoneRegex = /^[0-9]{9}$/;

        if (!phoneRegex.test(phone)) {
            showError(phoneInput, 'Introduce un número de teléfono válido (9 dígitos)');
            return false;
        } else {
            showSuccess(phoneInput);
            return true;
        }
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        const errorElement = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            showError(emailInput, 'Introduce un correo electrónico válido');
            return false;
        } else {
            showSuccess(emailInput);
            return true;
        }
    }

    function validateRadios() {
        let isValid = true;

        // Validar edad
        const ageChecked = document.querySelector('input[name="age"]:checked');
        if (!ageChecked) {
            document.getElementById('age-error').textContent = 'Esta pregunta es obligatoria';
            document.getElementById('age-error').classList.add('show');
            isValid = false;
        } else {
            document.getElementById('age-error').classList.remove('show');
        }

        // Validar vehículo
        const vehicleChecked = document.querySelector('input[name="vehicle"]:checked');
        if (!vehicleChecked) {
            document.getElementById('vehicle-error').textContent = 'Esta pregunta es obligatoria';
            document.getElementById('vehicle-error').classList.add('show');
            isValid = false;
        } else {
            document.getElementById('vehicle-error').classList.remove('show');
        }

        return isValid;
    }

    // ============================================
    // FUNCIONES DE UTILIDAD
    // ============================================

    function showError(input, message) {
        input.classList.add('error');
        input.classList.remove('success');
        const errorId = input.id + '-error';
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    function showSuccess(input) {
        input.classList.remove('error');
        input.classList.add('success');
        const errorId = input.id + '-error';
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    function clearError(e) {
        const input = e.target;
        input.classList.remove('error');
        const errorId = input.id + '-error';
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    function clearRadioError(name) {
        const errorElement = document.getElementById(name + '-error');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    function showGlobalError(message) {
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="global-error">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff4757">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <span>${message}</span>
                </div>
            `;
            errorContainer.style.display = 'block';

            // Auto-ocultar después de 5 segundos
            setTimeout(() => {
                errorContainer.style.display = 'none';
            }, 5000);
        }
    }

    function showGlobalSuccess(message) {
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="global-success">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#4CAF50">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span>${message}</span>
                </div>
            `;
            errorContainer.style.display = 'block';
        }
    }

    // ============================================
    // MANEJO DEL ENVÍO DEL FORMULARIO
    // ============================================

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Validar todos los campos
            const isNameValid = validateName();
            const isPhoneValid = validatePhone();
            const isEmailValid = validateEmail();
            const isRadiosValid = validateRadios();

            if (!isNameValid || !isPhoneValid || !isEmailValid || !isRadiosValid) {
                showGlobalError('Por favor, corrige los errores en el formulario');

                // Scroll al primer error
                const firstError = document.querySelector('.error, .error-message.show');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            // Obtener datos del formulario
            const formData = {
                name: nameInput.value.trim(),
                phone: phoneInput.value.trim(),
                email: emailInput.value.trim(),
                age: document.querySelector('input[name="age"]:checked').value,
                vehicle: document.querySelector('input[name="vehicle"]:checked').value,
                comments: document.getElementById('comments').value.trim()
            };

            // Mostrar estado de carga
            submitBtn.disabled = true;
            submitText.textContent = 'Enviando...';
            loadingSpinner.classList.add('show');

            try {
                // Enviar datos al servidor PHP
                const response = await fetch('php/send-email.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    // Éxito: mostrar mensaje y resetear formulario
                    showGlobalSuccess(result.message);
                    form.reset();

                    // Resetear estilos de los campos
                    document.querySelectorAll('.form-input').forEach(input => {
                        input.classList.remove('success', 'error');
                    });

                    // Mostrar mensaje de éxito completo
                    setTimeout(() => {
                        form.style.display = 'none';
                        successMessage.style.display = 'block';
                        errorContainer.style.display = 'none';
                    }, 1000);

                    // Guardar en localStorage que el formulario fue enviado
                    localStorage.setItem('formSubmitted', 'true');

                } else {
                    // Error: mostrar mensaje
                    showGlobalError(result.message || 'Error al enviar el formulario');
                }

            } catch (error) {
                // Error de conexión
                console.error('Error:', error);
                showGlobalError('Error de conexión. Por favor, inténtalo de nuevo.');

            } finally {
                // Restaurar botón
                submitBtn.disabled = false;
                submitText.textContent = 'Enviar';
                loadingSpinner.classList.remove('show');
            }
        });
    }

    // ============================================
    // RECUPERAR DATOS EN CASO DE RECARGA
    // ============================================

    // Guardar datos automáticamente mientras se escriben
    const saveFormData = () => {
        const formData = {
            name: nameInput?.value || '',
            phone: phoneInput?.value || '',
            email: emailInput?.value || '',
            age: document.querySelector('input[name="age"]:checked')?.value || '',
            vehicle: document.querySelector('input[name="vehicle"]:checked')?.value || '',
            comments: document.getElementById('comments')?.value || ''
        };
        localStorage.setItem('formDraft', JSON.stringify(formData));
    };

    // Agregar event listeners para guardar datos
    document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.addEventListener('input', saveFormData);
    });

    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', saveFormData);
    });

    // Cargar datos guardados al cargar la página
    const loadFormData = () => {
        const savedData = localStorage.getItem('formDraft');
        if (savedData) {
            const formData = JSON.parse(savedData);

            if (nameInput && formData.name) nameInput.value = formData.name;
            if (phoneInput && formData.phone) phoneInput.value = formData.phone;
            if (emailInput && formData.email) emailInput.value = formData.email;

            if (formData.age) {
                document.querySelector(`input[name="age"][value="${formData.age}"]`).checked = true;
            }

            if (formData.vehicle) {
                document.querySelector(`input[name="vehicle"][value="${formData.vehicle}"]`).checked = true;
            }

            const commentsInput = document.getElementById('comments');
            if (commentsInput && formData.comments) {
                commentsInput.value = formData.comments;
            }
        }
    };

    // Ejecutar cuando se carga la página
    loadFormData();

    // Limpiar datos guardados si el formulario se envió correctamente
    if (localStorage.getItem('formSubmitted') === 'true') {
        localStorage.removeItem('formDraft');
        localStorage.removeItem('formSubmitted');
    }

    // ============================================
    // MEJORAS UX ADICIONALES
    // ============================================

    // Auto-focus en el primer campo
    if (nameInput) {
        nameInput.focus();
    }

    // Validar al presionar Enter en campos
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' && e.target.type !== 'textarea') {
                e.preventDefault();
                const nextInput = this.nextElementSibling?.nextElementSibling;
                if (nextInput && nextInput.classList.contains('form-input')) {
                    nextInput.focus();
                }
            }
        });
    });

    // Animación suave al hacer scroll a errores
    const smoothScrollToError = (element) => {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    };
});