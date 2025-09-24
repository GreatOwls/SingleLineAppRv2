import type { DiagramData, ComponentTypeDefinition } from '../types';

export interface PersistedAppState {
  diagramData: DiagramData;
  componentTypes: ComponentTypeDefinition[];
}

const API_BASE = '/api';

const isPersistedAppState = (value: unknown): value is PersistedAppState => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;
  if (!record.diagramData || typeof record.diagramData !== 'object') {
    return false;
  }

  if (!Array.isArray((record.diagramData as DiagramData).nodes) || !Array.isArray((record.diagramData as DiagramData).links)) {
    return false;
  }

  if (!Array.isArray(record.componentTypes)) {
    return false;
  }

  return true;
};

export const storageService = {
  async load(): Promise<PersistedAppState | null> {
    try {
      const response = await fetch(`${API_BASE}/diagram`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.status === 204) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`Failed to load diagram (${response.status})`);
      }

      const payload = await response.json();
      if (!isPersistedAppState(payload)) {
        throw new Error('Unexpected payload shape while loading diagram');
      }

      return payload;
    } catch (error) {
      console.error('storageService.load failed', error);
      return null;
    }
  },

  async save(state: PersistedAppState): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/diagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(state),
      });

      if (!response.ok) {
        throw new Error(`Failed to save diagram (${response.status})`);
      }
    } catch (error) {
      console.error('storageService.save failed', error);
      throw error;
    }
  },
};
