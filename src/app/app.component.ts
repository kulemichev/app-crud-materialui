import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "./components/dialog/dialog.component";
import {HttpService} from "./services/http.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ProductInterface} from "./shared/types/product.interface";
import {PRODUCT_COLUMNS} from "./mock/products.mock";
import {UtilsService} from "./shared/services/utils.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = PRODUCT_COLUMNS;
  dataSource!: MatTableDataSource<ProductInterface>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog,
              private httpService: HttpService,
              private utils: UtilsService
  ) {
  }

  ngOnInit(): void {
    this.getAllProducts();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createProduct(): void {
    this.dialog.open(DialogComponent, {
      width: '30%'
    }).afterClosed().subscribe({
      next: (res: string) => {
        if (res === 'created') {
          this.getAllProducts();
        }
      },
      error: this.utils.errorHandler
    });
  }

  updateProduct(row: ProductInterface): void {
    this.dialog.open(DialogComponent, {
      width: '40%',
      data: row
    }).afterClosed().subscribe({
      next: (res: string) => {
        if (res === 'updated') {
          this.getAllProducts();
        }
      },
      error: this.utils.errorHandler
    });
  }


  deleteProduct(id: number): void {
    this.httpService.deleteData(id).subscribe({
      next: () => {
        console.log('Deleted successfully');
        this.getAllProducts();
      },
      error: this.utils.errorHandler
    });
  }

  private getAllProducts(): void {
    this.httpService.readData().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: this.utils.errorHandler
    });
  }

}
