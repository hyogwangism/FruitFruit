$(document).on('click', '#findPwBtn', () => {

        axios({
            method: "POST", //데이터를 서버로 보내는 방법
            url: "/user/findPwd", //url 패턴 매핑주소 경로
            data: { "id": $.trim($("#id").val())}, //좌측 id 피라미터 이름에 우측 $id변수값을 저장
            dataType: "JSON", // 응답 데이터 타입을 JSON으로 설정
            header: {"Content-Type" : "application/json"} // 요청 헤더에 JSON 형식으로 데이터를 보냄
        }).then(res => {
            if (res.data === 1) {
                $(".txt04").show();
                $("#errorMsg").text("ID(이메일)이 확인 되었습니다.");

            } else {
                $(".txt05").show();
                $("#errorMsg1").text("등록된 ID(이메일)가 존재하지 않습니다");
                $("#id").val('').focus();
                return false;
            }
        })
}); //end ID Check

function closeModal() {
    $(".txt04").hide();
    $(".txt05").hide();
}

function changePw() {
    const idValue = $("#id").val();
    if (idValue.trim() !== '') {
        window.location.href = '/user/changePw?id=' + encodeURIComponent(idValue);
    }
}

function changedPw() {
        window.location.href = '/user/login';
}


function getIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// 'changePwBtn' 버튼을 클릭했을 때의 처리
$(document).on('click', '#changePwBtn', () => {
    let regexPassword = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\\\|\[\]{};:'",.<>\/?])(?!.*\s).{8,20}$/;
    if(!regexPassword.test($("#newpw").val())) {
        $(".txt05").show();
        $("#errorMsg1").html('영문자 + 숫자 + 특수문자 포함 최소 8자리 이상 20자리 이내로 입력해 주세요.');
        $("#newpw").val("").focus();
        return false;
    }

    const idValue = getIdFromUrl();
    if (!idValue) {
        alert('ID 값을 찾을 수 없습니다.');
        return;
    }

    // 서버로 데이터 전송
    axios({
        method: "POST",
        url: "/user/changePwd",
        data: {
            "newpw": $.trim($("#newpw").val()),
            "id": idValue
        }, // id 값 추가
        dataType: "JSON",
        header: { "Content-Type": "application/json" }
    }).then(res => {
        if (res.data === 1) {
            $(".txt04").show();
            $("#errorMsg").html('비밀번호가 정상적으로 변경되었습니다.<br>로그인 화면으로 이동합니다.');
        } else {
            $newtext = '<font color="red" size="3"><b>기존 비밀번호와 동일합니다.</b></font>';
            $("#changePwdCheckMsg").text('');
            $("#changePwdCheckMsg").show();
            $("#changePwdCheckMsg").append($newtext);
            $("#newpw").val('').focus();
            $("#newpw2").val('');
            return false;
        }
    });
});

$(document).ready(function() {
    // #pw2 입력박스에서 포커스를 벗어났을 때 이벤트 처리
    $("#newpw2").on("blur", function() {
        let $newpw = $.trim($("#newpw").val());
        let $newpw2 = $.trim($(this).val());

        // 비밀번호와 비밀번호 확인 값이 다른 경우 메시지 표시
        if ($newpw !== $newpw2) {
            $("#changePwdCheckMsg").hide();
            $("#PwdErrorMessage").text("비밀번호가 일치하지 않습니다.").show();
        } else {
            $("#PwdErrorMessage").hide();
        }
    });
});


$(document).ready(function() {
    // 눈표시 클릭 시 패스워드 보이기
    $('#togglePassword1').on('click', function() {
        let newpwInput = $('#newpw');

        if (newpwInput.attr('type') === 'password') {
            $(this).find('.fa-eye-slash').removeClass('fa-eye-slash').addClass('fa-eye');
            newpwInput.attr('type', 'text');
        } else {
            $(this).find('.fa-eye').removeClass('fa-eye').addClass('fa-eye-slash');
            newpwInput.attr('type', 'password');
        }
    });

    $('#togglePassword2').on('click', function() {
        let newpw2Input = $('#newpw2');

        if (newpw2Input.attr('type') === 'password') {
            $(this).find('.fa-eye-slash').removeClass('fa-eye-slash').addClass('fa-eye');
            newpw2Input.attr('type', 'text');
        } else {
            $(this).find('.fa-eye').removeClass('fa-eye').addClass('fa-eye-slash');
            newpw2Input.attr('type', 'password');
        }
    });
});
