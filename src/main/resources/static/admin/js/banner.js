let formData = new FormData();
let bannerTitle, bannerStartDate, bannerEndDate, bannerHowLong, bannerShowTime;

$(document).ready(function() {


    // 오늘의 날짜를 yyyy-mm-dd 형식으로 가져오는 함수
    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // banner__start__date에서 과거 날짜를 선택하지 못하게 함
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
        $('#banner__end__date').val('3000-12-31');
    });

    // "상시" 버튼을 클릭할 때
    $('#alwaysDisplay').on('click', function() {
        // howlong 섹션과 날짜 섹션을 숨기고 시작일을 오늘로, 종료일을 먼 미래로 설정함
        $('.howlong').hide();
        $('.date').hide();
        $('#alwaysStatusPreBtn').show();
        $('#banner__start__date').val(today);
        $('#banner__end__date').val(today);
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
        // if (res.data === 1) {
        //     $(".txt06").show();
        //     $("#errorMsg2").html("상품 등록에 성공했습니다!");
        // } else {
        //     alert('관리자로 로그인 해주세요')
        //     location.href='adminLogin';
        // }
    });
}

/**
 * 스와이프 라이브러리
 */
$(document).ready(function () {
    const swiper = new Swiper(".swiper", {
        slidesPerView: 1, // Display one slide at a time
        spaceBetween: 6, // Space between slides
        loop: false, // Disable loop
        autoplay: false, // Disable autoplay
        direction: "horizontal", // Change to horizontal direction for next button
        centeredSlides: false, // Disable centered slides
        allowTouchMove: false, // Disable swiping
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
});

