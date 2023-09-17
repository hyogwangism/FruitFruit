package com.shop.fruitfruit.user;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.shop.fruitfruit.admin.AdminService;
import com.shop.fruitfruit.main.MainService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.ibatis.annotations.Param;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
@RequestMapping("user")
@Log4j2
@Transactional
public class UserController {
    private final UserService userService;
    private final AdminService adminService;
    private final MainService mainService;

    private final static String sessionId = "sessionId";


    @RequestMapping("join")
    public String Join(){
      return "user/join" ;
    }

    @RequestMapping("login")
    public String Login(){
        return "user/login";
    }


    @RequestMapping("findPw")
    public String findPw(){
        return "user/findPw";
    }

    @RequestMapping("changePw")
    public String changePw(){
        return "user/changePw";
    }

    /**
     * @author 황호준
     *
     * 회원가입
     *
     * @param {string} 테이블 이름 user
     * {
     *   HashMap<String, Object> paramMap => Input에 입력된 회원정보 저장
     *   JoinMethod =>
     *    1. 사용자 입력비번 암호화
     *    2. 암호화 비번 HashMap에 추가
     *    3. 회원정보 Insert
     *    4. 회원 ID기준 정보 Select
     *    5. 가져온 정보중 USER_ID_NO를 HashMap에 추가
     *    6. 회원기준 약관동의 여부 Insert
     * }
     */
    @RequestMapping("/join_ok")
    @ResponseBody
    public String Join_ok(@RequestBody HashMap<String, Object> paramMap){

        userService.JoinMethod(paramMap);

        return paramMap.get("id").toString();
    }

    /**
     * @author 황호준
     * 회원가입시 확인페이지
     */
    @RequestMapping("joinConfirm")
    public String JoinConfirm(Model model, @RequestParam(value = "userId") String userEmailId){
        log.info("유절네임:"+ userEmailId);
        model.addAttribute("userEmailId", userEmailId);
        return "user/joinConfirm";
    }

    /**
     * @author 황호준
     * 아이디 중복체크
     */
    @RequestMapping("/idChk")
    @ResponseBody
    public int idChk(@RequestBody HashMap<String, Object> paramMap) throws Exception {
        int re = 1;
        String id = paramMap.get("id").toString();
        // userService.loginUserChk(id)에서 반환된 결과를 먼저 검증
        HashMap<String, Object> userMap = userService.loginUserChk(id);

        if (userMap != null && id.equals(userMap.get("USER_EMAIL").toString())) {
            return re;
        } else {
            re = -1;
            return re;
        }
    }

    /**
     * @author 황호준
     * 닉네임 중복체크
     */
    @RequestMapping("/nameChk")
    @ResponseBody
    public int nameChk(Model model, @RequestBody HashMap<String, Object> paramMap) throws Exception {
        String name = paramMap.get("name").toString();
        HashMap<String, Object> userMap = userService.joinNameChk(name);

        if (userMap != null && name.equals(userMap.get("USER_NAME").toString())) {
            return 1;
        } else {
            return -1;
        }
    }

    /**
     * @author 황호준
     * DB에 저장되어진 회원 데이터와 비교해서 로그인
     */
    @RequestMapping("/login_ok")
    public String Login_ok(Model model, HttpServletRequest request, @RequestParam("id") String id, @RequestParam("pw") String pw){
        if(id.equals(userService.loginUserChk(id).get("USER_EMAIL").toString()) && BCrypt.checkpw(pw, userService.loginUserChk(id).get("USER_PWD").toString())){
            HttpSession session = request.getSession();
            session.setAttribute(sessionId, id);
            return "redirect:/";
        } else {
            model.addAttribute("errorMessage", "아이디 또는 비밀번호가 틀렸습니다.");

            return "/user/login";
        }
    }

    /**
     * @author 황호준
     * 로그아웃.
     */
    @RequestMapping("/logout")
    public String logout(HttpServletRequest request){
        // 현재 세션 가져오기 (false: 세션이 없으면 null 반환)
        HttpSession session = request.getSession(false);
        if (session != null) {
            // 세션 무효화 (세션 종료)
            session.invalidate();
        }

        return "redirect:/";
    }

