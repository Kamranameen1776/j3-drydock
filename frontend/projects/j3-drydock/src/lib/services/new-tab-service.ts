import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router, UrlTree } from '@angular/router';
import { CentralizedDataService, eAppLocation } from 'jibe-components';

@Injectable({
  providedIn: 'root'
})
export class NewTabService {
  constructor(
    private cds: CentralizedDataService,
    private location: Location,
    private router: Router
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public navigate(commands: any[], extras?: NavigationExtras, title?: string): boolean {
    if (this.isOfficeWithUrlToken && extras?.queryParams && Object.hasOwnProperty.call(extras.queryParams, 'tab_title')) {
      delete extras.queryParams.tab_title;
    }
    const urlTree = this.router.createUrlTree(commands, extras);
    return this.navigateByUrl(urlTree, title);
  }

  public navigateByUrl(url: string | UrlTree, title?: string): boolean {
    if (!url) {
      return false;
    }

    // eslint-disable-next-line dot-notation
    const j2base = window['environment']?.j2?.baseURL ?? '';
    const href = url instanceof UrlTree ? this.router.serializeUrl(url) : url;

    const officeHref = href.startsWith('/') ? href.slice(1) : href;
    const officeTitle = title ? `&tab_title=${encodeURIComponent(title)}` : '';

    const externalUrl = this.isOfficeWithUrlToken
      ? `${j2base}account/jibe2App.aspx?url=${officeHref}${officeTitle}`
      : this.location.prepareExternalUrl(href);

    window.open(externalUrl, '_blank', 'noopener');

    return true;
  }

  private get isOfficeWithUrlToken() {
    const userDetails = this.cds.userDetails;
    const isURLTokenUsed = !!userDetails?.isURLTokenUsed;
    return userDetails?.AppLocation === eAppLocation.Office && isURLTokenUsed;
  }
}
