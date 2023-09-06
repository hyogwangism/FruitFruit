$(document).ready(function () {
    $('#paymentBtn').off('click'); // 기존에 등록된 클릭 이벤트 핸들러를 제거합니다.
    $('#paymentBtn').click(goPaymentPage); // 클릭 이벤트 핸들러를 다시 등록합니다.
});

function goPaymentPage() {
    const selectedIds = [];
    $('.cartProductId:checked').each(function () {
        selectedIds.push($(this).val());
    });

    if (selectedIds.length === 0) {
        alert('결제할 상품이 없습니다');
        return false;
    } else {
        axios({
            method: 'post',
            url: '/user/selectedCartIdAxios',
            data: {
                "selectedIds": selectedIds
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log(res.data);
            location.href = 'payment';
        });
    }
}


$(document).ready(function () {

    let paymentTotalProductInitPrice = 0;
    let paymentTotalProductDiscountPrice = 0;
    let paymentTotalProductPrice = 0;

    $('.cartRow').each(function () {
        const row = $(this);
        const paymentInitTotalPrice = parseFloat(row.find('.paymentProductInitTotalPrice').val());
        console.log("페이이닛:" + paymentInitTotalPrice)

        const paymentDiscountTotalPrice = parseFloat(row.find('.paymentProductDiscountTotalPrice').val());
        console.log("페이이닛:" + paymentInitTotalPrice)

        const paymentTotalPrice = parseFloat(row.find('.paymentProductTotalPrice').val());
        console.log("페이이닛:" + paymentInitTotalPrice)


        paymentTotalProductInitPrice += paymentInitTotalPrice;
        paymentTotalProductDiscountPrice += paymentDiscountTotalPrice;
        paymentTotalProductPrice += paymentTotalPrice;
    });


    // 합계 표시 업데이트
    $('.paymentInitTotalPrice').text(formatCurrency(paymentTotalProductInitPrice) + '원');
    $('.paymentTotalDiscountPrice').text(formatCurrency(-paymentTotalProductDiscountPrice) + '원');
    $('.paymentTotalProductPrice').text(formatCurrency(paymentTotalProductPrice) + '원');

    const expressPriceElement = $('.paymentExpressPrice');
    if (paymentTotalProductPrice >= 50000) {
        expressPriceElement.text('무료');
        $('.paymentTotalProductPriceWithExpressPrice').text(formatCurrency(paymentTotalProductPrice) + '원');
    } else if (paymentTotalProductPrice < 50000 && paymentTotalProductPrice > 0) {
        expressPriceElement.text('3000원');
        $('.paymentTotalProductPriceWithExpressPrice').text(formatCurrency(3000 + paymentTotalProductPrice) + '원');
    } else if (paymentTotalProductPrice === 0) {
        $('.paymentTotalProductPriceWithExpressPrice').text('0원');

    }
})

$(document).ready(function () {
    $("#전체동의").click(function () {
        const isChecked = $(this).prop("checked");
        $("input[type='checkbox'][name='1번']").prop("checked", isChecked);
        $("input[type='checkbox'][name='2번']").prop("checked", isChecked);
    });
});

$(document).on('click', '#payment_ok', () => {


    if (!$("#1번").prop("checked")) {
        alert('약관 동의에 체크하셔야합니다.')
        return false;
    }

    if (!$("#2번").prop("checked")) {
        alert('약관 동의에 체크하셔야합니다.')
        return false;
    }

    return payment_ok();
});



function payment_ok() {
    let deliverRequirement;
    if($('#ask').val()==='직접입력'){
        deliverRequirement = $('#customRequest').val();
    } else {
        deliverRequirement = $('#ask').val()
    }

    const formData = {
        'deliverPlace' : $('#deliveryAddressName').val(),
        'deliverReceiverName' : $('#receiverName').val(),
        'deliverPhone' : $('#receiverPhone').val(),
        'deliverPostalCode' : $('.postalCode').val(),
        'deliverAddress' : $('.postalCode2').val(),
        'deliverRequirement' : deliverRequirement
    };
        axios({
            method: 'post',
            url: 'payment_ok',
            data: formData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log(res.data);
        });
}

$(document).ready(function () {
    $('#ask').on('change', function () {
        const selectedOption = $(this).val();

        // "직접입력"이 선택되었을 때 입력 필드를 표시, 그 외에는 숨김
        if (selectedOption === '직접입력') {
            $('#customRequestField').show();
        } else {
            $('#customRequestField').hide();
        }
    });
});