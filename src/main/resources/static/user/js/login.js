$(document).ready(function() {
    // 눈표시 클릭 시 패스워드 보이기
    $('#togglePassword').on('click', function() {
        let pwInput = $('#pw');

        if (pwInput.attr('type') === 'password') {
            $(this).find('.fa-eye-slash').removeClass('fa-eye-slash').addClass('fa-eye');
            pwInput.attr('type', 'text');
        } else {
            $(this).find('.fa-eye').removeClass('fa-eye').addClass('fa-eye-slash');
            pwInput.attr('type', 'password');
        }
    });
});