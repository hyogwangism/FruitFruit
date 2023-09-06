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
}
