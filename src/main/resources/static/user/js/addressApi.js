/**
 * 카카오 주소 API
 */
function sample6_execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function (data) {
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

        // 각 주소의 노출 규칙에 따라 주소를 조합한다.
        // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ''; // 주소 변수
            var extraAddr = ''; // 참고항목 변수

        //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

        // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
            if (data.userSelectedType === 'R') {
        // 법정동명이 있을 경우 추가한다. (법정리는 제외)
        // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                }
        // 건물명이 있고, 공동주택일 경우 추가한다.
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
        // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if (extraAddr !== '') {
                    extraAddr = ' (' + extraAddr + ')';
                }
        // 조합된 참고항목을 해당 필드에 넣는다.
                document.getElementById("sample6_extraAddress").value = extraAddr;

            } else {
                document.getElementById("sample6_extraAddress").value = '';
            }

        // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('sample6_postcode').value = data.zonecode;
            document.getElementById("sample6_address").value = addr;
        // 커서를 상세주소 필드로 이동한다.
            document.getElementById("sample6_detailAddress").focus();
        }
    }).open();
}

function sample7_execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function (data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ''; // 주소 변수
            var extraAddr = ''; // 참고항목 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
            if (data.userSelectedType === 'R') {
                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if (extraAddr !== '') {
                    extraAddr = ' (' + extraAddr + ')';
                }
                // 조합된 참고항목을 해당 필드에 넣는다.
                document.getElementById("sample7_extraAddress").value = extraAddr;

            } else {
                document.getElementById("sample7_extraAddress").value = '';
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('sample7_postcode').value = data.zonecode;
            document.getElementById("sample7_address").value = addr;
            // 커서를 상세주소 필드로 이동한다.
            document.getElementById("sample7_detailAddress").focus();
        }
    }).open();
}

/**
 * 결제페이지에서 신규배송지 클릭시 모달 오픈
 */
$(document).ready(function(){
    $("#newAddressBtn").click(function(){
        $(".delivery__add").show();
    });
});

/**
 * 결제페이지에서 신규배송지 추가시 API를 통한 정보 입력
 */
$(document).ready(function() {
    // 작성취소 버튼 클릭 이벤트
    $('.delivery__add__cancel').click(function() {
        $('.delivery__add').hide();
    });

    // 배송지추가 버튼 클릭 이벤트
    $('.delivery__add__confirm').click(function() {
        const title = $('#addressModalTitle').val();  // 배송지명 가져오기
        const name = $('#addressModalName').val();  // 이름 가져오기
        const phone1 = $('#addressModalPhone1').val();  // 연락처 가져오기
        const phone2 = $('#addressModalPhone2').val();
        const postcode = $('#sample6_postcode').val();  // 주소 가져오기
        const address = $('#sample6_address').val();
        const detailAddress = $('#sample6_detailAddress').val();

            $('<option>').val(title).text(title).appendTo('#deliveryAddressName');  // 새로운 배송지명 추가
            $("#deliveryAddressName").find("option[value='" + title + "']").attr('selected', true);


        $('input[name="receiverName"]').eq(0).attr('value', name);   // 이름 입력란에 값 넣기

            $('input[name="receiverPhone"]').eq(0).attr('value', phone1 + phone2);   // 연락처 입력란에 값 넣기

            $('input[name="add"]').eq(0).attr('value', postcode);   // 주소 입력란에 값 넣기
            $('input[name="add2"]').eq(0).attr('value', address + ' ' + detailAddress);

            $('.delivery__add').hide();   // 모달창 닫기

    });
});