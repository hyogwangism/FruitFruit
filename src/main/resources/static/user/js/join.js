/**
 *
 */
/**
 * member.js
 */
function join_check(){

    if($.trim($("#id").val())==""){
        alert("이메일 주소를 입력하세요!");
        $("#id").val("").focus();
        return false;
    }

    let email_id = /^[a-zA-Z][\w]+@[a-zA-Z]+\.(com|net|co\.kr|or\.kr)$/;
    if(!email_id.test($("#id").val())) {
        alert("이메일 형식으로 입력해주세요!");
        $("#id").val("").focus();
        return false;
    }

    if($.trim($("#name").val())==""){
        alert("닉네임을 입력하세요!");
        $("#name").val("").focus();
        return false;
    }
    let regexName = /^(?=.*[ㄱ-힣a-zA-Z])[\ㄱ-힣a-zA-Z]{2,}$/;
    if(!regexName.test($("#name").val())){
        alert("닉네임은 2자 이상 입력해주세요!");
        $("#name").val("").focus();
        return false;
    }

    let $pw = $.trim($("#pw").val());
    let $pw2 = $.trim($("#pw2").val());
    if($pw == ""){
        alert("비밀번호를 입력하세요!");
        $("#pw").val("").focus();
        return false;
    }
    if($pw.length<8) {
        alert("비밀번호는 8자 이상 입력 해야합니다.")
        $("#user_pwd").val("").focus();
        return false;

    }
    if($pw2==""){
        alert("비밀번호 확인을 입력하세요!");
        $("#pw2").val("").focus();
        return false;
    }
    if($pw !== $pw2){
        alert("비밀번호가 다릅니다!");
        $("#pw").val("");//비번 입력박스를 초기화
        $("#pw2").val("");
        $("#pw").focus();
        return false;
    }

    if($.trim($("#phone").val())==""){
        alert("폰번호를 입력하세요!");
        $("#phone").val("").focus();
        return false;
    }
    let regexPhone = /^[0-9]{11}$/;
    if(!regexPhone.test($("#phone").val())){
        alert("연락처는 예)010-1234-5678 -> 01012345678로 입력해주세요!");
        $("#phone").val("").focus();
        return false;
    }

    return true;
}

//중복아이디 검색
//ID Check
function id_check() {
    /* copy begin */
    $("#idCheckMsg").hide();
    //아이디 영역을 숨김
    let $id = $.trim($("#id").val());

    //아이디 중복확인
    axios({//$는 jQuery란 뜻. $.ajax 뜻은 jQuery 내의 아작스 실행
        method: "POST", //데이터를 서버로 보내는 방법
        //url: "./member/member_idcheck.jsp",
        url: "/member_idcheck", //url 패턴 매핑주소 경로
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
            $("#pw").focus();
        }
    })
    /* end */
} //end ID Check