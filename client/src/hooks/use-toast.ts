import { useState, useCallback } from 'react'

interface Toast {
    id: string
    title?: string
    description?: string
    variant?: 'default' | 'destructive'
}

interface ToastContextType {
    toasts: Toast[]
    toast: (toast: Omit<Toast, 'id'>) => void
    dismiss: (id: string) => void
}

const toasts: Toast[] = []
const listeners: Array<(toasts: Toast[]) => void> = []

let toastCount = 0

function genId() {
    toastCount = (toastCount + 1) % Number.MAX_VALUE
    return toastCount.toString()
}

function addToast(toast: Omit<Toast, 'id'>) {
    const id = genId()
    const newToast = { ...toast, id }
    toasts.push(newToast)
    listeners.forEach((listener) => listener([...toasts]))

    setTimeout(() => {
        dismissToast(id)
    }, 5000)
}

function dismissToast(id: string) {
    const index = toasts.findIndex((toast) => toast.id === id)
    if (index > -1) {
        toasts.splice(index, 1)
        listeners.forEach((listener) => listener([...toasts]))
    }
}

export function useToast() {
    const [toastList, setToastList] = useState<Toast[]>([...toasts])

    const addListener = useCallback((listener: (toasts: Toast[]) => void) => {
        listeners.push(listener)
        return () => {
            const index = listeners.indexOf(listener)
            if (index > -1) {
                listeners.splice(index, 1)
            }
        }
    }, [])

    useState(() => {
        return addListener(setToastList)
    })

    return {
        toasts: toastList,
        toast: addToast,
        dismiss: dismissToast
    }
}