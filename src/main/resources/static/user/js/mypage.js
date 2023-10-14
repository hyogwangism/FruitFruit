/**
 * @author 황호준
 * 마이페이지 메인 주문내역 Axios
 */
$(document).ready(function () {
    let startDateValue, endDateValue, searchType, searchField;
    let currentPage = 1;
    let pageSizeVal = 5;

    $('.search__box__buttons button').click(function () {
        // 모든 버튼의 스타일 초기화
        $('.search__box__buttons button').css({
            'background-color': '',
            'color': ''
        });

        // 클릭한 버튼에 스타일 적용
        $(this).css({
            'background-color': 'black',
            'color': 'white'
        });

        if ($(this).data('months') === 0) {
            startDateValue = '1900-01-01';
        } else {
            // 그 외 버튼의 경우 시작 날짜 계산
            const months = $(this).data('months');
            const currentDate = new Date();
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - months, currentDate.getDate());
            startDateValue = monthDate(startDate);
        }

        // 선택한 버튼의 data-months 값을 가져옴
        const endDate = new Date(); // 현재 날짜
        // 시작 날짜와 종료 날짜를 원하는 형식으로 포맷
        endDateValue = monthDate(endDate);

        // input 요소의 value 값을 설정
        $('#date1').val(startDateValue);
        $('#date2').val(endDateValue);

        // 현재 날짜로부터 months 이전 날짜를 컨트롤러로 전달하는 Axios 요청
        sendAxiosRequest_mypage();
    });

    // input 요소의 값이 변경될 때 발생하는 이벤트 핸들러
    $('#date1, #date2').change(function () {
        // 변경된 값 가져오기
        startDateValue = $('#date1').val();
        endDateValue = $('#date2').val();
        sendAxiosRequest_mypage();

        // 값을 출력하거나 다른 작업 수행
        console.log(`date1 값: ${startDateValue}`);
        console.log(`date2 값: ${endDateValue}`);
    });

    searchType = $('#mypageSearchType').val();
    $('#mypageSearchType').change(function () {
        // 선택된 옵션의 value 값을 가져오기
        searchType = $(this).val();
        sendAxiosRequest_mypage();
    });

    // 검색 버튼 클릭 시 검색필드 값 넘기기
    $('#mypageSearchBtn').click(function () {
        searchField = $('#mypageSearchField').val();
        sendAxiosRequest_mypage();
    });


    // 이전 페이지 버튼
    $(document).on('click', '#mypagePrevBtn', () => {
        currentPage -= 1;
        sendAxiosRequest_mypage();
    });

    // 페이지 번호 버튼
    $(document).on('click', '#mypageNumberBtn', (e) => {
        currentPage = parseInt($(e.currentTarget).attr("value"));
        console.log('커페:' + currentPage)
        sendAxiosRequest_mypage();
    });

    // 다음 페이지 버튼
    $(document).on('click', '#mypageNextBtn', () => {
        currentPage += 1;
        sendAxiosRequest_mypage();
    });

    /**
     * @author 황호준
     * 마이페이지 메인 주문내역 Axios 함수
     */
    function sendAxiosRequest_mypage() {
        axios({
            method: 'post',
            url: 'mypageAxios',
            data: {
                "startDate": startDateValue,
                "endDate": endDateValue,
                "searchType": searchType,
                "searchField": searchField,
                "startPage": currentPage,
                "pageSize": pageSizeVal,
                "USER_ID_NO": $('#USER_ID_NO').val()
            },
            dataType: "JSON",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {

            const pageInfo = res.data;
            const orderList = pageInfo.list;

            console.log('페인:' + pageInfo);
            console.log('오리:' + orderList);

            $('#li_Axios').empty();
            for (let i = 0; i < orderList.length; i++) {
                const reviewButtonText = orderList[i].REVIEW_STATUS === '미작성' ? '리뷰작성' : '리뷰작성완료';
                const liHtml = `
            <li>
                 <input type="hidden" id="order_Id" value="${orderList[i].ORDER_ID}">
                 <input type="hidden" id="USER_ID_NO" value="${orderList[i].USER_ID_NO}">
                 <input type="hidden" id="order_product_name" value="${orderList[i].PRODUCT_NAME}">
<!--                 <input type="hidden" id="order_product_id" value="${orderList[i].ORDER_PRODUCT_ID}">-->
                 <input type="hidden" id="order_product_quantity" value="${orderList[i].PRODUCT_QUANTITY}">
                <div class="txt">
                    <input type="hidden" class="order_product_id" value="${orderList[i].ORDER_PRODUCT_ID}">
                    <span>${orderList[i].ORDER_ID}</span>
                    <span>${monthDate(new Date(orderList[i].ORDER_DATE), 'yyyy-MM-dd')}</span>
                </div>

                <div class="img">
                    <img src="${orderList[i].IMAGE_URL}" alt="상품 이미지">
                    <div class="img__txt">
                        <p>${orderList[i].PRODUCT_NAME}</p>

                        <div class="group">
                            <span class="orange">${orderList[i].PRODUCT_PRICE}원</span>
                            <span>${orderList[i].PRODUCT_QUANTITY}개</span>
                        </div>

                     <div class="group2">
                        <p>배송지 확인
                            <span class="material-symbols-outlined">double_arrow</span>
                        </p>
                     </div>

                </div>
                </div>

                <div class="buttons">
                    <button id="rePurchase">재구매</button>
                    <button id="review_write_btn">${reviewButtonText}</button>
                </div>
            </li>
                `;
                const $li = $(liHtml);
                $('#li_Axios').append($li);
                if (orderList[i].REVIEW_STATUS === '작성완료') {
                    $li.find('button:last').css({
                        'background-color': 'black',
                        'color': 'white',
                        'font-weight': 'bold',
                        'border-color': 'black',
                        'cursor': 'none'
                    });
                }
            }
            // .pagination 클래스 태그 내부 내용 교체
            const paginationDiv = $('.pagination');
            const numbersDiv = $('<p>').addClass('numbers');
            paginationDiv.empty();

            const totalData = pageInfo.pages; // 총 데이터 수
            const pageNumberList = pageInfo.navigatepageNums; // 페이지 번호들의 순서를 담은 배열
            const currentPage = pageInfo.pageNum;

            // 이전 페이지 버튼
            if (pageInfo.hasPreviousPage) {
                const prevBtn = $('<a>')
                    .attr('href', '#')
                    .attr('id', 'mypagePrevBtn')
                    .attr('value', pageInfo.prePage)
                    .html('<span class="material-symbols-outlined">chevron_left</span>');
                paginationDiv.append(prevBtn);
            }

            pageNumberList.forEach((pageNumber) => {
                if (pageNumber <= totalData) {
                    const numberBtn = $('<a>')
                        .text(pageNumber)
                        .attr('href', '#')
                        .attr('id', 'mypageNumberBtn')
                        .attr('value', pageNumber);

                    if (pageNumber === currentPage) {
                        numberBtn.addClass('bold').addClass("large-text").css("font-size", "16px").css("font-weight", "bold");
                    }
                    numbersDiv.append(numberBtn);
                }
            });
            paginationDiv.append(numbersDiv);

            // 다음 페이지 버튼
            if (pageInfo.hasNextPage) {
                const nextBtn = $('<a>')
                    .attr('href', '#')
                    .attr('id', 'mypageNextBtn')
                    .attr('value', pageInfo.nextPage)
                    .html('<span class="material-symbols-outlined">chevron_right</span>');
                paginationDiv.append(nextBtn);
            }


        });
    }

    // 날짜를 원하는 형식으로 포맷하는 함수
    function monthDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

});

