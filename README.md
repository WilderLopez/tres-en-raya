# Tres en Raya

El clásico 3 en raya como app de escritorio para **Windows** y **macOS** (Electron).
Modo 2 jugadores o contra la CPU, marcador que se guarda entre sesiones y tema claro/oscuro automático.

## Jugar

| Acción | Ratón | Teclado |
| --- | --- | --- |
| Poner ficha | Clic en la casilla | `1`–`9` (de izquierda a derecha, de arriba abajo) |
| Nueva partida | Botón «Nueva partida» | `N` o `Ctrl/Cmd + N` |
| Reiniciar marcador | Botón «Reiniciar marcador» | `Ctrl/Cmd + Shift + N` |
| Cambiar modo | Selector superior | `Ctrl/Cmd + 1` (2 jugadores) · `Ctrl/Cmd + 2` (vs CPU) |

En Windows el menú se muestra al pulsar `Alt`.

## Desarrollo

```bash
npm install      # instala dependencias
npm start        # abre el juego en modo desarrollo
npm run icon     # regenera build/icon.png desde build/icon.svg
```

`src/index.html` también funciona abierto directamente en un navegador.

## Generar instaladores

```bash
npm run dist:mac   # dist/Tres en Raya-<versión>-universal.dmg (Apple Silicon + Intel)
npm run dist:win   # dist/Tres-en-Raya-Setup-<versión>.exe y dist/Tres-en-Raya-Portable-<versión>.exe
npm run dist       # ambos
```

Desde macOS se pueden generar los dos (para Windows se usa wine, instalado con Homebrew).

## Primera apertura (apps sin firma de desarrollador)

Los instaladores no están firmados con un certificado de pago, así que cada sistema avisa la primera vez:

- **macOS:** si dice que la app «está dañada» o «no se puede abrir», ejecuta una vez
  `xattr -cr "/Applications/Tres en Raya.app"`, o ve a *Ajustes del Sistema → Privacidad y seguridad → Abrir igualmente*.
- **Windows:** en el aviso de SmartScreen pulsa *Más información → Ejecutar de todas formas*.

Para distribuirlo sin avisos hace falta un Apple Developer ID (con notarización) y un certificado de firma de código para Windows.
