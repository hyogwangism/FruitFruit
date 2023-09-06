package com.shop.fruitfruit.user;

import lombok.RequiredArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
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

    public HashMap<String, Object> OrderMethod(HashMap<String, Object> paramMap){

        /**
         * 1. SessionId를 기준으로 유저 검색을 해서 USER_ID_NO를 가져온다
         * 2. paramMap에 담긴 정보들로 배송자 정보를 저장한다.
         * 3. 저장된 배송자정보중 user_id_no를 기준으로 user_deliver_info 테이블에서 가장 최근에 주문한 Deliver_ID를 가져온다. -> deliver_id를 paramMap에 put
         * 4. paramMap에 담긴 결제정보(deliver_id, 카드결제, 개인카드/법인카드, 카드사, 총 가격, 주문날짜, 결제상태)를 order_table에 저장한다.
         * 5. 저장된 Order_table에서 deliver_id를 기준으로 ORDER_TABLE에서 ORDER_ID를 가져온다 -> ORDER_ID를 paramMap에 PUT
         * 6. ORDER_PRODUCT테이블에 상세 주문정보(ORDER_ID, PRODUCT_ID, PRODUCT_QUANTITY, PRODUCT_PRICE(구매당시 해당물폼 총가격), REVIEW_STATUS)를 저장
         */

            paramMap.put("id", paramMap.get("sessionId").toString());
            //sessionId기준 유저검색해서 저장
            paramMap.putAll(userMapper.selectUser(paramMap));

            //USER_ID_NO를 기준으로 배송지 정보 저장
            userMapper.insertDeliverInfo(paramMap);

            //저장된 배송자정보중 USER_ID_NO 기준으로 최근 저장된 DELIVER_ID 가져와서 저장
            paramMap.putAll(userMapper.selectDeliverId(paramMap));

            //DELIVER_ID 기준으로 주문 정보 저장
            userMapper.insertOrderInfo(paramMap);

            //

            //DELIVER_ID 기준 ORDER_ID SELECT
            paramMap.putAll(userMapper.selectOrderId(paramMap));

            List<HashMap<String, Object>> paymentCartSessionList = (List<HashMap<String,Object>>) paramMap.get("paymentCartSessionList");


            for(HashMap<String, Object> selectMap : paymentCartSessionList){
                selectMap.put("ORDER_ID", paramMap.get("ORDER_ID").toString());
                userMapper.insertOrderProduct(selectMap);
            }

            return paramMap;
    }

    @Override
    public void insertJoin(HashMap<String, Object> paramMap) {
        userMapper.insertJoin(paramMap);
    }

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


    /**
     * 배송지 정보 저장
     */
    @Override
    public void insertDeliverInfo(HashMap<String, Object> paramMap) {
        userMapper.insertDeliverInfo(paramMap);
    }

    @Override
    public HashMap<String, Object> selectDeliverId(HashMap<String, Object> paramMap) {
       return userMapper.selectDeliverId(paramMap);
    }

    @Override
    public void insertOrderInfo(HashMap<String, Object> paramMap) {

    }

    @Override
    public HashMap<String, Object> selectOrderId(HashMap<String, Object> paramMap) {
        return userMapper.selectOrderId(paramMap);
    }

    @Override
    public void insertOrderProduct(HashMap<String, Object> selectMap) {
        userMapper.insertOrderProduct(selectMap);
    }


}
