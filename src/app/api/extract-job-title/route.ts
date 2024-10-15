import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio"; // Para analizar HTML

export async function GET(req: Request) {
  try {
    // Obtener los parámetros de la URL
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "URL no proporcionada" }, { status: 400 });
    }

    // Hacer una solicitud HTTP para obtener la página de LinkedIn
    const response = await axios.get(url);
    const html = response.data;

    // Usar cheerio para extraer el título y la descripción
    const $ = cheerio.load(html);
    const jobTitle = $("title").text(); // Extraer el título
    
    // Intentar encontrar la descripción en diferentes elementos
    let jobDescription = $(".job-details-module__content").text().trim();

    // Si no se encuentra en ese div, buscar en otros posibles lugares
    if (!jobDescription) {
      jobDescription = $("section.description").text().trim();
    }

    if (!jobDescription) {
      jobDescription = $("div.description").text().trim();
    }

    if (!jobDescription) {
      jobDescription = $("section").text().trim();
    }

    if (!jobDescription) {
      jobDescription = "Descripción no disponible"; // Si no se encuentra nada
    }
    
    return NextResponse.json({ title: jobTitle, description: jobDescription });
  } catch (error) {
    console.error("Error al extraer el título y la descripción:", error);
    return NextResponse.json({ error: "No se pudo extraer la descripción" }, { status: 500 });
  }
}