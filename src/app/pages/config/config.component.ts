import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { AppConfig, DevTaskTemplateItem, GanttStageRule, TimedTaskTemplateItem } from '../../models/config.model';
import { LucideAngularModule, Save, ShieldCheck, Cpu, ClipboardList, ChevronDown, ChevronUp, Tag, Database, ListChecks } from 'lucide-angular';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
<div class="max-w-6xl mx-auto space-y-8 pt-4 md:pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
  <header>
    <h2 class="text-3xl font-bold text-slate-800 dark:text-white">Configuración del Sistema</h2>
    <p class="text-slate-500 dark:text-slate-400 mt-1">Administra tus credenciales de Azure DevOps e Inteligencia Artificial.</p>
  </header>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <!-- Azure DevOps Config -->
    <section class="glass-card space-y-6">
      <div class="flex items-center gap-3 text-indigo-500">
        <lucide-icon [name]="ShieldCheck" size="24"></lucide-icon>
        <h3 class="text-xl font-semibold">Azure DevOps</h3>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-semibold mb-1 opacity-90 text-indigo-600 dark:text-indigo-400">👤 Mi Correo / Usuario Colaborador (Guardado únicamente en Localhost)</label>
          <input [(ngModel)]="config.userEmail" type="text" placeholder="ej. tu.correo@empresa.com o tu usuario" class="glass-input w-full font-bold">
          <p class="text-[11px] text-slate-400 mt-1">Este correo se almacena de forma privada en tu navegador (localhost) para filtrar "Mis Tareas" en SAAO y Azure.</p>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 opacity-70">Organización</label>
          <input [(ngModel)]="config.azure.organization" type="text" placeholder="ej. mi-org" class="glass-input w-full">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 opacity-70">Proyecto</label>
          <input [(ngModel)]="config.azure.project" type="text" placeholder="ej. MiProyecto" class="glass-input w-full">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 opacity-70">Equipo por defecto (Opcional)</label>
          <input [(ngModel)]="config.azure.team" type="text" placeholder="ej. MiEquipo" class="glass-input w-full">
          <p class="text-[11px] text-slate-400 mt-1">Se preselecciona en Configurar Sprint. Si se deja vacío se usa el primer equipo del proyecto.</p>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 opacity-70">Personal Access Token (PAT)</label>
          <input [(ngModel)]="config.azure.pat" type="password" placeholder="Tu PAT de Azure" class="glass-input w-full">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 opacity-70">Area Path (Opcional)</label>
            <input [(ngModel)]="config.azure.areaPath" type="text" placeholder="ej. MiEquipo" class="glass-input w-full text-xs">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 opacity-70">Iteration Path (Opcional)</label>
            <input [(ngModel)]="config.azure.iterationPath" type="text" placeholder="ej. Sprint 1" class="glass-input w-full text-xs">
          </div>
        </div>
      </div>
    </section>

    <!-- AI Config -->
    <section class="glass-card space-y-6">
      <div class="flex items-center gap-3 text-purple-500">
        <lucide-icon [name]="Cpu" size="24"></lucide-icon>
        <h3 class="text-xl font-semibold">Inteligencia Artificial</h3>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1.5 opacity-70">Proveedor</label>
          <select [(ngModel)]="config.ai.provider" class="glass-input w-full appearance-none">
            <option value="openai">OpenAI (ChatGPT)</option>
            <option value="gemini">Google Gemini</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 opacity-70">API Key</label>
          <input [(ngModel)]="config.ai.apiKey" type="password" placeholder="sk-..." class="glass-input w-full">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 opacity-70">Modelo</label>
          <input [(ngModel)]="config.ai.model" type="text" placeholder="ej. gpt-4o o gemini-1.5-flash" class="glass-input w-full">
          <div *ngIf="config.ai.provider === 'gemini'" class="flex flex-wrap gap-1.5 mt-2">
            <button type="button" (click)="config.ai.model = 'gemini-3.6-flash'" class="px-2 py-1 text-[10px] font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-all cursor-pointer">
              gemini-3.6-flash (Recomendado por Google) ⭐
            </button>
            <button type="button" (click)="config.ai.model = 'gemini-1.5-flash'" class="px-2 py-1 text-[10px] font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-all cursor-pointer">
              gemini-1.5-flash
            </button>
          </div>
          <div *ngIf="config.ai.provider === 'openai'" class="flex flex-wrap gap-1.5 mt-2">
            <button type="button" (click)="config.ai.model = 'gpt-4o-mini'" class="px-2 py-1 text-[10px] font-bold rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-all cursor-pointer">
              gpt-4o-mini
            </button>
            <button type="button" (click)="config.ai.model = 'gpt-4o'" class="px-2 py-1 text-[10px] font-bold rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-all cursor-pointer">
              gpt-4o
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- SharePoint Config -->
  <section class="glass-card space-y-6">
    <div class="flex items-center gap-3 text-blue-500">
      <lucide-icon [name]="ShieldCheck" size="24"></lucide-icon>
      <div>
        <h3 class="text-xl font-semibold text-slate-800 dark:text-white">SharePoint — Evidencias CMMI</h3>
        <p class="text-slate-500 dark:text-slate-400 text-sm">Configura la URL de SharePoint para que el Proceso Sprint pueda cargar automáticamente las evidencias del release sin ingresar manualmente.</p>
      </div>
    </div>

    <div class="p-4 rounded-xl bg-blue-500/8 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300 space-y-1">
      <p class="font-bold">📋 ¿Cómo obtener estos valores?</p>
      <p>Abre la carpeta del Release en SharePoint, copia la URL del navegador y desglosa las partes:</p>
      <code class="block mt-1 font-mono text-[10px] bg-slate-100 dark:bg-slate-900 rounded p-2 leading-relaxed break-all">
        https://tenant.sharepoint.com<span class="text-blue-600">/ProjectCenterOnline/Repositorios</span>/_api/...<br>
        &RootFolder=<span class="text-emerald-600">/ProjectCenterOnline/.../4. Releases/5.5 Release 15</span>
      </code>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div>
        <label class="block text-sm font-semibold mb-1 opacity-90 text-blue-600 dark:text-blue-400">URL Base del Sitio SharePoint</label>
        <input [(ngModel)]="config.sharePoint!.siteUrl" type="url"
          placeholder="https://tuempresa.sharepoint.com/sitio/subsitio"
          class="glass-input w-full font-mono text-xs">
        <p class="text-[10px] text-slate-400 mt-1">URL base hasta el subsite (sin <code>/_api/</code>)</p>
      </div>

      <div>
        <label class="block text-sm font-semibold mb-1 opacity-90 text-blue-600 dark:text-blue-400">Server-Relative Path de la Lista</label>
        <input [(ngModel)]="config.sharePoint!.listPath" type="text"
          placeholder="/sitio/subsitio/Evidencias CMMI"
          class="glass-input w-full font-mono text-xs">
        <p class="text-[10px] text-slate-400 mt-1">Valor del parámetro <code>&#64;a1</code> sin comillas</p>
      </div>

      <div>
        <label class="block text-sm font-semibold mb-1 opacity-90 text-blue-600 dark:text-blue-400">Carpeta Raíz de Releases</label>
        <input [(ngModel)]="config.sharePoint!.releasesFolder" type="text"
          placeholder="/sitio/subsitio/Evidencias CMMI/Releases"
          class="glass-input w-full font-mono text-xs">
        <p class="text-[10px] text-slate-400 mt-1">El sistema agrega automáticamente <code>/5.5 Release XX</code> al cargar.</p>
      </div>

      <div>
        <label class="block text-sm font-semibold mb-1 opacity-70">GUID de la Vista (opcional)</label>
        <input [(ngModel)]="config.sharePoint!.viewId" type="text"
          placeholder="00000000-0000-0000-0000-000000000000"
          class="glass-input w-full font-mono text-xs">
      </div>
    </div>
  </section>

  <!-- Metrics API (backend) -->
  <section class="glass-card space-y-4">
    <div class="flex items-center gap-3 text-emerald-500">
      <lucide-icon [name]="Database" size="24"></lucide-icon>
      <div>
        <h3 class="text-xl font-semibold text-slate-800 dark:text-white">API de métricas (Opcional)</h3>
        <p class="text-slate-500 dark:text-slate-400 text-sm">Backend para guardar versiones de análisis, el proceso del sprint y el histórico de tendencias. Si se deja vacío, esa información se guarda solo en este equipo.</p>
      </div>
    </div>
    <input [(ngModel)]="config.metricsApiUrl" type="url" placeholder="https://tu-servidor/api/analysis" class="glass-input w-full font-mono text-xs">
  </section>

  <!-- SAAO -->
  <section class="glass-card space-y-6">
    <div class="flex items-center gap-3 text-amber-500">
      <lucide-icon [name]="ClipboardList" size="24"></lucide-icon>
      <div>
        <h3 class="text-xl font-semibold text-slate-800 dark:text-white">SAAO</h3>
        <p class="text-slate-500 dark:text-slate-400 text-sm">Datos usados por Proceso Sprint para crear Big Rocks y Macrotareas en SAAO.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium mb-1.5 opacity-70">URL de SAAO</label>
        <input [(ngModel)]="config.saao!.url" type="url" placeholder="https://saao.empresa.com" class="glass-input w-full font-mono text-xs">
      </div>
      <div>
        <label class="block text-sm font-medium mb-1.5 opacity-70">Proyecto SAAO (Big Rocks)</label>
        <input [(ngModel)]="config.saao!.projectCode" type="text" placeholder="ej. PMD00001" class="glass-input w-full">
      </div>
      <div>
        <label class="block text-sm font-medium mb-1.5 opacity-70">Prefijo de Macrotareas</label>
        <input [(ngModel)]="config.saao!.macroTitlePrefix" type="text" placeholder="ej. Mi Proyecto" class="glass-input w-full">
        <p class="text-[11px] text-slate-400 mt-1">Resultado: {{ config.saao!.macroTitlePrefix ? config.saao!.macroTitlePrefix + '>' : '' }}Release #1&gt;Análisis y diseño</p>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1.5 opacity-70">Responsable de Big Rocks</label>
        <input [(ngModel)]="config.saao!.bigRockResponsible" type="text" placeholder="usuario SAAO (si se deja vacío, se usa tu correo)" class="glass-input w-full">
      </div>
      <div class="md:col-span-2">
        <label class="block text-sm font-medium mb-1.5 opacity-70">Colaboradores (separados por coma)</label>
        <input [(ngModel)]="saaoCollaboratorsText" type="text" placeholder="ej. Ana, Luis, ISW MID 1" class="glass-input w-full">
      </div>
    </div>
  </section>

  <!-- Gantt Stage Rules -->
  <section class="glass-card space-y-4">
    <button class="w-full flex items-center justify-between text-left" (click)="ganttRulesPanelOpen = !ganttRulesPanelOpen">
      <div class="flex items-center gap-3 text-sky-500">
        <lucide-icon [name]="ListChecks" size="24"></lucide-icon>
        <div>
          <h3 class="text-xl font-semibold text-slate-800 dark:text-white">Etapas del Gantt</h3>
          <p class="text-slate-500 dark:text-slate-400 text-sm">Palabras clave del título de la tarea que definen su etapa. Se evalúan en orden y gana la primera que coincida. Usa "+" para exigir varias palabras (ej. pruebas funcionales+isw).</p>
        </div>
      </div>
      <lucide-icon [name]="ganttRulesPanelOpen ? ChevronUp : ChevronDown" size="18" class="text-slate-400"></lucide-icon>
    </button>

    <div *ngIf="ganttRulesPanelOpen" class="space-y-3 animate-in fade-in duration-200">
      <div *ngFor="let rule of config.ganttStageRules!" class="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 items-start">
        <label class="text-sm font-medium pt-2">{{ rule.label }}</label>
        <input [(ngModel)]="ganttKeywordsText[rule.stage]" type="text" class="glass-input w-full text-xs" placeholder="palabras clave separadas por coma">
      </div>
      <button class="glass-button text-xs px-3 py-1.5" (click)="resetGanttStageRules()">Restaurar valores por defecto</button>
    </div>
  </section>

  <!-- Work Item Prefixes -->
  <section class="glass-card space-y-6">
    <div class="flex items-center gap-3 text-amber-500">
      <lucide-icon [name]="Tag" size="24"></lucide-icon>
      <div>
        <h3 class="text-xl font-semibold text-slate-800 dark:text-white">Prefijos de work items</h3>
        <p class="text-slate-500 dark:text-slate-400 text-sm">Prefijos usados en los títulos de las tareas generadas (ej. REQ 123 Task 01.01 Elaboración de código).</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium mb-1.5 opacity-70">Requerimiento / User Story</label>
        <input [(ngModel)]="config.workItemPrefixes!.requirement" type="text" placeholder="REQ" class="glass-input w-full">
      </div>
      <div>
        <label class="block text-sm font-medium mb-1.5 opacity-70">Feature</label>
        <input [(ngModel)]="config.workItemPrefixes!.feature" type="text" placeholder="FEATURE" class="glass-input w-full">
      </div>
      <div>
        <label class="block text-sm font-medium mb-1.5 opacity-70">Bug</label>
        <input [(ngModel)]="config.workItemPrefixes!.bug" type="text" placeholder="BUG" class="glass-input w-full">
      </div>
    </div>
  </section>

  <section class="glass-card space-y-4">
    <button class="w-full flex items-center justify-between text-left" (click)="toggleTemplatePanel()">
      <div class="flex items-center gap-3 text-teal-500">
        <lucide-icon [name]="ClipboardList" size="24"></lucide-icon>
        <div>
          <h3 class="text-xl font-semibold text-slate-800 dark:text-white">Estructura de tareas (Sprint)</h3>
          <p class="text-slate-500 dark:text-slate-400 text-sm">Plantilla editable para Dev, Testing y Otras tareas.</p>
        </div>
      </div>
      <lucide-icon [name]="templatePanelOpen ? ChevronUp : ChevronDown" size="18" class="text-slate-400"></lucide-icon>
    </button>

    <div *ngIf="templatePanelOpen" class="space-y-4 animate-in fade-in duration-200">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="space-y-2">
          <h4 class="font-semibold text-sm">DevTasks</h4>
          <div *ngFor="let task of config.sprintTaskTemplate!.devTasks; let i=index" class="p-2 border rounded-lg space-y-2">
            <input [(ngModel)]="task.id" type="number" class="glass-input w-full text-xs" placeholder="Id">
            <input [(ngModel)]="task.name" type="text" class="glass-input w-full text-xs" placeholder="Name">
            <input [(ngModel)]="task.percentage" type="number" min="0" class="glass-input w-full text-xs" placeholder="Percentaje">
            <button class="text-red-500 text-xs" (click)="removeDevTask(i)">Eliminar</button>
          </div>
          <button class="glass-button text-xs px-2 py-1 w-full" (click)="addDevTask()">+ Agregar tarea</button>
        </div>

        <div class="space-y-2">
          <h4 class="font-semibold text-sm">TestingTasks</h4>
          <div *ngFor="let task of config.sprintTaskTemplate!.testingTasks; let i=index" class="p-2 border rounded-lg space-y-2">
            <input [(ngModel)]="task.id" type="number" class="glass-input w-full text-xs" placeholder="Id">
            <input [(ngModel)]="task.name" type="text" class="glass-input w-full text-xs" placeholder="Name">
            <input [(ngModel)]="task.originalStimated" type="number" min="0" step="0.5" class="glass-input w-full text-xs" placeholder="OriginalStimated">
            <button class="text-red-500 text-xs" (click)="removeTestingTask(i)">Eliminar</button>
          </div>
          <button class="glass-button text-xs px-2 py-1 w-full" (click)="addTestingTask()">+ Agregar tarea</button>
        </div>

        <div class="space-y-2">
          <h4 class="font-semibold text-sm">OtherTasks</h4>
          <div *ngFor="let task of config.sprintTaskTemplate!.otherTasks; let i=index" class="p-2 border rounded-lg space-y-2">
            <input [(ngModel)]="task.id" type="number" class="glass-input w-full text-xs" placeholder="Id">
            <input [(ngModel)]="task.name" type="text" class="glass-input w-full text-xs" placeholder="Name">
            <input [(ngModel)]="task.originalStimated" type="number" min="0" step="0.5" class="glass-input w-full text-xs" placeholder="OriginalStimated">
            <button class="text-red-500 text-xs" (click)="removeOtherTask(i)">Eliminar</button>
          </div>
          <button class="glass-button text-xs px-2 py-1 w-full" (click)="addOtherTask()">+ Agregar tarea</button>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 pt-2">
        <button class="glass-button text-sm" (click)="exportTemplate()">Exportar template</button>
        <label class="glass-button text-sm cursor-pointer">
          Importar template
          <input type="file" accept="application/json" class="hidden" (change)="importTemplate($event)">
        </label>
      </div>
    </div>
  </section>

  <div class="flex justify-end pt-4">
    <button (click)="save()" class="glass-button flex items-center gap-2">
      <lucide-icon [name]="Save" size="18"></lucide-icon>
      <span>Guardar Configuración</span>
    </button>
  </div>