    /**
     * @author 황호준
     * 이메일 아이디 검색
     */
    @RequestMapping("/findPwd")
    @ResponseBody
    public int findPwd(@RequestBody HashMap<String, Object> paramMap){
        String id = paramMap.get("id").toString();
        HashMap<String, Object> ChkMap = userService.loginUserChk(id);

        if(ChkMap != null && id.equals(ChkMap.get("USER_EMAIL").toString())){
            return 1;
        } else {
            return -1;
        }
    }

    /**
     * @author 황호준
     * 비밀번호 변경
     */
    @RequestMapping("/changePwd")
    @ResponseBody
    public int changePwd(@RequestBody HashMap<String, Object> paramMap){
        String newpw = paramMap.get("newpw").toString();
        String id = paramMap.get("id").toString();
        HashMap<String, Object> ChkMap = userService.loginUserChk(id);

        if(ChkMap != null && BCrypt.checkpw(newpw, ChkMap.get("USER_PWD").toString())){
            return -1;
        } else {
            //새 비밀번호 업데이트
            HashMap<String, Object> updateMap = new HashMap<>();
            updateMap.put("id", id);
            updateMap.put("newpw", newpw);
            userService.updatePw(updateMap);
            return 1;
        }
    }

    /**
     * @author 황호준
     * 상품 상세정보
     */

    @RequestMapping("/productDetail")
    public String productDetail(HttpSession session, Model model, @Param(value = "productId") int productId) {
        HashMap<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);

