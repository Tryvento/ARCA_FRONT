import { inject, provide, ref } from "vue";

const AlertsSymbol = Symbol();

export function useAlertsProviders() {
    const alerts = ref([]);
    let nextId = ref(0);

    const addAlert = (alert) => {
        const id = nextId.value++;

        const newAlert ={
            id,
            message: alert.message,
            type: alert.type || 'info',
            duration: alert.duration || 0
        }
        
        if(alerts.value.length >= 5) {
            alerts.value.shift();
        }
        alerts.value.push(newAlert);

        if(newAlert.duration > 0) {
            setTimeout(() => {
                removeAlert(id);
            }, newAlert.duration);
        }
    }

    const removeAlert = (id) => {
        const index = alerts.value.findIndex(alert => alert.id === id);
        if(index !== -1) {
            alerts.value.splice(index, 1);
        }
    }

    const clearAll = () => {
        alerts.value = [];
    }

    const alertMethods = {
        info:(message, duration = 10000) => addAlert({message, type: 'info', duration}),
        success:(message, duration = 10000) => addAlert({message, type: 'success', duration}),
        warning:(message, duration = 10000) => addAlert({message, type: 'warning', duration}),
        error:(message, duration = 10000) => addAlert({message, type: 'error', duration}),
        remove: removeAlert,
        clearAll: clearAll
    }

    provide(AlertsSymbol, {
        alerts,
        ...alertMethods
    })

    return alertMethods
}

export function useAlerts(){
    const alertsContext = inject(AlertsSymbol);
    if(!alertsContext) {
        throw new Error('useAlerts must be used within a useAlertsProvider');
    }
    return alertsContext;
}