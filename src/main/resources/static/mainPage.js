$(document).ready(function () {
    let productSortVal;
    let searchFieldVal;
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
                "startPage": currentPage,
                "pageSize": pageSizeVal
            },
            dataType: "JSON",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            //const pList = res.data;
            const pageInfo = res.data;
            const pList = pageInfo.list;
            console.log('피리:' + pageInfo);
            console.log('피리1:' + pList);
            // .product-table 클래스 내부의 tbody 내부 내용 교체
            const UlRows = pList.map((product) => {
                const productLink = $("<a>")
                    .attr("href", "/user/detail?productId=" + product.PRODUCT_ID)
                    .append($("<img>").attr("src", product.IMAGE_URL).attr("alt", "상품사진"))
                    .append($("<div>").addClass("icons")
                        .append(
                            $("<a>")
                                .attr("id", "productLike")
                                .attr("data-product-id", product.PRODUCT_ID)
                                .append(
                                    $("<span>")
                                        .addClass("material-symbols-outlined")
                                        .addClass(product.LIKE_ID == null ? "" : "red__heart")
                                        .text("favorite")
                                )
                        )
                        .append($("<span>").addClass("material-symbols-outlined").text("shopping_cart"))
                    );

                const productTitle = $("<div>")
                    .addClass("title")
                    .append($("<span>").text(product.PRODUCT_NAME));

                const productPrice = $("<div>").addClass("price").text(product.PRODUCT_PRICE + "원");

                const txtDiv = $("<div>").addClass("txt")
                    .append(productTitle)
                    .append(productPrice);

                return $("<li>")
                    .append(productLink)
                    .append(txtDiv);
            });
            // const UlRows = pList.map((product) => {
            //     return $("<li>")
            //         .append($("<a>").attr("href", "/user/detail?productId=" + product.PRODUCT_ID)
            //             .append($("<img>").attr("src", product.IMAGE_URL).attr("alt", "상품사진"))
            //             .append($("<div>").addClass("icons")
            //
            //                 .append($("<span>").addClass("material-symbols-outlined").text("favorite"))
            //                 .append($("<span>").addClass("material-symbols-outlined").text("shopping_cart"))
            //             )
            //             .append($("<div>").addClass("txt")
            //                 .append($("<div>").addClass("title")
            //                     .append($("<span>").text(product.PRODUCT_NAME))
            //                 )
            //                 .append($("<div>").addClass("price").text(product.PRODUCT_PRICE+"원"))
            //             )
            //         )
            //         .append($("</li>"));
            // });
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
    let productLikeId, productCartId;
    // 상품 좋아요 버튼 클릭 시
    $('a#productLike').click(function() {
        productLikeId = $(this).data('product-id');
        console.log('상품 ID (좋아요): ' + productLikeId);
        sendAxiosRequest_mainPage();
    });

    // 상품 장바구니 버튼 클릭 시
    $('a#productCart').click(function() {
        productCartId = $(this).data('product-id');
        console.log('상품 ID (장바구니): ' + productCartId);
        sendAxiosRequest_mainPage();
    });

    function sendAxiosRequest_mainPage() {
        axios({
            method: 'post',
            url: '/productLikeAxios',
            data: {
                "productLikeId": productLikeId,
                "productCartId": productCartId
            },
            dataType: "JSON",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.data===1){
                $('#productLike').find('span').removeClass('material-symbols-outlined').addClass('material-icons red__heart');

            } else if(res.data===2) {
                $('#productLike').find('span').removeClass('material-icons red__heart').addClass('material-symbols-outlined');
            } else if(res.data===-1){
                alert('로그인이 필요한 서비스 입니다.');
                location.href='user/login';
            }

        });
    }
});
$(document).ready(function() {

    // 장바구니 버튼 클릭 시
    $('#productCart').click(function() {
        var productId = $(this).attr('th:value');
        console.log('상품 ID: ' + productId);
    });
});

