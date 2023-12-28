import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DynamicExampleComponent } from './dynamic-example.component';
import { DynamicExampleGridComponent } from './dynamic-example-grid.component';
import { DynamicComponentsModule, JibeComponentsModule } from 'jibe-components';
// import { JibeComponentsModule } from 'projects/jibe-components/src/lib/jibe-components.module';
// import { DynamicComponentsModule } from 'projects/jibe-components/src/lib/services/dynamic-components-registry.service';

@NgModule({
  imports: [JibeComponentsModule, CommonModule, ProgressSpinnerModule],
  declarations: [DynamicExampleComponent, DynamicExampleGridComponent],
  entryComponents: [DynamicExampleComponent, DynamicExampleGridComponent]
})
export class DynamicComponentsExampleModule implements DynamicComponentsModule {
  dynamicComponentsMap: { [key: string]: Type<unknown> } = {
    'jb-dynamic-example': DynamicExampleComponent,
    'jb-dynamic-example-grid': DynamicExampleGridComponent
  };
  constructor() {}
}
