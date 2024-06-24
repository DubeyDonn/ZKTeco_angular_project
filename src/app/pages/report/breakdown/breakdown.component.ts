import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-breakdown',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breakdown.component.html',
  styleUrl: './breakdown.component.css',
})
export class BreakdownComponent {}
