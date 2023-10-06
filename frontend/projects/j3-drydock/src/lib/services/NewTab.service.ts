import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router, UrlTree } from '@angular/router';
import { CentralizedDataService, eAppLocation } from 'jibe-components';

@Injectable({
  providedIn: 'root'
})
export class NewTabService {
  private readonly appLocation = eAppLocation.Office;
  private readonly isURLTokenUsed = false;
  private readonly j2base = '';

  constructor(
    private cds: CentralizedDataService,
    private location: Location,
    private router: Router
  ) {
    this.appLocation = cds.userDetails?.AppLocation;
    this.isURLTokenUsed = cds.userDetails?.isURLTokenUsed;
    // eslint-disable-next-line dot-notation
    this.j2base = window['environment']?.j2?.baseURL ?? '';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public navigate(commands: any[], extras?: NavigationExtras): boolean {
    const urlTree = this.router.createUrlTree(commands, extras);
    return this.navigateByUrl(urlTree);
  }

  public navigateByUrl(url: string | UrlTree): boolean {
    if (!url) {
      return false;
    }

    const href = url instanceof UrlTree ? this.router.serializeUrl(url) : url;

    const externalUrl =
      this.appLocation === eAppLocation.Office && this.isURLTokenUsed
        ? `${this.j2base}account/jibe2App.aspx?url=${href}`
        : this.location.prepareExternalUrl(href);

    window.open(externalUrl, '_blank', 'noopener');

    return true;
  }
}
