# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es

Single-page app (React 18.2 + Vite, sin router ni backend) para que los invitados al Bautismo y 1° Cumple de Oli escaneen un QR, escriban su nombre y vean su número de mesa y compañeros. Deploy en Vercel (`vercel.json` ya configurado, SPA rewrite incluido). Idioma del código, comentarios y UI: español.

`HANDOFF.md` tiene el contexto completo del proyecto: estado, próximos pasos (assets del cartel, prueba en celular, deploy, QR) e ideas opcionales. Leerlo antes de iterar.

## Comandos

Package manager: **pnpm** (declarado en `packageManager`, Node 24.x).

```bash
pnpm install
pnpm dev        # servidor de desarrollo Vite
pnpm build      # build a dist/
pnpm preview    # servir el build local
pnpm qr <url>   # genera public/qr-oli.png y .svg apuntando a la URL publicada
```

No hay tests, linter ni typechecker configurados. Verificación = `pnpm build` pasa + probar el flujo en el navegador con `pnpm dev`.

## Arquitectura

Tres archivos de código, todo en `src/`:

- `src/guests.json` — la fuente de datos: array de `{ "nombre": string, "mesa": number }` (63 invitados en 12 mesas). Cada fila es un renglón del cartel (puede ser "Fulano y Familia"). Editar este archivo es el mantenimiento habitual.
- `src/search.js` — lógica pura de búsqueda, sin React. `buildIndex()` normaliza los nombres una vez (minúsculas, sin tildes vía NFD, espacios colapsados). `searchGuests()` puntúa: prefijo en la primera palabra (3) > prefijo en cualquier palabra (2) > substring (1). `tableMates()` lista los demás de la misma mesa.
- `src/App.jsx` — único componente. Dos estados de UI excluyentes: buscador con autocompletado (`selected === null`) o resultado con mesa + compañeros. `src/main.jsx` solo monta.

`scripts/generate-qr.mjs` es un script standalone (usa la dev-dependency `qrcode`); el color rosa `#d98aa0` hardcodeado ahí es el de la invitación, igual que la paleta de `src/styles.scss`.

## Convenciones

- Indentación de 4 espacios en todo el código.
- SCSS con BEM ligero (`.result__number`, `.suggestions__item`) y colores/tipografías centralizados en las variables de arriba de `src/styles.scss` — ajustar estética tocando variables, no valores sueltos.
- La lógica de `src/search.js` ya está probada contra los nombres reales: no reescribirla salvo pedido explícito.

## Restricciones

- La búsqueda debe seguir ignorando mayúsculas, tildes y espacios, y matchear por cualquier palabra de la fila (priorizando la primera) — es el contrato descrito en el README para que "pepito" encuentre "Pepito y Familia".
- Es una app de un solo uso para un evento: mantener el alcance mínimo, sin dependencias ni abstracciones nuevas salvo pedido explícito.
