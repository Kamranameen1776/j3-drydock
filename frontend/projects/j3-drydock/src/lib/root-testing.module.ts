import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JiBeTheme, JibeComponentsModule, UserRightsService } from 'jibe-components';
import { Directive, Input, NgModule } from '@angular/core';
import { winEnv } from './drydock.module';
import { DatePipe } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[onUploadBtn]'
})
export class JbAttachmentsFixDirective {
  @Input() onUploadBtn: boolean;
}

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
    },
    DatePipe
  ]
})
export class RootDrydockTestingModule {}
