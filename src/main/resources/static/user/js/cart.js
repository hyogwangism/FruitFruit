/**
 * 메인페이지에서 장바구니아이콘 클릭시 해당 상품정보 Localstorage에 추가되는 함수
 */
const now = new Date();
let expiration;

$(document).on('click', 'a#productCart', function () {
    const productCartId = parseInt($(this).data('product-id'));
    const productImage = $(this).closest('li').find('.productImage').attr('src');
    const productName = $(this).closest('li').find('.productName').text();
    const productInitPrice = parseFloat($(this).closest('li').find('.productInitPrice').val());
    const productDiscount = parseInt($(this).closest('li').find('.productDiscount').val());
    const productDiscountPrice = parseFloat($(this).closest('li').find('.productDiscountPrice').val());
    const productDiscountedPrice = parseFloat($(this).closest('li').find('.productDiscountedPrice').val());

    const cartAddArry = JSON.parse(localStorage.getItem('cartAddArry')) || [];
    const cartItem = {
        'productId': productCartId,
        'productImage': productImage,
        'productName': productName,
        'productInitPrice': productInitPrice, //상품 최초 가격
        'productDiscount': productDiscount, //상품 할인율
        'productDiscountPrice': productDiscountPrice, //상품 할인 가격
        'productDiscountedPrice': productDiscountedPrice,//할인 적용된 상품 가격
        'productInitTotalPrice': productInitPrice * 1, //상품 할인 적용되기 전 총 가격
        'productTotalDiscountPrice': productDiscountPrice * 1, // 상품 할인 총 가격
        'productTotalPrice': productDiscountedPrice * 1, // 상품 할인 적용된 총 가격
        'productQuantity': 1,
         expiration: now.getTime() + 1440 * 60 * 1000 // 현재 시간에 유효 기간을 더한 값
    };

    const updatedCart = addToCartOrIncreaseQuantity(cartAddArry, cartItem);

    localStorage.setItem('cartAddArry', JSON.stringify(updatedCart));
    console.log('상품최종장비구니:' + JSON.stringify(cartAddArry));

    //카트길이
    let cartArryLength;

    try {
        const cartAddArray = JSON.parse(localStorage.getItem('cartAddArry') || '[]');
        cartArryLength = cartAddArray.length;
    } catch (error) {
        // JSON 파싱 중 오류가 발생한 경우에 대한 예외 처리
        console.error('Error parsing JSON:', error);
        cartArryLength = 0;
    }

    console.log("카트길이쓰:"+ cartArryLength)
    $('.cart__count').text(cartArryLength);
});

function addToCartOrIncreaseQuantity(cartArray, cartItem) {
    let found = false;

    for (let i = 0; i < cartArray.length; i++) {
        if (cartArray[i].productId === cartItem.productId &&
            cartArray[i].productImage === cartItem.productImage &&
            cartArray[i].productName === cartItem.productName) {
            cartArray[i].productInitTotalPrice = parseFloat(cartArray[i].productInitTotalPrice) + parseFloat(cartItem.productInitPrice);
            cartArray[i].productTotalDiscountPrice = parseFloat(cartArray[i].productTotalDiscountPrice) + parseFloat(cartItem.productDiscountPrice);
            cartArray[i].productTotalPrice = parseFloat(cartArray[i].productTotalPrice) + parseFloat(cartItem.productDiscountedPrice);
            cartArray[i].productQuantity = parseInt(cartArray[i].productQuantity) + parseInt(cartItem.productQuantity);
            found = true;
            break;
        }
    }

    if (!found) {
        cartItem.productTotalPrice = cartItem.productDiscountedPrice * cartItem.productQuantity; // Initialize productTotalPrice

        cartArray.push(cartItem);
    }

    return cartArray;
}

/**
 * 상세페이지에서 장바구니아이콘 클릭시 해당 상품정보 Localstorage에 추가되는 함수
 */
