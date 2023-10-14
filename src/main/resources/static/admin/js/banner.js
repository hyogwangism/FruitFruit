let formData = new FormData();
let bannerTitle, bannerStartDate, bannerEndDate, bannerHowLong, bannerShowTime;

/**
 * @author 황호준
 * 오늘 날짜 함수
 * @return YY-MM-DD
 */
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * @author 황호준
 * 배너 등록
 */
$(document).ready(function() {


    const today = getTodayDate();
    $('#banner__start__date').attr('min', today);
    $('#banner__start__date').val(today);
    $('#banner__end__date').val(today);

    // 시작일과 종료일을 변경할 때 날짜 차이를 계산하고 howlong 입력값을 업데이트함
    function updateHowlong() {
        const startDate = new Date($('#banner__start__date').val());
        const endDate = new Date($('#banner__end__date').val());
        // 당일인 경우 1로 설정
        if (startDate.toDateString() === endDate.toDateString()) {
            $('#howlong').val(1);
        } else {
            const timeDifference = endDate - startDate + 1;
            const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
            $('#howlong').val(daysDifference);
        }
    }

    // 시작일 또는 종료일이 변경될 때 howlong 입력값을 업데이트함
    $('#banner__start__date, #banner__end__date').on('change', updateHowlong);

    // "당일" 버튼을 클릭할 때
    $('#todayDate').on('click', function() {
        // 날짜 섹션을 숨기고 howlong을 1로 설정하고 시작일을 오늘로, 종료일을 먼 미래로 설정함
        $('.date').hide();
        $('#todayStatusPreBtn').show();
        $('#howlong').val(1);
        $('#banner__start__date').val(today);
        $('#banner__end__date').val(today);
    });

    // "상시" 버튼을 클릭할 때
    $('#alwaysDisplay').on('click', function() {
        // howlong 섹션과 날짜 섹션을 숨기고 시작일을 오늘로, 종료일을 먼 미래로 설정함
        $('.howlong').hide();
        $('.date').hide();
        $('#alwaysStatusPreBtn').show();
        $('#banner__start__date').val(today);
        $('#banner__end__date').val('3000-12-31');
        $('#howlong').val('10000');
    });

    //이전 버튼 클릭시 초기화
    $(document).on('click', '#todayStatusPreBtn, #alwaysStatusPreBtn', function (){
        $('.date').show();
        $('.howlong').show();
        $('#todayStatusPreBtn').hide();
        $('#alwaysStatusPreBtn').hide();
    })


    // When an image is added
    $('#bannerPicture').on('change', function() {
        const fileInput = $(this);
        const previewImage = $('#banner__img__preview');
        const changeImgButton = $('#changeImg');
        const addButton = $('.add-button');

        if (fileInput[0].files.length > 0) {
            // Show the preview image and "이미지 변경" button
            previewImage.attr('src', URL.createObjectURL(fileInput[0].files[0]));
            changeImgButton.show();
            addButton.hide(); // Hide the "+ 추가" div
        } else {
            // Hide the preview image and "이미지 변경" button
            previewImage.attr('src', '');
            changeImgButton.hide();
            addButton.show(); // Show the "+ 추가" div
        }
    });

    // When "이미지 변경" button is clicked
    $('#changeImg').on('click', function() {
        $('#bannerPicture').click(); // Trigger the file input click event
    });

    $(document).on('click', '.banner__submit__btn', () => {
        if($.trim($("#bannerName").val())==""){
            $(".txt04").show();
            $("#errorMsg").text("배너제목을 입력하셔야 합니다.");
            $("#bannerName").val('').focus();
            return false;
        }

        const isConfirmed = confirm("배너를 등록하시겠습니까?");
        if (!isConfirmed) {
            return false;
        }

        return bannerSubmitForm();
    });

});

/**
 * @author 황호준
 * 배너 등록시 비동기로 정보 보내는 함수
 */
