import axios from "axios";

const BINANCE_API = "https://api.binance.com";

const Assets = {
  sol: {
    id: "SOL",
    symbol: "",
    locale: "en-US"
  },
  usd: {
    id: "BUSD",
    symbol: "$",
    locale: "en-US"
  },
  brl: {
    id: "BRL",
    symbol: "R$",
    locale: "pt-BR"
  }
} as const;

type AssetsType = keyof typeof Assets;

type GetPriceProps = {
  base?: AssetsType;
  target: AssetsType;
  balance: number;
};

interface GetPriceResponse {
  price: number;
  formattedPrice: string;
}

const getPrice = async ({ base = "sol", target, balance }: GetPriceProps): Promise<GetPriceResponse> => {
  const baseId = Assets[base].id;
  const targetObject = Assets[target];
  const targetId = targetObject.id;

  const priceAvgEndpoint = `${BINANCE_API}/api/v3/avgPrice?symbol=${baseId}${targetId}`;
  let assetPrice = 0;

  try {
    const response = await axios.get(priceAvgEndpoint);
    assetPrice = +response.data.price;
  } catch (error) {
    console.log(error);
  }

  const balanceConverted = assetPrice * balance;
  return {
    price: balanceConverted,
    formattedPrice: formatBalance(balanceConverted, targetObject.symbol, targetObject.locale)
  };
};

function formatBalance(balance: number, symbol: string, locale: string) {
  try {
    return `${symbol} ${balance.toLocaleString(locale, {
      minimumIntegerDigits: 2,
      useGrouping: false,
      maximumFractionDigits: 2
    })}`;
  } catch (_) {
    return `${symbol} 0`;
  }
}

export default getPrice;
