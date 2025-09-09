<template>
    <button @click="startTour(steps)" title="Iniciar Tour">
        <ion-icon name="alert"></ion-icon>
    </button>
</template>

<script setup>
import { useDriver } from '../stores/useDriver'
import { onMounted } from 'vue'


const {initDriver, startTour} = useDriver()

defineProps({
    steps: {
        type: Array,
        required: true
    }
})

onMounted(() => {
    initDriver()
})

</script>
    

<style scoped>
@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
  }
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}

button {
    all: unset;
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    animation: pulse 2s infinite;
    will-change: transform;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: var(--fede-color);
    color: white;
    transition: all 0.3s ease;
    position: relative;
    overflow: visible;
}

button:hover {
    animation: none;
    transform: scale(1.1);
    filter: brightness(0.95);
    box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.1);
}

button:active {
    animation: none;
    transform: scale(0.95);
    filter: brightness(1.1);
}
</style>
