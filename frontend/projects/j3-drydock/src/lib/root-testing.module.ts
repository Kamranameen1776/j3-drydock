import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JiBeTheme, JibeComponentsModule, UserRightsService } from 'jibe-components';
import { NgModule } from '@angular/core';
import { winEnv } from './drydock.module';

@NgModule({
  imports: [
    RouterTestingModule.withRoutes([]),
    HttpClientTestingModule,
    JibeComponentsModule.forRoot({
      environment: winEnv,
      theme: JiBeTheme.Figma
    })
  ],
  providers: [
    {
      provide: UserRightsService,
      useValue: {
        getUserRights: () => []
      }
    }
  ]
})
export class RootDrydockTestingModule {}
