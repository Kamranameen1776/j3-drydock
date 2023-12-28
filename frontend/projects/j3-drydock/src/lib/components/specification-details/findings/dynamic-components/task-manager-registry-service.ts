import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskManagerRegistyService {
  private jobTypeSidebarInformationDynamicComponents: Map<string, string> = new Map();
  private jobTypeSelectionDynamicComponents: Map<string, string> = new Map();
  private jobTypeDetailsPageUrlGenerators: Map<string, (entityId) => string> = new Map();

  registerJobTypeDetailsPageUrlGenerator(jobType: string, generateUrl: (entityId) => string): void {
    if (this.jobTypeDetailsPageUrlGenerators.has(jobType)) {
      throw new Error(`Url generator for ${jobType} already registered`);
    }
    this.jobTypeDetailsPageUrlGenerators.set(jobType, generateUrl);
  }

  registerJobTypeSidebarInformationDynamicComponent(jobType: string, globalComponentName: string): void {
    if (this.jobTypeSidebarInformationDynamicComponents.has(jobType)) {
      throw new Error(`Component for ${jobType} sidebar already registered`);
    }
    this.jobTypeSidebarInformationDynamicComponents.set(jobType, globalComponentName);
  }

  registerJobTypeSelectionDyamicComponent(jobType: string, globalComponentName: string): void {
    if (this.jobTypeSelectionDynamicComponents.has(jobType)) {
      throw new Error(`Component for ${jobType} selection already registered`);
    }
    this.jobTypeSelectionDynamicComponents.set(jobType, globalComponentName);
    console.log('***jobTypeSelectionDynamicComponents', this.jobTypeSelectionDynamicComponents);
  }

  getJobTypeSidebarInformationDynamicComponent(jobType: string): string {
    if (!this.jobTypeSidebarInformationDynamicComponents.has(jobType)) {
      throw new Error(`Component for ${jobType} sidebar not registered`);
    }

    return this.jobTypeSidebarInformationDynamicComponents.get(jobType);
  }

  getJobTypeSelectionDynamicComponent(jobType: string): string {
    console.log('***getJobTypeSelectionDynamicComponent', this.jobTypeSelectionDynamicComponents);
    if (!this.jobTypeSelectionDynamicComponents.has(jobType)) {
      throw new Error(`Component for ${jobType} selection not registered`);
    }

    return this.jobTypeSelectionDynamicComponents.get(jobType);
  }

  getJobTypeDetailsPageUrlGenerator(jobType: string): (entityId) => string {
    if (!this.jobTypeDetailsPageUrlGenerators.has(jobType)) {
      throw new Error(`Url generator for ${jobType} not registered`);
    }

    return this.jobTypeDetailsPageUrlGenerators.get(jobType);
  }
}
