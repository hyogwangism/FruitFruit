$(document).ready(function() {
    // 첫 번째 차트를 생성
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['2023. 10. 01', '2023. 10. 02', '2023. 10. 03', '2023. 10. 04', '2023. 10. 05', '2023. 10. 06', '2023. 10. 07'],
            datasets: [
                {
                    label: '일 방문자',
                    data: [100, 207, 190, 150, 130, 250, 150],
                    borderWidth: 2,
                    borderColor: '#36A2EB',
                    backgroundColor: '#9BD0F5'
                },
                {
                    label: '일 회원가입자',
                    data: [52, 55, 45, 30, 55, 148, 55],
                    borderWidth: 2,
                    borderColor: '#FF6384',
                    backgroundColor: '#FFB1C1'
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            maintainAspectRatio: false
        }
    });

    // 두 번째 차트를 생성
    const ctx2 = document.getElementById('myChart2').getContext('2d');
    const myChart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['2023. 10. 01', '2023. 10. 02', '2023. 10. 03', '2023. 10. 04', '2023. 10. 05', '2023. 10. 06', '2023. 10. 07'],
            datasets: [
                {
                    label: '상품등록',  // 다른 레이블로 변경
                    data: [50, 80, 60, 40, 70, 90, 60],  // 다른 데이터로 변경
                    borderWidth: 2,
                    borderColor: '#FF5733',  // 다른 색상으로 변경
                    backgroundColor: '#FFB1C1',  // 다른 배경색으로 변경
                },
                {
                    label: '상품판매',  // 다른 레이블로 변경
                    data: [30, 40, 35, 20, 45, 60, 35],  // 다른 데이터로 변경
                    borderWidth: 2,
                    borderColor: '#FDB307',  // 다른 색상으로 변경
                    backgroundColor: '#FFD700',  // 다른 배경색으로 변경
                },
                {
                    label: '품절상품',  // 다른 레이블로 변경
                    data: [30, 40, 35, 20, 45, 60, 35],  // 다른 데이터로 변경
                    borderWidth: 2,
                    borderColor: '#00CC00',  // 다른 색상으로 변경
                    backgroundColor: '#00FF00',  // 다른 배경색으로 변경
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            maintainAspectRatio: false
        }
    });
});