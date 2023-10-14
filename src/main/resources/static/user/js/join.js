/**
 * @author 황호준
 * 회원가입 유효성 검증
 */
//유효성 검증
$(document).on('click', '#JoinBtn', () => {
    let $id = $.trim($("#id").val());
    if ($id == "") {
        // 아이디를 입력하지 않은 경우 모달창 띄우기
        $(".txt04").show();
        $("#errorMsg").text("아이디를 입력하셔야 합니다.");
        $("#id").val('').focus();
        return false;
    }

    let $name = $.trim($("#name").val());
    if ($name == "") {
        // 아이디를 입력하지 않은 경우 모달창 띄우기
        $(".txt04").show();
        $("#errorMsg").text("닉네임을 입력하셔야 합니다.");
        $("#name").val('').focus();
        return false;
    }

    let $pw = $.trim($("#pw").val());
    if ($pw == "") {
        // 아이디를 입력하지 않은 경우 모달창 띄우기
        $(".txt04").show();
        $("#errorMsg").text("비밀번호를 입력하셔야 합니다.");
        $("#pw").val('').focus();
        return false;
    }

    let $pw2 = $.trim($("#pw2").val());
    if ($pw2 == "") {
        // 아이디를 입력하지 않은 경우 모달창 띄우기
        $(".txt04").show();
        $("#errorMsg").text("비밀번호 확인을 입력하셔야 합니다.");
        $("#pw2").val('').focus();
        return false;
    }

    if($pw != $pw2){
        $(".txt04").show();
        $("#errorMsg").text("비밀번호가 일치하지 않습니다.");
        $("#pw2").val('').focus();
        return false;
    }

    let $phone = $.trim($("#phone").val());
    if ($phone == "") {
        // 아이디를 입력하지 않은 경우 모달창 띄우기
        $(".txt04").show();
        $("#errorMsg").text("연락처를 입력하셔야 합니다.");
        $("#phone").val('').focus();
        return false;
    }

    let email_id = /^[a-zA-Z][\w]+@[a-zA-Z]+\.(com|net|co\.kr|or\.kr)$/;
    if(!email_id.test($("#id").val())) {
        alert("이메일 형식으로 입력해주세요!");
        $("#id").val("").focus();
        return false;
    }

    let regexName = /^(?=.*[ㄱ-힣a-zA-Z])[\ㄱ-힣a-zA-Z]{2,}$/;
    if(!regexName.test($("#name").val())){
        alert("닉네임은 2자 이상 입력해주세요!");
        $("#name").val("").focus();
        return false;
    }

    if($pw.length<8) {
        alert("비밀번호는 8자 이상 입력 해야합니다.")
        $("#pw").val("").focus();
        return false;
    }

    if($pw !== $pw2){
        alert("비밀번호가 다릅니다!");
        $("#pw").val("");//비번 입력박스를 초기화
        $("#pw2").val("");
        $("#pw").focus();
        return false;
    }

    let regexPassword = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\\\|\[\]{};:'",.<>\/?])(?!.*\s).{8,20}$/;
    if(!regexPassword.test($("#pw").val())) {
        alert("영문, 숫자, 특수문자를 포함하여 입력해주세요!");
        $("#pw").val("").focus();
        return false;
    }

    let regexPhone = /^[0-9]{11}$/;
    if(!regexPhone.test($("#phone").val())){
        alert("연락처는 예)010-1234-5678 -> 01012345678로 입력해주세요!");
        $("#phone").val("").focus();
        return false;
    }

    if (!$("#chk2").prop("checked")) {
        $(".txt04").show();
        $("#errorMsg").text("필수항목에 체크하셔야 합니다");
        return false;
    }

    if (!$("#chk3").prop("checked")) {
        $(".txt04").show();
        $("#errorMsg").text("필수항목에 체크하셔야 합니다");
        return false;
    }

    if (!$("#chk4").prop("checked")) {
        $(".txt04").show();
        $("#errorMsg").text("필수항목에 체크하셔야 합니다");
        return false;
    }

    return submitForm();
});


/**
 * @author 황호준
 * 중복아이디 검색
 */
