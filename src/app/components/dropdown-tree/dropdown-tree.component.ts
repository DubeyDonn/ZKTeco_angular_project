import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */

// const TREE_DATA: Node[] = [
//   {
//     name: 'Fruit',
//     children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }],
//   },
// ];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  path?: any;
}

/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'app-dropdown-tree',
  standalone: true,
  imports: [
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './dropdown-tree.component.html',
  styleUrl: './dropdown-tree.component.css',
})
export class DropdownTreeComponent implements OnInit {
  @Input() nodeDate?: any[];

  ngOnInit() {
    this.dataSource.data = this.nodeDate || [];
  }

  private _transformer = (node: any, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      path: node.path,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener<any, ExampleFlatNode>(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {}

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
