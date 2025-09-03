<script>
import AlertItem from './AlertItem.vue'
import { useAlerts } from '../stores/useAlerts'

export default {
  name: 'AlertContainer',
  components: {
    AlertItem,
  },
  props: {
    position: {
      type: String,
      default: 'top-right',
      validator: (value) =>
        [
          'top-right',
          'top-left',
          'bottom-right',
          'bottom-left',
          'top-center',
          'bottom-center',
        ].includes(value),
    },
    maxAlerts: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      alerts: [],
      nextId: 0,
    }
  },
  setup() {
    const { alerts, remove } = useAlerts()

    const removeAlert = (id) => {
      remove(id)
    }

    return {
      alerts,
      removeAlert,
    }
  },
}
</script>

<template>
  <div :class="['alerts-container', `alerts-container--${position}`]">
    <TransitionGroup name="alert-list" tag="div" class="alerts-list">
      <div 
        v-for="alert in alerts" 
        :key="alert.id" 
        class="alert-wrapper"
        :data-alert-id="alert.id"
      >
        <AlertItem
          :id="alert.id"
          :message="alert.message"
          :type="alert.type"
          :duration="alert.duration"
          @close="removeAlert"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.alerts-container {
  position: fixed;
  z-index: 9999;
  width: 520px;
  height: 100dvh;
  max-width: 90dvw;
  pointer-events: none;
}

.alerts-container--top-right {
  top: 1rem;
  right: 1rem;
}
.alerts-container--top-left {
  top: 1rem;
  left: 1rem;
}
.alerts-container--bottom-right {
  bottom: 1rem;
  right: 1rem;
}
.alerts-container--bottom-left {
  bottom: 1rem;
  left: 1rem;
}
.alerts-container--top-center {
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
}
.alerts-container--bottom-center {
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
}

.alerts-container >>> .alert {
  pointer-events: auto;
}

/* List animation */
.alert-list-move,
.alert-list-enter-active {
  transition: all 0.3s ease;
}

.alert-list-leave-active {
  transition: all 0.3s cubic-bezier(0.5, 0, 0, 1);
  position: absolute;
  width: var(--alert-width, auto);
  max-width: 100%;
}

.alert-list-enter-from,
.alert-list-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.alert-list-leave-to {
  transform: translateX(-100%) scale(0.8);
}

.alert-wrapper {
  position: relative;
  width: 100%;
  max-width: 100%;
  transition: all 0.3s ease;
}

.alert-list-move {
  transition: transform 0.3s ease;
}
</style>
