"use client";
import { Users, Calendar, BarChart2, DollarSign, Gift, BookOpen, LayoutDashboard, Clipboard, LogOut, ShoppingBag, Truck, Package, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Role = "ADMIN" | "EncargadoClientes" | "Logistica";

const sidebarItems: Record<Role, { href: string; icon: React.ElementType; label: string }[]> = {
  ADMIN: [
    { href: "/dashboard", icon: BarChart2, label: "Dashboard" },
    { href: "/pedidos", icon: ShoppingBag, label: "Pedidos" },
    { href: "/clientes", icon: Users, label: "Clientes" },
    { href: "/repartos", icon: Truck, label: "Repartos" },
    { href: "/productos", icon: Package, label: "Productos" },
    { href: "/ventas", icon: ClipboardList, label: "Ventas" },
    { href: "/inventario", icon: Package, label: "Inventario" },
  ],
  EncargadoClientes: [
    { href: "/clientes", icon: Users, label: "Clientes" },
    { href: "/productos", icon: Package, label: "Productos" },
    { href: "/ventas", icon: ClipboardList, label: "Ventas" },
    { href: "/inventario", icon: Package, label: "Inventario" },
  ],
  Logistica: [
    { href: "/clientes", icon: Users, label: "Clientes" },
    { href: "/repartos", icon: Truck, label: "Repartos" },
  ],
};

export default function Sidebar({ role }: { role: Role | null }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para controlar la visibilidad del sidebar
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Verificamos que el role sea válido antes de renderizar
  if (!role || !(role in sidebarItems)) return null;

  const handleLogout = async () => {
    await signOut(auth); // Cierra sesión en Firebase
  };

  return (
    <>
      {/* Botón para abrir o cerrar el Sidebar en pantallas pequeñas */}
      <button
        className="md:hidden p-2 text-white bg-gray-800 fixed top-4 left-4 z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰ {/* Ícono de menú */}
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out z-40`}>
        <div className="text-center mb-6">
          <Link href="/">
            <img
              src="/alenort logo.png" // Asegúrate de que la ruta sea correcta
              alt="Alenort Logo"
              className="h-40 mx-auto"
            />
          </Link>
        </div>
        <nav>
          {sidebarItems[role].map((item) => {
            const Icon = item.icon;
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
            );
          })}
        </nav>
        <div className="absolute bottom-6 left-0 w-full px-4">
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogTrigger asChild>
              <Button
                onClick={() => setIsAlertOpen(true)}
                className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-2 rounded"
              >
                <LogOut className="inline-block mr-2" size={18} />
                Salir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white rounded-lg shadow-lg p-6">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg font-bold text-gray-800">¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                  Esta acción cerrará tu sesión. ¿Quieres continuar?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-gray-500 hover:text-gray-700">Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleLogout()} className="bg-red-600 text-white hover:bg-red-700 rounded-md px-4 py-2">Continuar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>
    </>
  );
}
