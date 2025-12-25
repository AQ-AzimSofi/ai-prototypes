// Persona definitions
export type PersonaType = "general" | "novel";

export interface Persona {
  id: PersonaType;
  name: string;
  description: string;
  icon: "FileText" | "BookOpen";
}

export const PERSONAS: Record<PersonaType, Persona> = {
  general: {
    id: "general",
    name: "General RAG",
    description: "Upload a document and ask questions about its contents",
    icon: "FileText",
  },
  novel: {
    id: "novel",
    name: "Novel Assistant",
    description: "Get help understanding your novel series without spoilers",
    icon: "BookOpen",
  },
};

// Document metadata for general mode
export interface DocumentInfo {
  id: string;
  filename: string;
  pageCount: number;
  chunkCount: number;
}

// Volume metadata for novel mode
export interface VolumeInfo extends DocumentInfo {
  volumeNumber: number;
  seriesName?: string;
}

// Chat context passed to API
export interface ChatContext {
  persona: PersonaType;
  // General mode
  documentContext?: string;
  // Novel mode
  currentVolume?: number;
}

// Upload API request
export interface UploadRequest {
  persona: PersonaType;
  volumeNumber?: number;
  seriesName?: string;
}

// Upload API response
export interface UploadResponse {
  success: boolean;
  document: DocumentInfo | VolumeInfo;
  context?: string; // Full context for general mode
  error?: string;
}
