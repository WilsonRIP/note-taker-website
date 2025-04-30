"use client"

import * as React from "react"
import { createContext, useContext } from "react"

import type { ToastActionElement, ToastProps } from "./toast"

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

type ToastContextType = {
  toasts: ToasterToast[]
  addToast: (toast: Omit<ToasterToast, "id">) => string
  updateToast: (id: string, toast: Partial<ToasterToast>) => void
  dismissToast: (id: string) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => "",
  updateToast: () => {},
  dismissToast: () => {},
  removeToast: () => {},
})

export const useToast = () => {
  const context = useContext(ToastContext)

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return context
}

export const ToastProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([])

  const addToast = (toast: Omit<ToasterToast, "id">) => {
    const id = crypto.randomUUID()

    setToasts((prevToasts) => {
      const newToasts = [...prevToasts, { ...toast, id }]
      return newToasts.slice(-TOAST_LIMIT)
    })

    return id
  }

  const updateToast = (id: string, toast: Partial<ToasterToast>) => {
    setToasts((prevToasts) =>
      prevToasts.map((t) => (t.id === id ? { ...t, ...toast } : t))
    )
  }

  const dismissToast = (id: string) => {
    setToasts((prevToasts) =>
      prevToasts.map((t) =>
        t.id === id ? { ...t, open: false } : t
      )
    )
  }

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      updateToast,
      dismissToast,
      removeToast,
    }}>
      {children}
    </ToastContext.Provider>
  )
}

export function toast({
  ...props
}: Omit<ToasterToast, "id">) {
  const { addToast } = useToast()
  return addToast(props)
}
