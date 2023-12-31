package com.shop.fruitfruit.user;

import org.apache.catalina.User;
import org.apache.ibatis.annotations.Mapper;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Mapper
public interface UserMapper {

    void insertJoin(HashMap<String, Object> paramMap);

    HashMap<String, Object> selectUser(HashMap<String, Object> paramMap);

    HashMap<String, Object> loginUserChk(String id);

    void insertTerm(HashMap<String, Object> paramMap);

    HashMap<String, Object> joinNameChk(String name);

    void updatePw(HashMap<String, Object> updateMap);

    void insertDeliverInfo(HashMap<String, Object> paramMap);

    HashMap<String, Object> selectDeliverId(HashMap<String, Object> paramMap);

    void insertOrderInfo(HashMap<String, Object> paramMap);

    HashMap<String,Object> selectOrderId(HashMap<String, Object> paramMap);

    void insertOrderProduct(HashMap<String, Object> selectMap);

    List<HashMap<String, Object>> selectOrderList(HashMap<String, Object> paramMap);


    HashMap<String,Object> selectOrderProductId(HashMap<String, Object> paramMap);

    void insertUserDeliveryAddressInfo(HashMap<String, Object> paramMap);

    List<HashMap<String, Object>> selectUserDeliveryAddressList(HashMap<String, Object> paramMap);

    int selectUserDeliveryAddressCount(HashMap<String, Object> paramMap);

    void updateUserDeliveryAddressInfo(HashMap<String, Object> paramMap);

    void deleteUserDeliveryAddressInfo(HashMap<String, Object> paramMap);

    void updateUserInfo(HashMap<String, Object> paramMap);

    List<HashMap<String, Object>> getOrdersByUserIdWithinLastMonth(HashMap<String, Object> paramMap);

    void insertReview(HashMap<String, Object> paramMap);

    void updateReviewStatus(HashMap<String, Object> paramMap);

    List<HashMap<String, Object>> reviewListByProductId(HashMap<String, Object> paramMap);

    void updateReview(HashMap<String, Object> paramMap);
}
