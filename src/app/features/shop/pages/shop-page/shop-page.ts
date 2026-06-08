import { Component } from '@angular/core';
import { Catalog } from '../../components/catalog/catalog';

@Component({
  selector: 'app-shop-page',
  imports: [Catalog],
  templateUrl: './shop-page.html',
})
export class ShopPage {}
