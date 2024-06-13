import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, JsonPipe } from '@angular/common';

interface Item {
  id: string;
  value: string;
}

@Component({
  selector: 'app-select-multiple',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './select-multiple.component.html',
  styleUrl: './select-multiple.component.css',
})
export class SelectMultipleComponent {
  items = new FormControl();
  @Input() title: string = '';
  @Input() selectedItems: string[] = [];
  @Input() itemList: Item[] = [];
  @Input() onItemsChange: Function = () => {};

  @Output() selectedItemsChange: EventEmitter<string[]> = new EventEmitter();

  getItemValue(itemsValue: any): string {
    const foundItem = this.itemList.find((item) => item.id === itemsValue?.[0]);
    return foundItem ? foundItem.value : '';
  }

  changeSelectedItems() {
    this.selectedItemsChange.emit(this.items.value);
    this.onItemsChange();
  }
}
