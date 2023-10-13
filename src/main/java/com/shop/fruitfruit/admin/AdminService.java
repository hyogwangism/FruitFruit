package com.shop.fruitfruit.admin;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
@EnableScheduling
public class AdminService implements AdminMapper {

    private final AdminMapper adminMapper;
    /**
     * @author 황호준
     *
     * 관리자 로그인 check
     *
     */
    @Override
    public HashMap<String, Object> loginUserChk(String id) {
        return adminMapper.loginUserChk(id);
    }

    /**
     * @author 황호준
     *
     * Product 테이블에 삽입
     *
     */
    @Override
    public void insertProduct(HashMap<String, Object> paramMap) {
        adminMapper.insertProduct(paramMap);
    }

    /**
     * @author 황호준
     *
     * 상품이름 기준으로 productId 검색
     *
     */
    @Override
    public int selectProductByProductName(String productName) {
        return adminMapper.selectProductByProductName(productName);
    }

    /**
     * @author 황호준
     *
     * Image 테이블에 삽입
     *
     */
    @Override
    public void insertProductImage(List<HashMap<String, Object>> paramMapList) {
        adminMapper.insertProductImage(paramMapList);
    }

    /**
     * @author 황호준
     *
     * 전체 상품목록 조회
     *
     */
    @Override
    public List<HashMap<String, Object>> selectAllProduct() {

        return adminMapper.selectAllProduct();
    }

    /**
     * @author 황호준
     *
     * 조건에 따라 상품 목록 조회
     *
     */
    @Override
    public List<HashMap<String, Object>> selectProductByCondition(HashMap<String, Object> paramMap) {
        int startPage = Integer.parseInt(paramMap.get("startPage").toString());
        int pageSize = Integer.parseInt(paramMap.get("pageSize").toString());
        PageHelper.startPage(startPage, pageSize);
        return adminMapper.selectProductByCondition(paramMap);
    }

    /**
     * @author 황호준
     *
     * 상품 판매중지일 update
     */
    @Override
    public void updateSaleStatusDate(HashMap<String, Object> paramMap) {
        adminMapper.updateSaleStatusDate(paramMap);
    }

    /**
     * @author 황호준
     *
     * 중지된 선택상품 정보 select
     */
    @Override
    public HashMap<String, Object> updatedSaleStatusDate(HashMap<String, Object> paramMap) {
        return adminMapper.updatedSaleStatusDate(paramMap);
    }

    /**
     * @author 황호준
     *
     * 상품 아이디 조건 상품 정보 select
     */
    @Override
    public HashMap<String, Object> selectProductbyProductId(int productId) {
        return adminMapper.selectProductbyProductId(productId);
    }

    /**
     * @author 황호준
     *
     * 상품 아이디 조건 상품 이미지 select
     */
    @Override
    public List<HashMap<String, Object>> selectPicturebyProductId(int productId) {
        return adminMapper.selectPicturebyProductId(productId);
    }

    /**
     * @author 황호준
     *
     * 선택된 상품 수정
     */
    @Override
    public void updateProduct(HashMap<String, Object> paramMap) {
        adminMapper.updateProduct(paramMap);
    }

    /**
     * @author 황호준
     *
     * 선택된 상품 판매 중지
     */
    @Override
    public void updateSalectedSaleStop(HashMap<String, Object> paramMap) {
        adminMapper.updateSalectedSaleStop(paramMap);
    }

    /**
     * @author 황호준
     *
     * 판매중지된 상품들 select
     */
    @Override
    public List<HashMap<String, Object>> selectSaleStopProducts(HashMap<String, Object> paramMap) {
        return adminMapper.selectSaleStopProducts(paramMap);
    }

    /**
     * @author 황호준
     *
     * 리뷰목록 select
     */
    @Override
    public List<HashMap<String, Object>> selectReview(HashMap<String, Object> paramMap) {
        PageHelper.startPage(Integer.parseInt(paramMap.get("startPage").toString()), Integer.parseInt(paramMap.get("pageSize").toString()));
        return adminMapper.selectReview(paramMap);
    }

    /**
     * @author 황호준
     *
     * 리뷰답변 insert
     */
    @Override
    public void insertReviewReply(HashMap<String, Object> paramMap) {
        adminMapper.insertReviewReply(paramMap);
    }

    /**
     * @author 황호준
     *
     * 리뷰답변 상태 update
     */
    @Override
    public void updateReviewStatus(HashMap<String, Object> paramMap) {
        adminMapper.updateReviewStatus(paramMap);
    }

    /**
     * @author 황호준
     *
     * 전체 리뷰수 및 답변 개수 카운트
     */
    @Override
    public HashMap<String, Object> countReview() {
        return adminMapper.countReview();
    }

    /**
     * @author 황호준
     *
     * 조건에 따른 검색 후 검색결과 리뷰목록 개수
     */
    @Override
    public int countSearchReview(HashMap<String, Object> paramMap) {
        return adminMapper.countSearchReview(paramMap);
    }

    /**
     * @author 황호준
     *
     * 조건에 따른 회원목록
     */
    @Override
    public List<HashMap<String, Object>> adminSelectMember(HashMap<String, Object> paramMap) {
        PageHelper.startPage(Integer.parseInt(paramMap.get("startPage").toString()), Integer.parseInt(paramMap.get("pageSize").toString()));
        return adminMapper.adminSelectMember(paramMap);
    }

