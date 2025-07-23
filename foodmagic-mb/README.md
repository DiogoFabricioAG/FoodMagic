# FoodMagic 🍽️

Una aplicación móvil para descubrir recetas, restaurantes y experiencias culinarias increíbles.

## Tecnologías utilizadas

- **React Native** con **Expo**
- **TypeScript** para tipado estático
- **Expo Router** para navegación file-based
- **Expo Vector Icons** para iconografía

## Inicio rápido

1. Instalar dependencias

   ```bash
   npm install
   ```

2. Iniciar la aplicación

   ```bash
   npx expo start
   ```

3. Abrir en tu dispositivo:
   - Escanea el código QR con **Expo Go** (Android/iOS)
   - Presiona **a** para Android emulator
   - Presiona **i** para iOS simulator
   - Presiona **w** para web

## Estructura del proyecto

```
app/
├── (tabs)/
│   ├── index.tsx      # Pantalla de inicio
│   └── explore.tsx    # Pantalla de exploración
├── _layout.tsx        # Layout principal
└── +not-found.tsx     # Pantalla 404

components/            # Componentes reutilizables
constants/            # Constantes y configuración
hooks/               # Custom hooks
```

## Desarrollo

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