$(document).on('click', '#idChkBtn', () => {

    /* copy begin */
    $("#idCheckMsg").hide();
    //아이디 영역을 숨김
    let $id = $.trim($("#id").val());
    if ($id == "") {
        // 아이디를 입력하지 않은 경우 모달창 띄우기
        $(".txt04").show();
        $("#errorMsg").text("아이디를 입력하셔야 합니다.");
        $("#id").val('').focus();
        return false;
    } else {

    //아이디 중복확인
    axios({//$는 jQuery란 뜻. $.ajax 뜻은 jQuery 내의 아작스 실행
        method: "POST", //데이터를 서버로 보내는 방법
        url: "/user/idChk", //url 패턴 매핑주소 경로
        data: { "id": $id }, //좌측 id 피라미터 이름에 우측 $user_id변수값을 저장
        dataType: "json", //서버의 실행된 결과값을 사용자로 받아오는 자료형
    }).then(res => {
        //서버 데이터를 data 변수에 저장
        let $newtext;
        if (res.data === 1) {//중복 아이디가 있다면
            $newtext = '<font color="red" size="3"><b>중복 아이디입니다.</b></font>';
            $("#idCheckMsg").text('');
            $("#idCheckMsg").show();
            $("#idCheckMsg").append($newtext);
            $("#id").val('').focus();
            return false;

        } else {//중복 아이디가 아니면
            $newtext = '<font color="blue" size="3"><b>사용가능한 아이디입니다.</b></font>';
            $("#idCheckMsg").text('');
            $("#idCheckMsg").show();
            $("#idCheckMsg").append($newtext);
            $("#name").focus();
        }
    })
    }
}); //end ID Check

/**
 * @author 황호준
 * 중복닉네임 검색
 */
$(document).on('click', '#nameChkBtn', () => {

    /* copy begin */
    $("#nameCheckMsg").hide();
    //아이디 영역을 숨김
    let $id = $.trim($("#id").val());
    let $name = $.trim($("#name").val());
    if ($name == "") {
        // 아이디를 입력하지 않은 경우 모달창 띄우기
        $(".txt04").show();
        $("#errorMsg").text("닉네임을 입력하셔야 합니다.");
        $("#name").val('').focus();
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
}); //end ID Check


/**
 * @author 황호준
 * 회원가입 버튼클릭시 Axios 함수
 */
function submitForm() {

    const formData = {
        "id": $.trim($("#id").val()),
        "name": $.trim($("#name").val()),
        "pw": $.trim($("#pw").val()),
        "phone": $.trim($("#phone").val()),
        "marketing": $("#chk5").val(),
        "chk5_Checked": $("#chk5").prop("checked") ? 'T' : 'F',
        "personal_Info": $("#chk6").val(),
        "chk6_Checked": $("#chk6").prop("checked") ? 'T' : 'F'
    };

    axios({
        method: 'POST',
        url: '/user/join_ok',
        data: formData,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        location.href='/user/joinConfirm?userId=' + res.data;
    });
}

/**
 * @author 황호준
 * 약관동의 모두체크
 */
$(document).ready(function() {
    // chk1 체크박스를 클릭했을 때 이벤트 핸들러 추가
    $("#chk1").click(function() {
        // chk1 체크박스의 체크 여부에 따라 모든 체크박스 상태를 변경
        const isChecked = $(this).prop("checked");
        $("input[type='checkbox'][name='status']").prop("checked", isChecked);
    });
});

// 추가된 버튼 클릭 이벤트 처리
$(document).ready(function() {
    $("#confirmButton").on("click", function() {
        $(".txt04").hide(); // 확인 버튼 클릭 시 모달창 숨기기 (display: none;)
    });
});

/**
 * @author 황호준
 * 비밀번호, 비밀번호 확인 입력필드에 입력된값 확인하고 일치여부
 */
$(document).ready(function() {
    // #pw2 입력박스에서 포커스를 벗어났을 때 이벤트 처리
    $("#pw2").on("blur", function() {
        let $pw = $.trim($("#pw").val());
        let $pw2 = $.trim($(this).val());

        // 비밀번호와 비밀번호 확인 값이 다른 경우 메시지 표시
        if ($pw !== $pw2) {
            $("#PwdErrorMessage").text("비밀번호가 일치하지 않습니다.").show();
        } else {
            $("#PwdErrorMessage").hide();
        }
    });
});

/**
 * @author 황호준
 * 연락처 입력 하지않을시
 */
$(document).ready(function() {
    // #pw2 입력박스에서 포커스를 벗어났을 때 이벤트 처리
    $("#phone").on("blur", function() {
        let $phone = $.trim($(this).val());

        // 비밀번호와 비밀번호 확인 값이 다른 경우 메시지 표시
        if ($phone == "") {
            $("#PhoneErrorMessage").text("연락처를 입력하세요.").show();
        } else {
            $("#PhoneErrorMessage").hide();
        }
    });
});