export interface AppConfig {
  userEmail?: string;
  azure: {
    pat: string;
    organization: string;
    project: string;
    areaPath?: string;
    iterationPath?: string;
    team?: string;
  };
  ai: {
    provider: 'openai' | 'gemini';
    apiKey: string;
    model: string;
  };
  sharePoint?: {
    siteUrl: string;       // Ej: https://tuempresa.sharepoint.com/sitio/subsitio
    listPath: string;      // Ej: /sitio/subsitio/Evidencias CMMI
    releasesFolder: string;// Ej: /sitio/subsitio/Evidencias CMMI/Releases
    viewId?: string;       // GUID de la vista (opcional)
  };
  sprintTaskTemplate?: SprintTaskTemplate;
  workItemPrefixes?: WorkItemPrefixes;
  metricsApiUrl?: string; // Backend de histórico (ej. https://servidor/api/analysis). Vacío = solo local
  saao?: SaaoConfig;
  ganttStageRules?: GanttStageRule[];
}

/**
 * Regla para clasificar una tarea del Gantt en una etapa según su título.
 * Se evalúan en orden; gana la primera cuyo keyword aparezca en el título.
 * Un keyword con "+" exige que todas sus partes aparezcan (ej. "pruebas funcionales+isw").
 */
export interface GanttStageRule {
  stage: string;
  label: string;
  role: 'developer' | 'reviewer' | 'qa';
  keywords: string[];
}

export interface SaaoConfig {
  url: string;                // Base URL de SAAO (sin /MacrotareaForm)
  projectCode: string;        // Proyecto SAAO donde viven los Big Rocks (ej. PMD00001)
  macroTitlePrefix: string;   // Prefijo de Macrotareas (ej. "Mi Proyecto" -> "Mi Proyecto>Release #1>...")
  bigRockResponsible: string; // Usuario SAAO responsable de los Big Rocks
  collaborators: string[];    // Colaboradores para asignación y filtros
}

export interface WorkItemPrefixes {
  requirement: string;
  feature: string;
  bug: string;
}

export interface DevTaskTemplateItem {
  id: number;
  name: string;
  percentage: number;
}

export interface TimedTaskTemplateItem {
  id: number;
  name: string;
  originalStimated: number;
}

export interface SprintTaskTemplate {
  devTasks: DevTaskTemplateItem[];
  testingTasks: TimedTaskTemplateItem[];
  otherTasks: TimedTaskTemplateItem[];
}
