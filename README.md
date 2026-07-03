# Mesas · Oli 🦌

Web para que los invitados al **Bautismo y 1° Cumple de Oli** escaneen el QR,
escriban su nombre y vean **su número de mesa y con quiénes están sentados**.

Stack: React 18.2 + Vite + pnpm, pensado para deploy en Vercel.

## Cómo funciona

- La lista de invitados vive en `src/guests.json` (`nombre` + `mesa`).
- El invitado escribe su nombre → aparece un autocompletado.
- La búsqueda ignora **mayúsculas, tildes y espacios**, y matchea por
  **cualquier palabra de la fila** (prioriza la primera). Así "pepito"
  encuentra "Pepito y Familia".
- Al elegir su fila ve la mesa en grande + los compañeros de esa mesa.

## Desarrollo

```bash
pnpm install
pnpm dev
```

## Editar la lista de invitados

Editá `src/guests.json`:

```json
[
  { "nombre": "Maria Diaz", "mesa": 2 },
  { "nombre": "Jonathan Garcia y Familia", "mesa": 1 }
]
```

Cada fila = un renglón del cartel. Podés poner "Fulano y Familia" y se busca
igual por "Fulano".

## Deploy a Vercel

```bash
pnpm build            # opcional, para probar local: pnpm preview
```

1. Subí el repo a GitHub e importalo en Vercel (detecta Vite solo), **o** corré
   `vercel` con la CLI.
2. Vercel te da una URL, ej: `https://mesas-oli.vercel.app`.

## Generar el QR

Una vez que tengas la URL de Vercel:

```bash
pnpm qr https://mesas-oli.vercel.app
```

Genera `public/qr-oli.png` y `public/qr-oli.svg` (en el rosa de la invitación),
listos para pegar en el cartel de bienvenida.
