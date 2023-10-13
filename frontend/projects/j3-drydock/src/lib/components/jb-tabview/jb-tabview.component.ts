import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild
} from '@angular/core';
import { TabPanel, TabView } from 'primeng';

@Component({
  selector: 'jb-tabview',
  templateUrl: './jb-tabview.component.html',
  styleUrls: ['./jb-tabview.component.scss']
})
export class JibeTabViewComponent implements AfterContentInit {
  @Input()
  activeIndex = 0;

  @Output()
  activeIndexChange = new EventEmitter();

  @ViewChild('tabView') tabView: TabView;
  @ContentChildren(TabPanel) tabPanels: QueryList<TabPanel>;

  ngAfterContentInit(): void {
    // Duct tape
    setTimeout(() => {
        this.tabView.tabPanels = this.tabPanels;
        this.tabView.initTabs();
    }, 0);
  }
}
