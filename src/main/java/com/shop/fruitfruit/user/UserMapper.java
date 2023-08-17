package com.shop.fruitfruit.user;

import org.apache.catalina.User;
import org.apache.ibatis.annotations.Mapper;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;

@Mapper
public interface UserMapper {

    void insertJoin(HashMap<String, Object> paramMap);

    HashMap<String, Object> selectUser(HashMap<String, Object> paramMap);

    HashMap<String, Object> loginUserChk(String id);

    void insertTerm(HashMap<String, Object> paramMap);

    HashMap<String, Object> joinNameChk(String name);

    void updatePw(HashMap<String, Object> updateMap);
}
