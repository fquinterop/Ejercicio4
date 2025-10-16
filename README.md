# Ejemplo4 - Recipe Box (sorpresa)

Esta aplicación es una "Recipe Box" (gestor de recetas) hecha con HTML, TailwindCSS (CDN) y JavaScript puro. Usa MockAPI (mockapi.io) como backend para almacenar recetas.

Características
- Listar recetas
- Crear, editar y borrar recetas (CRUD) usando MockAPI
- Buscar por título
- Marcar recetas como favoritas

Archivos
- `index.html` — Interfaz con formulario y listado.
- `app.js` — Lógica para consumir MockAPI y manipular la UI.

Cómo usar
1. Entra a https://mockapi.io/ y crea un recurso `recipes`.
2. Copia la URL del endpoint y pégala en `Ejemplo4/app.js` en la constante `MOCKAPI_RECIPES_URL`.
3. Abre `Ejemplo4/index.html` en el navegador.

Ejemplo de objeto recipe (MockAPI):

```json
{
  "id": 1,
  "title": "Tarta de manzana",
  "img": "https://images.unsplash.com/photo-1512058564366-c9e3a0b1e7f1",
  "ingredients": ["Manzanas", "Harina", "Azúcar"],
  "steps": "Mezclar y hornear.",
  "fav": false
}
```

