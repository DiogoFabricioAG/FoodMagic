# 🍲 FoodMagic

**FoodMagic** es una aplicación móvil que permite a los usuarios descubrir platillos peruanos basados en los ingredientes que ya tienen en casa. Usando inteligencia artificial y una arquitectura moderna, la app proporciona recetas detalladas y sugerencias personalizadas según el historial del usuario.

## 🧠 Descripción del Proyecto

FoodMagic busca ser un asistente culinario inteligente centrado en la gastronomía peruana. El usuario ingresa los ingredientes que tiene disponibles y la app genera sugerencias de platillos posibles, junto con sus recetas. Además, aprende del historial del usuario para brindar recomendaciones más personalizadas.

## 🚀 Funcionalidades Principales

1. **🔍 Recomendaciones de Platillos**

   * Detecta los ingredientes ingresados por el usuario y recomienda platillos peruanos.

2. **📖 Visualización de Recetas**

   * Recetas detalladas paso a paso para cada platillo sugerido.

3. **🧠 Recomendaciones Inteligentes**

   * Toma en cuenta el historial de recetas preparadas por el usuario para mejorar la experiencia.

---

## 🛠️ Tecnologías Utilizadas

* **React Native** – Para el desarrollo de la app móvil.
* **Supabase** – Backend (base de datos, autenticación y almacenamiento).
* **OpenAI GPT API** – Generación de recomendaciones inteligentes de recetas y texto adaptativo.

---

## 📦 Estructura del Proyecto

```
FoodMagic/
├── src/
│   ├── components/
│   ├── screens/
│   ├── services/
│   ├── utils/
│   └── assets/
├── supabase/
│   └── config.js
├── App.js
├── .env
└── README.md
```

---

## ⚙️ Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/foodmagic.git
```

2. Instala las dependencias:

```bash
cd foodmagic
npm install
```

3. Configura el archivo `.env`:

```
OPENAI_API_KEY=tu_clave_openai
SUPABASE_URL=tu_url_supabase
SUPABASE_ANON_KEY=tu_key_anonima
```

4. Ejecuta la app en modo desarrollo:

```bash
npx expo start
```

---

## 🧪 Estado Actual

🚧 En desarrollo – Las funcionalidades principales están en proceso de integración.

---

## 🌟 Próximas Características

* Reconocimiento de ingredientes usando la cámara (visión por computadora).
* Guardado de recetas favoritas.
* Modo offline con recetas precargadas.
* Notificaciones de sugerencia diaria.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](./LICENSE) para más detalles.
