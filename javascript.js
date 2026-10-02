const products = [
    {
        id: 1,
        name: "Biscoitos naturais",
        category: "Petiscos",
        description: "Um mimo saboroso para seu melhor amigo.",
        price: 24.90
    },
    {
        id: 2,
        name: "Bola interativa",
        category: "Brinquedos",
        description: "Diversão para deixar o dia mais interessante.",
        price: 39.90
    },
    {
        id: 3,
        name: "Shampoo suave",
        category: "Cuidados",
        description: "Limpeza delicada para o seu pet.",
        price: 32.90
    },
    {
        id: 4,
        name: "Cama aconchegante",
        category: "Conforto",
        description: "Um cantinho confortável para descansar.",
        price: 89.90
    },
    {
        id: 5,
        name: "Mordedor natural",
        category: "Brinquedos",
        description: "Para brincar e se divertir.",
        price: 29.90
    },
    {
        id: 6,
        name: "Kit passeio",
        category: "Acessórios",
        description: "Tudo para deixar o passeio mais tranquilo.",
        price: 59.90
    }
];


/* =========================
   ESTADO
========================= */

let cart = [];
let currentCategory = null;
let searchTerm = "";

let maxMessageIndex = 0;
let maxMessageTimeout;


/* =========================
   ELEMENTOS
========================= */

const productsGrid = document.getElementById("products-grid");

const cartCount = document.getElementById("cart-count");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

const cartButton = document.getElementById("cart-button");
const closeCart = document.getElementById("close-cart");

const menuButton = document.getElementById("menu-button");
const navigation = document.getElementById("navigation");

const searchButton = document.getElementById("search-button");
const searchArea = document.getElementById("search-area");
const searchInput = document.getElementById("search-input");
const closeSearch = document.getElementById("close-search");

const categoryCards =
    document.querySelectorAll(".category-card");

const clearFilter =
    document.getElementById("clear-filter");

const storeStatus =
    document.getElementById("store-status");

const noResults =
    document.getElementById("no-results");

const resetSearch =
    document.getElementById("reset-search");

const meetMax =
    document.getElementById("meet-max");

const max =
    document.getElementById("max");

const maxMessage =
    document.getElementById("max-message");

const maxStoreLink =
    document.getElementById("max-store-link");

const checkoutButton =
    document.getElementById("checkout-button");

const toast =
    document.getElementById("toast");


/* =========================
   UTILIDADES
========================= */

function formatPrice(value) {

    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


function showToast(message) {

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("active");

    clearTimeout(showToast.timeout);

    showToast.timeout = setTimeout(() => {

        toast.classList.remove("active");

    }, 2500);

}


/* =========================
   PRODUTOS
========================= */

function getFilteredProducts() {

    return products.filter(product => {

        const matchesCategory =
            !currentCategory ||
            currentCategory.includes(product.category);

        const searchableText = `
            ${product.name}
            ${product.category}
            ${product.description}
        `.toLowerCase();

        const matchesSearch =
            !searchTerm ||
            searchableText.includes(searchTerm);

        return matchesCategory && matchesSearch;

    });

}


function renderProducts() {

    const filteredProducts =
        getFilteredProducts();

    productsGrid.innerHTML = "";


    if (filteredProducts.length === 0) {

        noResults.hidden = false;

        storeStatus.textContent =
            "Nenhum produto encontrado.";

        return;

    }


    noResults.hidden = true;


    if (currentCategory) {

        storeStatus.textContent =
            `${filteredProducts.length} produto${filteredProducts.length > 1 ? "s" : ""} encontrado${filteredProducts.length > 1 ? "s" : ""}`;

    } else if (searchTerm) {

        storeStatus.textContent =
            `${filteredProducts.length} resultado${filteredProducts.length > 1 ? "s" : ""}`;

    } else {

        storeStatus.textContent =
            "Todos os produtos";

    }


    productsGrid.innerHTML =
        filteredProducts.map(product => {

            return `
                <article class="product-card">

                    <div class="product-image product-${product.id}">

    <div class="product-art">
        <span>${getProductSymbol(product.category)}</span>
    </div>

</div>


                    <div class="product-info">

                        <span class="product-category">
                            ${product.category}
                        </span>


                        <h3 class="product-name">
                            ${product.name}
                        </h3>


                        <p class="product-description">
                            ${product.description}
                        </p>


                        <div class="product-bottom">

                            <strong class="product-price">
                                ${formatPrice(product.price)}
                            </strong>


                            <button
                                class="add-product"
                                data-id="${product.id}"
                                type="button"
                            >
                                Adicionar
                            </button>

                        </div>

                    </div>

                </article>
            `;

        }).join("");


    document
        .querySelectorAll(".add-product")
        .forEach(button => {

            button.addEventListener("click", () => {

                const productId =
                    Number(button.dataset.id);

                addToCart(productId);

            });

        });

}


function getProductSymbol(category) {

    const symbols = {

        "Petiscos": "Mimo",
        "Brinquedos": "Diversão",
        "Cuidados": "Cuidado",
        "Conforto": "Conforto",
        "Acessórios": "Passeio"

    };

    return symbols[category] || "MAXPET";

}


/* =========================
   FILTROS
========================= */

categoryCards.forEach(card => {

    card.addEventListener("click", () => {

        const categories =
            card.dataset.category
                .split(",")
                .map(category => category.trim());

        currentCategory = categories;

        searchTerm = "";

        if (searchInput) {
            searchInput.value = "";
        }

        renderProducts();

        document
            .getElementById("loja")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

});


clearFilter.addEventListener(
    "click",
    clearAllFilters
);


resetSearch.addEventListener(
    "click",
    clearAllFilters
);


function clearAllFilters() {

    currentCategory = null;

    searchTerm = "";

    if (searchInput) {
        searchInput.value = "";
    }

    renderProducts();

}


/* =========================
   PESQUISA
========================= */

searchButton.addEventListener("click", () => {

    searchArea.classList.toggle("active");

    const isOpen =
        searchArea.classList.contains("active");

    searchArea.setAttribute(
        "aria-hidden",
        String(!isOpen)
    );


    if (isOpen && searchInput) {

        setTimeout(() => {

            searchInput.focus();

        }, 200);

    }

});


closeSearch.addEventListener("click", () => {

    searchArea.classList.remove("active");

    searchArea.setAttribute(
        "aria-hidden",
        "true"
    );

});


searchInput.addEventListener(
    "input",
    event => {

        searchTerm =
            event.target.value
                .trim()
                .toLowerCase();

        renderProducts();

    }
);


/* =========================
   CARRINHO
========================= */

function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );

    if (!product) return;


    const existingProduct =
        cart.find(
            item => item.id === productId
        );


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }


    updateCart();

    animateCartCount();

    showToast(
        `${product.name} foi adicionado ao carrinho.`
    );

    openCart();

}


