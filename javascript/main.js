import { populateProductList } from "./product-list-manager.js";
import { cartSetup } from "./cart-manager.js";
import { modalSetup } from "./modal.js";

export let productInfo = {};

export let productCounts = {};

async function loadProducts() {
    const response = await fetch("./data.json");
    const products = await response.json();

    return products;
}

function indexProducts(rawProducts) {
    for (let product of rawProducts) {
        productInfo[product.name.replaceAll(" ", "_")] = {
            category: product.category,
            price: product.price.toFixed(2),
            thumbnail: product.image.thumbnail,
        };
    }
}

modalSetup();
cartSetup();
const rawProductData = await loadProducts();
populateProductList(rawProductData);
indexProducts(rawProductData);
