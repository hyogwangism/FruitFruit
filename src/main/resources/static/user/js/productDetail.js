$(document).ready(function() {
    const quantityInput = $('#quantityInput');

    $('.quantityMinusBtn').on('click', function() {
        let currentValue = parseInt(quantityInput.val());
        console.log("커밸마전:"+currentValue);
        if (currentValue > 1) {
            quantityInput.val(currentValue - 1);
        }
        console.log("커밸마후:"+currentValue);
    });

    $('.quantityPlusBtn').on('click', function() {
        let currentValue = parseInt(quantityInput.val());
        console.log("커밸플전:"+currentValue);
        quantityInput.val(currentValue + 1);
        console.log("커밸플후:"+currentValue);
    });
});

$(document).ready(function (){
    let productId, userIdNo;
    $(document).on('click', '#detailLike', function (){
        productId = $('#productId').val();
        userIdNo = $('#userIdNo').val();
        sendAxiosRequest_detailPage();
    });

    function sendAxiosRequest_detailPage() {
        axios({
            method: 'post',
            url: '/user/detailLikeAxios',
            data: {
                "productLikeId": productId,
                "USER_ID_NO" : userIdNo
            },
            dataType: "JSON",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            const paramMap = res.data;
            JSON.stringify('파람쓰:'+paramMap);

            if (Object.keys(paramMap).length === 0) {
                alert('로그인이 필요한 서비스 입니다.');
                location.href = 'user/login';
            } else {
                const isLiked = paramMap.isLiked;

                const detailLikeElement = $('#detailLike');
                if (isLiked) {
                    detailLikeElement.addClass('red__heart').removeClass('material-symbols-outlined');
                } else {
                    detailLikeElement.removeClass('red__heart').addClass('material-symbols-outlined');
                }
            }
        });
    }

})

