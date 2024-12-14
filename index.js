// Considering the boxesData as a response fetched from the server side.

// I took offer, ooferPrice and actual price from backend because In real project those values are fetched from backend.

const boxesData = [
    {
        title: "1 Unit",
        subTitle: "Standard Price",
        offer: "10% Off",
        offerPrice: 21.60, // 10% off from actualPrice
        actualPrice: 24.00,
        options: {
            size: ["S", "M", "L"],
            color: ["Red", "Blue", "Green"]
        },
        mostPopular: false,
    },
    {
        title: "2 Unit",
        subTitle: "Standard Price",
        offer: "20% Off",
        offerPrice: 38.40, // 20% off from actualPrice * 2
        actualPrice: 48.00, // 24 * 2
        options: {
            size: ["S", "M", "L"],
            color: ["Red", "Blue", "Green"]
        },
        mostPopular: true,
    },
    {
        title: "3 Unit",
        subTitle: "Standard Price",
        offer: "30% Off",
        offerPrice: 50.40, // 30% off from actualPrice * 3
        actualPrice: 72.00, // 24 * 3
        options: {
            size: ["S", "M", "L"],
            color: ["Red", "Blue", "Green"]
        },
        mostPopular: false,
    }
];

const container = document.getElementById('box-container');

function createBox( boxData, index ) {
    const box = document.createElement('div');
    box.classList.add( `box`);
    box.classList.add( `box_${index + 1}`);

    const header = document.createElement('div');
    header.classList.add('box-header');
    box.addEventListener('click', () => toggleBox(box, index, boxData));

    const titleWrapper = document.createElement('div');
    titleWrapper.classList.add('box-title-wrapper');

    const radioButton = document.createElement('input');
    radioButton.classList.add('box-radio');
    radioButton.type = 'radio';
    radioButton.name = 'groupName';
    radioButton.value = 'value';

    const valueWrapper = document.createElement('div');
    valueWrapper.classList.add('box-value-wrapper');
    
    const titleWithOfferWrapper = document.createElement('div');
    titleWithOfferWrapper.classList.add('box-title-with-offer-wrapper');
    const title = document.createElement('span');
    title.classList.add('box-title');
    title.textContent = boxData.title;
    const offer = document.createElement('span');
    offer.classList.add('box-offer');
    offer.textContent = boxData.offer;
    titleWithOfferWrapper.appendChild(title);
    titleWithOfferWrapper.appendChild(offer);

    const subTitle = document.createElement('span');
    subTitle.classList.add('box-sub-title');
    subTitle.textContent = boxData.subTitle;
    valueWrapper.appendChild(titleWithOfferWrapper);
    valueWrapper.appendChild(subTitle);
    titleWrapper.appendChild(radioButton);
    titleWrapper.appendChild(valueWrapper);

    const amountWrapper = document.createElement('div');
    amountWrapper.classList.add('box-amount-wrapper');
    const offerPrice = document.createElement('span');
    offerPrice.classList.add('box-offer-price');
    offerPrice.textContent = `$${boxData.offerPrice.toFixed(2)} USD`;
    const actualPrice = document.createElement('span');
    actualPrice.classList.add('box-actual-price');
    actualPrice.textContent = `$${boxData.actualPrice.toFixed(2)} USD`;
    amountWrapper.appendChild(offerPrice);
    amountWrapper.appendChild(actualPrice);

    header.appendChild(titleWrapper);
    header.appendChild(amountWrapper);

    if (boxData.mostPopular) {
        const badge = document.createElement('div');
        badge.classList.add('most-popular');
        badge.textContent = 'Most Popular';
        header.appendChild(badge);

        // Selecting most popular by default.
        radioButton.checked = true;
        box.classList.add('active');
        const checkoutTotalAmount = document.getElementById('checkout-totalAmount');
        checkoutTotalAmount.textContent = boxData.offerPrice;
    }
    box.appendChild(header);

    const content = document.createElement('div');
    content.classList.add('box-content');
    if (!boxData.mostPopular) content.classList.add('hidden');
    content.appendChild(createTable(boxData, index));
    box.appendChild(content);

    return box;
}

// Creating table dynamically on the basis of Units.
function createTable(boxData, index) {
    const optionsTable = document.createElement('table');
    optionsTable.classList.add('options-table');
    const headerRow = document.createElement('tr');
    headerRow.classList.add('options-table-header');
    headerRow.classList.add(`row_${index+1}`);
    const headers = ["", "Size", "Colour"];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    optionsTable.appendChild(headerRow);

    const numberOfRows = index + 1;
    for (let i = 0; i < numberOfRows; i++) {

        const row = document.createElement('tr');

        // Add index column
        const indexCell = document.createElement('td');
        indexCell.textContent = `#${i + 1}`;
        row.appendChild(indexCell);

        // Add size dropdown
        const sizeCell = document.createElement('td');
        const sizeSelect = document.createElement('select');
        boxData.options.size.forEach((size) => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeSelect.appendChild(option);
        });
        sizeCell.appendChild(sizeSelect);
        row.appendChild(sizeCell);

        // Add color dropdown
        const colorCell = document.createElement('td');
        const colorSelect = document.createElement('select');
        boxData.options.color.forEach((color) => {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color;
            colorSelect.appendChild(option);
        });
        colorCell.appendChild(colorSelect);
        row.appendChild(colorCell);
        
        optionsTable.appendChild(row);
    }

    return optionsTable;
}

// Toggler for cards.
function toggleBox(box, index, value) {
    const allBoxes = document.querySelectorAll('.box');
    allBoxes.forEach((otherBox) => {
        otherBox.classList.remove('active');
        otherBox.querySelector('.box-content').classList.add('hidden');
        const radioButton = otherBox.querySelector('.box-radio');
        if (radioButton) radioButton.checked = false;
    });
    const content = box.querySelector('.box-content');
    content.classList.toggle('hidden');
    box.classList.add('active');
    const radioButton = box.querySelector('.box-radio');
    if (radioButton) radioButton.checked = true;

    const checkoutTotalAmount = document.getElementById('checkout-totalAmount');
    checkoutTotalAmount.textContent = value.offerPrice;
    
}

// Add to cart button handler.
const checkoutAddToCartButton = document.getElementById('checkout-addToCart-button');
checkoutAddToCartButton.addEventListener('click', () => {
    const activeBox = document.querySelector('.box.active');

    if (activeBox) {
        const table = activeBox.querySelector('.options-table');
        const cartItem = {
            title: activeBox.querySelector('.box-title').textContent,
            options: []
        };
        const rows = table.querySelectorAll('tr:not(.options-table-header)');
        rows.forEach((row, rowIndex) => {
            const rowData = {
                row: rowIndex + 1,
                size: row.querySelector('select').value,
                color: row.querySelectorAll('select')[1].value,
            };
            cartItem.options.push(rowData);
        });
        console.log(cartItem);
        // Instead of consoling the data we can send the post request for sending the data to backend OR perform the logic as per requirement.
    } else {
        console.log("No active box selected!");
        // Instead of consoling this we can show some Errors from this.
    }
});

// Dynamically adding each entry
boxesData.forEach((boxData, index) => {
    const box = createBox(boxData, index);
    container.appendChild(box);
});