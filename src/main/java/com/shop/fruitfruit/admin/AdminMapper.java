package com.shop.fruitfruit.admin;

import org.apache.ibatis.annotations.Mapper;

import java.util.HashMap;
import java.util.List;

@Mapper
public interface AdminMapper {
    /**
     * @author 황호준
     *
     * 관리자 로그인 check
     *
     */
    HashMap<String, Object> loginUserChk(String id);

    /**
     * @author 황호준
     *
     * Product 테이블에 삽입
     *
     */
    void insertProduct(HashMap<String, Object> paramMap);

    /**
     * @author 황호준
     *
     * 상품이름 기준으로 productId 검색
     *
     */
    int selectProductByProductName(String productName);

    /**
     * @author 황호준
     *
     * Image 테이블에 삽입
     *
     */
    void insertProductImage(List<HashMap<String, Object>> paramMapList);

    /**
     * @author 황호준
     *
     * 상품 전체 List
     *
     */
    public List<HashMap<String, Object>> selectAllProduct();

    public List<HashMap<String, Object>> selectProductByCondition(HashMap<String, Object> paramMap);

    void updateSaleStatusDate(HashMap<String, Object> paramMap);

    HashMap<String, Object> updatedSaleStatusDate(HashMap<String, Object> paramMap);

    HashMap<String, Object> selectProductbyProductId(int productId);

    List<HashMap<String, Object>> selectPicturebyProductId(int productId);

    void updateProduct(HashMap<String, Object> paramMap);

    void updateSalectedSaleStop(HashMap<String, Object> paramMap);

    List<HashMap<String, Object>> selectSaleStopProducts(HashMap<String, Object> paramMap);

    List<HashMap<String, Object>> selectReview(HashMap<String, Object> paramMap);

    void insertReviewReply(HashMap<String, Object> paramMap);

    void updateReviewStatus(HashMap<String, Object> paramMap);

    HashMap<String, Object> countReview();

    int countSearchReview(HashMap<String, Object> paramMap);
}
