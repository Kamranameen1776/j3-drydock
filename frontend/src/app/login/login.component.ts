import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { JbHelpMaterialComponent } from 'jibe-components';
import { from, Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthDetails, LoginService } from './login.service';

const GLOBAL_TOKEN = 'globalToken';
const USER_DETAILS = 'userDetails';

interface Link {
  name: string;
  path: string;
}
@Component({
  selector: 'jb-app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  public links$: Observable<Link[]>;

  private userName = environment.jibe_user;
  private password = environment.jibe_password;
  private authDetails: AuthDetails;

  constructor(
    private cd: ChangeDetectorRef,
    private loginService: LoginService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem(GLOBAL_TOKEN) && localStorage.getItem(USER_DETAILS)) {
      this.buildLinks();
    }
  }

  public login(): void {
    const data = {
      userName: this.userName,
      password: this.password,
      UserTime: new Date().toLocaleTimeString(),
      j3WebApp: true,
    };

    this.loginService
      .login(data)
      .pipe(
        tap(({ authtoken, authDetails }) => {
          localStorage.setItem(GLOBAL_TOKEN, authtoken);
          this.authDetails = authDetails;
        }),
        mergeMap(() => this.loginService.getUserRights()),
        tap((result) => {
          const accessRightsMap = new Map(result.map((accessRight) => [accessRight.Right_Code, accessRight]));
          const accessRights = Array.from(accessRightsMap.values());
          localStorage.setItem(
            USER_DETAILS,
            JSON.stringify({
              ...this.authDetails,
              UserRoles: accessRights,
            }),
          );

          this.buildLinks();
        }),
      )
      .subscribe();
  }

  private buildLinks(): void {
    const route = this.router.config.find((item) => item.path === 'j3-drydock');

    if (!route) {
      return;
    }

    this.links$ = from(this.getRoutePaths(route, ''));
  }

  private async getRoutePaths(route: Route, parentPath: string | undefined): Promise<Link[]> {
    if (route.component === JbHelpMaterialComponent) {
      return [];
    }

    const links: Link[] = [];

    const currentPath = parentPath ? `/${parentPath}/${route.path}` : route.path;

    if (route.loadChildren) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { routes } = await (<any>this.router).configLoader.load(undefined, route).toPromise();

      for (const childRoute of routes) {
        const childPaths = await this.getRoutePaths(childRoute, currentPath);
        links.push(...childPaths);
      }
    } else if (route.children) {
      for (const childRoute of route.children) {
        const { component, path } = childRoute;
        if (component?.name && currentPath) {
          links.push({ name: component.name, path: `${currentPath}/${path}` });
        }
      }
    } else {
      const name = route.component?.name;
      if (name && currentPath) {
        links.push({ name, path: currentPath });
      }
    }
    return links;
  }
}
