"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export default function Inicio() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          console.log("User UID:", user.uid); // Verifica el UID en la consola
          // Intentar obtener el rol desde Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          } else {
            setError("El documento del usuario no existe en Firestore. Verifica el UID.");
          }
        } catch (err) {
          console.error("Error al obtener el rol del usuario:", err);
          setError("Error: no tienes permisos para acceder a esta información.");
        }
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <h1 className="text-3xl font-bold mb-4">Bienvenido, {userRole || 'Cargando...'}</h1>
      <p className="text-lg mb-6">Selecciona una de las siguientes opciones:</p>
      
      <div className="space-x-6">
        <Button 
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Ir al Dashboard
        </Button>
        {userRole?.toUpperCase() === 'ADMIN' && (
          <Button 
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Sección de Administración
          </Button>
        )}
        {userRole?.toUpperCase() === 'Logistica' && (
          <Button 
            onClick={() => router.push('/rrhh')}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Recursos Humanos
          </Button>
        )}
        {userRole?.toUpperCase() === 'EncargadoClientes' && (
          <Button 
            onClick={() => router.push('/nominas')}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Nómina
          </Button>
        )}
      </div>
    </div>
  );
}