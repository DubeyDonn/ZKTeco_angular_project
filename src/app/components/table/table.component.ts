import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnInit {
  @Input() columns: any[] = [];
  @Input() dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @Input() sortFunction: Function = () => {};
  displayedColumns: string[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.displayedColumns = this.columns.map((c) => c.columnDef);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Method to safely return HTML content for rendering
  safeHtml(htmlContent: string) {
    return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
  }
}