$(document).on('click', '.detailCart', function () {
    const detailCartId = parseInt($('#productId').val());
    const detailImage = $('.detailImage').attr('src');
    const detailName = $('.detailName').text();
    const detailInitPrice = parseFloat($('.detailInitPrice').val());
    const detailDiscountPrice = parseFloat($('.detailDiscountPrice').val());
    const detailDiscountedPrice = parseFloat($('.detailDiscountedPrice').val());
    const detailDiscount = parseInt($('.detailDiscount').val());
    const detailQuantity = parseInt($('#quantityInput').val());

    const cartAddArry = JSON.parse(localStorage.getItem('cartAddArry')) || [];
    const cartItem = {
        'productId': detailCartId,
        'productImage': detailImage,
        'productName': detailName,
        'productInitPrice': detailInitPrice, //상품 최초 가격
        'productDiscount': detailDiscount, //상품 할인율
        'productDiscountPrice': detailDiscountPrice, //상품 할인 가격
        'productDiscountedPrice': detailDiscountedPrice, // 할인 적용 된 상품 가격
        'productInitTotalPrice': detailInitPrice * detailQuantity, //상품 할인 정용되기 전 총 가격
        'productTotalDiscountPrice': detailDiscountPrice * detailQuantity, // 상품 할인 총 가격
        'productTotalPrice': detailDiscountedPrice * detailQuantity, // 상품 할인 적용된 총 가격
        'productQuantity': detailQuantity,
         expiration: now.getTime() + 1440 * 60 * 1000 // 현재 시간에 유효 기간을 더한 값

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
        if (cartArray[i].productId === cartItem.productId &&
            cartArray[i].productImage === cartItem.productImage &&
            cartArray[i].productName === cartItem.productName) {
            cartArray[i].productInitTotalPrice = parseFloat(cartArray[i].productInitTotalPrice) + parseFloat(cartItem.productInitTotalPrice);
            cartArray[i].productTotalDiscountPrice = parseFloat(cartArray[i].productTotalDiscountPrice) + parseFloat(cartItem.productTotalDiscountPrice);
            cartArray[i].productTotalPrice = parseFloat(cartArray[i].productTotalPrice) + parseFloat(cartItem.productTotalPrice);
            cartArray[i].productQuantity = parseInt(cartArray[i].productQuantity) + parseInt(cartItem.productQuantity);
            found = true;
            break;
        }
    }

    if (!found) {
        cartItem.productTotalPrice = cartItem.productDiscountedPrice * cartItem.productQuantity; // Initialize productTotalPrice

        cartArray.push(cartItem);
    }

    return cartArray;
}


/**
 * 장바구니에서 갯수 변경하면 Localstorage에서도 변경되는 코드
 * @constructor 황호준
 */
$(document).ready(function () {
    let cartId, cartProductImage, cartProductName, cartProductInitPrice, cartDiscount, cartProductDiscountPrice,
        cartProductDiscountedPrice, cartProductQuantity, cartAddArry, updatedCart;
    $('body').on('click', '.cartQuantityMinusBtn', function () {
        const $button = $(this).next('.cartProductQuantity');
        console.log("$버튼:"+ $button);
        let currentQuantity = parseInt($button.text());
        console.log("$버튼양:"+ currentQuantity);
        const $parentRow = $(this).closest('tr');

        const newQuantity = currentQuantity - 1;
        console.log("뉴퀀:"+ newQuantity);
        $button.text(newQuantity);

        cartId = parseInt($parentRow.find('.cartProductId').val());
        cartProductImage = $parentRow.find('.cartProductImage').attr('src');
        cartProductName = $parentRow.find('.cartProductName').text();
        cartProductInitPrice = parseFloat($parentRow.find('.cartProductInitPrice').val());
        cartDiscount = parseInt($parentRow.find('.cartProductDiscount').val());
        cartProductDiscountPrice = parseFloat($parentRow.find('.cartProductDiscountPrice').val());
        cartProductDiscountedPrice = parseFloat($parentRow.find('.cartProductDiscountedPrice').val());
        cartProductQuantity = parseInt($button.text());

        console.log('담기기전 상품이름 (장바구니): ' + cartProductName); // Calculate total price
        console.log('담기기전 상품가격 (장바구니): ' + cartProductDiscountPrice); // Calculate total price
        console.log('담기기전 상품수량 (장바구니): ' + cartProductQuantity); // Calculate total price
        console.log('담기기전 총가격 : ' + ((cartProductDiscountPrice * cartProductQuantity) - cartProductDiscountPrice));

        cartAddArry = JSON.parse(localStorage.getItem('cartAddArry')) || [];
        const cartItem = {
            'productId': cartId,
            'productImage': cartProductImage,
            'productName': cartProductName,
            'productInitPrice': cartProductInitPrice, //상품 최초 가격
            'productDiscount': cartDiscount, //상품 할인율
            'productDiscountPrice': cartProductDiscountPrice, //상품 할인 가격
            'productDiscountedPrice': cartProductDiscountedPrice,//할인 적용된 상품 가격
            'productInitTotalPrice': cartProductInitPrice * currentQuantity, //상품 할인 정용되기 전 총 가격
            'ProductTotalDiscountPrice': ((cartProductDiscountPrice * cartProductQuantity) - cartProductDiscountPrice), // 상품 할인 총 가격
            'productTotalPrice': ((cartProductDiscountedPrice * cartProductQuantity) - cartProductDiscountedPrice), // 상품 할인 적용된 총 가격
            'productQuantity': cartProductQuantity,
             expiration: now.getTime() + 1440 * 60 * 1000 // 현재 시간에 유효 기간을 더한 값

        };

        updatedCart = CartPlusMinusQuantity(cartAddArry, cartItem);

        localStorage.setItem('cartAddArry', JSON.stringify(updatedCart));

        console.log('상품 ID (장바구니): ' + cartId);
        console.log('상품명 (장바구니): ' + cartProductName);
        console.log('상품가격 (장바구니): ' + cartProductDiscountPrice); // Calculate total price
        console.log('상품이미지 (장바구니): ' + cartProductImage);
        console.log('상품개수 (장바구니): ' + cartProductQuantity);
        console.log('상품최종장비구니:' + JSON.stringify(cartAddArry));


        axios({
            method: 'post',
            url: '/user/cartPageUpdateAxios',
            data: {
                "cartArry": JSON.stringify(JSON.parse(localStorage.getItem('cartAddArry')) || [])
            }
            ,  // 이미 JavaScript 객체이므로 JSON.stringify()를 사용하지 않습니다.
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log("성공");
            const cartList = res.data
            console.log("카트리스트콘솔: " + JSON.stringify(cartList))
            $('#cartAxiosBody').empty();
            for (let i = 0; i < cartList.length; i++) {
                const axiosBodyHtml =
                    `
                 <tr>
                    <td>
                        <input type="checkbox" name="chkStatus" class="cartProductId" value="${cartList[i].productId}">
                        <input type="hidden" class="cartProductInitPrice" value="${cartList[i].productInitPrice}">
                        <input type="hidden" class="cartProductDiscount" value="${cartList[i].productDiscount}">
                        <input type="hidden" class="cartProductDiscountPrice" value="${cartList[i].productDiscountPrice}">
                        <input type="hidden" class="cartProductDiscountedPrice" value="${cartList[i].productDiscountedPrice}">
                        <input type="hidden" class="cartProductInitTotalPrice" value="${cartList[i].productInitTotalPrice}">
                        <input type="hidden" class="cartProductDiscountTotalPrice" value="${cartList[i].productTotalDiscountPrice}">
                        <input type="hidden" class="cartProductTotalPrice" value="${cartList[i].productTotalPrice}">
                    </td>
                    <td>
                        <div class="td_wrap">
                            <img class="cartProductImage" src="${cartList[i].productImage}" alt="상품이미지">
                            <div class="txt">

                                <span class="cartProductName" >${cartList[i].productName}</span>
                                <span>
                                    <button class="cartQuantityMinusBtn">-</button>
                                    <button class="cartProductQuantity">${cartList[i].productQuantity}</button>
                                    <button class="cartQuantityPlusBtn">+</button>
                                </span>
                            </div>
                            
                            <div class="price">
                                <span class="cartProductPrice">${formatCurrency(cartList[i].productInitPrice)}원</span>
                                <button class="cartProductCancelBtn">x</button>
                            </div>
                        </div>
                    </td>
                    <td>${formatCurrency(cartList[i].productInitTotalPrice)}원</td>
                    <td>${formatCurrency(cartList[i].productDiscount)}%</td>
                </tr>
                
                `;
                $('#cartAxiosBody').append(axiosBodyHtml);
            }
            console.log("잘넣어졌다");
        })
    })

    $('body').on('click', '.cartQuantityPlusBtn', function () {
        const $button = $(this).prev('.cartProductQuantity');
        console.log("$버튼:"+ $button);
        let currentQuantity = parseInt($button.text());
        console.log("$버튼양:"+ currentQuantity);
        const $parentRow = $(this).closest('tr');

        const newQuantity = currentQuantity + 1;
        console.log("뉴퀀:"+ newQuantity);
        $button.text(newQuantity);

        cartId = parseInt($parentRow.find('.cartProductId').val());
        cartProductImage = $parentRow.find('.cartProductImage').attr('src');
        cartProductName = $parentRow.find('.cartProductName').text();
        cartProductInitPrice = parseFloat($parentRow.find('.cartProductInitPrice').val());
        cartDiscount = parseInt($parentRow.find('.cartProductDiscount').val());
        cartProductDiscountPrice = parseFloat($parentRow.find('.cartProductDiscountPrice').val());
        cartProductDiscountedPrice = parseFloat($parentRow.find('.cartProductDiscountedPrice').val());
        cartProductQuantity = parseInt($button.text());

        console.log('담기기전 상품이름 (장바구니): ' + cartProductName); // Calculate total price
        console.log('담기기전 상품가격 (장바구니): ' + cartProductDiscountPrice); // Calculate total price
        console.log('담기기전 상품수량 (장바구니): ' + cartProductQuantity); // Calculate total price
        console.log('담기기전 총가격 : ' + ((cartProductDiscountPrice * cartProductQuantity) + cartProductDiscountPrice));

        cartAddArry = JSON.parse(localStorage.getItem('cartAddArry')) || [];
        const cartItem = {
            'productId': cartId,
            'productImage': cartProductImage,
            'productName': cartProductName,
            'productInitPrice': cartProductInitPrice, //상품 최초 가격
            'productDiscount': cartDiscount, //상품 할인율
            'productDiscountPrice': cartProductDiscountPrice, //상품 할인 가격
            'productDiscountedPrice': cartProductDiscountedPrice,//할인 적용된 상품 가격
            'productInitTotalPrice': cartProductInitPrice * currentQuantity, //상품 할인 정용되기 전 총 가격
            'ProductTotalDiscountPrice': ((cartProductDiscountPrice * cartProductQuantity) + cartProductDiscountPrice), // 상품 할인 총 가격
            'productTotalPrice': ((cartProductDiscountedPrice * cartProductQuantity) + cartProductDiscountedPrice), // 상품 할인 적용된 총 가격
            'productQuantity': cartProductQuantity,
            expiration: now.getTime() + 1440 * 60 * 1000 // 현재 시간에 유효 기간을 더한 값

        };

        updatedCart = CartPlusMinusQuantity(cartAddArry, cartItem);

        localStorage.setItem('cartAddArry', JSON.stringify(updatedCart));

        console.log('상품 ID (장바구니): ' + cartId);
        console.log('상품명 (장바구니): ' + cartProductName);
        console.log('상품가격 (장바구니): ' + cartProductDiscountPrice); // Calculate total price
        console.log('상품이미지 (장바구니): ' + cartProductImage);
        console.log('상품개수 (장바구니): ' + cartProductQuantity);
        console.log('상품최종장비구니:' + JSON.stringify(cartAddArry));


        axios({
            method: 'post',
            url: '/user/cartPageUpdateAxios',
            data: {
                "cartArry": JSON.stringify(JSON.parse(localStorage.getItem('cartAddArry')) || [])
            }
            ,  // 이미 JavaScript 객체이므로 JSON.stringify()를 사용하지 않습니다.
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log("성공");
            const cartList = res.data
            console.log("카트리스트콘솔: " + JSON.stringify(cartList))
            $('#cartAxiosBody').empty();
            for (let i = 0; i < cartList.length; i++) {
                const axiosBodyHtml =
                    `
                 <tr>
                    <td>
                        <input type="checkbox" name="chkStatus" class="cartProductId" value="${cartList[i].productId}">
                        <input type="hidden" class="cartProductInitPrice" value="${cartList[i].productInitPrice}">
                        <input type="hidden" class="cartProductDiscount" value="${cartList[i].productDiscount}">
                        <input type="hidden" class="cartProductDiscountPrice" value="${cartList[i].productDiscountPrice}">
                        <input type="hidden" class="cartProductDiscountedPrice" value="${cartList[i].productDiscountedPrice}">
                        <input type="hidden" class="cartProductInitTotalPrice" value="${cartList[i].productInitTotalPrice}">
                        <input type="hidden" class="cartProductDiscountTotalPrice" value="${cartList[i].productTotalDiscountPrice}">
                        <input type="hidden" class="cartProductTotalPrice" value="${cartList[i].productTotalPrice}">
                    </td>
                    <td>
                        <div class="td_wrap">
                            <img class="cartProductImage" src="${cartList[i].productImage}" alt="상품이미지">
                            <div class="txt">

                                <span class="cartProductName" >${cartList[i].productName}</span>
                                <span>
                                    <button class="cartQuantityMinusBtn">-</button>
                                    <button class="cartProductQuantity">${cartList[i].productQuantity}</button>
                                    <button class="cartQuantityPlusBtn">+</button>
                                </span>
                            </div>
                            
                            <div class="price">
                                <span class="cartProductPrice">${formatCurrency(cartList[i].productInitPrice)}원</span>
                                <button class="cartProductCancelBtn">x</button>
                            </div>
                        </div>
                    </td>
                    <td>${formatCurrency(cartList[i].productInitTotalPrice)}원</td>
                    <td>${formatCurrency(cartList[i].productDiscount)}%</td>
                </tr>
                
                `;
                $('#cartAxiosBody').append(axiosBodyHtml);
            }
            console.log("잘넣어졌다");
        })
});
});


/**
 * 장바구니에서 갯수 변경하면 Localstorage에서도 변경되는 코드
 * @param cartArray
 * @param cartItem
 * @returns {cartArray}
 * @constructor 황호준
 */
function CartPlusMinusQuantity(cartArray, cartItem) {
    let found = false;

    for (let i = 0; i < cartArray.length; i++) {
        if (cartArray[i].productId === cartItem.productId &&
            cartArray[i].productImage === cartItem.productImage &&
            cartArray[i].productName === cartItem.productName) {
            cartArray[i].productInitTotalPrice = parseFloat(cartItem.productInitPrice) * parseInt(cartItem.productQuantity);
            cartArray[i].productTotalDiscountPrice = parseFloat(cartItem.productDiscountPrice) * parseInt(cartItem.productQuantity);
            cartArray[i].productTotalPrice = parseFloat(cartItem.productDiscountedPrice) * parseInt(cartItem.productQuantity);
            cartArray[i].productQuantity = parseInt(cartItem.productQuantity);
            found = true;
            break; // 찾았으면 루프 종료
        }
    }

    if (!found) {
        cartItem.productTotalPrice = cartItem.productPrice * cartItem.productQuantity; // Initialize productTotalPrice
        cartArray.push(cartItem); // 찾지 못했을 때만 새로운 항목 추가
    }

    return cartArray;
}

/**
 * 해당 상품 삭제
 */
$(document).on('click', '.cartProductCancelBtn', function () {
    const $parentRow = $(this).closest('tr');
    const cartProductId = parseInt($parentRow.find('.cartProductId').val());

    // LocalStorage에서 cartAddArry 배열을 가져옵니다.
    let cartAddArry = JSON.parse(localStorage.getItem('cartAddArry')) || [];

    // 해당 상품을 배열에서 삭제합니다.
    cartAddArry = cartAddArry.filter(item => item.productId !== cartProductId);

    // 수정된 배열을 다시 LocalStorage에 저장합니다.
    localStorage.setItem('cartAddArry', JSON.stringify(cartAddArry));

    // 삭제한 상품을 화면에서 제거합니다.
    $parentRow.remove();
});
/**
 * 장바구니페이지 이동시 로컬스토리지에 저장된 값들을 보내는 함수
 */
$(document).on('click', 'a#rightCart, #menuCart, .goCart', function () {
    const cartAddArry = JSON.parse(localStorage.getItem('cartAddArry')) || [];

    axios({
        method: 'post',
        url: '/user/cartAxios',
        data: {
            "cartArry": JSON.stringify(cartAddArry)
        }
        ,  // 이미 JavaScript 객체이므로 JSON.stringify()를 사용하지 않습니다.
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        console.log(res.data)
        location.href = '/user/cart';
    })
});


/**
 * 메인페이지 장바구니 개수 Axios
 */
$(document).ready(function () {
    let cartArryLength;

    try {
        const cartAddArray = JSON.parse(localStorage.getItem('cartAddArry') || '[]');
        cartArryLength = cartAddArray.length;
    } catch (error) {
        // JSON 파싱 중 오류가 발생한 경우에 대한 예외 처리
        console.error('Error parsing JSON:', error);
        cartArryLength = 0;
    }


    console.log("배열개수:" + cartArryLength);

    axios({
        method: 'post',
        url: '/mainCartAxios',
        data: {
            'cartArryLength' : cartArryLength
        },
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        console.log("화긴:"+res.data)
        $('.cart__count').text(res.data);
    })
});


/**
 * 전체선택 체크박스 클릭했을 때 모두 체크되게 하는 함수
 */
// 모두 체크
$(document).ready(function () {
    $("#cartAllCheck").click(function () {
        const isChecked = $(this).prop("checked");
        $("input[type='checkbox'][name='chkStatus']").prop("checked", isChecked);
    });
});

/**
 * 체크박스에 체크 된 값들만 총액에 표현하는 함수
 */
$(document).ready(function () {
    // 체크박스 클릭 시 이벤트 핸들러
    $('body').on('change', '.cartProductId, #cartAllCheck', function () {
        updateTotalValues(); // 체크박스 상태 변경 시 합계 계산 및 표시 업데이트
        updateTotalCheckedCount();
    });

    // 합계 계산 및 표시 업데이트 함수
    function updateTotalValues() {
        let totalProductInitPrice = 0;
        let totalProductDiscountPrice = 0;
        let totalProductPrice = 0;

        // 체크된 체크박스들을 선택하여 계산
        $('.cartProductId:checked').each(function () {
            const row = $(this).closest('tr');
            const initTotalPrice = parseFloat(row.find('.cartProductInitTotalPrice').val());
            console.log("체크이닛토탈:"+initTotalPrice)
            const discountTotalPrice = parseFloat(row.find('.cartProductDiscountTotalPrice').val());
            console.log("체크디스토탈:"+discountTotalPrice)
            const totalPrice = parseFloat(row.find('.cartProductTotalPrice').val());
            console.log("체크토탈:"+totalPrice)

            totalProductInitPrice += initTotalPrice;
            totalProductDiscountPrice += discountTotalPrice;
            totalProductPrice += totalPrice;
        });

        // 합계 표시 업데이트
        $('.totalProductInitPrice').text(formatCurrency(totalProductInitPrice) + '원');
        if(totalProductDiscountPrice==0){
            $('.totalProductDiscountPrice').text('0원');
        } else {
        $('.totalProductDiscountPrice').text(formatCurrency(-totalProductDiscountPrice) + '원');
        }
        $('.totalProductPrice').text(formatCurrency(totalProductPrice) + '원');
        const expressPriceElement = $('.expressPrice');
        if (totalProductPrice >= 50000) {
            expressPriceElement.text('무료');
            $('.totalProductPriceWithExpressPrice').text(formatCurrency(totalProductPrice) + '원');
        } else if (totalProductPrice < 50000 && totalProductPrice > 0) {
            expressPriceElement.text('3000원');
            $('.totalProductPriceWithExpressPrice').text(formatCurrency(3000 + totalProductPrice) + '원');
        } else if (totalProductPrice === 0) {
            $('.totalProductPriceWithExpressPrice').text('0원');

        }
    }

    $('#cartAllCheck').on('change', function () {
        const isChecked = $(this).prop('checked'); // 전체 체크박스의 현재 상태 가져오기
        $('.cartProductId').prop('checked', isChecked); // 모든 상품의 체크박스 상태를 변경
        updateTotalValues(); // 변경된 체크박스 상태에 따라 합계 업데이트
        updateTotalCheckedCount(); // 변경된 체크박스 상태에 따라 체크된 개수 업데이트
    });

    function updateTotalCheckedCount() {
        const totalCheckedCount = $('.cartProductId:checked').length;
        $('#totalCheckedCount').text(totalCheckedCount);
    }

    updateTotalCheckedCount();

});

/** 원화표시 함수
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR').format(amount);
}