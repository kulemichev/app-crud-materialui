import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpService} from "../services/http.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    category: ['', [Validators.required]],
    productCondition: ['', [Validators.required]],
    price: ['', [Validators.required]],
    comment: ['', [Validators.required]],
    date: ['', [Validators.required]]
  })

  productConditionList = ['Новый', 'Б/у', 'После ремонта'];

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private dialogRef: MatDialogRef<DialogComponent>) {
  }

  ngOnInit(): void {
  }

  addProduct(): void {
    if (this.form.valid) {
      this.httpService.createData(this.form.value).subscribe({
        next: (res) => {
          console.log('product added:', res);
          this.form.reset()
          this.dialogRef.close('created');
        },
        error: (err) => console.log(err)
      });
    }
  }

}
