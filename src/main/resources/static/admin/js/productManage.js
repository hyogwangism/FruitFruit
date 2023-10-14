/**
 * @author 황호준
 * 상품목록 Axios
 */
$(document).ready(function () {
    let productSaleStatusVal;
    let productSortVal;
    let searchFieldVal;
    let currentPage = 1;
    let pageSizeVal = 5;
    // productSaleStatus 버튼 클릭 시
    $('.productSaleStatus').click(function () {
        // 모든 버튼 스타일 초기화
        $('.productSaleStatus').removeClass('clicked');

        // 현재 클릭된 버튼 스타일 변경
        $(this).addClass('clicked');

        productSaleStatusVal = $(this).val();

        sendAxiosRequest();
    });

    // productSaleStatus 버튼 클릭 시
    $('.productSort').click(function () {
        // 모든 버튼 스타일 초기화
        $('.productSort').removeClass('clicked');

        // 현재 클릭된 버튼 스타일 변경
        $(this).addClass('clicked');

        productSortVal = $(this).val();

        sendAxiosRequest();
    });

    // 검색 버튼 클릭 시
    $('#searchBtn').click(function () {
        searchFieldVal = $('#searchField').val();
        sendAxiosRequest();
        // $('#searchField').val('');
    });

    // pageSize 선택 시
    $('select[name="howmany"]').change(function () {
        pageSizeVal = $(this).val(); // 선택한 값 가져오기
        sendAxiosRequest();
    });

    // 이전 페이지 버튼
    $(document).on('click', '.prevBtn', () => {
        currentPage -= 1;
        sendAxiosRequest();
    });

    // 페이지 번호 버튼
    $(document).on('click', '.numberBtn', (e) => {
        currentPage = parseInt($(e.currentTarget).attr("value"));
        sendAxiosRequest();
    });

    // 다음 페이지 버튼
    $(document).on('click', '.nextBtn', () => {
        currentPage += 1;
        sendAxiosRequest();
    });

    // 수정 버튼
    $(document).on("click", ".editBtn", (e) => {
        const btn = $(e.currentTarget);
        const productId = btn.val();
        const editUrl = `/admin/editProduct/${productId}`;
        window.location.href = editUrl;
    });

    // 모두 체크
    $(document).ready(function() {
        $("#allCheck").click(function() {
            const isChecked = $(this).prop("checked");
            $("input[type='checkbox'][name='chkStatus']").prop("checked", isChecked);
        });
    });

    // 엑셀 다운로드 버튼 클릭 이벤트
    $(document).on("click", "#excelDownloadBtn", () => {
        const data = $(".product-table").html();
        const blob = new Blob([data], {type: "application/vnd.ms-excel"});
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "판매상품내역.xlsx";
        link.click();
    });

    /**
     * @author 황호준
     * 상품목록 Axios 함수
     */
    function sendAxiosRequest() {
        console.log(productSaleStatusVal);
        console.log(productSortVal);
        console.log(searchFieldVal);
        console.log(pageSizeVal);
        console.log("커페"+currentPage);
        axios({
            method: 'post',
            url: '/admin/productAxios',
            data: {
                "productSaleStatus": productSaleStatusVal,
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
            const tableRows = pList.map((product) => {

                $(".margin .bold").text(pageInfo.total);

                let stopBtn = $(`<button class="stopSaleBtn" value="${product.PRODUCT_ID}">중지</button>`);
                let updateTime = "";

                if (product.PRODUCT_SALE_STATUS === "판매중지") {
                    stopBtn = $("");
                    updateTime =
                        $(`<span class="updateTime">${new Date(product.PRODUCT_UPDATED_AT)
                        .toLocaleDateString("ko-KR", { year: 'numeric', month: '2-digit', day: '2-digit' })
                        .replaceAll(". ", ".")
                        .substring(0, 10)}</span>`);
                }

                return $("<tr>")
                    .append($("<td>").html(`<input type="checkbox" name="chkStatus" value="${product.PRODUCT_ID}">`))
                    .append($("<td>").text(product.PRODUCT_ID))
                    .append($("<td>").addClass("product_Status").text(product.PRODUCT_SALE_STATUS))
                    .append($("<td>").text(product.CATEGORY_NAME))
                    .append($("<td>").text(product.PRODUCT_NAME))
                    .append($("<td>").text((product.PRODUCT_PRICE * (1 - (product.PRODUCT_DISCOUNT / 100))).toLocaleString("ko-KR", { maximumFractionDigits: 0 }) + "원"))
                    .append($("<td>").text(product.PRODUCT_DISCOUNT > 0 ? `${product.PRODUCT_DISCOUNT}%` : "-"))
                    .append($("<td>").attr("name", "찜수").text("-"))
                    .append($("<td>").attr("name", "결제횟수").text("-"))
                    .append($("<td>").attr("name", "리뷰수").text("-"))
                    .append($("<td>").text(new Date(product.PRODUCT_CREATED_AT).toLocaleDateString("ko-KR", { year: 'numeric', month: '2-digit', day: '2-digit' }).replaceAll(". ", ".").substring(0, 10)))
                    .append($("<td>").html(`<button class="editBtn" value="${product.PRODUCT_ID}">수정</button>`))
                    .append($("<td>").append(stopBtn).append(updateTime))
                    .append($("</tr>"))
            });
            $("#axiosBody").empty().append(tableRows);

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


/**
 * @author 황호준
 * 판매 중지 버튼 클릭 이벤트
 */
$(document).on("click", ".stopSaleBtn", (e) => {
    const btn = $(e.currentTarget);
    const productId = btn.val();

    axios({
        method: "post",
        url: "/admin/saleStop",
        data: {
            productId: productId,
            status: "판매중지"
        },
        dataType: "json",
        headers: {'Content-Type': 'application/json'}
    }).then(res => {
        const updatedTime = res.data
        btn.hide();
        const timeSpan = btn.closest('td').find(".updateTime");
        const formattedTime = formatDate(updatedTime);
        timeSpan.text(formattedTime);
        timeSpan.show();

        const productStatus = btn.closest('tr').find('.product_Status');
        productStatus.text("판매중지");

        localStorage.setItem(productId, "판매중지");
        localStorage.setItem(`updatedTime-${productId}`, formattedTime);
    })
});

/**
 * @author 황호준
 *  상품 가격 천자리 구분 기호 표시
 *  새로 고침 시에도 판매 중지 열의 시간 표시
 */
$(() => {
    // 상품 가격 천자리 구분 기호 표시
    $(".productPrice").each((i, e) => {
        const price = $(e).text();
        $(e).text(price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    });

    // 새로 고침 시에도 판매 중지 열의 시간 표시
    $(".stopSaleBtn").each((i, e) => {
        const btn = $(e);
        const productId = btn.val();
        const status = localStorage.getItem(productId);

        if (status === "판매중지") {
            btn.hide();
            const timeSpan = btn.next(".updateTime");
            const storedDate = localStorage.getItem(`updatedTime-${productId}`);
            if (storedDate) {
                timeSpan.text(storedDate);
            }
            timeSpan.show();
        }
    });
});

function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * @author 황호준
 * 선택상품들 판매중지 Axios
 */
$(document).ready(function() {
    $('#selectedSaleStopBtn').click(function() {
        const userConfirmed = confirm("선택한 상품을 판매 중지하시겠습니까?");

        if (userConfirmed) {
            const selectedStopValues = [];
            $('input[name="chkStatus"]:checked').each(function() {
                selectedStopValues.push($(this).val());
            });

            console.log("셀렉벨륭:" + selectedStopValues);

            axios({
                method: "post",
                url: "/admin/selectedSaleStop",
                data: {
                    "selectedProductId" : selectedStopValues
                },
                dataType: "json",
                headers: {'Content-Type': 'application/json'}
            }).then(res => {
                console.log(res.data);
                if(res.data == 1) {
                    location.href = "product";
                }
            });
        }
    });
});

/**
 * @author 황호준
 * 선택상품들 삭제 Axios
 */
$(document).ready(function() {
    $('#selectedDeleteProductBtn').click(function() {
        const userConfirmed = confirm("선택한 상품을 삭제하시겠습니까?");

        if (userConfirmed) {
            const selectedDeleteValues = [];
            $('input[name="chkStatus"]:checked').each(function() {
                selectedDeleteValues.push($(this).val());
            });

            console.log("셀딜릭벨륭:" + selectedDeleteValues);

            axios({
                method: "post",
                url: "/admin/selectedDelete",
                data: {
                    "selectedProductId" : selectedDeleteValues
                },
                dataType: "json",
                headers: {'Content-Type': 'application/json'}
            }).then(res => {
                if (res.data == 1) {
                    location.href = "product";
                }
            });
        }
    });
});