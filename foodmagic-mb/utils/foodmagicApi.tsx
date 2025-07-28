import { Platform } from 'react-native';
const BASE_URL = 'http://localhost:8000/api';

export async function processImageApi(imageUri: string): Promise<string> {
  const formData = new FormData();

  if (Platform.OS === 'web') {
    // imageUri es base64 en web
    // Convierte base64 a blob
    const res = await fetch(imageUri);
    const blob = await res.blob();
    formData.append('file', blob, 'photo.jpg');
  } else {
    // En móvil, usa uri
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);
  }

  const response = await fetch(`${BASE_URL}/process-image/`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return typeof data === 'string' ? data : '';
}

export async function suggestRecipesApi(ingredients: string[]): Promise<any> {
  const response = await fetch(`${BASE_URL}/suggest-recipes/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ingredients),
  });
  return await response.json();
}