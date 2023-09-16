$(document).ready(function () {
    $(document).on('click', '#review_write_btn', function () {
        $('.review__modal').show();
    });

    $(document).on('click', '.review__cancel', function () {
        $('.review__modal').hide();
        $('.review__cancel__modal').show();
    });

    $(document).on('click', '#review__cancel__modal__cancel', function () {
        $('.review__cancel__modal').hide();
    });

    $(document).on('click', '#review__continue', function () {
        $('.review__cancel__modal').hide();
        $('.review__modal').show();
    });

// reply_view_btn 클릭 시
    $(document).on('click', 'button#reply_view_btn', function () {
        // 현재 버튼이 속한 <ul> 요소 찾기
        const parentUl = $(this).closest('ul');

        // 답글을 보여주는 <ul> 토글
        parentUl.find('.review__reply__cont').toggle();

        // 답글보기 버튼 숨기고, 답글닫기 버튼 보이기
        parentUl.find('button#reply_view_btn').hide();
        parentUl.find('button#reply_view_cancel_btn').show();
    });

// reply_view_cancel_btn 클릭 시
    $(document).on('click', 'button#reply_view_cancel_btn', function () {
        // 현재 버튼이 속한 <ul> 요소 찾기
        const parentUl = $(this).closest('ul');

        // 답글을 숨김
        parentUl.find('.review__reply__cont').hide();

        // 답글닫기 버튼 숨기고, 답글보기 버튼 보이기
        parentUl.find('button#reply_view_cancel_btn').hide();
        parentUl.find('button#reply_view_btn').show();
    });

    // textarea 입력 내용을 모니터링하고 글자수를 업데이트하는 함수
    $('#cont').on('input', function () {
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


    // 리뷰 등록 버튼 클릭 시 리뷰 작성을 서버에 전송
    $(document).on('click', '#review__confirm__ok', function () {

        axios({
            method: 'post',
            url: '/user/review_ok',
            data: {
                "ORDER_PRODUCT_ID": $('#ORDER_PRODUCT_ID').val(),
                "USER_ID_NO": $('#userIdNo').val(),
                "REVIEW_CONT": $('#cont').val()
            },
            dataType: "JSON",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            $('.review__modal').hide()
            $('.review__confirm__modal').show()
        });
    });
})

//리뷰 수정
$(document).ready(function () {
    let reviewId;
    $(document).on('click', '#review_edit_btn', function () {
        // data-review-id 속성을 읽어와서 REVIEW_ID 값을 가져옵니다.
        reviewId = $(this).data('review-id');
        $('#review__edit__modal').show();

        console.log('REVIEW_ID:', reviewId);
    });

    // textarea 입력 내용을 모니터링하고 글자수를 업데이트하는 함수
    $('#editCont').on('input', function () {
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

    // 리뷰 수정 버튼 클릭 시 리뷰 작성을 서버에 전송
    $(document).on('click', '#review__edit__ok', function () {

        axios({
            method: 'post',
            url: '/user/review_edit_ok',
            data: {
                "REVIEW_ID": reviewId,
                "REVIEW_CONT": $('#editCont').val()
            },
            dataType: "JSON",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            $('.review__edit__modal').hide()
            $('.review__confirm__modal').show()
        });
    });
})

/**
 * 리뷰페이지 Axios
 */
$(document).ready(function () {
    let productId = $('#productId').val();
    let currentPage = 1;
    let pageSizeVal = 5;

    // 이전 페이지 버튼
    $(document).on('click', '#reviewPrevBtn', () => {
        currentPage -= 1;
        sendAxiosRequest_reviewPage();
    });

    // 페이지 번호 버튼
    $(document).on('click', '#reviewNumberBtn', (e) => {
        currentPage = parseInt($(e.currentTarget).attr("value"));
        sendAxiosRequest_reviewPage();
    });

    // 다음 페이지 버튼
    $(document).on('click', '#reviewNextBtn', () => {
        currentPage += 1;
        sendAxiosRequest_reviewPage();
    });

    function sendAxiosRequest_reviewPage() {
        axios({
            method: 'post',
            url: 'reviewPageAxios',
            data: {
                "productId": productId,
                "startPage": currentPage,
                "pageSize": pageSizeVal,
            },
            dataType: "JSON",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {

            const pageInfo = res.data;
            const reviewList = pageInfo.list;

            console.log('페인:' + pageInfo);
            console.log('리리:' + reviewList);
            // $('#reviewPageAxiosBody').empty();
            // for (let i = 0; i < reviewList.length; i++) {
            //     const ulElement = $('<ul>').css('margin-bottom', '10px'); // 수정: box03 클래스 추가
            //     const liElement = $('<li>');
            //     const idSpan = $('<span>').addClass('id').text(reviewList[i].USER_EMAIL);
            //     const dateSpan = $('<span>').addClass('date').text(reviewList[i].REVIEW_DATE);
            //     const pElement = $('<p>');
            //     const reviewContSpan = $('<span>').text(reviewList[i].REVIEW_CONT);
            //
            //     pElement.append(reviewContSpan);
            //
            //     // 조건부로 버튼 추가
            //     if (reviewList[i].USER_ID_NO == $('#userIdNo').val()) {
            //         const reviewEditBtn = $('<button>')
            //             .attr('id', 'review_edit_btn')
            //             .css({
            //                 'color': 'black',
            //                 'background-color': 'white',
            //                 'font-weight': 'bold'
            //             })
            //             .text('수정하기')
            //             .attr('data-review-id', reviewList[i].REVIEW_ID); // 수정: Thymeleaf 데이터 속성 추가
            //         pElement.append(reviewEditBtn);
            //     }
            //
            //     const replyViewBtn = $('<button>').attr('id', 'reply_view_btn').text('답글보기');
            //     const replyViewCancelBtn = $('<button>').attr('id', 'reply_view_cancel_btn').css('display', 'none').text('답글닫기');
            //
            //     pElement.append(replyViewBtn, replyViewCancelBtn);
            //     liElement.append(idSpan, dateSpan, pElement);
            //
            //     const reviewReplyContUL = $('<ul>').addClass('review__reply__cont');
            //
            //     // 조건부로 리뷰 답글 렌더링
            //     if (reviewList[i].REVIEW_REPLY_CONT == null) {
            //         const reviewReplyContLi = $('<li>')
            //             .css({
            //                 'display': 'none',
            //                 'margin-bottom': '30px',
            //                 'text-align': 'right',
            //                 'background-color': '#F6F6F6'
            //             }); // 스타일 추가
            //         const redSpan = $('<span>').css('color', 'red').text('아직 답변되지 않은 리뷰입니다.');
            //         reviewReplyContLi.append(redSpan);
            //         reviewReplyContUL.append(reviewReplyContLi);
            //     } else {
            //         const reviewReplyContLi = $('<li>')
            //             .css({
            //                 'display': 'none',
            //                 'margin-bottom': '30px',
            //                 'text-align': 'right',
            //                 'background-color': '#F6F6F6'
            //             }); // 스타일 추가;
            //         const blueSpan = $('<span>').css('color', 'blue').text('판매자');
            //         const reviewReplyContSpan = $('<span>').css('color', 'black').text(reviewList[i].REVIEW_REPLY_CONT);
            //         const reviewReplyDateSpan = $('<span>').css('color', 'black').text(reviewList[i].REVIEW_REPLY_DATE);
            //         reviewReplyContLi.append(blueSpan, $('<br>'), reviewReplyContSpan, reviewReplyDateSpan);
            //         reviewReplyContUL.append(reviewReplyContLi);
            //     }
            //
            //     ulElement.append(liElement);
            //     ulElement.append(reviewReplyContUL);
            //
            //     $('#reviewPageAxiosBody').append(ulElement);
            // }

            $('#reviewPageAxiosBody').empty();
            for (let i = 0; i < reviewList.length; i++) {
                const ulHtml = `
        <ul style="margin-bottom: 10px;">
            <li>
                <span class="id">${reviewList[i].USER_EMAIL}</span>
                <span class="date">${reviewList[i].REVIEW_DATE}</span>
                <p>
                    <span>${reviewList[i].REVIEW_CONT}</span>
                    ${reviewList[i].USER_ID_NO == $('#userIdNo').val() ? `
                        <button id="review_edit_btn" style="color: black; background-color: white; font-weight: bold;" data-review-id="${reviewList[i].REVIEW_ID}">수정하기</button>
                    ` : ''}
                    <button id="reply_view_btn">답글보기</button>
                    <button id="reply_view_cancel_btn" style="display: none">답글닫기</button>
                </p>
            </li>
            <ul class="review__reply__cont" style="display: none; margin-bottom: 30px; text-align: right; background-color: #F6F6F6;">
                 <li>
                 <span style="color: ${reviewList[i].REVIEW_REPLY_CONT == null ? 'red' : 'blue'};">
                    ${reviewList[i].REVIEW_REPLY_CONT == null ? '아직 답변되지 않은 리뷰입니다.' : '판매자'}
                  </span>
                 <br>
                 <span style="color: black">${reviewList[i].REVIEW_REPLY_CONT == null ? '' : reviewList[i].REVIEW_REPLY_CONT}</span>
                 <span style="color: black">${reviewList[i].REVIEW_REPLY_DATE == null ? '' : reviewList[i].REVIEW_REPLY_DATE}</span>
                <li>
            </ul>
        </ul>
    `;
                $('#reviewPageAxiosBody').append(ulHtml);
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
                    .attr('id', 'reviewPrevBtn')
                    .attr('value', pageInfo.prePage)
                    .html('<span class="material-symbols-outlined">chevron_left</span>');
                paginationDiv.append(prevBtn);
            }

            pageNumberList.forEach((pageNumber) => {
                if (pageNumber <= totalData) {
                    const numberBtn = $('<a>')
                        .text(pageNumber)
                        .attr('href', '#')
                        .attr('id', 'reviewNumberBtn')
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
                    .attr('id', 'reviewNextBtn')
                    .attr('value', pageInfo.nextPage)
                    .html('<span class="material-symbols-outlined">chevron_right</span>');
                paginationDiv.append(nextBtn);
            }


        });
    }
});