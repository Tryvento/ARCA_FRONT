<template>
    <button class="help-button" @click="toggleHelpWindow">
        <ion-icon name="help"></ion-icon>
    </button>
    <transition name="fade">
        <div v-if="showHelpWindow" id="help-window">
            <div id="help-window-content">
                <h2>AYUDA</h2>
                <p>Para soporte contactar por los siguientes medios:</p>
                <a :href="`https://wa.me/+57${supportNumber}`" target="_blank" class="help-window-link">
                    <ion-icon name="logo-whatsapp"></ion-icon>
                    <span>+57 {{ supportNumber }}</span>
                </a>
                <a :href="`mailto:${supportEmail}`" target="_blank" class="help-window-link">
                    <ion-icon name="mail"></ion-icon>
                    <span>{{ supportEmail }}</span>
                </a>
                <button @click="showHelpWindow = false">Cerrar</button>
            </div>
        </div>
    </transition>
</template>

<script setup>
import {ref} from 'vue'

const showHelpWindow = ref(false)
const supportNumber = import.meta.env.VITE_SUPPORT_NUMBER
const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL

const toggleHelpWindow = () => {
    showHelpWindow.value = !showHelpWindow.value
}

</script>

<style scoped>
*{
    font-family: var(--font-family);
}
.help-button{
    position: fixed;
    bottom: 20px;
    right: 20px;
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
    z-index: 1001;
    font-size: 1.5rem;
}

.help-button:hover{
    background-color: var(--fede-color-hover);
}

.help-button:active{
    background-color: var(--fede-color-active);
}

#help-window{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1002;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.3s ease;
}

#help-window-content{
    background-color: white;
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 30px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    animation: scaleIn 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

#help-window-content h2{
    text-align: center;
}

#help-window-content p{
    text-align: center;
}

#help-window-content a{
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.help-window-link{
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    text-decoration: none;
    color: black;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid var(--back-color);
}

.help-window-link:hover{
    background-color: var(--fede-color-hover);
    border-radius: 7px;
    color: white;
}

.help-window-link:active{
    background-color: var(--fede-color-active);
    border-radius: 9px;
    color: white;
}

#help-window-content button{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 10px;
    background-color: var(--fede-color);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    margin: 5px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

#help-window-content button:hover{
    background-color: var(--fede-color-hover);
}

#help-window-content button:active{
    background-color: var(--fede-color-active);
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes scaleIn {
    from {
        transform: scale(0.8);
    }
    to {
        transform: scale(1);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

</style>