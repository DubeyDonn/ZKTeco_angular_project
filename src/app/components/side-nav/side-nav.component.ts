import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterModule, MatListModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
})
export class SideNavComponent {
  // highlight the selected nav item
  // activeLink = 'Dashboard';
  constructor() {}

  // // set the active link
  // setActiveLink(link: string) {
  //   this.activeLink = link;
  // }
}
