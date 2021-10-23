import { Response, Request } from "express";
export interface IArticlesIsFoodOrNot {
  articleName: string;
  price: number;
  quantity: number;
  VATType: "B" | "D";
}

export interface Igeneral {
  articles: IArticlesIsFoodOrNot[];
  total?: string;
  discountPercentageFood: number;
  discountPercentageNotFood: number;
}

export interface IrequestCustom {
  itemsinTicket: IArticlesIsFoodOrNot[];
  general: Igeneral;
}

export interface Iresponse {
  articleName: string;
  finalPrice: number;
}

const ticketController = {
  count: async (req: Request, res: Response): Promise<void> => {
    const { articles, discountPercentageFood, discountNotFood } = req.body;
    const articlesFood: IArticlesIsFoodOrNot[] = articles.isFood;
    const articlesNotFood = articles.isNotFood;
    console.log(articlesFood);

    const customResponse = [];

    let finalGlobalPrice: number = 0;
    const articlesFoodFinal: IArticlesIsFoodOrNot[] = articlesFood;

    for (let i = 0; i < articlesFood.length; i++) {
      // Round + percentage
      const toFixedNumberPlusPercentage = (num: number, coef: number) => {
        return (num * coef) / 100;
      };

      // Round
      const round = (value: any, decimals: any) => {
        // @ts-expect-error
        return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
      };

      console.log("Article price : ", articlesFood[i].price);
      // Deducating discount from HT Price
      const discount = toFixedNumberPlusPercentage(
        articlesFood[i].price,
        discountPercentageFood
      );
      const HTMinusDiscount = articlesFood[i].price - discount;
      console.log("discount", discount);
      console.log("HTMinusDiscount", HTMinusDiscount);
      //Last + VAT
      const VAT = articlesFood[i].VATType === "B" ? 5.5 : 20;
      const VATAmount: number = (HTMinusDiscount * VAT) / 100;
      const articleFinalPriceRaw = HTMinusDiscount + VATAmount;
      const articleFinalPrice4decim = round(articleFinalPriceRaw, 4);
      const articleFinalPrice2decim = round(articleFinalPriceRaw, 2);
      finalGlobalPrice = finalGlobalPrice + articleFinalPrice4decim;
      console.log("VAT amount : ", VATAmount);
      console.log("articleFinalPrice", articleFinalPrice2decim);

      // Assigning final price
      const tempResponse = {
        articleName: articlesFood[i].articleName,
        articleFinalPrice2decim,
      };
      customResponse.push(tempResponse);

      // Incrementing final global price
    }

    console.log("articlesFoodFinal", articlesFoodFinal);
    console.log(finalGlobalPrice);
    res.json(customResponse);
  },
};

export default ticketController;
