<template>
    <div class="help-container">
        <!-- Botón de WhatsApp que aparece a la izquierda -->
        <transition name="slide-left">
            <a v-if="showButtons" :href="`https://wa.me/+57${supportNumber}`" target="_blank" class="help-button whatsapp-button">
                <ion-icon name="logo-whatsapp"></ion-icon>
            </a>
        </transition>
        
        <!-- Botón de correo que aparece arriba -->
        <transition name="slide-up">
            <a v-if="showButtons" :href="`mailto:${supportEmail}`" target="_blank" class="help-button email-button">
                <ion-icon name="mail"></ion-icon>
            </a>
        </transition>
        
        <!-- Botón principal de ayuda/cierre -->
        <button class="help-button main-button" @click="toggleButtons">
            <ion-icon :name="showButtons ? 'close' : 'help'"></ion-icon>
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const showButtons = ref(false)
const supportNumber = import.meta.env.VITE_SUPPORT_NUMBER
const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL

const toggleButtons = () => {
    showButtons.value = !showButtons.value
}
</script>

<style scoped>
* {
    font-family: var(--font-family);
}

.help-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    z-index: 1001;
}

.help-button {
    background-color: var(--fede-color);
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    font-size: 1.5rem;
    text-decoration: none;
}

.main-button {
    z-index: 1003;
}

.whatsapp-button {
    background-color: #25D366;
    position: absolute;
    right: 65px; /* Posición a la izquierda del botón principal */
    bottom: 0;
    z-index: 1002;
}

.email-button {
    background-color: var(--warning-color);
    position: absolute;
    right: 0;
    bottom: 65px; /* Posición arriba del botón principal */
    z-index: 1002;
}


.help-button:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    filter: brightness(.9);
}

/* Animaciones para los botones */
.slide-left-enter-active,
.slide-left-leave-active {
    transition: all 0.4s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.4s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>