import { Injectable } from '@angular/core';
import{ASSET_UPLOADS_URL,PRODUCT_UPLOADS_BASE_URL} from '../constants/categoryConstants';
@Injectable({
  providedIn: 'root',
})
export class AssetService {
   private assetBase = ASSET_UPLOADS_URL;
  private productBase = PRODUCT_UPLOADS_BASE_URL;

  getAsset(path: string): string {
    return `${this.assetBase}/${path}`;
  }

  getProduct(path: string): string {
    return `${this.productBase}/${path}`;
  }


}
