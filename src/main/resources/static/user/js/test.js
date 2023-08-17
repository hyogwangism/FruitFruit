// $(document).on('click', '#userIcon', () => {
//
//     //axios를 사용해서 서버로 POST 요청을 보냄
//     axios({
//         method: "POST",
//         url: "alert", //"alert" URL로 요청을 보냄
//         data: {
//             "title": "title 테스트", //전송할 데이터의 제목 필드 설정
//             "msg": "msg 테스트" //전송할 데이터의 메시지 필드 설정
//         },
//         dataType: "JSON", // 응답 데이터 타입을 JSON으로 설정
//         header: {"Content-Type" : "application/json"} // 요청 헤더에 JSON 형식으로 데이터를 보냄
//
//     }).then(res => {
//         // 서버로부터의 응답 데이터는 res변수에 저장
//
//         // 응답데이터(res.data)에 포함된 "alert.html"을 페이지에 추가
//         $("body").append(res.data);
//     });
// });

$(document).on('click', '#userIcon', () => {

    //axios를 사용해서 서버로 POST 요청을 보냄
    axios({
        method: "POST",
        url: "/user/testSelect", //"alert" URL로 요청을 보냄
        header: {"Content-Type" : "application/json"} // 요청 헤더에 JSON 형식으로 데이터를 보냄

    }).then(res => {
        // 서버로부터의 응답 데이터는 res변수에 저장
        const RD = res.data;
        console.log(res.data);
        // 응답데이터(res.data)에 포함된 "alert.html"을 페이지에 추가
        for (let i=0; i<RD.length; i++){
        $("body").append('<br><br>' + RD[i].nickname+ '<br><br>');
        $("body").append(' ' + RD[i].username + '<br><br>');
        }
    });
});

$(document).on('click', '#getBtn', () =>{
    //페이지에서 "txt04" 클래스를 가진 요소를 모두 제거함
  location.href = "/user/testGet"
});

// #confirmBtn 요소를  클릭했을 때의 이벤트 핸들러 생성
// $(document).on('click', '#confirmBtn', () =>{
//     //페이지에서 "txt04" 클래스를 가진 요소를 모두 제거함
//    $('.text04').remove();
// });