package com.shop.fruitfruit.admin;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
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

    @Override
    public List<HashMap<String, Object>> selectAllProduct() {
//        int startPage = Integer.parseInt(paramMap.get("startPage").toString());
//        int pageSize = Integer.parseInt(paramMap.get("pageSize").toString());
//        PageHelper.startPage(1, 5);
        return adminMapper.selectAllProduct();
    }

    @Override
    public List<HashMap<String, Object>> selectProductByCondition(HashMap<String, Object> paramMap) {
        int startPage = Integer.parseInt(paramMap.get("startPage").toString());
        int pageSize = Integer.parseInt(paramMap.get("pageSize").toString());
        PageHelper.startPage(startPage, pageSize);
        return adminMapper.selectProductByCondition(paramMap);
    }

    @Override
    public void updateSaleStatusDate(HashMap<String, Object> paramMap) {
        adminMapper.updateSaleStatusDate(paramMap);
    }

    @Override
    public HashMap<String, Object> updatedSaleStatusDate(HashMap<String, Object> paramMap) {
        return adminMapper.updatedSaleStatusDate(paramMap);
    }

    @Override
    public HashMap<String, Object> selectProductbyProductId(int productId) {
        return adminMapper.selectProductbyProductId(productId);
    }

    @Override
    public List<HashMap<String, Object>> selectPicturebyProductId(int productId) {
        return adminMapper.selectPicturebyProductId(productId);
    }

    @Override
    public void updateProduct(HashMap<String, Object> paramMap) {
        adminMapper.updateProduct(paramMap);
    }

    @Override
    public void updateSalectedSaleStop(HashMap<String, Object> paramMap) {
        adminMapper.updateSalectedSaleStop(paramMap);
    }

    @Override
    public List<HashMap<String, Object>> selectSaleStopProducts(HashMap<String, Object> paramMap) {
        return adminMapper.selectSaleStopProducts(paramMap);
    }

    //리뷰목록 select
    @Override
    public List<HashMap<String, Object>> selectReview(HashMap<String, Object> paramMap) {
        PageHelper.startPage(Integer.parseInt(paramMap.get("startPage").toString()), Integer.parseInt(paramMap.get("pageSize").toString()));
        return adminMapper.selectReview(paramMap);
    }

    //리뷰답변 insert
    @Override
    public void insertReviewReply(HashMap<String, Object> paramMap) {
        adminMapper.insertReviewReply(paramMap);
    }

    //리뷰 답변 상태 update
    @Override
    public void updateReviewStatus(HashMap<String, Object> paramMap) {
        adminMapper.updateReviewStatus(paramMap);
    }

    @Override
    public HashMap<String, Object> countReview() {
        return adminMapper.countReview();
    }

    @Override
    public int countSearchReview(HashMap<String, Object> paramMap) {
        return adminMapper.countSearchReview(paramMap);
    }

    @Override
    public List<HashMap<String, Object>> adminSelectMember(HashMap<String, Object> paramMap) {
        PageHelper.startPage(Integer.parseInt(paramMap.get("startPage").toString()), Integer.parseInt(paramMap.get("pageSize").toString()));
        return adminMapper.adminSelectMember(paramMap);
    }

    @Override
    public HashMap<String, Object> countMember() {
        return adminMapper.countMember();
    }

    @Override
    public int countSearchMember(HashMap<String, Object> paramMap) {
        return adminMapper.countSearchMember(paramMap);
    }

    @Override
    public List<HashMap<String, Object>> adminSelectOrderList(HashMap<String, Object> paramMap) {
        return adminMapper.adminSelectOrderList(paramMap);
    }

    @Override
    public void withdrawalUser(HashMap<String, Object> userIdNoMap) {
        adminMapper.withdrawalUser(userIdNoMap);
    }

    @Override
    public void insertBanner(HashMap<String, Object> paramMap) {
        adminMapper.insertBanner(paramMap);
    }

    public PageInfo<HashMap<String, Object>> userOrderMethod(HashMap<String, Object> paramMap){
        PageHelper.startPage(Integer.parseInt(paramMap.get("startPage").toString()), Integer.parseInt(paramMap.get("pageSize").toString()));

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

}
