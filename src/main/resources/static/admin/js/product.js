/**
 * @author 황호준
 * 이미지 파일 미리보기
 */
$(document).ready(function() {
    // 파일 입력 요소를 선택합니다
    const productPictureInput = $('#productPicture');

    // 미리보기 이미지 요소를 선택합니다
    const imagePreview = $('#imagePreview');

    // 파일 입력 변경 이벤트를 처리합니다
    productPictureInput.on('change', function() {
        // 파일이 선택되었는지 확인합니다
        if (productPictureInput[0].files && productPictureInput[0].files[0]) {
            const reader = new FileReader();

            // 파일이 로드되면 미리보기 이미지의 src 속성을 설정합니다
            reader.onload = function (e) {
                // 이미지를 로드한 후 크기를 100x100픽셀로 제한합니다
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 100;
                    canvas.height = 100;
                    ctx.drawImage(img, 0, 0, 100, 100);
                    imagePreview.attr('src', canvas.toDataURL());
                };
                img.src = e.target.result;
            };

            // 선택된 파일을 데이터 URL로 읽습니다
            reader.readAsDataURL(productPictureInput[0].files[0]);
        } else {
            // 파일이 선택되지 않았거나 선택이 해제된 경우 기본 이미지를 표시하거나 미리보기를 제거합니다
            imagePreview.attr('src', '#'); // 여기에 기본 이미지 경로를 설정할 수 있습니다
        }
    });
});

/**
 * @author 황호준
 * 상품등록 유효성 검증
 */
$(document).on('click', '#productSubmitBtn', () => {
    if($.trim($("#productName").val())==""){
        $(".txt04").show();
        $("#errorMsg").text("상품명을 입력하셔야 합니다.");
        $("#productName").val('').focus();
        return false;
    }

    if($.trim($("#productSort").val())==""){
        $(".txt04").show();
        $("#errorMsg").text("상품분류를 선택해주세요.");
        $("#productSort").val('').focus();
        return false;
    }

    if($.trim($("#productPrice").val())==""){
        $(".txt04").show();
        $("#errorMsg").text("상품가격을 입력해주세요.");
        $("#productPrice").val('').focus();
        return false;
    }

    if($.trim($("#productInventory").val())==""){
        // 아이디를 입력하지 않은 경우 모달창 띄우기
        $(".txt04").show();
        $("#errorMsg").text("재고수량을 입력해주세요.");
        $("#productInventory").val('').focus();
        return false;
    }

    if($.trim($("#productPicture").val())==""){
        // 아이디를 입력하지 않은 경우 모달창 띄우기
        $(".txt04").show();
        $("#errorMsg").text("상품이미지를 등록해주세요.");
        $("#productPicture").val('').focus();
        return false;
    }

    const isConfirmed = confirm("상품을 등록하시겠습니까?");
    if (!isConfirmed) {
        return false;
    }

    return productSubmitForm();
});

/**
 * @author 황호준
 * 모달 닫기
 */
function closeModal() {
    $(".txt04").hide();
    $(".txt05").hide();
}

/**
 * @author 황호준
 * '등록취소' 버튼을 클릭했을 때 모달창을 열고 처리
 */
$(document).ready(function() {

    $('#productCancelBtn').on('click', function() {
        $(".txt05").show();
        $("#errorMsg1").html('작성중이던 모든 항목이 모두 삭제됩니다. <br>취소하시겠습니까?');
    });

    // '확인' 버튼을 눌렀을 때 index 페이지로 이동하는 동작을 처리합니다.
    $('.confirmButton1').on('click', function() {
        // 여기에 index 페이지로 이동하는 코드를 작성합니다.
        window.location.href = '/admin/dashboard'; // 이동할 페이지의 경로를 적절히 수정하세요.
    });

    // '취소' 버튼을 눌렀을 때 모달창을 닫는 동작을 처리합니다.
    $('.cancelBtn').on('click', function() {
        closeModal();
    });

    // '취소' 버튼을 눌렀을 때 모달창을 닫도록 closeModal 함수를 전역으로 선언합니다.
    window.closeModal = closeModal;

    // closeModal 함수를 정의합니다.

});


/**
 * @author 황호준
 * 입력 필드의 값이 변경될 때마다 자동으로 계산하도록 이벤트 핸들러를 등록합니다.
 */
$(document).ready(function () {
    $("#productPrice, #productDiscount").on("input", function () {
        // 상품금액과 상품할인율 입력 필드의 값을 가져옵니다.
        let productPrice = parseFloat($("#productPrice").val()) || 0;
        let productDiscount = parseFloat($("#productDiscount").val()) || 0;

        // 할인 적용 후 금액 계산
        let totalPrice = productPrice * (100 - productDiscount) / 100;

        // 소수점 이하는 버리고 정수로 표시합니다.
        totalPrice = Math.floor(totalPrice);

        // 계산 결과를 할인적용 후 금액 입력 필드에 자동으로 입력합니다.
        $("#totalPrice").val(totalPrice);
    });
});


/**
 * 상품금액 원화 단위로 , 찍고 할인금액 자동 입력
 */
// $(document).ready(function() {
//     // 상품금액을 입력할 때 원화 단위로 ,를 찍는 함수를 정의합니다.
//     function formatCurrency(input) {
//         const numericValue = parseInt(input.replace(/[^0-9]+/g, ''));
//         if (!isNaN(numericValue)) {
//             const formattedValue = numericValue.toLocaleString('ko-KR');
//             return formattedValue;
//         }
//         return '';
//     }
//
//     // 상품금액 input 필드의 값이 변경될 때마다 원화 단위로 ,를 찍습니다.
//     $("#productPrice").on('input', function() {
//         const inputValue = $(this).val();
//         const formattedValue = formatCurrency(inputValue);
//         $(this).val(formattedValue);
//     });
//
//     // 할인적용 후 금액을 계산하여 설정하는 함수를 정의합니다.
//     function calculateTotalPrice() {
//         const productPrice = parseInt($("#productPrice").val().replace(/[^0-9]+/g, ''));
//         const productDiscount = parseFloat($("#productDiscount").val());
//         if (!isNaN(productPrice) && !isNaN(productDiscount)) {
//             const discountAmount = (productPrice * productDiscount) / 100;
//             const totalPrice = productPrice - discountAmount;
//
//             // 소수점 이하는 버리고 원화 단위로 ,를 찍습니다.
//             const formattedTotalPrice = totalPrice.toLocaleString('ko-KR');
//             $("#totalPrice").val(formattedTotalPrice);
//         }
//     }
//
//     // 상품금액과 상품할인율 input 필드의 변경 이벤트를 처리합니다.
//     $("#productPrice, #productDiscount").on('input', calculateTotalPrice);
//     $("#productPrice, #productDiscount").on('change', calculateTotalPrice);
// });






