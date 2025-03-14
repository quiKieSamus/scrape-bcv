import { DOMParser } from "@b-fuze/deno-dom";

/**
 * This represents the css selectors
 * that can be seen in the html of the
 * Banco Central de Venezuela's website.
 */
export enum Currency {
  dolar = "#dolar",
  euro = "#euro",
  lira = "#lira",
  yuan = "#yuan",
  rublo = "#rublo",
}

/**
 *
 * @param currency Currency css selector
 * @returns {Promise<number>} Returns promise with the numeric value of the currency exchange value
 */
export async function getCurrencyFromBCV(currency: Currency): Promise<number> {
  const res = await fetch("https://bcv.org.ve");
  const text = await res.text();
  const dom = new DOMParser().parseFromString(text, "text/html");

  const el = dom.querySelector(currency);

  if (!el) throw new Error("Dollar element not found.");

  return Number(
    el.children[0].children[0].children[1].children[0].textContent.trim().replace(",", ".")
  );
}

export async function getAllCurrenciesFromBCV(): Promise<{ [x: string]: number }[]> {
  const res = await fetch("https://bcv.org.ve");
  const text = await res.text();
  const dom = new DOMParser().parseFromString(text, "text/html");

  return Object.entries(Currency).map(function (element) {
    const el = dom.querySelector(element[1]);

    if (!el) throw new Error("Dollar element not found.");

    return {
      [element[0]]: Number(el.children[0].children[0].children[1].children[0].textContent.trim().replace(",", ".")),
    };
  });
}