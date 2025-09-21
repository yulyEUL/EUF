"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type SidebarContextType = {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

// Try to get the sidebar state from localStorage on client side
const getSavedState = (): boolean => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("sidebar-state")
    return saved !== null ? saved === "open" : true // Default to open if not saved
  }
  return true
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true) // Default to true for server rendering

  // Initialize state from localStorage on client side
  useEffect(() => {
    setIsOpen(getSavedState())
  }, [])

  const toggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-state", newState ? "open" : "closed")
    }
  }

  const close = () => {
    setIsOpen(false)
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-state", "closed")
    }
  }

  return <SidebarContext.Provider value={{ isOpen, toggle, close }}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
