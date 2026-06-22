import { Component, inject, OnInit } from '@angular/core';
import { Catalog } from '../../components/catalog/catalog';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../../shared/services/search.service';

@Component({
  selector: 'app-shop-page',
  imports: [Catalog],
  templateUrl: './shop-page.html',
})
export class ShopPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private searchService = inject(SearchService);

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const { searchFor } = params;

      this.searchService.searchInput.set(searchFor ?? '');
    });
  }
}
