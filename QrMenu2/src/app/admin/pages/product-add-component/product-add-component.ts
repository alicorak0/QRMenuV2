import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { FormGroup,FormBuilder,FormControl,Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../services/product-service';
import { UploadPhotoService } from '../../../services/upload-photo-service';
import { Category } from '../../../models/categoryModel';
import { CategoryService } from '../../../services/category-service';

@Component({
  selector: 'app-product-add-component',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ToastrModule],
  templateUrl: './product-add-component.html',
  styleUrl: './product-add-component.css',
})
export class ProductAddComponent implements OnInit  {

productAddForm!: FormGroup;        // Reactive form
selectedFile: File | null = null; // SEÇİLİ RESİM DOSYASI

allCategories :Category[] =[];


constructor(private formBuilder: FormBuilder,private toastrService:ToastrService,
  private productService:ProductService,private uploadPhotoService:UploadPhotoService,private categoryService:CategoryService
){}


  ngOnInit(): void {
    this.loadAllCategories();
      this.createProductAddForm()

  }


loadAllCategories(){

  this.categoryService.getAllCategories().subscribe((response:any)=>{
  
    this.allCategories = response.data;
  })
}

 createProductAddForm(){

    this.productAddForm = this.formBuilder.group({
    categoryId:[null,Validators.required],
    productName:["",Validators.required],
    description:["",Validators.required],
    tooltip:["",Validators.required],
        price:["",Validators.required]



    }) 
    }

   add() {         // ekleme Ön hazırlıkları yapan fonksiyon
  if (this.productAddForm.invalid){
    
    this.toastrService.error('Lütfen tüm alanları doldurun!'); 
    return;
  }
  
  const productData = this.productAddForm.value;

  if (this.selectedFile) {
    // Resim varsa önce UploadPhotoService ile gönder
    this.uploadPhotoService.uploadImage(this.selectedFile).subscribe({
      next: (res) => {
        productData.image = res.url; // backend’den gelen path eklenir
        this.saveProduct(productData); // burada DB kaydına geçiyoruz
      },
      error: (err) => {
        console.error(err);
        this.toastrService.error('Resim yüklenemedi!');
      }
    });
  } else {
    // Resim yoksa direkt DB kaydına geç
      productData.image = "nophoto.jpg";   // 🔴 image alanını ekle

    this.saveProduct(productData);
  }
}

saveProduct(data: any) {

  this.productService.addProduct(data).subscribe({
    next: (response: any) => {

      this.toastrService.success(response.message || 'Ürün eklendi!');
      this.productAddForm.reset();
      this.selectedFile = null;

    }
  });

}

clearForm() { // temizleme işlemi yapan fonksiyon
  this.productAddForm.reset();
  this.selectedFile = null;

}


  // iMAGE SEÇME İŞLEMİ kODLARI
onFileSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;
  this.selectedFile = file;
}


}
