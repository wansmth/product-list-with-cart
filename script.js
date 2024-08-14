const TABLET_BREAKPOINT = "768px";
const DESKTOP_BREAKPOINT = "1024px";

var totalBasketItems = 0;
var basketCostTotal = 0;
var productCounts = {};

async function getProducts() {
    const response = await fetch("./data.json");
    const products = await response.json();

    return products;
}

function createPictureElement(imageSources) {
    const mobileSrc = document.createElement("source");
    mobileSrc.setAttribute("srcset", imageSources.mobile);

    const tabletSrc = document.createElement("source");
    tabletSrc.setAttribute("media", `(min-width: ${TABLET_BREAKPOINT})`);
    tabletSrc.setAttribute("srcset", imageSources.tablet);

    const desktopSrc = document.createElement("source");
    desktopSrc.setAttribute("media", `(min-width: ${DESKTOP_BREAKPOINT})`);
    desktopSrc.setAttribute("srcset", imageSources.desktop);

    const img = document.createElement("img");
    img.setAttribute("src", imageSources.desktop);

    const picElement = document.createElement("picture");
    picElement.appendChild(desktopSrc);
    picElement.appendChild(tabletSrc);
    picElement.appendChild(mobileSrc);
    picElement.appendChild(img);

    return picElement;
}

function createButton() {
    const basketImage = document.createElement("img");
    basketImage.setAttribute("src", "/assets/images/icon-add-to-cart.svg");

    const button = document.createElement("button");

    button.innerText = "Add to Cart";
    button.appendChild(basketImage);
    button.classList.add("add-to-cart-button");
    button.addEventListener("click", addProductToCart);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    buttonContainer.appendChild(button);

    return buttonContainer;
}

function createListElement(product) {
    const nameElement = document.createElement("p");
    nameElement.textContent = product.name;
    nameElement.classList.add("product__name");

    const categoryElement = document.createElement("p");
    categoryElement.textContent = product.category;
    categoryElement.classList.add("product__category");

    const priceElement = document.createElement("p");
    priceElement.textContent = `$${product.price.toFixed(2)}`;
    priceElement.classList.add("product__price");

    const picElement = createPictureElement(product.image);

    const listElement = document.createElement("li");
    listElement.classList.add("product");

    listElement.appendChild(picElement);
    listElement.appendChild(createButton());
    listElement.appendChild(categoryElement);
    listElement.appendChild(nameElement);
    listElement.appendChild(priceElement);

    productCounts[product.name] = 0;

    return listElement;
}

function createCartRow(product) {
    const container = document.createElement("div");
    container.classList.add("cart-row");

    const name = document.createElement("p");
    name.textContent = product.querySelector(".product__name").textContent;
    name.classList.add("cart-row__name");
    container.appendChild(name);

    const quantity = document.createElement("p");
    quantity.textContent = "1x";
    quantity.classList.add("cart-row__quantity");
    container.appendChild(quantity);

    const individualCost = document.createElement("p");
    individualCost.textContent =
        product.querySelector(".product__price").textContent;
    individualCost.classList.add("cart-row__individualPrice");
    container.appendChild(individualCost);

    const totalCost = document.createElement("p");
    totalCost.textContent =
        product.querySelector(".product__price").textContent;
    totalCost.classList.add("cart-row__combinedPrice");
    container.appendChild(totalCost);

    const removeButton = document.createElement("button");
    const buttonImg = document.createElement("img");
    buttonImg.setAttribute("src", "/assets/images/icon-remove-item.svg");
    removeButton.appendChild(buttonImg);
    removeButton.classList.add("cart-remove-button");

    container.appendChild(removeButton);

    return container;
}

async function populateProductList() {
    const productList = document.getElementById("product-list");
    const productData = await getProducts();

    for (let product of productData) {
        const listElement = createListElement(product);
        productList.appendChild(listElement);
    }
}

function addProductToCart(e) {
    if (totalBasketItems == 0) {
        setCartNonEmpty();
    }

    const targetProduct = e.target.parentNode.parentNode;

    // TODO: BUG: Possible to outline the button decoration.
    targetProduct.querySelector("img").classList.add("product--outlined");
    updateBasket(targetProduct);
    updateTotalCost(targetProduct);

    const cartRow = createCartRow(targetProduct);
    const basketElement = document.querySelector(".basket");
    const basketButtonElement = basketElement.querySelector(
        "#confirm-order-button"
    );
    basketElement.insertBefore(cartRow, basketButtonElement);
}

function setCartNonEmpty() {
    const cart = document.querySelector(".basket");

    cart.querySelector(".empty-cart-display").classList.add("hidden");
    cart.querySelector("button").classList.remove("hidden");
}

function updateBasket(product) {
    const productName = product.querySelector(".product__name").textContent;
    productCounts[productName]++;
    totalBasketItems++;

    document.querySelector("#basket-quantity").textContent = totalBasketItems;
}

function updateTotalCost(product) {
    const productCost = product.querySelector(".product__price").textContent;

    basketCostTotal += Number(productCost.slice(1));
}

populateProductList();