$(document).ready(function () {
    // 현재 날짜를 가져오는 함수
    function getCurrentDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // input 요소의 value 값을 현재 날짜로 설정
    $('#date1').val(getCurrentDate());
    $('#date2').val(getCurrentDate());
})

/**
 * @author 황호준
 * 재구매버튼 클릭시 Axios
 */
$(document).on('click', '.rePurchase', function () {

    axios({
        method: 'post',
        url: '/user/rePurchaseAxios',
        data: {
            "order_product_name": $('#order_product_name').val(),
            'PRUDUCT_QUANTITY': $('#order_product_quantity').val()
        }
        ,  // 이미 JavaScript 객체이므로 JSON.stringify()를 사용하지 않습니다.
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        const rePurchaseMap = res.data;

        let cartAddArry = JSON.parse(localStorage.getItem('cartAddArry')) || [];
        const productDiscountPrice = rePurchaseMap.PRODUCT_PRICE * rePurchaseMap.PRODUCT_DISCOUNT / 100
        const productDiscountedPrice = rePurchaseMap.PRODUCT_PRICE - (rePurchaseMap.PRODUCT_PRICE * rePurchaseMap.PRODUCT_DISCOUNT / 100)
        const cartItem = {
            'productId': rePurchaseMap.PRODUCT_ID,
            'productImage': rePurchaseMap.IMAGE_URL,
            'productName': rePurchaseMap.PRODUCT_NAME,
            'productInitPrice': rePurchaseMap.PRODUCT_PRICE, //상품 최초 가격
            'productDiscount': rePurchaseMap.PRODUCT_DISCOUNT, //상품 할인율
            'productDiscountPrice': productDiscountPrice, //상품 할인 가격
            'productDiscountedPrice': productDiscountedPrice,//할인 적용된 상품 가격
            'productInitTotalPrice': rePurchaseMap.PRODUCT_PRICE * rePurchaseMap.PRUDUCT_QUANTITY, //상품 할인 정용되기 전 총 가격
            'productTotalDiscountPrice': productDiscountPrice * rePurchaseMap.PRUDUCT_QUANTITY, // 상품 할인 총 가격
            'productTotalPrice': productDiscountedPrice * rePurchaseMap.PRUDUCT_QUANTITY, // 상품 할인 적용된 총 가격
            'productQuantity': rePurchaseMap.PRUDUCT_QUANTITY,

        };
        const rePurchaseCartArry = rePurchaseCart(cartAddArry, cartItem);
        localStorage.setItem('cartAddArry', JSON.stringify(rePurchaseCartArry));

        $('.txt04').show();

    })
});

