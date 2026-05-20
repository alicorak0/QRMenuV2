import { Component } from '@angular/core';
import { ProductService } from '../../../services/product-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router'; 
import { FormGroup,FormBuilder,FormControl,Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../../models/categoryModel';
import { CategoryService } from '../../../services/category-service';
import { ResponseModel } from '../../../models/responseModel';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-category-settings-component',
  imports: [CommonModule, FormsModule, ReactiveFormsModule  , RouterModule],
  templateUrl: './category-settings-component.html',
  styleUrl: './category-settings-component.css',
})
export class CategorySettingsComponent implements OnInit {
 categories: Category[] = [];     
selectedCategory: Category | null = null;


categoryUpdateForm!: FormGroup;        // Reactive form

 ngOnInit(): void {
   
    this.loadCategories();

      this.createCategoryUpdateForm()
  }
constructor(private categoryService: CategoryService,private toastrService: ToastrService,private formBuilder: FormBuilder) {}


 createCategoryUpdateForm(){

    this.categoryUpdateForm = this.formBuilder.group({
      categoryId: ["", Validators.required],
     categoryName:["",Validators.required],

    }) 
    }

    loadCategories() { // ürünleri  tabloya bağlama
    this.categoryService.getAllCategories().subscribe(result => {
      this.categories = result.data;  // tabloya burada bağlanır
    });
  }


updateCategory() {

  if (this.categoryUpdateForm.invalid) {
    this.toastrService.error("Form geçersiz");
    return;
  }

  const productData = this.categoryUpdateForm.value;

  this.categoryService.updateCategory(productData).subscribe({
    next: () => {
      this.toastrService.success("Kategori başarıyla güncellendi");
      this.cancelSelect();
      this.loadCategories(); 
    }
  });

}



  DeleteCategory(category: Category) {

    if (confirm(`${category.categoryName} silinsin mi? İşlem Geri Alınamaz !`)) {


      this.categoryService.deleteCategory(category.categoryId)
  .subscribe((response: ResponseModel) => {
      this.toastrService.success(`${category.categoryName} Başarıyla Silindi`);
      this.toastrService.info(response.message);   
      this.cancelSelect(); // reset 
      this.loadCategories();

  });
    }
  }



   SelectCategory(category: Category) {
       this.selectedCategory = category;
  
        this.categoryUpdateForm.patchValue({
          categoryId: category.categoryId,
          categoryName: category.categoryName
        });
      }


       cancelSelect() {
    this.categoryUpdateForm.reset();
    this.selectedCategory = null;

  }



}
