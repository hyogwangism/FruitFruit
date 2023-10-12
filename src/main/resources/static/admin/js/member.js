$(document).ready(function () {
    let searchFieldVal;
    let userStatusVal="전체"
    let searchTypeVal= $('.member__search__type').val();
    let currentPage = 1;
    let pageSizeVal = 5;

    // productSaleStatus 버튼 클릭 시
    $(document).on('click', '.user_status', function () {
        // 모든 버튼 스타일 초기화
        $('.user_status').removeClass('clicked');

        // 현재 클릭된 버튼 스타일 변경
        $(this).addClass('clicked');

        // 현재 클릭된 버튼의 값을 가져오기
        userStatusVal = $(this).val();
        console.log('답변상태: ' + userStatusVal);
        sendAxiosRequest_member();
    });

    // select 요소의 변경 이벤트를 감지합니다.
    $('.member__search__type').change(function() {
        // 선택된 옵션의 값을 가져옵니다.
        searchTypeVal = $(this).val();
        console.log('서타밸: ' + searchTypeVal);
        sendAxiosRequest_member();

    });

    // 검색 버튼 클릭 시
    $('.member__search__btn').click(function () {
        searchFieldVal = $('.member__search__field').val();
        sendAxiosRequest_member();
    });

    // pageSize 선택 시
    $('select[name="howmany"]').change(function () {
        pageSizeVal = $(this).val(); // 선택한 값 가져오기
        console.log('하우매니: '+ pageSizeVal)
        sendAxiosRequest_member();
    });

    // 이전 페이지 버튼
    $(document).on('click', '#admin__member__prevBtn', () => {
        currentPage -= 1;
        sendAxiosRequest_member();
    });

    // 페이지 번호 버튼
    $(document).on('click', '#admin__member__numberBtn', (e) => {
        currentPage = parseInt($(e.currentTarget).attr("value"));
        sendAxiosRequest_member();
    });

    // 다음 페이지 버튼
    $(document).on('click', '#admin__member__nextBtn', () => {
        currentPage += 1;
        sendAxiosRequest_member();
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


    function sendAxiosRequest_member() {
        // console.log(searchFieldVal);
        // console.log(pageSizeVal);
        console.log("커페"+currentPage);
        axios({
            method: 'post',
            url: '/admin/memberAxios',
            data: {
                'userStatus' : userStatusVal,
                'searchType' : searchTypeVal,
                "searchField": searchFieldVal,
                "startPage": currentPage,
                "pageSize": pageSizeVal

            },
            dataType: "JSON",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            const pageInfo = res.data.pageInfo;
            const memberList = pageInfo.list;
            const searchMemberCount = res.data.searchMemberCount;
            $('#search__member__count').text(searchMemberCount);
            $('#memberAxiosBody').empty();
            for(let i=0; i<memberList.length; i++){
                let statusText;
                    if(memberList[i].USER_STATUS === 1){
                        statusText = '활동중'
                    } else if(memberList[i].USER_STATUS === 2){
                        statusText = '탈퇴회원'
                    }

                let withdrawalBtnStatus;
                if(memberList[i].USER_STATUS === 1){
                    // withdrawalBtnStatus = '탈퇴'
                    withdrawalBtnStatus = `<button className="withdrawal_btn">탈퇴</button>`
                } else if(memberList[i].USER_STATUS === 2){
                    // withdrawalBtnStatus = memberList[i].USER_WITHDRAWAL_DATE
                    withdrawalBtnStatus = `<span>${memberList[i].USER_WITHDRAWAL_DATE}</span>`;
                }


                const memberAxiosHtml = `
                
                        <tr>
                            <td>
                                <input type="checkbox" name="chkStatus">
                                <input type="hidden" class="member__USER_ID_NO" value="${memberList[i].USER_ID_NO}">

                            </td>
                            <td>${memberList[i].USER_ID_NO}</td>
                            <td>${statusText}</td>
                            <td>${memberList[i].USER_NAME}</td>
                            <td>${memberList[i].USER_EMAIL}</td>
                            <td>
                                <a href="#">
                                ${memberList[i].ORDER_COUNT}
                                </a>
                            </td>
                            <td>
                                <form action="memberOrderListView" method="post">
                                    <input type="hidden" name="USER_ID_NO" class="member__USER_ID_NO" value="${memberList[i].USER_ID_NO}">
                                    <button type="submit" class="user__order__list">보기</button>
                                </form>
                            </td>
                            <td>${formatDate(memberList[i].USER_CREATED_AT)}</td>
                            <td>
                                ${withdrawalBtnStatus}
                            </td>
                        </tr>
                `
                $('#memberAxiosBody').append(memberAxiosHtml);
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
                    .attr('id', 'admin__member__prevBtn')
                    .attr('value', pageInfo.prePage)
                    .html('<span class="material-symbols-outlined">chevron_left</span>');
                paginationDiv.append(prevBtn);
            }

            pageNumberList.forEach((pageNumber) => {
                if (pageNumber <= totalData) {
                    const numberBtn = $('<a>')
                        .text(pageNumber)
                        .attr('href', '#')
                        .attr('id', 'admin__member__numberBtn')
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
                    .attr('id', 'admin__member__nextBtn')
                    .attr('value', pageInfo.nextPage)
                    .html('<span class="material-symbols-outlined">chevron_right</span>');
                paginationDiv.append(nextBtn);
            }
        });
    }
});

$(document).ready(function () {
    // 보기 버튼 클릭 이벤트 처리
    $(document).on('click', '.user__order__list', function (e) {
        e.preventDefault(); // 기본 클릭 이벤트 막기

        // 클릭된 버튼의 상위 폼 요소 찾기
        const form = $(this).closest('form');

        // 폼 데이터를 가져와 URL에 추가
        const formData = form.serialize();
        const url = form.attr('action') + '?' + formData;

        // 새 창 크기 및 위치 지정
        const width = 800; // 원하는 너비로 수정
        const height = 800; // 원하는 높이로 수정
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        // 새 창 열기
        window.open(url, '_blank', `width=${width},height=${height},left=${left},top=${top}`);
    });

    // 전체 선택/해제 체크박스 처리 (선택 사항)
    $('#allCheck').on('change', function () {
        const isChecked = $(this).prop('checked');
        $('input[name="chkStatus"]').prop('checked', isChecked);
    });
});

//선택된 회원 탈퇴처리
$(document).ready(function() {
    $('#selected__member__withdrawalBtn').click(function() {
        const withdrawalConfirmed = confirm("선택한 회원을 탈퇴시키겠습니까?");

        if (withdrawalConfirmed) {
            const selectedWithdrawalValues = [];
            $('input[name="chkStatus"]:checked').each(function() {
                selectedWithdrawalValues.push($(this).val());
            });

            console.log("셀탈퇴벨륭:" + selectedWithdrawalValues);

            axios({
                method: "post",
                url: "/admin/selectedWithdrawal",
                data: {
                    "selectedUserIdNo" : selectedWithdrawalValues
                },
                dataType: "json",
                headers: {'Content-Type': 'application/json'}
            }).then(res => {
                if (res.data == 1) {
                    location.href = "/admin/member";
                }
            });
        }
    });
});


$(document).ready(function() {
    let selectedWithdrawalValues;
    $(document).on('click', '.withdrawal_btn', function (){
        const withdrawalConfirmed = confirm("선택한 회원을 탈퇴 시키겠습니까?");
        if (withdrawalConfirmed) {
            selectedWithdrawalValues = $(this).closest('tr').find('.member__USER_ID_NO').val()
        }

        console.log("셀중지벨륭s:" + selectedWithdrawalValues);

        axios({
            method: "post",
            url: "/admin/selectedWithdrawal",
            data: {
                "selectedBannerId" : selectedWithdrawalValues
            },
            dataType: "json",
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if (res.data == 1) {
                location.href = "/admin/member";
            }
        });
    })
});
