import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DropdownTreeComponent } from '../dropdown-tree/dropdown-tree.component';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    RouterModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    DropdownTreeComponent,
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
})
export class SideNavComponent {
  setupNodeData: any[] = [
    {
      name: 'Setup',
      children: [
        {
          name: 'Shift',
          path: '/setup/shift',
        },
      ],
    },
  ];

  officeManagementNodeData: any[] = [
    {
      name: 'Office Management',
      children: [
        {
          name: 'Employee',
          path: '/office-management/employee',
        },
      ],
    },
  ];

  constructor() {}
}