    /**
     * @author 황호준
     *
     * 전체 회원수 및 회원상태별 수
     */
    @Override
    public HashMap<String, Object> countMember() {
        return adminMapper.countMember();
    }

    /**
     * @author 황호준
     *
     * 조건에 따른 검색 후 검색결과 회원목록 개수
     */
    @Override
    public int countSearchMember(HashMap<String, Object> paramMap) {
        return adminMapper.countSearchMember(paramMap);
    }

    /**
     * @author 황호준
     *
     * 특정회원 주문목록
     */
    @Override
    public List<HashMap<String, Object>> adminSelectOrderList(HashMap<String, Object> paramMap) {
        return adminMapper.adminSelectOrderList(paramMap);
    }

    /**
     * @author 황호준
     *
     * 회원 탈퇴
     */
    @Override
    public void withdrawalUser(HashMap<String, Object> userIdNoMap) {
        adminMapper.withdrawalUser(userIdNoMap);
    }

    /**
     * @author 황호준
     *
     * 배너 등록
     */
    @Override
    public void insertBanner(HashMap<String, Object> paramMap) {
        adminMapper.insertBanner(paramMap);
    }

    /**
     * @author 황호준
     *
     * 조건에 따른 배너목록
     */
    @Override
    public List<HashMap<String, Object>> adminSelectBanner(HashMap<String, Object> paramMap) {
        return adminMapper.adminSelectBanner(paramMap);
    }

    /**
     * @author 황호준
     *
     * 전체 배너수 및 배너 게시상태별 수
     */
    @Override
    public HashMap<String, Object> countBanner() {
        return adminMapper.countBanner();
    }

    /**
     * @author 황호준
     *
     * 조건에 따른 검색 후 검색결과 배너목록 개수
     */
    @Override
    public int countSearchBanner(HashMap<String, Object> paramMap) {
        return adminMapper.countSearchBanner(paramMap);
    }


    /**
     * @author 황호준
     *
     * 해당 배너아이디 조건 배너정보 select
     */
    @Override
    public HashMap<String, Object> adminSelectBannerByBannerId(HashMap<String, Object> paramMap) {
        return adminMapper.adminSelectBannerByBannerId(paramMap);
    }

    /**
     * @author 황호준
     *
     * 배너 정보 수정(이미지 변경)
     */
    @Override
    public void editBannerChangeImg(HashMap<String, Object> paramMap) {
        adminMapper.editBannerChangeImg(paramMap);
    }

    /**
     * @author 황호준
     *
     * 배너 정보 수정(이미지 이전과 동일)
     */
    @Override
    public void editBannerNONChangeImg(HashMap<String, Object> paramMap) {
        adminMapper.editBannerNONChangeImg(paramMap);
    }

    /**
     * @author 황호준
     *
     * 선택된 배너 게시중지
     */
    @Override
    public void selectedBannerStop(HashMap<String, Object> paramMap) {
        adminMapper.selectedBannerStop(paramMap);
    }

    /**
     * @author 황호준
     *
     * 게시기간 만료된 배너 목록 select
     */
    @Override
    public List<HashMap<String, Object>> findExpiredBannersAsMap(LocalDate today) {
        return adminMapper.findExpiredBannersAsMap(today);
    }

    /**
     * @author 황호준
     *
     * 조회된 배너 게시상태 '만료'로 update
     */
    @Override
    public void updateBannerStatus(HashMap<String, Object> bannerMap) {
        adminMapper.updateBannerStatus(bannerMap);
    }

    /**
     * @author 황호준
     *
     * 회원 주문목록 메서드
     */
    public PageInfo<HashMap<String, Object>> userOrderMethod(HashMap<String, Object> paramMap){
        PageHelper.startPage(Integer.parseInt(paramMap.get("startPage").toString()), Integer.parseInt(paramMap.get("pageSize").toString()));

        //선택된 유저가 주문한 주문내역
        List<HashMap<String, Object>> userOrderList = adminMapper.adminSelectOrderList(paramMap);

        // 중복된 ORDER_ID 처리
        Map<String, Integer> productCountMap = new HashMap<>();
        for (HashMap<String, Object> order : userOrderList) {
            String orderId = order.get("ORDER_ID").toString();
            productCountMap.put(orderId, productCountMap.getOrDefault(orderId, 0) + 1);
        }

        for (HashMap<String, Object> order : userOrderList) {
            String orderId = order.get("ORDER_ID").toString();
            int orderCount = productCountMap.get(orderId);
            order.put("orderCount", orderCount);
        }

        log.info("유저 오더리스트: " + userOrderList);
        PageInfo<HashMap<String, Object>> pageInfo = new PageInfo<>(userOrderList);

        return pageInfo;

    }


    /**
     * @author 황호준
     *
     * 배너 게시 만료 메서드
     * @Scheduled 어노테이션 사용시 배보상태일때 설정한 시간대에 자동적으로 해당 메서드가 실행됨
     */
    @Scheduled(cron = "0 0 0 * * ?") // 매일 자정에 실행
    public void checkBannerExpiry() {
        LocalDate today = LocalDate.now();

        // 배너 테이블에서 만료일이 오늘보다 이전인 배너를 조회
        List<HashMap<String, Object>> expiredBanners = adminMapper.findExpiredBannersAsMap(today);
        log.info("만료배너 : " + expiredBanners);

        // 조회된 배너를 게시중지 상태로 변경
        for (HashMap<String, Object> bannerMap : expiredBanners) {
            bannerMap.put("status", "만료");
            adminMapper.updateBannerStatus(bannerMap);
        }
    }

}
