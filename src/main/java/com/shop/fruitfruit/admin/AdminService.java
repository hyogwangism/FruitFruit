package com.shop.fruitfruit.admin;

import com.github.pagehelper.PageHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
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


}