        //세션 아이디가 없을 때 = 로그인 하지 않았을 때
        if (session.getAttribute("sessionId") == null) {

            //상품Id 기준으로 상품 정보 select
            HashMap<String, Object> productDetail = adminService.selectProductbyProductId(productId);
            log.info("프로덕트 아이디기준 상품정보:" + productDetail);

            model.addAttribute("productDetail", productDetail);

            return "user/detail";

            //로그인이 되었을 때
        } else {
            String sessionId = session.getAttribute("sessionId").toString();
            paramMap.put("id", sessionId);
            //상품Id 기준으로 상품정보 select
            HashMap<String, Object> productDetail = adminService.selectProductbyProductId(productId);
            log.info("프로덕트 아이디기준 상품정보:" + productDetail);

            //로그인 된 유저정보 select
            paramMap.putAll(userService.selectUser(paramMap));
            log.info("유저정보 담은 파람맵:"+paramMap);
            log.info("USER_ID_NO입니당:"+Integer.parseInt(paramMap.get("USER_ID_NO").toString()));
            //유저Id 기준으로 찜list select
            List<HashMap<String, Object>> likeList = mainService.selectProductLikeListByUserId(paramMap);

            model.addAttribute("productDetail", productDetail);
            model.addAttribute("likeList", likeList);
            model.addAttribute("isLiked", likeList.stream().anyMatch(like -> like.get("PRODUCT_ID").equals(productDetail.get("PRODUCT_ID"))));
            model.addAttribute("userIdNo", Integer.parseInt(paramMap.get("USER_ID_NO").toString()));


            return "user/detail";
        }

    }

    /**
     * @author 황호준
     * 상세페이지 찜하기 axios
     */
    @RequestMapping("/detailLikeAxios")
    @ResponseBody
    @Transactional
    public HashMap<String, Object> detailLikeAxios(HttpSession session, @RequestBody HashMap<String, Object> paramMap){
        log.info("디텔 아쇽 리퀘스트 파람맵:"+paramMap);

        Boolean isLiked = false;
        //로그인이 되어있는 상태일때
        if(paramMap.get("USER_ID_NO").toString()!=null){

            //sessionId, productId 기준으로 찜목록 select
            if(mainService.selectProductLikeByProductId(paramMap) == null){

                //찜이 되어있지 않은 상태니까 찜하는 메서드 실행
                mainService.insertProductLike(paramMap);

                //찜이 되었으니 다시 sessionId, productId 기준으로 select
                paramMap.putAll(mainService.selectProductLikeByProductId(paramMap));
                log.info("아쇽파람맵1:"+paramMap);

                if(paramMap.get("productLikeId").toString().equals(paramMap.get("PRODUCT_ID").toString())){
                    isLiked = true;
                }

                paramMap.put("isLiked", isLiked);
                return paramMap;


                //sessionId, productId 기준으로 찜목록이 있을때
            } else if(mainService.selectProductLikeByProductId(paramMap) != null) {

                //sessionId, productId 기준으로 찜목록 불러와서 Map에 put
                paramMap.putAll(mainService.selectProductLikeByProductId(paramMap));

                //불러온 찜목록에서 LIKE_ID기준으로 찜 삭제
                mainService.deleteProductLike(paramMap);

                HashMap<String, Object> likeMap = mainService.selectProductLikeByProductId(paramMap);
                if(likeMap == null){
                    isLiked = false;
                    paramMap.put("isLiked", isLiked);
                }
                log.info("라이크맵: "+ likeMap);

                return paramMap;
            }

            //로그인 되어있지 않은 상태일때
        } else if(session.getAttribute("sessionId")==null) {
            //sessionId가 없으면 return할 Map을 비우기 => 로그인되지 않았을때는 찜을 할 수 없어야 하기 때문
            paramMap.clear();
            log.info("제거된 파람맵:"+paramMap);
            return paramMap;
        }

        return null;
    }

    /**
     * @author 황호준
     * 장바구니 페이지 이동
     */
    @RequestMapping("/cart")
    public String cart( Model model, HttpSession session) {
        List<HashMap<String, Object>> cartList = (List<HashMap<String, Object>>) session.getAttribute("cartList");
        log.info("카트리스트확인입니당쓰:"+cartList);
        model.addAttribute("cartList", cartList);
        return "user/cart";
    }

    /**
     * @author 황호준
     * 장바구니페이지에서 쓰일 LocalStorage에 담긴 장바구니 리스트 세션 저장 Axios
     */
    @RequestMapping("cartAxios")
    @ResponseBody
    public String cartAxios(@RequestBody HashMap<String, Object> cartDataMap,  HttpSession session) throws JsonProcessingException {
        log.info("카트 데이터맵: " + cartDataMap);

        String cartData = cartDataMap.get("cartArry").toString();
        log.info("아쇽 카트 맵을 스트링으로 : " + cartData);

        ObjectMapper objectMapper = new ObjectMapper();

        List<HashMap<String, Object>> cartList = objectMapper.readValue(cartData, List.class);

        log.info("액쇼스카트리스트:"+cartList);

        session.setAttribute("cartList", cartList);

        log.info("세션카드: " + session.getAttribute("cartList").toString());

        return "성공";
    }

    /**
     * @author 황호준
     * 장바구니페이지에서 수량 변경시 LocalStorage에 담긴 장바구니 리스트 업데이트 Axios
     */
    @RequestMapping("cartPageUpdateAxios")
    @ResponseBody
    public List<HashMap<String, Object>> cartPageAxios(@RequestBody HashMap<String, Object> cartDataMap, HttpSession session) throws JsonProcessingException {
        log.info("아쇽 카트 데이터맵: " + cartDataMap);
        String cartData = cartDataMap.get("cartArry").toString();
        log.info("아쇽 카트 맵을 스트링으로 : " + cartData);

        ObjectMapper objectMapper = new ObjectMapper();

        List<HashMap<String, Object>> cartList = objectMapper.readValue(cartData, List.class);

        log.info("액쇼스카트리스트:"+cartList);

        session.setAttribute("cartList", cartList);

        List<HashMap<String, Object>> cartSessionList = (List<HashMap<String, Object>>) session.getAttribute("cartList");

        log.info("세션카트리스트임다"+cartSessionList);
        return cartSessionList;
    }

    /**
     * @author 황호준
     * 상품 결제 페이지 이동
     */
    @RequestMapping("payment")
    public String payment (Model model, HttpSession session){
        List<HashMap<String, Object>> paymentCartSessionList = (List<HashMap<String, Object>>) session.getAttribute("paymentCartList");

        model.addAttribute("paymentCartList", paymentCartSessionList);

        log.info("페이세션카리: "+paymentCartSessionList);

        //가장 작은 productId를 가진 배열 출력
        HashMap<String, Object> smallestIdElement = null;
        int smallestId = Integer.MAX_VALUE;

        for (HashMap<String, Object> element : paymentCartSessionList) {
            int productId = (int) element.get("productId");
            if (productId < smallestId) {
                smallestId = productId;
                smallestIdElement = element;
            }
        }

        log.info("가장작은 id 배열: "+ smallestIdElement);

        model.addAttribute("smallestIdElement", smallestIdElement);

        //결제목록 개수
        model.addAttribute("paymentAmount", paymentCartSessionList.size());
        log.info("결제 목록 개수: "+ paymentCartSessionList.size());

        return "user/payment";
    }

    /**
     * @author 황호준
     * 장바구니 페이지에서 체크된 값들만 결제페이지로 이동시키기 위해 Session 저장 Axios
     */
    @RequestMapping("selectedCartIdAxios")
    @ResponseBody
    public String selectedCartIdAxios(@RequestBody HashMap<String, Object> paramMap, HttpSession session) {
        log.info("셀렉트아이디: " + paramMap);
        List<HashMap<String, Object>> cartSessionList = (List<HashMap<String, Object>>) session.getAttribute("cartList");
        log.info("세션 카트아이디입니다:" + cartSessionList);
        List<HashMap<String, Object>> updatedCartList = new ArrayList<>();

        List<String> selectedIdStrings = (List<String>) paramMap.get("selectedIds");
        List<Integer> selectedIds = selectedIdStrings.stream()
                .map(Integer::parseInt)
                .collect(Collectors.toList());

        log.info("셀렉아이디 끄집어내기:" + selectedIds);


        if (cartSessionList != null) {
            for (HashMap<String, Object> updateData : cartSessionList) {
                Integer productId = Integer.parseInt(updateData.get("productId").toString());
                log.info("셀렉아이디 클래스: " + selectedIds.get(0).getClass());
                log.info("포러덕트아디 클래스: " + productId.getClass());

                log.info("포러덕트아디: " + productId);
                log.info("있니?: " + selectedIds.contains(productId));
                if (selectedIds.contains(productId)) {
                    log.info("있니?: " + selectedIds.contains(productId));
                    log.info("세션리스트에 있는 포러덕트아디: " + productId);
                    log.info("세션리스트에 있는 포러덕트아디별 리스트: " + updateData);
                    updatedCartList.add(updateData);
                }
            }
        }

        log.info("업뎃된 카트리스트: " + updatedCartList);

        session.setAttribute("paymentCartList", updatedCartList);

        return "성공";
    }


    /**
     * @author 황호준
     * 상품 결제 완료 페이지 이동
     */
    @RequestMapping("paymentSuccess")
    public String paymentSuccess( Model model,
                                  @RequestParam(value = "orderId") String orderId,
                                  @RequestParam(value = "orderPrice") String orderPrice,
                                  @RequestParam(value = "cardType") String cardType,
                                  @RequestParam(value = "cardMonthlyInstallments") String cardMonthlyInstallments ){

        log.info("orderId : " + orderId);
        log.info("orderPrice : " + orderPrice);
        log.info("cardType : " + cardType);
        log.info("cardMonthlyInstallments : " + cardMonthlyInstallments);

        model.addAttribute("orderId", orderId);
        model.addAttribute("orderPrice", orderPrice);
        model.addAttribute("cardType", cardType);
        model.addAttribute("cardMonthlyInstallments", cardMonthlyInstallments);
        return "user/paymentSuccess";
    }


    /**
     * @author 황호준
     * 결제 완료 페이지 이동
     */
    @RequestMapping("paymentOkAxios")
    @ResponseBody
    public HashMap<String, Object> paymentOkAxios (Model model, HttpSession session, @RequestBody HashMap<String, Object> paramMap){
        if(session.getAttribute("sessionId") != null) {
            paramMap.put("sessionId", session.getAttribute("sessionId").toString());

            List<HashMap<String, Object>> paymentCartSessionList = (List<HashMap<String, Object>>) session.getAttribute("paymentCartList");
            paramMap.put("paymentCartSessionList", paymentCartSessionList);

            paramMap.putAll(userService.OrderMethod(paramMap));
            log.info("결제완료 파람맵:"+paramMap);
            paramMap.put("yesLogin", "yesLogin");
            return paramMap;
        } else if(session.getAttribute("sessionId") == null) {
            paramMap.clear();
            return paramMap;
        }

        return null;
    }

    /**
     * @author 황호준
     * 마이페이지 구매내역 페이지 이동
     */
    @RequestMapping("mypageMain")
    public String mypageMain (Model model, HttpSession session,
                              @RequestParam(defaultValue = "1") int startPage,
                              @RequestParam(defaultValue = "5") int pageSize){
        if(session.getAttribute("sessionId") != null) {
            HashMap<String, Object> paramMap = new HashMap<>();
            paramMap.put("id", session.getAttribute("sessionId").toString());
            paramMap.putAll(userService.selectUser(paramMap));
            paramMap.put("startPage", startPage);
            paramMap.put("pageSize", pageSize);

            List<HashMap<String, Object>> orderList = userService.selectOrderList(paramMap);
            PageInfo<HashMap<String, Object>> pageInfo = new PageInfo<>(orderList);

            model.addAttribute("pageInfo", pageInfo);
            model.addAttribute("USER_ID_NO", Integer.parseInt(paramMap.get("USER_ID_NO").toString()));
            log.info("주문목록: " + orderList);
            log.info("페이지 주문목록: " + pageInfo);
            return "user/mypage";
        } else {
            model.addAttribute("mypageErrorMessage", "로그인이 필요한 서비스입니다.");
            return "user/login";
        }
    }

    /**
     * @author 황호준
     * mypage 구매목록 Axios
     */
    @RequestMapping("mypageAxios")
    @ResponseBody
    public PageInfo<HashMap<String, Object>> mypageAxios (HttpSession session, @RequestBody HashMap<String, Object> paramMap){
        log.info("마이페이지 데이터: " + paramMap);
        paramMap.put("id", session.getAttribute("sessionId").toString());
        paramMap.putAll(userService.selectUser(paramMap));
        List<HashMap<String, Object>> orderList = userService.selectOrderList(paramMap);
        PageInfo<HashMap<String, Object>> pageInfo = new PageInfo<>(orderList);
        log.info("주문목록: " + orderList);
        log.info("페이지 주문목록: " + pageInfo);
        return pageInfo;
    }

    /**
     * @author 황호준
     * 재구매 Axios
     */
    @RequestMapping("rePurchaseAxios")
    @ResponseBody
    public HashMap<String, Object> rePurchaseAxios (HttpSession session, @RequestBody HashMap<String, Object> paramMap){
        if(session.getAttribute("sessionId") != null) {
            paramMap.put("sessionId", session.getAttribute("sessionId").toString());
            paramMap.putAll(userService.selectOrderProductId(paramMap));
            int productId = Integer.parseInt(paramMap.get("PRODUCT_ID").toString());
            paramMap.putAll(adminService.selectProductbyProductId(productId));
            log.info("프로덕트 확인:" + paramMap);
            paramMap.put("yesLogin", "yesLogin");
            return paramMap;
        } else if(session.getAttribute("sessionId") == null) {
            paramMap.clear();
            return paramMap;
        }

        return null;
    }

    /**
     * @author 황호준
     * 마이페이지 배송지관리 페이지 이동
     */
    @RequestMapping("mypageDelivery")
    public String mypageDelivery (Model model, HttpSession session){
        if(session.getAttribute("sessionId") != null) {
            HashMap<String, Object> paramMap = new HashMap<>();
            String sessionId = session.getAttribute("sessionId").toString();
            paramMap.put("id", sessionId);
            paramMap.putAll(userService.selectUser(paramMap));
            log.info("유저 아이디 넘버:"+paramMap);

            List<HashMap<String, Object>> userDeliveryAddressList = userService.selectUserDeliveryAddressList(paramMap);
            log.info("유저 배송지정보:"+ userDeliveryAddressList);

            int addressCount = userService.selectUserDeliveryAddressCount(paramMap);
            log.info("어드카운트:"+addressCount);
            model.addAttribute("userDeliveryAddressList", userDeliveryAddressList);
            model.addAttribute("addressCount", addressCount);
            return "user/mypage_delivery";
        } else {
            model.addAttribute("mypageErrorMessage", "로그인이 필요한 서비스입니다.");
            return "user/login";
        }
    }

    /**
     * @author 황호준
     * 마이페이지 배송지추가 Axios
     */
    @RequestMapping("mypageAddDeliveryAxios")
    @ResponseBody
    public String mypageAddDeliveryAxios (HttpSession session, @RequestBody HashMap<String, Object> paramMap){
        log.info("배달지정보 확인:" + paramMap);
        if(session.getAttribute("sessionId") != null) {
            String sessionId = session.getAttribute("sessionId").toString();
            paramMap.put("id", sessionId);
            paramMap.putAll(userService.selectUser(paramMap));
            userService.insertUserDeliveryAddressInfo(paramMap);
            return "배송지 추가 성공";
        } else {
            return null;
        }
    }

    /**
     * @author 황호준
     * 마이페이지 배송지수정 Axios
     */
    @RequestMapping("mypageEditDeliveryAxios")
    @ResponseBody
    public String mypageEditDeliveryAxios (HttpSession session, @RequestBody HashMap<String, Object> paramMap){
        log.info("수정배달지정보 확인:" + paramMap);
        if(session.getAttribute("sessionId") != null) {
            String sessionId = session.getAttribute("sessionId").toString();
            paramMap.put("id", sessionId);
            paramMap.putAll(userService.selectUser(paramMap));
            userService.updateUserDeliveryAddressInfo(paramMap);
            return "배송지 수정 성공";
        } else {
            return null;
        }
    }

    /**
     * @author 황호준
     * 마이페이지 배송지삭제 Axios
     */
    @RequestMapping("mypageDeleteDeliveryAxios")
    @ResponseBody
    public String mypageDeleteDeliveryAxios (HttpSession session, @RequestBody HashMap<String, Object> paramMap){
        log.info("삭제배달지정보 확인:" + paramMap);
        if(session.getAttribute("sessionId") != null) {
            userService.deleteUserDeliveryAddressInfo(paramMap);
            return "배송지 삭제 성공";
        } else {
            return null;
        }
    }

    /**
     * @author 황호준
     * 마이페이지 회원정보수정 페이지 이동
     */
    @RequestMapping("mypageEdit")
    public String mypageEdit (Model model, HttpSession session){
        if(session.getAttribute("sessionId") != null) {
            return "user/mypageEdit";
        } else {
            model.addAttribute("mypageErrorMessage", "로그인이 필요한 서비스입니다.");
            return "user/login";
        }
    }

    /**
     * @author 황호준
     * 마이페이지 회원정보수정2 페이지 이동전 비번확인 Axios
     */
    @RequestMapping("editPwdChk")
    @ResponseBody
    public HashMap<String, Object> editPwdChk (HttpSession session, @RequestBody HashMap<String, Object> paramMap){
        log.info("비번잘들어오나:"+paramMap);
        if(session.getAttribute("sessionId") != null) {
            String id = session.getAttribute("sessionId").toString();
            if(paramMap.get("editPwdChk")!=null && paramMap.get("wrongPwdConfirm").equals(0)) {
                log.info("여기돈다");
                if (BCrypt.checkpw(paramMap.get("editPwdChk").toString(), userService.loginUserChk(id).get("USER_PWD").toString())) {
                    paramMap.put("equalPwd", "equalPwd");
                } else {
                    paramMap.put("nonEqualPwd", "nonEqualPwd");
                }
            } else if(paramMap.get("editPwdChk")!=null && paramMap.get("wrongPwdConfirm")!=null){
                paramMap.remove("equalPwd", "equalPwd");
                paramMap.remove("nonEqualPwd", "nonEqualPwd");
                if (BCrypt.checkpw(paramMap.get("wrongPwdConfirm").toString(), userService.loginUserChk(id).get("USER_PWD").toString())) {
                    log.info("성공이에요");
                    paramMap.put("equalPwd", "equalPwd");
                } else {
                    log.info("실패에요");
                    paramMap.put("nonEqualPwd", "nonEqualPwd");
                }
            }
        } else {
            paramMap.clear();
        }
        return paramMap;
    }

    /**
     * @author 황호준
     * 마이페이지 회원정보수정2 페이지 이동
     */
    @RequestMapping("mypageEdit2")
    public String mypageEdit2 (Model model, HttpSession session){
        if(session.getAttribute("sessionId") != null) {
            HashMap<String, Object> paramMap = new HashMap<>();
            paramMap.put("id", session.getAttribute("sessionId").toString());
            paramMap.putAll(userService.selectUser(paramMap));
            model.addAttribute("userInfo", paramMap);
            log.info("userInfo: " + paramMap);
            return "user/mypageEdit02";
        } else {
            model.addAttribute("mypageErrorMessage", "로그인이 필요한 서비스입니다.");
            return "user/login";
        }
    }

    /**
     * @author 황호준
     * 수정페이지 닉네임 중복체크
     */
    @RequestMapping("/edit_ok")
    @ResponseBody
    public int edit_ok(@RequestBody HashMap<String, Object> paramMap) throws Exception {
        log.info("수정정보확인:"+paramMap);
        userService.updateUserInfo(paramMap);
        return 1;
    }


    /**
     * @author 황호준
     * 상품 리뷰페이지
     */

    @RequestMapping("/productReview")
    public String productReview(HttpSession session, Model model, @Param(value = "productId") int productId,
                                @RequestParam(defaultValue = "1") int startPage,
                                @RequestParam(defaultValue = "5") int pageSize)
    {

        HashMap<String, Object> paramMap = new HashMap<>();
        paramMap.put("productId", productId);
        paramMap.put("startPage", startPage);
        paramMap.put("pageSize", pageSize);

        //세션 아이디가 없을 때 = 로그인 하지 않았을 때
        if (session.getAttribute("sessionId") == null) {

            //상품Id 기준으로 상품 정보 select
            HashMap<String, Object> productDetail = adminService.selectProductbyProductId(productId);
            log.info("프로덕트 아이디기준 상품정보:" + productDetail);

            model.addAttribute("productDetail", productDetail);

            return "user/review";

            //로그인이 되었을 때
        } else {
            String sessionId = session.getAttribute("sessionId").toString();
            paramMap.put("id", sessionId);
            //상품Id 기준으로 상품정보 select
            HashMap<String, Object> productDetail = adminService.selectProductbyProductId(productId);
            log.info("프로덕트 아이디기준 상품정보:" + productDetail);

            //로그인 된 유저정보 select
            paramMap.putAll(userService.selectUser(paramMap));
            log.info("유저정보 담은 파람맵:"+paramMap);
            log.info("USER_ID_NO입니당:"+Integer.parseInt(paramMap.get("USER_ID_NO").toString()));

            //유저Id 기준으로 찜list select
            List<HashMap<String, Object>> likeList = mainService.selectProductLikeListByUserId(paramMap);

            //리뷰쓸 수 있는지 여부 판단
            /**
             * 1. order테이블에서 유저가 한달내에 주문한 주문 리스트를 뽑는다
             * 2. order_product테이블에서 해당 order_id들로 이루어진 리스트들중 리뷰가 미작성된 리스트들을 뽑아온다.
             */
            List<HashMap<String, Object>> orderListWithinMonth = userService.getOrdersByUserIdWithinLastMonth(paramMap);
            log.info("리뷰 미작성 리스트 : " + orderListWithinMonth);
            log.info("리뷰있니확인:"+orderListWithinMonth.stream().anyMatch(review -> review.get("PRODUCT_ID").equals(productDetail.get("PRODUCT_ID"))));


            /**
             * 3. 리스트들중 현재 페이지의 product_id를 확인하여 있으면 해당 HashMap을 model로 보낸다.
             */
            Map<String, Object> filteredMap = new HashMap<>();

            // 주문 목록에서 productId와 일치하는 주문을 필터링
            for (Map<String, Object> order : orderListWithinMonth) {
                int orderProductId = Integer.parseInt(order.get("PRODUCT_ID").toString());
                if (orderProductId == Integer.parseInt(productDetail.get("PRODUCT_ID").toString())) {
                    filteredMap.putAll(order);
                }
            }

            log.info("상품아이디 맞는거 filteredMap:"+filteredMap);

            /**
             * 해당페이지 리뷰에 대한 관리자 답글들 select
             * 1. 해당 Product_ID에 달린 review 리스트 가져오기
             * 2. 리뷰 리스트중 ID에 맞는 답글들 찾기
             */
            List<HashMap<String,Object>> reviewList = userService.reviewListByProductId(paramMap);
            log.info("리뷰리스트: " + reviewList);
            log.info("유저아이디넘버:"+Integer.parseInt(paramMap.get("USER_ID_NO").toString()));

            PageInfo<HashMap<String,Object>> reviewPageInfo = new PageInfo<>(reviewList);

            model.addAttribute("userIdNo", Integer.parseInt(paramMap.get("USER_ID_NO").toString()));
            model.addAttribute("productDetail", productDetail);
            model.addAttribute("likeList", likeList);
            model.addAttribute("isLiked", likeList.stream().anyMatch(like -> like.get("PRODUCT_ID").equals(productDetail.get("PRODUCT_ID"))));
            model.addAttribute("isReviewed", orderListWithinMonth.stream().anyMatch(review -> review.get("PRODUCT_ID").equals(productDetail.get("PRODUCT_ID"))));

            if(filteredMap.isEmpty()) {
                model.addAttribute("filteredMap", null);
            } else {
                model.addAttribute("filteredMap", filteredMap);
            }

            model.addAttribute("reviewPageInfo", reviewPageInfo);


            return "user/review";
        }

    }

    /**
     * @author 황호준
     * 리뷰등록 Axios
     */
    @RequestMapping("/review_ok")
    @ResponseBody
    public int review_ok(@RequestBody HashMap<String, Object> paramMap){
        log.info("리뷰정보확인:"+paramMap);
        //상품리뷰 등록
        userService.insertReview(paramMap);
        //등록한 주문상품 작성완료로 업데이트
        userService.updateReviewStatus(paramMap);
        return 1;
    }

    /**
     * @author 황호준
     * 리뷰수정 Axios
     */
    @RequestMapping("/review_edit_ok")
    @ResponseBody
    public int review_edit_ok(@RequestBody HashMap<String, Object> paramMap){
        log.info("리뷰정보확인:"+paramMap);
        //상품리뷰 등록
        userService.updateReview(paramMap);
        return 1;
    }

    @RequestMapping("reviewPageAxios")
    @ResponseBody
    public PageInfo<HashMap<String, Object>> reviewPageAxios (@RequestBody HashMap<String, Object> paramMap){
        List<HashMap<String,Object>> reviewList = userService.reviewListByProductId(paramMap);
        log.info("리뷰리스트아쇽: " + reviewList);

        PageInfo<HashMap<String,Object>> reviewPageInfo = new PageInfo<>(reviewList);
        return reviewPageInfo;
    }
}
