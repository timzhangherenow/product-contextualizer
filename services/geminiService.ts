import { GoogleGenAI } from "@google/genai";
import { ProductConfig } from "../types";

// Helper to convert File to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the Data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = error => reject(error);
  });
};

export const generateProductContext = async (
  imageFile: File,
  config: ProductConfig
): Promise<string> => {
  // 1. Initialize API Client
  // Important: We instantiate here to ensure we capture the latest process.env.API_KEY
  // which might have been set by the aistudio key selector.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 2. Prepare Image Data
  const base64Image = await fileToBase64(imageFile);

  // 3. Construct Prompt
  // Handle optional region. Default to "Global" if not provided.
  const region = config.region.trim() || "Global";

  // We explicitly guide the model to perform product placement/contextualization.
  const prompt = `
    This is a product image. 
    Task: Generate a high-quality, photorealistic lifestyle image featuring this product.
    
    Context Details:
    - Target Market/Region Style: ${region}
    - Usage Scenario: ${config.scenario}
    
    Instructions:
    - Seamlessly integrate the product into the environment.
    - Ensure lighting, shadows, and perspective match the generated background.
    - Keep the product as the main focal point.
    - The aesthetic should appeal to customers in ${region}.
  `;

  // 4. Call the API (Gemini 3 Pro Image Preview)
  // This model supports high resolution (1K, 2K, 4K) via imageConfig.
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: imageFile.type,
              data: base64Image,
            },
          },
        ],
      },
      config: {
        imageConfig: {
          imageSize: config.resolution, // '1K', '2K', or '4K'
          aspectRatio: "1:1", // Defaulting to square for consistency, could be made configurable
        },
      },
    });

    // 5. Extract Result
    // Iterate through parts to find the image data.
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data found in response.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Handle the specific "Requested entity was not found" error for API keys
    if (error.message && error.message.includes("Requested entity was not found")) {
       throw new Error("API_KEY_INVALID");
    }
    throw error;
  }
};