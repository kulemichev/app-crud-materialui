import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProductInterface} from '../../shared/types/product.interface';
import {PRODUCT_CONDITION_LIST, PRODUCT_FIELDS} from '../../mock/products.mock';
import {UtilsService} from '../../shared/services/utils.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  form!: FormGroup;
  productConditionList = PRODUCT_CONDITION_LIST;
  actionBtn = 'Сохранить';

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private utils: UtilsService,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductInterface
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeFormValues();
  }

  addProduct(): void {
    if (this.form.valid) {
      this.httpService.createData(this.form.value).subscribe({
        next: (res: ProductInterface) => {
          console.log('product added:', res);
          this.form.reset();
          this.dialogRef.close('created');
        },
        error: this.utils.errorHandler
      });
    }
  }

  updateProduct(): void {
    if (this.form.valid && this.data.id) {
      this.httpService.updateData(this.form.value, this.data.id).subscribe({
        next: (res: ProductInterface) => {
          console.log('product updated:', res);
          this.form.reset();
          this.dialogRef.close('updated');
        },
        error: this.utils.errorHandler
      });
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      productCondition: ['', [Validators.required]],
      price: ['', [Validators.required]],
      comment: ['', [Validators.required]],
      date: ['', [Validators.required]]
    });
  }

  private initializeFormValues(): void {
    if (this.data) {
      this.actionBtn = 'Изменить';
      PRODUCT_FIELDS.forEach(name => this.form.controls[name].setValue(this.data[name as keyof ProductInterface]));
    }
  }

}