function bannerSubmitForm() {

    bannerTitle = $('#bannerName').val();
    bannerStartDate = $('#banner__start__date').val();
    bannerEndDate = $('#banner__end__date').val();
    bannerHowLong = $('#howlong').val();
    bannerShowTime = $('#time').val();

    formData.append("bannerTitle", bannerTitle);
    formData.append("bannerStartDate", bannerStartDate);
    formData.append("bannerEndDate", bannerEndDate);
    formData.append("bannerHowLong", bannerHowLong);
    formData.append("bannerShowTime", bannerShowTime);
    formData.append("bannerImg", $("#bannerPicture")[0].files[0]);

    axios({
        method: 'POST',
        url: '/admin/insertBanner',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(res => {
        if (res.data === 1) {
            $(".txt05").show();
            $("#errorMsg1").html("상품 등록에 성공했습니다!");
        } else {
            alert('관리자로 로그인 해주세요')
            location.href='adminLogin';
        }
    });
}

/**
 * @author 황호준
 * 모달 버튼클릭시 동작 모음
 */
$(document).ready(function (){
    // "취소하기" 버튼을 클릭할 때 모달오픈
    $('.banner__write__cancel').on('click', function() {
        $('.admin__banner02').show();
    });

    // 오픈된 모달 취소확인시 배너페이지 이동
    $('.banner__cancel__confirm').on('click', function() {
        $('.admin__banner02').hide();
        location.href = '/admin/banner';
    });

    // 계속작성 클릭시 모달 숨김
    $('.banner__write__continue').on('click', function() {
        $('.admin__banner02').hide();
    });

    // 배너등록 완료 메세지모달 확인버튼 클릭시 배너 메인페이지 이동
    $('.writeConfirmButton').on('click', function() {
        $('.txt05').hide();
        location.href = '/admin/banner';
    });

    // 배너이미지 보기 모달 닫기버튼 클릭시 이미지모달 숨기기
    $('.img__modal__close__btn').on('click', function() {
        $('.admin__banner').hide();
    });

})


/**
 * @author 황호준
 * 배너 목록 보기 Axios
 */
$(document).ready(function () {
    let searchFieldVal;
    let bannerStatusVal="전체"
    let currentPage = 1;
    let pageSizeVal = 5;

    // productSaleStatus 버튼 클릭 시 버튼 스타일 변경
    $(document).on('click', '.banner__status', function () {
        // 모든 버튼 스타일 초기화
        $('.banner__status').removeClass('clicked');

        // 현재 클릭된 버튼 스타일 변경
        $(this).addClass('clicked');

        // 현재 클릭된 버튼의 값을 가져오기
        bannerStatusVal = $(this).val();
        console.log('배너상태: ' + bannerStatusVal);
        sendAxiosRequest_banner();
    });

    // 검색 버튼 클릭 시 검색어 값
    $('.banner__search__btn').click(function () {
        searchFieldVal = $('.banner__search__field').val();
        sendAxiosRequest_banner();
    });

    // pageSize 선택 시 한 화면에 보여질 목록개수
    $('select[name="howmany"]').change(function () {
        pageSizeVal = $(this).val(); // 선택한 값 가져오기
        console.log('하우매니: '+ pageSizeVal)
        sendAxiosRequest_banner();
    });

    // 이전 페이지 버튼
    $(document).on('click', '#admin__banner__prevBtn', () => {
        currentPage -= 1;
        sendAxiosRequest_banner();
    });

    // 페이지 번호 버튼
    $(document).on('click', '#admin__banner__numberBtn', (e) => {
        currentPage = parseInt($(e.currentTarget).attr("value"));
        sendAxiosRequest_banner();
    });

    // 다음 페이지 버튼
    $(document).on('click', '#admin__banner__nextBtn', () => {
        currentPage += 1;
        sendAxiosRequest_banner();
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
        const data = $("#banner_table").html();
        const blob = new Blob([data], {type: "application/vnd.ms-excel"});
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "배너목록.xlsx";
        link.click();
    });

    /**
     * @author 황호준
     * 배너 목록 보기 비동기함수
     */
    function sendAxiosRequest_banner() {
        // console.log(searchFieldVal);
        // console.log(pageSizeVal);
        console.log("커페"+currentPage);
        axios({
            method: 'post',
            url: '/admin/bannerAxios',
            data: {
                'bannerStatus' : bannerStatusVal,
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
            const bannerList = pageInfo.list;
            const searchBannerCount = res.data.searchBannerCount;
            $('#search__banner__count').text(searchBannerCount);
            $('#bannerAxiosBody').empty();
            for(let i=0; i<bannerList.length; i++){
                let statusText;
                if(bannerList[i].BANNER_STATUS === '게시중'){
                    statusText = '게시중'
                } else if(bannerList[i].BANNER_STATUS === '만료'){
                    statusText = '만료'
                } else if(bannerList[i].BANNER_STATUS === '중지'){
                    statusText = '중지'
                }

                let stopBtnStatus;
                if(bannerList[i].BANNER_STATUS === '게시중'){
                    stopBtnStatus = `<button className="banner__stop">중지</button>`
                } else if(bannerList[i].BANNER_STATUS === '중지'){
                    stopBtnStatus = `<span>${bannerList[i].BANNER_UPDATED_AT}</span>`;
                } else if(bannerList[i].BANNER_STATUS === '만료'){
                    stopBtnStatus = `<span>-</span>`;
                }


                const bannerAxiosHtml = `
                
                         <tr>
                            <td>
                                <input type="checkbox" name="chkStatus" id="banner_id" value="${bannerList[i].BANNER_ID}">
                            </td>
                            <td>${bannerList[i].BANNER_ID}</td>
                            <td>${statusText}</td>
                            <td>${bannerList[i].BANNER_START_DATE} ~ ${bannerList[i].BANNER_END_DATE}</td>
                            <td>${bannerList[i].BANNER_HOWLONG}</td>
                            <td>${bannerList[i].BANNER_TITLE}</td>
                            <td>${bannerList[i].BANNER_SHOWTIME}초</td>
                            <td>
                                <button class="show__banner__img">보기</button>
                            </td>
                            <td>
                                <button class="go__edit__page">수정</button>
                            </td>
                            <td>
                                ${stopBtnStatus}
                            </td>
                        </tr>
                `
                $('#bannerAxiosBody').append(bannerAxiosHtml);
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
                    .attr('id', 'admin__banner__prevBtn')
                    .attr('value', pageInfo.prePage)
                    .html('<span class="material-symbols-outlined">chevron_left</span>');
                paginationDiv.append(prevBtn);
            }

            pageNumberList.forEach((pageNumber) => {
                if (pageNumber <= totalData) {
                    const numberBtn = $('<a>')
                        .text(pageNumber)
                        .attr('href', '#')
                        .attr('id', 'admin__banner__numberBtn')
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
                    .attr('id', 'admin__banner__nextBtn')
                    .attr('value', pageInfo.nextPage)
                    .html('<span class="material-symbols-outlined">chevron_right</span>');
                paginationDiv.append(nextBtn);
            }
        });
    }
});

/**
 * @author 황호준
 * 이미지보기 모달 비동기
 */
$(document).ready(function () {
    let bannerId;

    // productSaleStatus 버튼 클릭 시
    $(document).on('click', '.show__banner__img', function () {
        // 모든 버튼 스타일 초기화
        bannerId = $(this).closest('tr').find('.banner_id').val();

        axios({
            method: 'post',
            url: '/admin/showBannerImg',
            data: {
                'BANNER_ID': bannerId
            },
            dataType: "JSON",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            $('.admin__banner').show();
            const bannerMap = res.data;
            // 템플릿 문자열로 배너 타이틀 설정
            $('.modal__banner__title').text('[' + bannerMap.BANNER_TITLE + ']' + '이미지');
            // 이미지 속성을 설정할 때 .attr() 메서드 사용
            $('.modal__banner__img').attr('src', bannerMap.BANNER_IMG_URL);
        });
    })

})

/**
 * @author 황호준
 * 배너수정 페이지
 */
$(document).ready(function (){

    // 배너수정버튼 클릭시 페이지 이동
    $(document).on('click','.go__edit__page', function() {
        location.href='/admin/banner/edit?bannerId=' + $(this).closest('tr').find('#banner_id').val();
    });

    // banner__start__date에서 과거 날짜를 선택하지 못하게 함
    const today = getTodayDate();
    $('.banner__edit__start__date').attr('min', today);
    $('.banner__edit__start__date').val(today);

    $(document).on('click', '.banner__edit__btn', function () {
        if($.trim($("#bannerName").val())==""){
            $(".txt04").show();
            $("#errorMsg").text("배너제목을 입력하셔야 합니다.");
            $("#bannerName").val('').focus();
            return false;
        }

        const isConfirmed = confirm("배너를 수정하시겠습니까?");
        if (!isConfirmed) {
            return false;
        }

        return bannerEditForm();
    });

    //배너 수정완료 모달 확인 클릭시 배너 목록 페이지 이동
    $(document).on('click', '.banner__edit__confirm__btn', function (){
        location.href='/admin/banner';
    })
})

/**
 * @author 황호준
 * 배너수정 Axios
 */
function bannerEditForm() {
    bannerTitle = $('#bannerName').val();
    bannerStartDate = $('.banner__edit__start__date').val();
    bannerEndDate = $('.banner__edit__end__date').val();
    bannerHowLong = $('#howlong').val();
    bannerShowTime = $('#time').val();

    console.log('이미지: ' + $("#bannerPicture")[0].files[0])
    console.log('시작일: ' + bannerStartDate)
    console.log('종료일: ' + bannerEndDate)

    formData.append("BANNER_ID", $('#banner_id').val())
    formData.append("bannerTitle", bannerTitle);
    formData.append("bannerStartDate", bannerStartDate);
    formData.append("bannerEndDate", bannerEndDate);
    formData.append("bannerHowLong", bannerHowLong);
    formData.append("bannerShowTime", bannerShowTime);

    // 파일 입력란에서 파일을 선택하지 않았을 때
    if ($("#bannerPicture")[0].files[0]) {
        console.log('이미지: ' + $("#bannerPicture")[0].files[0]);
        formData.append("bannerEditImg", $("#bannerPicture")[0].files[0]);
    }


    axios({
        method: 'POST',
        url: '/admin/editBanner',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(res => {
        if (res.data === 1) {
            $(".admin__banner__edit").show();
        } else {
            alert('관리자로 로그인 해주세요')
            location.href='/adminLogin';
        }
    });
}

/**
 * @author 황호준
 * 선택배너 게시중지 Axios
 */
$(document).ready(function() {
    let selectedBannerStopValues = [];
    $(document).on('click', '.selected__banner__stop', function (){
        const bannerStopConfirmed = confirm("선택한 배너를 게시중지 시키겠습니까?");

        if (bannerStopConfirmed) {
            $('input[name="chkStatus"]:checked').each(function() {
                selectedBannerStopValues.push($(this).val());
            });
        }
            console.log("셀중지벨륭:" + selectedBannerStopValues);

            axios({
                method: "post",
                url: "/admin/selectedBannerStop",
                data: {
                    "selectedBannerId" : selectedBannerStopValues
                },
                dataType: "json",
                headers: {'Content-Type': 'application/json'}
            }).then(res => {
                if (res.data == 1) {
                    location.href = "/admin/banner";
                }
            });
    });
});


$(document).ready(function() {
    let selectedBannerStopValues;
    $(document).on('click', '.banner__stop', function (){
        const StopConfirmed = confirm("선택한 배너를 게시중지 시키겠습니까?");
        if (StopConfirmed) {
            selectedBannerStopValues = $(this).closest('tr').find('#banner_id').val()
        }

            console.log("셀중지벨륭s:" + selectedBannerStopValues);

            axios({
                method: "post",
                url: "/admin/selectedBannerStop",
                data: {
                    "selectedBannerId" : selectedBannerStopValues
                },
                dataType: "json",
                headers: {'Content-Type': 'application/json'}
            }).then(res => {
                if (res.data == 1) {
                    location.href = "/admin/banner";
                }
            });
        })
});

/**
 * 스와이프 라이브러리
 */
$(document).ready(function () {
    const swiper = new Swiper(".swiper", {
        slidesPerView: 1, // Display one slide at a time
        spaceBetween: 6, // Space between slides
        loop: true, // Disable loop
        autoplay: true, // Disable autoplay
        direction: "horizontal", // Change to horizontal direction for next button
        centeredSlides: false, // Disable centered slides
        allowTouchMove: true, // Disable swiping
        watchOverflow: false, // Disable hiding pager and button when there's only one slide
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true, // Make pagination clickable
            type: 'bullets', // Use bullets for pagination
        },
        scrollbar: {
            el: '.swiper-scrollbar',
        },
        on: {
            init: function () {
                console.log("Swiper initialized");
            },
        },
    });
    // 각 슬라이드의 보여지는 시간 설정
    swiper.on("slideChange", function () {
        const currentSlide = swiper.slides[swiper.activeIndex];
        const showtime = currentSlide.getAttribute("data-autoplay");

        swiper.autoplay.stop(); // 자동재생 중지
        swiper.autoplay.start(showtime * 1000); // 자동재생 시작 (초 단위)
    });
});

