import { Injectable } from '@angular/core';
import { AppConfig, GanttStageRule, SaaoConfig, SprintTaskTemplate, WorkItemPrefixes } from '../models/config.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly STORAGE_KEY = 'cmmi5_analyzer_config';

  getDefaultSprintTaskTemplate(): SprintTaskTemplate {
    return {
      devTasks: [
        { id: 0, name: 'Entendimiento', percentage: 2 },
        { id: 1, name: 'Elaboración de código', percentage: 80 },
        { id: 3, name: 'Review', percentage: 3 },
        { id: 4, name: 'Peer Review', percentage: 3 },
        { id: 5, name: 'Pruebas funcionales ISW', percentage: 10 },
        { id: 6, name: 'Posmortem', percentage: 2 },
        { id: 7, name: 'Corrección de defectos de Peer Review', percentage: 0 },
        { id: 7, name: 'Corrección de defectos de pruebas ISW', percentage: 0 }
      ],
      testingTasks: [
        { id: 1, name: 'Diseño de pruebas', originalStimated: 0 },
        { id: 2, name: 'Ejecución de pruebas', originalStimated: 0 },
        { id: 3, name: 'Registro de defectos', originalStimated: 0 },
        { id: 4, name: 'Peer Review de especificación', originalStimated: 0 },
        { id: 4, name: 'Peer Review Test', originalStimated: 0 }
      ],
      otherTasks: [
        { id: 0, name: 'Análisis', originalStimated: 0 },
        { id: 1, name: 'Especificación', originalStimated: 0 },
        { id: 7, name: 'Integración UAT', originalStimated: 0 },
        { id: 8, name: 'Documentación', originalStimated: 0 },
        { id: 9, name: 'Video capacitación', originalStimated: 0 }
      ]
    };
  }

  getDefaultWorkItemPrefixes(): WorkItemPrefixes {
    return { requirement: 'REQ', feature: 'FEATURE', bug: 'BUG' };
  }

  getWorkItemPrefix(type: string): string {
    const prefixes = { ...this.getDefaultWorkItemPrefixes(), ...this.getConfig()?.workItemPrefixes };
    const normalized = type.trim().toLowerCase();
    if (normalized === 'feature') return prefixes.feature;
    if (normalized === 'bug') return prefixes.bug;
    return prefixes.requirement;
  }

  getDefaultSaaoConfig(): SaaoConfig {
    return {
      url: 'https://saao.blueoceantech.com.mx',
      projectCode: '',
      macroTitlePrefix: '',
      bigRockResponsible: '',
      collaborators: []
    };
  }

  getSaaoConfig(): SaaoConfig {
    const saao = { ...this.getDefaultSaaoConfig(), ...this.getConfig()?.saao };
    saao.url = (saao.url || '').trim().replace(/\/+$/, '');
    return saao;
  }

  getDefaultGanttStageRules(): GanttStageRule[] {
    return [
      { stage: 'reviewer-peer-test', label: 'Peer Review de pruebas', role: 'reviewer', keywords: ['peer review test'] },
      {
        stage: 'kickoff', label: 'Kickoff', role: 'developer',
        keywords: [
          'registrar sprint en azure', 'elaborar presentacion de sprint planning', 'elaborar presentacion del sprint planning',
          'reunion evaluacion de riesgos', 'reunion de evaluacion de riesgos', 'presentacion de work items', 'reunion de sprint planning'
        ]
      },
      { stage: 'daily-scrum', label: 'Daily Scrum', role: 'developer', keywords: ['daily scrum sprint'] },
      {
        stage: 'closing', label: 'Cierre', role: 'developer',
        keywords: [
          'generar paquete de liberacion', 'enviar correo de finalizacion de dev sprint',
          'enviar correo de finalizacion de testing sprint', 'validar informacion registrada del sprint'
        ]
      },
      { stage: 'design-tests', label: 'Diseño de pruebas', role: 'developer', keywords: ['diseno de pruebas'] },
      { stage: 'dev-spec-peer', label: 'Peer Review de especificación', role: 'developer', keywords: ['peer review de especificacion'] },
      { stage: 'dev-analysis', label: 'Análisis', role: 'developer', keywords: ['analisis'] },
      { stage: 'dev-coding', label: 'Elaboración de código', role: 'developer', keywords: ['elaboracion de codigo'] },
      { stage: 'reviewer-peer', label: 'Peer Review', role: 'reviewer', keywords: ['peer review'] },
      { stage: 'dev-review', label: 'Review', role: 'developer', keywords: ['review'] },
      { stage: 'post-review-isw', label: 'Pruebas funcionales ISW', role: 'developer', keywords: ['pruebas funcionales+isw'] },
      { stage: 'qa-execution', label: 'Ejecución de pruebas', role: 'qa', keywords: ['ejecucion de pruebas'] },
      { stage: 'qa-defects', label: 'Registro de defectos', role: 'qa', keywords: ['registro de defectos'] }
    ];
  }

  getGanttStageRules(): GanttStageRule[] {
    const saved = this.getConfig()?.ganttStageRules;
    return saved && saved.length > 0 ? saved : this.getDefaultGanttStageRules();
  }

  getConfig(): AppConfig | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return null;
    const config = JSON.parse(data) as AppConfig;
    if (!config.sprintTaskTemplate) {
      config.sprintTaskTemplate = this.getDefaultSprintTaskTemplate();
    }
    return config;
  }

  saveConfig(config: AppConfig): void {
    if (!config.sprintTaskTemplate) {
      config.sprintTaskTemplate = this.getDefaultSprintTaskTemplate();
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
  }

  hasConfig(): boolean {
    const config = this.getConfig();
    return !!(config?.azure.pat && config?.ai.apiKey);
  }
}
