import { Response, Request } from "express";
export interface IArticlesIsFoodOrNot {
  articleName: string;
  price: number;
  quantity: number;
  VATType: "B" | "D";
  isFood: boolean;
  index: number;
}

// export interface IrequestCustom {
//   itemsinTicket: IArticlesIsFoodOrNot[];
//   general: Igeneral;
// }

export interface Iresponse {
  articleName: string;
  finalPrice: number;
}

const ticketController = {
  count: async (req: Request, res: Response): Promise<void> => {
    const articles: IArticlesIsFoodOrNot[] = req.body.data[0];
    const discountFood: number = req.body.data[1].discountFood;
    const discountNotFood: number = req.body.data[2].discountNotFood;

    const customResponse = [];

    let finalGlobalPrice: number = 0;
    const articlesFoodFinal: IArticlesIsFoodOrNot[] = articles;

    for (let i = 0; i < articles.length; i++) {
      // Round + percentage
      const toFixedNumberPlusPercentage = (num: number, coef: number) => {
        return (num * coef) / 100;
      };

      // Round
      const round = (value: any, decimals: any) => {
        // @ts-expect-error
        return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
      };

      console.log("Article price : ", articles[i].price);
      // Deducating discount from HT Price

      const discount = toFixedNumberPlusPercentage(
        articles[i].price,
        discountFood
      );
      const HTMinusDiscount = articles[i].price - discount;
      console.log("discount", discount);
      console.log("HTMinusDiscount", HTMinusDiscount);
      //Last + VAT
      const VAT = articles[i].VATType === "B" ? 5.5 : 20;
      const VATAmount: number = (HTMinusDiscount * VAT) / 100;
      const articleFinalPriceRaw = HTMinusDiscount + VATAmount;
      const articleFinalPrice4decim = round(articleFinalPriceRaw, 4);
      const articleFinalPrice2decim = round(articleFinalPriceRaw, 2);
      finalGlobalPrice = finalGlobalPrice + articleFinalPrice4decim;
      console.log("VAT amount : ", VATAmount);
      console.log("articleFinalPrice", articleFinalPrice2decim);

      // Assigning final price
      const tempResponse = {
        articleName: articles[i].articleName,
        articleFinalPrice2decim,
        index: articles[i].index,
      };
      customResponse.push(tempResponse);

      // Incrementing final global price
    }

    console.log("articlesFoodFinal", articlesFoodFinal);
    console.log(finalGlobalPrice);
    // console.log(req.body);
    res.json(customResponse);
  },
};

export default ticketController;
