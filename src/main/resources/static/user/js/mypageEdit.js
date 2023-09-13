$(document).ready(function (){
    $('#pwdCheckBtn').click(function (){
        editPwdCheck()
    });
})

function editPwdCheck() {
    const wrongPwdConfirm = 0
    axios({
        method: 'post',
        url: 'editPwdChk',
        data:
            {
                'editPwdChk': $('.pwdConfirm').val(),
                'wrongPwdConfirm': wrongPwdConfirm
            },
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        const resultMap = res.data;
        if(resultMap.equalPwd != null) {
            location.href='mypageEdit2';

        } else if(resultMap.nonEqualPwd != null){
           $('.input').hide();
           $('.inputWrong').show();
            $('.wrongPwdConfirm').val('').focus();
        } else if(Object.keys(resultMap).length === 0) {
            alert('회원만 이용할 수 있는 서비스 입니다.')
            location.href='login'
        }

    });
}

$(document).on('click', '#userNameChkBtn', () => {

    /* copy begin */
    $("#nameCheckMsg").hide();
    //아이디 영역을 숨김
    let $id = $.trim($("#email").val());
    let $name = $.trim($("#editName").val());
    if ($name == "") {
        // 아이디를 입력하지 않은 경우 모달창 띄우기
        $(".txt04").show();
        $("#errorMsg").text("닉네임을 입력하셔야 합니다.");
        $("#editName").val('').focus();
        return false;
    } else {

        //아이디 중복확인
        axios({//$는 jQuery란 뜻. $.ajax 뜻은 jQuery 내의 아작스 실행
            method: "POST", //데이터를 서버로 보내는 방법
            url: "/user/nameChk", //url 패턴 매핑주소 경로
            data: {
                "id" : $id,
                "name": $name
            }, //좌측 id 피라미터 이름에 우측 $user_id변수값을 저장
            dataType: "json", //서버의 실행된 결과값을 사용자로 받아오는 자료형
        }).then(res => {
            //서버 데이터를 data 변수에 저장
            let $newtext;
            if (res.data === 1) {//중복 아이디가 있다면
                $newtext = '<font color="red" size="3"><b>중복 닉네임입니다.</b></font>';
                $("#nameCheckMsg").text('');
                $("#nameCheckMsg").show();
                $("#nameCheckMsg").append($newtext);
                $("#name").val('').focus();
                return false;

            } else {//중복 아이디가 아니면
                $newtext = '<font color="blue" size="3"><b>사용가능한 닉네임입니다.</b></font>';
                $("#nameCheckMsg").text('');
                $("#nameCheckMsg").show();
                $("#nameCheckMsg").append($newtext);
                $("#name").focus();
            }
        })
    }
}); //end Name Check

$(document).ready( function (){
    $('#pwdChangeBtnCancel').click(function() {
        $('.change__PW__button').hide();
        $('.change__PW').show();
    });

    $('#pwdChangeBtn').click(function() {
        $('.change__PW__button').show();
        $('.change__PW').hide();
    })
})

// 'editConfirmBtn' 버튼을 클릭했을 때의 처리
$(document).ready( function (){
    $('#editCancelBtn').click(function() {
        $('.mypageEdit__cancel').show();
    });

    $('#continueBtn').click(function() {
        $('.mypageEdit__cancel').hide();
    });

})


// 'editConfirmBtn' 버튼을 클릭했을 때의 처리
$(document).on('click', '#editConfirmBtn', () => {
    let regexPassword = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\\\|\[\]{};:'",.<>\/?])(?!.*\s).{8,20}$/;
    if(!regexPassword.test($("#newPwd").val())) {
        $(".txt04").show();
        $("#errorMsg").text('영문자 + 숫자 + 특수문자 포함 최소 8자리 이상 20자리 이내로 입력해 주세요.');
        $("#newPwd").val("").focus();
        return false;
    }

    // 비밀번호와 비밀번호 확인 값이 다른 경우 메시지 표시
    if ($.trim($("#newPwd").val()) !== $.trim($("#newPwd2").val())) {
        $(".txt04").show();
        $("#errorMsg").text('비밀번호가 일치하지 않습니다');
        $("#newPwd").val("").focus();
        $("#newPwd2").val("").focus();
        return false;
    }

    let $id = $.trim($("#email").val());

    // 서버로 데이터 전송
    axios({
        method: "POST",
        url: "/user/edit_ok",
        data: {
            "newpw": $.trim($("#newPwd").val()),
            "id": $id,
            "name" : $.trim($("#editName").val()),
            "phone" : $.trim($("#editPhone").val())
        }, // id 값 추가
        dataType: "JSON",
        header: { "Content-Type": "application/json" }
    }).then(res => {
        if (res.data === 1) {
            $(".txt05").show();
            $("#errorMsg1").html('회원정보가 수정 완료되었습니다.<br>메인 화면으로 이동합니다.');
        }
    });
});



$(document).ready(function() {
    // #pw2 입력박스에서 포커스를 벗어났을 때 이벤트 처리
    $("#newPwd2").on("blur", function() {
        let $newpw = $.trim($("#newPwd").val());
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
        let newpwInput = $('#newPwd');
        let checkPwdInput = $('#pwdConfirm');

        if (newpwInput.attr('type') === 'password') {
            $(this).find('.fa-eye-slash').removeClass('fa-eye-slash').addClass('fa-eye');
            newpwInput.attr('type', 'text');
        } else {
            $(this).find('.fa-eye').removeClass('fa-eye').addClass('fa-eye-slash');
            newpwInput.attr('type', 'password');
        }

        if (checkPwdInput.attr('type') === 'password') {
            $(this).find('.fa-eye-slash').removeClass('fa-eye-slash').addClass('fa-eye');
            checkPwdInput.attr('type', 'text');
        } else {
            $(this).find('.fa-eye').removeClass('fa-eye').addClass('fa-eye-slash');
            checkPwdInput.attr('type', 'password');
        }
    });

    $('#togglePassword2').on('click', function() {
        let newpw2Input = $('#newPwd2');
        let wrongPwdConfirm = $('#wrongPwdConfirm');

        if (newpw2Input.attr('type') === 'password') {
            $(this).find('.fa-eye-slash').removeClass('fa-eye-slash').addClass('fa-eye');
            newpw2Input.attr('type', 'text');
        } else {
            $(this).find('.fa-eye').removeClass('fa-eye').addClass('fa-eye-slash');
            newpw2Input.attr('type', 'password');
        }

        if (wrongPwdConfirm.attr('type') === 'password') {
            $(this).find('.fa-eye-slash').removeClass('fa-eye-slash').addClass('fa-eye');
            wrongPwdConfirm.attr('type', 'text');
        } else {
            $(this).find('.fa-eye').removeClass('fa-eye').addClass('fa-eye-slash');
            wrongPwdConfirm.attr('type', 'password');
        }
    });
});


