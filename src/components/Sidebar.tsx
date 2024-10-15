"use client"

import { Package, Truck, ShoppingBag, Users, ClipboardList, BarChart2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
  { href: "/", icon: BarChart2, label: "Dashboard" },
  { href: "/pedidos", icon: ShoppingBag, label: "Pedidos" },
  { href: "/clientes", icon: Users, label: "Clientes" },
  { href: "/repartos", icon: Truck, label: "Repartos" },
  { href: "/productos", icon: Package, label: "Productos" },
  { href: "/ventas", icon: ClipboardList, label: "Ventas" },
  { href: "/inventario", icon: Package, label: "Inventario" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <h1 className="text-orange-500 text-2xl font-bold text-center">Alenort</h1> {/* Título en naranja */}
      <nav>
        {sidebarItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block py-2.5 px-4 rounded transition duration-200 ${
                pathname === item.href ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              <Icon className="inline-block mr-2" size={18} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
