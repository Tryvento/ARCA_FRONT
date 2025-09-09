import { ref } from 'vue'
import { driver as Driver } from 'driver.js'
import 'driver.js/dist/driver.css'

export const useDriver = () => {
    const driver = ref(null)

    const initDriver = () => {
        driver.value = new Driver({
            animate: true,
            opacity: 0.75,
            padding: 10,
            allowClose: true,
            doneBtnText: 'Terminar',
            closeBtnText: 'Cerrar',
            nextBtnText: 'Siguiente',
            prevBtnText: 'Anterior',
            exitOnEsc: true,
            onDestroyStarted: () => {
                if (!driver.value.hasNextStep()) {
                    driver.value.destroy()
                }
                return false
            },
            onNextClick: (element) => {
                // Skip to next visible step if current step's element is not in DOM
                if (element && !document.contains(element)) {
                    const currentStep = driver.value.getActiveStep()
                    const nextStep = findNextVisibleStep(currentStep.index + 1, driver.value.getSteps())
                    if (nextStep !== -1) {
                        driver.value.moveNext()
                    } else {
                        driver.value.destroy()
                    }
                    return
                }
                driver.value.moveNext()
            },
            onPrevClick: (element) => {
                // Skip to previous visible step if current step's element is not in DOM
                if (element && !document.contains(element)) {
                    const currentStep = driver.value.getActiveStep()
                    const prevStep = findPrevVisibleStep(currentStep.index - 1, driver.value.getSteps())
                    if (prevStep !== -1) {
                        driver.value.moveTo(prevStep)
                    } else {
                        driver.value.destroy()
                    }
                    return
                }
                driver.value.movePrevious()
            }
        })
    }

    const findNextVisibleStep = (startIndex, steps) => {
        for (let i = startIndex; i < steps.length; i++) {
            const element = document.querySelector(steps[i].element)
            if (element && isElementVisible(element)) {
                return i
            }
            // Check if step has a when condition
            if (steps[i].popover?.when?.show && !steps[i].popover.when.show()) {
                continue
            }
            // If no element selector, consider it visible
            if (!steps[i].element) return i
        }
        return -1
    }

    const findPrevVisibleStep = (startIndex, steps) => {
        for (let i = startIndex; i >= 0; i--) {
            const element = document.querySelector(steps[i].element)
            if (element && isElementVisible(element)) {
                return i
            }
            // Check if step has a when condition
            if (steps[i].popover?.when?.show && !steps[i].popover.when.show()) {
                continue
            }
            // If no element selector, consider it visible
            if (!steps[i].element) return i
        }
        return -1
    }

    const isElementVisible = (element) => {
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length)
    }

    const startTour = (steps) => {
        // Filter out steps for elements that don't exist in the DOM
        const visibleSteps = steps.filter(step => {
            if (!step.element) return true // Keep steps without element selector
            const element = document.querySelector(step.element)
            if (!element) return false
            
            // Check if step has a when condition
            if (step.popover?.when?.show && !step.popover.when.show()) {
                return false
            }
            
            return isElementVisible(element)
        })

        if (visibleSteps.length === 0) return

        driver.value = new Driver({
            showProgress: true,
            animate: true,
            opacity: 0.75,
            padding: 10,
            allowClose: true,
            doneBtnText: 'Terminar',
            closeBtnText: 'Cerrar',
            nextBtnText: 'Siguiente',
            prevBtnText: 'Anterior',
            exitOnEsc: true,
            onNextClick: (element) => {
                if (element && !document.contains(element)) {
                    const currentStep = driver.value.getActiveStep()
                    const nextStep = findNextVisibleStep(currentStep.index + 1, driver.value.getSteps())
                    if (nextStep !== -1) {
                        driver.value.moveNext()
                    } else {
                        driver.value.destroy()
                    }
                    return
                }
                driver.value.moveNext()
            },
            onPrevClick: (element) => {
                if (element && !document.contains(element)) {
                    const currentStep = driver.value.getActiveStep()
                    const prevStep = findPrevVisibleStep(currentStep.index - 1, driver.value.getSteps())
                    if (prevStep !== -1) {
                        driver.value.moveTo(prevStep)
                    } else {
                        driver.value.destroy()
                    }
                    return
                }
                driver.value.movePrevious()
            }
        })

        driver.value.setSteps(visibleSteps)
        driver.value.drive()
    }

    return {
        initDriver,
        startTour,
        driver
    }
}