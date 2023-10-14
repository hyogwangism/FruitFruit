/**
 * @author 황호준
 * 리뷰목록 Axios
 */
$(document).ready(function () {
    let startDateValue, endDateValue, searchFieldVal;
    let replyStatusVal="전체"
    let searchTypeVal= $('.review__search__type').val();
    let currentPage = 1;
    let pageSizeVal = 5;

    // productSaleStatus 버튼 클릭 시
    $(document).on('click', '.replyStatus', function () {
        // 모든 버튼 스타일 초기화
        $('.replyStatus').removeClass('clicked');

        // 현재 클릭된 버튼 스타일 변경
        $(this).addClass('clicked');

        // 현재 클릭된 버튼의 값을 가져오기
        replyStatusVal = $(this).val();
        console.log('답변상태: ' + replyStatusVal);
        sendAxiosRequest_review();
    });

    // productSaleStatus 버튼 클릭 시
    $(document).on('click', '.dateStatus', function () {
        // 모든 버튼 스타일 초기화
        $('.dateStatus').removeClass('clicked');

        // 현재 클릭된 버튼 스타일 변경
        $(this).addClass('clicked');

        const months = $(this).data('months');

        // 시작 날짜 계산
        if (months === 0) {
            startDateValue = '1990-01-01';
            console.log('스밸:'+startDateValue)
        } else if ($(this).data('today') === 1) {
            const currentDate = new Date();
            startDateValue = reviewMonthDate(currentDate);
            console.log('스밸:'+startDateValue)
        } else if ($(this).data('week') === 1) {
            const currentDate = new Date();
            const oneWeekAgo = new Date(currentDate);
            oneWeekAgo.setDate(currentDate.getDate() - 7);
            startDateValue = reviewMonthDate(oneWeekAgo);
        } else {
            const currentDate = new Date();
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - months, currentDate.getDate());
            startDateValue = reviewMonthDate(startDate);
        }

        // 선택한 버튼의 data-months 값을 가져옴
        const endDate = new Date(); // 현재 날짜
        endDateValue = reviewMonthDate(endDate); // 현재 날짜를 yyyy-MM-dd 형식으로 변환

        // input 요소의 value 값을 설정
        $('#review__date1').val(startDateValue);
        $('#review__date2').val(endDateValue);

        // 현재 날짜로부터 months 이전 날짜를 컨트롤러로 전달하는 Axios 요청
        sendAxiosRequest_review();
    });

    // input 요소의 값이 변경될 때 발생하는 이벤트 핸들러
    $('#review__date1, #review__date2').change(function () {
        // 변경된 값 가져오기
        startDateValue = $('#review__date1').val();
        endDateValue = $('#review__date2').val();
        sendAxiosRequest_review();

        // 값을 출력하거나 다른 작업 수행
        console.log(`date1 값: ${startDateValue}`);
        console.log(`date2 값: ${endDateValue}`);
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
        $('#review__date1').val(getCurrentDate());
        $('#review__date2').val(getCurrentDate());
    })


    // select 요소의 변경 이벤트를 감지합니다.
    $('.review__search__type').change(function() {
        // 선택된 옵션의 값을 가져옵니다.
        searchTypeVal = $(this).val();
        console.log('서타밸: ' + searchTypeVal);
        sendAxiosRequest_review();

    });

    // 검색 버튼 클릭 시
    $('.review__search__btn').click(function () {
        searchFieldVal = $('.review__search__field').val();
        sendAxiosRequest_review();
    });

    // pageSize 선택 시
    $('select[name="howmany"]').change(function () {
        pageSizeVal = $(this).val(); // 선택한 값 가져오기
        console.log('하우매니: '+ pageSizeVal)
        sendAxiosRequest_review();
    });

    // 이전 페이지 버튼
    $(document).on('click', '#admin__review__prevBtn', () => {
        currentPage -= 1;
        sendAxiosRequest_review();
    });

    // 페이지 번호 버튼
    $(document).on('click', '#admin__review__numberBtn', (e) => {
        currentPage = parseInt($(e.currentTarget).attr("value"));
        sendAxiosRequest_review();
    });

    // 다음 페이지 버튼
    $(document).on('click', '#admin__review__nextBtn', () => {
        currentPage += 1;
        sendAxiosRequest_review();
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
        const data = $("#review_table").html();
        const blob = new Blob([data], {type: "application/vnd.ms-excel"});
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "리뷰리스트.xlsx";
        link.click();
    });

    /**
     * @author 황호준
     * 리뷰목록 Axios 함수
     */
    function sendAxiosRequest_review() {
        // console.log(searchFieldVal);
        // console.log(pageSizeVal);
        console.log("커페"+currentPage);
        axios({
            method: 'post',
            url: '/admin/reviewAxios',
            data: {
                'replyStatus' : replyStatusVal,
                'searchType' : searchTypeVal,
                "searchField": searchFieldVal,
                "startDate": startDateValue,
                "endDate": endDateValue,
                "startPage": currentPage,
                "pageSize": pageSizeVal

            },
            dataType: "JSON",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            const pageInfo = res.data.pageInfo;
            const reviewList = pageInfo.list;
            const searchReviewCount = res.data.searchReviewCount;
            $('#search__review__count').text(searchReviewCount);
            $('#reviewAxiosBody').empty();
            for(let i=0; i<reviewList.length; i++){
            const reviewAxiosHtml = `
                
                         <tr>
                            <td>
                                <input name="chkStatus" type="checkbox" >
                            </td>
                            <input type="hidden" class="review_ORDER_ID" value="${reviewList[i].ORDER_ID}">
                            <input type="hidden" class="review_REVIEW_ID" value="${reviewList[i].REVIEW_ID}">
                            <td>${reviewList[i].REVIEW_ID}</td>
                            <td>${reviewList[i].REVIEW_REPLY_STATUS}</td>
                            <td>
                                <a href='/user/productDetail?productId=' + ${reviewList[i].PRODUCT_ID}>
                                ${reviewList[i].PRODUCT_NAME}
                                </a>
                            </td>
                            <td>${reviewList[i].REVIEW_CONT}</td>
                            <td>${reviewList[i].USER_EMAIL}</td>
                            <td>${reviewList[i].USER_NAME}</td>
                            <td>${reviewList[i].REVIEW_DATE}</td>
                            <td>
                               <button class="review__reply__view" ${reviewList[i].REVIEW_REPLY_STATUS == '답변완료' ? 'style="color : black; background-color : white;"' : 'style="display : none;"'}>답변보기</button>

                               <button class="review__reply__write" ${reviewList[i].REVIEW_REPLY_STATUS == '미답변' ? 'style="color: white; background-color: #244497;"' : 'style="display : none;"'}> 답변하기</button>
                            </td>
                        </tr>
                `
                $('#reviewAxiosBody').append(reviewAxiosHtml);
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
                    .attr('id', 'admin__review__prevBtn')
                    .attr('value', pageInfo.prePage)
                    .html('<span class="material-symbols-outlined">chevron_left</span>');
                paginationDiv.append(prevBtn);
            }

            pageNumberList.forEach((pageNumber) => {
                if (pageNumber <= totalData) {
                    const numberBtn = $('<a>')
                        .text(pageNumber)
                        .attr('href', '#')
                        .attr('id', 'admin__review__numberBtn')
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
                    .attr('id', 'admin__review__nextBtn')
                    .attr('value', pageInfo.nextPage)
                    .html('<span class="material-symbols-outlined">chevron_right</span>');
                paginationDiv.append(nextBtn);
            }
        });
    }
});



function reviewMonthDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * @author 황호준
 * 답변하기 모달 오픈
 */
$(document).ready(function () {
    let currentPage = 1;
    let pageSizeVal = 5;

    // 모달 취소하기버튼 클릭시 진짜 취소하시겠습니까 모달 오픈
    $(document).on('click', '#review__reply__write__cancel', function () {
        $('#admin__review__write').hide();
        $('.admin__review__cancel').show();
    })

    // 진짜 취소하시겠습니까 모달 취소하기버튼 클릭시 모달 모두 닫기
    $(document).on('click', '#admin__review__cancel_btn', function () {
        $('#admin__review__write').hide();
        $('.admin__review__cancel').hide();
    })

    /**
     * @author 황호준
     * 계속작성, 리뷰 답글작성 버튼 클릭시 리뷰내용 및 답글쓰는 영역 보이는 Axios
     */
    $(document).on('click', '.review__reply__write, #admin__review__continue_btn', function () {
        const REVIEW_ID = $(this).closest('tr').find('.review_REVIEW_ID').val();
        const ORDER_ID = $(this).closest('tr').find('.review_ORDER_ID').val();

        axios({
            method: 'post',
            url: '/admin/reviewReplyView',
            data: {
                'REVIEW_ID': REVIEW_ID,
                'ORDER_ID': ORDER_ID,
                'startPage': currentPage,
                'pageSize': pageSizeVal
            },
            dataType: "JSON",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            const resultMap = res.data
            $('.admin__review__cancel').hide();
            $('#admin__review__write').show();
            $('#admin__review__write').empty();

            const reviewReplyHtml = `
            <div class="admin__review__inner">
                    <input type="hidden" id="review__reply__REVIEW_ID" value="${resultMap.REVIEW_ID}">
                    <div class="top">
                        <span class="review_reply_ORDER_ID">주문번호 ${resultMap.ORDER_ID}</span>
                    </div>

                    <div class="middle">
                        <p class="review_reply_PRODUCT_NAME">${resultMap.PRODUCT_NAME}</p>
                        <input type="text" value="${resultMap.REVIEW_CONT}" readonly>
                        <span class="review_reply_USER_NAME__REVIEW_DATE">${resultMap.USER_NAME} | ${resultMap.REVIEW_DATE} 작성</span>
                        <div class="line"></div>
                    </div>


                    <div class="bottom">
                        <p>리뷰답변</p>
                        <input type="text" class="review_reply_REVIEW_REPLY_CONT">
                        <span>15 / 500</span>

                        <div class="admin__review__buttons">
                            <button id="review__reply__write__cancel" style="background-color: white; color: black; font-weight: bold; border: 1px solid black;" > 취소하기 </button>
                            <button id="review__reply__write__confirm" style="color: white; font-weight: bold;"> 답변하기 </button>
                        </div>
                    </div>

                </div>
            `
            $('#admin__review__write').append(reviewReplyHtml);
        });
    });

    /**
     * @author 황호준
     * 리뷰답글 작성 완료 Axios
     */
    $(document).on('click', '#review__reply__write__confirm', function () {
        const review_id = $('#review__reply__REVIEW_ID').val();
        const review_reply_cont = $('.review_reply_REVIEW_REPLY_CONT').val();

        axios({
            method: 'post',
            url: '/admin/reviewReplyWrite_ok',
            data: {
                'REVIEW_ID': review_id,
                'REVIEW_REPLY_CONT': review_reply_cont
            },
            dataType: "JSON",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            $('#admin__review__write').hide();
            $('.admin__review__confirm').show();

        });
    })

    // 리뷰작성완료 모달 확인클릭시 리뷰목록 페이지 이동
    $(document).on('click', '.admin__review__confirm__btn', function (){
        $('.admin__review__confirm').hide();
        location.href='review';
    })

    /**
     * @author 황호준
     * 답변보기 클릭시 모달 오픈
     */
    $(document).on('click', '.review__reply__view', function () {
        const REVIEW_ID = $(this).closest('tr').find('.review_REVIEW_ID').val();

        const ORDER_ID = $(this).closest('tr').find('.review_ORDER_ID').val();

        axios({
            method: 'post',
            url: '/admin/reviewReplyView',
            data: {
                'REVIEW_ID': REVIEW_ID,
                'ORDER_ID': ORDER_ID,
                'startPage': currentPage,
                'pageSize': pageSizeVal
            },
            dataType: "JSON",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            const resultMap = res.data
            $('#admin__review__view').show();
            $('#admin__review__view').empty();

            const reviewReplyHtml = `
            <div class="admin__review__inner">
                    <input type="hidden" id="review__reply__REVIEW_ID" value="${resultMap.REVIEW_ID}">
                    <div class="top">
                        <span class="review_reply_ORDER_ID">주문번호 ${resultMap.ORDER_ID}</span>
                    </div>

                    <div class="middle">
                        <p class="review_reply_PRODUCT_NAME">${resultMap.PRODUCT_NAME}</p>
                        <input type="text" value="${resultMap.REVIEW_CONT}" readonly>
                        <span class="review_reply_USER_NAME__REVIEW_DATE">${resultMap.USER_NAME} | ${resultMap.REVIEW_DATE} 작성</span>
                        <div class="line"></div>
                    </div>


                    <div class="bottom">
                        <p>리뷰답변</p>
                        <input type="text" class="review_reply_REVIEW_REPLY_CONT" value="${resultMap.REVIEW_REPLY_CONT}" readonly>
                        <span>15 / 500</span>

                        <div class="admin__review__buttons">
                            <button id="review__reply__view__confirm" style="color: white; font-weight: bold;"> 확인 </button>
                        </div>
                    </div>

                </div>
            `
            $('#admin__review__view').append(reviewReplyHtml);
        });
    });

    // 리뷰답변 확인 모달 닫기
    $(document).on('click', '#review__reply__view__confirm', function (){
        $('#admin__review__view').hide();
    })

    })