/**
 * @author 황호준
 * 배송지 추가
 */
$(document).ready(function () {
    // 배송지 추가 모달 오픈
    $(".addDeliveryAddress").click(function () {
        if(parseInt($('#addressCount').val()) < 3 ){
        $(".delivery__add").show();
        } else if(parseInt($('#addressCount').val()) >= 3) {
            alert('배송지는 3개까지만 저장됩니다');
        }
    });

    // 취소버튼 클릭스 진짜 취소하시겠습니까 모달 오픈
    $(".delivery__add__cancel").click(function () {
        $(".delivery__add__calcel").show();
    });

    // 진짜 취소클릭시 모든 모달 닫기
    $(".cancel_modal_ok").click(function () {
        $(".delivery__add__calcel").hide();
        $(".delivery__add").hide();
    });

    // 계속작성 클릭시 배송지 추가 모달 오픈
    $(".continueBtn").click(function () {
        $(".delivery__add__calcel").hide();
        $(".delivery__add").show();
    });

    // 배송지 추가 완료 모달 확인 클릭시 배송지추가 페이지 이동
    $('.delivery__add__confirm__ok').click(function (){
        location.href='mypageDelivery';
    })

});

/**
 * @author 황호준
 * 배송지 수정
 */
$(document).ready(function () {
    // 배송지 수정 모달 오픈
    $(".Delivery_Edit_Btn").click(function () {
        $(".delivery__edit").show();
        $("#edit_title").val($('#USER_DELIVERY_PLACE').val())
        $("#edit_name").val($('#DELIVER_RECEIVER_NAME').val())
        $("#edit_phone1").val($('#DELIVER_PHONE').val().substring(0, 3))
        $("#edit_phone2").val($('#DELIVER_PHONE').val().substring(3))
    });

    // 취소하기 버튼 클릭시 모달 닫기
    $(".cancel_modal_ok").click(function () {
        $(".delivery__edit").hide();
        $(".delivery__add__calcel").hide();
    });

    // 배송지 수정 모달 닫기
    $(".delivery__edit__cancel").click(function () {
        $(".delivery__edit").hide();
    });

    // 수정완료 모달 확인버튼 클릭시 마이페이지 배송지 페이지로 이동
    $('.delivery__add__confirm__ok').click(function (){
        location.href='mypageDelivery';
    })

});

/**
 * @author 황호준
 * 배송지 추가 등록 유효성 검증
 */
$(document).on('click', '#delivery__add__confirm_ok', function (){
    if ($.trim($("#add_title").val()) === '') {
        alert('배송지명을 입력해주세요')
        $(".delivery__add").show();
        return false;
    }

    if ($.trim($("#add_name").val()) === '') {
        alert('배송지명을 입력해주세요')
        $(".delivery__add").show();
        return false;
    }

    if ($.trim($("#add_phone1").val()) === '') {
        alert('받으실 분 연락처를 입력해주세요')
        $(".delivery__add").show();
        return false;
    }

    if ($.trim($("#add_phone2").val()) === '') {
        alert('받으실 분 연락처를 입력해주세요')
        $(".delivery__add").show();
        return false;
    }

    if ($.trim($(".postalCode").val()) === '') {
        alert('우편번호를 입력해주세요')
        $(".delivery__add").show();
        return false;
    }

    if ($.trim($(".postalCode2").val()) === '') {
        alert('주소를 입력해주세요')
        $(".delivery__add").show();
        return false;
    }
    return delivery_add_ok();
})

/**
 * @author 황호준
 * 배송지 추가 등록 Axios 함수
 */
function delivery_add_ok() {

    const formData = {
        'deliverPlace' : $('#add_title').val(),
        'deliverReceiverName' : $('#add_name').val(),
        'deliverPhone' : $('#add_phone1').val() + $('#add_phone2').val(),
        'deliverPostalCode' : $('.postalCode').val(),
        'deliverAddress' : $('#sample6_address').val() + ' ' + $('#sample6_detailAddress').val()
    };


    axios({
        method: 'post',
        url: 'mypageAddDeliveryAxios',
        data: formData,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        $('.delivery__add__confirm').show()

    });
}

/**
 * @author 황호준
 * 배송지 수정 유효성 검증
 */
$(document).on('click', '.delivery__edit__confirm', function (){
    if ($.trim($("#edit_title").val()) === '') {
        alert('배송지명을 입력해주세요')
        $(".delivery__edit").show();
        return false;
    }

    if ($.trim($("#edit_name").val()) === '') {
        alert('배송지명을 입력해주세요')
        $(".delivery__edit").show();
        return false;
    }

    if ($.trim($("#edit_phone1").val()) === '') {
        alert('받으실 분 연락처를 입력해주세요')
        $(".delivery__edit").show();
        return false;
    }

    if ($.trim($("#edit_phone2").val()) === '') {
        alert('받으실 분 연락처를 입력해주세요')
        $(".delivery__edit").show();
        return false;
    }

    if ($.trim($("#sample7_postcode").val()) === '') {
        alert('우편번호를 입력해주세요')
        $(".delivery__edit").show();
        return false;
    }

    if ($.trim($("#sample7_address").val()) === '') {
        alert('주소를 입력해주세요')
        $(".delivery__edit").show();
        return false;
    }
    return delivery_edit_ok();
})

/**
 * @author 황호준
 * 배송지 수정 Axios 함수
 */
function delivery_edit_ok() {

    const formData = {
        'deliverId' : $('#USER_DELIVERY_ID').val(),
        'deliverPlace' : $('#edit_title').val(),
        'deliverReceiverName' : $('#edit_name').val(),
        'deliverPhone' : $('#edit_phone1').val() + $('#edit_phone2').val(),
        'deliverPostalCode' : $('#sample7_postcode').val(),
        'deliverAddress' : $('#sample7_address').val() + ' ' + $('#sample7_detailAddress').val()
    };


    axios({
        method: 'post',
        url: 'mypageEditDeliveryAxios',
        data: formData,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        $(".delivery__edit").hide();
        $('.delivery__add__confirm').show()

    });
}

$(document).ready(function() {
    $('[id^="formattedPhoneNumber"]').each(function() {
        const phoneNumberElement = $(this);
        const phoneNumber = phoneNumberElement.text();
        const formattedPhoneNumber = phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        phoneNumberElement.text(formattedPhoneNumber);
    });
});

/**
 * @author 황호준
 * 배송지 삭제
 */
$(document).ready(function (){
// 첫 번째 모달 닫기
    $(".Delivery_Delete_Btn").click(function () {
        $(".delivery__delete").show();
    });

    $('#deleteCancelBtn').click(function (){
        $(".delivery__delete").hide();
    });

    $('#deleteBtn').click(function (){
        delivery_delete_ok()
    });
})


/**
 * @author 황호준
 * 배송지 삭제 Axios 함수
 */
    function delivery_delete_ok() {
        axios({
            method: 'post',
            url: 'mypageDeleteDeliveryAxios',
            data:
                {
                    'deliverId': $('#USER_DELIVERY_ID').val()
                },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            $(".delivery__delete").hide();
            $('.delivery__add__confirm').show()
            $('.delivery__add__confirm__inner .bottom span').text('배송지 삭제가 완료되었습니다.');
        });
    }