function updateCart() {

    const quantity =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    cartCount.textContent = quantity;


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Seu carrinho está vazio.
            </p>
        `;

    } else {

        cartItems.innerHTML =
            cart.map(item => {

                return `
                    <div class="cart-item">

                        <div class="cart-item-info">

                            <h3>
                                ${item.name}
                            </h3>

                            <p>
                                ${item.quantity} ×
                                ${formatPrice(item.price)}
                            </p>

                            <div class="cart-item-price">
                                ${formatPrice(
                                    item.price *
                                    item.quantity
                                )}
                            </div>

                        </div>


                        <div class="cart-item-actions">

                            <button
                                type="button"
                                data-action="decrease"
                                data-id="${item.id}"
                                aria-label="Diminuir quantidade"
                            >
                                −
                            </button>


                            <span>
                                ${item.quantity}
                            </span>


                            <button
                                type="button"
                                data-action="increase"
                                data-id="${item.id}"
                                aria-label="Aumentar quantidade"
                            >
                                +
                            </button>


                            <button
                                type="button"
                                class="cart-item-remove"
                                data-action="remove"
                                data-id="${item.id}"
                                aria-label="Remover produto"
                            >
                                ×
                            </button>

                        </div>

                    </div>
                `;

            }).join("");


        document
            .querySelectorAll(
                ".cart-item-actions button"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                button.dataset.id
                            );

                        const action =
                            button.dataset.action;


                        if (
                            action === "increase"
                        ) {

                            changeQuantity(id, 1);

                        }


                        if (
                            action === "decrease"
                        ) {

                            changeQuantity(id, -1);

                        }


                        if (
                            action === "remove"
                        ) {

                            removeFromCart(id);

                        }

                    }
                );

            });

    }


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );

    cartTotal.textContent =
        formatPrice(total);

}


function changeQuantity(
    productId,
    amount
) {

    const product =
        cart.find(
            item => item.id === productId
        );

    if (!product) return;


    product.quantity += amount;


    if (product.quantity <= 0) {

        cart =
            cart.filter(
                item => item.id !== productId
            );

    }


    updateCart();

}


function removeFromCart(productId) {

    const product =
        cart.find(
            item => item.id === productId
        );


    cart =
        cart.filter(
            item => item.id !== productId
        );


    updateCart();


    if (product) {

        showToast(
            `${product.name} foi removido.`
        );

    }

}


function animateCartCount() {

    cartCount.classList.remove("bump");

    void cartCount.offsetWidth;

    cartCount.classList.add("bump");

    setTimeout(() => {

        cartCount.classList.remove("bump");

    }, 250);

}


/* =========================
   ABRIR / FECHAR CARRINHO
========================= */

function openCart() {

    cartPanel.classList.add("active");

    cartOverlay.classList.add("active");

    cartPanel.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "cart-open"
    );

}


function closeCartPanel() {

    cartPanel.classList.remove("active");

    cartOverlay.classList.remove("active");

    cartPanel.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "cart-open"
    );

}


cartButton.addEventListener(
    "click",
    openCart
);


closeCart.addEventListener(
    "click",
    closeCartPanel
);


cartOverlay.addEventListener(
    "click",
    closeCartPanel
);


/* =========================
   MENU MOBILE
========================= */

menuButton.addEventListener(
    "click",
    () => {

        const isOpen =
            navigation.classList.toggle(
                "active"
            );

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    }
);


navigation
    .querySelectorAll("a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navigation.classList.remove(
                    "active"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }
        );

    });


/* =========================
   MAX
========================= */

const maxMessages = [
    "Oi! Eu sou o Max.",
    "Você encontrou o lugar certo para o seu melhor amigo.",
    "Aqui tem carinho de sobra.",
    "Vamos encontrar alguma coisa para você?"
];


function showMaxMessage(
    message,
    duration = 4000
) {

    if (!maxMessage) return;


    /*
       IMPORTANTE:
       Alteramos apenas o texto.
       O botão "Conhecer a loja"
       continua no HTML.
    */

    const messageText =
        maxMessage.querySelector("strong");


    if (messageText) {

        messageText.textContent =
            message;

    }


    maxMessage.classList.add(
        "visible"
    );


    clearTimeout(
        maxMessageTimeout
    );


    if (duration > 0) {

        maxMessageTimeout =
            setTimeout(() => {

                maxMessage.classList.remove(
                    "visible"
                );

            }, duration);

    }

}


function reactToMax() {

    if (!max) return;


    max.classList.remove(
        "max-happy"
    );

    void max.offsetWidth;

    max.classList.add(
        "max-happy"
    );


    maxMessageIndex =
        (maxMessageIndex + 1) %
        maxMessages.length;


    showMaxMessage(
        maxMessages[maxMessageIndex]
    );

}


max.addEventListener(
    "click",
    reactToMax
);


/* =========================
   CONHEÇA O MAX
========================= */

meetMax.addEventListener(
    "click",
    () => {

        document
            .getElementById("inicio")
            .scrollIntoView({
                behavior: "smooth"
            });


        setTimeout(() => {

            reactToMax();

        }, 500);

    }
);


/* =========================
   ENTRADA NO SITE
========================= */

setTimeout(() => {

    showMaxMessage(
        "Seja bem-vindo à MAXPET.",
        0
    );

}, 900);


/* =========================
   BOTÃO CONHECER A LOJA
========================= */

maxStoreLink.addEventListener(
    "click",
    () => {

        const loja =
            document.getElementById("loja");


        if (!loja) return;


        loja.scrollIntoView({
            behavior: "smooth"
        });


        maxMessage.classList.remove(
            "visible"
        );

    }
);


/* =========================
   PISCAR NATURALMENTE
========================= */

function maxBlink() {

    if (!max) return;


    max.classList.add(
        "max-blink"
    );


    setTimeout(() => {

        max.classList.remove(
            "max-blink"
        );

    }, 140);

}


function scheduleBlink() {

    const delay =
        3500 +
        Math.random() * 4500;


    setTimeout(() => {

        maxBlink();

        scheduleBlink();

    }, delay);

}


scheduleBlink();


/* =========================
   REVELAÇÃO AO ROLAR
========================= */

function prepareRevealElements() {

    const elements =
        document.querySelectorAll(
            ".section-heading, .category-card, .product-card, .care-list article, .about-content"
        );


    elements.forEach(element => {

        element.classList.add(
            "reveal"
        );

    });


    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(element => {

            element.classList.add(
                "visible"
            );

        });

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(element => {

        observer.observe(element);

    });

}


/* =========================
   CHECKOUT WHATSAPP
========================= */

checkoutButton.addEventListener(
    "click",
    checkout
);


function checkout() {

    if (cart.length === 0) {

        showToast(
            "Adicione algum produto antes de finalizar."
        );

        return;

    }


    const phone =
        "5598991929943";


    const itemsText =
        cart
            .map(item => {

                return `${item.quantity}x ${item.name} — ${formatPrice(
                    item.price * item.quantity
                )}`;

            })
            .join("\n");


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    const message =
        `Olá! Gostaria de fazer um pedido na MAXPET.\n\n${itemsText}\n\nTotal: ${formatPrice(total)}`;


    const whatsappURL =
        `https://wa.me/${phone}?text=${encodeURIComponent(
            message
        )}`;


    window.open(
        whatsappURL,
        "_blank"
    );

}


/* =========================
   TECLADO
========================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeCartPanel();


            searchArea.classList.remove(
                "active"
            );


            searchArea.setAttribute(
                "aria-hidden",
                "true"
            );


            navigation.classList.remove(
                "active"
            );


            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );


            maxMessage.classList.remove(
                "visible"
            );

        }

    }
);


/* =========================
   INICIALIZAÇÃO
========================= */

renderProducts();

updateCart();

prepareRevealElements();

// =========================
// ENTRAR NA LOJA
// =========================

const enterStore = document.getElementById("enter-store");
const storeWelcome = document.getElementById("store-welcome");

if (enterStore && storeWelcome) {
    enterStore.addEventListener("click", () => {
        storeWelcome.classList.add("hidden");

        setTimeout(() => {
            storeWelcome.style.display = "none";
        }, 650);
    });
}