function rePurchaseCart(cartArray, cartItem) {
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

        cartArray.push(cartItem); // 찾지 못했을 때만 새로운 항목 추가
    }

    return cartArray;
}

/**
 * @author 황호준
 * 구매목록중 리뷰쓰기
 */
$(document).ready(function () {
    $(document).on('click', '#review_write_btn', function () {
        const orderProductId = $(this).closest('li').find('.order_product_id').val();
        // console.log('오프아:'+$('.order_product_id').val())
        console.log('오프아:'+orderProductId)
        console.log('프넴:'+$('#order_product_name').val())
        console.log('유아넘:'+$('#USER_ID_NO').val())
        $('.txt05').show();
    });

    // 모달 취소하기버튼 클릭시 진짜 취소하시겠습니까 모달 띄우기
    $(document).on('click', '#review_write_btn_cancel', function () {
        $('.txt05').hide();
        $('.txt06').show();
    });

    // 진짜 취소 클릭시 모달 닫기
    $(document).on('click', '#review_write_cancel', function () {
        $('.txt06').hide();
    });

    // 계속작성 클릭시 리뷰모달 다시 띄우기
    $(document).on('click', '#review__continue', function () {
        $('.txt06').hide();
        $('.txt05').show();
    });

    // textarea 입력 내용을 모니터링하고 글자수를 업데이트하는 함수
    $('#mypage__review__cont').on('input', function () {
        const maxLength = 500;
        const currentLength = $(this).val().length;
        const countElement = $('.count');
        countElement.text(currentLength + '/' + maxLength);

        // 글자수가 500자를 초과하면 입력을 제한
        if (currentLength > maxLength) {
            $(this).val($(this).val().substring(0, maxLength));
            countElement.text(maxLength + '/' + maxLength);
        }
    });

    /**
     * @author 황호준
     * 리뷰등록 버튼 클릭시 Axios
     */
    $(document).on('click', '#review_write_btn_ok', function () {
        console.log('찐오프아: ' + $('#review_write_btn').closest('li').find('.order_product_id').val())
        axios({
            method: 'post',
            url: '/user/review_ok',
            data: {
                "ORDER_PRODUCT_ID": $('#review_write_btn').closest('li').find('.order_product_id').val(),
                "USER_ID_NO": $('#USER_ID_NO').val(),
                "REVIEW_CONT": $('#mypage__review__cont').val()
            },
            dataType: "JSON",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            $('.txt05').hide()
            $('.txt07').show()
        });
    })
})