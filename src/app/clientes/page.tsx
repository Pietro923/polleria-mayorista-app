"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { db } from "@/lib/firebaseConfig"; // Importa la configuración de Firebase
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, increment } from "firebase/firestore";

// Definir la interfaz Cliente
interface Cliente {
  id: number;
  nombreCliente: string;
  emailCliente: string;
  telefonoCliente: string;
  direccionCliente: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nombreCliente, setNombreCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");
  const [direccionCliente, setDireccionCliente] = useState("");
  const [clienteEditado, setClienteEditado] = useState<Cliente | null>(null);

  // Obtener la colección de clientes desde la base de datos
  useEffect(() => {
    const obtenerClientes = async () => {
      const querySnapshot = await getDocs(collection(db, "Clientes"));
      const clientesObtenidos: Cliente[] = [];
      querySnapshot.forEach((doc) => {
        clientesObtenidos.push(doc.data() as Cliente);
      });
      setClientes(clientesObtenidos);
    };

    obtenerClientes();
  }, []);

  // Función para obtener y actualizar el LastId en la colección counters
  const obtenerNuevoId = async () => {
    const docRef = doc(db, "counters", "ClientesCounters");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const lastId = docSnap.data().LastId;

      // Actualizar el LastId para el siguiente uso
      await updateDoc(docRef, {
        LastId: increment(1),
      });

      return lastId + 1; // Devuelve el nuevo ID incrementado
    } else {
      throw new Error("El documento ClientesCounters no existe.");
    }
  };

  // Función para agregar un nuevo cliente
  const agregarCliente = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const nuevoId = await obtenerNuevoId(); // Obtener el ID autoincremental

      const nuevoCliente: Cliente = {
        id: nuevoId,
        nombreCliente,
        emailCliente,
        telefonoCliente,
        direccionCliente,
      };

      await setDoc(doc(db, "Clientes", nuevoId.toString()), nuevoCliente);
      setClientes([...clientes, nuevoCliente]);
      
      // Resetear los campos del formulario
      setNombreCliente("");
      setEmailCliente("");
      setTelefonoCliente("");
      setDireccionCliente("");
    } catch (error) {
      console.error("Error al agregar cliente con ID autoincremental: ", error);
    }
  };

  // Función para editar un cliente
  const editarCliente = (index: number) => {
    const cliente = clientes[index];
    setClienteEditado(cliente);
    setNombreCliente(cliente.nombreCliente);
    setEmailCliente(cliente.emailCliente);
    setTelefonoCliente(cliente.telefonoCliente);
    setDireccionCliente(cliente.direccionCliente);
  };

  // Función para guardar los cambios al editar un cliente
  const guardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();

    if (clienteEditado) {
      const clienteActualizado: Cliente = {
        ...clienteEditado,
        nombreCliente,
        emailCliente,
        telefonoCliente,
        direccionCliente,
      };

      try {
        await updateDoc(doc(db, "Clientes", clienteEditado.id.toString()), {
          nombreCliente: clienteActualizado.nombreCliente,
          emailCliente: clienteActualizado.emailCliente,
          telefonoCliente: clienteActualizado.telefonoCliente,
          direccionCliente: clienteActualizado.direccionCliente,
        });

        setClientes(
          clientes.map((cliente) =>
            cliente.id === clienteEditado.id ? clienteActualizado : cliente
          )
        );

        // Resetear campos y estado de edición
        setClienteEditado(null);
        setNombreCliente("");
        setEmailCliente("");
        setTelefonoCliente("");
        setDireccionCliente("");
      } catch (error) {
        console.error("Error al actualizar cliente: ", error);
      }
    }
  };

  // Función para eliminar un cliente
  const eliminarCliente = async (index: number) => {
    const cliente = clientes[index];
    try {
      // Eliminar el cliente de la base de datos
      await deleteDoc(doc(db, "Clientes", cliente.id.toString()));
      
      // Filtrar el cliente de la lista local (clientes) para actualizar la UI
      setClientes(clientes.filter((c) => c.id !== cliente.id));
    } catch (error) {
      console.error("Error al eliminar cliente: ", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Clientes</h1>

      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold">{clienteEditado ? "Editar Cliente" : "Agregar Cliente"}</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={clienteEditado ? guardarCambios : agregarCliente}>
            <div className="mb-4">
              <Label htmlFor="nombreCliente">Nombre del Cliente</Label>
              <Input
                id="nombreCliente"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="emailCliente">Email del Cliente</Label>
              <Input
                id="emailCliente"
                type="email"
                value={emailCliente}
                onChange={(e) => setEmailCliente(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="telefonoCliente">Teléfono del Cliente</Label>
              <Input
                id="telefonoCliente"
                value={telefonoCliente}
                onChange={(e) => setTelefonoCliente(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="direccionCliente">Dirección del Cliente</Label>
              <Input
                id="direccionCliente"
                value={direccionCliente}
                onChange={(e) => setDireccionCliente(e.target.value)}
                required
              />
            </div>
            <Button type="submit">{clienteEditado ? "Guardar Cambios" : "Agregar Cliente"}</Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Lista de Clientes</h2>
        {clientes.length > 0 ? (
          <div className="space-y-4">
            {clientes.map((cliente, index) => (
              <div
                key={cliente.id}
                className="flex items-center justify-between p-4 bg-white shadow-md rounded-md border border-gray-200"
              >
                <div className="flex-1">
                  <p className="text-lg font-medium">{cliente.nombreCliente}</p>
                  <p className="text-sm text-gray-600">Email: {cliente.emailCliente}</p>
                  <p className="text-sm text-gray-600">Teléfono: {cliente.telefonoCliente}</p>
                  <p className="text-sm text-gray-600">Dirección: {cliente.direccionCliente}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    className="text-sm"
                    onClick={() => editarCliente(index)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    className="text-sm"
                    onClick={() => eliminarCliente(index)}
                  >
                    Borrar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay clientes disponibles.</p>
        )}
      </div>
    </div>
  );
}
