import dotenv
dotenv.load_dotenv()

import os
import base64
import traceback
import json
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Procesar imagen y extraer ingredientes
async def process_image(file):
    try:
        contents = await file.read()
        base64_img = base64.b64encode(contents).decode("utf-8")

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Analiza la siguiente imagen de alimentos y extrae solo los nombres de los ingredientes que aparecen. Devuélvelos únicamente en español, como una lista de texto plano, separados por comas. No describas la imagen ni uses otro idioma que no sea español."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_img}",
                                "detail": "high"
                            }
                        }
                    ]
                }
            ],
            max_tokens=300
        )

        return response.choices[0].message.content

    except Exception as e:
        print("⚠️ ERROR AL PROCESAR IMAGEN:")
        traceback.print_exc()
        return {"error": str(e)}

# Sugerir recetas peruanas basadas en ingredientes
async def suggest_recipes(ingredients: list[str]):
    prompt = f"""Actúa como un chef peruano experto. A partir de los siguientes ingredientes: {', '.join(ingredients)}, genera recetas típicas peruanas que puedan prepararse con esos ingredientes o algunos adicionales comunes en casa.

Devuelve la respuesta **exclusivamente** en formato JSON como este ejemplo (no escribas nada fuera del JSON):

[
  {{
    "nombre": "Ají de gallina",
    "descripcion": "Plato típico limeño a base de pollo y ají amarillo.",
    "ingredientes": [
      "🐔 pollo desmenuzado",
      "🌶️ ají amarillo",
      "🥛 leche evaporada",
      "🥖 pan",
      "🧅 cebolla"
    ],
    "pasos": [
      "1. Remoja el pan en leche evaporada.",
      "2. Licúa con ají amarillo y cebolla.",
      "3. Cocina el pollo con la mezcla por 15 minutos."
    ]
  }}
]
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1000
        )

        result = response.choices[0].message.content.strip()
        print("🔍 Respuesta cruda del modelo:\n", result)

        # Extraer solo el JSON
        start = result.find("[")
        end = result.rfind("]") + 1
        return json.loads(result[start:end])

    except Exception as e:
        print("⚠️ ERROR AL GENERAR RECETAS:")
        traceback.print_exc()
        return {"error": "No se pudo decodificar la respuesta del modelo."}