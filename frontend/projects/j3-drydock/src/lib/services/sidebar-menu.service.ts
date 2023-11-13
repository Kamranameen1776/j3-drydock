import { Injectable } from '@angular/core';
import { IJbMenuItem, JbMenuService, ThemeService } from 'jibe-components';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class SidebarMenuService {
  private defaultMenuConfig = {
    activeMenu: false,
    id: 'master',
    menuData: [],
    menuIconClose: 'icons8-menu-filled',
    menuIconOpen: 'icons8-menu-filled',
    theme: this.themeService.getTheme()
  };

  constructor(
    private readonly jbMenuService: JbMenuService,
    private readonly themeService: ThemeService
  ) {}

  public init(menuData: IJbMenuItem[], destroy$: Observable<unknown>, onMenuItemSelected?: (item: IJbMenuItem) => void): void {
    this.setMenu(menuData);
    destroy$.subscribe(() => this.resetMenu());

    if (!onMenuItemSelected) {
      return;
    }

    this.jbMenuService.selectedMenuOpt.pipe(takeUntil(destroy$)).subscribe((item) => onMenuItemSelected(item));
  }

  public setMenu(menuData: IJbMenuItem[]): void {
    this.jbMenuService.setSlideLayout.next('static');
    this.jbMenuService.setSlideMenuConfig.next({
      ...this.defaultMenuConfig,
      activeMenu: true,
      menuBodyStyle: { 'background-color': '#e8e9ef' },
      subMenuBodyStyle: { 'background-color': '#e8e9ef' },
      menuData
    });
  }

  public resetMenu(): void {
    this.jbMenuService.setSlideMenuConfig.next(this.defaultMenuConfig);
  }
}
