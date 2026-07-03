# Handoff para Claude Code — Proyecto "Mesas · Oli"

Este archivo resume el objetivo, el estado actual y qué falta. Leelo antes de
empezar a iterar. El código base ya está creado y el build ya compila.

## Objetivo

Web mobile-first para un evento: **Bautismo + 1° Cumpleaños de "Oli"** (misma
fiesta, mismo día). Los invitados escanean un **QR** en el cartel de bienvenida,
se abre esta web, escriben su nombre y ven **su número de mesa** y **con quiénes
comparten mesa**. Nada de login ni backend: es una SPA estática con la lista de
invitados embebida.

## Sobre mí (el dev) y el stack

Soy desarrollador. Trabajo habitualmente con **React 18.2, Vite, pnpm y deploy
en Vercel**, formato de indentación 4 espacios, SCSS con variables. Este
proyecto ya está armado con esas convenciones — mantenelas. No hace falta que me
expliques conceptos básicos; podés ir directo a los cambios de código.

- React 18.2.0 + react-dom 18.2.0
- Vite 8.1.2 + @vitejs/plugin-react 6.0.0
- Sass 1.82.0 (SCSS)
- pnpm 11.9 / Node 24.x
- Deploy: Vercel (hay `vercel.json` con framework vite + rewrite SPA)

## Estructura actual

```
mesas-oli/
├── index.html              # entry, carga fuentes (Dancing Script + Quicksand)
├── vite.config.js
├── vercel.json
├── package.json            # deps + script "qr"
├── README.md
├── HANDOFF.md              # este archivo
├── scripts/
│   └── generate-qr.mjs     # genera el QR apuntando a la URL de Vercel
└── src/
    ├── main.jsx
    ├── App.jsx             # UI: buscador, autocomplete y pantalla de resultado
    ├── search.js           # LÓGICA de búsqueda (normalización + matcheo) — testeada
    ├── styles.scss         # estilos, con variables de color arriba de todo
    └── guests.json         # DATOS: 63 invitados [{ nombre, mesa }]
```

## Lo que YA está resuelto (no reescribir salvo pedido explícito)

- **`src/search.js`** — lógica probada contra los 63 nombres reales:
  - `normalize()`: minúsculas, saca tildes/diacríticos, colapsa espacios.
  - `searchGuests()`: matchea por **cualquier palabra de la fila**, priorizando
    la primera palabra. Ej: "pepito" encuentra "Pepito y Familia"; "familia"
    también lo encuentra. Insensible a mayúsculas, tildes y espacios de más.
  - `tableMates()`: devuelve los otros invitados de la misma mesa.
- **Flujo de UI en `App.jsx`**: input → dropdown de sugerencias en vivo → al
  elegir muestra "¡Hola, {nombre}!", el número de mesa en grande, el nombre
  completo de la fila, y la lista de compañeros de mesa. Botón "Buscar otro
  nombre" para resetear.
- **Estética base** en `styles.scss`, con la paleta de la invitación (rosa
  #d98aa0 / #e9a7ba / #f7d9df, crema). Colores y tipografías centralizados en
  variables SCSS arriba del archivo.
- **Build verificado**: `vite build` compila sin errores.

## Lo que FALTA / próximos pasos (orden sugerido)

1. **Levantar dev server**: `pnpm install && pnpm dev`. Trabajar con el navegador
   abierto para ver cambios en vivo.
2. **Estética fina**: agregar al header la **foto de Oli** y la **cervatilla**
   del cartel (assets a poner en `public/`). Ajustar animaciones, tamaños,
   espaciados a gusto. Tocar preferentemente las **variables SCSS**, no valores
   sueltos.
3. **Probar en el celular**: mismo wifi, entrar por la IP/URL de red que imprime
   Vite. Validar tap en sugerencias, teclado, tamaños.
4. **Deploy a Vercel**: importar el repo o `vercel` por CLI. Detecta Vite solo.
5. **Generar el QR**: con la URL final, `pnpm qr https://<mi-url>.vercel.app`.
   Genera `public/qr-oli.png` y `.svg` en el rosa de la invitación, para el cartel.

## Ideas opcionales que puedo pedir

- Si el nombre no aparece: botón de WhatsApp a la organizadora.
- Recordar la última búsqueda (localStorage).
- Foto de fondo suave / marco floral como en la invitación.
- Micro-confetti o corazoncito al mostrar la mesa.

## Datos y convenciones importantes

- La lista viva es **`src/guests.json`**. Cada objeto = un renglón del cartel:
  `{ "nombre": "Jonathan Garcia y Familia", "mesa": 1 }`. Editar acá si cambian
  invitados o mesas. Son 63 invitados en 12 mesas.
- **Ojo dato**: en el Excel original la fila de la mesa 10 dice "Giuiano
  Miralles" (typo, falta la "l"). Lo dejé tal cual; corregilo en `guests.json`
  si corresponde.
- No hay backend ni secrets. Todo es estático. La única "config" externa es la
  URL de Vercel para el QR.
- Mantener indentación de 4 espacios y el estilo de nombres de clases tipo BEM
  ligero que ya usa el SCSS (`.result__number`, `.suggestions__item`, etc.).

## Comandos

```bash
pnpm install          # instalar
pnpm dev              # desarrollo
pnpm build            # build de producción (dist/)
pnpm preview          # previsualizar el build
pnpm qr <url>         # generar el QR apuntando a la URL de Vercel
```
