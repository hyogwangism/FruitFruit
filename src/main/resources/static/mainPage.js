$(document).ready(function () {
    let productSortVal, productIdVal, searchFieldVal;
    let currentPage = 1;
    let pageSizeVal = 9;

    // productSaleStatus 버튼 클릭 시
    $('.productSort').click(function () {
        // 모든 버튼 스타일 초기화
        $('.productSort').removeClass('clicked');

        // 현재 클릭된 버튼 스타일 변경
        $(this).addClass('clicked');

        productSortVal = $(this).val();

        sendAxiosRequest_mainPage();
    });

    // 검색 버튼 클릭 시
    $('#searchBtn').click(function () {
        searchFieldVal = $('#searchField').val();
        sendAxiosRequest_mainPage();
        // $('#searchField').val('');
    });

    // 이전 페이지 버튼
    $(document).on('click', '.prevBtn', () => {
        currentPage -= 1;
        sendAxiosRequest_mainPage();
    });

    // 페이지 번호 버튼
    $(document).on('click', '.numberBtn', (e) => {
        currentPage = parseInt($(e.currentTarget).attr("value"));
        sendAxiosRequest_mainPage();
    });

    // 다음 페이지 버튼
    $(document).on('click', '.nextBtn', () => {
        currentPage += 1;
        sendAxiosRequest_mainPage();
    });

    function sendAxiosRequest_mainPage() {
        console.log(productSortVal);
        console.log(searchFieldVal);
        console.log(pageSizeVal);
        console.log("커페"+currentPage);
        axios({
            method: 'post',
            url: '/mainPageAxios',
            data: {
                "productSort": productSortVal,
                "searchField": searchFieldVal,
                'productIdVal' : productIdVal,
                "startPage": currentPage,
                "pageSize": pageSizeVal
            },
            dataType: "JSON",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {


            //const pList = res.data;
            const pageInfo = res.data.pageInfo;
            const pList = pageInfo.list;
            const sessionId = res.data.sessionId;

            console.log('피리:' + pageInfo);
            console.log('피리1:' + pList);

            const UlRows = pList.map((product) => {
                const hiddenPrice = $('<input>')
                    .addClass('productInitPrice')
                    .attr('type', 'hidden')
                    .attr('value', product.PRODUCT_PRICE);

                const hiddenDiscount = $('<input>')
                    .addClass('productDiscount')
                    .attr('type', 'hidden')
                    .attr('value', product.PRODUCT_DISCOUNT);

                const hiddenDiscountPrice = $('<input>')
                    .addClass('productDiscountPrice')
                    .attr('type', 'hidden')
                    .attr('value', (product.PRODUCT_PRICE * product.PRODUCT_DISCOUNT) / 100);

                const hiddenDiscountedPrice = $('<input>')
                    .addClass('productDiscountedPrice')
                    .attr('type', 'hidden')
                    .attr('value', (product.PRODUCT_PRICE - (product.PRODUCT_PRICE * product.PRODUCT_DISCOUNT / 100)));

                const productLink = $('<a>')
                    .attr('href', '/user/productDetail?productId=' + product.PRODUCT_ID)
                    .addClass('productImage')
                    .append($('<img>')
                        .addClass('productImage')
                        .attr('src', product.IMAGE_URL)
                        .attr('alt', '상품사진'));

                const productLikeButton = $('<a>')
                    .attr('id', 'productLike')
                    .attr('data-product-id', product.PRODUCT_ID);

                if (sessionId == null) {
                    productLikeButton.append($('<span>')
                        .addClass('material-icons material-symbols-outlined')
                        .text('favorite'));
                } else {
                    if (product.LIKE_ID != null) {
                        productLikeButton.append($('<span>')
                            .addClass('material-icons red__heart')
                            .text('favorite'));
                    } else {
                        productLikeButton.append($('<span>')
                            .addClass('material-icons material-symbols-outlined')
                            .text('favorite'));
                    }
                }

                const productCartButton = $('<a>')
                    .attr('id', 'productCart')
                    .attr('data-product-id', product.PRODUCT_ID)
                    .append($('<span>')
                        .addClass('material-symbols-outlined')
                        .text('shopping_cart'));

                const iconsDiv = $('<div>')
                    .addClass('icons')
                    .append(productLikeButton)
                    .append(productCartButton);

                const txtDiv = $('<div>')
                    .addClass('txt')
                    .append($('<div>')
                        .addClass('title')
                        .append($('<span>')
                            .addClass('productName')
                            .text(product.PRODUCT_NAME)))
                    .append($('<div>')
                        .addClass('productPrice')
                        .addClass('price')
                        .text(product.PRODUCT_PRICE + '원'));

                const liElement = $('<li>')
                    .append(hiddenPrice)
                    .append(hiddenDiscount)
                    .append(hiddenDiscountPrice)
                    .append(hiddenDiscountedPrice)
                    .append(productLink)
                    .append(iconsDiv)
                    .append(txtDiv);

                return liElement;
            });

            $("#axiosBody").empty().append(UlRows);

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
                    .addClass('prevBtn')
                    .attr('value', pageInfo.prePage)
                    .html('<span class="material-symbols-outlined">chevron_left</span>');
                paginationDiv.append(prevBtn);
            }

            pageNumberList.forEach((pageNumber) => {
                if (pageNumber <= totalData) {
                    const numberBtn = $('<a>')
                        .text(pageNumber)
                        .attr('href', '#')
                        .addClass('numberBtn')
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
                    .addClass('nextBtn')
                    .attr('value', pageInfo.nextPage)
                    .html('<span class="material-symbols-outlined">chevron_right</span>');
                paginationDiv.append(nextBtn);
            }


        });
    }
});

$(document).ready(function () {
    // 버튼 클릭 이벤트 처리
    $(".productSort").click(function () {
        // 모든 버튼에서 active 클래스 제거
        $(".productSort").removeClass("active");
        // 클릭한 버튼에 active 클래스 추가
        $(this).addClass("active");

        // 여기에 버튼을 클릭했을 때의 추가 동작을 작성할 수 있습니다.
        // 예를 들어, 필터링된 상품 리스트를 업데이트하거나 다른 동작을 수행할 수 있습니다.
    });
});

$(document).ready(function() {
    let productLikeId;
    // 상품 좋아요 버튼 클릭 시
    // 이벤트 위임을 사용하여 'a#productLike' 클릭 이벤트 처리
    $(document).on('click', 'a#productLike', function() {
        productLikeId = $(this).data('product-id');
        console.log('상품 ID (좋아요): ' + productLikeId);
        sendAxiosRequest_mainPage();
    });

    function sendAxiosRequest_mainPage() {
        axios({
            method: 'post',
            url: '/productLikeAxios',
            data: {
                "productLikeId": productLikeId
            },
            dataType: "JSON",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            const paramMap = res.data;
            JSON.stringify('파람쓰:'+paramMap);

            if (Object.keys(paramMap).length === 0) {
                alert('로그인이 필요한 서비스 입니다.');
                location.href = 'user/login';
            } else {
                const isLiked = paramMap.isLiked;

                const detailLikeElement = $('a#productLike[data-product-id="' + paramMap.PRODUCT_ID + '"] span');
                if (isLiked) {
                    detailLikeElement.addClass('red__heart').removeClass('material-symbols-outlined');
                } else {
                    detailLikeElement.removeClass('red__heart').addClass('material-symbols-outlined');
                }
            }
        });
    }
});



