import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, Category } from 'src/models';
import { Promotion } from 'src/models/promotion.model';
import { TyboShopModel } from 'src/models/TyboShop';
import { ProductService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { UxService } from 'src/services/ux.service';
import { DISCOUNT_APPLIES_TO } from 'src/shared/constants';

@Component({
  selector: 'app-shop-collection',
  templateUrl: './shop-collection.component.html',
  styleUrls: ['./shop-collection.component.scss']
})
export class ShopCollectionComponent implements OnInit {

  product: Product;
  productSlug: string;
  totalPrice = 0;
  quantity = 0;
  catergoryId: string;
  catergory: Category;
  @Output() navAction: EventEmitter<boolean> = new EventEmitter<boolean>();
  tyboShopModel: TyboShopModel;
  products: Product[];
  heading: string;
  promotions: Promotion[];
  promotion: Promotion;

  constructor(
    private activatedRoute: ActivatedRoute,
    private homeShopService: HomeShopService,
    private uxService: UxService,
    private productService: ProductService,
    private router: Router,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.catergoryId = r.id;
      this.getProducts();
      this.heading = this.catergoryId === 'men' ? `Men's perfumes` : ` Ladies perfumes`;
    });
  }

  ngOnInit() {
  }


  updateTotalPrice(quantity) {
    if (!quantity) {
      quantity = 1;
    }
    this.quantity = quantity;
  }
  onNavItemClicked(p) { }
  back() {
    if (this.catergory && this.catergory.Products && this.catergory.Products.length) {
      const model = this.catergory.Products[0];
      this.router.navigate([model.CompanyId]);
      return;
    }
    this.router.navigate(['']);
  }

  viewMore(product: Product) {
    if (product) {
      this.uxService.keepNavHistory({
        BackToAfterLogin: `collections/${this.catergoryId}`,
        BackTo: `collections/${this.catergoryId}`,
        ScrollToProduct: null
      });
      this.homeShopService.updateProductState(product);
      this.router.navigate(['shop/product', product.ProductSlug])
    }
  }

  getProducts() {

    this.tyboShopModel = this.productService.currentTyboShopValue;
    this.productService.tyboShopObservable.subscribe(data => {
      if (data && data) {
        this.products = data.Products;
        this.promotions = data.Promotions;
        this.promotion = this.promotions.find(x => x.AppliesTo === DISCOUNT_APPLIES_TO[1]);


        this.productService.applyPromotions(this.promotions,this.products)
        this.products = this.products.filter(x => x.ParentCategoryGuid === this.catergoryId);

      }
    });

  }
}
