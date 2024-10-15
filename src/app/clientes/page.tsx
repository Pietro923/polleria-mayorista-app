"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

// Definir la interfaz Cliente
interface Cliente {
  nombreCliente: string;
  emailCliente: string;
  telefonoCliente: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nombreCliente, setNombreCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");

  const agregarCliente = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoCliente: Cliente = { nombreCliente, emailCliente, telefonoCliente };
    setClientes([...clientes, nuevoCliente]);
    setNombreCliente("");
    setEmailCliente("");
    setTelefonoCliente("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Clientes</h1>

      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold">Agregar Cliente</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={agregarCliente}>
            <div className="mb-4">
              <Label htmlFor="nombreCliente">Nombre del Cliente</Label>
              <Input
                id="nombreCliente"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                placeholder="Nombre"
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="emailCliente">Correo Electrónico</Label>
              <Input
                id="emailCliente"
                type="email"
                value={emailCliente}
                onChange={(e) => setEmailCliente(e.target.value)}
                placeholder="Correo"
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="telefonoCliente">Teléfono</Label>
              <Input
                id="telefonoCliente"
                value={telefonoCliente}
                onChange={(e) => setTelefonoCliente(e.target.value)}
                placeholder="Teléfono"
                required
              />
            </div>
            <Button type="submit">Agregar Cliente</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Lista de Clientes</h2>
        </CardHeader>
        <CardContent>
          {clientes.length === 0 ? (
            <p>No hay clientes registrados aún.</p>
          ) : (
            <div className="space-y-4">
              {clientes.map((cliente, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold">{cliente.nombreCliente}</h3>
                  <p className="text-sm text-gray-600">📧 {cliente.emailCliente}</p>
                  <p className="text-sm text-gray-600">📞 {cliente.telefonoCliente}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            {clientes.length} {clientes.length === 1 ? "cliente" : "clientes"} registrado
            {clientes.length === 1 ? "" : "s"}.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
