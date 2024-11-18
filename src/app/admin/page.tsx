"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export default function Admin() {
  const [vendedorName, setVendedorName] = useState("");
  const [repartidorName, setRepartidorName] = useState("");
  const [openVendedorDialog, setOpenVendedorDialog] = useState(false); // Estado para controlar la visibilidad del diálogo de Vendedor
  const [openRepartidorDialog, setOpenRepartidorDialog] = useState(false); // Estado para controlar la visibilidad del diálogo de Repartidor

  // Manejo del registro de vendedores
  const handleRegisterVendedor = async () => {
    if (!vendedorName) {
      alert("Por favor ingresa un nombre para el vendedor.");
      return;
    }

    try {
      await addDoc(collection(db, "Vendedores"), { Nombre: vendedorName });
      alert("Vendedor registrado con éxito.");
      setVendedorName(""); // Limpiar el campo después de registrar
      setOpenVendedorDialog(false); // Cerrar el diálogo de vendedor automáticamente
    } catch (error) {
      console.error("Error al registrar vendedor: ", error);
      alert("Hubo un error al registrar el vendedor.");
    }
  };

  // Manejo del registro de repartidores
  const handleRegisterRepartidor = async () => {
    if (!repartidorName) {
      alert("Por favor ingresa un nombre para el repartidor.");
      return;
    }

    try {
      await addDoc(collection(db, "Repartidores"), { Nombre: repartidorName });
      alert("Repartidor registrado con éxito.");
      setRepartidorName(""); // Limpiar el campo después de registrar
      setOpenRepartidorDialog(false); // Cerrar el diálogo de repartidor automáticamente
    } catch (error) {
      console.error("Error al registrar repartidor: ", error);
      alert("Hubo un error al registrar el repartidor.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sección Administrativa</h1>

      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold">Registrar Nuevo Usuario</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dialog para Vendedor */}
          <Dialog open={openVendedorDialog} onOpenChange={setOpenVendedorDialog}>
            <DialogTrigger asChild>
              <Button className="w-full">Registrar Nuevo Vendedor</Button>
            </DialogTrigger>
            <DialogContent className="bg-white p-6 rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Registrar Vendedor</DialogTitle>
                <DialogDescription>Por favor ingresa el nombre del nuevo vendedor.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vendedorName">Nombre del Vendedor</Label>
                  <Input
                    id="vendedorName"
                    type="text"
                    value={vendedorName}
                    onChange={(e) => setVendedorName(e.target.value)}
                    required
                    className="mt-2"
                  />
                </div>
              </div>
              <CardFooter>
                <Button onClick={handleRegisterVendedor} className="w-full mt-4">Registrar</Button>
              </CardFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog para Repartidor */}
          <Dialog open={openRepartidorDialog} onOpenChange={setOpenRepartidorDialog}>
            <DialogTrigger asChild>
              <Button className="w-full">Registrar Nuevo Repartidor</Button>
            </DialogTrigger>
            <DialogContent className="bg-white p-6 rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Registrar Repartidor</DialogTitle>
                <DialogDescription>Por favor ingresa el nombre del nuevo repartidor.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="repartidorName">Nombre del Repartidor</Label>
                  <Input
                    id="repartidorName"
                    type="text"
                    value={repartidorName}
                    onChange={(e) => setRepartidorName(e.target.value)}
                    required
                    className="mt-2"
                  />
                </div>
              </div>
              <CardFooter>
                <Button onClick={handleRegisterRepartidor} className="w-full mt-4">Registrar</Button>
              </CardFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
