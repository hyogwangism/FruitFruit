package com.shop.fruitfruit.user;

import lombok.RequiredArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.net.http.HttpRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService implements UserMapper {

    private final UserMapper userMapper;

    /*
     * 회원 Join 로직
     */
    public void JoinMethod(HashMap<String, Object> paramMap) {
        //사용자 입력비번 암호화
        String BcrypPwd = BCrypt.hashpw(paramMap.get("pw").toString(), BCrypt.gensalt());
        //암호화 비번 HashMap에 추가
        paramMap.put("pw", BcrypPwd);
        //회원정보 Insert
        userMapper.insertJoin(paramMap);
        //회원 ID기준 정보 Select
        HashMap<String, Object> selectUserMapResult = userMapper.selectUser(paramMap);
        //가져온 정보중 USER_ID_NO를 HashMap에 추가
        paramMap.put("USER_ID_NO", selectUserMapResult.get("USER_ID_NO"));
        //회원기준 약관동의 여부 Insert
        userMapper.insertTerm(paramMap);
    }

    @Override
    public void insertJoin(HashMap<String, Object> paramMap) {}

    @Override
    public HashMap<String, Object> selectUser(HashMap<String, Object> paramMap) {
        return userMapper.selectUser(paramMap);
    }

    @Override
    public void insertTerm(HashMap<String, Object> paramMap) {}

    @Override
    public HashMap<String, Object> joinNameChk(String name) {
        return userMapper.joinNameChk(name);
    }

    @Override
    public void updatePw(HashMap<String, Object> updateMap) {
        String newpw = BCrypt.hashpw(updateMap.get("newpw").toString(), BCrypt.gensalt());
        System.out.println("서비스newpw: " + newpw);
        updateMap.put("newpw", newpw);
        userMapper.updatePw(updateMap);

    }

    @Override
    public HashMap<String, Object> loginUserChk(String id) {
        return userMapper.loginUserChk(id);
    }



}
