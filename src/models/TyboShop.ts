import { Company } from "./company.model";
import { Product } from "./product.model";
import { Promotion } from "./promotion.model";

export interface TyboShopModel {
  Picked?: Product[];
  Products?: Product[];
  Campanies?: Company[];
  CurrentCompany?: Company;
  Promotions?: Promotion[];
}