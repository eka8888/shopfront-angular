import { Component, DestroyRef, inject, OnInit } from '@angular/core';
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
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    const subscription = this.activatedRoute.queryParams.subscribe((params) => {
      const { searchFor } = params;

      this.searchService.userInput.set(searchFor ?? '');
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
