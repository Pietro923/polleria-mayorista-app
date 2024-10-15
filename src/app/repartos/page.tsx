"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";

// Icono para el marcador
const customMarker = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function RepartoForm() {
  const [repartidor, setRepartidor] = useState("");
  const [direccion, setDireccion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const position: LatLngExpression = [-26.8241, -65.2226]; // Coordenadas de San Miguel de Tucumán

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ repartidor, direccion, fechaEntrega, position });
    setRepartidor("");
    setDireccion("");
    setFechaEntrega("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Registrar Reparto</h1>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Nuevo Reparto</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="repartidor">Repartidor:</Label>
              <Input
                id="repartidor"
                value={repartidor}
                onChange={(e) => setRepartidor(e.target.value)}
                placeholder="Nombre del repartidor"
                required
              />
            </div>

            <div>
              <Label htmlFor="direccion">Dirección de Entrega:</Label>
              <Input
                id="direccion"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Dirección de entrega"
                required
              />
            </div>

            <div>
              <Label htmlFor="fechaEntrega">Fecha de Entrega:</Label>
              <Input
                id="fechaEntrega"
                type="date"
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                required
              />
            </div>

            <Button type="submit">Registrar Reparto</Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="w-full h-64 mt-4">
            <MapContainer
              center={position}
              zoom={13}
              scrollWheelZoom={false}
              className="h-full w-full rounded-md"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position} icon={customMarker} />
            </MapContainer>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
