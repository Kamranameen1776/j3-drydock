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
    const urlTree = this.router.createUrlTree(commands, extras);
    return this.navigateByUrl(urlTree, title);
  }

  public navigateByUrl(url: string | UrlTree, title?: string): boolean {
    if (!url) {
      return false;
    }

    const userDetails = this.cds.userDetails;
    const isURLTokenUsed = !!userDetails.isURLTokenUsed;
    const appLocation = userDetails.AppLocation;

    // eslint-disable-next-line dot-notation
    const j2base = window['environment']?.j2?.baseURL ?? '';
    const href = url instanceof UrlTree ? this.router.serializeUrl(url) : url;

    const externalUrl =
      appLocation === eAppLocation.Office && isURLTokenUsed
        ? `${j2base}account/jibe2App.aspx?url=${href}`
        : this.location.prepareExternalUrl(href);

    const newWindow = window.open(externalUrl, '_blank');

    if (title && newWindow) {
      const listenLoad = (listener) => {
        newWindow.document.title = title;
        newWindow.removeEventListener('load', listener);
      };
      newWindow.addEventListener('load', () => {
        listenLoad(listenLoad);
      });
    }

    return true;
  }
}
