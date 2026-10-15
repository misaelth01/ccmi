import { Injectable } from '@angular/core';
import { AppConfig, SaaoConfig, SprintTaskTemplate, WorkItemPrefixes } from '../models/config.model';

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