</div>
  `
})
export class ConfigComponent {
  readonly Save = Save;
  readonly ShieldCheck = ShieldCheck;
  readonly Cpu = Cpu;
  readonly ClipboardList = ClipboardList;
  readonly ChevronDown = ChevronDown;
  readonly ChevronUp = ChevronUp;
  readonly Tag = Tag;
  readonly Database = Database;
  readonly ListChecks = ListChecks;

  private configService = inject(ConfigService);

  config: AppConfig = ((): AppConfig => {
    const saved = this.configService.getConfig();
    return {
      ...saved,
      azure: { pat: '', organization: '', project: '', ...(saved?.azure || {}) },
      ai: { provider: 'openai', apiKey: '', model: '', ...(saved?.ai || {}) },
      sharePoint: { siteUrl: '', listPath: '', releasesFolder: '', viewId: '', ...(saved?.sharePoint || {}) },
      sprintTaskTemplate: saved?.sprintTaskTemplate || this.configService.getDefaultSprintTaskTemplate(),
      workItemPrefixes: { ...this.configService.getDefaultWorkItemPrefixes(), ...(saved?.workItemPrefixes || {}) },
      saao: { ...this.configService.getDefaultSaaoConfig(), ...(saved?.saao || {}) },
      ganttStageRules: saved?.ganttStageRules?.length ? saved.ganttStageRules : this.configService.getDefaultGanttStageRules()
    };
  })();

  saaoCollaboratorsText = (this.config.saao?.collaborators || []).join(', ');
  ganttRulesPanelOpen = false;
  ganttKeywordsText = this.toKeywordsText(this.config.ganttStageRules!);

  resetGanttStageRules(): void {
    this.config.ganttStageRules = this.configService.getDefaultGanttStageRules();
    this.ganttKeywordsText = this.toKeywordsText(this.config.ganttStageRules);
  }

  private toKeywordsText(rules: GanttStageRule[]): { [stage: string]: string } {
    return Object.fromEntries(rules.map(rule => [rule.stage, rule.keywords.join(', ')]));
  }
  templatePanelOpen = true;

  save() {
    this.config.saao!.collaborators = this.saaoCollaboratorsText.split(',').map(c => c.trim()).filter(Boolean);
    this.config.ganttStageRules = this.config.ganttStageRules!.map(rule => ({
      ...rule,
      keywords: (this.ganttKeywordsText[rule.stage] || '').split(',').map(k => k.trim()).filter(Boolean)
    }));
    this.configService.saveConfig(this.config);
    alert('Configuración guardada correctamente.');
  }

  toggleTemplatePanel(): void {
    this.templatePanelOpen = !this.templatePanelOpen;
  }

  addDevTask(): void {
    this.config.sprintTaskTemplate!.devTasks.push({ id: 0, name: '', percentage: 0 });
  }

  removeDevTask(index: number): void {
    this.config.sprintTaskTemplate!.devTasks.splice(index, 1);
  }

  addTestingTask(): void {
    this.config.sprintTaskTemplate!.testingTasks.push({ id: 0, name: '', originalStimated: 0 });
  }

  removeTestingTask(index: number): void {
    this.config.sprintTaskTemplate!.testingTasks.splice(index, 1);
  }

  addOtherTask(): void {
    this.config.sprintTaskTemplate!.otherTasks.push({ id: 0, name: '', originalStimated: 0 });
  }

  removeOtherTask(index: number): void {
    this.config.sprintTaskTemplate!.otherTasks.splice(index, 1);
  }

  exportTemplate(): void {
    const content = JSON.stringify(this.config.sprintTaskTemplate, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sprint-task-template.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  importTemplate(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        this.config.sprintTaskTemplate = this.normalizeTemplate(parsed);
      } catch {
        alert('El archivo no contiene un JSON válido.');
      }
    };
    reader.readAsText(file);
    input.value = '';
  }

  private normalizeTemplate(input: any): AppConfig['sprintTaskTemplate'] {
    const devRaw = Array.isArray(input?.devTasks) ? input.devTasks : (Array.isArray(input?.DevTasks) ? input.DevTasks : []);
    const testingRaw = Array.isArray(input?.testingTasks) ? input.testingTasks : (Array.isArray(input?.TestingTasks) ? input.TestingTasks : []);
    const otherRaw = Array.isArray(input?.otherTasks) ? input.otherTasks : (Array.isArray(input?.OtherTasks) ? input.OtherTasks : []);

    const devTasks: DevTaskTemplateItem[] = devRaw.map((item: any) => ({
      id: Number(item.id ?? item.Id ?? 0),
      name: String(item.name ?? item.Name ?? ''),
      percentage: Number(item.percentage ?? item.Percentaje ?? 0)
    }));

    const toTimed = (item: any): TimedTaskTemplateItem => ({
      id: Number(item.id ?? item.Id ?? 0),
      name: String(item.name ?? item.Name ?? ''),
      originalStimated: Number(item.originalStimated ?? item.OriginalStimated ?? 0)
    });

    return {
      devTasks,
      testingTasks: testingRaw.map(toTimed),
      otherTasks: otherRaw.map(toTimed)
    };
  }
}
