$(document).on('click', '.detailCart', function() {
    const detailCartId = parseInt($('#productId').val());
    const detailImage = $('.detailImage').attr('alt');
    const detailName = $('.detailName').text();
    const detailPrice = parseFloat($('.detailPrice').val());
    const detailQuantity = parseInt($('#quantityInput').val());

    const cartAddArry = JSON.parse(localStorage.getItem('cartAddArry')) || [];
    const cartItem = {
        'productCartId': detailCartId,
        'productImage': detailImage,
        'productName': detailName,
        'productPrice': detailPrice, // Calculate total price
        'productTotalPrice' : detailPrice * detailQuantity, // Initialize with productPrice * 1
        'productQuantity': detailQuantity
    };

    const updatedCart = addToDetailCartOrIncreaseQuantity(cartAddArry, cartItem);

    localStorage.setItem('cartAddArry', JSON.stringify(updatedCart));

    console.log('상품 ID (장바구니): ' + detailCartId);
    console.log('상품명 (장바구니): ' + detailName);
    console.log('상품가격 (장바구니): ' + cartItem.productTotalPrice); // Calculate total price
    console.log('상품이미지 (장바구니): ' + detailImage);
    console.log('상품개수 (장바구니): ' + detailQuantity);
    console.log('상품최종장비구니:' + JSON.stringify(cartAddArry));
});


function addToDetailCartOrIncreaseQuantity(cartArray, cartItem) {
    let found = false;

    for (let i = 0; i < cartArray.length; i++) {
        if (cartArray[i].productCartId === cartItem.productCartId &&
            cartArray[i].productImage === cartItem.productImage &&
            cartArray[i].productName === cartItem.productName) {
            cartArray[i].productTotalPrice = parseFloat(cartArray[i].productTotalPrice) + parseFloat(cartItem.productTotalPrice);
            cartArray[i].productQuantity = parseInt(cartArray[i].productQuantity) + parseInt(cartItem.productQuantity);
            found = true;
            break;
        }
    }

    if (!found) {
        cartItem.productTotalPrice = cartItem.productPrice * cartItem.productQuantity; // Initialize productTotalPrice

        cartArray.push(cartItem);
    }

    return cartArray;
}


$(document).on('click', 'a#productCart', function() {
    const productCartId = parseInt($(this).data('product-id'));
    const productImage = $(this).closest('li').find('.productImage').attr('alt');
    const productName = $(this).closest('li').find('.productName').text();
    const productPrice = parseFloat($(this).closest('li').find('.productPrice').val());

    const cartAddArry = JSON.parse(localStorage.getItem('cartAddArry')) || [];
    const cartItem = {
        'productCartId': productCartId,
        'productImage': productImage,
        'productName': productName,
        'productPrice': productPrice,
        'productTotalPrice' : productPrice * 1, // Initialize with productPrice * 1
        'productQuantity': 1
    };

    const updatedCart = addToCartOrIncreaseQuantity(cartAddArry, cartItem);

    localStorage.setItem('cartAddArry', JSON.stringify(updatedCart));
});

function addToCartOrIncreaseQuantity(cartArray, cartItem) {
    let found = false;

    for (let i = 0; i < cartArray.length; i++) {
        if (cartArray[i].productCartId === cartItem.productCartId &&
            cartArray[i].productImage === cartItem.productImage &&
            cartArray[i].productName === cartItem.productName) {
            cartArray[i].productTotalPrice = parseFloat(cartArray[i].productTotalPrice) + parseFloat(cartItem.productPrice);
            cartArray[i].productQuantity = parseInt(cartArray[i].productQuantity) + parseInt(cartItem.productQuantity);
            found = true;
            break;
        }
    }

    if (!found) {
        cartItem.productTotalPrice = cartItem.productPrice * cartItem.productQuantity; // Initialize productTotalPrice

        cartArray.push(cartItem);
    }

    return cartArray;
}

$(document).on('click', 'a#rightCart, #menuCart', function () {
    const cartAddArry = JSON.parse(localStorage.getItem('cartAddArry') || '[]');

    axios({
        method: 'post',
        url: '/user/cartAxios',
        data: {
            "cartArry" : JSON.stringify(cartAddArry)
        }
        ,  // 이미 JavaScript 객체이므로 JSON.stringify()를 사용하지 않습니다.
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
            const cartDataParam = encodeURIComponent(JSON.stringify(res.data));

            location.href='user/cart?cartData=' + cartDataParam;
    })
});