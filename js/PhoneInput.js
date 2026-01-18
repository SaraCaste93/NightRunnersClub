// PhoneInput.js
class PhoneInput {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.options = {
            showFlags: true,
            defaultCountry: 'ES',
            required: true,
            placeholder: 'Número de teléfono',
            ...options
        };

        this.countryCodes = this.getCountryCodes();
        this.init();
    }

    // Lista completa de prefijos (versión compacta)
    getCountryCodes() {
        return [
            { code: 'ES', name: 'España', prefix: '+34', flag: '🇪🇸' },
            { code: 'US', name: 'Estados Unidos', prefix: '+1', flag: '🇺🇸' },
            { code: 'CA', name: 'Canadá', prefix: '+1', flag: '🇨🇦' },
            { code: 'GB', name: 'Reino Unido', prefix: '+44', flag: '🇬🇧' },
            { code: 'FR', name: 'Francia', prefix: '+33', flag: '🇫🇷' },
            { code: 'DE', name: 'Alemania', prefix: '+49', flag: '🇩🇪' },
            { code: 'IT', name: 'Italia', prefix: '+39', flag: '🇮🇹' },
            { code: 'PT', name: 'Portugal', prefix: '+351', flag: '🇵🇹' },
            { code: 'MX', name: 'México', prefix: '+52', flag: '🇲🇽' },
            { code: 'AR', name: 'Argentina', prefix: '+54', flag: '🇦🇷' },
            { code: 'CL', name: 'Chile', prefix: '+56', flag: '🇨🇱' },
            { code: 'CO', name: 'Colombia', prefix: '+57', flag: '🇨🇴' },
            { code: 'BR', name: 'Brasil', prefix: '+55', flag: '🇧🇷' },
            { code: 'PE', name: 'Perú', prefix: '+51', flag: '🇵🇪' },
            { code: 'AD', name: 'Andorra', prefix: '+376', flag: '🇦🇩' },
            { code: 'CH', name: 'Suiza', prefix: '+41', flag: '🇨🇭' },
            { code: 'NL', name: 'Países Bajos', prefix: '+31', flag: '🇳🇱' },
            { code: 'BE', name: 'Bélgica', prefix: '+32', flag: '🇧🇪' },
            { code: 'SE', name: 'Suecia', prefix: '+46', flag: '🇸🇪' },
            { code: 'NO', name: 'Noruega', prefix: '+47', flag: '🇳🇴' },
            { code: 'DK', name: 'Dinamarca', prefix: '+45', flag: '🇩🇰' },
            { code: 'FI', name: 'Finlandia', prefix: '+358', flag: '🇫🇮' },
            { code: 'GR', name: 'Grecia', prefix: '+30', flag: '🇬🇷' },
            { code: 'RU', name: 'Rusia', prefix: '+7', flag: '🇷🇺' },
            { code: 'CN', name: 'China', prefix: '+86', flag: '🇨🇳' },
            { code: 'JP', name: 'Japón', prefix: '+81', flag: '🇯🇵' },
            { code: 'KR', name: 'Corea del Sur', prefix: '+82', flag: '🇰🇷' },
            { code: 'IN', name: 'India', prefix: '+91', flag: '🇮🇳' },
            { code: 'AU', name: 'Australia', prefix: '+61', flag: '🇦🇺' },
            { code: 'NZ', name: 'Nueva Zelanda', prefix: '+64', flag: '🇳🇿' }
        ];
    }

    // Patrones de validación por país
    getValidationPattern(countryCode) {
        const patterns = {
            'ES': /^[6-9]\d{8}$/, // España: 9 dígitos, empieza por 6,7,8,9
            'US': /^\d{10}$/, // USA: 10 dígitos
            'CA': /^\d{10}$/, // Canadá: 10 dígitos
            'GB': /^\d{10,11}$/, // UK: 10-11 dígitos
            'FR': /^[1-9]\d{8}$/, // Francia: 9 dígitos
            'DE': /^\d{10,11}$/, // Alemania: 10-11 dígitos
            'IT': /^\d{9,10}$/, // Italia: 9-10 dígitos
            'PT': /^[2-9]\d{8}$/, // Portugal: 9 dígitos
            'MX': /^\d{10}$/, // México: 10 dígitos
            'AR': /^\d{10}$/, // Argentina: 10 dígitos
            'CL': /^[2-9]\d{8}$/, // Chile: 9 dígitos
            'CO': /^[3]\d{9}$/, // Colombia: 10 dígitos, empieza por 3
            'BR': /^\d{10,11}$/, // Brasil: 10-11 dígitos
            'PE': /^\d{9}$/, // Perú: 9 dígitos
            'default': /^\d{6,15}$/ // Por defecto: 6-15 dígitos
        };

        return patterns[countryCode] || patterns['default'];
    }

    // Crear el HTML del input
    init() {
        const defaultCountry = this.countryCodes.find(c => c.code === this.options.defaultCountry) || this.countryCodes[0];

        this.container.innerHTML = `
        <div class="phone-input-container">
            <div class="phone-input-group">
                <div class="country-selector">
                    <!-- Select oculto o con estilos diferentes -->
                    <select class="country-select" name="country-code" ${this.options.required ? 'required' : ''}
                            style="appearance: none; -webkit-appearance: none; -moz-appearance: none; 
                                   background: transparent; border: none; color: transparent; 
                                   position: absolute; width: 100%; height: 100%; cursor: pointer; z-index: 10;">
                        ${this.countryCodes.map(country => `
                            <option value="${country.code}" 
                                    data-prefix="${country.prefix}"
                                    ${country.code === this.options.defaultCountry ? 'selected' : ''}>
                                ${country.name} <!-- Solo nombre para accesibilidad -->
                            </option>
                        `).join('')}
                    </select>
                    <!-- Span visible que muestra solo el prefijo -->
                    <div class="selected-prefix-display">
                        <span class="selected-prefix">${defaultCountry.prefix}</span>
                    </div>
                </div>
                <input type="tel" 
                       class="phone-number" 
                       name="phone-number" 
                       placeholder="${this.options.placeholder}" 
                       ${this.options.required ? 'required' : ''}
                       maxlength="15">
            </div>
            <div class="phone-error" style="color: #dc143c; font-size: 0.9rem; margin-top: 5px; display: none;"></div>
        </div>
    `;

        this.bindEvents();
    }

    // Vincular eventos
    bindEvents() {
        const select = this.container.querySelector('.country-select');
        const input = this.container.querySelector('.phone-number');
        const prefixDisplay = this.container.querySelector('.selected-prefix');
        const flagDisplay = this.container.querySelector('.selected-flag');
        const errorDiv = this.container.querySelector('.phone-error');

        // Cambiar prefijo cuando se selecciona otro país
        select.addEventListener('change', (e) => {
            const selectedOption = select.options[select.selectedIndex];
            const prefix = selectedOption.getAttribute('data-prefix');
            const countryCode = selectedOption.value;

            // Actualizar el display
            prefixDisplay.textContent = prefix;

            // Actualizar la bandera
            const country = this.countryCodes.find(c => c.code === countryCode);
            if (country && flagDisplay) {
                flagDisplay.textContent = country.flag;
            }

            input.focus();
        });
        // Validar en tiempo real
        input.addEventListener('input', (e) => {
            this.validatePhone(input.value, select.value, errorDiv);
        });

        // Validar al perder el foco
        input.addEventListener('blur', (e) => {
            this.validatePhone(input.value, select.value, errorDiv, true);
        });

        // Validar al cambiar país
        select.addEventListener('change', (e) => {
            this.validatePhone(input.value, select.value, errorDiv);
        });
    }

    // Validar número de teléfono
    validatePhone(phoneNumber, countryCode, errorDiv, showMessage = false) {
        // Limpiar solo números
        const cleanNumber = phoneNumber.replace(/\D/g, '');

        // Obtener patrón de validación
        const pattern = this.getValidationPattern(countryCode);

        // Validar
        if (!cleanNumber) {
            errorDiv.textContent = showMessage ? 'Por favor, introduce tu número de teléfono' : '';
            errorDiv.style.display = showMessage ? 'block' : 'none';
            return false;
        }

        if (!pattern.test(cleanNumber)) {
            const country = this.countryCodes.find(c => c.code === countryCode);
            const example = this.getPhoneExample(countryCode);

            errorDiv.textContent = showMessage
                ? `Formato inválido para ${country?.name || 'este país'}. Ejemplo: ${example}`
                : 'Formato inválido';
            errorDiv.style.display = 'block';
            return false;
        }

        errorDiv.style.display = 'none';
        return true;
    }

    // Ejemplos de números por país
    getPhoneExample(countryCode) {
        const examples = {
            'ES': '612 345 678',
            'US': '201 555 0123',
            'GB': '7911 123456',
            'FR': '612 345 678',
            'DE': '171 1234567',
            'MX': '55 1234 5678',
            'AR': '11 1234 5678',
            'default': '123 456 789'
        };

        return examples[countryCode] || examples['default'];
    }

    // Obtener número completo (prefijo + número)
    getFullNumber() {
        const select = this.container.querySelector('.country-select');
        const input = this.container.querySelector('.phone-number');

        if (!select || !input) return null;

        const prefix = select.options[select.selectedIndex].getAttribute('data-prefix');
        const cleanNumber = input.value.replace(/\D/g, '');

        if (!cleanNumber) return null;

        return prefix + cleanNumber;
    }

    // Validar antes de enviar formulario
    isValid() {
        const select = this.container.querySelector('.country-select');
        const input = this.container.querySelector('.phone-number');
        const errorDiv = this.container.querySelector('.phone-error');

        return this.validatePhone(input.value, select.value, errorDiv, true);
    }

    // Restablecer
    reset() {
        const select = this.container.querySelector('.country-select');
        const input = this.container.querySelector('.phone-number');
        const errorDiv = this.container.querySelector('.phone-error');

        select.value = this.options.defaultCountry;
        input.value = '';
        errorDiv.style.display = 'none';

        // Actualizar prefijo
        const prefixSpan = this.container.querySelector('.selected-prefix');
        const country = this.countryCodes.find(c => c.code === this.options.defaultCountry);
        if (prefixSpan && country) {
            prefixSpan.textContent = country.prefix;
        }
    }
}

// Exportar para usar en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhoneInput;
}